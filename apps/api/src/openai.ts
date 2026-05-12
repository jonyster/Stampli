import OpenAI from "openai";
import type { ZodSchema } from "zod";

export class AgentExecutionError extends Error {
  constructor(
    message: string,
    public readonly kind: "transient" | "llm_recoverable" | "user_fixable",
  ) {
    super(message);
  }
}

let client: OpenAI | undefined;

function getClient() {
  if (!client) {
    if (!process.env.OPENAI_API_KEY) {
      throw new AgentExecutionError("OPENAI_API_KEY is required when DEMO_MODE=false", "user_fixable");
    }

    client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  }

  return client;
}

export async function runStructuredPrompt<T>(options: {
  model: string;
  system: string;
  user: unknown;
  schema: ZodSchema<T>;
  repairLabel: string;
}): Promise<T> {
  const payload = JSON.stringify(options.user, null, 2);

  return retryTransient(async () => {
    const firstResponse = await completeJson(options.model, options.system, payload);
    const parsed = options.schema.safeParse(firstResponse);
    if (parsed.success) return parsed.data;

    const repairResponse = await completeJson(
      options.model,
      `${options.system}\n\nYour prior response failed schema validation. Return only valid JSON matching this task. Validation issue: ${parsed.error.message}`,
      payload,
    );
    const repaired = options.schema.safeParse(repairResponse);
    if (!repaired.success) {
      throw new AgentExecutionError(`${options.repairLabel} returned invalid JSON after repair`, "llm_recoverable");
    }

    return repaired.data;
  });
}

async function completeJson(model: string, system: string, user: string) {
  const response = await getClient().chat.completions.create({
    model,
    temperature: 0.1,
    response_format: { type: "json_object" },
    messages: [
      { role: "system", content: system },
      { role: "user", content: user },
    ],
  });

  const content = response.choices[0]?.message.content;
  if (!content) {
    throw new AgentExecutionError("OpenAI returned an empty response", "transient");
  }

  try {
    return JSON.parse(content) as unknown;
  } catch (error) {
    throw new AgentExecutionError(`OpenAI returned non-JSON content: ${(error as Error).message}`, "llm_recoverable");
  }
}

async function retryTransient<T>(operation: () => Promise<T>, attempts = 2): Promise<T> {
  let lastError: unknown;

  for (let index = 0; index <= attempts; index += 1) {
    try {
      return await operation();
    } catch (error) {
      lastError = error;
      if (error instanceof AgentExecutionError && error.kind !== "transient") {
        throw error;
      }

      if (index < attempts) {
        await new Promise((resolve) => setTimeout(resolve, 400 * (index + 1)));
      }
    }
  }

  throw lastError;
}

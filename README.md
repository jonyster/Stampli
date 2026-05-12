# Agentic Approval Workflow

Full-stack demo for the Agentic Approval Workflow PRD.

## Stack

- React + Vite + TypeScript frontend in `apps/web`
- Express + TypeScript API in `apps/api`
- Shared hardcoded AP/P2P seed data in `packages/seed-data`
- OpenAI-backed Council of Agents with `DEMO_MODE=true` fallback for offline demos

## Local setup

```bash
pnpm install
cp .env.example .env
pnpm dev
```

Open the web app at `http://localhost:5173`. The API runs on `http://localhost:3001`.

Use `DEMO_MODE=true` for canned agent responses without an OpenAI API key. Set `DEMO_MODE=false` and provide `OPENAI_API_KEY` to use live model calls.

Demo mode now includes 10 selectable invoices with aligned PO, contract, receipt, and vendor/W-9 context so users can review varied outcomes in a fully offline demo.

## Deployment

### API on Railway

Set these Railway variables:

- `DEMO_MODE=true` (recommended for demo deployment)
- `OPENAI_API_KEY` (optional when `DEMO_MODE=true`; required when `DEMO_MODE=false`)
- `CORS_ALLOWED_ORIGINS` (comma-separated literal origins or regexes)

Railway start command:

```bash
pnpm start:api
```

### Web on Vercel

Set this Vercel variable:

- `VITE_API_URL` pointing to the Railway API URL

Vercel build command:

```bash
pnpm build:web
```

Vercel output directory:

```text
apps/web/dist
```

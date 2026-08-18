# WinBid AI

WinBid AI is a web-based work-winning assistant that helps employees find process guidance, tools, templates, training material, and named contacts through natural language chat.

The product is designed to work across all common device types and operating systems, including desktop, laptop, tablet, and mobile, through any modern browser.

## Project Goal

The goal of WinBid AI is to reduce time spent searching across fragmented internal systems by giving colleagues a single conversational entry point for work-winning knowledge and resources.

It supports:

- Process guidance and tool Q&A
- Direct links to official templates and source documents
- Related training video discovery
- Multi-turn follow-up questions in the same thread
- Out-of-scope signposting to human contacts

## Scope Boundaries

### In Scope

- Questions about work-winning processes
- Questions about work-winning tools, training, and guidance
- Links to relevant internal resources
- Routing to the right contact when more information is needed
- Responses grounded in internal content rather than generic internet knowledge

### Out of Scope

- Generic web Q&A
- Previous bid responses
- Pre-to-bid scoring
- General industry best practice outside owned internal content
- Content owned by other teams where signposting is more appropriate

## Key Product Ideas

- ChatGPT-style web UI with a left sidebar for thread history
- Central streaming message feed for answers as they arrive
- Bottom input bar for follow-up questions
- Resource badges for templates and source documents
- Video badges for relevant training clips
- Thread memory retention with a limited expiry window
- Document hash checking to avoid stale content being reused after source updates

## Repository Contents

This repository currently includes:

- `apps/web` - Next.js 14 frontend
- `apps/api` - FastAPI backend
- `infra` - Docker and Nginx deployment files
- `scripts` - ingestion and maintenance scripts
- `.env.example` - local environment template
- `docker-compose.yml` - main local stack definition

## Current Layout

```text
winbid-ai/
|-- apps/
|   |-- web/
|   |   |-- app/
|   |   |   |-- (auth)/login/page.tsx
|   |   |   |-- (dashboard)/analytics/page.tsx
|   |   |   |-- (dashboard)/c/[threadId]/page.tsx
|   |   |   |-- (dashboard)/page.tsx
|   |   |   `-- api/auth/[...nextauth]/route.ts
|   |   |-- lib/
|   |   |   |-- api/sse-client.ts
|   |   |   `-- store/useChatStore.ts
|   |   |-- package.json
|   |   |-- tailwind.config.ts
|   |   `-- tsconfig.json
|   `-- api/
|       |-- app/
|       |   |-- api/v1/
|       |   |   |-- chat.py
|       |   |   |-- feedback.py
|       |   |   `-- threads.py
|       |   |-- agents/
|       |   |   |-- graph.py
|       |   |   |-- state.py
|       |   |   |-- nodes/
|       |   |   |   |-- reasoning.py
|       |   |   |   |-- router.py
|       |   |   |   `-- signpost.py
|       |   |   `-- prompts/
|       |   |       |-- guidance.txt
|       |   |       `-- router.txt
|       |   |-- core/
|       |   |   |-- config.py
|       |   |   |-- logging.py
|       |   |   `-- security.py
|       |   |-- db/
|       |   |   |-- models.py
|       |   |   `-- session.py
|       |   |-- rag/
|       |   |   |-- embeddings.py
|       |   |   |-- hash_engine.py
|       |   |   |-- qdrant_client.py
|       |   |   `-- reranker.py
|       |   |-- services/
|       |   |   |-- doc_parser.py
|       |   |   `-- video_parser.py
|       |   `-- main.py
|       |-- Dockerfile
|       `-- requirements.txt
|-- infra/
|   |-- docker/
|   |   |-- docker-compose.dev.yml
|   |   `-- docker-compose.prod.yml
|   `-- nginx/
|       `-- nginx.conf
|-- scripts/
|   |-- ingest_knowledge_base.py
|   `-- purge_outdated_vectors.py
|-- .env.example
|-- docker-compose.yml
|-- dev_plan.md
|-- upgrade.md
`-- README.md
```

## Local Development

1. Copy the environment template:

```bash
cp .env.example .env
```

2. Fill in the required values in `.env`.

3. Start the local stack:

```bash
docker-compose up -d --build
```

4. Verify services:

```bash
docker-compose ps
```

5. Run database migrations if the backend supports them in your local setup:

```bash
docker-compose exec api alembic upgrade head
```

## Environment Template

The current `.env.example` includes:

```env
GEMINI_API_KEY=
DATABASE_URL=
REDIS_URL=
```

## Implementation Notes

- The repository is currently a scaffolded monorepo with a Next.js frontend and FastAPI backend.
- The README now reflects an all-device web application rather than a device-limited or single-business-only framing.
- The architecture includes document hashing, Redis thread memory, vector search, and SSE-based chat streaming in the target design.

## Deployment Files

- `docker-compose.yml`
- `infra/docker/docker-compose.dev.yml`
- `infra/docker/docker-compose.prod.yml`
- `infra/nginx/nginx.conf`

## Scripts

- `scripts/ingest_knowledge_base.py`
- `scripts/purge_outdated_vectors.py`


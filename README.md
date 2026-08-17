🤖 WinBid AI — Work Winning Process AI Assistant
OS Compatibility Deployment Model Authentication AI Engine

WinBid AI is an internal, web-based conversational assistant designed to help company employees self-serve on work-winning (bidding) processes, tools, templates, and training materials.


**1. Project Overview & Goal**
The goal of WinBid AI is to streamline bidding and work-winning workflows within the enterprise. It delivers an intuitive, chat-based self-service tool for accessing policy information, official templates, and training media.

UI Design: ChatGPT-style Web Interface featuring:
Left Sidebar Navigation for managing chat thread history.
Central Streaming Message Feed for real-time AI responses.
Bottom Input Bar for multi-turn conversational follow-ups.
Resource Link Badges pointing to official templates.
Video Clip Badges displaying relevant training clips.
Operating System Compatibility: 100% OS-Agnostic. Runs in modern web browsers across Windows, macOS, Linux, iOS, and Android with zero desktop software installation.
Deployment Model: On-Premise Docker Container Stack deployed on internal company servers behind the corporate firewall/VPN.
Authentication: Enterprise Single Sign-On (Azure AD / Okta SSO via NextAuth.js).


**2. Core Functionality & Scope Boundaries**
To maintain high data accuracy and prevent policy compliance risks, WinBid AI is built with clear scope boundaries and guardrails.

**🟢 In-Scope Capabilities**

Process & Tool Q&A: Answering questions regarding work-winning processes (e.g., explaining the distinction between Red Reviews and Pink Reviews).
Template Redirection: Directing users to official SharePoint template links (e.g., Answer Plan templates).
Training Clip Search: Surfacing training video clips by extracting scripts from Synthesia MP4 videos.
Conversational Support: Full multi-turn conversational chat and context follow-ups.
Out-of-Scope Signposting: Redirecting questions outside the tool's bounds to named human contacts (e.g., Legal / Department Leads).

**🔴 Out-of-Scope (Guardrailed)**

Generic Web Q&A: Off-topic queries are strictly declined by internal system guardrails.
Historical Bid Data: No access to previous bid responses or pre-to-bid scoring.
Legal Golden Rules: Questions regarding corporate legal guidelines are automatically blocked and signposted to the Legal team.


**3. Key Architectural & Anti-Poisoning Features**
WinBid AI includes mechanisms designed to guarantee correctness and security for enterprise compliance rules.

mermaid
graph TD
    A[SharePoint/Intranet File Updated] --> B[Ingestion Pipeline]
    B --> C{Calculate SHA-256 Hash}
    C -->|Hash Changed| D[Hard-Purge Legacy Chunks]
    C -->|Hash Unchanged| E[Skip Vector Update]
    D --> F[Vector DB Re-Indexing]
    F --> G[Up-to-date Grounding Engine]
Document-Hash Auto-Purge (Anti-Poisoning): When process documents are updated at the same URL on SharePoint or the intranet, the ingestion pipeline calculates a SHA-256 hash. If changes are detected, legacy vector chunks for that URL are immediately hard-purged from the vector database before re-indexing. This prevents outdated policy hallucinations.
14-Day Thread Memory Retirement: Conversation history threads stored in Redis and PostgreSQL automatically expire after 14 days to prevent stale context from interfering with newly updated process rules.
Strict Grounding SLA: Google Vertex AI Enterprise SLA guarantees that all corporate prompts, internal documents, and generated answers remain strictly confidential and are NEVER used to train public AI models.



**4. Production Technology Stack**

| **Component**       |              **Technology**                |          **Role & Architecture**                                                                             |
|---------------------|--------------------------------------------|--------------------------------------------------------------------------------------------------------------|
| Frontend UI         | Next.js 14 AppRouter and auth, Tailwind CSS| ChatGPT-style web workspace with Server-Sent Events (SSE) Streaming API, integrated with Azure AD / Okta SSO.|  
| Backend API Gateway | FastAPI (Python 3.11), Uvicorn             | High-performance async API orchestrating LangGraph Engine agents.                                            |
| Session & Memory    | Local Redis 7 Container                    | Sub-5ms session state and thread memory tracking with a 14-day TTL.                                          |
| Vector Database     | Self-Hosted Qdrant / ChromaDB Container    | Local Rust/Python based vector store indexing processed templates and training context.                      |
| Parser Services     | PyMuPDF, Marker local parser               | Parses PDFs documents locally; Synthesia video script extractor converts MP4 video into searchable   chunks. |
| Context Optimizer   | BGE-Reranker-Large                         | Local PyTorch model running in Python to rank retrieved results for optimal agent context.                   |
| Relational Database | Self-Hosted PostgreSQL 16 Container        | Stores session threads, thumbs up/down (👍/👎) user feedback, adoption telemetry by business unit/geography.|
| AI Reasoning Engine | Google Vertex AI / Gemini Enterprise API   | Gemini 1.5 Flash for sub-300ms intent routing and guardrails; Gemini 1.5 Pro for deep process reasoning.     |
| Observability       | Langfuse Open-Source Telemetry             | Self-hosted dashboard tracking token usage, request latency, and costs internally.                           |
|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|



**5. Repository Directory Layout**

The codebase is organized as a monorepo containing frontend applications, Python backend services, database migrations, and pipeline deployment infrastructure:


**winbid-ai/**
   |
   ├── .github/                            # CI/CD & GitHub Workflows
   │   └── workflows/
   │       ├── ci.yml                      # Linting, type-checking, unit tests
   │       └── cd-deploy.yml               # Automated deployment to internal company server
   ├── apps/                               # Monorepo Application Workspace
   │   ├── web/                            # Next.js 14 Web Frontend (ChatGPT Style)
   │   │   ├── app/                        # App Router (Pages & Layouts)
   │   │   │   ├── (auth)/                 # Login & SSO Callback Pages
   │   │   │   │   └── login/page.tsx      # Azure AD / Okta SSO Login Page
   │   │   │   ├── (dashboard)/            # Authenticated ChatGPT App
   │   │   │   │   ├── c/[threadId]/       # Active conversation thread page
   │   │   │   │   ├── page.tsx            # Main chat workspace landing
   │   │   │   │   └── analytics/          # Usage telemetry & feedback dashboard
   │   │   │   ├── api/                    # NextAuth.js & API Proxy
   │   │   │   │   └── auth/[...nextauth]/ # Azure AD OAuth Provider Config
   │   │   │   └── layout.tsx              # Root Layout with Tailwind & Zustand Store
   │   │   ├── components/                 # UI Components (Atomic Design)
   │   │   │   ├── sidebar/                # SidebarThreadHistory, NewChatButton, UserProfile
   │   │   │   ├── chat/                   # ChatFeed, StreamedMessage, PromptInputBar
   │   │   │   ├── citations/              # TemplateLinkBadge, VideoClipBadge, SourceDocPill
   │   │   │   └── ui/                     # Shadcn UI primitives
   │   │   ├── lib/                        # Client Utilities
   │   │   │   ├── store/                  # Zustand global chat state (`useChatStore.ts`)
   │   │   │   └── api/                    # SSE Streaming client (`sse-client.ts`)
   │   │   ├── package.json
   │   │   ├── tsconfig.json
   │   │   └── tailwind.config.ts
   │   │
   │   └── api/                            # FastAPI Production Python Service
   │       ├── app/
   │       │   ├── main.py                 # FastAPI Gateway Entry Point
   │       │   ├── core/                   # Security & Config
   │       │   │   ├── config.py           # Pydantic Env Settings (Gemini Keys)
   │       │   │   ├── security.py         # Azure AD JWT Token Verifier
   │       │   │   └── logging.py          # Structured JSON Logger
   │       │   ├── agents/                 # Multi-Agent Workflow Engine
   │       │   │   ├── graph.py            # LangGraph / LlamaIndex Workflow Assembler
   │       │   │   ├── state.py            # TypedDict Thread Memory Schema
   │       │   │   ├── nodes/              # Specialized Agent Nodes
   │       │   │   │   ├── router.py       # Node 0: Intent & Guardrail Router (Gemini Flash)
   │       │   │   │   ├── reasoning.py    # Node 1: Process Guidance Reasoning (Gemini Pro)
   │       │   │   │   └── signpost.py     # Node 2: Contact Signpost Router
   │       │   │   └── prompts/            # System Prompt Templates
   │       │   │       ├── router.txt
   │       │   │       └── guidance.txt
   │       │   ├── rag/                    # Retrieval-Augmented Generation Engine
   │       │   │   ├── qdrant_client.py    # Local Qdrant Vector Search Engine
   │       │   │   ├── reranker.py         # Local BGE-Reranker-Large Executor
   │       │   │   ├── hash_engine.py      # SHA-256 Auto-Purge Invalidation Engine
   │       │   │   └── embeddings.py       # Google Vertex AI Embeddings (`text-embedding-004`)
   │       │   ├── services/               # Business Logic Services
   │       │   │   ├── doc_parser.py       # PyMuPDF / Marker Local Parser
   │       │   │   └── video_parser.py     # Synthesia MP4 Script Extractor
   │       │   ├── db/                     # Database Models & Connections
   │       │   │   ├── session.py          # SQLAlchemy Async Engine
   │       │   │   └── models/             # Postgres ORM Models (Threads, Feedback, Logs)
   │       │   └── api/                    # API Version 1 Handlers
   │       │       └── v1/
   │       │           ├── chat.py         # SSE Stream Route (`/api/v1/chat/stream`)
   │       │           ├── threads.py      # Thread History Routes
   │       │           └── feedback.py     # User Feedback Route (👍 / 👎)
   │       ├── alembic/                    # Database Migrations
   │       │   └── versions/               # Migration Scripts
   │       ├── tests/                      # Pytest Suite
   │       ├── requirements.txt            # Python Dependencies
   │       └── Dockerfile                  # API Container Spec
   │
   ├── infra/                              # Infrastructure Configs
   │   ├── nginx/                          # Nginx Reverse Proxy Configs
   │   │   └── nginx.conf                  # SSL Termination & SSE Proxy Rules
   │   └── docker/                         # Container Composition Overrides
   │       ├── docker-compose.prod.yml     # Production Multi-Container Stack
   │       └── docker-compose.dev.yml      # Development Overlay Stack
   │
   ├── scripts/                            # Ops & Ingestion Scripts
   │   ├── ingest_knowledge_base.py        # Vectorize Process Docs & Video Transcripts
   │   └── purge_outdated_vectors.py       # SHA-256 Hash Invalidation Cron Script
   │
   ├── docker-compose.yml                  # Primary Docker Composition File
   ├── .env.example                        # Development Environment Template
   ├── .gitignore
   └── README.md                           # Master Onboarding Guide


**6. Quickstart & Deployment**

**Server Prerequisites**
Operating System: Ubuntu 22.04 LTS / Debian 12 / RHEL 9
Resources: Min 8 vCPUs, 16 GB RAM, 100 GB NVMe SSD
Engine: Docker Engine v24.0+ & Docker Compose v2.20+

**Environment Setup**
Create your local environment configuration file by copying the template:

cp .env.example .env
Configure the following parameters in your .env file:

**env**
# --- GOOGLE VERTEX AI / GEMINI ENTERPRISE CONFIG ---
GEMINI_API_KEY=AIzaSy_YOUR_GEMINI_KEY_HERE
GOOGLE_CLOUD_PROJECT=your-gcp-project-id
GOOGLE_APPLICATION_CREDENTIALS=/path/to/service-account.json

# --- DATABASES & MEMORY CONNECTIONS ---
DATABASE_URL=postgresql://postgres:postgres_password@postgres:5432/winbid_db
REDIS_URL=redis://redis:6379/0
QDRANT_HOST=qdrant
QDRANT_PORT=6333

# --- NEXTAUTH ENTERPRISE SSO CONFIG ---
NEXTAUTH_SECRET=your_nextauth_jwt_secret_key
NEXTAUTH_URL=http://localhost:3000
AZURE_AD_CLIENT_ID=your_azure_client_id
AZURE_AD_CLIENT_SECRET=your_azure_client_secret
AZURE_AD_TENANT_ID=your_azure_tenant_id
OKTA_CLIENT_ID=your_okta_client_id
OKTA_CLIENT_SECRET=your_okta_client_secret
OKTA_ISSUER=your_okta_issuer_url

# --- PORTS ---
WEB_PORT=3000
API_PORT=8000
Local Deployment
To build and start the entire multi-container service stack on your internal server:

**Start the Stack:**
bash
   docker-compose up -d --build


**Verify Services Status:**
bash
   docker-compose ps
   
**Database Migrations:** Apply Alembic migrations to configure tables in the PostgreSQL container:
bash
   docker-compose exec api alembic upgrade head
Service URLs:
Web Portal: http://localhost:3000 (or configured internal proxy domain)
FastAPI Docs: http://localhost:8000/docs
Langfuse Observability: http://localhost:3001


**7. Security & Governance**

Network Isolation: All database components (Qdrant, Redis, PostgreSQL) reside strictly within the local container network behind the enterprise firewall/VPN. No public network ports are exposed.
Access Control: Single Sign-On integration via NextAuth.js ensures that only authorized corporate employees can authenticate and access the assistant.
Data Protection & Privacy: In compliance with enterprise standards, Google Vertex AI ensures corporate data is isolated. Chats, documents, and search queries are encrypted in transit and at rest and are strictly protected against use in public foundation model training.

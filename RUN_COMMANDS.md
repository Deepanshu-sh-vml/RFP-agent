# WinBid AI Run Commands

## Docker Mode

```powershell
Copy-Item .env.example .env
docker compose up -d --build
docker compose ps
```

## Local Mode

### 1. Create and fill `.env`

```powershell
Copy-Item .env.example .env
```

Use values like:

```env
DATABASE_URL=postgresql://postgres:postgres_password@localhost:5432/winbid_db
REDIS_URL=redis://localhost:6379/0
QDRANT_HOST=localhost
QDRANT_PORT=6333
NEXTAUTH_SECRET=some-long-random-secret
NEXTAUTH_URL=http://localhost:3000
NEXT_PUBLIC_API_URL=http://localhost:8000
GEMINI_API_KEY=your_key_if_needed
```

### 2. Start backend

```powershell

cd apps/api
..\..\.venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --host 0.0.0.0 --port 8000
```

### 3. Start frontend

```powershell
cd apps/web
npm install
npm run dev -- --hostname 0.0.0.0 --port 3000
```

## Helpful Checks

```powershell
python -c "import sqlalchemy; print(sqlalchemy.__version__)"
python -c "import sys; sys.path.insert(0, 'apps/api'); import app.main; print('api ok')"
```

## Notes

- Docker mode requires Docker Desktop to be installed and running.
- Local mode requires Python 3.11+, Node 20+, Postgres, Redis, and Qdrant running separately.
- If you only want one click launch, use `run.ps1` in the repo root.


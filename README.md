# CivicVerify AI

CivicVerify AI is an AI-assisted public claim verification platform. It combines a Next.js frontend with a FastAPI backend to help users investigate claims, review evidence, and generate structured investigation outputs such as verdicts, explanations, timelines, and RTI-style follow-up questions.

## What the project does

The app is designed around a simple investigation flow:

1. A user submits a claim.
2. The backend runs an investigation workflow.
3. The system returns a structured result including:
   - verdict
   - confidence
   - evidence quality
   - source agreement
   - explanation
   - timeline
   - RTI intelligence
   - evidence sources

## Project structure

- Frontend: Next.js + React + Tailwind in the src folder
- Backend: FastAPI app in the backend folder
- Investigation workflow: backend/workflows/investigation_graph.py
- AI and evidence services: backend/services
- Database models and schemas: backend/models

## Tech stack

- Frontend: Next.js 16, React 19, Tailwind CSS, shadcn-style UI components
- Backend: FastAPI, SQLAlchemy, Pydantic
- External integrations: Gemini, Tavily, Firecrawl, Neo4j

## Local development

### 1. Install frontend dependencies

```bash
npm install
```

### 2. Start the frontend

```bash
npm run dev
```

The app will be available at http://localhost:3000.

### 3. Start the backend

```bash
cd backend
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

The API will be available at http://localhost:8000.

## Environment variables

Create environment files before running the backend services.

### Backend

Create a .env file in the backend folder with values such as:

```env
DATABASE_URL=sqlite:///./investigations.db
GEMINI_API_KEY=your_key_here
TAVILY_API_KEY=your_key_here
FIRECRAWL_API_KEY=your_key_here
NEO4J_URI=bolt://localhost:7687
NEO4J_USER=neo4j
NEO4J_PASSWORD=your_password_here
```

## Current status and pending work

The project is in an early but functional state. Based on a code review, the main follow-up areas appear to be:

- wiring the investigation detail page to a real backend-backed lookup instead of relying on localStorage
- replacing the hardcoded frontend API URL in src/lib/api.ts with a configurable environment-based setting
- making the backend startup more resilient when optional AI service keys are missing
- connecting the UI actions such as Share and Generate RTI Draft to real functionality
- adding automated tests for both frontend and backend flows

## Notes

The frontend currently expects the backend at http://localhost:8000, and the backend services may raise errors during import if required API keys are not configured.

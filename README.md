# AI-Powered Apparel Branding Lab

An AI + 3D web app that generates branding concepts from a business idea and previews them on an interactive 3D mockup.

## Project Overview

This class project explores how generative AI can help early-stage founders by:

1. Generating brand identity content (name, slogan, description, mission)
2. Applying branding to a 3D object for fast visual feedback
3. Letting users adjust style direction and placement in real time

## Features

- AI generation from prompt (`Bold`, `Minimal`, `Modern`, `Technical`)
- Persona-aware UX modes (`Non-tech`, `Tech`, `Pro`)
- 3D preview for `T-Shirt`, `Mug`, and `4-Walled House`
- Side-only branding placement (`Front`, `Back`, `Left Sleeve`, `Right Sleeve`)
- Image/logo upload for side-face placement
- Color palette selector for object recoloring
- FastAPI backend with OpenAI integration + local fallback

## Tech Stack

- Frontend: React 18, Vite 5
- 3D: Three.js, `@react-three/fiber`, `@react-three/drei`
- Backend: Python, FastAPI, Uvicorn
- AI: OpenAI API (`openai` Python SDK)

## Run Locally

1. Backend

```bash
cd backend
python -m venv .venv
```

Windows:

```bash
.venv\Scripts\activate
```

Install dependencies:

```bash
pip install -r requirements.txt
```

Create `backend/.env` from `backend/.env.example` and set:

```env
OPENAI_API_KEY=your_api_key_here
OPENAI_MODEL=gpt-4.1-mini
CORS_ORIGINS=http://localhost:5173
```

Run API:

```bash
uvicorn main:app --reload --port 8000
```

2. Frontend

```bash
cd frontend
npm install
```

Create `frontend/.env`:

```env
VITE_API_BASE_URL=http://localhost:8000
```

Run app:

```bash
npm run dev
```

## Endpoints

- `GET /api/health`
- `POST /api/branding/generate`


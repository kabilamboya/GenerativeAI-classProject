# AI-Powered Apparel Branding Lab

An AI + 3D class project for generating brand concepts and previewing them on interactive mock objects.

## Current Status (Phase 1+)

This repo now has:

1. A modular FastAPI backend with service-layer generation and fallbacks.
2. A persona-based React frontend (`Non-tech`, `Tech`, `Pro`).
3. A central `3D Mockup Preview` with a `Quick Edit` side panel as the single place for mock controls.
4. More realistic mock objects and side-only branding placement logic.

## What Works Right Now

- AI branding text generation (`name`, `slogan`, `description`, `missionStatement`, `placement`)
- Optional AI image generation (`/api/branding/generate-image`)
- 3 mock object types:
  - `T-Shirt`
  - `Mug`
  - `4-Walled House` (roof removed)
- Side-only placement options:
  - `Front`, `Back`, `Left Sleeve`, `Right Sleeve`
- 2D-to-3D workflows:
  - T-shirt: separate front and back image uploads
  - Mug: side image wrap on cylindrical mug surface
  - House: inside/outside wall branding with diagonal split view
- Color palette switching from the 3D preview side panel
- Pro mode extras:
  - Business idea input is shown only in Pro
  - Prompt-to-image generation UI for advanced workflows

## UX Flow by Mode

- `Non-tech`
  - Simple generation flow with guided labels
  - Business idea field hidden
- `Tech`
  - Similar to Non-tech with checklist guidance
  - Business idea field hidden
- `Pro`
  - Business idea field enabled
  - Extra prompt-to-image controls enabled
  - Word-count quality checks for description and mission

## Single Source of 3D Controls

To reduce confusion and duplicate state handling, these controls were consolidated into `3D Mockup Preview -> Quick Edit`:

- Mock object (single-select dropdown)
- Placement selector
- House view selector (`Outside` / `Inside`)
- Object-specific image uploads/removal
- Color palette swatches

Duplicate controls were removed from top-level form panels.

## Tech Stack

- Frontend: React 18, Vite 5
- 3D: Three.js, `@react-three/fiber`, `@react-three/drei`
- Backend: Python, FastAPI, Uvicorn
- AI: OpenAI API (`openai` Python SDK)

## Project Structure

```text
backend/
  app/
    api/routes/branding.py
    config.py
    main.py
    schemas/
    services/branding.py
  tests/test_branding_api.py
  main.py

frontend/
  src/
    App.jsx
    components/
      IdeaForm.jsx
      BrandingDetails.jsx
      ShirtCanvas.jsx
    lib/api.js
```

## Run Locally

1. Backend setup

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

Create `backend/.env` from `backend/.env.example`:

```env
OPENAI_API_KEY=your_api_key_here
OPENAI_MODEL=gpt-4.1-mini
OPENAI_IMAGE_MODEL=gpt-image-1
CORS_ORIGINS=http://localhost:5173
```

Run backend:

```bash
uvicorn main:app --reload --port 8000
```

2. Frontend setup

```bash
cd frontend
npm install
```

Create `frontend/.env`:

```env
VITE_API_BASE_URL=http://localhost:8000
# Optional realistic T-shirt model:
# VITE_USE_REAL_TSHIRT=true
# VITE_TSHIRT_MODEL_URL=/models/tshirt.glb
```

Run frontend:

```bash
npm run dev
```

## API Endpoints

- `GET /api/health`
- `POST /api/branding/generate`
- `POST /api/branding/generate-image`

## Testing

Backend:

```bash
cd backend
pytest -q
```

Frontend checks:

```bash
cd frontend
npm run build
```

## Refactoring + Debugging Challenges Documented

1. Backend decomposition from monolith to layered structure (`config`, `schemas`, `services`, `routes`).
2. Hardening around OpenAI failures with local text/image fallbacks and structured logging.
3. Normalizing model output (including invalid placement fallback to `Front`).
4. 3D realism updates:
   - Mug updated to one vertical curved handle.
   - House roof removed and split-inside view added.
   - Optional real T-shirt model support via env variables.
5. Side-only branding enforcement for all objects (no top/bottom branding surfaces).
6. UI simplification:
   - Removed duplicated object/placement/upload/color controls outside preview.
   - Kept one control center in the `Quick Edit` side panel.
7. Performance note:
   - 3D canvas is lazy-loaded, but the Three.js chunk is still large and needs further chunk/model optimization.

## Known Limitations

- Final realism depends on high-quality external `.glb/.gltf` assets and proper UV maps.
- AI image quality depends on prompt clarity and selected model behavior.
- The 3D bundle remains heavy; loading strategy can be improved further.

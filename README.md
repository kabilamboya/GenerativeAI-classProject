# AI-Powered Apparel Branding Lab

An AI + 3D web app that generates branding concepts from a business idea and previews them on an interactive 3D mockup (T-Shirt, Mug, or 4-Walled House).

## Features

- Generate brand name, slogan, description, and mission statement from a prompt.
- Choose creative direction: `Bold`, `Minimal`, `Modern`, `Technical`.
- Real-time editable branding fields after generation.
- Placement controls: `Front`, `Back`, `Left Sleeve`, `Right Sleeve`.
- Interactive 3D preview with orbit/zoom controls.
- FastAPI backend with OpenAI integration and local fallback when API key is missing.

## Technologies Used

- Frontend: React 18, Vite 5
- 3D: Three.js, `@react-three/fiber`, `@react-three/drei`
- Backend: Python 3 + FastAPI + Uvicorn
- AI: OpenAI API (`openai` Python SDK)
- Config: `python-dotenv`, Vite env variables

## Installation Requirements

- Node.js 18+ and npm
- Python 3.10+
- Optional: OpenAI API key for live AI responses

## Installation

1. Clone the repository:

```bash
git clone <your-repo-url>
cd ai-powered-branding-lab
```

2. Set up and run backend:

```bash
cd backend
python -m venv .venv
```

Windows:

```bash
.venv\Scripts\activate
```

macOS/Linux:

```bash
source .venv/bin/activate
```

Install dependencies:

```bash
pip install -r requirements.txt
```

Create `backend/.env` (or copy from `backend/.env.example`):

```env
OPENAI_API_KEY=your_api_key_here
OPENAI_MODEL=gpt-4.1-mini
CORS_ORIGINS=http://localhost:5173
```

Run backend:

```bash
uvicorn main:app --reload --port 8000
```

3. Set up and run frontend (new terminal):

```bash
cd frontend
npm install
```

Create `frontend/.env`:

```env
VITE_API_BASE_URL=http://localhost:8000
```

Run frontend:

```bash
npm run dev
```

App URLs:
- Frontend: `http://localhost:5173`
- Backend: `http://localhost:8000`

## Basic Usage

1. Open the frontend.
2. Enter a business idea.
3. Select a direction and mockup type.
4. Click `Generate Branding`.
5. Edit generated fields and placement to update the 3D preview in real time.

Backend API example:

```bash
curl -X POST http://localhost:8000/api/branding/generate \
  -H "Content-Type: application/json" \
  -d "{\"idea\":\"Sustainable drone logistics startup\",\"direction\":\"Bold\"}"
```

Health check:

```bash
curl http://localhost:8000/api/health
```

## Configuration Options

Backend (`backend/.env`):

- `OPENAI_API_KEY`: OpenAI API key. If omitted, the backend returns locally generated fallback branding.
- `OPENAI_MODEL`: OpenAI model name (default: `gpt-4.1-mini`).
- `CORS_ORIGINS`: Comma-separated allowed origins for frontend access.

Frontend (`frontend/.env`):

- `VITE_API_BASE_URL`: Backend base URL.
- If `VITE_API_BASE_URL` is not set, frontend uses local mock branding data.

## Troubleshooting

- `ModuleNotFoundError` or import errors in backend:
  - Activate the virtual environment and re-run `pip install -r requirements.txt`.
- CORS errors in browser:
  - Ensure frontend origin is included in `CORS_ORIGINS`.
- Frontend returns mock data instead of backend responses:
  - Confirm `frontend/.env` has `VITE_API_BASE_URL` and restart Vite dev server.
- `Failed to generate branding`:
  - Verify backend is running on the expected URL and check request payload format.
- OpenAI failures:
  - Verify `OPENAI_API_KEY`; if invalid/missing, fallback behavior is expected.

## Contributing

1. Fork the repo and create a feature branch.
2. Keep changes focused and documented.
3. Run the app locally and verify frontend/backend integration.
4. Open a pull request with:
   - What changed
   - Why it changed
   - How to test it

## License

No license file is currently defined in this repository. Add a `LICENSE` file (for example, MIT) if you plan to distribute or accept external contributions.

## Code Structure Overview

```text
ai-powered-branding-lab/
  backend/
    .env.example            # Backend environment variable template
    main.py                 # FastAPI app, OpenAI call, fallback generator
    requirements.txt        # Python dependencies
  frontend/
    package.json            # Frontend scripts and dependencies
    vite.config.js          # Vite configuration
    index.html              # Frontend HTML entry
    src/
      App.jsx               # Main app container and state orchestration
      main.jsx              # React bootstrap
      styles.css            # Global styles
      components/
        IdeaForm.jsx        # Prompt + options form
        BrandingDetails.jsx # Editable generated branding fields
        ShirtCanvas.jsx     # 3D scene and mockup rendering
      lib/
        api.js              # API client + fallback behavior
        mockBranding.js     # Local mock branding generator
```

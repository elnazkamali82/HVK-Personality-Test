# Panjrakh API

Runnable skeleton. The questionnaire, scoring, and report currently live in the Next.js app. This service exposes health and instrument metadata, and reserves `POST /api/v1/assessment/score` until scoring moves server-side.

```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

- `GET /api/health`
- `GET /api/v1/assessment/info`
- `POST /api/v1/assessment/score` → 501

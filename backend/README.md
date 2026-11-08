# Panjrakh API

FastAPI skeleton for the Panjrakh personality profile. Numeric scoring still lives in the Next.js app; this service can turn a scored profile into a structured Persian narrative through any OpenAI-compatible chat API.

```bash
cd backend
python -m venv .venv
# Windows: .venv\Scripts\activate
source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env   # then set PANJRAKH_LLM_API_KEY / BASE_URL / MODEL
uvicorn app.main:app --reload
```

## Endpoints

- `GET /api/health`
- `GET /api/v1/assessment/info`
- `POST /api/v1/assessment/score` → `501` (scoring not served yet)
- `POST /api/v1/assessment/report` → LLM structured report

## Report request

Send the profile already scored by the frontend (`scoreProfile`):

```json
{
  "instrument_version": "0.1.0",
  "domains": [
    {
      "id": "E",
      "name": "برون‌گرایی",
      "brief": "معاشرت، بیان نظر و انرژی در فعالیت",
      "mean": 3.8,
      "index": 70,
      "pole": "high"
    }
  ],
  "qualitative": [
    {
      "itemId": "q06",
      "order": 6,
      "format": "situational",
      "tag": "mediate",
      "label": "…"
    }
  ]
}
```

Response matches the frontend `Report` shape (`domainTexts`, `groupBehavior`, `fun`, …) plus `"source": "llm"`.

The LLM system prompt lives in `app/prompts/system_prompt.md` (analytical layer + portrait/`fun` block).

## LLM provider

Any OpenAI-compatible `/v1/chat/completions` endpoint works. Examples:

| Provider | `PANJRAKH_LLM_BASE_URL` |
| --- | --- |
| OpenAI | `https://api.openai.com/v1` |
| Groq | `https://api.groq.com/openai/v1` |
| Together | `https://api.together.xyz/v1` |
| Local Ollama | `http://localhost:11434/v1` |

Set `PANJRAKH_LLM_MODEL` to a model that supports JSON object responses.

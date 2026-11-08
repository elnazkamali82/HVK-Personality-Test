# پنج‌رخ

پرسشنامه خودشناسی ۳۶ سؤالی برای بزرگسالان، بر اساس مدل پنج‌عاملی. نسخه ۰.۱ اعتبارسنجی نشده است.

## داکر

```bash
docker compose up --build
```

فرانت روی پورت ۳۰۰۰ منتشر می‌شود. API داخل کانتینر روی ۸۰۰۰ است و روی میزبان به ۸۰۱۰ نگاشت شده، چون پورت ۸۰۰۰ این سیستم از قبل در استفاده است. هر دو از شبکه داخلی با IP همین سیستم در دسترس‌اند.

## فرانت

```bash
cd frontend
npm run dev
```

برنامه روی [http://localhost:3000](http://localhost:3000) باز می‌شود. نمره‌گذاری فعلاً در همین برنامه است.

## بک‌اند

اسکلت FastAPI است و هنوز نمره را حساب نمی‌کند.

```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

- `GET /api/health`
- `GET /api/v1/assessment/info`
- `POST /api/v1/assessment/score` پاسخ ۵۰۱ می‌دهد

# Fast Run Checklist

## Terminal 1 — backend

```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
# Add ONE real AI provider key if you want live Copilot responses.
# Add Razorpay Test Mode keys if you want real Test Mode order creation.
python app.py
```

## Terminal 2 — frontend

```bash
cd frontend
npm install
npm run dev
```

Open the Vite URL printed by the terminal.

## Recommended demo path

`/dashboard` → `/missions` → `/agent` → `/customer-360` → `/simulator` → `/agent-control` → `/ai-buyer` → `/failure-center` → `/evaluation` → `/audit`

## Important

Keep secrets only in `backend/.env`. Never put API keys in React or commit `.env`.

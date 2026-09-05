# RazorPayPilot — Real AI Copilot Setup

This version removes the separate **Decision Engine** page and replaces the old hard-coded Copilot replies with a real model-backed Copilot.

## 1. Backend

```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

Copy the environment file:

```bash
cp .env.example .env
```

Choose one AI provider in `backend/.env`.

### Gemini

```env
AI_PROVIDER=gemini
GEMINI_API_KEY=YOUR_GEMINI_KEY
GEMINI_MODEL=gemini-2.5-flash
```

### Groq

```env
AI_PROVIDER=groq
GROQ_API_KEY=YOUR_GROQ_KEY
GROQ_MODEL=llama-3.3-70b-versatile
```

### OpenAI

```env
AI_PROVIDER=openai
OPENAI_API_KEY=YOUR_OPENAI_KEY
OPENAI_MODEL=gpt-5-mini
```

Start Flask:

```bash
python app.py
```

Expected backend URL:

```text
http://127.0.0.1:5100
```

## 2. Frontend

Open a second terminal:

```bash
cd frontend
npm install
npm run dev
```

Open the Vite URL shown in the terminal, normally:

```text
http://localhost:5173
```

## 3. What is now real

- AI Copilot sends the merchant question to the configured LLM.
- The backend supplies merchant context and safety policy to the model.
- Conversation history is passed to the model for multi-turn chat.
- Copilot status shows provider/model connectivity.
- Suggested actions are generated from the request and exposed as safe UI actions.
- Test Mode order execution can use the real Razorpay Test API if test credentials are configured.
- Actions are policy checked before execution.
- Audit entries are written for AI analysis and actions.
- If an action exceeds the autonomous threshold, it is blocked and approval is required.
- No production Razorpay credentials should be used for this buildathon demo.

## 4. Mentor demo

Use this sequence in the AI Copilot page:

1. `Why is revenue at risk?`
2. `Analyze failed payments`
3. `What should we do first?`
4. Click the suggested Test Mode action.
5. Open **Audit Trail**.
6. Show the provider/model badge at the top of Copilot.
7. If Razorpay Test Mode keys are configured, show the generated Test Mode order response.
8. Explain that sensitive actions are policy-gated and never silently executed.

## 5. Important

Never commit `.env` to GitHub. The repository should contain only `.env.example`.

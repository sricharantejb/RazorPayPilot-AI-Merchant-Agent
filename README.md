# RazorPayPilot — AI Revenue Operating System

RazorPayPilot is a merchant-focused AI operating system for **Razorpay Test Mode**. It is designed for Track 01 / agentic commerce style demos: the AI detects revenue opportunities, explains evidence, simulates outcomes, checks merchant policies, requests approval where needed, executes bounded Test Mode actions, verifies outcomes and records an audit trail.

## What is included

- Real AI Copilot via Gemini, Groq or OpenAI-compatible APIs
- Live-polled AI Command Center
- Revenue Rescue Mission: failed payments, abandoned carts, win-back and cross-sell
- Customer 360 with LTV, RFM, churn risk, purchase probability, recommendations and timeline
- Agent Control Room with specialized Revenue, Recovery, Customer, Product, Campaign and AI Buyer agents
- Revenue What-If Simulator / profit-aware experimentation
- AI Buyer → AI-readable catalog → policy check → Razorpay Test Mode order
- Agent Evaluation Lab with repeatable benchmark metrics
- Failure Center with safe-stop demonstration
- Human approval and merchant AI Constitution
- Audit Trail, Agent Memory, Forecasts, Anomalies and API Console
- Responsive dark UI preserved from the original RazorPayPilot design

## Important truthfulness boundary

The application distinguishes between **real external Test Mode calls** and **local/sandbox behavior**. A real Razorpay Test Mode order is created only when valid Test Mode API credentials are configured and the API call succeeds. Recovery/campaign/notification workflows that do not have a corresponding external credential or API are explicitly treated as Test Mode simulations and are written to the audit trail. Do not present simulated outcomes as production payments.

The AI Copilot is a real LLM integration when a provider key is configured. Its merchant context is the included demo/test workspace unless you connect your own data source.

## Run locally

### Backend

```bash
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
python app.py
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

The frontend defaults to `http://127.0.0.1:5100` for the backend. Override it with `VITE_API_URL` in `frontend/.env` if required.

## Real AI

Edit `backend/.env` and configure one provider:

```env
AI_PROVIDER=gemini
GEMINI_API_KEY=your_key
GEMINI_MODEL=gemini-2.5-flash
```

or Groq/OpenAI using the fields in `.env.example`.

## Razorpay Test Mode

To create real Razorpay **Test Mode** orders from AI Buyer / Copilot, add your Test Mode key pair to `backend/.env`:

```env
RAZORPAY_KEY_ID=rzp_test_...
RAZORPAY_KEY_SECRET=...
```

Never commit `.env` or expose the secret in the frontend.

## Mentor demo flow

1. Open **AI Command Center** and show the live monitor.
2. Open **Revenue Rescue Mission** and explain the four coordinated interventions.
3. Run the **Revenue Simulator** before acting.
4. Ask **AI Copilot** why revenue is at risk.
5. Show a policy-gated action and human approval.
6. Open **Agent Control Room** to show the specialized AI workforce.
7. Use **AI Buyer** to search the merchant catalog and create a Test Mode order.
8. Trigger **Failure Center** and show safe-stop + audit behavior.
9. Run **Evaluation Lab** to prove bounded behavior with measurable metrics.
10. Finish on **AI Impact / Audit Trail** to show the closed loop.

## Architecture

```text
React UI
  ↓
Flask Control Plane
  ├── Real AI Copilot (Gemini / Groq / OpenAI)
  ├── Merchant Context
  ├── Opportunity + Revenue Rescue Logic
  ├── Policy / Approval Guardrails
  ├── Test Mode Action Layer
  ├── AI Buyer + Catalog
  ├── Simulation + Evaluation
  └── Audit / Failure Handling
          ↓
  Optional Razorpay Test API
```

## Submission hygiene

The source ZIP intentionally excludes `node_modules`, Python virtual environments, build output, `.env`, cache folders and macOS metadata. Review the included `.env.example` files and README before submission.

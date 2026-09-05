# Deployment Guide — RazorPayPilot

This document explains how RazorPayPilot is deployed both for **instant live demos** and for **permanent cloud hosting**.

---

## 1. Instant Live Demo Tunnel (Active Now)

RazorPayPilot is packaged as a unified full-stack application where the Flask backend directly serves the production React build and API on port `5100`.

### Active Public URLs
- **Primary Public URL**: `https://dqmvs-27-6-117-147.run.pinggy-free.link`
- **Mirror Public URL**: `https://sfpxg-27-6-117-147.free.pinggy.net`
- **Health Check**: `https://dqmvs-27-6-117-147.run.pinggy-free.link/api/health`
- **Realtime Telemetry**: `https://dqmvs-27-6-117-147.run.pinggy-free.link/api/realtime`

### To Re-Launch the Live Demo Tunnel
If you ever restart your machine or need a fresh tunnel, simply run:
```bash
./tunnel.sh
```
This opens an immediate, free, public HTTPS tunnel without creating any accounts.

---

## 2. One-Click Cloud Deployment (Render)

The project includes `render.yaml` for automatic cloud deployment on [Render](https://render.com):

1. Push your repository to **GitHub**.
2. Log in to [dashboard.render.com](https://dashboard.render.com) and click **New +** → **Blueprint**.
3. Connect your GitHub repository.
4. Render will read `render.yaml` and configure:
   - **Build Command**: `cd frontend && npm install && npm run build && cd ../backend && pip install -r requirements.txt`
   - **Start Command**: `cd backend && gunicorn app:app --bind 0.0.0.0:$PORT`
5. In the Render Dashboard environment tab, add your secrets:
   - `GEMINI_API_KEY`: Your Google AI Studio key
   - (Optional) `RAZORPAY_KEY_ID`: Your Razorpay Test Key ID
   - (Optional) `RAZORPAY_KEY_SECRET`: Your Razorpay Test Key Secret
6. Click **Deploy**. Your app will be live at `https://your-app-name.onrender.com`!

---

## 3. Containerized Deployment (Docker)

A production multi-stage `Dockerfile` is included.

### Build and Run Locally with Docker
```bash
docker build -t razorpaypilot .
docker run -p 5100:5100 --env-file backend/.env razorpaypilot
```

### Deploy Container to Cloud Run / AWS / Railway / Fly.io
Deploy the container directly to:
- **Google Cloud Run**: `gcloud run deploy --source .`
- **Fly.io**: `fly launch`
- **Railway**: Connect GitHub repo and select Dockerfile.

---

## 4. Decoupled Deployment (Vercel + Backend)

If you prefer hosting the React frontend on Vercel:
1. Deploy the backend to Render or Railway.
2. In Vercel, import the `frontend` folder.
3. Add Environment Variable in Vercel:
   ```
   VITE_API_URL = https://your-backend.onrender.com
   ```
4. Deploy!

# Stage 1: Build Frontend
FROM node:20-alpine AS frontend-builder
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm ci --prefer-offline || npm install
COPY frontend ./
RUN npm run build

# Stage 2: Production Python Backend + Static Frontend
FROM python:3.9-slim
WORKDIR /app

ENV PYTHONUNBUFFERED=1 \
    PORT=5100

COPY backend/requirements.txt ./backend/
RUN pip install --no-cache-dir -r ./backend/requirements.txt

COPY backend/ ./backend/
COPY --from=frontend-builder /app/frontend/dist ./frontend/dist

WORKDIR /app/backend

EXPOSE 5100

CMD ["sh", "-c", "gunicorn app:app --bind 0.0.0.0:${PORT:-5100} --workers 2 --threads 4"]

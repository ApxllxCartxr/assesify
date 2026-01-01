# Assesify

A full-stack LMS application built with Flask (Backend) and Next.js (Frontend).

## Prerequisites
- Docker & Docker Compose
- Python 3.10+
- Node.js 18+

## Getting Started

### 1. Database Setup (Docker)
This project uses PostgreSQL via Docker.

1.  Copy the example environment file:
    ```bash
    cp .env.example .env
    ```
    *Note: Adjust `DB_PORT` in `.env` if 5432 is busy.*

2.  Start the database:
    ```bash
    docker-compose up -d
    ```

### 2. Backend Setup
1.  Navigate to `backend/`:
    ```bash
    cd backend
    ```
2.  Create and activate a virtual environment:
    ```bash
    python -m venv .venv
    source .venv/bin/activate
    ```
3.  Install dependencies:
    ```bash
    pip install -r requirements.txt
    ```
4.  Run migrations:
    ```bash
    export FLASK_APP=app.main
    flask db upgrade
    ```
5.  Start the server:
    ```bash
    python app/main.py
    ```

### 3. Frontend Setup
1.  Navigate to `frontend/`:
    ```bash
    cd frontend
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Start the dev server:
    ```bash
    npm run dev -p 3005
    ```

## Project Structure
- `backend/`: Flask API
- `frontend/`: Next.js App
- `docker-compose.yml`: Database orchestration

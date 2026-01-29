# Ender Backend – Quick Start (Non‑Technical)

This folder contains the server for the app. Think of it as the “helper” that talks to the database and answers simple requests.

What it can do:
- Start a small web server
- Connect to a PostgreSQL database (on Supabase)
- Provide a simple health check so you know it’s running

Requirements:
- Node.js 18+ (includes npm)

1) Install
- Open a terminal
- Go to the backend folder: cd backend
- Install packages: npm install

2) Add settings (only once)
- Create a file named .env inside the backend folder.
- Ask your admin/teammate for the real values. Do not share them publicly.
- Example placeholders:
  PORT=5000
  DATABASE_URL=postgres://user:password@host:5432/dbname
  SUPABASE_URL=https://your-project.supabase.co
  SUPABASE_ANON_KEY=your-anon-key

3) Run the server
- Development (auto‑restart): npm run dev
- Production start: npm start

4) Check that it works
- Open your browser and go to: http://localhost:5000/ping (replace 5000 with your PORT if different)
- You should see: { "status": "ok" }

Notes
- Backend code lives in backend/, main file is backend/src/server.js
- Keep the .env file private. Never commit real secrets.

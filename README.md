# Ender – Quick Start

This repo contains two apps:
- backend: Node.js/Express API (Drizzle ORM + Supabase Auth)
- frontend: Next.js App Router UI

Requirements:
- Node.js 18+ (includes npm)

---

Backend
1) Install
- Open a terminal
- Go to the backend folder: cd backend
- Install packages: npm install

2) Environment (.env)
- Create a file named `.env` inside the backend folder.
- Ask your admin/teammate for the real values. Do not share them publicly.
- Example placeholders:
```
PORT=5000
DATABASE_URL=postgres://user:password@host:5432/dbname
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key
```

3) Run the server
- Development (auto‑restart): npm run dev
- Production start: npm start

4) Health check
- Open: http://localhost:5000/ (or /ping) → `{ "status": "ok" }`

Notes
- Backend code lives in `backend/`, entry is `backend/src/server.js`.
- Keep the `.env` file private. Never commit real secrets.

---

Frontend
1) Install
- Open a terminal
- Go to the frontend folder: cd frontend
- Install packages: npm install

2) Environment (.env.local)
- Create a file named `.env.local` inside the frontend folder.
- Provide the backend API base URL:
```
NEXT_PUBLIC_API_BASE_URL=http://localhost:5000
```

3) Run the app
- Development: npm run dev
- Open http://localhost:3000

4) Auth integration
- Sign Up and Sign In pages call the backend (`/auth/register`, `/auth/login`).
- On successful login, the access token is stored on the client and used for `GET /auth/profile`.

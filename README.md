# Ender Backend – Simple Guide

This is a small Node.js + Express backend that powers the app’s server side. It connects to a PostgreSQL database (hosted on Supabase), and exposes a simple health check so you can confirm it’s running.

## What this backend does

- Runs a web server using Express
- Connects to a PostgreSQL database (Supabase)
- Uses Drizzle ORM for database access (structure and queries)
- Can optionally use the Supabase client for authentication-related tasks
- Provides a basic health endpoint to verify the service is up

## Requirements

- Node.js 18 or newer
- npm (comes with Node.js)

## Project layout

- Backend code lives in `backend/`
- Main entry file: `backend/src/server.js`
- ES Modules are enabled (`type: module`)
- Environment variables are read from a `.env` file in `backend/`

## Setup (first time)

1) Open a terminal and go to the backend folder:

```
cd backend
```

2) Install dependencies:

```
npm install
```

3) Create the `.env` file in `backend/` (see “Environment variables” below).

## Environment variables (in backend/.env)

Do not share these publicly. Ask your admin for real values.

- `PORT` – The port for the server (e.g., `5000`).
- `DATABASE_URL` – The Supabase Postgres connection URL. Drizzle/pg will use this to connect to the database.
- `SUPABASE_URL` – (Optional) Your Supabase project URL, only needed if using the Supabase client.
- `SUPABASE_ANON_KEY` – (Optional) Anonymous key for the Supabase client.

Example (placeholder values):

```
PORT=5000
DATABASE_URL=postgres://user:password@host:5432/dbname
SUPABASE_URL=https://your-supabase-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key
```

## Start the server

From the `backend/` folder:

- Development (auto-restart on changes):

```
npm run dev
```

- Production (regular start):

```
npm start
```

The server will print the port it’s using. If the database URL is valid, it will also confirm the database connection.

## Available API endpoints

- `GET /ping`
  - Purpose: quick health check
  - Response: `{ "status": "ok" }`

## How to verify it’s working

1) Start the server (see above).
2) In your browser (or Postman), open: `http://localhost:5000/ping` (replace 5000 with your `PORT` if different).
3) You should see a small JSON response: `{ "status": "ok" }`.

## Notes for future development

- Add more endpoints following the existing route/controller pattern.
- Keep secrets out of the codebase; use environment variables.
- For deployments, set the same environment variables on the hosting platform.

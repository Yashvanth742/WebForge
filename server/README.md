# WebForge server

The Node server owns authentication, sessions, project storage, and AI generation.

## Run it

```powershell
npm run dev
```

`npm run dev` loads `server/.env` and starts the API on port 4000.

## Source files

- `src/server.js` — routes, validation, cookies, JWT session checks, and project persistence.
- `src/agent.js` — server-only OpenRouter request. It generates `/App.jsx` and `/styles.css`, validates the returned JSON, and rejects unsafe file contents.

## Required environment values

Keep `server/.env` private and out of Git. It contains:

- `JWT_SECRET` — a unique secret of at least 32 characters.
- `OPENROUTER_API_KEY` — AI provider key.
- `OPENROUTER_MODEL` — model slug.
- `ORIGINS` — exact client URL, such as `http://localhost:5173`.

Development data is written to `server/data/`. Move to MongoDB before multi-user production; `MONGODB_URL` is reserved for that migration.

# WebForge client

The React client provides sign-in, prompt-based website creation, AI build progress, code editing, previewing, publishing, and exporting.

## Run it

```powershell
npm install
npm run dev
```

Vite runs at `http://localhost:5173` and proxies `/api` calls to port 4000.

## Important boundary

This folder never contains an AI-provider or JWT secret. The browser calls authenticated API routes; all AI calls occur in `server/src/agent.js`.

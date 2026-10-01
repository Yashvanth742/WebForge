# WebForge security baseline

The API uses short-lived, signed JWTs in `HttpOnly`, `SameSite=Strict` cookies. Each token has a server-stored session identifier, so logging out invalidates the token immediately. State-changing requests require a matching CSRF cookie and `X-CSRF-Token` header.

Passwords are salted and hashed with Node's `scrypt` (64-byte output). The API also applies request and login/register rate limits, request-size limits, origin allowlisting, strict CORS, security response headers, owner-scoped project queries, input length/type checks, timing-safe credential comparisons, and atomic private data-file writes.

Before deployment, set a unique 32+ character `JWT_SECRET`, use HTTPS (which enables `Secure` cookies), set `CLIENT_ORIGIN` to the exact deployment URL, move persistent data to a managed database, and put the API behind a reverse proxy that enforces TLS and a global rate limit. Never place any provider key in `client/` or a `VITE_*` variable.

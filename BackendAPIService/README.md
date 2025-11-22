# Backend API Service (Express.js)

REST API powering chat messages and dynamic tag suggestions.

## Prerequisites
- Node.js 18+
- PostgreSQL (optional for local mock mode if implemented)

## Environment
Copy and edit:
```bash
cp .env.example .env
```

Important variables:
- PORT (default 3001)
- HOST (default 0.0.0.0)
- CORS_ORIGINS (e.g., http://localhost:3000)
- POSTGRES_* (if DB is used)

## Run locally
```bash
npm install
npm run dev   # or npm start after build
```
Service runs at http://localhost:3001

## API overview
- GET /api/messages
- POST /api/messages
- PUT /api/messages/:id
- DELETE /api/messages/:id
- GET /api/tags
- POST /api/tags
- PUT /api/tags/:id
- DELETE /api/tags/:id

OpenAPI docs: /openapi.json (and /docs if enabled in the environment)

## Param compatibility
The frontend uses "search" for tag suggestions. Backend GET /api/tags should accept:
- trigger: "@" or "#"
- search: query string for suggestions
- Additionally, accept alias "query" as equivalent to "search" for compatibility:
  - If "search" is missing and "query" is present, treat "query" as "search".

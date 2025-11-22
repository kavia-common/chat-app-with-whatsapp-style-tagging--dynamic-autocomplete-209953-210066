# chat-app-with-whatsapp-style-tagging--dynamic-autocomplete-209953-210066

BackendAPIService exposes:
- Health: GET /
- OpenAPI JSON: GET /openapi.json
- Swagger UI: GET /docs
- Messages: GET/POST /api/messages, PUT/DELETE /api/messages/{id}
- Tags: GET/POST /api/tags, PUT/DELETE /api/tags/{id}

Environment variables (configure via .env, do not commit secrets):
- PORT=3001
- HOST=0.0.0.0
- CORS_ORIGIN=*
- POSTGRES_URL=postgres://USER:PASSWORD@HOST:PORT/DB
  OR discrete values:
  - POSTGRES_HOST=...
  - POSTGRES_PORT=...
  - POSTGRES_USER=...
  - POSTGRES_PASSWORD=...
  - POSTGRES_DB=...
  - POSTGRES_SSL=false

Notes:
- DB schema expected matches the ApplicationDatabase provided schema.
- If TagSuggestion has unique constraints not present, ON CONFLICT DO NOTHING prevents duplicates safely.
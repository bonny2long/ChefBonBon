# Railway Deployment Guide for Chef BonBon Backend

## Required Railway variables

```text
ANTHROPIC_API_KEY=...
NODE_ENV=production
```

Optional variables:

```text
CLAUDE_API_URL=https://api.anthropic.com/v1/messages
CORS_ALLOWED_ORIGINS=https://your-custom-domain.example
```

`CORS_ALLOWED_ORIGINS` is a comma-separated allowlist of exact frontend origins. Chef BonBon Netlify subdomains and `http://localhost:<port>` are already allowed.

## Netlify variables

Configure these in Netlify for the frontend build:

```text
VITE_SUPABASE_URL=...
VITE_SUPABASE_ANON_KEY=...
VITE_API_URL=https://your-app-name.up.railway.app/api
```

The client accepts an API URL with or without the trailing `/api`; use the explicit `/api` form above for clarity.

## Production smoke test

After each deployment:

1. Open `https://your-app-name.up.railway.app/api/health`; it must return `{ "status": "ok" }`.
2. Open the deployed Netlify site and sign in.
3. Generate a food recipe with four ingredients; confirm the structured Detail, Ingredients, and Steps tabs render.
4. Generate and save a drink recipe; confirm it appears under Saved > Drinks.
5. Reopen each saved recipe, then test search and cooking-method filters.
6. Open Account; confirm it shows the saved-recipe count and does not sign the user out.
7. Check Railway logs for unexpected 5xx errors or CORS rejections.

## Troubleshooting

- `401` or Anthropic errors: confirm `ANTHROPIC_API_KEY` is set only in Railway, not Netlify.
- CORS errors: add the exact custom frontend origin to `CORS_ALLOWED_ORIGINS`; do not use a wildcard.
- Client connection errors: verify `VITE_API_URL` points to the Railway service and rebuild/redeploy Netlify after changing it.
- Failed recipe saves: confirm the structured private-recipes migration has been applied in Supabase.

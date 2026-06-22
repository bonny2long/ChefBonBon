# Chef BonBon V2 Roadmap

Last updated: 2026-06-22

## Product focus

Chef BonBon V2 is a mobile-first AI cooking assistant. The current milestone is a reliable private recipe loop: generate, save, reopen, and manage recipes. Community and scanner work remain intentionally deferred.

## Current status

| Area | Status | Notes |
| --- | --- | --- |
| V2 app shell | Complete | Home, Saved, Scan placeholder, and Account tabs are active. |
| Generation contract | Complete | Food and drink routes return validated structured recipe objects. |
| Recipe persistence | Complete | Structured private-recipe migration is available and has been applied. Legacy records remain readable. |
| V2 stabilization | Complete | Four-ingredient requirement, generated titles, save feedback, and clean active navigation are in place. |
| Mobile polish | In progress | Account screen and SVG navigation icons are complete; consistency and responsive review remain. |
| Saved-library search/filtering | Not started | Add search and cooking-method filters next. |
| Community | Parked | Legacy files remain outside active navigation. |
| AI scanner | Placeholder | The banner and Scan tab are wired; image upload/vision is not implemented. |
| Deployment hardening | Not started | Health endpoint, production CORS/env audit, and smoke testing remain. |

## Completed work

- Frontend/backend both require four ingredients.
- Backend validates food and drink recipes before returning `{ recipeType, recipe, raw }`.
- New recipe saves include structured JSON, type, cooking method, primary ingredient, and raw model output.
- Existing text-only saved recipes remain usable.
- Account no longer signs users out when its tab is opened.
- Bottom navigation uses inline SVGs instead of multi-megabyte PNG assets.

## Current database migration

Run once in Supabase before structured saves:

- [2026-06-22_private_recipes_structured_data.sql](migrations/2026-06-22_private_recipes_structured_data.sql)

## Next implementation order

1. Add search and cooking-method filtering to Saved recipes.
2. Complete mobile visual consistency and empty/loading/error states.
3. Add `GET /api/health`, confirm production environment variables and CORS, and create a production smoke-test checklist.
4. Decide whether to redesign Community or continue to park it.
5. Build scanner as image -> suggested ingredients -> user confirmation -> normal generation.

## Documentation policy

This file is the active V2 status source. `REDESIGN_MASTER_PLAN.md` and `PHASE_SUMMARY.md` are historical planning records and should not be used as current status.

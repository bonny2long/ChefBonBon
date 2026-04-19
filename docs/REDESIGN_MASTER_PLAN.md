# Chef BonBon — Redesign Master Plan

> Last Updated: April 18, 2026
> Status: Phase 2 Complete

---

## Project Overview

**Goal**: Transform Chef BonBon from a search-bot-feeling web form into a warm, mobile-first food app.

**Tech Stack**:
- Frontend: React + Vite, Tailwind CSS
- Backend: Node.js, Express
- Auth: Supabase (was Firebase)
- Database: Supabase
- AI: Anthropic Claude API

---

## Design Tokens

| Token | Value | Usage |
|-------|-------|-------|
| `--color-cream` | `#FAF7F2` | Background |
| `--color-olive-primary` | `#3B4A2F` | Primary buttons, text |
| `--color-gold` | `#F5C842` | Accent, highlights |
| `--color-rust` | `#D85A30` | Secondary |
| `--color-warm-surface` | `#F0EBE0` | Card backgrounds |
| `--color-text-primary` | `#1A1A1A` | Body text |
| `--color-text-muted` | `#BBBBBB` | Captions |

---

## Phase Status

| Phase | Name | Status | Date |
|-------|------|--------|------|
| 1 | Foundation | COMPLETE | Apr 18, 2026 |
| 2 | Layout Shell | COMPLETE | Apr 18, 2026 |
| 3 | Home Screen | IN PROGRESS | — |
| 4 | Recipe Output | NOT STARTED | — |
| 5 | Saved Recipes | NOT STARTED | — |
| 6 | AI Scanner | NOT STARTED | — |
| 7 | Polish | NOT STARTED | — |

---

## File Structure

```
client/
├── src/
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Header.jsx      # Simplified header
│   │   │   └── BottomNav.jsx  # Mobile tab nav
│   │   ├── recipes/
│   │   │   ├── Main.jsx        # Home screen
│   │   │   ├── ScanScreen.jsx   # Scanner placeholder
│   │   │   └── SavedRecipes.jsx
│   │   └── ui/
│   │       ├── FoodIcon.jsx    # Ingredient icon component
│   │       └── LoadingSpinner.jsx
│   ├── utils/
│   │   ├── api.js             # API calls
│   │   └── ingredientIcons.js  # Icon mappings
│   └── assets/
│       ├── food/             # ~151 food icons (PNG)
│       └── bottom_nav/     # 4 nav icons
├── index.css                # Design tokens + animations
└── tailwind.config.js       # Extended theme colors

server/
├── routes/
│   └── recipes.js         # Recipe API endpoints
├── services/
│   └── claudeService.js  # Claude AI integration
└── server.js
```

---

## Phase Details

### Phase 1: Foundation ✅ (COMPLETE)
- Design tokens in CSS
- Tailwind theme extension (olive, gold, cream, rust)
- ingredientIcons.js utility (150+ mappings)
- FoodIcon component with fallback

### Phase 2: Layout Shell ✅ (COMPLETE)
- BottomNav with 4 tabs (Home, Saved, Scan, Account)
- Header simplified (wordmark + mode badge)
- App max-width 390px

### Phase 3: Home Screen (IN PROGRESS)
- [ ] Remove RecipeContextModal
- [ ] Greeting + heading in content
- [ ] Cooking method chips (inline)
- [ ] Ingredient input card
- [ ] AI Scanner banner
- [ ] Recent recipes history

### Phase 4: Recipe Output (NOT STARTED)
- [ ] Structured recipe layout
- [ ] Hero with FoodIcon
- [ ] Tab bar (Detail/Ingredients/Steps)
- [ ] Claude JSON output parsing

### Phase 5: Saved Recipes (NOT STARTED)
- [ ] 2-column card grid
- [ ] Filter chips
- [ ] Empty state

### Phase 6: AI Scanner (NOT STARTED)
- [ ] Backend `/api/recipes/scan` endpoint
- [ ] Camera capture UI
- [ ] Image compression utility

### Phase 7: Polish (NOT STARTED)
- [ ] Micro-animations
- [ ] Toast notifications
- [ ] PWA manifest
- [ ] Safe area handling

---

## Missing Items

### Food Icons (~40 missing)
See `FOOD_ICONS_INVENTORY.md` for full list.

### Supabase Schema Updates
Needed in Phase 5:
- `primaryIngredient` column
- `cookingMethod` column

### Scanner API
Research in progress - need cheap/free solution for Phase 6.

---

## Testing

**Viewport**: 390px width (iPhone 14)
**Command**: `npm run dev` in `client/`

---

## Notes

- Never hardcode colors - use design tokens
- Mobile-first: max 390px, 44px touch targets
- Keep fallback states for all icon/API calls
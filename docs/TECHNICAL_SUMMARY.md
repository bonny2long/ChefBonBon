# ChefBot Technical Summary

## Project Overview

ChefBot is a full-stack web application that generates AI-powered recipes based on user-provided ingredients. The application demonstrates complex full-stack development skills including database architecture, authentication, real-time features, API design, and security implementation.

## Architecture

### Frontend Architecture (React + Vite)

The frontend demonstrates several advanced React patterns:

**Component Structure**
- Lazy loading with `React.lazy()` for code splitting
- Suspense boundaries for loading states
- Context-aware modal system (AuthModal, MessageModal, RecipeContextModal)
- Event-driven architecture using custom browser events for cross-component communication

**State Management**
- React hooks (useState, useEffect) for local state
- Custom auth listener pattern with Supabase integration
- Session storage for recipe context persistence

**Code Example - Auth Listener Pattern** (`client/src/lib/supabase.js`)
```javascript
export function setupAuthListener(onUserChange, setIsAuthReady) {
  // Timeout protection against infinite loading
  const timeout = setTimeout(() => {
    console.error('Supabase connection timeout - check your credentials in .env');
    setIsAuthReady(true);
    onUserChange(null, null);
  }, 10000);

  supabase.auth.getSession()
    .then(async ({ data: { session }, error }) => {
      if (session?.user) {
        await handleUserProfile(user, onUserChange);
      } else {
        onUserChange(null, null);
      }
    });

  // Real-time auth state change subscription
  const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
    if (session?.user) {
      await handleUserProfile(user, onUserChange);
    }
  });

  return () => { subscription.unsubscribe(); };
}
```

### Backend Architecture (Node.js + Express)

**API Design**
- RESTful endpoints with Express router
- Input validation and sanitization
- Rate limiting (20 requests per 15 minutes)
- Error handling middleware

**Code Example - Recipe Generation Endpoint** (`server/routes/recipes.js`)
```javascript
router.post("/recipes", async (req, res) => {
  // Input validation
  const rawIngredients = req.body.ingredients;
  if (!Array.isArray(rawIngredients) || rawIngredients.length < 4) {
    return res.status(400).json({
      error: "Please provide at least 4 ingredients.",
    });
  }

  // Sanitization
  const ingredients = rawIngredients
    .map(sanitizeIngredient)
    .filter((ing) => ing.trim().length > 0)
    .slice(0, 20);

  // Type-specific prompts (food vs drink)
  if (normalizedType === "drink") {
    const prompt = `You are Chef BonBon, a professional bartender...`;
    const recipeText = await generateRecipeText(prompt, apiKey);
    return res.json({ recipeType: "drink", recipe: recipeText });
  }
});
```

### AI Integration Service (`server/services/claudeService.js`)

```javascript
export const generateRecipeText = async (prompt, apiKey) => {
  // Request timeout handling
  const fetchWithTimeout = async (url, options, timeoutMs) => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
    try {
      const response = await fetch(url, { ...options, signal: controller.signal });
      clearTimeout(timeoutId);
      return response;
    } catch (err) {
      clearTimeout(timeoutId);
      if (err.name === 'AbortError') {
        throw new Error("Request timed out. Please try again.");
      }
      throw err;
    }
  };

  // Intent caching for performance
  const intentCache = new Map();
  const INTENT_CACHE_TTL = 10 * 60 * 1000;
};
```

## Database Architecture (PostgreSQL + Supabase)

### Schema Design

The database demonstrates relational modeling with proper normalization:

```sql
-- User Profiles (one-to-one with auth.users)
CREATE TABLE user_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE NOT NULL,
  username TEXT,
  email TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Private Recipes (user-owned)
CREATE TABLE private_recipes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  ingredients TEXT,
  instructions TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Public Recipes (community-shared)
CREATE TABLE public_recipes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  username TEXT,
  title TEXT NOT NULL,
  ingredients TEXT,
  instructions TEXT,
  likes_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Recipe Likes (many-to-many)
CREATE TABLE recipe_likes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  recipe_id UUID REFERENCES public_recipes(id) ON DELETE CASCADE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, recipe_id)
);

-- Recipe Comments
CREATE TABLE recipe_comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  recipe_id UUID REFERENCES public_recipes(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  username TEXT,
  comment TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

### Row Level Security (RLS)

Database-level security policies enforce access control:

```sql
-- Private recipes: owners only
CREATE POLICY "Users can view own recipes"
  ON private_recipes
  FOR SELECT
  USING (auth.uid() = user_id);

-- Public recipes: readable by all, writable by owner
CREATE POLICY "Anyone can view public recipes"
  ON public_recipes
  FOR SELECT
  USING (true);

CREATE POLICY "Users can update own public recipes"
  ON public_recipes
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);
```

### Database Triggers

Automatic timestamp updates and like count management:

```sql
-- Auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_user_profiles_updated_at 
  BEFORE UPDATE ON user_profiles
  FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

-- Auto-maintain like counts
CREATE OR REPLACE FUNCTION update_recipe_likes_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE public_recipes
    SET likes_count = likes_count + 1
    WHERE id = NEW.recipe_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE public_recipes
    SET likes_count = likes_count - 1
    WHERE id = OLD.recipe_id;
  END IF;
  RETURN NULL;
END;
$$ language 'plpgsql';
```

## Real-time Features

Supabase WebSocket subscriptions for live updates:

```javascript
// `client/src/components/recipes/PublicFeed.jsx`
const recipesChannel = supabase
  .channel('public_recipes_changes')
  .on(
    'postgres_changes',
    {
      event: '*',
      schema: 'public',
      table: 'public_recipes'
    },
    () => {
      fetchPublicRecipes(); // Re-fetch on any change
    }
  )
  .subscribe();
```

## Security Implementation

### CORS Configuration
```javascript
// server.js
const allowedOriginRegex =
  /^https:\/\/(?:[a-zA-Z0-9-]+\.)?chefbonbon\.netlify\.app$/;

app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    if (origin.startsWith("http://localhost:")) {
      return callback(null, true);
    }
    if (allowedOriginRegex.test(origin)) {
      callback(null, true);
    } else {
      callback(new Error("CORS policy violation"), false);
    }
  },
}));
```

### Input Sanitization
```javascript
const sanitizeIngredient = (ing) => {
  if (typeof ing !== "string") return "";
  return ing.replace(/[\x00-\x1F\x7F]/g, "").slice(0, 100);
};
```

### API Key Protection
- Claude API key stored only in backend environment
- Never exposed to frontend
- Frontend calls `/api/recipes` which proxies to Claude API

## UI/UX Patterns

### Optimistic Updates
```javascript
// `client/src/components/recipes/PublicFeed.jsx`
const handleLike = async (recipeId) => {
  // Immediately update UI before server responds
  setPublicRecipes((prev) =>
    prev.map((r) =>
      r.id === recipeId
        ? {
            ...r,
            hasLiked: !isCurrentlyLiked,
            likeCount: isCurrentlyLiked ? r.likeCount - 1 : r.likeCount + 1,
          }
        : r
    )
  );

  try {
    // Make actual API call
    if (isCurrentlyLiked) {
      await supabase.from('recipe_likes').delete()...
    } else {
      await supabase.from('recipe_likes').insert()...
    }
  } catch (err) {
    // Roll back on error
    setPublicRecipes((prev) => ...);
  }
};
```

### Firebase-Compatible Interface
The Supabase client wraps functionality to match Firebase API patterns for easier migration:

```javascript
// Add document to collection
export async function addDoc(tableName, data) {
  const { data: result, error } = await supabase
    .from(tableName)
    .insert(data)
    .select()
    .single();
  if (error) throw error;
  return { id: result.id, ...result };
}

// Get documents with filter
export async function getDocs(tableName, filters = {}) {
  let query = supabase.from(tableName).select();
  Object.entries(filters).forEach(([key, value]) => {
    query = query.eq(key, value);
  });
  const { data, error } = await query;
  return {
    docs: data.map(doc => ({ id: doc.id, data: () => doc })),
  };
}
```

## Deployment Configuration

### Netlify (Frontend)
```toml
[build]
  base = "client"
  command = "npm ci && npm run build"
  publish = "dist"
```

### Railway (Backend)
```json
{
  "build": { "builder": "NIXPACKS" },
  "deploy": {
    "startCommand": "node server.js",
    "restartPolicyType": "ON_FAILURE",
    "restartPolicyMaxRetries": 10
  }
}
```

## Technical Achievements

1. **Database Migration**: Complete migration from Firebase/Firestore (NoSQL) to Supabase/PostgreSQL (SQL) including:
   - Schema redesign for relational model
   - Data transformation from hierarchical to normalized
   - Auth migration from Firebase Auth to Supabase Auth
   - RLS policy implementation for security

2. **Security**: Multi-layer security approach:
   - Database-level RLS policies
   - Backend API key protection
   - CORS with regex validation
   - Input sanitization
   - Rate limiting

3. **Performance**:
   - Lazy loading for code splitting
   - Optimistic UI updates
   - Request timeouts
   - Intent caching for AI calls
   - Database indexes for query optimization

4. **Real-time**: Live updates via Supabase WebSocket subscriptions for:
   - New recipes in public feed
   - Like count changes
   - Comment updates

5. **Error Handling**:
   - Comprehensive try/catch blocks
   - User-friendly error messages
   - Timeout protection
   - Rollback on failed optimistic updates

## Skills Demonstrated

- React 19 with hooks and lazy loading
- Node.js/Express API development
- PostgreSQL database design
- Supabase (Auth, Database, Real-time)
- Anthropic Claude API integration
- Row Level Security
- WebSocket/Real-time features
- Security best practices (CORS, sanitization, rate limiting)
- Deployment (Netlify, Railway)
- Git version control

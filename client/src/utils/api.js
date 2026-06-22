const DEFAULT_API_BASE = 'http://localhost:3000/api';
const rawApiUrl = import.meta.env.VITE_API_URL || DEFAULT_API_BASE;
const normalizedBase = rawApiUrl.replace(/\/+$/, '');
const RECIPES_ENDPOINT = normalizedBase.endsWith('/recipes') ? normalizedBase : `${normalizedBase}/recipes`;

function parseLegacyRecipe(text) {
  if (typeof text !== 'string') return null;
  try {
    const parsed = JSON.parse(text);
    return parsed?.name && Array.isArray(parsed.ingredients) && Array.isArray(parsed.steps) ? parsed : null;
  } catch {
    return null;
  }
}

export async function getRecipeFromClaude(ingredients, cookingMethod = null, type = null) {
  let response;
  try {
    response = await fetch(RECIPES_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ingredients, cookingMethod, type }),
    });
  } catch (cause) {
    const error = new Error('Unable to connect to the recipe server.');
    error.isNetworkError = true;
    error.cause = cause;
    throw error;
  }

  if (!response.ok) {
    let message = `Server error: ${response.status}`;
    try {
      const errorData = await response.json();
      message = errorData?.error || message;
    } catch {
      // Keep the status-based message when a proxy returns non-JSON.
    }
    const error = new Error(message);
    error.status = response.status;
    throw error;
  }

  const data = await response.json();
  if (data?.recipe && typeof data.recipe === 'object' && !Array.isArray(data.recipe)) {
    return { recipeType: data.recipeType, recipe: data.recipe, raw: data.raw || JSON.stringify(data.recipe) };
  }

  const legacyRecipe = parseLegacyRecipe(data?.recipe);
  if (legacyRecipe) return { recipeType: data.recipeType, recipe: legacyRecipe, raw: data.recipe };
  if (typeof data?.recipe === 'string') return { recipeType: data.recipeType, recipe: data.recipe, raw: data.recipe, isRaw: true };

  throw new Error('The recipe server returned an invalid response.');
}

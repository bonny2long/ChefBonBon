const DEFAULT_API_BASE = 'http://localhost:3000/api';
const rawApiUrl = import.meta.env.VITE_API_URL || DEFAULT_API_BASE;

const normalizedBase = rawApiUrl.replace(/\/+$/, '');
const RECIPES_ENDPOINT = normalizedBase.endsWith('/recipes')
  ? normalizedBase
  : `${normalizedBase}/recipes`;

export async function getRecipeFromClaude(
  ingredients,
  cookingMethod = null,
  type = null
) {
  const response = await fetch(RECIPES_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      ingredients,
      cookingMethod,
      type
    })
  });

  if (!response.ok) {
    let message = `Server error: ${response.status}`;
    try {
      const errorData = await response.json();
      message = errorData?.error || message;
    } catch {
      // ignore parse error
    }
    const error = new Error(message);
    error.status = response.status;
    throw error;
  }

  return await response.json();
}

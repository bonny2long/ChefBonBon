export class RecipeContractError extends Error {
  constructor(message) {
    super(message);
    this.name = 'RecipeContractError';
  }
}

const isNonEmptyString = (value) => typeof value === 'string' && value.trim().length > 0;
const isNonNegativeNumber = (value) => typeof value === 'number' && Number.isFinite(value) && value >= 0;

function extractJson(text) {
  if (typeof text !== 'string' || !text.trim()) {
    throw new RecipeContractError('The AI returned an empty recipe.');
  }

  const trimmed = text.trim();
  const fencedMatch = trimmed.match(/^```(?:json)?\s*([\s\S]*?)\s*```$/i);
  return fencedMatch ? fencedMatch[1] : trimmed;
}

export function parseAndValidateRecipe(text) {
  let recipe;
  try {
    recipe = JSON.parse(extractJson(text));
  } catch {
    throw new RecipeContractError('The AI response was not valid JSON.');
  }

  if (!recipe || typeof recipe !== 'object' || Array.isArray(recipe)) {
    throw new RecipeContractError('The AI response was not a recipe object.');
  }

  const requiredTextFields = ['name', 'cookingMethod', 'difficulty', 'primaryIngredient'];
  for (const field of requiredTextFields) {
    if (!isNonEmptyString(recipe[field])) {
      throw new RecipeContractError(`Recipe field ${field} is missing.`);
    }
  }

  for (const field of ['prepTime', 'cookTime', 'servings']) {
    if (!isNonNegativeNumber(recipe[field]) || (field === 'servings' && recipe[field] < 1)) {
      throw new RecipeContractError(`Recipe field ${field} is invalid.`);
    }
  }

  if (!Array.isArray(recipe.ingredients) || recipe.ingredients.length === 0) {
    throw new RecipeContractError('Recipe ingredients are missing.');
  }
  if (!recipe.ingredients.every((ingredient) => (
    ingredient && typeof ingredient === 'object' && isNonEmptyString(ingredient.name) &&
    (typeof ingredient.quantity === 'number' || isNonEmptyString(ingredient.quantity)) &&
    typeof ingredient.unit === 'string'
  ))) {
    throw new RecipeContractError('One or more recipe ingredients are invalid.');
  }

  if (!Array.isArray(recipe.steps) || recipe.steps.length === 0 || !recipe.steps.every(isNonEmptyString)) {
    throw new RecipeContractError('Recipe steps are missing or invalid.');
  }

  if (recipe.description !== undefined && typeof recipe.description !== 'string') {
    throw new RecipeContractError('Recipe description is invalid.');
  }
  if (recipe.dietary !== undefined && (!Array.isArray(recipe.dietary) || !recipe.dietary.every(isNonEmptyString))) {
    throw new RecipeContractError('Recipe dietary tags are invalid.');
  }

  return {
    name: recipe.name.trim(),
    description: recipe.description?.trim() || '',
    cookingMethod: recipe.cookingMethod.trim(),
    prepTime: recipe.prepTime,
    cookTime: recipe.cookTime,
    servings: recipe.servings,
    difficulty: recipe.difficulty.trim(),
    dietary: recipe.dietary || [],
    ingredients: recipe.ingredients.map((ingredient) => ({
      name: ingredient.name.trim(),
      quantity: ingredient.quantity,
      unit: ingredient.unit.trim(),
    })),
    steps: recipe.steps.map((step) => step.trim()),
    primaryIngredient: recipe.primaryIngredient.trim(),
  };
}

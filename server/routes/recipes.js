import express from "express";
import { generateRecipeText } from "../services/claudeService.js";
import { parseAndValidateRecipe, RecipeContractError } from "../services/recipeContract.js";

const router = express.Router();
const MIN_INGREDIENTS = 4;

const sanitizeString = (value) => (
  typeof value === "string" ? value.replace(/[\x00-\x1F\x7F]/g, "").slice(0, 200) : ""
);
const sanitizeIngredient = (value) => sanitizeString(value).slice(0, 100);

function createRecipePrompt({ ingredients, recipeType, cookingMethod }) {
  const typeInstructions = recipeType === "drink"
    ? `You are Chef BonBon, a professional bartender. Use all listed ingredients. You may use ice, water, and simple syrup only when needed. Do not invent additional liquors. The cookingMethod must be "drink".`
    : `You are Chef BonBon, a precise recipe generator. Use all listed ingredients where practical. The cookingMethod must be "${cookingMethod}".`;

  return `
${typeInstructions}

IMPORTANT: Respond with ONLY valid JSON. Do not use Markdown or add explanatory text.

Ingredients: ${ingredients.join(", ")}

Return exactly this JSON shape:
{
  "name": "Recipe Name",
  "description": "Brief 1-2 sentence description",
  "cookingMethod": "${recipeType === "drink" ? "drink" : cookingMethod}",
  "prepTime": 10,
  "cookTime": 15,
  "servings": 2,
  "difficulty": "easy",
  "dietary": [],
  "ingredients": [{ "name": "ingredient name", "quantity": 1, "unit": "unit" }],
  "steps": ["Step instruction"],
  "primaryIngredient": "main ingredient"
}
`;
}

router.post("/recipes", async (req, res) => {
  try {
    const { ingredients: rawIngredients, cookingMethod: rawCookingMethod, type: rawType } = req.body;
    const recipeType = typeof rawType === "string" && ["food", "drink"].includes(rawType.toLowerCase())
      ? rawType.toLowerCase()
      : null;
    const cookingMethod = sanitizeString(rawCookingMethod);

    if (!Array.isArray(rawIngredients) || rawIngredients.length < MIN_INGREDIENTS) {
      return res.status(400).json({ error: `Please provide at least ${MIN_INGREDIENTS} ingredients.` });
    }

    const ingredients = rawIngredients.map(sanitizeIngredient).filter(Boolean).slice(0, 20);
    if (ingredients.length < MIN_INGREDIENTS) {
      return res.status(400).json({ error: `Please provide at least ${MIN_INGREDIENTS} valid ingredients.` });
    }
    if (!recipeType) return res.status(400).json({ error: "Recipe type must be food or drink." });
    if (recipeType === "food" && !cookingMethod) {
      return res.status(400).json({ error: "Cooking method is required for food recipes." });
    }

    const raw = await generateRecipeText(
      createRecipePrompt({ ingredients, recipeType, cookingMethod }),
      process.env.ANTHROPIC_API_KEY,
    );
    const recipe = parseAndValidateRecipe(raw);

    return res.json({ recipeType, recipe, raw });
  } catch (error) {
    if (error instanceof RecipeContractError) {
      console.warn("Invalid AI recipe response:", error.message);
      return res.status(502).json({ error: "The AI returned an invalid recipe. Please try again." });
    }
    console.error("Recipe route error:", error);
    return res.status(500).json({ error: "Unable to generate a recipe right now. Please try again." });
  }
});

export default router;

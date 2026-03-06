import express from "express";
import { generateRecipeText } from "../services/claudeService.js";

const router = express.Router();

const sanitizeString = (str) => {
  if (typeof str !== "string") return "";
  return str.replace(/[\x00-\x1F\x7F]/g, "").slice(0, 200);
};

const sanitizeIngredient = (ing) => {
  if (typeof ing !== "string") return "";
  return ing.replace(/[\x00-\x1F\x7F]/g, "").slice(0, 100);
};

router.post("/recipes", async (req, res) => {
  try {
    const rawIngredients = req.body.ingredients;
    const rawCookingMethod = req.body.cookingMethod;
    const rawType = req.body.type;

    const apiKey = process.env.ANTHROPIC_API_KEY;
    const normalizedType =
      (
        typeof rawType === "string" &&
        ["food", "drink"].includes(rawType.toLowerCase())
      ) ?
        rawType.toLowerCase()
      : null;
    const normalizedMethod = sanitizeString(rawCookingMethod);

    if (!Array.isArray(rawIngredients) || rawIngredients.length < 4) {
      return res.status(400).json({
        error: "Please provide at least 4 ingredients.",
      });
    }

    const ingredients = rawIngredients
      .map(sanitizeIngredient)
      .filter((ing) => ing.trim().length > 0)
      .slice(0, 20);

    if (ingredients.length < 4) {
      return res.status(400).json({
        error: "Please provide at least 4 valid ingredients.",
      });
    }

    if (!normalizedType || !["food", "drink"].includes(normalizedType)) {
      return res.status(400).json({
        error: "Recipe type must be food or drink",
      });
    }

    if (normalizedType === "drink") {
      const prompt = `
You are Chef BonBon, a professional bartender.

Ingredients:
${ingredients.join(", ")}

Allowed staples:
- ice
- water
- simple syrup (only if needed)

Rules:
- Use all listed ingredients
- Do NOT invent additional liquors

Format:

Drink Name:
Ingredients:
- item with amount

Steps:
1. step

Glass:
Why this works:
- brief explanation
`;
      const recipeText = await generateRecipeText(prompt, apiKey);
      return res.json({ recipeType: "drink", recipe: recipeText });
    }

    if (!normalizedMethod) {
      return res.status(400).json({
        error: "Cooking method required for food recipes",
      });
    }

    const prompt = `
You are Chef BonBon, a thoughtful home cook.

Ingredients:
${ingredients.join(", ")}

Allowed pantry staples:
- oil, salt, pepper, garlic, water

Cooking method:
${normalizedMethod}

Rules:
- Use all listed ingredients
- Respect the cooking method

Format:

Recipe Name:
Ingredients:
- item with amount

Steps:
1. step

Cooking Tips:
- tips specific to ${normalizedMethod}

Why this works:
- short explanation
`;
    const recipeText = await generateRecipeText(prompt, apiKey);
    return res.json({ recipeType: "food", recipe: recipeText });
  } catch (error) {
    console.error("Recipe route error:", error);
    res.status(500).json({
      error: error.message,
      stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
    });
  }
});

export default router;

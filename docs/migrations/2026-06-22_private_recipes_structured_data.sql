-- Chef BonBon V2 structured private-recipe storage
-- Apply in the Supabase SQL Editor before relying on structured saves.

ALTER TABLE private_recipes
  ADD COLUMN IF NOT EXISTS recipe_type TEXT NOT NULL DEFAULT 'food',
  ADD COLUMN IF NOT EXISTS cooking_method TEXT,
  ADD COLUMN IF NOT EXISTS primary_ingredient TEXT,
  ADD COLUMN IF NOT EXISTS recipe_json JSONB,
  ADD COLUMN IF NOT EXISTS raw_model_output TEXT;

ALTER TABLE private_recipes
  ADD CONSTRAINT private_recipes_recipe_type_check
  CHECK (recipe_type IN ('food', 'drink')) NOT VALID;

ALTER TABLE private_recipes
  VALIDATE CONSTRAINT private_recipes_recipe_type_check;

CREATE INDEX IF NOT EXISTS idx_private_recipes_user_recipe_type
  ON private_recipes (user_id, recipe_type);

CREATE INDEX IF NOT EXISTS idx_private_recipes_user_primary_ingredient
  ON private_recipes (user_id, primary_ingredient);

// client/src/components/recipes/SavedRecipes.jsx
// Phase 5 - Saved Recipes Grid

import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import FoodIcon from '../ui/FoodIcon';
import RecipeDetail from './RecipeDetail';

const parseIngredients = (value) => { try { return typeof value === 'string' ? JSON.parse(value) : value || []; } catch { return []; } };
const getStructuredRecipe = (recipe) => recipe.recipe_json && typeof recipe.recipe_json === 'object' ? recipe.recipe_json : null;
const getRecipeType = (recipe) => recipe.recipe_type || (/(drink|cocktail|smoothie)/i.test(recipe.title || '') ? 'drink' : 'food');

export default function SavedRecipes({ userId, onGoHomeClick }) {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const [selectedRecipe, setSelectedRecipe] = useState(null);

  useEffect(() => {
    if (!userId) {
      setRecipes([]);
      setLoading(false);
      setError("Please log in to view your saved recipes.");
      return;
    }

    const fetchRecipes = async () => {
      setLoading(true);
      setError('');
      try {
        const { data, error } = await supabase
          .from('private_recipes')
          .select('*')
          .eq('user_id', userId)
          .order('created_at', { ascending: false });

        if (error) throw error;

        const parsedRecipes = data.map((recipe) => {
          const structured = getStructuredRecipe(recipe);
          const ingredients = structured?.ingredients || parseIngredients(recipe.ingredients);
          return {
            ...recipe,
            structured,
            ingredients,
            recipeType: getRecipeType(recipe),
            cookingMethod: structured?.cookingMethod || recipe.cooking_method || 'stovetop',
            primaryIngredient: structured?.primaryIngredient || (Array.isArray(ingredients) ? (typeof ingredients[0] === 'object' ? ingredients[0]?.name : ingredients[0]) : 'recipe'),
            ingredientCount: Array.isArray(ingredients) ? ingredients.length : 0,
            createdAt: new Date(recipe.created_at),
          };
        });

        setRecipes(parsedRecipes);
      } catch (err) {
        console.error("Error fetching recipes:", err);
        setError("Failed to load recipes.");
      } finally {
        setLoading(false);
      }
    };

    fetchRecipes();
  }, [userId]);

  const handleDeleteRecipe = async (recipeId) => {
    if (!userId) return;
    try {
      await supabase
        .from('private_recipes')
        .delete()
        .eq('id', recipeId)
        .eq('user_id', userId);
      
      setRecipes(recipes.filter(r => r.id !== recipeId));
    } catch (err) {
      console.error("Error deleting:", err);
    }
  };

  const filters = [
    { id: 'all', label: 'All' },
    { id: 'food', label: 'Food' },
    { id: 'drink', label: 'Drinks' },
  ];

  if (loading) {
    return (
      <div className="p-4 w-full max-w-md mx-auto">
        <p className="text-center text-gray-500 mt-8">Loading your recipes...</p>
      </div>
    );
  }

  return (
    <main className="p-4 w-full max-w-md mx-auto pb-24">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-medium text-olive">Your saved recipes</h2>
        {recipes.length > 0 && (
          <span className="text-xs px-2 py-1 rounded-full bg-warm text-gray-600">
            {recipes.length} saved
          </span>
        )}
      </div>

      {error && <p className="text-sm text-rust mb-3">{error}</p>}
      <div className="saved-filters flex gap-2 mb-4">
        {filters.map((filter) => (
          <button
            key={filter.id}
            onClick={() => setActiveFilter(filter.id)}
            className="px-3 py-1.5 rounded-full text-xs font-medium transition-colors"
            style={{
              backgroundColor: activeFilter === filter.id ? '#3B4A2F' : 'transparent',
              color: activeFilter === filter.id ? '#FFFFFF' : '#888888',
              border: activeFilter === filter.id ? 'none' : '1px solid #E8E5E0',
            }}
          >
            {filter.label}
          </button>
        ))}
      </div>

      {recipes.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12">
          <FoodIcon name="recipe" size={64} showPlaceholder={false} />
          <p className="text-center text-gray-500 mt-4 mb-2">No saved recipes yet</p>
          <button
            onClick={onGoHomeClick}
            className="px-6 py-2.5 rounded-full text-white text-sm font-medium"
            style={{ backgroundColor: '#3B4A2F' }}
          >
            Generate your first recipe
          </button>
        </div>
      ) : (
        <div className="saved-grid grid grid-cols-2 gap-2.5">
          {recipes.map((recipe) => {
            const firstIng = recipe.primaryIngredient || 'recipe';
            if (activeFilter !== 'all' && recipe.recipeType !== activeFilter) return null;

            return (
              <div
                key={recipe.id}
                className="saved-card bg-white rounded-xl border border-gray-200 overflow-hidden cursor-pointer"
                onClick={() => setSelectedRecipe(recipe)}
              >
                <div
                  className="saved-card-thumb h-20 flex items-center justify-center"
                  style={{ backgroundColor: '#F0EBE0' }}
                >
                  <FoodIcon name={firstIng} size={52} />
                </div>
                <div className="p-2">
                  <h3 className="text-sm font-medium text-gray-800 truncate mb-1">
                    {recipe.title || 'Untitled'}
                  </h3>
                  <div className="flex items-center gap-1">
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-warm text-gray-500">
                      {recipe.cookingMethod}
                    </span>
                    <span className="text-[10px] text-gray-400">
                      {recipe.ingredientCount} ing
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {selectedRecipe && (
        <div 
          className="fixed inset-0 flex items-center justify-center z-50 p-4"
          style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
          onClick={() => setSelectedRecipe(null)}
        >
          <div 
            className="bg-white rounded-xl max-w-md w-full max-h-[80vh] overflow-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-4 border-b border-gray-100 flex items-center justify-between">
              <h3 className="text-base font-medium text-olive">{selectedRecipe.title}</h3>
              <button onClick={() => setSelectedRecipe(null)} className="text-gray-400 text-xl">Ãƒâ€”</button>
            </div>
            <div className="p-4">{selectedRecipe.structured ? <RecipeDetail recipeData={selectedRecipe.structured} onClose={() => setSelectedRecipe(null)} readOnly /> : <pre className="text-sm text-gray-700 whitespace-pre-wrap">{selectedRecipe.instructions}</pre>}</div>
            <div className="p-4 border-t border-gray-100 flex gap-2">
              <button
                onClick={() => setSelectedRecipe(null)}
                className="flex-1 py-2.5 rounded-full text-white text-sm font-medium"
                style={{ backgroundColor: '#3B4A2F' }}
              >
                Close
              </button>
              <button
                onClick={() => {
                  handleDeleteRecipe(selectedRecipe.id);
                  setSelectedRecipe(null);
                }}
                className="px-4 py-2.5 rounded-full border border-red-500 text-red-500 text-sm"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

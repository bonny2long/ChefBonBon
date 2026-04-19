// src/components/recipes/Main.jsx
// Phase 3 - Home Screen Redesign

import React, { useState, useEffect, useRef } from 'react';
import FoodIcon from '../ui/FoodIcon';
import LoadingSpinner from '../ui/LoadingSpinner';
import { getRecipeFromClaude } from '../../utils/api';
import { supabase } from '../../lib/supabase';

const COOKING_METHODS = [
  { id: 'stovetop', label: 'Stovetop' },
  { id: 'oven', label: 'Oven' },
  { id: 'air fryer', label: 'Air Fryer' },
  { id: 'grill', label: 'Grill' },
  { id: 'no-cook', label: 'No-cook' },
  { id: 'drink', label: 'Drink' },
];

export default function Main({ userId, showMessageModal, onViewSaved }) {
  const [ingredients, setIngredients] = useState([]);
  const [cookingMethod, setCookingMethod] = useState('stovetop');
  const [recipe, setRecipe] = useState('');
  const [recipeName, setRecipeName] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('');
  const [saveStatus, setSaveStatus] = useState('');
  const [recentRecipes, setRecentRecipes] = useState([]);
  const [showBrowser, setShowBrowser] = useState(false);
  const [selectedRecent, setSelectedRecent] = useState(null);
  const inputRef = useRef(null);

  const recipeMode = sessionStorage.getItem('recipeContext');
  const isDrinkMode = recipeMode?.includes('drink');

  useEffect(() => {
    if (userId) {
      fetchRecentRecipes();
    }
  }, [userId]);

  useEffect(() => {
    const resetHandler = () => {
      setIngredients([]);
      setRecipe('');
      setRecipeName('');
      setSaveStatus('');
      setLoading(false);
      setLoadingMessage('');
    };
    window.addEventListener('recipe-mode-reset', resetHandler);
    return () => window.removeEventListener('recipe-mode-reset', resetHandler);
  }, []);

  const fetchRecentRecipes = async () => {
    if (!userId) return;
    try {
      const { data } = await supabase
        .from('private_recipes')
        .select('id, title, ingredients, instructions, created_at')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(5);
      setRecentRecipes(data || []);
    } catch (err) {
      console.error('Error fetching recent recipes:', err);
    }
  };

  const addIngredient = (name) => {
    const trimmed = name.trim();
    if (!trimmed) return;
    if (!ingredients.includes(trimmed)) {
      setIngredients([...ingredients, trimmed]);
    }
    if (inputRef.current) inputRef.current.value = '';
  };

  const removeIngredient = (index) => {
    setIngredients(ingredients.filter((_, i) => i !== index));
  };

  const handleGenerate = async () => {
    if (ingredients.length < 2) {
      showMessageModal('Missing Ingredients', 'Please add at least 2 ingredients.');
      return;
    }

    setLoading(true);
    setLoadingMessage('Checking your ingredients...');
    const stage1 = setTimeout(() => setLoadingMessage('Finding the perfect match...'), 1600);
    const stage2 = setTimeout(() => setLoadingMessage('Writing your recipe...'), 3800);
    const stage3 = setTimeout(() => setLoadingMessage('Almost ready...'), 5800);

    try {
      const result = await getRecipeFromClaude(
        ingredients,
        isDrinkMode ? null : cookingMethod,
        isDrinkMode ? 'drink' : 'food'
      );
      setRecipe(result.recipe);
    } catch (error) {
      console.error(error);
      let userMessage = 'Failed to generate recipe. Please try again.';
      if (error.isNetworkError) {
        userMessage = 'Unable to connect to the server.';
      } else if (error.status === 500) {
        userMessage = 'Server is temporarily unavailable.';
      }
      setRecipe(userMessage);
    } finally {
      clearTimeout(stage1);
      clearTimeout(stage2);
      clearTimeout(stage3);
      setLoading(false);
      setLoadingMessage('');
    }
  };

  const handleSaveRecipe = async () => {
    if (!userId) {
      setSaveStatus('Please log in to save recipes.');
      return;
    }
    if (!recipeName.trim()) {
      setSaveStatus('Please name your recipe before saving.');
      return;
    }
    
    // Get displayable recipe text - handles both JSON and raw string
    let displayText = '';
    if (typeof recipe === 'object' && recipe.steps) {
      // It's structured JSON - convert to display text
      displayText = `${recipe.name || recipeName}\n\n`;
      displayText += `Ingredients:\n`;
      recipe.ingredients?.forEach(ing => {
        displayText += `- ${ing.quantity} ${ing.unit} ${ing.name}\n`;
      });
      displayText += `\nSteps:\n`;
      recipe.steps?.forEach((step, i) => {
        displayText += `${i + 1}. ${step}\n`;
      });
    } else {
      displayText = typeof recipe === 'string' ? recipe : JSON.stringify(recipe);
    }
    
    setSaveStatus('Saving...');
    try {
      const { error } = await supabase.from('private_recipes').insert({
        user_id: userId,
        title: recipeName.trim(),
        ingredients: JSON.stringify(ingredients),
        instructions: displayText,
        created_at: new Date().toISOString(),
      });
      if (error) throw error;
      setSaveStatus('Recipe saved!');
      fetchRecentRecipes();
    } catch (error) {
      console.error('Save error:', error);
      setSaveStatus('Failed to save.');
    }
  };

  const handleNewRecipe = () => {
    setIngredients([]);
    setRecipe('');
    setRecipeName('');
    setSaveStatus('');
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) return 'Good morning';
    if (hour >= 12 && hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  const getUserName = () => {
    const stored = sessionStorage.getItem('recipeContext');
    try {
      const parsed = JSON.parse(stored);
      return parsed?.userName || 'there';
    } catch {
      return 'there';
    }
  };

  return (
    <main className="recipe-builder-shell p-4 md:p-6 w-full mx-auto pb-32">
      <div className="mb-4">
        <p className="text-sm text-gray-500">{getGreeting()}</p>
        <h1 className="text-lg font-medium text-olive">What are we cooking with?</h1>
      </div>

      <div className="mb-4">
        <p className="text-xs text-gray-400 mb-2">Cooking method</p>
        <div className="recipe-methods">
          {COOKING_METHODS.map((method) => {
            const isActive = isDrinkMode
              ? method.id === 'drink'
              : cookingMethod === method.id;
            return (
              <button
                key={method.id}
                onClick={() => {
                  if (method.id === 'drink') {
                    sessionStorage.setItem('recipeContext', JSON.stringify({ type: 'drink' }));
                  } else {
                    sessionStorage.setItem('recipeContext', JSON.stringify({ type: 'food', cookingMethod: method.id }));
                  }
                  setCookingMethod(method.id);
                  window.dispatchEvent(new Event('recipe-mode-changed'));
                }}
                className="recipe-method-chip px-4 py-2 rounded-full text-sm whitespace-nowrap transition-colors"
                style={{
                  backgroundColor: isActive ? '#3B4A2F' : '#FFFFFF',
                  color: isActive ? '#FFFFFF' : '#555555',
                  border: isActive ? 'none' : '1px solid #E8E5E0',
                }}
              >
                {method.label}
              </button>
            );
          })}
        </div>
      </div>

      {!recipe && (
        <div className="recipe-builder-card bg-white rounded-xl border border-gray-200 p-4 mb-4">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-6 h-6 rounded bg-gold flex items-center justify-center">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#1A1A1A" strokeWidth="2">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
              </svg>
            </div>
            <span className="text-xs text-gray-500">We'll build a recipe from these</span>
          </div>

          {ingredients.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-3">
              {ingredients.map((ing, index) => (
                <div
                  key={index}
                  className="flex items-center gap-2 px-3 py-2 rounded-full bg-tag-bg border border-warm"
                >
                  <FoodIcon name={ing} size={24} />
                  <span className="text-sm text-gray-700">{ing}</span>
                  <button
                    onClick={() => removeIngredient(index)}
                    className="text-gray-400 hover:text-gray-600 text-lg"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}

          <input
            ref={inputRef}
            type="text"
            placeholder="Type an ingredient..."
            className="w-full text-base p-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-olive bg-transparent"
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ',') {
                e.preventDefault();
                addIngredient(e.target.value);
              }
            }}
            onBlur={(e) => {
              if (e.target.value.trim()) {
                addIngredient(e.target.value);
              }
            }}
          />

          <button
            onClick={() => setShowBrowser(true)}
            className="text-xs text-olive underline mt-2"
          >
            Browse ingredients
          </button>

          <button
            onClick={handleGenerate}
            disabled={loading || ingredients.length < 2}
            className="w-full mt-4 py-2.5 rounded-full text-white text-sm font-medium transition-colors"
            style={{
              backgroundColor: loading || ingredients.length < 2 ? '#CCCCCC' : '#3B4A2F',
            }}
          >
            {loading ? 'Generating...' : 'Generate Recipe →'}
          </button>
        </div>
      )}

      <div
        className="rounded-lg p-4 mb-4 cursor-pointer"
        style={{ backgroundColor: '#F5C842' }}
        onClick={() => {
          // Navigate to scan - handled by BottomNav
        }}
      >
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[8px] uppercase text-gray-700 mb-0.5">New · AI Food Scanner</p>
            <p className="text-sm font-medium text-gray-800">Snap a dish to get its recipe</p>
          </div>
          <div className="w-10 h-10 rounded-full bg-white/50 flex items-center justify-center">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#3B4A2F" strokeWidth="2">
              <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
              <circle cx="12" cy="13" r="4"/>
            </svg>
          </div>
        </div>
      </div>

      {recentRecipes.length > 0 && (
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-sm font-medium text-olive">Recent recipes</h2>
            <button onClick={onViewSaved} className="text-xs text-gray-500">See all →</button>
          </div>
          <div className="space-y-2">
            {recentRecipes.map((rec) => {
            let firstIng = 'recipe';
            try {
              const parsed = typeof rec.ingredients === 'string' ? JSON.parse(rec.ingredients) : rec.ingredients;
              firstIng = Array.isArray(parsed) && parsed.length > 0 ? parsed[0] : 'recipe';
            } catch {}
            return (
              <div
                key={rec.id}
                className="flex items-center gap-3 p-2 bg-warm rounded-lg cursor-pointer"
                onClick={() => setSelectedRecent(rec)}
              >
                <FoodIcon name={firstIng} size={40} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-800 truncate">{rec.title}</p>
                  <p className="text-xs text-gray-400">
                    {new Date(rec.created_at).toLocaleDateString()}
                  </p>
                </div>
</div>
              )}
            )}
          </div>
        </div>
      )}

      {selectedRecent && (
        <div 
          className="fixed inset-0 flex items-center justify-center z-50 p-4"
          style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
          onClick={() => setSelectedRecent(null)}
        >
          <div 
            className="bg-white rounded-xl max-w-md w-full max-h-[80vh] overflow-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-4 border-b border-gray-100 flex items-center justify-between">
              <h3 className="text-base font-medium text-olive">{selectedRecent.title}</h3>
              <button onClick={() => setSelectedRecent(null)} className="text-gray-400 text-xl">×</button>
            </div>
            <div className="p-4">
              <pre className="text-sm text-gray-700 whitespace-pre-wrap">
                {selectedRecent.instructions || selectedRecent.title || 'No recipe content'}
              </pre>
            </div>
            <div className="p-4 border-t border-gray-100">
              <button
                onClick={() => setSelectedRecent(null)}
                className="w-full py-2.5 rounded-full text-white text-sm font-medium"
                style={{ backgroundColor: '#3B4A2F' }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {loading && <LoadingSpinner message={loadingMessage} />}

      {recipe && (
        <RecipeDetail
          recipeData={typeof recipe === 'object' ? recipe : null}
          rawRecipe={typeof recipe === 'string' ? recipe : null}
          onClose={handleNewRecipe}
          onSave={handleSaveRecipe}
          onRegenerate={handleGenerate}
        />
      )}
    </main>
  );
}

function RecipeDetail({ recipeData, rawRecipe, onClose, onSave, onRegenerate }) {
  const [activeTab, setActiveTab] = useState('detail');
  const [servings, setServings] = useState(recipeData?.servings || 2);

  const isStructured = recipeData?.name && recipeData?.ingredients;

  const {
    name = 'Generated Recipe',
    description = '',
    cookingMethod = 'stovetop',
    prepTime = 0,
    cookTime = 0,
    servings: baseServings = 2,
    difficulty = 'easy',
    dietary = [],
    ingredients = [],
    steps = [],
    primaryIngredient = '',
  } = recipeData || {};

  const scaleFactor = baseServings > 0 ? servings / baseServings : 1;

  const tabs = [
    { id: 'detail', label: 'Detail' },
    { id: 'ingredients', label: 'Ingredients' },
    { id: 'steps', label: 'Steps' },
  ];

  return (
    <div className="recipe-detail bg-white rounded-xl overflow-hidden">
      <div
        className="recipe-hero p-8 flex items-center justify-center"
        style={{ backgroundColor: '#F0EBE0', minHeight: '120px' }}
      >
        <FoodIcon name={primaryIngredient} size={64} />
      </div>

      <div className="p-4">
        <div className="flex items-center justify-between mb-2">
          <button onClick={onClose} className="text-gray-500">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 12H5M12 19l-7-7 7-7"/>
            </svg>
          </button>
          <button className="text-rust">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.23l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 20.77l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
            </svg>
          </button>
        </div>

        <h2 className="text-base font-medium text-center text-olive mb-2">
          {name}
        </h2>
        <div className="flex items-center justify-center gap-2 mb-4">
          <span className="text-xs px-2 py-0.5 rounded-full bg-warm text-gray-600">
            {cookingMethod}
          </span>
          <span className="text-xs text-gray-400">
            {prepTime + cookTime} min
          </span>
        </div>

        <div className="recipe-tabs flex gap-1 mb-4">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className="flex-1 py-2 rounded-full text-xs font-medium transition-colors"
              style={{
                backgroundColor: activeTab === tab.id ? '#F5C842' : 'transparent',
                color: activeTab === tab.id ? '#1A1A1A' : '#888888',
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {activeTab === 'detail' && (
          <div className="recipe-detail-content">
            {isStructured ? (
              <>
                <p className="text-sm text-gray-600 mb-4">{description}</p>
                <div className="flex flex-wrap gap-2">
                  <span className="text-xs px-2 py-1 rounded bg-warm text-gray-600">
                    Prep: {prepTime} min
                  </span>
                  <span className="text-xs px-2 py-1 rounded bg-warm text-gray-600">
                    Cook: {cookTime} min
                  </span>
                  <span className="text-xs px-2 py-1 rounded bg-warm text-gray-600">
                    {servings} servings
                  </span>
                  <span className="text-xs px-2 py-1 rounded bg-warm text-gray-600">
                    {difficulty}
                  </span>
                </div>
                {dietary?.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-3">
                    {dietary.map((tag) => (
                      <span key={tag} className="text-xs px-2 py-1 rounded bg-gold/30 text-gray-700">
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </>
            ) : (
              <pre className="whitespace-pre-wrap text-sm text-gray-700">{rawRecipe}</pre>
            )}
          </div>
        )}

        {activeTab === 'ingredients' && isStructured && (
          <div className="recipe-ingredients">
            <div className="flex items-center justify-center gap-4 mb-4">
              <button
                onClick={() => setServings(Math.max(1, servings - 1))}
                className="w-8 h-8 rounded-full bg-warm text-olive font-medium"
              >
                −
              </button>
              <span className="text-sm font-medium">{servings}</span>
              <button
                onClick={() => setServings(servings + 1)}
                className="w-8 h-8 rounded-full bg-warm text-olive font-medium"
              >
                +
              </button>
            </div>
            <div className="space-y-3">
              {ingredients?.map((ing, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between py-2 border-b border-gray-100"
                >
                  <div className="flex items-center gap-3">
                    <FoodIcon name={ing.name} size={36} />
                    <span className="text-sm text-gray-700">{ing.name}</span>
                  </div>
                  <span className="text-sm text-gray-400">
                    {Math.round(ing.quantity * scaleFactor)} {ing.unit}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'steps' && isStructured && (
          <div className="recipe-steps space-y-4">
            {steps?.map((step, index) => (
              <div key={index} className="flex gap-3">
                <div className="w-6 h-6 rounded-full bg-olive text-white text-xs flex items-center justify-center flex-shrink-0">
                  {index + 1}
                </div>
                <p className="text-sm text-gray-700">{step}</p>
              </div>
            ))}
          </div>
        )}

        <div className="recipe-actions mt-4 pt-4 border-t border-gray-100 space-y-2">
          <button
            onClick={onRegenerate}
            className="w-full py-2.5 rounded-full bg-olive text-white text-sm font-medium"
          >
            Regenerate
          </button>
        </div>
      </div>
    </div>
  );
}

// client/src/components/recipes/RecipeDetail.jsx
// Phase 4 - Structured Recipe Output

import React, { useState } from 'react';
import FoodIcon from '../ui/FoodIcon';

export default function RecipeDetail({
  recipeData,
  onClose,
  onSave,
  onRegenerate,
  rawRecipe,
}) {
  const [activeTab, setActiveTab] = useState('detail');
  const [servings, setServings] = useState(recipeData?.servings || 2);

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

  const scaleFactor = servings / baseServings;

  const tabs = [
    { id: 'detail', label: 'Detail' },
    { id: 'ingredients', label: 'Ingredients' },
    { id: 'steps', label: 'Steps' },
  ];

  if (!recipeData && rawRecipe) {
    return (
      <div className="recipe-detail bg-white rounded-xl overflow-hidden p-4">
        <button onClick={onClose} className="text-gray-500 mb-4">Back</button>
        <h2 className="text-base font-medium text-center text-olive mb-4">Generated Recipe</h2>
        <pre className="text-sm text-gray-700 whitespace-pre-wrap">{rawRecipe}</pre>
        <div className="recipe-actions mt-4 pt-4 border-t border-gray-100 space-y-2">
          <button onClick={onRegenerate} className="w-full py-2.5 rounded-full bg-olive text-white text-sm font-medium">Regenerate</button>
          <button onClick={() => onSave?.(null, rawRecipe)} className="w-full py-2.5 rounded-full border border-olive text-olive text-sm font-medium">Save Recipe</button>
        </div>
      </div>
    );
  }
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
          </div>
        )}

        {activeTab === 'ingredients' && (
          <div className="recipe-ingredients">
            <div className="flex items-center justify-center gap-4 mb-4">
              <button
                onClick={() => setServings(Math.max(1, servings - 1))}
                className="w-8 h-8 rounded-full bg-warm text-olive font-medium"
              >
                âˆ’
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

        {activeTab === 'steps' && (
          <div className="recipe-steps space-y-4">
            {steps?.map((step, index) => (
              <div key={index} className="flex gap-3">
                <div
                  className="w-6 h-6 rounded-full bg-olive text-white text-xs flex items-center justify-center flex-shrink-0"
                >
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
          <button
            onClick={() => onSave?.(recipeData)}
            className="w-full py-2.5 rounded-full border border-olive text-olive text-sm font-medium"
          >
            Save Recipe
          </button>
        </div>
      </div>
    </div>
  );
}

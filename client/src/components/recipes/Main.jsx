import React, { useCallback, useEffect, useRef, useState } from 'react';
import FoodIcon from '../ui/FoodIcon';
import LoadingSpinner from '../ui/LoadingSpinner';
import RecipeDetail from './RecipeDetail';
import { getRecipeFromClaude } from '../../utils/api';
import { supabase } from '../../lib/supabase';

const MIN_INGREDIENTS = 4;
const METHODS = ['stovetop', 'oven', 'air fryer', 'grill', 'no-cook', 'drink'];

const formatRecipe = (recipe, title) => {
  if (typeof recipe === 'string') return recipe;
  if (!recipe) return '';
  return [recipe.name || title, recipe.description, 'Ingredients:', ...(recipe.ingredients || []).map(({ name, quantity, unit }) => `- ${[quantity, unit, name].filter(Boolean).join(' ')}`), 'Steps:', ...(recipe.steps || []).map((step, index) => `${index + 1}. ${step}`)].filter(Boolean).join('\n');
};

export default function Main({ userId, showMessageModal, onViewSaved, onGoScan }) {
  const [ingredients, setIngredients] = useState([]);
  const [cookingMethod, setCookingMethod] = useState('stovetop');
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('');
  const [recentRecipes, setRecentRecipes] = useState([]);
  const [selectedRecent, setSelectedRecent] = useState(null);
  const inputRef = useRef(null);
  const isDrinkMode = sessionStorage.getItem('recipeContext')?.includes('drink');
  const fetchRecentRecipes = useCallback(async () => {
    if (!userId) return setRecentRecipes([]);
    try {
      const { data, error } = await supabase.from('private_recipes').select('id, title, ingredients, instructions, created_at').eq('user_id', userId).order('created_at', { ascending: false }).limit(5);
      if (error) throw error;
      setRecentRecipes(data || []);
    } catch (error) { console.error('Error fetching recent recipes:', error); }
  }, [userId]);
  useEffect(() => { fetchRecentRecipes(); }, [fetchRecentRecipes]);
  const addIngredient = (value) => {
    const ingredient = value.trim();
    if (!ingredient) return;
    setIngredients((current) => current.includes(ingredient) ? current : [...current, ingredient]);
    if (inputRef.current) inputRef.current.value = '';
  };
  const handleGenerate = async () => {
    if (ingredients.length < MIN_INGREDIENTS) return showMessageModal('More Ingredients Needed', `Add at least ${MIN_INGREDIENTS} ingredients for a better recipe.`);
    setLoading(true); setLoadingMessage('Creating your recipe...');
    try {
      const result = await getRecipeFromClaude(ingredients, isDrinkMode ? null : cookingMethod, isDrinkMode ? 'drink' : 'food');
      setRecipe(result.recipe);
    } catch (error) {
      console.error('Recipe generation error:', error);
      showMessageModal('Recipe Generation Failed', error.message || 'Please try again.');
    } finally { setLoading(false); setLoadingMessage(''); }
  };
  const handleSaveRecipe = async (recipeData, rawRecipe) => {
    if (!userId) return showMessageModal('Sign In Required', 'Please log in to save recipes.');
    const title = recipeData?.name?.trim() || 'Generated Recipe';
    try {
      const { error } = await supabase.from('private_recipes').insert({ user_id: userId, title, ingredients: JSON.stringify(ingredients), instructions: formatRecipe(recipeData || rawRecipe || recipe, title), created_at: new Date().toISOString() });
      if (error) throw error;
      await fetchRecentRecipes();
      showMessageModal('Recipe Saved', `${title} is available in Saved recipes.`);
    } catch (error) {
      console.error('Save error:', error);
      showMessageModal('Save Failed', 'We could not save this recipe. Please try again.');
    }
  };
  const greeting = new Date().getHours() < 12 ? 'Good morning' : new Date().getHours() < 18 ? 'Good afternoon' : 'Good evening';
  return <main className="recipe-builder-shell p-4 md:p-6 w-full mx-auto pb-32">
    <div className="mb-4"><p className="text-sm text-gray-500">{greeting}</p><h1 className="text-lg font-medium text-olive">What are we cooking with?</h1></div>
    <div className="mb-4"><p className="text-xs text-gray-400 mb-2">Cooking method</p><div className="recipe-methods">{METHODS.map((method) => {
      const active = isDrinkMode ? method === 'drink' : cookingMethod === method;
      return <button key={method} onClick={() => { sessionStorage.setItem('recipeContext', JSON.stringify(method === 'drink' ? { type: 'drink' } : { type: 'food', cookingMethod: method })); setCookingMethod(method); window.dispatchEvent(new Event('recipe-mode-changed')); }} className="recipe-method-chip px-4 py-2 rounded-full text-sm whitespace-nowrap transition-colors" style={{ backgroundColor: active ? '#3B4A2F' : '#FFFFFF', color: active ? '#FFFFFF' : '#555555', border: active ? 'none' : '1px solid #E8E5E0' }}>{method.replace(/\b\w/g, (letter) => letter.toUpperCase())}</button>;
    })}</div></div>
    {!recipe && <div className="recipe-builder-card bg-white rounded-xl border border-gray-200 p-4 mb-4">
      <p className="text-xs text-gray-500 mb-3">Add {MIN_INGREDIENTS}+ ingredients for a better recipe.</p>
      {ingredients.length > 0 && <div className="flex flex-wrap gap-2 mb-3">{ingredients.map((ingredient, index) => <div key={ingredient} className="flex items-center gap-2 px-3 py-2 rounded-full bg-tag-bg border border-warm"><FoodIcon name={ingredient} size={24} /><span className="text-sm text-gray-700">{ingredient}</span><button aria-label={`Remove ${ingredient}`} onClick={() => setIngredients((current) => current.filter((_, i) => i !== index))} className="text-gray-400 hover:text-gray-600 text-lg">×</button></div>)}</div>}
      <input ref={inputRef} type="text" placeholder="Type an ingredient..." className="w-full text-base p-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-olive bg-transparent" onKeyDown={(event) => { if (event.key === 'Enter' || event.key === ',') { event.preventDefault(); addIngredient(event.target.value); } }} onBlur={(event) => addIngredient(event.target.value)} />
      <button onClick={handleGenerate} disabled={loading || ingredients.length < MIN_INGREDIENTS} className="w-full mt-4 py-2.5 rounded-full text-white text-sm font-medium transition-colors" style={{ backgroundColor: loading || ingredients.length < MIN_INGREDIENTS ? '#CCCCCC' : '#3B4A2F' }}>{loading ? 'Generating...' : 'Generate Recipe →'}</button>
    </div>}
    <button type="button" className="rounded-lg p-4 mb-4 cursor-pointer w-full text-left" style={{ backgroundColor: '#F5C842' }} onClick={onGoScan}><p className="text-[8px] uppercase text-gray-700 mb-0.5">New · AI Food Scanner</p><p className="text-sm font-medium text-gray-800">Snap a dish to get its recipe</p></button>
    {recentRecipes.length > 0 && <div className="mb-4"><div className="flex items-center justify-between mb-2"><h2 className="text-sm font-medium text-olive">Recent recipes</h2><button onClick={onViewSaved} className="text-xs text-gray-500">See all →</button></div><div className="space-y-2">{recentRecipes.map((recentRecipe) => <button key={recentRecipe.id} className="flex items-center gap-3 p-2 bg-warm rounded-lg cursor-pointer w-full text-left" onClick={() => setSelectedRecent(recentRecipe)}><FoodIcon name="recipe" size={40} /><div className="flex-1 min-w-0"><p className="text-sm font-medium text-gray-800 truncate">{recentRecipe.title}</p><p className="text-xs text-gray-400">{new Date(recentRecipe.created_at).toLocaleDateString()}</p></div></button>)}</div></div>}
    {selectedRecent && <div className="fixed inset-0 flex items-center justify-center z-50 p-4" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }} onClick={() => setSelectedRecent(null)}><div className="bg-white rounded-xl max-w-md w-full max-h-[80vh] overflow-auto" onClick={(event) => event.stopPropagation()}><div className="p-4 border-b border-gray-100 flex items-center justify-between"><h3 className="text-base font-medium text-olive">{selectedRecent.title}</h3><button aria-label="Close" onClick={() => setSelectedRecent(null)} className="text-gray-400 text-xl">×</button></div><pre className="p-4 text-sm text-gray-700 whitespace-pre-wrap">{selectedRecent.instructions || selectedRecent.title}</pre></div></div>}
    {loading && <LoadingSpinner message={loadingMessage} />}
    {recipe && <RecipeDetail recipeData={typeof recipe === 'object' ? recipe : null} rawRecipe={typeof recipe === 'string' ? recipe : null} onClose={() => { setIngredients([]); setRecipe(null); }} onSave={handleSaveRecipe} onRegenerate={handleGenerate} />}
  </main>;
}

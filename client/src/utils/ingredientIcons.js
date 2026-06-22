// client/src/utils/ingredientIcons.js
// Maps ingredient names to local food icon paths
// Fallback: null triggers FoodIcon component to show initial circle

const BASE = '/src/assets/food';

export const INGREDIENT_ICONS = {
  // ============================================
  // PROTEINS
  // ============================================

  // Poultry
  'chicken':              `${BASE}/Proteins/chicken-breast-raw.png`,
  'chicken breast':      `${BASE}/Proteins/chicken-breast-raw.png`,
  'chicken thigh':       `${BASE}/Proteins/chicken-thigh-raw.png`,
  'turkey':              `${BASE}/Proteins/turkey-breast-raw.png`,
  'duck':                `${BASE}/Proteins/duck-breast-raw.png`,

  // Red Meat
  'beef':                `${BASE}/Proteins/beef-steak-raw.png`,
  'steak':               `${BASE}/Proteins/beef-steak-raw.png`,
  'ground beef':         `${BASE}/Proteins/beef-mince-raw.png`,
  'beef mince':          `${BASE}/Proteins/beef-mince-raw.png`,
  'minced beef':         `${BASE}/Proteins/beef-mince-raw.png`,
  'lamb':                `${BASE}/Proteins/lamb-chop-raw.png`,
  'pork':                `${BASE}/Proteins/pork-chop-raw.png`,
  'pork chop':          `${BASE}/Proteins/pork-chop-raw.png`,
  'bacon':              `${BASE}/Proteins/bacon-raw.png`,

  // Seafood
  'salmon':              `${BASE}/Proteins/salmon-fillet-raw.png`,
  'tuna':                `${BASE}/Proteins/tuna-steak-raw.png`,
  'cod':                 `${BASE}/Proteins/cod-fillet-raw.png`,
  'shrimp':              `${BASE}/Proteins/shrimp.png`,
  'prawns':             `${BASE}/Proteins/shrimp.png`,
  'crab':               `${BASE}/Proteins/crab.png`,
  'lobster':            `${BASE}/Proteins/lobster.png`,
  'mussels':            `${BASE}/Proteins/mussels.png`,
  'sardines':           `${BASE}/Proteins/sardines.png`,
  'anchovies':          `${BASE}/Proteins/anchovies-fresh.png`,
  'halibut':            `${BASE}/Proteins/halibut-steak-raw.png`,
  'mackerel':          `${BASE}/Proteins/mackerel.png`,

  // Plant Proteins
  'tofu':                `${BASE}/Proteins/tofu.png`,
  'tempeh':              `${BASE}/Proteins/tempeh.png`,
  'lentils':             `${BASE}/Proteins/lentils.png`,
  'chickpeas':          `${BASE}/Proteins/chickpeas.png`,
  'black beans':        `${BASE}/Proteins/black-beans.png`,
  'kidney beans':       `${BASE}/Proteins/kidney-beans.png`,
  'edamame':            `${BASE}/Proteins/edamame.png`,

  // Eggs & Dairy
  'egg':                 `${BASE}/Proteins/egg.png`,
  'eggs':                `${BASE}/Proteins/egg.png`,
  'cheese':             `${BASE}/Proteins/cheese.png`,
  'butter':             `${BASE}/Proteins/butter.png`,
  'milk':               `${BASE}/Proteins/milk.png`,
  'cream':              `${BASE}/Proteins/cream.png`,
  'mozzarella':         `${BASE}/Proteins/mozzarella.png`,
  'parmesan':           `${BASE}/Proteins/parmessan.png`,
  'cheddar':            `${BASE}/Proteins/cheddar.png`,

  // ============================================
  // VEGETABLES
  // ============================================

  // Alliums
  'garlic':              `${BASE}/Vegetables/garlic.png`,
  'onion':               `${BASE}/Vegetables/onion.png`,
  'onions':              `${BASE}/Vegetables/onion.png`,
  'shallot':             `${BASE}/Vegetables/shallot.png`,
  'spring onion':       `${BASE}/Vegetables/spring-onion.png`,
  'leek':                `${BASE}/Vegetables/leek.png`,

  // Leafy
  'spinach':            `${BASE}/Vegetables/spinach.png`,
  'kale':                `${BASE}/Vegetables/kale.png`,
  'lettuce':            `${BASE}/Vegetables/lettuce.png`,
  'cabbage':            `${BASE}/Vegetables/cabbage.png`,
  'bok choy':           `${BASE}/Vegetables/bok-choy.png`,
  'arugula':            `${BASE}/Vegetables/arugula.png`,
  'swiss chard':        `${BASE}/Vegetables/swiss-chard.png`,

  // Root
  'carrot':             `${BASE}/Vegetables/carrot.png`,
  'potato':             `${BASE}/Vegetables/potato.png`,
  'potatoes':           `${BASE}/Vegetables/potato.png`,
  'sweet potato':       `${BASE}/Vegetables/sweet-potato.png`,
  'beetroot':           `${BASE}/Vegetables/beetroot.png`,
  'turnip':             `${BASE}/Vegetables/turnip.png`,
  'parsnip':            `${BASE}/Vegetables/parsnip.png`,
  'radish':             `${BASE}/Vegetables/radish.png`,

  // Brassica
  'broccoli':           `${BASE}/Vegetables/broccoli.png`,
  'cauliflower':        `${BASE}/Vegetables/cauliflower.png`,
  'brussels sprouts':  `${BASE}/Vegetables/brussels-sprouts.png`,

  // Nightshade
  'tomato':             `${BASE}/Vegetables/tomato.png`,
  'tomatoes':           `${BASE}/Vegetables/tomato.png`,
  'bell pepper':        `${BASE}/Vegetables/bell-pepper-red.png`,
  'pepper':            `${BASE}/Vegetables/bell-pepper-red.png`,
  'red pepper':        `${BASE}/Vegetables/bell-pepper-red.png`,
  'green pepper':      `${BASE}/Vegetables/bell-pepper-green.png`,
  'yellow pepper':    `${BASE}/Vegetables/bell-pepper-yellow.png`,
  'eggplant':          `${BASE}/Vegetables/eggplant.png`,
  'chili':             `${BASE}/Vegetables/chili-pepper.png`,
  'chili pepper':      `${BASE}/Vegetables/chili-pepper.png`,

  // Squash
  'zucchini':           `${BASE}/Vegetables/zucchini.png`,
  'butternut squash':  `${BASE}/Vegetables/butternut-squash.png`,
  'pumpkin':           `${BASE}/Vegetables/pumpkin.png`,
  'cucumber':          `${BASE}/Vegetables/cucumber.png`,

  // Other
  'mushroom':          `${BASE}/Vegetables/mushroom.png`,
  'mushrooms':         `${BASE}/Vegetables/mushroom.png`,
  'corn':               `${BASE}/Vegetables/corn.png`,
  'asparagus':         `${BASE}/Vegetables/asparagus.png`,
  'celery':            `${BASE}/Vegetables/celery.png`,
  'peas':              `${BASE}/Vegetables/peas.png`,
  'artichoke':         `${BASE}/Vegetables/artichoke.png`,
  'avocado':           `${BASE}/Vegetables/avocado.png`,

  // ============================================
  // GRAINS & CARBS
  // ============================================

  // Rice
  'rice':               `${BASE}/Grains_Carbs/rice.png`,
  'jasmine rice':       `${BASE}/Grains_Carbs/jasmine-rice.png`,
  'brown rice':        `${BASE}/Grains_Carbs/brown-rice.png`,
  'sushi rice':        `${BASE}/Grains_Carbs/sushi-rice.png`,

  // Pasta
  'pasta':             `${BASE}/Grains_Carbs/pasta.png`,
  'spaghetti':         `${BASE}/Grains_Carbs/spaghetti.png`,
  'penne':             `${BASE}/Grains_Carbs/penne.png`,
  'fettuccine':        `${BASE}/Grains_Carbs/fettuccine.png`,
  'lasagna':           `${BASE}/Grains_Carbs/lasagna-sheet.png`,

  // Bread
  'bread':             `${BASE}/Grains_Carbs/bread.png`,
  'sourdough':        `${BASE}/Grains_Carbs/sourdough.png`,
  'pita':             `${BASE}/Grains_Carbs/pita.png`,
  'tortilla':          `${BASE}/Grains_Carbs/tortilla.png`,
  'naan':              `${BASE}/Grains_Carbs/naan.png`,
  'baguette':          `${BASE}/Grains_Carbs/baguette.png`,
  'bagel':             `${BASE}/Grains_Carbs/bagel.png`,

  // Other Grains
  'oats':              `${BASE}/Grains_Carbs/oats.png`,
  'quinoa':            `${BASE}/Grains_Carbs/quinoa.png`,
  'couscous':          `${BASE}/Grains_Carbs/couscous.png`,
  'flour':             `${BASE}/Grains_Carbs/flour.png`,
  'noodles':           `${BASE}/Grains_Carbs/noodles.png`,

  // ============================================
  // FRUITS
  // ============================================

  // Citrus
  'lemon':             `${BASE}/Fruits/lemon.png`,
  'lime':              `${BASE}/Fruits/lime.png`,
  'orange':            `${BASE}/Fruits/orange.png`,
  'grapefruit':       `${BASE}/Fruits/grapefruit.png`,

  // Tropical
  'mango':             `${BASE}/Fruits/mango.png`,
  'pineapple':         `${BASE}/Fruits/pineapple.png`,
  'banana':            `${BASE}/Fruits/banana.png`,
  'coconut':           `${BASE}/Fruits/coconut.png`,
  'papaya':           `${BASE}/Fruits/papaya.png`,
  'passion fruit':     `${BASE}/Fruits/passion-fruit.png`,

  // Berries
  'strawberry':        `${BASE}/Fruits/strawberry.png`,
  'blueberry':         `${BASE}/Fruits/blueberry.png`,
  'raspberry':        `${BASE}/Fruits/raspberry.png`,
  'blackberry':        `${BASE}/Fruits/blackberry.png`,

  // Other
  'apple':            `${BASE}/Fruits/apple.png`,
  'pear':             `${BASE}/Fruits/pear.png`,
  'grape':            `${BASE}/Fruits/grape.png`,
  'watermelon':        `${BASE}/Fruits/watermelon.png`,
  'pomegranate':       `${BASE}/Fruits/pomegranate.png`,
  'fig':              `${BASE}/Fruits/fig.png`,

  // ============================================
  // HERBS & SPICES
  // ============================================

  // Fresh Herbs
  'basil':             `${BASE}/Herbs_and_Spices/basil.png`,
  'cilantro':          `${BASE}/Herbs_and_Spices/cilantro.png`,
  'parsley':          `${BASE}/Herbs_and_Spices/parsley.png`,
  'thyme':             `${BASE}/Herbs_and_Spices/thyme.png`,
  'rosemary':         `${BASE}/Herbs_and_Spices/rosemary.png`,
  'mint':             `${BASE}/Herbs_and_Spices/mint.png`,
  'sage':             `${BASE}/Herbs_and_Spices/sage.png`,
  'dill':             `${BASE}/Herbs_and_Spices/dill.png`,
  'chives':           `${BASE}/Herbs_and_Spices/chives.png`,

  // Dried Spices
  'cumin':             `${BASE}/Herbs_and_Spices/cumin.png`,
  'paprika':          `${BASE}/Herbs_and_Spices/paprika.png`,
  'turmeric':          `${BASE}/Herbs_and_Spices/turmeric.png`,
  'cinnamon':         `${BASE}/Herbs_and_Spices/cinnamon.png`,
  'chili powder':     `${BASE}/Herbs_and_Spices/chili-powder.png`,
  'black pepper':     `${BASE}/Herbs_and_Spices/black-pepper.png`,
  'coriander':        `${BASE}/Herbs_and_Spices/coriander.png`,
  'cardamom':         `${BASE}/Herbs_and_Spices/cardamom.png`,
  'oregano':          `${BASE}/Herbs_and_Spices/oregano.png`,
  'garlic powder':   `${BASE}/Herbs_and_Spices/garlic-powder.png`,
  'onion powder':    `${BASE}/Herbs_and_Spices/onion-powder.png`,

  // Blends
  'curry powder':    `${BASE}/Herbs_and_Spices/curry-powder.png`,
  'garam masala':     `${BASE}/Herbs_and_Spices/garam-masala.png`,
  'za\'atar':        `${BASE}/Herbs_and_Spices/za-atar.png`,
  'cajun seasoning': `${BASE}/Herbs_and_Spices/cajun-seasoning.png`,
  'italian seasoning':`${BASE}/Herbs_and_Spices/italian-seasoning.png`,
  'chili crisp':     `${BASE}/Herbs_and_Spices/chili-crisp.png`,

  // ============================================
  // CONDIMENTS & SAUCES
  // ============================================

  // Oils
  'olive oil':        `${BASE}/Condiments_and_Sauces/olive-oil.png`,
  'sesame oil':       `${BASE}/Condiments_and_Sauces/sesame-oil.png`,
  'coconut oil':      `${BASE}/Condiments_and_Sauces/coconut-oil.png`,
  'vegetable oil':    `${BASE}/Condiments_and_Sauces/vegetable-oil.png`,
  'oil':              `${BASE}/Condiments_and_Sauces/vegetable-oil.png`,

  // Vinegars
  'apple cider vinegar':`${BASE}/Condiments_and_Sauces/apple-cider-vinegar.png`,
  'balsamic vinegar': `${BASE}/Condiments_and_Sauces/balsamic-vinegar.png`,
  'rice vinegar':    `${BASE}/Condiments_and_Sauces/rice-vinegar.png`,

  // Sauces
  'soy sauce':        `${BASE}/Condiments_and_Sauces/soy-sauce.png`,
  'fish sauce':      `${BASE}/Condiments_and_Sauces/fish-sauce.png`,
  'oyster sauce':    `${BASE}/Condiments_and_Sauces/oyster-sauce.png`,
  'hot sauce':       `${BASE}/Condiments_and_Sauces/hot-sauce.png`,
  'worcestershire':   `${BASE}/Condiments_and_Sauces/worcestershire-sauce.png`,
  'hoisin sauce':    `${BASE}/Condiments_and_Sauces/hoisin-sauce.png`,
  'tahini':          `${BASE}/Condiments_and_Sauces/tahini.png`,
  'tomato paste':    `${BASE}/Condiments_and_Sauces/tomato-paste.png`,
  'tomato sauce':    `${BASE}/Condiments_and_Sauces/tomato-sauce.png`,

  // Spreads
  'mayonnaise':      `${BASE}/Condiments_and_Sauces/mayonnaise.png`,
  'mustard':         `${BASE}/Condiments_and_Sauces/mustard.png`,
  'ketchup':        `${BASE}/Condiments_and_Sauces/ketchup.png`,
  'honey':           `${BASE}/Condiments_and_Sauces/honey.png`,
  'maple syrup':     `${BASE}/Condiments_and_Sauces/maple-syrup.png`,
  'peanut butter':   `${BASE}/Condiments_and_Sauces/peanut-butter.png`,
  'jam':             `${BASE}/Condiments_and_Sauces/jam.png`,

  // ============================================
  // DAIRY ALTERNATIVES
  // ============================================

  'almond milk':      `${BASE}/Dairy_alternatives/almond-milk.png`,
  'oat milk':        `${BASE}/Dairy_alternatives/oat-milk.png`,
  'coconut milk':    `${BASE}/Dairy_alternatives/coconut-milk.png`,
  'soy milk':        `${BASE}/Dairy_alternatives/soy-milk.png`,
  'coconut cream':   `${BASE}/Dairy_alternatives/coconut-cream.png`,
  'cashew cream':    `${BASE}/Dairy_alternatives/cashew-cream.png`,

  // ============================================
  // BAKING
  // ============================================

  'all purpose flour':`${BASE}/Baking/all-purpose-flour.png`,
  'flour (baking)':  `${BASE}/Baking/all-purpose-flour.png`,
  'sugar':            `${BASE}/Baking/sugar.png`,
  'brown sugar':     `${BASE}/Baking/brown-sugar.png`,
  'powdered sugar':  `${BASE}/Baking/powdered-sugar.png`,
  'baking soda':    `${BASE}/Baking/baking-soda.png`,
  'baking powder':   `${BASE}/Baking/baking-powder.png`,
  'cocoa powder':    `${BASE}/Baking/cocoa-powder.png`,
  'cornstarch':       `${BASE}/Baking/cornstarch.png`,
  'yeast':           `${BASE}/Baking/yeast.png`,
  'salt':            `${BASE}/Baking/salt.png`,

  // ============================================
  // DRINKS
  // ============================================

  'water':            `${BASE}/Drinks/water.png`,
  'coconut water':    `${BASE}/Drinks/coconut-water.png`,
  'orange juice':    `${BASE}/Drinks/orange-juice.png`,
  'apple juice':    `${BASE}/Drinks/apple-juice.png`,
  'coffee':          `${BASE}/Drinks/coffee.png`,
  'tea':             `${BASE}/Drinks/tea.png`,
  'matcha':          `${BASE}/Drinks/matcha.png`,
  'ginger':          `${BASE}/Drinks/ginger.png`,
};

/**
 * Get the icon path for an ingredient name
 * @param {string} name - Ingredient name
 * @returns {string|null} Icon path or null if not found
 */
export function getIngredientIcon(name = '') {
  if (!name) return null;

  const key = name.toLowerCase().trim();

  // Exact match first
  if (INGREDIENT_ICONS[key]) {
    return INGREDIENT_ICONS[key];
  }

  // Try a few common variations
  const variations = [
    key + 's', // plural
    key.replace(/s$/, ''), // singular
  ];

  for (const variant of variations) {
    if (INGREDIENT_ICONS[variant]) {
      return INGREDIENT_ICONS[variant];
    }
  }

  // Smart partial match - check any word in the name for common ingredients
  const words = key.split(/[\s,-]+/);
  for (const word of words) {
    if (word.length > 2 && INGREDIENT_ICONS[word]) {
      return INGREDIENT_ICONS[word];
    }
  }

  // Fallback: check if any key words partially match
  for (const word of words) {
    for (const k of Object.keys(INGREDIENT_ICONS)) {
      if (k.includes(word) || word.includes(k)) {
        return INGREDIENT_ICONS[k];
      }
    }
  }

  return null;
}

/**
 * Preload common icons for faster initial render
 * Call this on app mount
 */
export function preloadCommonIcons() {
  const commonIcons = [
    'chicken',
    'beef',
    'salmon',
    'tofu',
    'egg',
    'butter',
    'cheese',
    'milk',
    'garlic',
    'onion',
    'tomato',
    'potato',
    'carrot',
    'spinach',
    'mushroom',
    'bell pepper',
    'rice',
    'pasta',
    'bread',
    'lemon',
    'lime',
    'orange',
    'basil',
    'cilantro',
    'olive oil',
    'soy sauce',
    'honey',
  ];

  commonIcons.forEach(name => {
    const path = getIngredientIcon(name);
    if (path) {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'image';
      link.href = path;
      document.head.appendChild(link);
    }
  });
}

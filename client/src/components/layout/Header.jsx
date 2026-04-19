// src/components/layout/Header.jsx
import React, { useState, useEffect } from "react";

const getRecipeMode = () => {
  const stored = sessionStorage.getItem("recipeContext");
  if (!stored) return "food";

  try {
    const parsed = JSON.parse(stored);
    return parsed?.type === "drink" ? "drink" : "food";
  } catch {
    return stored === "drink" ? "drink" : "food";
  }
};

export default function Header({ userId, userName }) {
  const [recipeMode, setRecipeMode] = useState(getRecipeMode);

  useEffect(() => {
    const syncRecipeMode = () => setRecipeMode(getRecipeMode());
    window.addEventListener("recipe-mode-reset", syncRecipeMode);
    window.addEventListener("recipe-mode-changed", syncRecipeMode);

    return () => {
      window.removeEventListener("recipe-mode-reset", syncRecipeMode);
      window.removeEventListener("recipe-mode-changed", syncRecipeMode);
    };
  }, []);

  const handleChangeMode = () => {
    const newMode = recipeMode === "food" ? "drink" : "food";
    sessionStorage.setItem("recipeContext", JSON.stringify({ type: newMode }));
    setRecipeMode(newMode);
    window.dispatchEvent(new Event("recipe-mode-changed"));
  };

  return (
    <header
      className="w-full bg-cream px-4 py-3 flex items-center justify-between border-b border-warm sticky top-0 z-40"
      style={{ height: '52px' }}
    >
      {/* Left - Logo */}
      <div className="flex items-center gap-2">
        <span className="text-xl font-medium text-olive">
          Chef BonBon
        </span>
      </div>

      {/* Right - Mode Badge */}
      <button
        onClick={handleChangeMode}
        className="px-3 py-1 rounded-full text-xs font-medium transition-colors"
        style={{
          backgroundColor: recipeMode === "drink" ? "#F5C842" : "#3B4A2F",
          color: recipeMode === "drink" ? "#1A1A1A" : "#FFFFFF",
        }}
      >
        {recipeMode === "drink" ? "Drink" : "Food"}
      </button>
    </header>
  );
}

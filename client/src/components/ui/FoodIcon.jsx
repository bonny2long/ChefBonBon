// client/src/components/ui/FoodIcon.jsx
// Reusable food ingredient icon component with fallback

import React from 'react';
import { getIngredientIcon } from '../../utils/ingredientIcons';

export default function FoodIcon({
  name = '',
  size = 32,
  className = '',
  showPlaceholder = true,
}) {
  const iconPath = getIngredientIcon(name);

  // If we have an icon, render the image
  if (iconPath) {
    return (
      <img
        src={iconPath}
        alt={name}
        className={`object-contain ${className}`}
        style={{
          width: size,
          height: size,
        }}
        onError={(e) => {
          e.target.style.display = 'none';
          if (e.target.nextSibling) {
            e.target.nextSibling.style.display = 'flex';
          }
        }}
      />
    );
  }

  // No icon found - show placeholder or initials
  if (!showPlaceholder) return null;

  // Get initials from name (first letter of first 2 words)
  const words = name?.split(/[\s,-]+/).filter(Boolean) || [];
  let display = '?';
  if (words.length >= 2) {
    display = (words[0][0] + words[1][0]).toUpperCase();
  } else if (words.length === 1 && words[0].length > 0) {
    display = words[0][0].toUpperCase();
  }

  return (
    <div
      className={className}
      style={{
        width: size,
        height: size,
        backgroundColor: '#E8E5E0',
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: size * 0.4,
        fontWeight: '600',
        color: '#3B4A2F',
        fontFamily: 'Inter, sans-serif',
      }}
      title={name}
    >
      {display}
    </div>
  );
}

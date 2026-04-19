// client/src/components/layout/BottomNav.jsx
// Bottom tab navigation for mobile app

import React from 'react';
import homeIcon from '../../assets/bottom_nav/home.png';
import savedIcon from '../../assets/bottom_nav/saved_files.png';
import scanIcon from '../../assets/bottom_nav/camera.png';
import accountIcon from '../../assets/bottom_nav/account.png';

export default function BottomNav({ currentTab = 'home', onTabChange }) {
  const tabs = [
    { id: 'home', label: 'Home', icon: homeIcon, activeIcon: homeIcon },
    { id: 'saved', label: 'Saved', icon: savedIcon, activeIcon: savedIcon },
    { id: 'scan', label: 'Scan', icon: scanIcon, activeIcon: scanIcon },
    { id: 'account', label: 'Account', icon: accountIcon, activeIcon: accountIcon },
  ];

  return (
    <nav className="bottom-nav fixed bottom-0 left-0 right-0 bg-white border-t border-warm flex justify-around items-center z-50"
         style={{ height: '60px', paddingBottom: 'env(safe-area-inset-bottom)' }}>
      {tabs.map((tab) => {
        const isActive = currentTab === tab.id;
        const iconToUse = isActive ? tab.activeIcon : tab.icon;

        return (
          <button
            key={tab.id}
            onClick={() => onTabChange?.(tab.id)}
            className="flex flex-col items-center justify-center"
            style={{
              minWidth: '44px',
              minHeight: '44px',
            }}
          >
            {isActive && (
              <div
                className="w-1 h-1 rounded-full mb-1"
                style={{ backgroundColor: '#3B4A2F' }}
              />
            )}
            <img
              src={iconToUse}
              alt={tab.label}
              width="22"
              height="22"
              style={{ objectFit: 'contain' }}
            />
            <span
              className="text-[9px] mt-0.5"
              style={{ color: isActive ? '#3B4A2F' : '#BBBBBB' }}
            >
              {tab.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
}
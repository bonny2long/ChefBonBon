import React from 'react';

function NavIcon({ tabId, active }) {
  const common = { width: 22, height: 22, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 1.8, strokeLinecap: 'round', strokeLinejoin: 'round', 'aria-hidden': true };
  if (tabId === 'home') return <svg {...common}><path d="m3 10 9-7 9 7v10a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1Z" /></svg>;
  if (tabId === 'saved') return <svg {...common}><path d="M6 3h12a1 1 0 0 1 1 1v17l-7-4-7 4V4a1 1 0 0 1 1-1Z" fill={active ? 'currentColor' : 'none'} /></svg>;
  if (tabId === 'scan') return <svg {...common}><path d="M4 7h3l1.5-2h7L17 7h3a1 1 0 0 1 1 1v11a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V8a1 1 0 0 1 1-1Z" /><circle cx="12" cy="13" r="3.5" /></svg>;
  return <svg {...common}><circle cx="12" cy="8" r="4" /><path d="M4 21a8 8 0 0 1 16 0" /></svg>;
}

export default function BottomNav({ currentTab = 'home', onTabChange }) {
  const tabs = [
    { id: 'home', label: 'Home' },
    { id: 'saved', label: 'Saved' },
    { id: 'scan', label: 'Scan' },
    { id: 'account', label: 'Account' },
  ];

  return (
    <nav className="bottom-nav fixed bottom-0 left-0 right-0 bg-white border-t border-warm flex justify-around items-center z-50" style={{ height: '60px', paddingBottom: 'env(safe-area-inset-bottom)' }}>
      {tabs.map((tab) => {
        const isActive = currentTab === tab.id;
        return (
          <button key={tab.id} onClick={() => onTabChange?.(tab.id)} className="flex flex-col items-center justify-center" style={{ minWidth: '44px', minHeight: '44px', color: isActive ? '#3B4A2F' : '#BBBBBB' }}>
            {isActive && <div className="w-1 h-1 rounded-full mb-1 bg-olive" />}
            <NavIcon tabId={tab.id} active={isActive} />
            <span className="text-[9px] mt-0.5">{tab.label}</span>
          </button>
        );
      })}
    </nav>
  );
}

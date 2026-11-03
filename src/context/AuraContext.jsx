import React, { createContext, useContext, useState, useEffect } from 'react';

export const AURAS = [
  {
    id: 'dusk',
    name: 'Dusk',
    label: 'Obsidian & Amber Gold',
    badge: 'Nocturnal Atelier',
    color: '#E2B26A',
    bg: '#0A0A09'
  },
  {
    id: 'mist',
    name: 'Mist',
    label: 'Warm Alabaster & Sage',
    badge: 'Morning Daylight',
    color: '#4E6852',
    bg: '#F4F0E6'
  },
  {
    id: 'nocturne',
    name: 'Nocturne',
    label: 'Midnight Indigo & Violet',
    badge: 'Biophotonic Night',
    color: '#818CF8',
    bg: '#080A12'
  },
  {
    id: 'peony',
    name: 'Peony',
    label: 'Peat & Terracotta Rose',
    badge: 'Botanical Clay',
    color: '#F472B6',
    bg: '#120A0D'
  }
];

const AuraContext = createContext(null);

export function AuraProvider({ children }) {
  const [aura, setAuraState] = useState(() => {
    try {
      const saved = localStorage.getItem('verenne-aura');
      if (saved && AURAS.some((a) => a.id === saved)) return saved;
    } catch {}
    return 'dusk';
  });

  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    document.documentElement.dataset.aura = aura;
    try {
      localStorage.setItem('verenne-aura', aura);
    } catch {}
  }, [aura]);

  const setAura = (id) => {
    if (AURAS.some((a) => a.id === id)) {
      setAuraState(id);
    }
  };

  const currentAura = AURAS.find((a) => a.id === aura) || AURAS[0];

  return (
    <AuraContext.Provider
      value={{
        aura,
        setAura,
        currentAura,
        auras: AURAS,
        isOpen,
        setIsOpen
      }}
    >
      {children}
    </AuraContext.Provider>
  );
}

export function useAura() {
  const context = useContext(AuraContext);
  if (!context) {
    throw new Error('useAura must be used within an AuraProvider');
  }
  return context;
}


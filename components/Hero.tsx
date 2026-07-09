"use client";

import { useState } from 'react';
import { useApp } from '@/lib/context';
import { Search } from 'lucide-react';
import { suggestions } from '@/lib/data';

export default function Hero() {
  const { setSearchQuery, setCurrentPage } = useApp();
  const [localQuery, setLocalQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);

  const filteredSuggestions = suggestions.filter(s =>
    s.title.toLowerCase().includes(localQuery.toLowerCase()) ||
    s.vehicle.toLowerCase().includes(localQuery.toLowerCase())
  );

  const handleSearch = () => {
    setSearchQuery(localQuery);
    setCurrentPage('pieces');
  };

  return (
    <div className="text-center py-8 md:py-12 px-5">
      <div className="text-4xl md:text-5xl mb-4">ðŸ”§</div>
      <h1 className="text-2xl md:text-3xl font-extrabold mb-2.5">Vos pieces auto en un clic</h1>
      <p className="text-text-muted text-sm md:text-[15px]">Demandez un devis ou recherchez directement nos pieces en stock</p>

      <div className="bg-bg-card border-2 border-accent-red rounded-2xl p-1.5 flex gap-2 max-w-[700px] mx-auto mt-6 md:mt-8">
        <input
          type="text"
          value={localQuery}
          onChange={(e) => { setLocalQuery(e.target.value); setShowSuggestions(true); }}
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          placeholder="Rechercher une piece (ex: Kit embrayage, Disque frein...)"
          className="flex-1 bg-transparent border-none px-4 md:px-5 py-3 md:py-3.5 text-text text-sm md:text-[15px] outline-none placeholder:text-text-muted"
        />
        <button
          onClick={handleSearch}
          className="bg-accent-red text-white px-4 md:px-8 py-2.5 md:py-3.5 rounded-xl font-bold text-xs md:text-sm hover:bg-accent-red-hover transition-colors flex items-center gap-1.5 md:gap-2"
        >
          <Search size={16} /> <span className="hidden md:inline">RECHERCHER</span>
        </button>
      </div>

      {showSuggestions && localQuery.length > 0 && filteredSuggestions.length > 0 && (
        <div className="max-w-[700px] mx-auto -mt-2 md:-mt-4 mb-6 md:mb-8">
          {filteredSuggestions.map((s, i) => (
            <div
              key={i}
              onClick={() => { setLocalQuery(s.title); setShowSuggestions(false); handleSearch(); }}
              className="bg-bg-card border border-border-custom rounded-xl px-4 md:px-5 py-3 md:py-3.5 mb-2 flex items-center gap-2 md:gap-2.5 text-xs md:text-sm cursor-pointer hover:border-accent-red hover:bg-bg-card-hover transition-all"
            >
              <span className="text-accent-orange text-sm md:text-base">âš¡</span>
              <strong className="text-text">{s.title}</strong>
              <span className="text-text-muted">- {s.vehicle}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

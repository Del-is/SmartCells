import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, X, Volume2, ChevronLeft, ChevronRight, Info, Sparkles, Filter } from 'lucide-react';
import { PERIODIC_ELEMENTS, ELEMENT_CATEGORIES, getCategoryStyles, ElementData } from '../data/periodicTableData';
import { cn } from '../lib/utils';

interface PeriodicTableToolProps {
  playSound: (type: 'click' | 'success' | 'fail' | 'pop' | 'whoosh') => void;
}

export function PeriodicTableTool({ playSound }: PeriodicTableToolProps) {
  const [selectedNumber, setSelectedNumber] = useState<number | null>(6); // Default Carbon
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [activePhase, setActivePhase] = useState<string>('all');

  const selectedElement = useMemo(() => {
    if (!selectedNumber) return null;
    return PERIODIC_ELEMENTS.find(e => e.number === selectedNumber) || null;
  }, [selectedNumber]);

  // Filtering elements based on query, category, and phase
  const matchedElementNumbers = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    const set = new Set<number>();

    PERIODIC_ELEMENTS.forEach(el => {
      const matchQuery = !q || 
        el.name.toLowerCase().includes(q) || 
        el.symbol.toLowerCase() === q ||
        el.symbol.toLowerCase().startsWith(q) ||
        String(el.number) === q;

      const matchCategory = activeCategory === 'all' || el.category === activeCategory;
      const matchPhase = activePhase === 'all' || el.phase.toLowerCase() === activePhase.toLowerCase();

      if (matchQuery && matchCategory && matchPhase) {
        set.add(el.number);
      }
    });

    return set;
  }, [searchQuery, activeCategory, activePhase]);

  const handleSelectElement = (elem: ElementData) => {
    setSelectedNumber(elem.number);
    playSound('pop');
  };

  const handleSpeak = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.95;
      window.speechSynthesis.speak(utterance);
      playSound('click');
    }
  };

  const navigateElement = (delta: number) => {
    if (!selectedNumber) return;
    const nextNum = ((selectedNumber - 1 + delta + 118) % 118) + 1;
    setSelectedNumber(nextNum);
    playSound('click');
  };

  return (
    <div className="space-y-6 w-full max-w-7xl mx-auto">
      {/* Header & Controls */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-2xl font-black text-slate-900 tracking-tight">Interactive Periodic Table</h3>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-brand-100 text-brand-700 border border-brand-200">
                All 118 Elements
              </span>
            </div>
            <p className="text-slate-500 text-sm mt-1">
              Explore atomic structures, electron configurations, and chemical properties from Hydrogen to Oganesson.
            </p>
          </div>

          {/* Quick Search Input */}
          <div className="relative w-full md:w-80">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name, symbol, or # (e.g. Fe, Gold, 26)..."
              className="w-full pl-10 pr-9 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-4 focus:ring-brand-500/10 focus:border-brand-500 transition-all"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X size={16} />
              </button>
            )}
          </div>
        </div>

        {/* Filters: Category & Phase */}
        <div className="pt-2 border-t border-slate-100 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-3">
          {/* Category Filter Chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto w-full pb-1 text-xs">
            <span className="text-slate-400 font-semibold shrink-0 mr-1 flex items-center gap-1">
              <Filter size={13} /> Categories:
            </span>
            {ELEMENT_CATEGORIES.map(cat => {
              const isActive = activeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => { setActiveCategory(cat.id); playSound('click'); }}
                  className={cn(
                    "px-2.5 py-1 rounded-lg font-medium whitespace-nowrap transition-all cursor-pointer border text-[11px]",
                    isActive 
                      ? "bg-slate-900 text-white border-slate-900 shadow-sm" 
                      : "bg-slate-50 hover:bg-slate-100 text-slate-600 border-slate-200"
                  )}
                >
                  {cat.label}
                </button>
              );
            })}
          </div>

          {/* Phase Filter */}
          <div className="flex items-center gap-1.5 shrink-0 text-xs">
            <span className="text-slate-400 font-semibold">Phase:</span>
            {['all', 'solid', 'liquid', 'gas', 'synthetic'].map((phase) => (
              <button
                key={phase}
                onClick={() => { setActivePhase(phase); playSound('click'); }}
                className={cn(
                  "px-2 py-1 rounded-md capitalize font-medium transition-all text-[11px]",
                  activePhase === phase 
                    ? "bg-brand-500 text-white shadow-xs" 
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                )}
              >
                {phase}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Selected Element Quick Inspector Banner */}
      <AnimatePresence mode="wait">
        {selectedElement && (
          <motion.div
            key={selectedElement.number}
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6"
          >
            <div className="flex items-center gap-4">
              {/* Element Box Visual */}
              <div className={cn(
                "w-20 h-20 rounded-2xl border-2 flex flex-col items-center justify-center relative shadow-sm shrink-0",
                getCategoryStyles(selectedElement.category).bg,
                getCategoryStyles(selectedElement.category).border
              )}>
                <span className="text-[10px] font-mono font-bold text-slate-600 absolute top-1 left-2">
                  {selectedElement.number}
                </span>
                <span className="text-2xl font-black text-slate-900 leading-none">
                  {selectedElement.symbol}
                </span>
                <span className="text-[9px] font-mono text-slate-600 mt-1">
                  {selectedElement.weight}
                </span>
              </div>

              {/* Element Details */}
              <div className="space-y-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <h4 className="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                    {selectedElement.name}
                    <button 
                      onClick={() => handleSpeak(selectedElement.name)}
                      title="Pronounce element name"
                      className="p-1 rounded-full text-slate-400 hover:text-brand-500 hover:bg-slate-100 transition-colors"
                    >
                      <Volume2 size={16} />
                    </button>
                  </h4>
                  <span className={cn(
                    "px-2.5 py-0.5 rounded-md text-xs font-bold uppercase tracking-wider capitalize",
                    getCategoryStyles(selectedElement.category).badge
                  )}>
                    {selectedElement.category.replace('-', ' ')}
                  </span>
                  <span className="px-2 py-0.5 bg-slate-100 text-slate-700 rounded-md text-xs font-medium">
                    Phase: {selectedElement.phase}
                  </span>
                </div>

                <p className="text-slate-600 text-sm max-w-3xl leading-relaxed">
                  {selectedElement.summary}
                </p>

                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500 pt-1">
                  <span><strong>Electron Config:</strong> <code className="text-brand-600 bg-brand-50 px-1.5 py-0.5 rounded font-mono">{selectedElement.electronConfig}</code></span>
                  <span><strong>Period:</strong> {selectedElement.period}</span>
                  <span><strong>Group:</strong> {selectedElement.group}</span>
                  {selectedElement.discoveredBy && (
                    <span><strong>Discovered:</strong> {selectedElement.discoveredBy}</span>
                  )}
                </div>
              </div>
            </div>

            {/* Stepper Navigation */}
            <div className="flex items-center gap-2 self-end md:self-center shrink-0">
              <button
                onClick={() => navigateElement(-1)}
                className="p-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition-all active:scale-95"
                title="Previous Element"
              >
                <ChevronLeft size={18} />
              </button>
              <span className="text-xs font-bold text-slate-500 px-2 font-mono">
                #{selectedElement.number} / 118
              </span>
              <button
                onClick={() => navigateElement(1)}
                className="p-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition-all active:scale-95"
                title="Next Element"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main 18-Column Periodic Table Canvas */}
      <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto pb-4 custom-scrollbar">
          <div className="min-w-[960px] space-y-3">
            
            {/* Group column headers (1 - 18) */}
            <div className="grid gap-1.5" style={{ gridTemplateColumns: 'repeat(18, minmax(0, 1fr))' }}>
              {Array.from({ length: 18 }).map((_, i) => (
                <div key={`group-${i + 1}`} className="text-center text-[10px] font-bold text-slate-400 font-mono">
                  {i + 1}
                </div>
              ))}
            </div>

            {/* Periods 1 to 7 Grid */}
            <div className="grid gap-1.5" style={{ gridTemplateColumns: 'repeat(18, minmax(0, 1fr))' }}>
              {Array.from({ length: 7 }).map((_, rIdx) => {
                const periodNum = rIdx + 1;
                return Array.from({ length: 18 }).map((_, cIdx) => {
                  const groupNum = cIdx + 1;
                  const key = `p${periodNum}-g${groupNum}`;

                  // Special placeholders for Lanthanide (57-71) and Actinide (89-103) in row 6 and row 7 group 3
                  if (periodNum === 6 && groupNum === 3) {
                    return (
                      <div
                        key="lanthanide-indicator"
                        onClick={() => { setSelectedNumber(57); playSound('pop'); }}
                        className="aspect-square border border-dashed border-indigo-300 bg-indigo-50/60 rounded-xl flex flex-col items-center justify-center p-1 cursor-pointer hover:bg-indigo-100 transition-all text-center group"
                        title="Lanthanides (Elements 57 - 71)"
                      >
                        <span className="text-[8px] font-black text-indigo-700 leading-none">57-71</span>
                        <span className="text-[10px] font-bold text-indigo-900 group-hover:scale-105">La-Lu</span>
                        <span className="text-[7px] text-indigo-500 font-medium">★</span>
                      </div>
                    );
                  }

                  if (periodNum === 7 && groupNum === 3) {
                    return (
                      <div
                        key="actinide-indicator"
                        onClick={() => { setSelectedNumber(89); playSound('pop'); }}
                        className="aspect-square border border-dashed border-fuchsia-300 bg-fuchsia-50/60 rounded-xl flex flex-col items-center justify-center p-1 cursor-pointer hover:bg-fuchsia-100 transition-all text-center group"
                        title="Actinides (Elements 89 - 103)"
                      >
                        <span className="text-[8px] font-black text-fuchsia-700 leading-none">89-103</span>
                        <span className="text-[10px] font-bold text-fuchsia-900 group-hover:scale-105">Ac-Lr</span>
                        <span className="text-[7px] text-fuchsia-500 font-medium">★★</span>
                      </div>
                    );
                  }

                  const elem = PERIODIC_ELEMENTS.find(e => e.period === periodNum && e.group === groupNum && e.y === periodNum);
                  if (!elem) {
                    return <div key={key} className="aspect-square pointer-events-none" />;
                  }

                  const isMatch = matchedElementNumbers.has(elem.number);
                  const isSelected = selectedNumber === elem.number;
                  const styles = getCategoryStyles(elem.category);

                  return (
                    <motion.button
                      key={elem.symbol}
                      whileHover={{ scale: 1.15, zIndex: 30 }}
                      whileTap={{ scale: 0.92 }}
                      onClick={() => handleSelectElement(elem)}
                      className={cn(
                        "aspect-square rounded-xl border flex flex-col items-center justify-center p-1 relative transition-all duration-150 cursor-pointer select-none",
                        styles.bg,
                        styles.border,
                        isSelected ? "ring-3 ring-brand-500 ring-offset-2 z-20 scale-110 shadow-md" : "hover:shadow-sm",
                        !isMatch ? "opacity-20 grayscale" : "opacity-100"
                      )}
                    >
                      <span className="text-[8px] font-mono text-slate-500 font-bold leading-none absolute top-1 left-1">
                        {elem.number}
                      </span>
                      <span className="text-xs sm:text-sm font-black text-slate-900 leading-none mt-1">
                        {elem.symbol}
                      </span>
                      <span className="text-[7px] text-slate-500 truncate max-w-full font-medium leading-none mt-0.5 hidden sm:block">
                        {elem.name}
                      </span>
                    </motion.button>
                  );
                });
              })}
            </div>

            {/* Spacer / Separator between Main Table and F-Block */}
            <div className="pt-4 border-t border-slate-200 mt-6 mb-2">
              <div className="flex items-center justify-between text-xs text-slate-400 font-semibold px-2 mb-2">
                <span>Inner Transition Metals (f-block)</span>
                <span>Lanthanoids & Actinoids Series</span>
              </div>
            </div>

            {/* Lanthanide Series (Elements 57 - 71) */}
            <div className="flex items-center gap-2">
              <div className="w-20 text-right pr-2 text-xs font-bold text-indigo-700 shrink-0">
                ★ 57-71
              </div>
              <div className="grid gap-1.5 flex-1" style={{ gridTemplateColumns: 'repeat(15, minmax(0, 1fr))' }}>
                {PERIODIC_ELEMENTS.filter(e => e.category === 'lanthanide').map(elem => {
                  const isMatch = matchedElementNumbers.has(elem.number);
                  const isSelected = selectedNumber === elem.number;
                  const styles = getCategoryStyles(elem.category);
                  return (
                    <motion.button
                      key={elem.symbol}
                      whileHover={{ scale: 1.15, zIndex: 30 }}
                      whileTap={{ scale: 0.92 }}
                      onClick={() => handleSelectElement(elem)}
                      className={cn(
                        "aspect-square rounded-xl border flex flex-col items-center justify-center p-1 relative transition-all duration-150 cursor-pointer select-none",
                        styles.bg,
                        styles.border,
                        isSelected ? "ring-3 ring-brand-500 ring-offset-2 z-20 scale-110 shadow-md" : "hover:shadow-sm",
                        !isMatch ? "opacity-20 grayscale" : "opacity-100"
                      )}
                    >
                      <span className="text-[8px] font-mono text-slate-500 font-bold leading-none absolute top-1 left-1">
                        {elem.number}
                      </span>
                      <span className="text-xs sm:text-sm font-black text-slate-900 leading-none mt-1">
                        {elem.symbol}
                      </span>
                      <span className="text-[7px] text-slate-500 truncate max-w-full font-medium leading-none mt-0.5 hidden sm:block">
                        {elem.name}
                      </span>
                    </motion.button>
                  );
                })}
              </div>
            </div>

            {/* Actinide Series (Elements 89 - 103) */}
            <div className="flex items-center gap-2">
              <div className="w-20 text-right pr-2 text-xs font-bold text-fuchsia-700 shrink-0">
                ★★ 89-103
              </div>
              <div className="grid gap-1.5 flex-1" style={{ gridTemplateColumns: 'repeat(15, minmax(0, 1fr))' }}>
                {PERIODIC_ELEMENTS.filter(e => e.category === 'actinide').map(elem => {
                  const isMatch = matchedElementNumbers.has(elem.number);
                  const isSelected = selectedNumber === elem.number;
                  const styles = getCategoryStyles(elem.category);
                  return (
                    <motion.button
                      key={elem.symbol}
                      whileHover={{ scale: 1.15, zIndex: 30 }}
                      whileTap={{ scale: 0.92 }}
                      onClick={() => handleSelectElement(elem)}
                      className={cn(
                        "aspect-square rounded-xl border flex flex-col items-center justify-center p-1 relative transition-all duration-150 cursor-pointer select-none",
                        styles.bg,
                        styles.border,
                        isSelected ? "ring-3 ring-brand-500 ring-offset-2 z-20 scale-110 shadow-md" : "hover:shadow-sm",
                        !isMatch ? "opacity-20 grayscale" : "opacity-100"
                      )}
                    >
                      <span className="text-[8px] font-mono text-slate-500 font-bold leading-none absolute top-1 left-1">
                        {elem.number}
                      </span>
                      <span className="text-xs sm:text-sm font-black text-slate-900 leading-none mt-1">
                        {elem.symbol}
                      </span>
                      <span className="text-[7px] text-slate-500 truncate max-w-full font-medium leading-none mt-0.5 hidden sm:block">
                        {elem.name}
                      </span>
                    </motion.button>
                  );
                })}
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}

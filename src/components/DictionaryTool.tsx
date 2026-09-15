import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, Volume2, Sparkles, BookOpen, ArrowRight, Loader2, Bookmark, X } from 'lucide-react';
import { getDictionaryDefinition } from '../services/gemini';
import { lookupInstantWord } from '../data/dictionaryData';
import { cn } from '../lib/utils';

interface DictionaryToolProps {
  playSound: (type: 'click' | 'success' | 'fail' | 'pop' | 'whoosh') => void;
}

const POPULAR_WORDS = [
  'jeopardy',
  'photosynthesis',
  'mitosis',
  'hypothesis',
  'catalyst',
  'metaphor',
  'osmosis',
  'equilibrium',
  'ephemeral',
  'ubiquitous',
  'paradigm',
  'resilient',
  'tenacious',
  'synergy'
];

export function DictionaryTool({ playSound }: DictionaryToolProps) {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{
    word?: string;
    definition: string;
    synonyms: string[];
    examples: string[];
    partOfSpeech?: string;
    phonetic?: string;
  } | null>(null);

  // Auto-search a default word on first render so tool isn't blank
  useEffect(() => {
    executeLookup('jeopardy');
  }, []);

  const executeLookup = async (wordToSearch: string) => {
    const trimmed = wordToSearch.trim();
    if (!trimmed) return;

    setQuery(trimmed);

    // 1. Instant check for 0-latency experience
    const local = lookupInstantWord(trimmed);
    if (local) {
      setResult({
        word: local.word,
        definition: local.definition,
        synonyms: local.synonyms,
        examples: local.examples,
        partOfSpeech: local.partOfSpeech,
        phonetic: local.phonetic,
      });
      playSound('pop');
      return;
    }

    setLoading(true);
    playSound('pop');
    try {
      const data = await getDictionaryDefinition(trimmed);
      setResult({
        word: trimmed,
        ...data
      });
    } catch (err) {
      console.error("Dictionary lookup error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    executeLookup(query);
  };

  const handleSpeak = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.9;
      window.speechSynthesis.speak(utterance);
      playSound('click');
    }
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto w-full">
      {/* Header Banner */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm text-center space-y-3">
        <div className="w-14 h-14 bg-amber-100 text-amber-600 rounded-2xl flex items-center justify-center mx-auto shadow-xs">
          <BookOpen size={28} />
        </div>
        <div>
          <h3 className="text-2xl font-black text-slate-900 tracking-tight">Smart Academic Dictionary</h3>
          <p className="text-slate-500 text-sm mt-1 max-w-md mx-auto">
            High-speed lookup for scientific, literary, and academic vocabulary with instant pronunciations and context.
          </p>
        </div>

        {/* Search Input */}
        <form onSubmit={handleSubmit} className="relative max-w-xl mx-auto mt-4">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search any word (e.g., 'jeopardy', 'photosynthesis')..." 
            className="w-full pl-11 pr-28 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 font-medium placeholder:text-slate-400 focus:bg-white focus:ring-4 focus:ring-brand-500/10 focus:border-brand-500 outline-none transition-all shadow-xs"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery('')}
              className="absolute right-24 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
            >
              <X size={15} />
            </button>
          )}
          <button
            type="submit"
            disabled={loading || !query.trim()}
            className="absolute right-2 top-2 bottom-2 px-5 bg-brand-500 hover:bg-brand-600 text-white rounded-xl font-bold text-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1.5 shadow-xs cursor-pointer"
          >
            {loading ? <Loader2 className="animate-spin" size={16} /> : 'Search'}
          </button>
        </form>

        {/* Popular Quick-Search Pills */}
        <div className="flex flex-wrap items-center justify-center gap-1.5 pt-2">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mr-1">Quick:</span>
          {POPULAR_WORDS.map((w) => (
            <button
              key={w}
              type="button"
              onClick={() => executeLookup(w)}
              className={cn(
                "px-2.5 py-1 rounded-lg text-xs font-medium transition-all cursor-pointer border",
                (result?.word?.toLowerCase() === w || query.toLowerCase() === w)
                  ? "bg-amber-500 text-white border-amber-500 shadow-xs"
                  : "bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-200"
              )}
            >
              {w}
            </button>
          ))}
        </div>
      </div>

      {/* Lookup Results Card */}
      <AnimatePresence mode="wait">
        {result && (
          <motion.div
            key={result.word || query}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            className="bg-white rounded-3xl border border-slate-200 p-7 shadow-sm space-y-6"
          >
            {/* Word Heading & Pronunciation */}
            <div className="flex items-start justify-between gap-4 border-b border-slate-100 pb-5">
              <div>
                <div className="flex items-center gap-3">
                  <h2 className="text-3xl font-black text-slate-900 tracking-tight capitalize">
                    {result.word || query}
                  </h2>
                  <button
                    onClick={() => handleSpeak(result.word || query)}
                    title="Listen to pronunciation"
                    className="p-2 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-700 transition-colors cursor-pointer"
                  >
                    <Volume2 size={18} />
                  </button>
                </div>
                
                <div className="flex items-center gap-2 mt-1.5">
                  {result.phonetic && (
                    <span className="text-sm font-mono text-slate-500">{result.phonetic}</span>
                  )}
                  {result.partOfSpeech && (
                    <span className="px-2 py-0.5 rounded-md text-xs font-bold uppercase tracking-wider bg-slate-100 text-slate-700">
                      {result.partOfSpeech}
                    </span>
                  )}
                </div>
              </div>

              <div className="text-right">
                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  Instant Definition
                </span>
              </div>
            </div>

            {/* Definition */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold text-brand-600 uppercase tracking-widest">
                Definition
              </h4>
              <p className="text-lg text-slate-800 font-medium leading-relaxed">
                {result.definition}
              </p>
            </div>

            {/* Synonyms */}
            {result.synonyms && result.synonyms.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                  Synonyms & Related Terms (Click to Explore)
                </h4>
                <div className="flex flex-wrap gap-2">
                  {result.synonyms.map((syn, idx) => (
                    <button
                      key={idx}
                      onClick={() => executeLookup(syn)}
                      className="px-3 py-1.5 bg-slate-50 hover:bg-brand-50 hover:text-brand-700 hover:border-brand-200 border border-slate-200 rounded-xl text-sm font-medium text-slate-700 transition-all cursor-pointer flex items-center gap-1 group"
                    >
                      <span>{syn}</span>
                      <ArrowRight size={12} className="opacity-0 group-hover:opacity-100 transition-opacity" />
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Context Examples */}
            {result.examples && result.examples.length > 0 && (
              <div className="space-y-2.5">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                  Context Examples
                </h4>
                <div className="space-y-2">
                  {result.examples.map((example, idx) => (
                    <div 
                      key={idx}
                      className="p-3.5 bg-slate-50/80 rounded-2xl border border-slate-100 text-slate-700 text-sm italic flex items-start gap-2.5"
                    >
                      <span className="text-brand-400 font-bold text-base leading-none">“</span>
                      <span className="flex-1 leading-relaxed">{example}</span>
                      <span className="text-brand-400 font-bold text-base leading-none">”</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

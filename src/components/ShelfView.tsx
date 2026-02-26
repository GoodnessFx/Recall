import React from 'react';
import { Memory } from '../types';
import { motion } from 'framer-motion';
import { MemoryCard } from './MemoryCard';
import { Button } from './ui/button';
import { ArrowLeft, Filter, Search } from 'lucide-react';

interface ShelfViewProps {
  shelfName: string;
  memories: Memory[];
  onBack: () => void;
  onMemoryClick: (memory: Memory) => void;
}

export function ShelfView({ shelfName, memories, onBack, onMemoryClick }: ShelfViewProps) {
  return (
    <div className="space-y-16 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-8 border-b border-border/10 pb-12">
        <div className="space-y-8">
          <Button variant="ghost" onClick={onBack} className="group -ml-4 px-4 py-2 hover:bg-white/5 font-mono text-[9px] uppercase tracking-widest text-muted-foreground hover:text-accent transition-all">
            <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
            Back to Vault
          </Button>
          <div className="space-y-4">
            <h1 className="text-6xl md:text-8xl font-serif tracking-tighter leading-none italic">{shelfName}</h1>
            <div className="flex items-center gap-6">
              <span className="font-mono text-[10px] uppercase tracking-[0.4em] text-accent">{memories.length} Fragments Found</span>
              <div className="h-px w-12 bg-border/20" />
              <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-muted-foreground/40">Synchronized and Indexed</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/40 group-focus-within:text-accent transition-colors" />
            <input type="text" placeholder="Search shelf..." className="bg-card/40 border border-border/50 rounded-full pl-12 pr-6 py-3 font-mono text-[10px] focus:border-accent/40 outline-none w-64 transition-all" />
          </div>
          <Button variant="outline" className="rounded-full px-6 py-3 border-border/50 bg-card/20 font-mono text-[9px] uppercase tracking-widest hover:border-accent/40">
            <Filter className="w-3.5 h-3.5 mr-2" />
            Filter
          </Button>
        </div>
      </header>
      {memories.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {memories.map((memory, i) => (
            <motion.div key={memory.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
              <MemoryCard memory={memory} onClick={() => onMemoryClick(memory)} />
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="py-40 text-center space-y-8">
          <div className="w-20 h-20 bg-card/40 border border-border/50 rounded-full flex items-center justify-center mx-auto opacity-20">
            <Search className="w-8 h-8" />
          </div>
          <div className="space-y-4">
            <p className="font-mono text-xs text-muted-foreground uppercase tracking-widest">No matching fragments in this shelf.</p>
            <Button variant="ghost" onClick={onBack} className="font-mono text-[10px] text-accent">Expand Search to Vault</Button>
          </div>
        </div>
      )}
    </div>
  );
}

import React from 'react';
import { Memory } from '../types';
import { motion } from 'framer-motion';
import { X, Zap, ArrowRight } from 'lucide-react';
import { Button } from './ui/button';

interface SparkMomentProps {
  memory: Memory;
  onClose: () => void;
  onViewDetail: () => void;
}

export function SparkMoment({ memory, onClose, onViewDetail }: SparkMomentProps) {
  return (
    <div className="fixed bottom-32 right-12 z-[150] w-[400px]">
      <motion.div initial={{ opacity: 0, x: 100, scale: 0.9 }} animate={{ opacity: 1, x: 0, scale: 1 }} exit={{ opacity: 0, x: 100, scale: 0.9 }} className="relative bg-card/60 backdrop-blur-3xl border border-accent/30 rounded-[32px] p-8 shadow-[0_30px_60px_rgba(0,0,0,0.5)] overflow-hidden">
        <div className="absolute -top-20 -right-20 w-40 h-40 bg-accent/20 blur-[80px] rounded-full animate-pulse" />
        <div className="relative z-10 space-y-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-accent rounded-full flex items-center justify-center text-background shadow-[0_0_20px_rgba(245,166,35,0.4)]"><Zap className="w-5 h-5 fill-current" /></div>
              <div className="flex flex-col">
                <span className="font-mono text-[9px] font-bold uppercase tracking-[0.3em] text-accent">Neural Spark</span>
                <span className="font-mono text-[7px] text-muted-foreground uppercase tracking-widest">Random Resurfacing</span>
              </div>
            </div>
            <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full h-8 w-8 hover:bg-white/5 text-muted-foreground"><X className="w-4 h-4" /></Button>
          </div>
          <div className="space-y-4">
            <span className="font-mono text-[8px] uppercase tracking-[0.4em] text-muted-foreground/40">From your Archives — {memory.source}</span>
            <p className="text-xl font-serif italic leading-relaxed text-foreground/90">"{memory.content.length > 120 ? memory.content.substring(0, 120) + '...' : memory.content}"</p>
          </div>
          <Button onClick={onViewDetail} className="w-full h-14 bg-accent text-background rounded-2xl font-mono text-[9px] uppercase tracking-[0.4em] hover:scale-[1.02] transition-all group shadow-lg">Reconnect<ArrowRight className="w-4 h-4 ml-3 group-hover:translate-x-1 transition-transform" /></Button>
        </div>
      </motion.div>
    </div>
  );
}

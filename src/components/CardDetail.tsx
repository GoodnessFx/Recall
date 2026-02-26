import React from 'react';
import { Memory } from '../types';
import { motion } from 'framer-motion';
import { X, Calendar, Share2, Trash2, ExternalLink, Download, Heart } from 'lucide-react';
import { Button } from './ui/button';

interface CardDetailProps {
  memory: Memory;
  onClose: () => void;
}

export function CardDetail({ memory, onClose }: CardDetailProps) {
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' }).format(new Date(date));
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[200] flex items-center justify-center p-6 md:p-12">
      <div className="absolute inset-0 bg-background/80 backdrop-blur-3xl" onClick={onClose} />
      <motion.div initial={{ scale: 0.9, y: 20, opacity: 0 }} animate={{ scale: 1, y: 0, opacity: 1 }} exit={{ scale: 0.9, y: 20, opacity: 0 }} transition={{ duration: 0.5, ease: [0.19, 1, 0.22, 1] }} className="relative w-full max-w-[1000px] h-[90vh] bg-card border border-border/50 rounded-[48px] overflow-hidden shadow-[0_50px_100px_rgba(0,0,0,0.8)] flex flex-col md:flex-row">
        <div className="flex-1 bg-zinc-900/50 p-12 md:p-20 overflow-y-auto space-y-16">
          <div className="space-y-8">
            <div className="flex items-center gap-4">
              <span className="font-mono text-[9px] uppercase tracking-[0.4em] text-accent">{memory.source}</span>
              <div className="h-px w-8 bg-accent/20" /><span className="font-mono text-[9px] uppercase tracking-[0.2em] text-muted-foreground/40">{memory.type}</span>
            </div>
            <h2 className="text-6xl md:text-8xl font-serif leading-[1.1] tracking-tighter italic">{memory.title}</h2>
          </div>
          <div className="space-y-10">
            <p className="text-2xl md:text-3xl font-serif text-foreground/90 leading-relaxed">"{memory.content}"</p>
            <div className="p-8 rounded-3xl bg-accent/5 border border-accent/10">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-1.5 h-1.5 bg-accent rounded-full animate-pulse" /><span className="font-mono text-[8px] uppercase tracking-[0.3em] text-accent">Neural Summary</span>
              </div>
              <p className="font-mono text-[10px] text-muted-foreground/80 leading-loose">{memory.summary}</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-8 border-t border-border/10 pt-16">
            <div className="space-y-2">
              <span className="font-mono text-[8px] uppercase tracking-widest text-muted-foreground/40 block">Capture Date</span>
              <div className="flex items-center gap-3 text-muted-foreground/80"><Calendar className="w-4 h-4" /><span className="font-mono text-[10px]">{formatDate(memory.timestamp)}</span></div>
            </div>
            <div className="space-y-2">
              <span className="font-mono text-[8px] uppercase tracking-widest text-muted-foreground/40 block">Resonance Level</span>
              <div className="flex items-center gap-3 text-accent"><div className="flex gap-1">{[1, 2, 3, 4, 5].map(i => (<div key={i} className={`h-1.5 w-1.5 rounded-full ${i <= 4 ? 'bg-accent' : 'bg-accent/20'}`} />))}</div><span className="font-mono text-[10px]">HIGH</span></div>
            </div>
          </div>
        </div>
        <div className="w-full md:w-80 bg-background/40 border-l border-border/50 p-10 flex flex-col justify-between">
          <div className="space-y-12">
            <div className="flex items-center justify-between">
              <Button variant="ghost" size="icon" onClick={onClose} className="rounded-full hover:bg-white/5"><X className="w-6 h-6" /></Button>
              <div className="flex gap-2"><Button variant="ghost" size="icon" className="rounded-full hover:bg-white/5 text-muted-foreground hover:text-red-400 transition-colors"><Heart className="w-5 h-5" /></Button><Button variant="ghost" size="icon" className="rounded-full hover:bg-white/5 text-muted-foreground hover:text-accent transition-colors"><Share2 className="w-5 h-5" /></Button></div>
            </div>
            <div className="space-y-8">
              <div className="space-y-4">
                <span className="font-mono text-[8px] uppercase tracking-widest text-muted-foreground/40 block px-2">Taxonomy</span>
                <div className="flex flex-wrap gap-2">{memory.tags.map(tag => (<span key={tag} className="px-4 py-2 rounded-xl bg-white/5 border border-white/10 font-mono text-[9px] text-muted-foreground/80 hover:border-accent/40 hover:text-accent cursor-pointer transition-all">#{tag}</span>))}<Button variant="ghost" className="rounded-xl px-4 py-2 font-mono text-[9px] text-accent/60 hover:text-accent">+ Add Tag</Button></div>
              </div>
              <div className="space-y-4">
                <span className="font-mono text-[8px] uppercase tracking-widest text-muted-foreground/40 block px-2">Quick Actions</span>
                <div className="space-y-2"><Button className="w-full justify-start gap-4 h-14 rounded-2xl bg-accent text-background font-mono text-[9px] uppercase tracking-widest hover:scale-[1.02] transition-all"><ExternalLink className="w-4 h-4" />Open Original Source</Button><Button variant="outline" className="w-full justify-start gap-4 h-14 rounded-2xl border-border/50 bg-white/5 font-mono text-[9px] uppercase tracking-widest hover:border-accent/40 transition-all"><Download className="w-4 h-4" />Export Fragment</Button></div>
              </div>
            </div>
          </div>
          <Button variant="ghost" className="w-full justify-center gap-4 h-14 rounded-2xl text-red-500/40 hover:text-red-500 hover:bg-red-500/5 font-mono text-[9px] uppercase tracking-widest transition-all"><Trash2 className="w-4 h-4" />De-Archive Fragment</Button>
        </div>
      </motion.div>
    </motion.div>
  );
}

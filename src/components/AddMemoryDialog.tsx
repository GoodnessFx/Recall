import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, Lightbulb, Link as LinkIcon, Image as ImageIcon, Video, MessageSquare, Zap, Sparkles } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { toast } from 'sonner';
import { MemoryType } from '../types';

interface AddMemoryDialogProps { isOpen: boolean; onClose: () => void; }

export function AddMemoryDialog({ isOpen, onClose }: AddMemoryDialogProps) {
  const [type, setType] = useState<MemoryType>('idea');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [tags, setTags] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try { await new Promise(resolve => setTimeout(resolve, 1500)); toast.success('Fragment successfully archived in Vault.'); onClose(); setTitle(''); setContent(''); setTags(''); } catch (err) { toast.error('Failed to archive fragment.'); } finally { setIsSubmitting(false); }
  };

  const types: { id: MemoryType; icon: any; label: string }[] = [ { id: 'idea', icon: Lightbulb, label: 'Thought' }, { id: 'bookmark', icon: LinkIcon, label: 'Link' }, { id: 'image', icon: ImageIcon, label: 'Visual' }, { id: 'video', icon: Video, label: 'Motion' }, { id: 'tweet', icon: MessageSquare, label: 'Social' } ];

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center p-6">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-background/80 backdrop-blur-2xl" onClick={onClose} />
          <motion.div initial={{ scale: 0.9, y: 20, opacity: 0 }} animate={{ scale: 1, y: 0, opacity: 1 }} exit={{ scale: 0.9, y: 20, opacity: 0 }} className="relative w-full max-w-2xl bg-card border border-border/50 rounded-[48px] p-12 md:p-16 shadow-[0_50px_100px_rgba(0,0,0,0.6)] overflow-hidden">
            <div className="absolute -top-20 -right-20 w-40 h-40 bg-accent/10 blur-[80px] rounded-full" />
            <div className="relative z-10 space-y-12">
              <header className="flex items-center justify-between"><div className="space-y-4"><div className="flex items-center gap-4"><div className="w-10 h-10 bg-accent rounded-full flex items-center justify-center text-background"><Plus className="w-6 h-6" /></div><span className="font-mono text-[9px] uppercase tracking-[0.4em] text-accent">Initialize Fragment</span></div><h2 className="text-5xl font-serif tracking-tighter italic">New Archival Entry</h2></div><Button variant="ghost" size="icon" onClick={onClose} className="rounded-full hover:bg-white/5"><X className="w-6 h-6" /></Button></header>
              <form onSubmit={handleSubmit} className="space-y-10">
                <div className="space-y-4"><Label className="font-mono text-[8px] uppercase tracking-[0.3em] text-muted-foreground/40 px-4">Fragment Type</Label><div className="flex flex-wrap gap-3">{types.map(t => (<button key={t.id} type="button" onClick={() => setType(t.id)} className={`flex items-center gap-3 px-6 py-3 rounded-2xl border font-mono text-[9px] uppercase tracking-widest transition-all duration-500 ${type === t.id ? 'bg-accent text-background border-accent shadow-lg scale-105' : 'bg-white/5 border-white/10 text-muted-foreground hover:border-white/20'}`}><t.icon className="w-4 h-4" />{t.label}</button>))}</div></div>
                <div className="space-y-8"><div className="space-y-4"><Label className="font-mono text-[8px] uppercase tracking-[0.3em] text-muted-foreground/40 px-4">Title / Resonance</Label><Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Give this fragment a name..." className="bg-white/5 border-border/50 h-16 rounded-3xl px-8 font-mono text-sm focus:border-accent/40 ring-0 focus-visible:ring-0" required /></div><div className="space-y-4"><Label className="font-mono text-[8px] uppercase tracking-[0.3em] text-muted-foreground/40 px-4">Core Content</Label><Textarea value={content} onChange={(e) => setContent(e.target.value)} placeholder="What is the essence of this memory?" className="bg-white/5 border-border/50 min-h-[150px] rounded-[32px] p-8 font-mono text-sm focus:border-accent/40 ring-0 focus-visible:ring-0 resize-none leading-relaxed" required /></div><div className="space-y-4"><Label className="font-mono text-[8px] uppercase tracking-[0.3em] text-muted-foreground/40 px-4">Taxonomy (Comma separated)</Label><Input value={tags} onChange={(e) => setTags(e.target.value)} placeholder="design, system, stoicism..." className="bg-white/5 border-border/50 h-16 rounded-3xl px-8 font-mono text-sm focus:border-accent/40 ring-0 focus-visible:ring-0" /></div></div>
                <Button type="submit" disabled={isSubmitting} className="w-full h-20 bg-accent text-background rounded-3xl font-mono text-[10px] uppercase tracking-[0.4em] hover:scale-[1.02] active:scale-[0.98] transition-all shadow-[0_20px_40px_rgba(245,166,35,0.2)] group">{isSubmitting ? (<div className="flex items-center gap-4"><Zap className="w-4 h-4 animate-pulse fill-current" />Synchronizing...</div>) : (<div className="flex items-center gap-4"><Sparkles className="w-4 h-4 group-hover:rotate-12 transition-transform" />Commit to Vault</div>)}</Button>
              </form>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

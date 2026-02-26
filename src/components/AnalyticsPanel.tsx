import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Database, BrainCircuit, Activity, Cloud, Share2, MoreVertical, Calendar } from 'lucide-react';
import { Button } from './ui/button';

export function AnalyticsPanel() {
  const stats = [
    { label: 'Total Fragments', value: '4,286', trend: '+12%', icon: Database, color: 'text-blue-400' },
    { label: 'Neural Resonance', value: '84.2%', trend: '+5%', icon: BrainCircuit, color: 'text-accent' },
    { label: 'Sync Frequency', value: '142/day', trend: '+18%', icon: Activity, color: 'text-secondary' },
    { label: 'Vault Storage', value: '12.4 GB', trend: 'Optimal', icon: Cloud, color: 'text-zinc-400' },
  ];

  return (
    <div className="space-y-16 animate-in fade-in slide-in-from-bottom-8 duration-1000">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-12 border-b border-border/10 pb-16">
        <div className="space-y-8">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-accent/10 border border-accent/20 rounded-full flex items-center justify-center text-accent shadow-[0_0_40px_rgba(245,166,35,0.1)]"><TrendingUp className="w-7 h-7" /></div>
            <div className="flex flex-col"><span className="font-mono text-[9px] uppercase tracking-[0.4em] text-accent">Neural Insights</span><span className="font-mono text-[7px] uppercase tracking-[0.2em] text-muted-foreground/40">v2.4 — ANALYTICS CORE</span></div>
          </div>
          <h1 className="text-7xl md:text-9xl font-serif leading-[0.9] tracking-tighter max-w-4xl italic">Your Creative <br/><span className="text-foreground italic">Momentum.</span></h1>
        </div>
        <div className="flex gap-4"><Button variant="outline" className="rounded-full px-8 py-6 border-border/50 bg-card/20 font-mono text-[9px] uppercase tracking-widest hover:border-accent/40 transition-all"><Calendar className="w-4 h-4 mr-3" />Last 30 Cycles</Button><Button variant="ghost" size="icon" className="rounded-full h-14 w-14 hover:bg-white/5 border border-border/20"><Share2 className="w-5 h-5" /></Button></div>
      </header>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 md:gap-14">
        {stats.map((stat, i) => (
          <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className="group relative bg-card/40 backdrop-blur-xl border border-border/40 rounded-[48px] p-12 hover:border-accent/40 transition-all duration-1000 overflow-hidden shadow-2xl">
            <div className="absolute top-0 right-0 p-8 opacity-0 group-hover:opacity-100 transition-opacity duration-1000"><MoreVertical className="w-5 h-5 text-muted-foreground/40" /></div>
            <div className="relative z-10 space-y-8">
              <div className={`w-14 h-14 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center ${stat.color} group-hover:scale-110 group-hover:bg-accent group-hover:text-background group-hover:border-accent transition-all duration-700`}><stat.icon className="w-6 h-6" /></div>
              <div className="space-y-4">
                <span className="font-mono text-[9px] uppercase tracking-[0.4em] text-muted-foreground/40 block">{stat.label}</span>
                <div className="flex items-baseline gap-4"><span className="text-5xl font-serif tracking-tighter">{stat.value}</span><span className="font-mono text-[9px] text-accent uppercase tracking-widest">{stat.trend}</span></div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 md:gap-14">
        <section className="bg-card/20 backdrop-blur-md border border-border/40 rounded-[48px] p-12 md:p-16 space-y-12">
          <div className="flex items-center justify-between"><h3 className="text-4xl font-serif tracking-tight italic">Source Distribution</h3><span className="font-mono text-[9px] uppercase tracking-[0.3em] text-accent">Real-time sync</span></div>
          <div className="aspect-[16/9] bg-white/5 rounded-[32px] border border-white/10 flex items-center justify-center">
            <div className="flex items-center gap-12"><div className="w-48 h-48 rounded-full border-8 border-accent/20 border-t-accent animate-[spin_3s_linear_infinite]" /><div className="space-y-4">{[{ label: 'Instagram', value: '42%', color: 'bg-pink-400' }, { label: 'YouTube', value: '28%', color: 'bg-red-400' }, { label: 'X (Twitter)', value: '15%', color: 'bg-blue-400' }, { label: 'Others', value: '15%', color: 'bg-zinc-600' }].map(item => (<div key={item.label} className="flex items-center gap-4"><div className={`w-2 h-2 rounded-full ${item.color}`} /><span className="font-mono text-[9px] uppercase tracking-widest text-muted-foreground/60 w-24">{item.label}</span><span className="font-mono text-[10px] text-foreground/80">{item.value}</span></div>))}</div></div>
          </div>
        </section>
        <section className="bg-card/20 backdrop-blur-md border border-border/40 rounded-[48px] p-12 md:p-16 space-y-12">
          <div className="flex items-center justify-between"><h3 className="text-4xl font-serif tracking-tight italic">Memory Resonance Arc</h3><span className="font-mono text-[9px] uppercase tracking-[0.3em] text-accent">Weekly Cycle</span></div>
          <div className="aspect-[16/9] bg-white/5 rounded-[32px] border border-white/10 flex items-end justify-between p-12">{[30, 60, 45, 80, 55, 90, 70].map((height, i) => (<motion.div key={i} initial={{ height: 0 }} animate={{ height: `${height}%` }} transition={{ duration: 1.5, delay: i * 0.1, ease: [0.19, 1, 0.22, 1] }} className="w-12 bg-accent/20 border-t border-accent/40 rounded-t-2xl relative group cursor-pointer"><div className="absolute inset-0 bg-accent opacity-0 group-hover:opacity-100 transition-opacity duration-700 rounded-t-2xl" /><span className="absolute -top-8 left-1/2 -translate-x-1/2 font-mono text-[8px] text-accent opacity-0 group-hover:opacity-100 transition-opacity">{height}%</span></motion.div>))}</div>
        </section>
      </div>
    </div>
  );
}

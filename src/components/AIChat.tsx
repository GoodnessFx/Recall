import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot, User, Send, Sparkles, Zap, Search, Command } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';

interface Message { id: string; role: 'user' | 'assistant'; content: string; timestamp: Date; }

export function AIChat() {
  const [messages, setMessages] = useState<Message[]>([{ id: 'welcome', role: 'assistant', content: "Neural Interface initialized. I've indexed your latest fragments. How can I help you explore your digital soul today?", timestamp: new Date() }]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSend = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim() || isLoading) return;
    const userMessage: Message = { id: Date.now().toString(), role: 'user', content: input, timestamp: new Date() };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    setTimeout(() => {
      const assistantMessage: Message = { id: (Date.now() + 1).toString(), role: 'assistant', content: "I've analyzed your request. Based on your recent saves about 'brutalist architecture' and 'systems design', there's a recurring pattern of interest in high-craft digital archeology. Would you like me to resurface some related fragments?", timestamp: new Date() };
      setMessages(prev => [...prev, assistantMessage]);
      setIsLoading(false);
    }, 1500);
  };

  return (
    <div className="flex flex-col h-full max-w-4xl mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-8 duration-1000">
      <header className="space-y-8 text-center pt-12">
        <div className="inline-flex items-center justify-center w-24 h-24 bg-accent/10 border border-accent/20 rounded-full mb-4 shadow-[0_0_50px_rgba(245,166,35,0.1)]"><Sparkles className="w-10 h-10 text-accent animate-pulse" /></div>
        <div className="space-y-4">
          <h1 className="text-6xl md:text-7xl font-serif tracking-tighter leading-none italic">Neural Interface</h1>
          <div className="flex items-center justify-center gap-6"><span className="font-mono text-[9px] uppercase tracking-[0.4em] text-accent">Recall AI v2.4</span><div className="h-px w-8 bg-border/20" /><span className="font-mono text-[9px] uppercase tracking-[0.2em] text-muted-foreground/40">Synchronized and Aware</span></div>
        </div>
      </header>
      <div className="flex-1 min-h-[500px] bg-card/20 backdrop-blur-xl border border-border/40 rounded-[48px] p-12 overflow-y-auto space-y-10 shadow-2xl relative">
        <AnimatePresence mode="popLayout">{messages.map((msg, i) => (<motion.div key={msg.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: i * 0.1 }} className={`flex items-start gap-8 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}><div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 border transition-all duration-700 ${msg.role === 'assistant' ? 'bg-accent/10 border-accent/20 text-accent' : 'bg-white/5 border-white/10 text-muted-foreground/60'}`}>{msg.role === 'assistant' ? <Bot className="w-6 h-6" /> : <User className="w-6 h-6" />}</div><div className={`max-w-[80%] space-y-3 ${msg.role === 'user' ? 'text-right' : ''}`}><div className={`p-8 rounded-[32px] font-mono text-xs leading-loose shadow-xl ${msg.role === 'assistant' ? 'bg-card/60 border border-border/50 text-foreground/90' : 'bg-accent text-background font-bold'}`}>{msg.content}</div><span className="font-mono text-[8px] uppercase tracking-widest text-muted-foreground/40 px-4">{new Intl.DateTimeFormat('en-US', { hour: '2-digit', minute: '2-digit' }).format(msg.timestamp)}</span></div></motion.div>))}</AnimatePresence>
        {isLoading && (<motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-4 text-accent animate-pulse px-4"><Zap className="w-4 h-4 fill-current" /><span className="font-mono text-[9px] uppercase tracking-[0.4em]">Processing Neural Fragments...</span></motion.div>)}
      </div>
      <form onSubmit={handleSend} className="relative group max-w-3xl mx-auto w-full px-4">
        <div className="absolute inset-0 bg-accent/20 blur-[100px] rounded-full opacity-0 group-focus-within:opacity-100 transition-opacity duration-1000" />
        <div className="relative flex items-center bg-card/60 backdrop-blur-3xl border border-border/50 rounded-full px-8 py-6 shadow-2xl focus-within:border-accent/40 transition-all duration-1000">
          <Input value={input} onChange={(e) => setInput(e.target.value)} placeholder="Ask about your memories, patterns, or insights..." className="bg-transparent border-none outline-none w-full font-mono text-lg placeholder:text-muted-foreground/20 text-accent/90 ring-0 focus-visible:ring-0 focus-visible:ring-offset-0 h-auto p-0" disabled={isLoading} />
          <Button type="submit" size="icon" disabled={!input.trim() || isLoading} className={`rounded-full w-12 h-12 ml-6 transition-all duration-700 ${input.trim() ? 'bg-accent text-background scale-110 shadow-[0_0_20px_rgba(245,166,35,0.4)]' : 'bg-white/5 text-muted-foreground/20 scale-100'}`}><Send className="w-5 h-5" /></Button>
        </div>
        <div className="flex items-center justify-center gap-12 mt-8 opacity-40 group-focus-within:opacity-100 transition-opacity"><div className="flex items-center gap-3 font-mono text-[9px] text-muted-foreground uppercase tracking-widest"><Command className="w-3 h-3" /><span>Enter to synchronize</span></div><div className="flex items-center gap-3 font-mono text-[9px] text-muted-foreground uppercase tracking-widest"><Search className="w-3 h-3" /><span>Search mode enabled</span></div></div>
      </form>
    </div>
  );
}

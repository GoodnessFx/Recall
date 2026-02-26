import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Zap, Brain, Shield, ArrowRight, Check } from 'lucide-react';
import { Button } from './ui/button';

interface OnboardingProps {
  onComplete: () => void;
}

export function Onboarding({ onComplete }: OnboardingProps) {
  const [step, setStep] = useState(0);

  const steps = [
    {
      title: "Welcome to your Neural Vault",
      description: "RECALL is the memory layer of your creative internet. Every fragment you save is indexed and resurfaced with AI.",
      icon: Brain,
      color: "text-accent"
    },
    {
      title: "Connect your consciousness",
      description: "Synchronize messages, screenshots, and bookmarks automatically. Your vault grows as you explore.",
      icon: Zap,
      color: "text-blue-400"
    },
    {
      title: "Encrypted and Private",
      description: "Your digital soul is protected by industry-standard encryption. Only you hold the key to the vault.",
      icon: Shield,
      color: "text-secondary"
    }
  ];

  const handleNext = () => {
    if (step < steps.length - 1) {
      setStep(step + 1);
    } else {
      onComplete();
    }
  };

  const currentStep = steps[step];

  return (
    <div className="fixed inset-0 z-[500] bg-background flex items-center justify-center p-6 overflow-hidden">
      {/* Background Noise */}
      <div className="absolute inset-0 opacity-[0.05] pointer-events-none bg-[url('data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.65\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\'/%3E%3C/svg%3E')]" />
      
      <motion.div 
        key={step}
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 1.1, y: -20 }}
        transition={{ duration: 0.8, ease: [0.19, 1, 0.22, 1] }}
        className="relative w-full max-w-2xl text-center space-y-16"
      >
        <div className="inline-flex items-center justify-center w-32 h-32 bg-card/40 border border-border/50 rounded-full mb-8 shadow-2xl relative group">
          <div className="absolute inset-0 bg-accent/10 blur-[40px] rounded-full group-hover:bg-accent/20 transition-all duration-1000" />
          <currentStep.icon className={`w-14 h-14 ${currentStep.color} relative z-10`} />
        </div>

        <div className="space-y-8">
          <h2 className="text-6xl md:text-7xl font-serif tracking-tighter italic leading-tight">
            {currentStep.title}
          </h2>
          <p className="text-xl md:text-2xl font-mono text-muted-foreground/60 leading-relaxed max-w-xl mx-auto">
            {currentStep.description}
          </p>
        </div>

        <div className="pt-12 flex flex-col items-center gap-12">
          <Button 
            onClick={handleNext}
            className="px-16 py-8 bg-accent text-background rounded-full font-mono text-[10px] uppercase tracking-[0.4em] hover:scale-105 active:scale-95 transition-all duration-500 shadow-[0_30px_60px_rgba(245,166,35,0.2)] group"
          >
            {step === steps.length - 1 ? 'Enter Vault' : 'Synchronize Next'}
            <ArrowRight className="w-4 h-4 ml-4 group-hover:translate-x-2 transition-transform" />
          </Button>

          <div className="flex gap-4">
            {steps.map((_, i) => (
              <div 
                key={i} 
                className={`h-1 w-8 rounded-full transition-all duration-1000 ${i === step ? 'bg-accent w-16' : 'bg-white/10'}`} 
              />
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
}

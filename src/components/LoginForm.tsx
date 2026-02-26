import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { toast } from 'sonner';

export function LoginForm() {
  const { signIn, signUp, signInWithGoogle } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [loginData, setLoginData] = useState({
    email: '',
    password: ''
  });
  
  const [signupData, setSignupData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      await signIn(loginData.email, loginData.password);
      toast.success('Establishing connection to Vault...', {
        className: 'font-mono uppercase tracking-widest text-[10px] bg-card border-border text-accent',
      });
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to sign in';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    if (signupData.password !== signupData.confirmPassword) {
      setError('Passwords do not match');
      setIsLoading(false);
      return;
    }

    if (signupData.password.length < 6) {
      setError('Password must be at least 6 characters');
      setIsLoading(false);
      return;
    }

    try {
      await signUp(signupData.email, signupData.password, signupData.name);
      toast.success('Account created! Welcome to Recall!');
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to create account';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    setError(null);

    try {
      await signInWithGoogle();
      toast.success('Synchronizing with Google...');
    } catch (err: any) {
      const errorMessage = err.message || 'Failed to sign in with Google';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-foreground flex items-center justify-center p-6 selection:bg-accent/30 selection:text-accent overflow-hidden relative">
      <div className="absolute inset-0 opacity-[0.05] pointer-events-none bg-[url('data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noiseFilter\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.65\' numOctaves=\'3\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noiseFilter)\'/%3E%3C/svg%3E')]" />
      <div className="absolute inset-0 bg-gradient-to-tr from-accent/5 via-transparent to-accent/5" />

      <div className="w-full max-w-[440px] space-y-16 relative z-10 py-20">
        <div className="text-center space-y-10">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-accent rounded-full mb-4 shadow-[0_0_50px_rgba(245,166,35,0.2)]">
            <span className="font-mono text-3xl font-bold text-background">R</span>
          </div>
          <div className="space-y-4">
            <h1 className="text-7xl font-serif tracking-tighter leading-none">RECALL</h1>
            <p className="font-mono text-[10px] uppercase tracking-[0.5em] text-accent/60">
              The memory layer of the creative internet.
            </p>
          </div>
        </div>

        {error && (
          <div className="p-6 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-400 font-mono text-[10px] uppercase tracking-widest text-center animate-in fade-in slide-in-from-top-4 duration-500">
            {error}
          </div>
        )}

        <div className="bg-card/40 backdrop-blur-3xl border border-border rounded-[48px] p-10 md:p-14 shadow-[0_50px_100px_rgba(0,0,0,0.5)]">
          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2 bg-background/50 p-1.5 rounded-full border border-border mb-12">
              <TabsTrigger value="login" className="rounded-full font-mono text-[9px] uppercase tracking-widest py-3 data-[state=active]:bg-accent data-[state=active]:text-background transition-all duration-500">Sign In</TabsTrigger>
              <TabsTrigger value="signup" className="rounded-full font-mono text-[9px] uppercase tracking-widest py-3 data-[state=active]:bg-accent data-[state=active]:text-background transition-all duration-500">Sign Up</TabsTrigger>
            </TabsList>
            
            <TabsContent value="login" className="space-y-10">
              <form onSubmit={handleLogin} className="space-y-10">
                <div className="space-y-4">
                  <Label htmlFor="login-email" className="font-mono text-[9px] uppercase tracking-[0.2em] text-muted-foreground ml-4">Email Address</Label>
                  <Input id="login-email" type="email" placeholder="name@archival.vault" value={loginData.email} onChange={(e) => setLoginData({ ...loginData, email: e.target.value })} className="bg-background/40 border-border rounded-3xl h-16 px-8 font-mono text-sm focus:border-accent/50 transition-all duration-500 placeholder:text-muted-foreground/20 ring-0 focus-visible:ring-0" required disabled={isLoading} />
                </div>
                <div className="space-y-4">
                  <Label htmlFor="login-password" className="font-mono text-[9px] uppercase tracking-[0.2em] text-muted-foreground ml-4">Vault Key</Label>
                  <Input id="login-password" type="password" placeholder="••••••••" value={loginData.password} onChange={(e) => setLoginData({ ...loginData, password: e.target.value })} className="bg-background/40 border-border rounded-3xl h-16 px-8 font-mono text-sm focus:border-accent/50 transition-all duration-500 placeholder:text-muted-foreground/20 ring-0 focus-visible:ring-0" required disabled={isLoading} />
                </div>
                <Button type="submit" className="w-full bg-accent text-background h-20 rounded-3xl font-mono text-[10px] uppercase tracking-[0.4em] hover:scale-[1.02] active:scale-[0.98] transition-all duration-500 shadow-[0_20px_40px_rgba(245,166,35,0.15)]" disabled={isLoading}>{isLoading ? 'Decrypting...' : 'Enter the Vault'}</Button>
              </form>
            </TabsContent>
            
            <TabsContent value="signup" className="space-y-10">
              <form onSubmit={handleSignup} className="space-y-10">
                <div className="space-y-4">
                  <Label htmlFor="signup-name" className="font-mono text-[9px] uppercase tracking-[0.2em] text-muted-foreground ml-4">Full Identity</Label>
                  <Input id="signup-name" type="text" placeholder="Archivist Name" value={signupData.name} onChange={(e) => setSignupData({ ...signupData, name: e.target.value })} className="bg-background/40 border-border rounded-3xl h-16 px-8 font-mono text-sm focus:border-accent/50 transition-all duration-500 placeholder:text-muted-foreground/20 ring-0 focus-visible:ring-0" required disabled={isLoading} />
                </div>
                <div className="space-y-4">
                  <Label htmlFor="signup-email" className="font-mono text-[9px] uppercase tracking-[0.2em] text-muted-foreground ml-4">Email Address</Label>
                  <Input id="signup-email" type="email" placeholder="name@archival.vault" value={signupData.email} onChange={(e) => setSignupData({ ...signupData, email: e.target.value })} className="bg-background/40 border-border rounded-3xl h-16 px-8 font-mono text-sm focus:border-accent/50 transition-all duration-500 placeholder:text-muted-foreground/20 ring-0 focus-visible:ring-0" required disabled={isLoading} />
                </div>
                <div className="space-y-4">
                  <Label htmlFor="signup-password" className="font-mono text-[9px] uppercase tracking-[0.2em] text-muted-foreground ml-4">Vault Key</Label>
                  <Input id="signup-password" type="password" placeholder="••••••••" value={signupData.password} onChange={(e) => setSignupData({ ...signupData, password: e.target.value })} className="bg-background/40 border-border rounded-3xl h-16 px-8 font-mono text-sm focus:border-accent/50 transition-all duration-500 placeholder:text-muted-foreground/20 ring-0 focus-visible:ring-0" required disabled={isLoading} />
                </div>
                <div className="space-y-4">
                  <Label htmlFor="signup-confirm" className="font-mono text-[9px] uppercase tracking-[0.2em] text-muted-foreground ml-4">Verify Key</Label>
                  <Input id="signup-confirm" type="password" placeholder="••••••••" value={signupData.confirmPassword} onChange={(e) => setSignupData({ ...signupData, confirmPassword: e.target.value })} className="bg-background/40 border-border rounded-3xl h-16 px-8 font-mono text-sm focus:border-accent/50 transition-all duration-500 placeholder:text-muted-foreground/20 ring-0 focus-visible:ring-0" required disabled={isLoading} />
                </div>
                <Button type="submit" className="w-full bg-accent text-background h-20 rounded-3xl font-mono text-[10px] uppercase tracking-[0.4em] hover:scale-[1.02] active:scale-[0.98] transition-all duration-500 shadow-[0_20px_40px_rgba(245,166,35,0.15)]" disabled={isLoading}>{isLoading ? 'Encrypting...' : 'Initialize Vault'}</Button>
              </form>
            </TabsContent>
          </Tabs>

          <div className="mt-12 pt-12 border-t border-border/50 text-center">
            <button onClick={handleGoogleSignIn} className="font-mono text-[9px] uppercase tracking-widest text-muted-foreground hover:text-accent transition-colors duration-500 flex items-center justify-center gap-3 w-full">
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>
              Synchronize via Google Cloud
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

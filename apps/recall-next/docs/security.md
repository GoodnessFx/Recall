# Security Notes

- RLS enforced on every table; policies restrict to `auth.uid()`.
- Service role key never used on client; only in server cron.
- Middleware protects /dashboard, /search, /settings.
- CSP and security headers set in next.config.
- OAuth handled by Supabase; callback at /auth/callback.


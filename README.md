# Recall — Your Second Brain

Recall is a premium, scalable web app that pulls saved/bookmarked content from multiple sources, auto-tags by context, embeds for semantic recall, and delivers reminders, digests, and notifications. Built for mobile and desktop with strict security and zero tolerance for mistakes.

## Architecture

```mermaid
flowchart TD
  App[Next.js 16 App Router\nRSC + Server Actions] -->|supabase-js| DB[(Supabase Postgres + pgvector)]
  App --> AI[Vercel AI SDK (OpenAI/Grok/Anthropic)]
  AI -->|embeddings| DB
  App --> KV[(Upstash Redis / Vercel KV)]
  Cron[Vercel Cron] --> API[/api/cron/sync]
  API --> Email[Resend]
  App --> Storage[(Supabase Storage 'media')]
  App --> Analytics[Vercel Analytics + Sentry]
```

## Features
- Auth with X (Twitter) via Supabase OAuth 2.0; x_user_id stored post-login
- X bookmarks sync with pagination and rate-limits
- Manual import form (URL/text) + media upload to Supabase Storage
- Bookmarklet and PWA Web Share Target for mobile sharing
- AI pipeline: classify, tags, summary, optional reminder; embeddings stored in pgvector(1536)
- Hybrid Search: cosine similarity + full-text ts_rank_cd
- UI/UX: Dark mode, command bar (Cmd+K), knowledge graph, voice search, responsive feed
- Reminders: manual/AI/birthdays; cron checks due and sends emails; weekly digests
- Notifications: in-app and email digest
- PWA: manifest, service worker; installable on mobile
- Production: full RLS, proxy-based rate limiting, export JSON, GDPR delete, freemium limits, analytics

## Tech Stack
- Next.js 16 (App Router, Turbopack, RSC, Server Actions)
- TypeScript strict
- Supabase: Postgres + pgvector, RLS, Auth, Storage
- Vercel AI SDK
- Tailwind CSS 4 + shadcn/ui + lucide-react
- TanStack Query v5
- Zustand client state
- Resend email
- Upstash Redis for rate limiting
- Sentry + Vercel Analytics
- GitHub Actions CI (lint, test, build)

## Monorepo Layout
- apps/recall-next — production Next.js app
- apps/recall-next/docs — schema, security, components
- apps/recall-next/supabase/migrations — SQL schema + indexes + RLS
- .github/workflows/ci.yml — CI pipeline

## Setup

### 1) Environment
Copy apps/recall-next/.env.example to apps/recall-next/.env.local and fill:
- NEXT_PUBLIC_APP_URL, NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY
- SUPABASE_SERVICE_ROLE_KEY (server only; used in cron route)
- RESEND_API_KEY, EMAIL_FROM
- UPSTASH_REDIS_REST_URL, UPSTASH_REDIS_REST_TOKEN
- NEXT_PUBLIC_FREE_ITEM_LIMIT
- Provider API keys for Vercel AI (e.g., OPENAI_API_KEY) via Vercel project settings

### 2) Supabase
- Create project; enable extensions: vector, pg_trgm, pgcrypto
- Apply SQL: [20260303_initial.sql](file:///c:/Users/Admin/Desktop/Recall/apps/recall-next/supabase/migrations/20260303_initial.sql)
- Create Storage bucket: media (public)
- Auth: Enable Twitter (X) provider with callback URL:
  - ${NEXT_PUBLIC_APP_URL}/auth/callback

### 3) Development
```bash
cd apps/recall-next
npm install
npm run dev
```

### 4) Testing & Build
```bash
npm run lint
npm run test
npm run build
```

### 5) Deployment (Vercel)
- Set project root to apps/recall-next
- Add vercel.json to enable cron: /api/cron/sync every 4h
- Configure env vars in Vercel dashboard
- Optional: enable Sentry DSN and Vercel Analytics

## Mobile: Share & Upload
- Web Share Target: share links and text from mobile directly to /import/share
- Manual media upload at /import (images/videos to Supabase Storage)
- Bookmarklet: drag “Save to Recall” from /import into browser
- Voice search button (Web Speech API) opens /search?q=transcript

## Security
- Full RLS policies on all tables, enforcing auth.uid()
- No service role keys on client code
- Proxy-based rate limiting with Upstash Redis
- Strict headers via Next config; no secrets logged

## Data Management
- Export: /api/export returns your data JSON
- GDPR delete: /api/account/delete removes all user-owned data safely
- Freemium limit: NEXT_PUBLIC_FREE_ITEM_LIMIT enforces item cap; upgrade gating ready

## CI/CD
- GitHub Actions runs: npm ci, lint, test, build in apps/recall-next
- Keep .env* and node_modules excluded by .gitignore (root and app)

## Notes
- All critical features implemented in apps/recall-next
- Docs: see apps/recall-next/docs for deeper architecture and security notes

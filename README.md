# Recall — Your second Brain

Recall is a premium, scalable web app that unifies your digital fragments—messages, screenshots, PDFs, notes, and bookmarks—into a single, AI-powered archival interface. It is designed to be your permanent memory layer, indexing your digital soul and resurfacing insights when you need them most.

## 🧠 Core Philosophy
The creative internet is fragmented. We save things on X, like reels on Instagram, and favorite videos on TikTok, only for them to be lost in the noise. Recall brings them all together. It's not just a bookmark manager; it's your second brain.

## ✨ Features

- **Neural Timeline**: A fluid, responsive grid of your digital history with staggered entrance animations.
- **AI-Powered Semantic Search**: Talk to Recall. Use natural language to find that one video you saw months ago but can't quite remember the title of.
- **Smart Video Insights**: Powered by Gemini 1.5 Flash, Recall doesn't just save links; it categorizes them, summarizes them, and even gives you creative video ideas based on your saves.
- **Bulk Importers**: Specialized handlers for:
  - **TikTok**: Import your entire `user_data_tiktok.json` archive.
  - **Instagram**: Import your liked and saved posts from your Instagram JSON export folders.
  - **X (Twitter)**: One-click import for your bookmarks.
- **Mobile Share Target**: Save directly from TikTok, Instagram, or X on your phone using the PWA share sheet.
- **Privacy First**: Built on Supabase with strict Row-Level Security (RLS). Your data is yours.

## 🛠 Tech Stack

- **Frontend**: Next.js 16 (App Router), React 19, Tailwind CSS 4.
- **Backend**: Supabase (PostgreSQL + `pgvector` for semantic search, Auth, Storage).
- **AI**: Google Gemini 1.5 Flash for categorization, summarization, and conversational intelligence.
- **State & Motion**: Framer Motion for premium fluid transitions.
- **PWA**: Workbox for offline support and Web Share Target API.

## 📁 Project Structure

- `apps/recall-next/`: The core Next.js application.
- `apps/recall-next/data/`: Default location for bulk JSON exports.
- `your_instagram_activity/`: Support for direct Instagram data export folders at the root.
- `user_data_tiktok.json`: Support for direct TikTok data exports at the root.

## 🚀 Setup & Development

### 1) Prerequisites
- Node.js (v18 or higher)
- Supabase Project

### 2) Environment Variables
Copy `.env.example` to `apps/recall-next/.env.local` and fill in:
- `NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `GEMINI_API_KEY`
- `NEXT_PUBLIC_APP_URL` (e.g., http://localhost:3000)

### 3) Database Setup
Run the SQL migrations found in `apps/recall-next/supabase/migrations/` to set up the schema, `pgvector` indexes, and RLS policies.

### 4) Installation & Development
```bash
npm install
npm run dev
```
The application will be available at `http://localhost:3000`.

## 📱 Mobile Usage
1. Open Recall in your mobile browser.
2. Select "Add to Home Screen" to install the PWA.
3. You can now share any link from TikTok, Instagram, or X directly to the Recall app from your phone's share menu.

## 🔒 Security
- **Strict RLS**: Every query is gated by `auth.uid()`.
- **Rate Limiting**: Integrated protection for AI and Import routes via Upstash Redis.
- **Data Hygiene**: Automated sanitization of all metadata.

---
*RECALL — Everything you saved. Finally found.*

# SkillReady - Interview Q&A Tracker

SkillReady is a personal, topic-focused Interview Q&A Tracker built with **Next.js 14 (App Router)**, **Tailwind CSS**, and **Neon (Serverless Postgres)**.

## Features
- **Topic Bar**: Dynamic pills filtered from Neon PostgreSQL database with inline topic addition.
- **Question Cards**: Reveal answer toggle, color-coded confidence badges (`weak`, `medium`, `solid`) with one-click inline toggling.
- **Progress Tracking**: Dynamic progress bars per topic and overall dashboard stats.
- **Review Due System**: Highlights questions not reviewed in 7+ days.
- **Full CRUD**: Modal forms for adding and editing questions, with delete confirmation.
- **Neon Integration**: Serverless Postgres driver (`@neondatabase/serverless`) via Next.js Server Actions.

## Tech Stack
- **Framework**: Next.js 14 (App Router) + TypeScript
- **Styling**: Tailwind CSS
- **Database**: Neon Serverless Postgres
- **Deployment Target**: Vercel
- **Version Control**: Git / GitHub

---

## Database Setup (Neon Postgres)

1. Log into your [Neon Console](https://console.neon.tech).
2. Create a new project or select an existing project.
3. Open the **SQL Editor** tab and execute the following DDL script:

```sql
-- 1. Create topics table
CREATE TABLE IF NOT EXISTS topics (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- 2. Create questions table
CREATE TABLE IF NOT EXISTS questions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  topic_id UUID REFERENCES topics(id) ON DELETE CASCADE NOT NULL,
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  confidence TEXT CHECK (confidence IN ('weak', 'medium', 'solid')) DEFAULT 'weak' NOT NULL,
  last_reviewed TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW() NOT NULL
);

-- 3. Seed initial topics
INSERT INTO topics (name) VALUES 
  ('Data Structures & Algorithms'),
  ('System Design'),
  ('Behavioral'),
  ('Frontend React / Next.js'),
  ('Backend & DB')
ON CONFLICT (name) DO NOTHING;
```

---

## Local Development Setup

1. **Clone the repository**:
   ```bash
   git clone https://github.com/YOUR_GITHUB_USERNAME/skillready.git
   cd skillready
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   Copy `.env.example` to `.env.local`:
   ```bash
   cp .env.example .env.local
   ```
   Add your Neon connection string:
   ```env
   DATABASE_URL=postgresql://user:password@ep-sample-123456.us-east-2.aws.neon.tech/neondb?sslmode=require
   ```

4. **Run Dev Server**:
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Deploying to Vercel

1. Push your code to your GitHub repository `skillready`.
2. Go to [Vercel Dashboard](https://vercel.com/new) and import the repository.
3. Under **Environment Variables**, add:
   - `DATABASE_URL`: *(Your Neon Connection String)*
4. Click **Deploy**. Vercel will automatically trigger builds on every git push to `main`.

# SkillReady - Interview Q&A Tracker

SkillReady is a personal, topic-focused Interview Q&A Tracker built with **Next.js 14 (App Router)**, **Tailwind CSS**, and **Supabase (PostgreSQL)**.

## Features
- **Topic Bar**: Dynamic pills filtered from PostgreSQL database with inline topic addition.
- **Question Cards**: Reveal answer toggle, color-coded confidence badges (`weak`, `medium`, `solid`) with one-click inline toggling.
- **Progress Tracking**: Dynamic progress bars per topic and overall dashboard stats.
- **Review Due System**: Highlights questions not reviewed in 7+ days.
- **Full CRUD**: Modal forms for adding and editing questions, with delete confirmation.
- **Supabase Integration**: Clean client initialization and Server Actions for data mutation.

## Tech Stack
- **Framework**: Next.js 14 (App Router) + TypeScript
- **Styling**: Tailwind CSS
- **Database**: Supabase (PostgreSQL free tier)
- **Deployment**: Vercel
- **Version Control**: Git / GitHub

---

## Database Setup (Supabase)

Run the following SQL in your Supabase project's **SQL Editor**:

```sql
-- 1. Create topics table
CREATE TABLE IF NOT EXISTS topics (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Create questions table
CREATE TABLE IF NOT EXISTS questions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  topic_id UUID REFERENCES topics(id) ON DELETE CASCADE NOT NULL,
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  confidence TEXT CHECK (confidence IN ('weak', 'medium', 'solid')) DEFAULT 'weak' NOT NULL,
  last_reviewed TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Seed initial topics
INSERT INTO topics (name) VALUES 
  ('Data Structures & Algorithms'),
  ('System Design'),
  ('Behavioral'),
  ('Frontend React / Next.js'),
  ('Backend & DB')
ON CONFLICT (name) DO NOTHING;

-- 4. Enable Row Level Security (RLS) & add public access policy for v1
ALTER TABLE topics ENABLE ROW LEVEL SECURITY;
ALTER TABLE questions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public select on topics" ON topics FOR SELECT USING (true);
CREATE POLICY "Allow public insert on topics" ON topics FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update on topics" ON topics FOR UPDATE USING (true);
CREATE POLICY "Allow public delete on topics" ON topics FOR DELETE USING (true);

CREATE POLICY "Allow public select on questions" ON questions FOR SELECT USING (true);
CREATE POLICY "Allow public insert on questions" ON questions FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update on questions" ON questions FOR UPDATE USING (true);
CREATE POLICY "Allow public delete on questions" ON questions FOR DELETE USING (true);
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
   Fill in your Supabase project credentials:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
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
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. Click **Deploy**. Vercel will automatically trigger builds on every git push to `main`.

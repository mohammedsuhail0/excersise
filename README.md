# ⚡ AuraFit AI — Next-Gen Calisthenics & Fitness SaaS Platform

[![AuraFit AI CI Pipeline](https://github.com/mohammedsuhail0/excersise/actions/workflows/ci.yml/badge.svg)](https://github.com/mohammedsuhail0/excersise/actions/workflows/ci.yml)
[![Live Demo](https://img.shields.io/badge/Live%20Demo-Vercel-orange?style=flat&logo=vercel)](https://excersise-iota.vercel.app)
[![Tests Passing](https://img.shields.io/badge/Vitest-13%2F13%20Passed-emerald?style=flat&logo=vitest)](https://github.com/mohammedsuhail0/excersise)

> **Live Production App:** [https://excersise-iota.vercel.app](https://excersise-iota.vercel.app)  
> **GitHub Repository:** [https://github.com/mohammedsuhail0/excersise](https://github.com/mohammedsuhail0/excersise)

---

## 🌟 Overview

**AuraFit AI** is a state-of-the-art, full-stack Calisthenics & Fitness SaaS application designed for mobile-first athletic performance. It combines sub-second AI coaching, interactive calisthenics skill progressions, hardware-accelerometer step counting, bio-nutrition TDEE macro tracking, and real Spotify integration inside a sleek, dark-mode glassmorphism interface.

---

## 🔒 Production Security & Zero Key Leak Architecture

- **Serverless API Proxy (`api/coach.ts`):** Groq LLM API requests route 100% through a Vercel Serverless Function using server-side environment variables (`GROQ_API_KEY`). **Zero API keys are exposed to the client browser.**
- **Spotify PKCE Authorization Code Flow:** Client-side Spotify OAuth utilizes the public PKCE flow (`response_type=code` with SHA-256 `code_challenge`). Client Secrets are completely excluded from frontend bundles in compliance with Spotify OAuth 2.0 security specifications.

---

## 🧪 Comprehensive Vitest Testing Suite

The repository features a 100% green automated unit testing suite powered by **Vitest**:

1. **`src/tests/tdeeMacro.test.ts`:** Verifies BMR (Mifflin-St Jeor equation), activity multipliers, target calorie deficits/surpluses, and macro split equations (protein, carbs, fats).
2. **`src/tests/pedometer.test.ts`:** Mocks `DeviceMotionEvent` and tests 380ms–850ms cadence window step triggers while ensuring rapid shakes (<300ms) and long pauses (>1000ms) are filtered out.
3. **`src/tests/progression.test.ts`:** Verifies Calisthenics Progression Tree XP calculations, level-up state triggers, and unlocked phase title returns.
4. **`src/__tests__/pedometerCadence.test.ts`:** Stride impact wave acceleration testing.
5. **`src/__tests__/xpProgression.test.ts`:** Set log and workout completion XP carry-over calculations.

---

## 🔥 Key Features Breakdown

### 🤖 1. Sub-Second Sensei AI Coach (50ms Groq Serverless Engine)
- **Instant Response Times:** Powered by Groq's high-speed Llama 3.1 inference engine (sub-50ms latency).
- **Personalized Form Cues & Meal Plans:** Custom feedback tailored specifically to your weight, height, and target physique (*Anime Aesthetic, Lean Athletic, Powerlifter, Zen Mobility*).

### 🥗 2. Bio-Nutrition Macro & TDEE Calculator
- Calculates Total Daily Energy Expenditure (TDEE) using the Mifflin-St Jeor formula and provides tailored macronutrient targets based on user fitness goals.

### 🌳 3. Interactive Calisthenics Progression Tree
- **Target Muscle Groups:** Chest & Push, Abs & Core, Legs & Glutes, Back & Pull, and Muscle-Up.
- **Phase Unlock Engine:** Earn XP by completing exercise sets to level up and unlock advanced tier exercises.

### 🏃 4. Hardware Motion Pedometer
- **100% Accelerometer Motion Sensing:** Relies strictly on `DeviceMotionEvent` for real stride detection (zero artificial timers).
- **Smart Rhythmic Cadence Filter:** Filters out rapid hand shakes (380ms - 850ms human walking cadence window).

### 🎧 5. Tactile Spotify Audio Deck (PKCE OAuth)
- **Trending Curated Playlists:** Phonk, Hardstyle Workout, Beast Mode Gym, Rock, Lofi Chill, and Peaceful Piano.
- **3-Way Mood Filters:** Easily switch between *All Vibes*, *High Energy*, and *Relax & Zen*.

### 🔐 6. Supabase Auth & Cloud Data Sync
- **User Accounts:** Email & password authentication with custom user profile metadata.
- **Cloud Persistence:** Syncs XP, level progression, step counts, and workout logs to Supabase PostgreSQL.

---

## 🛠️ Tech Stack

- **Frontend:** React 18, TypeScript, Tailwind CSS, Lucide Icons, Vite
- **Backend & Serverless API:** Vercel Node.js Serverless Functions (`api/coach.ts`)
- **AI Inference Engine:** Groq API (`llama-3.1-8b-instant`)
- **Database & Auth:** Supabase Auth & PostgreSQL Database
- **Audio Integration:** Spotify Web API (PKCE OAuth 2.0 Flow)
- **Testing & CI/CD:** Vitest, GitHub Actions (`.github/workflows/ci.yml`)

---

## ⚙️ Environment Configuration

Refer to `.env.example` for environment variable configuration:

```env
# SERVER-SIDE ONLY (Vercel Serverless Function)
GROQ_API_KEY=gsk_your_groq_api_key_here

# PUBLIC CLIENT-SIDE (Safe for frontend bundle)
VITE_SPOTIFY_CLIENT_ID=6abb2966d85641b2bf05478031676c46
VITE_SUPABASE_URL=https://your-supabase-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
```

---

## 🚀 Local Setup & Testing Commands

```bash
# Clone the repository
git clone https://github.com/mohammedsuhail0/excersise.git
cd excersise

# Install dependencies
npm install

# Run automated Vitest test suite
npm run test

# Run TypeScript type check
npm run type-check

# Start local dev server
npm run dev

# Build production bundle
npm run build
```

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

# ⚡ AuraFit AI — Next-Gen Calisthenics & Fitness SaaS Platform

> **Live Demo:** [https://excersise-iota.vercel.app](https://excersise-iota.vercel.app)  
> **GitHub Repository:** [https://github.com/mohammedsuhail0/excersise](https://github.com/mohammedsuhail0/excersise)

---

## 🌟 Overview

**AuraFit AI** is a state-of-the-art, full-stack Calisthenics & Fitness SaaS application designed for mobile-first athletic performance. It combines sub-second AI coaching, interactive calisthenics skill progressions, hardware-accelerometer step counting, and real Spotify integration inside a sleek, dark-mode glassmorphism interface.

---

## 🔥 Key Features

### 🤖 1. Sub-Second Sensei AI Coach (Groq Llama 3.1 50ms Engine)
- **Instant Response Times:** Powered by Groq's high-speed Llama 3.1 inference engine (sub-50ms latency).
- **Personalized Form Cues & Meal Plans:** Custom feedback tailored specifically to your weight, height, and target physique (*Anime Aesthetic, Lean Athletic, Powerlifter, Zen Mobility*).

### 🌳 2. Interactive Calisthenics Progression Tree
- **Target Muscle Groups:** Chest & Push, Abs & Core, Legs & Glutes, Back & Pull, and Muscle-Up.
- **Phase Unlock Engine:** Earn XP by completing exercise sets to level up and unlock advanced tier exercises.

### 🏃 3. Hardware Motion Pedometer
- **100% Accelerometer Motion Sensing:** Relies strictly on `DeviceMotionEvent` for real stride detection (zero artificial timers).
- **Smart Rhythmic Cadence Filter:** Filters out rapid hand shakes (380ms - 850ms human walking cadence window).
- **One-Tap Reset:** Zero out steps anytime with a single tap.

### 🎧 4. Tactile Spotify Audio Deck (PKCE OAuth)
- **Spotify Authorization Code Flow with PKCE:** Secure 1-tap login with persistent token handling.
- **Trending Curated Playlists:** Phonk, Hardstyle Workout, Beast Mode Gym, Rock, Lofi Chill, and Peaceful Piano.
- **3-Way Mood Filters:** Easily switch between *All Vibes*, *High Energy*, and *Relax & Zen*.

### 🥗 5. Bio-Nutrition Macro & TDEE Calculator
- Calculates Total Daily Energy Expenditure (TDEE) and target macros (Protein, Carbs, Fats) based on activity level and fitness goals.

### 🔐 6. Supabase Auth & Cloud Data Sync
- **User Accounts:** Email & password authentication with custom user profile metadata.
- **Cloud Persistence:** Seamlessly syncs XP, level progression, step counts, and workout logs to Supabase PostgreSQL.

---

## 🛠️ Tech Stack

- **Frontend:** React 18, TypeScript, Tailwind CSS, Lucide Icons, Vite
- **AI Inference Engine:** Groq API (`llama-3.1-8b-instant`, `llama-3.3-70b-versatile`)
- **Backend & Auth:** Supabase Auth & PostgreSQL Database
- **Audio Integration:** Spotify Web API (PKCE OAuth 2.0 Flow)
- **Hosting & Proxy:** Vercel (with serverless rewrite proxies in `vercel.json`)

---

## ⚙️ Environment Configuration

Create a `.env` file in the project root:

```env
VITE_GROQ_API_KEY=gsk_...
VITE_SPOTIFY_CLIENT_ID=6abb2966d85641b2bf05478031676c46
VITE_SUPABASE_URL=https://your-supabase-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
```

---

## 🚀 Local Development Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/mohammedsuhail0/excersise.git
   cd excersise
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start development server:**
   ```bash
   npm run dev
   ```

4. **Build for production:**
   ```bash
   npm run build
   ```

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

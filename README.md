# 🤸 AuraFit AI • Pure Calisthenics & Fitness Tracker

[![React](https://img.shields.io/badge/React-18.x-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-5.x-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![License](https://img.shields.io/badge/License-MIT-orange.svg?style=for-the-badge)](LICENSE)

> A **Next-Gen Liquid Glass Native Mobile Calisthenics & Fitness Progression App** built for Home Workouts (Pull-Up Rod + Floor), Target Muscle Groups, and Elite Skill Progression.

---

## 🌟 Key Features

### 🎯 1. Target Muscle Group Cards
- **01. CHEST & PUSH:** Decline Push-Ups, Elevated Pike Push-Ups, Chair Edge Dips, Diamond Push-Ups.
- **02. ABS & CORE:** Hanging Leg Raises, L-Sit Floor Hold, Hollow Body Hold, Russian Twists.
- **03. LEGS & GLUTES:** Single-Leg Pistol Squats, Jump Squats, Bulgarian Split Squats, Single-Leg Glute Bridges.
- **04. BACK & PULL:** Pull-Up Rod Chest-to-Bar Pulls, Chin-Ups, Inverted Table Rows, False Grip Hangs.

### 🤸 2. Pure Calisthenics Skill Tree
- **01. The Muscle-Up** *(Explosive Pull to Dip Transition)*
- **02. The Handstand Push-Up** *(Overhead Pressing & Balance)*
- **03. The Planche** *(Straight-Arm Horizontal Hold)*
- **04. The Front Lever** *(Straight-Arm Horizontal Pull)*

### 🦶 3. Built-In Pedometer & Motion Sensor Step Tracker
- **Top Header Live Badge (`👣 6.4k`):** 1-tap access to your daily walking progress.
- **Interactive Pedometer Modal:** Circular progress ring, distance walked (km), calories burned (kcal), active walk duration (mins), and live motion sensor tracking.

### 🏋️ 4. In-Workout Exercise Form Guide Modal (Zero Distractions)
- Tap **Form Guide (ℹ️)** directly inside any active workout card to view:
  - 🎯 **Grip & Hand Setup** *(e.g. False grip wrist placement)*
  - 🧘 **Body Alignment & Core Tension** *(e.g. Hollow body hold, squeeze glutes)*
  - 🏃 **Execution Trajectory & Tempo**
  - ⚠️ **Common Mistakes (What NOT to do)** *(e.g. ❌ Kipping, ❌ Flaring elbows)*
  - 💡 **Calisthenics Pro Tips**

### 🔒 5. Set Completion Lock & 60s Rest Timer
- **Explicit `[Mark Done]` Set Buttons:** Clear micro-interactions for set logging.
- **Rest Timer Announcement Banner:** Automatically counts down 60s recovery with sound chimes.
- **Completion Lock:** Slide-to-finish track is **locked (`disabled`)** until **100% of sets across all exercises are checked off**, preventing premature session finishes.

### 🏆 6. Persistent Level Progress & Victory Unlocks (`localStorage`)
- Automatically saves completed sessions to local memory.
- Completing Phase 1 automatically advances that target to **Phase 2 (Unlocked!)** with a celebratory **Victory Unlock Modal** awarding **+150 XP**.

### 🎨 7. Athletic Flame Orange Aesthetics & Liquid Glass UX
- **1-Tap Dark & Light Theme Switcher:** Features high-contrast slate typography (`#0f172a`) in Light Mode.
- **Moody Gym Background Switcher:** Cycle through dark obsidian gym aesthetic images.
- **Zero Scrollbars:** Viewport locked to `h-[100dvh]` edge-to-edge native mobile container.

---

## 🛠️ Tech Stack

- **Frontend Core:** React 18 + TypeScript + Vite
- **Styling & UI:** Vanilla CSS + TailwindCSS + Custom Liquid Glass Glassmorphism
- **Icons:** Lucide React
- **Audio & Haptics:** Custom Sound Engine (Web Audio API)
- **State & Persistence:** React Hooks + `localStorage` API
- **Mobile Packaging Ready:** Capacitor Android / iOS compatible

---

## 🚀 Quick Start & Installation

### Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher)
- [npm](https://www.npmjs.com/)

### 1. Clone the Repository
```bash
git clone https://github.com/mohammedsuhail0/excersise.git
cd excersise
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Start Development Server
```bash
npm run dev
```
Open your browser at `http://localhost:3000/`

---

## 📦 Production Build

To build the production-ready bundle:
```bash
npm run build
```

---

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the [issues page](https://github.com/mohammedsuhail0/excersise/issues).

---

## 📄 License

This project is [MIT](LICENSE) licensed.

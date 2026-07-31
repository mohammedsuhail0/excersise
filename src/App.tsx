import React, { useState, useEffect } from 'react';
import { GamificationHeader } from './components/GamificationHeader';
import { TactileVibeSelector } from './components/TactileVibeSelector';
import { ExerciseFormGuideModal } from './components/ExerciseFormGuideModal';
import { ActiveWorkoutMode } from './components/ActiveWorkoutMode';
import { SpotifyAudioWidget } from './components/SpotifyAudioWidget';
import { MacroScannerModal } from './components/MacroScannerModal';
import { MacroCalculatorModal } from './components/MacroCalculatorModal';
import { FeatureSettingsModal } from './components/FeatureSettingsModal';
import { StepCounterModal } from './components/StepCounterModal';
import { AICalisthenicsCoachModal } from './components/AICalisthenicsCoachModal';
import { LandingPage } from './components/LandingPage';
import { AuthModal } from './components/AuthModal';
import { AccountProfileModal } from './components/AccountProfileModal';
import { StreakModal } from './components/StreakModal';

import { UserProfile, FeatureConfig, SetLog, CalisthenicsExercise, EquipmentMode, WorkoutRoutine } from './types';
import { TARGET_MUSCLE_GROUPS } from './data/calisthenicsTree';
import { Home, Dumbbell, Music, Utensils, Trophy, CheckCircle } from 'lucide-react';
import { soundEngine } from './services/soundEngine';
import {
  isSupabaseConfigured,
  syncUserProfileToSupabase,
  syncCompletedLevelToSupabase,
  logWorkoutToSupabase,
  syncStepsToSupabase,
  supabase,
} from './services/supabaseClient';

const BACKGROUND_OPTIONS = {
  dark: [
    {
      id: 'dark-gym-1',
      name: 'Moody Dark Gym',
      url: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=1400&q=85',
    },
    {
      id: 'dark-gym-2',
      name: 'Obsidian Athletics',
      url: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=1400&q=85',
    },
    {
      id: 'dark-gym-3',
      name: 'Cyber Fitness Glow',
      url: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&w=1400&q=85',
    },
  ],
  light: [
    {
      id: 'light-gym-1',
      name: 'Clean Minimalist Studio',
      url: 'https://images.unsplash.com/photo-1540497077202-7c8a3999166f?auto=format&fit=crop&w=1400&q=85',
    },
    {
      id: 'light-gym-2',
      name: 'Bright Athletic Space',
      url: 'https://images.unsplash.com/photo-1571902943202-507ec2618e8f?auto=format&fit=crop&w=1400&q=85',
    },
  ],
};

export function App() {
  // LANDING PAGE GATEWAY STATE
  const [isLandingMode, setIsLandingMode] = useState<boolean>(() => {
    const savedUser = localStorage.getItem('aurafit_user');
    return !savedUser; // Show Landing Page by default if user is not logged in!
  });

  // CLEAN INITIAL USER STATE
  const [user, setUser] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('aurafit_user');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return {
      name: 'Athlete',
      heightCm: 175,
      weightKg: 70,
      targetPhysique: 'Anime Aesthetic',
      level: 1,
      xp: 0,
      maxXp: 200,
      streakDays: 0,
      streakShields: 0,
    };
  });

  const [equipmentMode, setEquipmentMode] = useState<EquipmentMode>('Home');
  const [activeTab, setActiveTab] = useState<'vibe' | 'workout' | 'music' | 'macro'>('vibe');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isStepCounterOpen, setIsStepCounterOpen] = useState(false);
  const [isMacroCalculatorOpen, setIsMacroCalculatorOpen] = useState(false);
  const [isAICoachOpen, setIsAICoachOpen] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isAccountProfileOpen, setIsAccountProfileOpen] = useState(false);
  const [isStreakOpen, setIsStreakOpen] = useState(false);
  const [selectedFormGuideExercise, setSelectedFormGuideExercise] = useState<CalisthenicsExercise | null>(null);
  const [themeMode, setThemeMode] = useState<'dark' | 'light'>('dark');
  const [bgIndex, setBgIndex] = useState(0);

  const [showVictoryModal, setShowVictoryModal] = useState(false);
  const [victoryDetails, setVictoryDetails] = useState<{ title: string; nextPhaseTitle: string; xpEarned: number }>({
    title: 'Chest & Push Session',
    nextPhaseTitle: 'Phase 2: Intermediate Variations Unlocked!',
    xpEarned: 150,
  });

  // CLEAN INITIAL PEDOMETER STEPS STATE
  const [currentSteps, setCurrentSteps] = useState<number>(() => {
    const saved = localStorage.getItem('aurafit_daily_steps');
    return saved ? parseInt(saved, 10) || 0 : 0;
  });
  const stepGoal = 10000;

  // Track completed targets & unlocked tiers in state & localStorage
  const [completedLevels, setCompletedLevels] = useState<Record<string, number>>(() => {
    const saved = localStorage.getItem('aurafit_completed_levels');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return { 'chest-push': 1, 'abs-core': 1, 'legs-glutes': 1, 'back-pull': 1, 'muscle-up': 1 };
  });

  // Active Phase Workout Routine
  const [activePhaseRoutine, setActivePhaseRoutine] = useState<WorkoutRoutine>({
    id: 'calisthenics-p1',
    vibeStage: 'High Energy',
    title: 'CHEST & PUSH (Phase 1)',
    description: 'Decline & Pike Push-Ups, Dips & Diamond Press',
    estimatedMins: 30,
    estimatedCalories: 260,
    exercises: TARGET_MUSCLE_GROUPS[0].exercises,
  });

  const [featureConfig, setFeatureConfig] = useState<FeatureConfig>({
    skillTree: true,
    vibeSelector: true,
    workoutTracker: true,
    musicDeck: true,
    macroTracker: true,
    gamification: true,
  });

  // Check Supabase Auth Session on Load
  useEffect(() => {
    if (isSupabaseConfigured && supabase) {
      supabase.auth.getSession().then(({ data: { session } }) => {
        if (session?.user) {
          const metaName = session.user.user_metadata?.full_name || session.user.email?.split('@')[0] || 'Athlete';
          setUser((prev) => ({ ...prev, name: metaName }));
          setIsLandingMode(false); // Logged in -> Go directly into app!
        }
      });
    }
  }, []);

  // Persist State Locally & Sync with Supabase
  useEffect(() => {
    localStorage.setItem('aurafit_user', JSON.stringify(user));
    if (isSupabaseConfigured) {
      syncUserProfileToSupabase('guest-user-id', user);
    }
  }, [user]);

  useEffect(() => {
    localStorage.setItem('aurafit_completed_levels', JSON.stringify(completedLevels));
  }, [completedLevels]);

  useEffect(() => {
    localStorage.setItem('aurafit_daily_steps', currentSteps.toString());
    if (isSupabaseConfigured) {
      const distanceKm = parseFloat((currentSteps * 0.00075).toFixed(2));
      const caloriesBurned = Math.round(currentSteps * 0.04);
      syncStepsToSupabase('guest-user-id', currentSteps, distanceKm, caloriesBurned);
    }
  }, [currentSteps]);

  const handleToggleFeature = (key: keyof FeatureConfig) => {
    const updated = { ...featureConfig, [key]: !featureConfig[key] };
    setFeatureConfig(updated);
    localStorage.setItem('aurafit_feature_config', JSON.stringify(updated));
  };

  const handleToggleTheme = () => {
    soundEngine.playTick();
    setThemeMode((prev) => (prev === 'dark' ? 'light' : 'dark'));
    setBgIndex(0);
  };

  const bgList = BACKGROUND_OPTIONS[themeMode];
  const currentBg = bgList[bgIndex % bgList.length];

  const handleCycleBackground = () => {
    soundEngine.playTick();
    setBgIndex((prev) => (prev + 1) % bgList.length);
  };

  const handleStartPhaseWorkout = (exercises: CalisthenicsExercise[], phaseTitle: string) => {
    setActivePhaseRoutine({
      id: `session-${Date.now()}`,
      vibeStage: 'High Energy',
      title: phaseTitle,
      description: `Tailored Session for ${user.name}`,
      estimatedMins: 35,
      estimatedCalories: 300,
      exercises: exercises,
    });
    setActiveTab('workout');
  };

  const handleLogSet = (_setLog: SetLog) => {
    setUser((prev) => {
      const newXp = prev.xp + 25;
      if (newXp >= prev.maxXp) {
        return {
          ...prev,
          level: prev.level + 1,
          xp: newXp - prev.maxXp,
          maxXp: prev.maxXp + 100,
        };
      }
      return { ...prev, xp: newXp };
    });
  };

  const handleFinishWorkout = () => {
    soundEngine.playSetCompleteChime();
    
    const targetKey = activePhaseRoutine.title.toLowerCase().includes('chest')
      ? 'chest-push'
      : activePhaseRoutine.title.toLowerCase().includes('abs')
      ? 'abs-core'
      : activePhaseRoutine.title.toLowerCase().includes('leg')
      ? 'legs-glutes'
      : activePhaseRoutine.title.toLowerCase().includes('back')
      ? 'back-pull'
      : 'muscle-up';

    const currentLvl = completedLevels[targetKey] || 1;
    const nextLvl = currentLvl + 1;

    setCompletedLevels((prev) => ({
      ...prev,
      [targetKey]: nextLvl,
    }));

    if (isSupabaseConfigured) {
      syncCompletedLevelToSupabase('guest-user-id', targetKey, nextLvl);
      logWorkoutToSupabase('guest-user-id', activePhaseRoutine.title, activePhaseRoutine.estimatedMins, activePhaseRoutine.estimatedCalories, 150);
    }

    setUser((prev) => {
      const newXp = prev.xp + 150;
      let newLevel = prev.level;
      let newMaxXp = prev.maxXp;
      let remainingXp = newXp;

      if (remainingXp >= prev.maxXp) {
        newLevel += 1;
        remainingXp -= prev.maxXp;
        newMaxXp += 100;
      }

      return {
        ...prev,
        level: newLevel,
        xp: remainingXp,
        maxXp: newMaxXp,
        streakDays: prev.streakDays + 1,
      };
    });

    setVictoryDetails({
      title: activePhaseRoutine.title,
      nextPhaseTitle: `Phase ${nextLvl}: Advanced Tier Unlocked!`,
      xpEarned: 150,
    });

    setShowVictoryModal(true);
  };

  const handleCloseVictory = () => {
    setShowVictoryModal(false);
    setActiveTab('vibe');
  };

  const handleAuthSuccess = (userData: { name: string; email: string; isGuest?: boolean }) => {
    setUser((prev) => ({
      ...prev,
      name: userData.name,
    }));
    setIsLandingMode(false); // Enter App Dashboard!
    setActiveTab('vibe');
  };

  const handleSignOut = () => {
    if (isSupabaseConfigured && supabase) {
      supabase.auth.signOut();
    }
    setUser({
      name: 'Athlete',
      heightCm: 175,
      weightKg: 70,
      targetPhysique: 'Anime Aesthetic',
      level: 1,
      xp: 0,
      maxXp: 200,
      streakDays: 0,
      streakShields: 0,
    });
    localStorage.removeItem('aurafit_user');
    setIsLandingMode(true); // Return to Landing Page Gateway!
  };

  return (
    <div className={`h-screen h-[100dvh] w-full flex justify-center overflow-hidden selection:bg-none ${themeMode === 'light' ? 'light-mode bg-slate-100 text-slate-900' : 'bg-[#07090e] text-white'}`}>
      {/* NATIVE MOBILE CONTAINER LOCKED TO 390px COMPACT WIDTH */}
      <div className={`w-full max-w-[390px] h-screen h-[100dvh] flex flex-col justify-between relative overflow-hidden transition-colors duration-300 p-2.5 ${themeMode === 'light' ? 'bg-slate-200' : 'bg-[#0b0f19]'}`}>
        
        {/* ATHLETIC BACKGROUND IMAGE */}
        <div
          className="absolute inset-0 bg-center bg-cover bg-no-repeat blur-[10px] scale-[1.1] pointer-events-none transition-all duration-700"
          style={{ backgroundImage: `url('${currentBg.url}')` }}
        />

        {/* OVERLAY */}
        <div
          className={`absolute inset-0 pointer-events-none z-[1] transition-all duration-500 ${
            themeMode === 'light'
              ? 'bg-gradient-to-b from-white/80 via-white/65 to-slate-100/90'
              : 'bg-gradient-to-b from-black/75 via-black/60 to-black/85'
          }`}
        />

        {/* TOP HEADER (ONLY VISIBLE INSIDE APP DASHBOARD) */}
        {!isLandingMode && featureConfig.gamification && (
          <div className="relative z-10 shrink-0">
            <GamificationHeader
              user={user}
              currentSteps={currentSteps}
              themeMode={themeMode}
              onToggleTheme={handleToggleTheme}
              onCycleBackground={handleCycleBackground}
              onOpenSettings={() => setIsSettingsOpen(true)}
              onOpenStepCounter={() => setIsStepCounterOpen(true)}
              onOpenAccountProfile={() => setIsAccountProfileOpen(true)}
              onOpenStreakModal={() => setIsStreakOpen(true)}
            />
          </div>
        )}

        {/* MAIN VIEWPORT CONTENT */}
        <main className="flex-1 flex flex-col justify-between overflow-hidden relative z-10 my-1 min-h-0">
          {isLandingMode ? (
            /* FULL-SCREEN LANDING PAGE GATEWAY */
            <LandingPage
              onEnterApp={() => {
                setIsLandingMode(false);
                setActiveTab('vibe');
              }}
              onOpenAuth={() => setIsAuthOpen(true)}
            />
          ) : (
            /* APP DASHBOARD VIEWS */
            <>
              {activeTab === 'vibe' && (
                <TactileVibeSelector
                  user={user}
                  equipmentMode={equipmentMode}
                  completedLevels={completedLevels}
                  onToggleEquipment={() => setEquipmentMode((prev) => (prev === 'Home' ? 'Gym' : 'Home'))}
                  onStartWorkout={handleStartPhaseWorkout}
                  onOpenAICoach={() => setIsAICoachOpen(true)}
                />
              )}

              {activeTab === 'workout' && (
                <ActiveWorkoutMode
                  routine={activePhaseRoutine}
                  onLogSet={handleLogSet}
                  onFinishWorkout={handleFinishWorkout}
                  onBackToSkills={() => setActiveTab('vibe')}
                  onOpenFormGuide={(exercise) => setSelectedFormGuideExercise(exercise)}
                />
              )}

              {activeTab === 'music' && featureConfig.musicDeck && (
                <SpotifyAudioWidget />
              )}

              {activeTab === 'macro' && featureConfig.macroTracker && (
                <MacroScannerModal />
              )}
            </>
          )}
        </main>

        {/* LIQUID GLASS BOTTOM NAVIGATION DOCK (ONLY VISIBLE INSIDE APP DASHBOARD) */}
        {!isLandingMode && (
          <nav className="w-full h-[46px] rounded-full liquid-glass flex items-center justify-around px-3 relative z-50 shrink-0 mt-1">
            {/* HOME DASHBOARD LOGO ICON */}
            <button
              onClick={() => setActiveTab('vibe')}
              className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                activeTab === 'vibe'
                  ? 'bg-orange-500/20 text-orange-500 border border-orange-500/40 shadow-lg scale-110'
                  : themeMode === 'light' ? 'text-slate-600 hover:text-slate-900' : 'text-white/60 hover:text-white'
              }`}
              title="Dashboard"
            >
              <Home className="w-5 h-5" />
            </button>

            {/* WORKOUT LOGO ICON */}
            <button
              onClick={() => setActiveTab('workout')}
              className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                activeTab === 'workout'
                  ? 'bg-orange-500/20 text-orange-500 border border-orange-500/40 shadow-lg scale-110'
                  : themeMode === 'light' ? 'text-slate-600 hover:text-slate-900' : 'text-white/60 hover:text-white'
              }`}
              title="Workout"
            >
              <Dumbbell className="w-5 h-5" />
            </button>

            {/* AUDIO LOGO ICON */}
            {featureConfig.musicDeck && (
              <button
                onClick={() => setActiveTab('music')}
                className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                  activeTab === 'music'
                    ? 'bg-orange-500/20 text-orange-500 border border-orange-500/40 shadow-lg scale-110'
                    : themeMode === 'light' ? 'text-slate-600 hover:text-slate-900' : 'text-white/60 hover:text-white'
                }`}
                title="Audio"
              >
                <Music className="w-5 h-5" />
              </button>
            )}

            {/* MACROS LOGO ICON */}
            {featureConfig.macroTracker && (
              <button
                onClick={() => setIsMacroCalculatorOpen(true)}
                className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${
                  activeTab === 'macro'
                    ? 'bg-orange-500/20 text-orange-500 border border-orange-500/40 shadow-lg scale-110'
                    : themeMode === 'light' ? 'text-slate-600 hover:text-slate-900' : 'text-white/60 hover:text-white'
                }`}
                title="Macros"
              >
                <Utensils className="w-5 h-5" />
              </button>
            )}
          </nav>
        )}

        {/* AUTHENTICATION SIGN IN / SIGN UP MODAL */}
        <AuthModal
          isOpen={isAuthOpen}
          onClose={() => setIsAuthOpen(false)}
          onAuthSuccess={handleAuthSuccess}
        />

        {/* ACCOUNT PROFILE MODAL */}
        <AccountProfileModal
          isOpen={isAccountProfileOpen}
          onClose={() => setIsAccountProfileOpen(false)}
          user={user}
          onUpdateProfile={(updated) => setUser((prev) => ({ ...prev, ...updated }))}
          onSignOut={handleSignOut}
        />

        {/* DAILY STREAK MODAL */}
        <StreakModal
          isOpen={isStreakOpen}
          onClose={() => setIsStreakOpen(false)}
          user={user}
          onUpdateUser={(updated) => setUser((prev) => ({ ...prev, ...updated }))}
        />

        {/* MACRO & CALORIE CALCULATOR MODAL */}
        <MacroCalculatorModal
          isOpen={isMacroCalculatorOpen}
          onClose={() => setIsMacroCalculatorOpen(false)}
          user={user}
        />

        {/* AI CALISTHENICS COACH SENSEI MODAL */}
        <AICalisthenicsCoachModal
          isOpen={isAICoachOpen}
          onClose={() => setIsAICoachOpen(false)}
          user={user}
        />

        {/* PEDOMETER STEP COUNTER MODAL */}
        <StepCounterModal
          isOpen={isStepCounterOpen}
          onClose={() => setIsStepCounterOpen(false)}
          currentSteps={currentSteps}
          stepGoal={stepGoal}
          onUpdateSteps={(newSteps) => setCurrentSteps(newSteps)}
        />

        {/* WORKOUT VICTORY UNLOCK MODAL */}
        {showVictoryModal && (
          <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-fade-up">
            <div className="w-full max-w-sm bg-[#0f1420] border border-orange-500/40 rounded-[32px] p-5 text-center space-y-4 shadow-2xl text-white">
              <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-orange-500 to-amber-500 flex items-center justify-center mx-auto shadow-lg shadow-orange-500/30 animate-bounce">
                <Trophy className="w-8 h-8 text-white" />
              </div>

              <div>
                <span className="text-[10px] font-bold text-orange-400 uppercase tracking-widest block">
                  Session Completed!
                </span>
                <h2 className="text-[20px] font-extrabold text-white leading-tight mt-0.5">
                  {victoryDetails.title}
                </h2>
                <p className="text-[12px] text-amber-400 font-semibold mt-1">
                  +{victoryDetails.xpEarned} XP Earned! Streak +1 Day 🔥
                </p>
              </div>

              <div className="liquid-glass rounded-[20px] p-3 border border-orange-500/30 text-left space-y-1">
                <div className="flex items-center space-x-1.5 text-orange-400 font-bold text-[11px]">
                  <CheckCircle className="w-3.5 h-3.5" />
                  <span>Phase Progress Saved & Synced!</span>
                </div>
                <p className="text-[11px] text-white/80 leading-snug">
                  {victoryDetails.nextPhaseTitle} You have leveled up!
                </p>
              </div>

              <button
                onClick={handleCloseVictory}
                className="w-full py-3 rounded-full bg-gradient-to-r from-orange-500 to-amber-500 text-white font-extrabold text-[13px] shadow-lg shadow-orange-500/30 hover:scale-[1.02] active:scale-95 transition-all"
              >
                Claim XP & Return Home
              </button>
            </div>
          </div>
        )}

        {/* In-App Exercise Form Guide Modal */}
        <ExerciseFormGuideModal
          exercise={selectedFormGuideExercise}
          onClose={() => setSelectedFormGuideExercise(null)}
        />

        {/* Feature Settings Modal */}
        <FeatureSettingsModal
          isOpen={isSettingsOpen}
          onClose={() => setIsSettingsOpen(false)}
          config={featureConfig}
          onToggleFeature={handleToggleFeature}
        />
      </div>
    </div>
  );
}

export default App;

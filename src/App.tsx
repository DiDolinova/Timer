import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Stopwatch } from './components/Stopwatch';
import { TimerSimple } from './components/TimerSimple';
import { TimerPomodoro } from './components/TimerPomodoro';
import { BottomLeftControls } from './components/BottomLeftControls';
import { AppMode, TimerSubMode, TimeOfDay, BackgroundType } from './types';
import { APP_THEMES } from './data/themes';
import { Language, TRANSLATIONS } from './locales/translations';

export default function App() {
  const [mode, setMode] = useState<AppMode>('stopwatch');
  const [timerSubMode, setTimerSubMode] = useState<TimerSubMode>('pomodoro');

  // Language state: English by default as requested!
  const [language, setLanguage] = useState<Language>('en');
  const t = TRANSLATIONS[language];

  // Theme settings
  const [timeOfDay, setTimeOfDay] = useState<TimeOfDay>('night');
  const [backgroundType, setBackgroundType] = useState<BackgroundType>('image');
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  const handleToggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
        setIsFullscreen(false);
      }
    }
  };

  useEffect(() => {
    const onFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', onFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', onFullscreenChange);
  }, []);

  const currentThemes = mode === 'stopwatch' ? APP_THEMES.stopwatch : APP_THEMES.timer;
  const activeWallpaper = timeOfDay === 'day' ? currentThemes.dayWallpaper : currentThemes.nightWallpaper;
  const activeGradient = timeOfDay === 'day' ? currentThemes.dayGradient : currentThemes.nightGradient;

  const getActiveBgName = () => {
    if (mode === 'stopwatch') {
      if (backgroundType === 'image') {
        return timeOfDay === 'day' ? t.swDayWallpaper : t.swNightWallpaper;
      }
      return timeOfDay === 'day' ? t.swDayGradient : t.swNightGradient;
    } else {
      if (backgroundType === 'image') {
        return timeOfDay === 'day' ? t.timerDayWallpaper : t.timerNightWallpaper;
      }
      return timeOfDay === 'day' ? t.timerDayGradient : t.timerNightGradient;
    }
  };

  const isNight = timeOfDay === 'night';

  return (
    <div className="relative min-h-screen w-full flex flex-col justify-between overflow-x-hidden select-none font-sans">
      {/* Background Layer: ZERO BLUR for crystal-clear 4K photo quality */}
      {backgroundType === 'image' ? (
        <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
          <img
            key={activeWallpaper.url}
            src={activeWallpaper.url}
            alt={activeWallpaper.name}
            className="w-full h-full object-cover transition-opacity duration-700 ease-in-out"
          />
          {/* Subtle contrast tint without ANY backdrop-blur! Crisp and sharp picture */}
          <div
            className={`absolute inset-0 transition-opacity duration-700 pointer-events-none ${
              isNight ? 'bg-black/35' : 'bg-black/10'
            }`}
          />
        </div>
      ) : (
        <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
          {/* Rich CSS mesh gradient generated from user references */}
          <div
            style={activeGradient.style}
            className="w-full h-full transition-all duration-700 ease-in-out"
          />
          {/* Subtle ambient lighting */}
          <div
            className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full blur-3xl pointer-events-none opacity-40"
            style={{
              backgroundColor: mode === 'stopwatch' ? 'rgba(241, 156, 187, 0.25)' : 'rgba(255, 218, 185, 0.25)',
            }}
          />
        </div>
      )}

      {/* Foreground Content */}
      <div className="relative z-10 flex flex-col min-h-screen justify-between">
        {/* Top Header: Single word per button, fully translated, equal width */}
        <Header
          mode={mode}
          onModeChange={setMode}
          timerSubMode={timerSubMode}
          onTimerSubModeChange={setTimerSubMode}
          t={t}
        />

        {/* Center Main Stage: Strictly centered, compact padding to fit in 1 screen */}
        <main className="flex-1 flex items-center justify-center px-4 py-2 sm:py-4 w-full my-auto">
          {mode === 'stopwatch' && <Stopwatch isNight={isNight} t={t} />}
          {mode === 'timer' && timerSubMode === 'simple' && (
            <TimerSimple isNight={isNight} t={t} />
          )}
          {mode === 'timer' && timerSubMode === 'pomodoro' && (
            <TimerPomodoro isNight={isNight} t={t} />
          )}
        </main>

        {/* Bottom Area: Music & Visual cluster on bottom-left with Language Switcher & Fullscreen */}
        <footer className="w-full px-4 sm:px-6 py-3 z-20 flex flex-col sm:flex-row items-start sm:items-end justify-between gap-3">
          {/* Left bottom: Music & Visual controls, flanked on right by Language Switcher [EN] [RU] and Fullscreen Button */}
          <BottomLeftControls
            mode={mode}
            timeOfDay={timeOfDay}
            onTimeOfDayChange={setTimeOfDay}
            backgroundType={backgroundType}
            onBackgroundTypeChange={setBackgroundType}
            activeBgName={getActiveBgName()}
            language={language}
            onLanguageChange={setLanguage}
            isFullscreen={isFullscreen}
            onToggleFullscreen={handleToggleFullscreen}
            t={t}
          />

          {/* Right bottom brand label */}
          <div
            className={`hidden sm:block text-[11px] font-bold px-3 py-1.5 rounded-xl backdrop-blur-md border shadow-sm ${
              isNight ? 'bg-black/60 border-white/15 text-white' : 'bg-white/80 border-slate-300 text-[#0a192f]'
            }`}
          >
            {t.brandStudio(mode === 'stopwatch' ? t.stopwatch : t.timer)}
          </div>
        </footer>
      </div>
    </div>
  );
}

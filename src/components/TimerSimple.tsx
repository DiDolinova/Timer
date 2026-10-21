import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Sliders, Bell } from 'lucide-react';
import { soundEffects } from '../services/soundEffects';
import { Translations } from '../locales/translations';

interface TimerSimpleProps {
  isNight: boolean;
  t: Translations;
}

export const TimerSimple: React.FC<TimerSimpleProps> = ({ isNight, t }) => {
  const [totalDurationMs, setTotalDurationMs] = useState<number>(15 * 60 * 1000);
  const [remainingMs, setRemainingMs] = useState<number>(15 * 60 * 1000);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);

  const [sliderMinutes, setSliderMinutes] = useState<number>(15);

  const requestRef = useRef<number | null>(null);
  const intervalRef = useRef<number | null>(null);
  const endTimeRef = useRef<number>(0);
  const remainingMsRef = useRef<number>(15 * 60 * 1000);
  const isRunningRef = useRef<boolean>(false);
  const lastSecondTickedRef = useRef<number | null>(null);

  const stopTimerLoops = () => {
    if (requestRef.current !== null) {
      cancelAnimationFrame(requestRef.current);
      requestRef.current = null;
    }
    if (intervalRef.current !== null) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  const handleSliderChange = (newMinutes: number) => {
    soundEffects.resumeContext();
    stopTimerLoops();
    isRunningRef.current = false;
    setIsRunning(false);
    setIsCompleted(false);

    setSliderMinutes(newMinutes);
    const ms = newMinutes * 60 * 1000;
    setTotalDurationMs(ms);
    setRemainingMs(ms);
    remainingMsRef.current = ms;
    lastSecondTickedRef.current = null;
  };

  const handleStartPause = () => {
    soundEffects.resumeContext();

    if (isRunning) {
      // Pause action
      stopTimerLoops();
      isRunningRef.current = false;
      setIsRunning(false);

      const now = performance.now();
      const currentRemaining = Math.max(0, endTimeRef.current - now);
      remainingMsRef.current = currentRemaining;
      setRemainingMs(currentRemaining);
    } else {
      // Start or Resume action
      let startMs = remainingMsRef.current;
      if (startMs <= 0 || isCompleted) {
        startMs = totalDurationMs;
        setIsCompleted(false);
        lastSecondTickedRef.current = null;
      }

      remainingMsRef.current = startMs;
      setRemainingMs(startMs);
      endTimeRef.current = performance.now() + startMs;
      isRunningRef.current = true;
      setIsRunning(true);
    }
  };

  const handleReset = () => {
    soundEffects.resumeContext();
    stopTimerLoops();
    isRunningRef.current = false;
    setIsRunning(false);
    setIsCompleted(false);

    remainingMsRef.current = totalDurationMs;
    setRemainingMs(totalDurationMs);
    lastSecondTickedRef.current = null;
  };

  useEffect(() => {
    if (!isRunning) {
      stopTimerLoops();
      isRunningRef.current = false;
      return;
    }

    isRunningRef.current = true;
    endTimeRef.current = performance.now() + remainingMsRef.current;

    const tick = () => {
      if (!isRunningRef.current) return;

      const now = performance.now();
      const diff = Math.max(0, endTimeRef.current - now);
      remainingMsRef.current = diff;
      setRemainingMs(diff);

      const currentWholeSeconds = Math.ceil(diff / 1000);
      if (
        currentWholeSeconds <= 5 &&
        currentWholeSeconds >= 1 &&
        lastSecondTickedRef.current !== currentWholeSeconds
      ) {
        lastSecondTickedRef.current = currentWholeSeconds;
        soundEffects.playClockTick(currentWholeSeconds);
      }

      if (diff <= 0) {
        stopTimerLoops();
        isRunningRef.current = false;
        setIsRunning(false);
        setIsCompleted(true);
        soundEffects.playChimeBell();
        return;
      }

      requestRef.current = requestAnimationFrame(tick);
    };

    requestRef.current = requestAnimationFrame(tick);
    intervalRef.current = window.setInterval(tick, 200);

    return () => {
      stopTimerLoops();
    };
  }, [isRunning, totalDurationMs]);

  const formatDigits = (ms: number) => {
    const totalSeconds = Math.floor(ms / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    const milliseconds = Math.floor((ms % 1000) / 10);

    return {
      hh: hours.toString().padStart(2, '0'),
      mm: minutes.toString().padStart(2, '0'),
      ss: seconds.toString().padStart(2, '0'),
      ms: milliseconds.toString().padStart(2, '0'),
    };
  };

  const { hh, mm, ss, ms } = formatDigits(remainingMs);
  const wholeSeconds = Math.ceil(remainingMs / 1000);

  useEffect(() => {
    const hours = Math.floor(wholeSeconds / 3600);
    const minutes = Math.floor((wholeSeconds % 3600) / 60);
    const seconds = wholeSeconds % 60;

    const mmStr = minutes.toString().padStart(2, '0');
    const ssStr = seconds.toString().padStart(2, '0');
    const timeStr =
      hours > 0
        ? `${hours.toString().padStart(2, '0')}:${mmStr}:${ssStr}`
        : `${mmStr}:${ssStr}`;

    const titleSuffix = t.simpleTimer === 'Countdown' ? 'Countdown Timer' : 'Таймер';
    document.title = `${timeStr} | ${titleSuffix}`;
  }, [wholeSeconds, t]);

  const progressRatio = totalDurationMs > 0 ? (totalDurationMs - remainingMs) / totalDurationMs : 0;

  // Дневная тема: темно-синий цвет (#0a192f)
  // Вечерняя тема: персиковый (#FFDAB9)
  const cardBg = isNight
    ? 'bg-slate-950/75 border-[#FFDAB9]/40 text-white shadow-2xl backdrop-blur-2xl'
    : 'bg-white/85 border-[#FFDAB9]/40 text-[#0a192f] shadow-xl backdrop-blur-2xl';

  const digitTextColor = isNight ? 'text-[#FFDAB9]' : 'text-[#0a192f]';
  const labelTextColor = isNight ? 'text-[#FFDAB9]/80' : 'text-[#0a192f]/70';
  const separatorColor = isNight ? '#FFDAB9' : '#0a192f';

  const isResetDisabled = !isRunning && remainingMs === totalDurationMs && !isCompleted;

  return (
    <div className="flex flex-col items-center justify-center w-full max-w-xl mx-auto text-center transition-all duration-300">
      <div
        className={`w-full rounded-3xl border p-4 sm:p-7 ${cardBg} relative overflow-hidden transition-all duration-500 flex flex-col items-center justify-center shadow-2xl`}
      >
        {/* Glow */}
        <div className="absolute -top-12 -right-12 w-48 h-48 bg-[#FFDAB9]/15 rounded-full blur-3xl pointer-events-none" />

        {/* Header Indicator */}
        <div className="flex items-center justify-between w-full mb-3 pb-2 border-b border-[#FFDAB9]/25">
          <div className="flex items-center gap-2">
            <span
              className={`w-2.5 h-2.5 rounded-full ${
                isNight ? 'bg-[#FFDAB9]' : 'bg-[#0a192f]'
              } ${isRunning ? 'animate-pulse' : ''}`}
            />
            <span
              className={`text-xs font-bold tracking-wider uppercase ${
                isNight ? 'text-[#FFDAB9]' : 'text-[#0a192f]'
              }`}
            >
              {t.countdownHeader}
            </span>
          </div>

          {isCompleted && (
            <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-600 dark:text-emerald-300 text-xs font-bold animate-bounce">
              <Bell className="w-3.5 h-3.5" />
              <span>{t.timeIsUp}</span>
            </div>
          )}
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-black/20 h-1.5 rounded-full overflow-hidden mb-4 border border-black/10">
          <div
            className={`h-full ${
              isNight ? 'bg-[#FFDAB9]' : 'bg-[#0a192f]'
            } transition-all duration-150`}
            style={{ width: `${Math.min(100, Math.max(0, progressRatio * 100))}%` }}
          />
        </div>

        {/* Unified single-line digits: HH : MM : SS . MS all in SAME SIZE! */}
        <div className="flex flex-col items-center justify-center my-2 sm:my-4 w-full">
          <div className="flex items-center justify-center font-digits font-extrabold tracking-tight select-none">
            {/* Hours */}
            <div className="flex flex-col items-center">
              <span
                className={`text-3xl sm:text-6xl font-extrabold tracking-tight drop-shadow-sm ${digitTextColor}`}
              >
                {hh}
              </span>
              <span
                className={`text-[9px] uppercase tracking-widest font-semibold mt-0.5 ${labelTextColor}`}
              >
                {t.hoursUnit}
              </span>
            </div>

            <span
              className="text-2xl sm:text-5xl font-light px-1 sm:px-2 -translate-y-2"
              style={{ color: separatorColor }}
            >
              :
            </span>

            {/* Minutes */}
            <div className="flex flex-col items-center">
              <span
                className={`text-3xl sm:text-6xl font-extrabold tracking-tight drop-shadow-sm ${digitTextColor}`}
              >
                {mm}
              </span>
              <span
                className={`text-[9px] uppercase tracking-widest font-semibold mt-0.5 ${labelTextColor}`}
              >
                {t.minutesUnit}
              </span>
            </div>

            <span
              className="text-2xl sm:text-5xl font-light px-1 sm:px-2 -translate-y-2"
              style={{ color: separatorColor }}
            >
              :
            </span>

            {/* Seconds */}
            <div className="flex flex-col items-center">
              <span
                className={`text-3xl sm:text-6xl font-extrabold tracking-tight drop-shadow-sm ${digitTextColor}`}
              >
                {ss}
              </span>
              <span
                className={`text-[9px] uppercase tracking-widest font-semibold mt-0.5 ${labelTextColor}`}
              >
                {t.secondsUnit}
              </span>
            </div>

            <span
              className="text-2xl sm:text-5xl font-light px-1 sm:px-2 -translate-y-2"
              style={{ color: separatorColor }}
            >
              .
            </span>

            {/* Milliseconds: SAME FONT SIZE AS MIN/SEC! */}
            <div className="flex flex-col items-center">
              <span
                className={`text-3xl sm:text-6xl font-extrabold tracking-tight drop-shadow-sm ${digitTextColor}`}
              >
                {ms}
              </span>
              <span
                className={`text-[9px] uppercase tracking-widest font-semibold mt-0.5 ${labelTextColor}`}
              >
                {t.millisUnit}
              </span>
            </div>
          </div>
        </div>

        {/* Slider for setting time */}
        <div
          className={`w-full mt-2 sm:mt-4 p-3 rounded-2xl border ${
            isNight ? 'bg-black/40 border-[#FFDAB9]/25' : 'bg-slate-50 border-slate-200'
          }`}
        >
          <div className="flex items-center justify-between text-xs mb-1.5">
            <span
              className={`flex items-center gap-1.5 font-bold ${
                isNight ? 'text-white' : 'text-[#0a192f]'
              }`}
            >
              <Sliders className="w-3.5 h-3.5 text-[#FFDAB9]" />
              {t.timeSlider}
            </span>
            <span
              className={`font-bold text-sm ${
                isNight ? 'text-[#FFDAB9]' : 'text-[#0a192f]'
              }`}
            >
              {sliderMinutes} {t.minutesAbbr}
            </span>
          </div>

          <input
            type="range"
            min={1}
            max={120}
            step={1}
            disabled={isRunning}
            value={sliderMinutes}
            onChange={(e) => handleSliderChange(Number(e.target.value))}
            className="w-full h-1.5 bg-slate-300 dark:bg-slate-800 rounded appearance-none cursor-pointer accent-[#0a192f] dark:accent-[#FFDAB9] focus:outline-none disabled:opacity-50"
          />
        </div>

        {/* Action Controls: Start has SAME HEIGHT as Reset! */}
        <div className="flex items-center justify-center gap-3 sm:gap-4 mt-3 sm:mt-5 pt-4 border-t border-[#FFDAB9]/25 w-full">
          {/* Start / Pause Main Button */}
          <button
            onClick={handleStartPause}
            className={`h-11 sm:h-12 px-8 sm:px-12 rounded-2xl text-sm sm:text-base font-extrabold flex items-center justify-center gap-2 shadow-lg transition-all transform hover:scale-105 active:scale-95 cursor-pointer ${
              isRunning
                ? 'bg-amber-600 hover:bg-amber-700 text-white shadow-amber-600/40 ring-1 ring-white/40'
                : isNight
                ? 'bg-[#FFDAB9] hover:bg-[#ffe4cc] text-[#2c190a] shadow-[#FFDAB9]/40 ring-1 ring-white/40'
                : 'bg-[#0a192f] hover:bg-[#112240] text-white shadow-lg ring-2 ring-[#0a192f]/20'
            }`}
          >
            {isRunning ? (
              <>
                <Pause className="w-4 h-4 fill-current" />
                <span>{t.pauseBtn}</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-current ml-0.5" />
                <span>
                  {isCompleted
                    ? t.restartBtn
                    : remainingMs < totalDurationMs
                    ? t.resumeBtn
                    : t.startBtn}
                </span>
              </>
            )}
          </button>

          {/* Reset Button (Same height!) */}
          <button
            onClick={handleReset}
            disabled={isResetDisabled}
            className={`h-11 sm:h-12 px-5 rounded-2xl text-xs sm:text-sm font-bold flex items-center justify-center gap-1.5 shadow-sm transition-all ${
              isResetDisabled
                ? 'opacity-40 cursor-not-allowed bg-slate-800/20 text-slate-500'
                : isNight
                ? 'bg-[#FFDAB9]/20 hover:bg-[#FFDAB9]/30 text-[#FFDAB9] border border-[#FFDAB9]/40 hover:scale-105 active:scale-95 cursor-pointer'
                : 'bg-white hover:bg-slate-50 text-[#0a192f] border border-[#0a192f]/30 shadow-md hover:scale-105 active:scale-95 cursor-pointer'
            }`}
            title={t.resetTimerTooltip}
          >
            <RotateCcw className="w-4 h-4" />
            <span>{t.resetBtn}</span>
          </button>
        </div>
      </div>
    </div>
  );
};

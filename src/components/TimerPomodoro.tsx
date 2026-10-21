import React, { useState, useEffect, useRef } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  Clock,
  ChevronDown,
  ChevronUp,
  Sliders,
  CheckCircle2,
} from 'lucide-react';
import { PomodoroPhase, PomodoroConfig } from '../types';
import { soundEffects } from '../services/soundEffects';
import { Translations } from '../locales/translations';

interface TimerPomodoroProps {
  isNight: boolean;
  t: Translations;
}

type ActiveParamKey =
  | 'workMinutes'
  | 'shortBreakMinutes'
  | 'rounds'
  | 'longBreakMinutes'
  | 'cycles';

export const TimerPomodoro: React.FC<TimerPomodoroProps> = ({ isNight, t }) => {
  const [config, setConfig] = useState<PomodoroConfig>({
    workMinutes: 25,
    shortBreakMinutes: 5,
    rounds: 4,
    longBreakMinutes: 15,
    cycles: 2,
  });

  const [isParamsOpen, setIsParamsOpen] = useState<boolean>(true);
  const [activeParam, setActiveParam] = useState<ActiveParamKey>('workMinutes');

  const [phase, setPhase] = useState<PomodoroPhase>('work');
  const [currentRound, setCurrentRound] = useState<number>(1);
  const [currentCycle, setCurrentCycle] = useState<number>(1);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);

  const [remainingMs, setRemainingMs] = useState<number>(25 * 60 * 1000);

  const requestRef = useRef<number | null>(null);
  const intervalRef = useRef<number | null>(null);
  const endTimeRef = useRef<number>(0);
  const remainingMsRef = useRef<number>(25 * 60 * 1000);
  const isRunningRef = useRef<boolean>(false);
  const phaseRef = useRef<PomodoroPhase>('work');
  const currentRoundRef = useRef<number>(1);
  const currentCycleRef = useRef<number>(1);
  const configRef = useRef<PomodoroConfig>(config);
  configRef.current = config;

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

  const getPhaseDurationMs = (p: PomodoroPhase, cfg: PomodoroConfig) => {
    if (p === 'work') return cfg.workMinutes * 60 * 1000;
    if (p === 'shortBreak') return cfg.shortBreakMinutes * 60 * 1000;
    return cfg.longBreakMinutes * 60 * 1000;
  };

  const calculateTotalSessionMinutes = () => {
    const workPerCycle = config.rounds * config.workMinutes;
    const shortBreaksPerCycle = Math.max(0, config.rounds - 1) * config.shortBreakMinutes;
    const longBreakPerCycle = config.longBreakMinutes;

    const totalWork = config.cycles * workPerCycle;
    const totalBreak = config.cycles * (shortBreaksPerCycle + longBreakPerCycle);
    const total = totalWork + totalBreak;

    return {
      total,
      totalWork,
      totalBreak,
    };
  };

  const sessionCalculation = calculateTotalSessionMinutes();

  const handleConfigParamChange = (key: ActiveParamKey, val: number) => {
    const minVal = 1;
    const maxVal = key === 'rounds' ? 12 : key === 'cycles' ? 10 : 120;
    const clamped = Math.max(minVal, Math.min(maxVal, val));
    const newConfig = { ...config, [key]: clamped };
    setConfig(newConfig);

    if (!isRunning) {
      if (phase === 'work' && key === 'workMinutes') {
        const ms = clamped * 60 * 1000;
        setRemainingMs(ms);
        remainingMsRef.current = ms;
      } else if (phase === 'shortBreak' && key === 'shortBreakMinutes') {
        const ms = clamped * 60 * 1000;
        setRemainingMs(ms);
        remainingMsRef.current = ms;
      } else if (phase === 'longBreak' && key === 'longBreakMinutes') {
        const ms = clamped * 60 * 1000;
        setRemainingMs(ms);
        remainingMsRef.current = ms;
      }
      lastSecondTickedRef.current = null;
    }
  };

  const handleStepParam = (key: ActiveParamKey, delta: number) => {
    const current = config[key];
    const minVal = 1;
    const maxVal = key === 'rounds' ? 12 : key === 'cycles' ? 10 : 120;
    const nextVal = Math.max(minVal, Math.min(maxVal, current + delta));
    handleConfigParamChange(key, nextVal);
    setActiveParam(key);
  };

  const handleStartPause = () => {
    soundEffects.resumeContext();

    if (isRunning) {
      // Pause
      stopTimerLoops();
      isRunningRef.current = false;
      setIsRunning(false);

      const now = performance.now();
      const currentRemaining = Math.max(0, endTimeRef.current - now);
      remainingMsRef.current = currentRemaining;
      setRemainingMs(currentRemaining);
    } else {
      // Start or Resume
      let startRemaining = remainingMsRef.current;
      if (isCompleted || startRemaining <= 0) {
        setIsCompleted(false);
        currentRoundRef.current = 1;
        setCurrentRound(1);
        currentCycleRef.current = 1;
        setCurrentCycle(1);
        phaseRef.current = 'work';
        setPhase('work');
        startRemaining = config.workMinutes * 60 * 1000;
        lastSecondTickedRef.current = null;
      }

      remainingMsRef.current = startRemaining;
      setRemainingMs(startRemaining);
      endTimeRef.current = performance.now() + startRemaining;
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

    phaseRef.current = 'work';
    setPhase('work');
    currentRoundRef.current = 1;
    setCurrentRound(1);
    currentCycleRef.current = 1;
    setCurrentCycle(1);

    const initialMs = config.workMinutes * 60 * 1000;
    remainingMsRef.current = initialMs;
    setRemainingMs(initialMs);
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
        // Phase completed!
        lastSecondTickedRef.current = null;
        soundEffects.playChimeBell();

        const currentCfg = configRef.current;
        let nextPhase: PomodoroPhase = phaseRef.current;
        let nextRound = currentRoundRef.current;
        let nextCycle = currentCycleRef.current;
        let nextDurationMs = 0;

        if (phaseRef.current === 'work') {
          if (nextRound >= currentCfg.rounds) {
            nextPhase = 'longBreak';
            nextDurationMs = currentCfg.longBreakMinutes * 60 * 1000;
          } else {
            nextPhase = 'shortBreak';
            nextDurationMs = currentCfg.shortBreakMinutes * 60 * 1000;
          }
        } else if (phaseRef.current === 'shortBreak') {
          nextRound = nextRound + 1;
          nextPhase = 'work';
          nextDurationMs = currentCfg.workMinutes * 60 * 1000;
        } else if (phaseRef.current === 'longBreak') {
          if (nextCycle >= currentCfg.cycles) {
            // Whole session completed!
            stopTimerLoops();
            isRunningRef.current = false;
            setIsRunning(false);
            setIsCompleted(true);
            return;
          } else {
            nextCycle = nextCycle + 1;
            nextRound = 1;
            nextPhase = 'work';
            nextDurationMs = currentCfg.workMinutes * 60 * 1000;
          }
        }

        // Apply next phase immediately
        phaseRef.current = nextPhase;
        currentRoundRef.current = nextRound;
        currentCycleRef.current = nextCycle;
        remainingMsRef.current = nextDurationMs;
        endTimeRef.current = performance.now() + nextDurationMs;

        setPhase(nextPhase);
        setCurrentRound(nextRound);
        setCurrentCycle(nextCycle);
        setRemainingMs(nextDurationMs);

        requestRef.current = requestAnimationFrame(tick);
        return;
      }

      requestRef.current = requestAnimationFrame(tick);
    };

    requestRef.current = requestAnimationFrame(tick);
    intervalRef.current = window.setInterval(tick, 200);

    return () => {
      stopTimerLoops();
    };
  }, [isRunning]);

  const formatDigits = (ms: number) => {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    const milliseconds = Math.floor((ms % 1000) / 10);

    return {
      mm: minutes.toString().padStart(2, '0'),
      ss: seconds.toString().padStart(2, '0'),
      ms: milliseconds.toString().padStart(2, '0'),
    };
  };

  const { mm, ss, ms } = formatDigits(remainingMs);
  const wholeSeconds = Math.ceil(remainingMs / 1000);

  useEffect(() => {
    const minutes = Math.floor(wholeSeconds / 60);
    const seconds = wholeSeconds % 60;

    const mmStr = minutes.toString().padStart(2, '0');
    const ssStr = seconds.toString().padStart(2, '0');
    const timeStr = `${mmStr}:${ssStr}`;

    const titleSuffix = t.pomodoro === 'Pomodoro' ? 'Pomodoro Timer' : 'Помодоро';
    document.title = `${timeStr} | ${titleSuffix}`;
  }, [wholeSeconds, t]);

  const currentTotalPhaseMs = getPhaseDurationMs(phase, config);
  const progressRatio =
    currentTotalPhaseMs > 0 ? (currentTotalPhaseMs - remainingMs) / currentTotalPhaseMs : 0;

  const isWorkPhase = phase === 'work';

  // Дневная тема: темно-синий цвет (#0a192f)
  // Вечерняя тема: светлый персиковый (#FFDAB9)
  const cardBg = isNight
    ? 'bg-slate-950/75 border-[#FFDAB9]/40 text-white shadow-2xl backdrop-blur-2xl'
    : 'bg-white/85 border-[#FFDAB9]/40 text-[#0a192f] shadow-xl backdrop-blur-2xl';

  // Зеленый (emerald) цвет для всех перерывов
  const digitTextColor = isNight
    ? isWorkPhase
      ? 'text-[#FFDAB9]'
      : 'text-emerald-300'
    : isWorkPhase
    ? 'text-[#0a192f]'
    : 'text-emerald-900';

  const separatorColor = isNight
    ? isWorkPhase
      ? '#FFDAB9'
      : '#6ee7b7'
    : isWorkPhase
    ? '#0a192f'
    : '#047857';

  const currentSliderConfig = {
    workMinutes: { title: t.sliderTitleWork, min: 1, max: 90, step: 1, unit: t.unitMin },
    shortBreakMinutes: { title: t.sliderTitleBreak, min: 1, max: 30, step: 1, unit: t.unitMin },
    rounds: { title: t.sliderTitleRounds, min: 1, max: 12, step: 1, unit: t.unitRounds },
    longBreakMinutes: { title: t.sliderTitleLongBreak, min: 1, max: 60, step: 1, unit: t.unitMin },
    cycles: { title: t.sliderTitleCycles, min: 1, max: 10, step: 1, unit: t.unitCycles },
  }[activeParam];

  const phaseBadgeText = isWorkPhase
    ? t.focusPhase
    : phase === 'longBreak'
    ? t.longBreakName
    : t.shortBreakName;

  const isInitialPristine =
    !isRunning &&
    !isCompleted &&
    phase === 'work' &&
    currentRound === 1 &&
    currentCycle === 1 &&
    remainingMs === config.workMinutes * 60 * 1000;

  return (
    <div className="flex flex-col items-center justify-center w-full max-w-xl mx-auto text-center transition-all duration-300">
      <div
        className={`w-full rounded-3xl border p-4 sm:p-5 ${cardBg} relative overflow-hidden transition-all duration-500 flex flex-col items-center justify-center shadow-2xl`}
      >
        {/* Glow */}
        <div className="absolute -top-12 -right-12 w-48 h-48 bg-[#FFDAB9]/15 rounded-full blur-3xl pointer-events-none" />

        {/* Header Indicator */}
        <div className="flex items-center justify-between w-full mb-1.5 pb-2 border-b border-[#FFDAB9]/25">
          <div className="flex items-center gap-2">
            <span
              className={`w-2.5 h-2.5 rounded-full ${
                isWorkPhase
                  ? isNight
                    ? 'bg-[#FFDAB9]'
                    : 'bg-[#0a192f]'
                  : 'bg-emerald-500'
              } ${isRunning ? 'animate-pulse' : ''}`}
            />
            <span
              className={`text-xs font-bold tracking-wider uppercase ${
                isNight ? 'text-[#FFDAB9]' : 'text-[#0a192f]'
              }`}
            >
              {phaseBadgeText}
            </span>
          </div>

          {/* Round & Cycle Info */}
          <div
            className={`flex items-center gap-1.5 text-xs font-bold ${
              isNight ? 'text-[#FFDAB9]' : 'text-[#0a192f]'
            }`}
          >
            <span>
              {t.roundAndCycle(currentRound, config.rounds, currentCycle, config.cycles)}
            </span>
            <div className="flex gap-1 ml-1.5">
              {Array.from({ length: config.rounds }).map((_, i) => (
                <span
                  key={i}
                  className={`w-2 h-2 rounded-full transition-all ${
                    i < currentRound - 1
                      ? 'bg-emerald-500'
                      : i === currentRound - 1
                      ? isNight
                        ? 'bg-[#FFDAB9] scale-125'
                        : 'bg-[#0a192f] scale-125'
                      : 'bg-slate-300/60'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Completion Banner */}
        {isCompleted && (
          <div className="w-full mb-2 p-1.5 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-600 dark:text-emerald-300 flex items-center justify-center gap-2 text-xs font-bold animate-pulse">
            <CheckCircle2 className="w-4 h-4" />
            <span>{t.sessionCompleted}</span>
          </div>
        )}

        {/* Progress Bar (Зеленый для всех перерывов) */}
        <div className="w-full bg-black/20 h-1.5 rounded-full overflow-hidden mb-2 border border-black/10">
          <div
            className={`h-full ${
              isWorkPhase
                ? isNight
                  ? 'bg-[#FFDAB9]'
                  : 'bg-[#0a192f]'
                : 'bg-emerald-500'
            } transition-all duration-150`}
            style={{ width: `${Math.min(100, Math.max(0, progressRatio * 100))}%` }}
          />
        </div>

        {/* Unified single-line digits: MM : SS . MS all in SAME SIZE! */}
        <div className="flex flex-col items-center justify-center my-1 sm:my-2 w-full">
          <div className="flex items-center justify-center font-digits font-extrabold tracking-tight select-none">
            {/* Minutes */}
            <div className="flex flex-col items-center">
              <span
                className={`text-4xl sm:text-7xl font-extrabold tracking-tight drop-shadow-sm ${digitTextColor}`}
              >
                {mm}
              </span>
              <span
                className={`text-[9px] uppercase tracking-widest font-semibold mt-0.5 ${
                  isNight ? 'text-slate-300' : 'text-[#0a192f]/70'
                }`}
              >
                {t.minutesUnit}
              </span>
            </div>

            <span
              className="text-3xl sm:text-6xl font-light px-1 sm:px-2 -translate-y-2"
              style={{ color: separatorColor }}
            >
              :
            </span>

            {/* Seconds */}
            <div className="flex flex-col items-center">
              <span
                className={`text-4xl sm:text-7xl font-extrabold tracking-tight drop-shadow-sm ${digitTextColor}`}
              >
                {ss}
              </span>
              <span
                className={`text-[9px] uppercase tracking-widest font-semibold mt-0.5 ${
                  isNight ? 'text-slate-300' : 'text-[#0a192f]/70'
                }`}
              >
                {t.secondsUnit}
              </span>
            </div>

            <span
              className="text-3xl sm:text-6xl font-light px-1 sm:px-2 -translate-y-2"
              style={{ color: separatorColor }}
            >
              .
            </span>

            {/* Milliseconds: SAME FONT SIZE AS MIN/SEC! */}
            <div className="flex flex-col items-center">
              <span
                className={`text-4xl sm:text-7xl font-extrabold tracking-tight drop-shadow-sm ${digitTextColor}`}
              >
                {ms}
              </span>
              <span
                className={`text-[9px] uppercase tracking-widest font-semibold mt-0.5 ${
                  isNight ? 'text-slate-300' : 'text-[#0a192f]/70'
                }`}
              >
                {t.millisUnit}
              </span>
            </div>
          </div>
        </div>

        {/* Action Controls: Start has SAME HEIGHT as Reset! */}
        <div className="flex items-center justify-center gap-3 sm:gap-4 mt-2 sm:mt-3 pt-2.5 border-t border-[#FFDAB9]/25 w-full">
          {/* Start / Pause Main Button */}
          <button
            onClick={handleStartPause}
            className={`h-11 sm:h-12 px-8 sm:px-12 rounded-2xl text-sm sm:text-base font-bold flex items-center justify-center gap-2 shadow-lg transition-all transform hover:scale-105 active:scale-95 cursor-pointer ${
              isRunning
                ? 'bg-amber-600 hover:bg-amber-700 text-white shadow-amber-600/40 ring-1 ring-white/40'
                : isNight
                ? 'bg-[#FFDAB9] hover:bg-[#ffe4cc] text-[#2c190a] font-extrabold shadow-[#FFDAB9]/40 ring-1 ring-white/40'
                : 'bg-[#0a192f] hover:bg-[#112240] text-white font-extrabold shadow-lg ring-2 ring-[#0a192f]/20'
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
                    : isInitialPristine
                    ? t.startBtn
                    : t.resumeBtn}
                </span>
              </>
            )}
          </button>

          {/* Reset Button (Same height!) */}
          <button
            onClick={handleReset}
            disabled={isInitialPristine}
            className={`h-11 sm:h-12 px-5 rounded-2xl text-xs sm:text-sm font-bold flex items-center justify-center gap-1.5 shadow-sm transition-all ${
              isInitialPristine
                ? 'opacity-40 cursor-not-allowed bg-slate-800/20 text-slate-500'
                : isNight
                ? 'bg-[#FFDAB9]/20 hover:bg-[#FFDAB9]/30 text-[#FFDAB9] border border-[#FFDAB9]/40 hover:scale-105 active:scale-95 cursor-pointer'
                : 'bg-white hover:bg-slate-50 text-[#0a192f] border border-[#0a192f]/30 shadow-md hover:scale-105 active:scale-95 cursor-pointer'
            }`}
            title={t.resetPomodoroTooltip}
          >
            <RotateCcw className="w-4 h-4" />
            <span>{t.resetBtn}</span>
          </button>
        </div>

        {/* Parameters Panel */}
        <div className="w-full mt-2.5 pt-2.5 border-t border-[#FFDAB9]/20">
          <button
            onClick={() => setIsParamsOpen(!isParamsOpen)}
            className={`w-full flex items-center justify-between text-xs font-bold transition-colors py-0.5 cursor-pointer ${
              isNight ? 'text-white hover:text-[#FFDAB9]' : 'text-[#0a192f] hover:text-black'
            }`}
          >
            <span
              className={`flex items-center gap-1.5 uppercase tracking-wider text-[11px] ${
                isNight ? 'text-[#FFDAB9]' : 'text-[#0a192f]'
              }`}
            >
              <Sliders className="w-3.5 h-3.5" />
              {t.sessionParams}
            </span>
            <span
              className={`flex items-center gap-1 text-[11px] ${
                isNight ? 'text-[#FFDAB9]' : 'text-[#0a192f]'
              }`}
            >
              {isParamsOpen ? t.collapse : t.expand}
              {isParamsOpen ? (
                <ChevronUp className="w-3.5 h-3.5" />
              ) : (
                <ChevronDown className="w-3.5 h-3.5" />
              )}
            </span>
          </button>

          {isParamsOpen && (
            <div
              className={`mt-2 p-2 rounded-2xl border text-left space-y-1.5 animate-in fade-in duration-200 ${
                isNight ? 'bg-black/45 border-[#FFDAB9]/25' : 'bg-slate-50 border-slate-200'
              }`}
            >
              <div className="grid grid-cols-5 gap-1">
                {/* 1. Работа */}
                <div
                  role="button"
                  onClick={() => setActiveParam('workMinutes')}
                  className={`h-10 sm:h-11 px-1.5 py-1 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                    activeParam === 'workMinutes'
                      ? isNight
                        ? 'bg-[#FFDAB9]/25 border-[#FFDAB9] ring-1 ring-[#FFDAB9]'
                        : 'bg-[#0a192f] text-white border-[#0a192f]'
                      : isNight
                      ? 'bg-white/5 border-white/10 hover:bg-white/10'
                      : 'bg-white border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  <span
                    className={`text-[8px] uppercase block truncate leading-none ${
                      activeParam === 'workMinutes' && !isNight
                        ? 'text-white/80'
                        : isNight
                        ? 'text-white/70'
                        : 'text-slate-600'
                    }`}
                  >
                    {t.paramWork}
                  </span>
                  <div className="flex items-center justify-between w-full leading-none">
                    <span
                      className={`text-[11px] sm:text-xs font-bold truncate ${
                        activeParam === 'workMinutes' && !isNight
                          ? 'text-white'
                          : isNight
                          ? 'text-[#FFDAB9]'
                          : 'text-[#0a192f]'
                      }`}
                    >
                      {config.workMinutes}
                      {t.minutesAbbr}
                    </span>
                    <div className="flex items-center gap-0.5 ml-0.5 shrink-0">
                      <span
                        role="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleStepParam('workMinutes', -1);
                        }}
                        className="w-3.5 h-3.5 flex items-center justify-center rounded hover:bg-white/20 active:scale-75 text-current cursor-pointer"
                        title="-1"
                      >
                        <ChevronDown className="w-2.5 h-2.5 stroke-[2.5]" />
                      </span>
                      <span
                        role="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleStepParam('workMinutes', 1);
                        }}
                        className="w-3.5 h-3.5 flex items-center justify-center rounded hover:bg-white/20 active:scale-75 text-current cursor-pointer"
                        title="+1"
                      >
                        <ChevronUp className="w-2.5 h-2.5 stroke-[2.5]" />
                      </span>
                    </div>
                  </div>
                </div>

                {/* 2. Корот. отдых (зеленый) */}
                <div
                  role="button"
                  onClick={() => setActiveParam('shortBreakMinutes')}
                  className={`h-10 sm:h-11 px-1.5 py-1 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                    activeParam === 'shortBreakMinutes'
                      ? 'bg-emerald-500/25 border-emerald-500 ring-1 ring-emerald-500'
                      : isNight
                      ? 'bg-white/5 border-white/10 hover:bg-white/10'
                      : 'bg-white border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  <span
                    className={`text-[8px] uppercase block truncate leading-none ${
                      isNight ? 'text-white/70' : 'text-slate-600'
                    }`}
                  >
                    {t.paramBreak}
                  </span>
                  <div className="flex items-center justify-between w-full leading-none">
                    <span className="text-[11px] sm:text-xs font-bold text-emerald-600 dark:text-emerald-300 truncate">
                      {config.shortBreakMinutes}
                      {t.minutesAbbr}
                    </span>
                    <div className="flex items-center gap-0.5 ml-0.5 shrink-0">
                      <span
                        role="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleStepParam('shortBreakMinutes', -1);
                        }}
                        className="w-3.5 h-3.5 flex items-center justify-center rounded hover:bg-white/20 active:scale-75 text-emerald-600 dark:text-emerald-300 cursor-pointer"
                        title="-1"
                      >
                        <ChevronDown className="w-2.5 h-2.5 stroke-[2.5]" />
                      </span>
                      <span
                        role="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleStepParam('shortBreakMinutes', 1);
                        }}
                        className="w-3.5 h-3.5 flex items-center justify-center rounded hover:bg-white/20 active:scale-75 text-emerald-600 dark:text-emerald-300 cursor-pointer"
                        title="+1"
                      >
                        <ChevronUp className="w-2.5 h-2.5 stroke-[2.5]" />
                      </span>
                    </div>
                  </div>
                </div>

                {/* 3. Кругов */}
                <div
                  role="button"
                  onClick={() => setActiveParam('rounds')}
                  className={`h-10 sm:h-11 px-1.5 py-1 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                    activeParam === 'rounds'
                      ? isNight
                        ? 'bg-[#FFDAB9]/25 border-[#FFDAB9] ring-1 ring-[#FFDAB9]'
                        : 'bg-[#0a192f] text-white border-[#0a192f]'
                      : isNight
                      ? 'bg-white/5 border-white/10 hover:bg-white/10'
                      : 'bg-white border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  <span
                    className={`text-[8px] uppercase block truncate leading-none ${
                      activeParam === 'rounds' && !isNight
                        ? 'text-white/80'
                        : isNight
                        ? 'text-white/70'
                        : 'text-slate-600'
                    }`}
                  >
                    {t.paramRounds}
                  </span>
                  <div className="flex items-center justify-between w-full leading-none">
                    <span
                      className={`text-[11px] sm:text-xs font-bold truncate ${
                        activeParam === 'rounds' && !isNight
                          ? 'text-white'
                          : isNight
                          ? 'text-white'
                          : 'text-[#0a192f]'
                      }`}
                    >
                      {config.rounds}
                    </span>
                    <div className="flex items-center gap-0.5 ml-0.5 shrink-0">
                      <span
                        role="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleStepParam('rounds', -1);
                        }}
                        className="w-3.5 h-3.5 flex items-center justify-center rounded hover:bg-white/20 active:scale-75 text-current cursor-pointer"
                        title="-1"
                      >
                        <ChevronDown className="w-2.5 h-2.5 stroke-[2.5]" />
                      </span>
                      <span
                        role="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleStepParam('rounds', 1);
                        }}
                        className="w-3.5 h-3.5 flex items-center justify-center rounded hover:bg-white/20 active:scale-75 text-current cursor-pointer"
                        title="+1"
                      >
                        <ChevronUp className="w-2.5 h-2.5 stroke-[2.5]" />
                      </span>
                    </div>
                  </div>
                </div>

                {/* 4. Длин. отдых (зеленый emerald) */}
                <div
                  role="button"
                  onClick={() => setActiveParam('longBreakMinutes')}
                  className={`h-10 sm:h-11 px-1.5 py-1 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                    activeParam === 'longBreakMinutes'
                      ? 'bg-emerald-500/25 border-emerald-500 ring-1 ring-emerald-500'
                      : isNight
                      ? 'bg-white/5 border-white/10 hover:bg-white/10'
                      : 'bg-white border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  <span
                    className={`text-[8px] uppercase block truncate leading-none ${
                      isNight ? 'text-white/70' : 'text-slate-600'
                    }`}
                  >
                    {t.paramLongBreak}
                  </span>
                  <div className="flex items-center justify-between w-full leading-none">
                    <span className="text-[11px] sm:text-xs font-bold text-emerald-600 dark:text-emerald-300 truncate">
                      {config.longBreakMinutes}
                      {t.minutesAbbr}
                    </span>
                    <div className="flex items-center gap-0.5 ml-0.5 shrink-0">
                      <span
                        role="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleStepParam('longBreakMinutes', -1);
                        }}
                        className="w-3.5 h-3.5 flex items-center justify-center rounded hover:bg-white/20 active:scale-75 text-emerald-600 dark:text-emerald-300 cursor-pointer"
                        title="-1"
                      >
                        <ChevronDown className="w-2.5 h-2.5 stroke-[2.5]" />
                      </span>
                      <span
                        role="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleStepParam('longBreakMinutes', 1);
                        }}
                        className="w-3.5 h-3.5 flex items-center justify-center rounded hover:bg-white/20 active:scale-75 text-emerald-600 dark:text-emerald-300 cursor-pointer"
                        title="+1"
                      >
                        <ChevronUp className="w-2.5 h-2.5 stroke-[2.5]" />
                      </span>
                    </div>
                  </div>
                </div>

                {/* 5. Цикл */}
                <div
                  role="button"
                  onClick={() => setActiveParam('cycles')}
                  className={`h-10 sm:h-11 px-1.5 py-1 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                    activeParam === 'cycles'
                      ? isNight
                        ? 'bg-[#FFDAB9]/30 border-[#FFDAB9] ring-1 ring-[#FFDAB9]'
                        : 'bg-[#0a192f] text-white border-[#0a192f]'
                      : isNight
                      ? 'bg-white/5 border-white/10 hover:bg-white/10'
                      : 'bg-white border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  <span
                    className={`text-[8px] uppercase block truncate leading-none ${
                      activeParam === 'cycles' && !isNight
                        ? 'text-white/80'
                        : isNight
                        ? 'text-white/70'
                        : 'text-slate-600'
                    }`}
                  >
                    {t.paramCycles}
                  </span>
                  <div className="flex items-center justify-between w-full leading-none">
                    <span
                      className={`text-[11px] sm:text-xs font-bold truncate ${
                        activeParam === 'cycles' && !isNight
                          ? 'text-white'
                          : isNight
                          ? 'text-[#FFDAB9]'
                          : 'text-[#0a192f]'
                      }`}
                    >
                      {config.cycles}
                    </span>
                    <div className="flex items-center gap-0.5 ml-0.5 shrink-0">
                      <span
                        role="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleStepParam('cycles', -1);
                        }}
                        className="w-3.5 h-3.5 flex items-center justify-center rounded hover:bg-white/20 active:scale-75 text-current cursor-pointer"
                        title="-1"
                      >
                        <ChevronDown className="w-2.5 h-2.5 stroke-[2.5]" />
                      </span>
                      <span
                        role="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleStepParam('cycles', 1);
                        }}
                        className="w-3.5 h-3.5 flex items-center justify-center rounded hover:bg-white/20 active:scale-75 text-current cursor-pointer"
                        title="+1"
                      >
                        <ChevronUp className="w-2.5 h-2.5 stroke-[2.5]" />
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Slider for selected parameter */}
              <div className="pt-0.5">
                <div className="flex items-center justify-between text-[11px] mb-1">
                  <span
                    className={`font-semibold ${
                      isNight ? 'text-slate-300' : 'text-slate-700'
                    }`}
                  >
                    <strong className={isNight ? 'text-[#FFDAB9]' : 'text-[#0a192f]'}>
                      {currentSliderConfig.title}:
                    </strong>
                  </span>
                  <span
                    className={`font-bold ${isNight ? 'text-[#FFDAB9]' : 'text-[#0a192f]'}`}
                  >
                    {config[activeParam]} {currentSliderConfig.unit}
                  </span>
                </div>
                <input
                  type="range"
                  min={currentSliderConfig.min}
                  max={currentSliderConfig.max}
                  step={currentSliderConfig.step}
                  value={config[activeParam]}
                  onChange={(e) =>
                    handleConfigParamChange(activeParam, Number(e.target.value))
                  }
                  className="w-full h-1.5 bg-slate-300 dark:bg-slate-800 rounded appearance-none cursor-pointer accent-[#0a192f] dark:accent-[#FFDAB9]"
                />
              </div>
            </div>
          )}

          {/* Общее время Pomodoro-сессии */}
          <div
            className={`mt-2 p-1.5 sm:p-2 rounded-xl border flex flex-col sm:flex-row items-center justify-between gap-1 sm:gap-2 text-left ${
              isNight ? 'bg-[#FFDAB9]/10 border-[#FFDAB9]/25' : 'bg-slate-100 border-slate-200'
            }`}
          >
            <div className="flex items-center gap-1.5">
              <Clock
                className={`w-3.5 h-3.5 shrink-0 ${
                  isNight ? 'text-[#FFDAB9]' : 'text-[#0a192f]'
                }`}
              />
              <span
                className={`text-[11px] font-medium ${
                  isNight ? 'text-white' : 'text-[#0a192f]'
                }`}
              >
                {t.totalPomodoroSession}
              </span>
            </div>

            <div className="flex items-center gap-2 font-mono text-[11px]">
              <span
                className={`font-bold ${isNight ? 'text-[#FFDAB9]' : 'text-[#0a192f]'}`}
              >
                {t.formatDuration(sessionCalculation.total)}
              </span>
              <span className="text-slate-400">|</span>
              <span className={isNight ? 'text-slate-300' : 'text-slate-600'}>
                {t.workAbbr}{' '}
                <b className={isNight ? 'text-[#FFDAB9]' : 'text-[#0a192f]'}>
                  {sessionCalculation.totalWork}
                  {t.minutesAbbr}
                </b>
              </span>
              <span className="text-slate-400">|</span>
              <span className={isNight ? 'text-slate-300' : 'text-slate-600'}>
                {t.breakAbbr}{' '}
                <b className="text-emerald-600 dark:text-emerald-300">
                  {sessionCalculation.totalBreak}
                  {t.minutesAbbr}
                </b>
              </span>
              <span className="text-slate-400">|</span>
              <span className={isNight ? 'text-slate-300' : 'text-slate-600'}>
                {t.cycleAbbr}{' '}
                <b className={isNight ? 'text-[#FFDAB9]' : 'text-[#0a192f]'}>
                  {config.cycles}
                </b>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

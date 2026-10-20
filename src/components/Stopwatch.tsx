import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Flag, Trash2, Award } from 'lucide-react';
import { LapRecord } from '../types';
import { Translations } from '../locales/translations';

interface StopwatchProps {
  isNight: boolean;
  t: Translations;
}

export const Stopwatch: React.FC<StopwatchProps> = ({ isNight, t }) => {
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [elapsedTime, setElapsedTime] = useState<number>(0);
  const [laps, setLaps] = useState<LapRecord[]>([]);

  const requestRef = useRef<number | null>(null);
  const intervalRef = useRef<number | null>(null);
  const startTimeRef = useRef<number>(0);
  const pausedElapsedRef = useRef<number>(0);

  useEffect(() => {
    if (isRunning) {
      startTimeRef.current = performance.now() - pausedElapsedRef.current;

      const update = () => {
        const now = performance.now();
        const elapsed = now - startTimeRef.current;
        pausedElapsedRef.current = elapsed;
        setElapsedTime(elapsed);
        requestRef.current = requestAnimationFrame(update);
      };

      requestRef.current = requestAnimationFrame(update);

      // Runs in background tabs when requestAnimationFrame is throttled/paused by the browser
      intervalRef.current = window.setInterval(() => {
        const now = performance.now();
        const elapsed = now - startTimeRef.current;
        pausedElapsedRef.current = elapsed;
        setElapsedTime(elapsed);
      }, 250);
    } else {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
      if (intervalRef.current) clearInterval(intervalRef.current);
    }

    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isRunning]);

  const handleStartPause = () => {
    setIsRunning(!isRunning);
  };

  const handleReset = () => {
    setIsRunning(false);
    pausedElapsedRef.current = 0;
    setElapsedTime(0);
    setLaps([]);
  };


  const handleLap = () => {
    if (elapsedTime === 0) return;
    const currentSplit = elapsedTime;
    const lapTime = currentSplit - (laps.length > 0 ? laps[0].splitTime : 0);

    const newLap: LapRecord = {
      id: Math.random().toString(36).substring(2, 9),
      lapNumber: laps.length + 1,
      lapTime: lapTime > 0 ? lapTime : currentSplit,
      splitTime: currentSplit,
    };

    setLaps([newLap, ...laps]);
  };

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

  const { hh, mm, ss, ms } = formatDigits(elapsedTime);
  const wholeSeconds = Math.floor(elapsedTime / 1000);

  useEffect(() => {
    const hours = Math.floor(wholeSeconds / 3600);
    const minutes = Math.floor((wholeSeconds % 3600) / 60);
    const seconds = wholeSeconds % 60;

    const mmStr = minutes.toString().padStart(2, '0');
    const ssStr = seconds.toString().padStart(2, '0');
    const timeStr = hours > 0
      ? `${hours.toString().padStart(2, '0')}:${mmStr}:${ssStr}`
      : `${mmStr}:${ssStr}`;

    const titleSuffix = t.stopwatch === 'Stopwatch' ? 'Aesthetic Stopwatch' : 'Секундомер';
    document.title = `${timeStr} | ${titleSuffix}`;
  }, [wholeSeconds, t]);

  let fastestLapId: string | null = null;
  let slowestLapId: string | null = null;
  if (laps.length >= 2) {
    let minTime = Infinity;
    let maxTime = -Infinity;
    laps.forEach((lap) => {
      if (lap.lapTime < minTime) {
        minTime = lap.lapTime;
        fastestLapId = lap.id;
      }
      if (lap.lapTime > maxTime) {
        maxTime = lap.lapTime;
        slowestLapId = lap.id;
      }
    });
  }

  // Дневная тема: темно-синий цвет (#0a192f) для идеальной читаемости на светлом фоне!
  // Вечерняя тема: светлый белый цвет
  // Акцентный розовый: #F19CBB
  const cardBg = isNight
    ? 'bg-slate-950/75 border-[#F19CBB]/40 text-white shadow-2xl backdrop-blur-2xl'
    : 'bg-white/85 border-[#F19CBB]/35 text-[#0a192f] shadow-xl backdrop-blur-2xl';

  const digitTextColor = isNight ? 'text-white' : 'text-[#0a192f]';
  const labelTextColor = isNight ? 'text-[#F19CBB]' : 'text-[#0a192f]/75';
  const separatorColor = '#F19CBB';

  return (
    <div className="flex flex-col items-center justify-center w-full max-w-xl mx-auto text-center transition-all duration-300">
      {/* Stopwatch Main Display Card */}
      <div className={`w-full rounded-3xl border p-4 sm:p-7 ${cardBg} relative overflow-hidden transition-all duration-500 flex flex-col items-center justify-center shadow-2xl`}>
        {/* Glow */}
        <div className="absolute -top-12 -right-12 w-48 h-48 bg-[#F19CBB]/20 rounded-full blur-3xl pointer-events-none" />

        {/* Header Indicator */}
        <div className="flex items-center justify-between w-full mb-3 pb-2 border-b border-[#F19CBB]/25">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#F19CBB] animate-pulse shadow-md shadow-[#F19CBB]/60" />
            <span className="text-xs font-bold tracking-wider uppercase text-[#F19CBB]">
              {t.stopwatch}
            </span>
          </div>
          {laps.length > 0 && (
            <span className="text-[11px] font-mono font-bold text-[#F19CBB] bg-[#F19CBB]/15 px-2 py-0.5 rounded-lg border border-[#F19CBB]/30">
              {t.lapsCount(laps.length)}
            </span>
          )}
        </div>

        {/* Unified single-line display: HH : MM : SS . MS all in SAME COLOR and SAME SIZE! */}
        <div className="flex flex-col items-center justify-center my-2 sm:my-5 w-full">
          <div className="flex items-center justify-center font-digits font-extrabold tracking-tight select-none">
            {/* Hours */}
            <div className="flex flex-col items-center">
              <span className={`text-3xl sm:text-6xl font-extrabold tracking-tight drop-shadow-sm ${digitTextColor}`}>
                {hh}
              </span>
              <span className={`text-[9px] uppercase tracking-widest font-semibold mt-0.5 ${labelTextColor}`}>
                {t.hoursUnit}
              </span>
            </div>

            <span className="text-2xl sm:text-5xl font-light px-1 sm:px-2 -translate-y-2" style={{ color: separatorColor }}>
              :
            </span>

            {/* Minutes */}
            <div className="flex flex-col items-center">
              <span className={`text-3xl sm:text-6xl font-extrabold tracking-tight drop-shadow-sm ${digitTextColor}`}>
                {mm}
              </span>
              <span className={`text-[9px] uppercase tracking-widest font-semibold mt-0.5 ${labelTextColor}`}>
                {t.minutesUnit}
              </span>
            </div>

            <span className="text-2xl sm:text-5xl font-light px-1 sm:px-2 -translate-y-2" style={{ color: separatorColor }}>
              :
            </span>

            {/* Seconds */}
            <div className="flex flex-col items-center">
              <span className={`text-3xl sm:text-6xl font-extrabold tracking-tight drop-shadow-sm ${digitTextColor}`}>
                {ss}
              </span>
              <span className={`text-[9px] uppercase tracking-widest font-semibold mt-0.5 ${labelTextColor}`}>
                {t.secondsUnit}
              </span>
            </div>

            <span className="text-2xl sm:text-5xl font-light px-1 sm:px-2 -translate-y-2" style={{ color: separatorColor }}>
              .
            </span>

            {/* Milliseconds: EXACT SAME SIZE AND COLOR! */}
            <div className="flex flex-col items-center">
              <span className={`text-3xl sm:text-6xl font-extrabold tracking-tight drop-shadow-sm ${digitTextColor}`}>
                {ms}
              </span>
              <span className={`text-[9px] uppercase tracking-widest font-semibold mt-0.5 ${labelTextColor}`}>
                {t.millisUnit}
              </span>
            </div>
          </div>
        </div>

        {/* Action Controls: Start has SAME HEIGHT as Reset button */}
        <div className="flex items-center justify-center gap-3 sm:gap-4 mt-3 sm:mt-5 pt-4 border-t border-[#F19CBB]/25 w-full">
          {/* Lap Button */}
          <button
            onClick={handleLap}
            disabled={!isRunning && elapsedTime === 0}
            className={`h-11 sm:h-12 px-5 rounded-2xl text-xs sm:text-sm font-bold flex items-center justify-center gap-1.5 transition-all ${
              !isRunning && elapsedTime === 0
                ? 'opacity-40 cursor-not-allowed bg-slate-800/20 text-slate-500'
                : isNight
                ? 'bg-[#F19CBB]/20 hover:bg-[#F19CBB]/30 text-white border border-[#F19CBB]/50 hover:scale-105 active:scale-95 shadow-sm'
                : 'bg-white hover:bg-slate-50 text-[#0a192f] border border-[#0a192f]/30 shadow-md hover:scale-105 active:scale-95'
            }`}
            title={t.lapTooltip}
          >
            <Flag className="w-4 h-4 text-[#F19CBB]" />
            <span>{t.lapBtn}</span>
          </button>

          {/* Start / Pause Main Button (#F19CBB) */}
          <button
            onClick={handleStartPause}
            className={`h-11 sm:h-12 px-8 sm:px-10 rounded-2xl text-sm sm:text-base font-bold flex items-center justify-center gap-2 shadow-lg transition-all transform hover:scale-105 active:scale-95 ${
              isRunning
                ? 'bg-rose-700 hover:bg-rose-800 text-white shadow-rose-700/40 ring-1 ring-white/40'
                : isNight
                ? 'bg-[#F19CBB] hover:bg-[#faaec6] text-[#2c0a1b] font-bold shadow-[#F19CBB]/40 ring-1 ring-white/40'
                : 'bg-[#F19CBB] hover:bg-[#faaec6] text-[#2c0a1b] font-bold shadow-lg ring-2 ring-[#0a192f]/20'
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
                <span>{elapsedTime > 0 ? t.resumeBtn : t.startBtn}</span>
              </>
            )}
          </button>

          {/* Reset Button (Same height!) */}
          <button
            onClick={handleReset}
            disabled={elapsedTime === 0}
            className={`h-11 sm:h-12 px-5 rounded-2xl text-xs sm:text-sm font-bold flex items-center justify-center gap-1.5 transition-all ${
              elapsedTime === 0
                ? 'opacity-40 cursor-not-allowed bg-slate-800/20 text-slate-500'
                : isNight
                ? 'bg-[#F19CBB]/20 hover:bg-[#F19CBB]/30 text-white border border-[#F19CBB]/50 hover:scale-105 active:scale-95 shadow-sm'
                : 'bg-white hover:bg-slate-50 text-[#0a192f] border border-[#0a192f]/30 shadow-md hover:scale-105 active:scale-95'
            }`}
            title={t.resetStopwatchTooltip}
          >
            <RotateCcw className="w-4 h-4 text-[#F19CBB]" />
            <span>{t.resetBtn}</span>
          </button>
        </div>
      </div>

      {/* Recorded Laps Card (Compact) */}
      {laps.length > 0 && (
        <div className={`w-full mt-3 rounded-2xl border p-3 ${cardBg} transition-all duration-300`}>
          <div className="flex items-center justify-between mb-2 pb-1.5 border-b border-[#F19CBB]/25">
            <div className="flex items-center gap-1.5">
              <Award className="w-3.5 h-3.5 text-[#F19CBB]" />
              <span className="text-xs font-bold uppercase tracking-wider text-[#F19CBB]">
                {t.lapsTable}
              </span>
            </div>
            <button
              onClick={() => setLaps([])}
              className="text-[11px] text-[#F19CBB] hover:text-rose-400 flex items-center gap-1 transition-colors"
            >
              <Trash2 className="w-3 h-3" />
              <span>{t.clearLaps}</span>
            </button>
          </div>

          <div className="max-h-36 overflow-y-auto space-y-1.5 pr-1 font-mono text-xs">
            {laps.slice(0, 5).map((lap) => {
              const lapFormatted = formatDigits(lap.lapTime);
              const splitFormatted = formatDigits(lap.splitTime);
              const isFastest = lap.id === fastestLapId;

              return (
                <div
                  key={lap.id}
                  className={`flex items-center justify-between p-2 rounded-xl border transition-colors ${
                    isFastest
                      ? isNight
                        ? 'bg-[#F19CBB]/30 border-[#F19CBB] text-white'
                        : 'bg-pink-100 border-[#F19CBB] text-[#0a192f]'
                      : isNight
                      ? 'bg-black/40 border-[#F19CBB]/20 text-slate-200'
                      : 'bg-slate-50 border-slate-200 text-[#0a192f]'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="w-5 text-[#F19CBB] font-bold">
                      #{lap.lapNumber}
                    </span>
                    {isFastest && (
                      <span className="text-[9px] px-1.5 py-0.5 rounded bg-[#F19CBB] text-[#2c0a1b] font-bold">
                        {t.bestLap}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="font-bold">
                      {lapFormatted.mm}:{lapFormatted.ss}.{lapFormatted.ms}
                    </span>
                    <span className={`text-[11px] ${isNight ? 'text-slate-400' : 'text-slate-500'}`}>
                      {splitFormatted.mm}:{splitFormatted.ss}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

import React from 'react';
import { Timer, Clock } from 'lucide-react';
import { AppMode, TimerSubMode } from '../types';
import { Translations } from '../locales/translations';

interface HeaderProps {
  mode: AppMode;
  onModeChange: (mode: AppMode) => void;
  timerSubMode: TimerSubMode;
  onTimerSubModeChange: (subMode: TimerSubMode) => void;
  t: Translations;
}

export const Header: React.FC<HeaderProps> = ({
  mode,
  onModeChange,
  timerSubMode,
  onTimerSubModeChange,
  t,
}) => {
  return (
    <header className="w-full z-30 pt-3 pb-1 px-4 transition-all duration-300">
      <div className="max-w-4xl mx-auto flex flex-col items-center justify-center relative">
        {/* Переключатель «Секундомер» / «Таймер» (ровно одно слово на кнопке, одинаковая ширина) */}
        <div className="flex items-center gap-2 p-1 rounded-2xl bg-black/60 backdrop-blur-2xl border border-white/15 shadow-xl">
          {/* Секундомер: #F19CBB */}
          <button
            onClick={() => onModeChange('stopwatch')}
            className={`w-36 sm:w-48 py-2 rounded-xl text-xs sm:text-sm font-semibold flex items-center justify-center gap-1.5 transition-all duration-200 ${
              mode === 'stopwatch'
                ? 'bg-[#F19CBB] text-[#2c0a1b] font-bold shadow-md shadow-[#F19CBB]/40 ring-1 ring-white/30'
                : 'text-white/70 hover:text-white hover:bg-white/5'
            }`}
          >
            <Clock className="w-3.5 h-3.5 shrink-0" />
            <span>{t.stopwatch}</span>
          </button>

          {/* Таймер: #FFDAB9 */}
          <button
            onClick={() => onModeChange('timer')}
            className={`w-36 sm:w-48 py-2 rounded-xl text-xs sm:text-sm font-semibold flex items-center justify-center gap-1.5 transition-all duration-200 ${
              mode === 'timer'
                ? 'bg-[#FFDAB9] text-[#2c190a] font-bold shadow-md shadow-[#FFDAB9]/35 ring-1 ring-white/30'
                : 'text-white/70 hover:text-white hover:bg-white/5'
            }`}
          >
            <Timer className="w-3.5 h-3.5 shrink-0" />
            <span>{t.timer}</span>
          </button>
        </div>

        {/* Под «Секундомер / Таймер»: «Countdown / Обычный» и «Pomodoro / Помодоро» (ровно одно слово, одинаковая ширина) */}
        {mode === 'timer' && (
          <div className="mt-2 flex items-center gap-1.5 p-1 rounded-2xl bg-black/50 backdrop-blur-xl border border-[#FFDAB9]/30 shadow-lg animate-in fade-in slide-in-from-top-1 duration-200">
            <button
              onClick={() => onTimerSubModeChange('simple')}
              className={`w-32 sm:w-44 py-1.5 rounded-xl text-xs font-semibold flex items-center justify-center transition-all ${
                timerSubMode === 'simple'
                  ? 'bg-[#FFDAB9] text-[#2c190a] shadow-sm font-bold'
                  : 'text-[#FFDAB9]/80 hover:text-[#FFDAB9] hover:bg-white/5'
              }`}
            >
              {t.simpleTimer}
            </button>
            <button
              onClick={() => onTimerSubModeChange('pomodoro')}
              className={`w-32 sm:w-44 py-1.5 rounded-xl text-xs font-semibold flex items-center justify-center transition-all ${
                timerSubMode === 'pomodoro'
                  ? 'bg-[#FFDAB9] text-[#2c190a] shadow-sm font-bold'
                  : 'text-[#FFDAB9]/80 hover:text-[#FFDAB9] hover:bg-white/5'
              }`}
            >
              {t.pomodoro}
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

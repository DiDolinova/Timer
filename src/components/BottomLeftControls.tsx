import React, { useState } from 'react';
import {
  Palette,
  ChevronDown,
  ChevronUp,
  Coffee,
  Waves,
  Flame,
  CloudRain,
  Play,
  Pause,
  RotateCcw,
  RotateCw,
  X,
  Sun,
  Moon,
  Maximize2,
  Minimize2,
} from 'lucide-react';
import { TimeOfDay, BackgroundType, AppMode } from '../types';
import {
  AMBIENT_SOUND_STATIONS,
  ALL_MUSIC_STATIONS_POOLS,
  MediaStation,
} from '../services/ambientAudio';
import { Language, Translations } from '../locales/translations';

interface BottomLeftControlsProps {
  mode: AppMode;
  timeOfDay: TimeOfDay;
  onTimeOfDayChange: (t: TimeOfDay) => void;
  backgroundType: BackgroundType;
  onBackgroundTypeChange: (b: BackgroundType) => void;
  activeBgName: string;
  language: Language;
  onLanguageChange: (lang: Language) => void;
  isFullscreen: boolean;
  onToggleFullscreen: () => void;
  t: Translations;
}

export const BottomLeftControls: React.FC<BottomLeftControlsProps> = ({
  mode,
  timeOfDay,
  onTimeOfDayChange,
  backgroundType,
  onBackgroundTypeChange,
  activeBgName,
  language,
  onLanguageChange,
  isFullscreen,
  onToggleFullscreen,
  t,
}) => {
  const [isMusicExpanded, setIsMusicExpanded] = useState<boolean>(false);

  // Pool index for refreshing stations
  const [poolIndex, setPoolIndex] = useState<number>(0);
  const currentMusicPool = ALL_MUSIC_STATIONS_POOLS[poolIndex % ALL_MUSIC_STATIONS_POOLS.length];

  // Currently playing media (ambient sound OR music stream)
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [currentMedia, setCurrentMedia] = useState<MediaStation>(currentMusicPool[0]);

  const handleTogglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const handleSelectMedia = (station: MediaStation) => {
    setCurrentMedia(station);
    setIsPlaying(true);
  };

  const handleRefreshStations = () => {
    const nextIdx = poolIndex + 1;
    setPoolIndex(nextIdx);
    const nextPool = ALL_MUSIC_STATIONS_POOLS[nextIdx % ALL_MUSIC_STATIONS_POOLS.length];
    if (!isPlaying) {
      setCurrentMedia(nextPool[0]);
    }
  };

  const handleStopAll = () => {
    setIsPlaying(false);
  };

  const isStopwatch = mode === 'stopwatch';
  const primaryColor = isStopwatch ? '#F19CBB' : '#FFDAB9';
  const borderStyle = isStopwatch ? 'border-[#F19CBB]/40' : 'border-[#FFDAB9]/40';
  const activeBtnBg = isStopwatch
    ? 'bg-[#F19CBB] text-[#2c0a1b] font-bold'
    : 'bg-[#FFDAB9] text-[#2c190a] font-bold';

  const getTranslatedSound = (sound: MediaStation) => {
    if (sound.iconType === 'rain') {
      return { name: t.rainSound, desc: t.rainDesc };
    }
    if (sound.iconType === 'fire') {
      return { name: t.fireSound, desc: t.fireDesc };
    }
    if (sound.iconType === 'waves') {
      return { name: t.oceanSound, desc: t.oceanDesc };
    }
    if (sound.iconType === 'cafe') {
      return { name: t.cafeSound, desc: t.cafeDesc };
    }
    return { name: sound.name, desc: sound.genre };
  };

  const currentMediaDisplayName =
    currentMedia.iconType === 'music'
      ? currentMedia.name
      : getTranslatedSound(currentMedia).name;

  return (
    <div className="relative flex items-end gap-2 z-30 font-sans">
      {/* 
        PERSISTENT YOUTUBE PLAYER: 
        Никогда не размонтируется при сворачивании панели! 
        Звук продолжает играть непрерывно.
      */}
      {isPlaying && (
        <div
          className={
            isMusicExpanded
              ? 'hidden' // When expanded, it is rendered in the expanded drawer below to avoid duplicate audio
              : 'pointer-events-none opacity-0 fixed -left-[9999px] -top-[9999px] w-[200px] h-[120px]'
          }
        >
          <iframe
            key={`persistent-${currentMedia.id}`}
            width="200"
            height="120"
            src={`https://www.youtube.com/embed/${currentMedia.youtubeId}?autoplay=1&enablejsapi=1`}
            title={currentMedia.name}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      )}

      {/* Main Column: Music on top, Visual underneath */}
      <div className="relative flex flex-col gap-2 w-72 sm:w-80">
        {/* Выдвижная панель музыки (РАЗВОРАЧИВАЕТСЯ НАВЕРХ над карточкой!) */}
        {isMusicExpanded && (
          <div
            className={`absolute bottom-full mb-2 w-full rounded-2xl bg-black/90 backdrop-blur-2xl border ${borderStyle} p-3 shadow-2xl space-y-3 animate-in slide-in-from-bottom-2 fade-in duration-200 z-40 max-h-[75vh] overflow-y-auto`}
          >
            {/* Header of expanded drawer */}
            <div className="flex items-center justify-between border-b border-white/10 pb-2">
              <span className="text-xs font-bold text-white uppercase tracking-wider font-mono">
                {t.musicTitle}
              </span>
              <div className="flex items-center gap-2">
                {isPlaying && (
                  <button
                    onClick={handleStopAll}
                    className="text-[10px] text-rose-300 hover:text-rose-200 flex items-center gap-1"
                  >
                    <RotateCcw className="w-3 h-3" />
                    <span>{t.stopAudio}</span>
                  </button>
                )}
                <button
                  onClick={() => setIsMusicExpanded(false)}
                  className="text-white/60 hover:text-white p-1"
                  title={t.collapseMusicTooltip}
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* 1. Фоновые звуки природы (YouTube видео) */}
            <div>
              <span className="text-[10px] font-bold text-slate-300 uppercase tracking-wider block mb-1.5 font-mono">
                {t.ambientYouTube}
              </span>
              <div className="grid grid-cols-2 gap-1.5 text-xs">
                {AMBIENT_SOUND_STATIONS.map((sound) => {
                  const isSelected = currentMedia.id === sound.id && isPlaying;
                  const localized = getTranslatedSound(sound);
                  return (
                    <button
                      key={sound.id}
                      onClick={() => handleSelectMedia(sound)}
                      className={`p-2 rounded-xl border text-left flex flex-col justify-between transition-all ${
                        isSelected
                          ? isStopwatch
                            ? 'bg-[#F19CBB]/35 border-[#F19CBB] text-white shadow-md'
                            : 'bg-[#FFDAB9]/35 border-[#FFDAB9] text-[#FFDAB9] shadow-md'
                          : 'bg-white/5 border-white/10 hover:bg-white/10 text-slate-200'
                      }`}
                    >
                      <div className="flex items-center justify-between w-full mb-1">
                        <span className="text-[11px] font-bold truncate flex items-center gap-1.5">
                          {sound.iconType === 'rain' && <CloudRain className="w-3 h-3 text-blue-300" />}
                          {sound.iconType === 'fire' && <Flame className="w-3 h-3 text-orange-300" />}
                          {sound.iconType === 'waves' && <Waves className="w-3 h-3 text-cyan-300" />}
                          {sound.iconType === 'cafe' && <Coffee className="w-3 h-3 text-amber-300" />}
                          {localized.name}
                        </span>
                        <Play className={`w-3 h-3 ${isSelected ? 'fill-current animate-pulse' : 'text-slate-400'}`} />
                      </div>
                      <span className="text-[9px] text-slate-400 line-clamp-1">{localized.desc}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 2. Музыкальные потоки */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[10px] font-bold text-slate-300 uppercase tracking-wider font-mono">
                  {t.musicStreamsYouTube}
                </span>
                <button
                  onClick={handleRefreshStations}
                  className="flex items-center gap-1 text-[10px] text-white/70 hover:text-white px-2 py-0.5 rounded-md bg-white/10 hover:bg-white/20 transition-all"
                  title="Загрузить другие видео / музыку"
                >
                  <RotateCw className="w-3 h-3" />
                  <span>{t.refreshList}</span>
                </button>
              </div>

              <div className="grid grid-cols-2 gap-1.5">
                {currentMusicPool.map((station) => {
                  const isSelected = currentMedia.id === station.id && isPlaying;
                  return (
                    <button
                      key={station.id}
                      onClick={() => handleSelectMedia(station)}
                      className={`p-2 rounded-xl border text-left flex flex-col justify-between transition-all ${
                        isSelected
                          ? isStopwatch
                            ? 'bg-[#F19CBB]/35 border-[#F19CBB] text-white shadow-md'
                            : 'bg-[#FFDAB9]/35 border-[#FFDAB9] text-[#FFDAB9] shadow-md'
                          : 'bg-white/5 border-white/10 hover:bg-white/10 text-slate-200'
                      }`}
                    >
                      <div className="flex items-center justify-between w-full mb-1">
                        <span className="text-[11px] font-bold truncate">{station.name}</span>
                        <Play className={`w-3 h-3 ${isSelected ? 'fill-current animate-pulse' : 'text-slate-400'}`} />
                      </div>
                      <span className="text-[9px] text-slate-400 line-clamp-1">{station.genre}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Visible player in expanded view */}
            {isPlaying && (
              <div className="pt-1">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[11px] font-bold text-white truncate flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    {t.nowPlaying} {currentMediaDisplayName}
                  </span>
                  <button
                    onClick={handleStopAll}
                    className="text-[10px] text-rose-300 hover:text-rose-200"
                  >
                    {t.stopAudio}
                  </button>
                </div>
                <div className="rounded-xl overflow-hidden border border-white/15 shadow-xl">
                  <iframe
                    key={`expanded-${currentMedia.id}`}
                    width="100%"
                    height="120"
                    src={`https://www.youtube.com/embed/${currentMedia.youtubeId}?autoplay=1&enablejsapi=1`}
                    title={currentMedia.name}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    className="w-full"
                  />
                </div>
              </div>
            )}
          </div>
        )}

        {/* 1. КАРТОЧКА МУЗЫКИ (СВЕРХУ) */}
        <div
          className={`w-full rounded-2xl bg-black/70 backdrop-blur-2xl border ${borderStyle} p-2.5 shadow-xl flex items-center justify-between transition-all duration-300 h-16`}
        >
          <div className="flex items-center gap-2 truncate">
            {/* Кнопка «Включить / Играет» в 1 клик запускает текущий трек */}
            <button
              onClick={handleTogglePlay}
              className={`h-9 px-3 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all shadow-md shrink-0 ${
                isPlaying
                  ? isStopwatch
                    ? 'bg-rose-700 text-white'
                    : 'bg-amber-600 text-white'
                  : isStopwatch
                  ? 'bg-[#F19CBB] text-[#2c0a1b] hover:bg-[#faaec6]'
                  : 'bg-[#FFDAB9] text-[#2c190a] hover:bg-[#ffe4cc]'
              }`}
              title={isPlaying ? t.pauseMusicTooltip : t.playMusicTooltip}
            >
              {isPlaying ? (
                <>
                  <Pause className="w-3.5 h-3.5 fill-current" />
                  <span>{t.playingBtn}</span>
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>{t.playBtn}</span>
                </>
              )}
            </button>

            <div className="truncate">
              <span className="text-xs font-bold text-white block truncate">
                {currentMediaDisplayName}
              </span>
              <span className="text-[10px] text-slate-300 block truncate flex items-center gap-1">
                {isPlaying && <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping inline-block" />}
                {isPlaying ? t.playingSub : t.pressPlaySub}
              </span>
            </div>
          </div>

          {/* Кнопка «Свернуть / Развернуть» */}
          <button
            onClick={() => setIsMusicExpanded(!isMusicExpanded)}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-[11px] font-bold transition-all shrink-0 ml-1"
            style={{
              backgroundColor: isStopwatch ? 'rgba(241, 156, 187, 0.25)' : 'rgba(255, 218, 185, 0.25)',
              color: primaryColor,
            }}
            title={isMusicExpanded ? t.collapseMusicTooltip : t.expandMusicTooltip}
          >
            <span>{isMusicExpanded ? t.collapse : t.expand}</span>
            {isMusicExpanded ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronUp className="w-3.5 h-3.5" />}
          </button>
        </div>

        {/* 2. КАРТОЧКА ВИЗУАЛА (СТРОГО ПОД МУЗЫКОЙ, одинаковая ширина и высота!) */}
        <div
          className={`w-full rounded-2xl bg-black/70 backdrop-blur-2xl border ${borderStyle} p-2.5 shadow-xl flex flex-col justify-between transition-all duration-300 h-16`}
        >
          <div className="flex items-center justify-between w-full h-full">
            <div className="flex items-center gap-1.5 truncate">
              <Palette className="w-3.5 h-3.5 shrink-0" style={{ color: primaryColor }} />
              <span className="text-[11px] font-bold text-white truncate">
                {activeBgName}
              </span>
            </div>

            <div className="flex items-center gap-1.5 shrink-0">
              {/* Фото / Градиент */}
              <div className="flex items-center gap-0.5 bg-white/10 p-0.5 rounded-lg">
                <button
                  onClick={() => onBackgroundTypeChange('image')}
                  className={`px-1.5 py-0.5 rounded text-[10px] font-medium transition-all ${
                    backgroundType === 'image' ? activeBtnBg : 'text-white/70 hover:text-white'
                  }`}
                >
                  {t.photoBg}
                </button>
                <button
                  onClick={() => onBackgroundTypeChange('gradient')}
                  className={`px-1.5 py-0.5 rounded text-[10px] font-medium transition-all ${
                    backgroundType === 'gradient' ? activeBtnBg : 'text-white/70 hover:text-white'
                  }`}
                >
                  {t.meshBg}
                </button>
              </div>

              {/* День / Вечер */}
              <div className="flex items-center gap-0.5 bg-white/10 p-0.5 rounded-lg">
                <button
                  onClick={() => onTimeOfDayChange('day')}
                  className={`p-1 rounded text-[10px] transition-all ${
                    timeOfDay === 'day' ? activeBtnBg : 'text-white/70 hover:text-white'
                  }`}
                  title={t.dayModeTooltip}
                >
                  <Sun className="w-3 h-3" />
                </button>
                <button
                  onClick={() => onTimeOfDayChange('night')}
                  className={`p-1 rounded text-[10px] transition-all ${
                    timeOfDay === 'night' ? activeBtnBg : 'text-white/70 hover:text-white'
                  }`}
                  title={t.nightModeTooltip}
                >
                  <Moon className="w-3 h-3" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 
        3. КНОПКА ПЕРЕКЛЮЧЕНИЯ ЯЗЫКОВ:
        Расположена СЛЕВА, РЯДОМ С ПЕРЕКЛЮЧАТЕЛЕМ ВИЗУАЛА СПРАВА.
        Высота h-16 идеально совпадает с карточкой визуала!
      */}
      <div
        className={`rounded-2xl bg-black/70 backdrop-blur-2xl border ${borderStyle} p-1.5 shadow-xl flex items-center justify-center transition-all duration-300 h-16`}
      >
        <div className="flex items-center gap-1 bg-white/10 p-1 rounded-xl">
          {/* Слева: English (по умолчанию) */}
          <button
            onClick={() => onLanguageChange('en')}
            className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
              language === 'en'
                ? activeBtnBg
                : 'text-white/70 hover:text-white'
            }`}
            title="English (Default)"
          >
            EN
          </button>

          {/* Справа: Русский */}
          <button
            onClick={() => onLanguageChange('ru')}
            className={`px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
              language === 'ru'
                ? activeBtnBg
                : 'text-white/70 hover:text-white'
            }`}
            title="Русский язык"
          >
            RU
          </button>
        </div>
      </div>

      {/* 
        4. КНОПКА РАЗВОРОТА НА ВЕСЬ ЭКРАН:
        Добавлена СПРАВА ОТ ПЕРЕКЛЮЧЕНИЯ ЯЗЫКА в такую же по высоте кнопку (h-16)!
      */}
      <div
        className={`rounded-2xl bg-black/70 backdrop-blur-2xl border ${borderStyle} p-1.5 shadow-xl flex items-center justify-center transition-all duration-300 h-16`}
      >
        <button
          onClick={onToggleFullscreen}
          className={`h-full px-3 rounded-xl flex items-center justify-center transition-all ${
            isFullscreen
              ? activeBtnBg
              : 'text-white/70 hover:text-white hover:bg-white/10'
          }`}
          title={isFullscreen ? t.fullscreenExit : t.fullscreenEnter}
        >
          {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
        </button>
      </div>
    </div>
  );
};

export type Language = 'en' | 'ru';

export interface Translations {
  // Header
  stopwatch: string;
  timer: string;
  simpleTimer: string;
  pomodoro: string;
  fullscreenEnter: string;
  fullscreenExit: string;

  // Digits units
  hoursUnit: string;
  minutesUnit: string;
  secondsUnit: string;
  millisUnit: string;

  // Stopwatch buttons & labels
  lapBtn: string;
  startBtn: string;
  pauseBtn: string;
  resumeBtn: string;
  resetBtn: string;
  lapsTable: string;
  clearLaps: string;
  bestLap: string;
  lapsCount: (count: number) => string;
  lapTooltip: string;
  resetStopwatchTooltip: string;

  // Countdown / Simple Timer
  countdownHeader: string;
  timeIsUp: string;
  timeSlider: string;
  minutesAbbr: string;
  restartBtn: string;
  resetTimerTooltip: string;

  // Pomodoro
  focusPhase: string;
  breakPhase: string;
  shortBreakName: string;
  longBreakName: string;
  roundOf: (current: number, total: number) => string;
  cycleOf: (current: number, total: number) => string;
  roundAndCycle: (round: number, totalRounds: number, cycle: number, totalCycles: number) => string;
  sessionParams: string;
  collapse: string;
  expand: string;
  paramWork: string;
  paramBreak: string;
  paramRounds: string;
  paramLongBreak: string;
  paramCycles: string;

  // Specific Slider Titles requested by user
  sliderTitleWork: string;
  sliderTitleBreak: string;
  sliderTitleRounds: string;
  sliderTitleLongBreak: string;
  sliderTitleCycles: string;

  sliderLabel: string;
  unitMin: string;
  unitRounds: string;
  unitCycles: string;
  totalPomodoroSession: string;
  workAbbr: string;
  breakAbbr: string;
  cycleAbbr: string;
  totalLabel: string;
  resetPomodoroTooltip: string;
  sessionCompleted: string;
  formatDuration: (mins: number) => string;

  // Music & Bottom Controls
  musicTitle: string;
  ambientYouTube: string;
  musicStreamsYouTube: string;
  refreshList: string;
  stopAudio: string;
  playBtn: string;
  playingBtn: string;
  playingSub: string;
  pressPlaySub: string;
  collapseMusicTooltip: string;
  expandMusicTooltip: string;
  playMusicTooltip: string;
  pauseMusicTooltip: string;
  nowPlaying: string;

  // Visual controls
  photoBg: string;
  meshBg: string;
  dayModeTooltip: string;
  nightModeTooltip: string;

  // Ambient sound names
  rainSound: string;
  rainDesc: string;
  fireSound: string;
  fireDesc: string;
  oceanSound: string;
  oceanDesc: string;
  cafeSound: string;
  cafeDesc: string;

  // Wallpapers and gradients
  swDayWallpaper: string;
  swNightWallpaper: string;
  swDayGradient: string;
  swNightGradient: string;
  timerDayWallpaper: string;
  timerNightWallpaper: string;
  timerDayGradient: string;
  timerNightGradient: string;

  // Brand label in footer
  brandStudio: (modeName: string) => string;
}

export const TRANSLATIONS: Record<Language, Translations> = {
  en: {
    stopwatch: 'Stopwatch',
    timer: 'Timer',
    simpleTimer: 'Countdown',
    pomodoro: 'Pomodoro',
    fullscreenEnter: 'Fullscreen mode',
    fullscreenExit: 'Exit fullscreen',

    hoursUnit: 'hours',
    minutesUnit: 'min',
    secondsUnit: 'sec',
    millisUnit: 'ms',

    lapBtn: 'Lap',
    startBtn: 'Start',
    pauseBtn: 'Pause',
    resumeBtn: 'Resume',
    resetBtn: 'Reset',
    lapsTable: 'Laps',
    clearLaps: 'Clear',
    bestLap: 'Best',
    lapsCount: (count: number) => `Laps: ${count}`,
    lapTooltip: 'Record lap time',
    resetStopwatchTooltip: 'Reset stopwatch',

    countdownHeader: 'Countdown',
    timeIsUp: 'Time is up!',
    timeSlider: 'Time slider:',
    minutesAbbr: 'min',
    restartBtn: 'Restart',
    resetTimerTooltip: 'Reset timer',

    focusPhase: 'Focus',
    breakPhase: 'Short Break',
    shortBreakName: 'Short Break',
    longBreakName: 'Long Break',
    roundOf: (c, t) => `Round ${c} of ${t}`,
    cycleOf: (c, t) => `Cycle ${c} of ${t}`,
    roundAndCycle: (r, tr, c, tc) => `Round ${r}/${tr} • Cycle ${c}/${tc}`,
    sessionParams: 'Session Settings',
    collapse: 'Collapse',
    expand: 'Expand',
    paramWork: 'Work',
    paramBreak: 'Short Break',
    paramRounds: 'Rounds',
    paramLongBreak: 'Long Break',
    paramCycles: 'Cycles',

    sliderTitleWork: 'Time: Work',
    sliderTitleBreak: 'Break Time',
    sliderTitleRounds: 'Rounds Time',
    sliderTitleLongBreak: 'Long Break Time',
    sliderTitleCycles: 'Cycles Count',

    sliderLabel: 'Slider:',
    unitMin: 'min',
    unitRounds: 'rounds',
    unitCycles: 'cycles',
    totalPomodoroSession: 'Total Pomodoro:',
    workAbbr: 'Work:',
    breakAbbr: 'Break:',
    cycleAbbr: 'Cyc:',
    totalLabel: 'Total:',
    resetPomodoroTooltip: 'Reset Pomodoro session',
    sessionCompleted: 'Session Completed!',
    formatDuration: (mins: number) =>
      mins >= 60 ? `${Math.floor(mins / 60)}h ${mins % 60}m` : `${mins} min`,

    musicTitle: 'Ambient Sounds & Music (YouTube)',
    ambientYouTube: 'Nature Sounds (YouTube):',
    musicStreamsYouTube: 'Music Streams (YouTube):',
    refreshList: 'Refresh list',
    stopAudio: 'Stop',
    playBtn: 'Play',
    playingBtn: 'Playing',
    playingSub: 'Playing in background',
    pressPlaySub: 'Click "Play"',
    collapseMusicTooltip: 'Collapse (music will keep playing)',
    expandMusicTooltip: 'Expand music panel',
    playMusicTooltip: 'Play background music or ambience',
    pauseMusicTooltip: 'Pause background audio',
    nowPlaying: 'Now playing:',

    photoBg: 'Photo',
    meshBg: 'Mesh',
    dayModeTooltip: 'Day mode (dark text)',
    nightModeTooltip: 'Night mode',

    rainSound: 'Rain & Thunder',
    rainDesc: 'Calming rainstorm with soft distant thunder',
    fireSound: 'Fireplace',
    fireDesc: 'Cozy crackling birch wood fireplace fire',
    oceanSound: 'Ocean Waves',
    oceanDesc: 'Gentle rolling ocean waves on the coast',
    cafeSound: 'Cafe Ambience',
    cafeDesc: 'Cozy coffee shop atmosphere and quiet hum',

    swDayWallpaper: 'Morning Ocean Sunrise',
    swNightWallpaper: 'Night Mountains & Milky Way',
    swDayGradient: 'Mesh: Peach Sunset & Lavender',
    swNightGradient: 'Mesh: Twilight Velvet & Neon Purple',
    timerDayWallpaper: 'Morning Sunlit Garden',
    timerNightWallpaper: 'Starry Night Forest & Lake',
    timerDayGradient: 'Mesh: Mint Sage & Lemon Dawn',
    timerNightGradient: 'Mesh: Warm Night Caramel & Amber',

    brandStudio: (modeName: string) => `Aesthetic Studio • ${modeName}`,
  },
  ru: {
    stopwatch: 'Секундомер',
    timer: 'Таймер',
    simpleTimer: 'Обычный',
    pomodoro: 'Помодоро',
    fullscreenEnter: 'Полноэкранный режим',
    fullscreenExit: 'Выйти из полноэкранного режима',

    hoursUnit: 'час',
    minutesUnit: 'мин',
    secondsUnit: 'сек',
    millisUnit: 'мс',

    lapBtn: 'Круг',
    startBtn: 'Старт',
    pauseBtn: 'Пауза',
    resumeBtn: 'Продолжить',
    resetBtn: 'Сброс',
    lapsTable: 'Круги',
    clearLaps: 'Очистить',
    bestLap: 'Лучший',
    lapsCount: (count: number) => `Кругов: ${count}`,
    lapTooltip: 'Зафиксировать круг',
    resetStopwatchTooltip: 'Сбросить секундомер',

    countdownHeader: 'Обычный таймер',
    timeIsUp: 'Время вышло!',
    timeSlider: 'Ползунок времени:',
    minutesAbbr: 'мин',
    restartBtn: 'Заново',
    resetTimerTooltip: 'Сбросить таймер',

    focusPhase: 'Фокус',
    breakPhase: 'Короткий отдых',
    shortBreakName: 'Короткий отдых',
    longBreakName: 'Длинный отдых',
    roundOf: (c, t) => `Круг ${c} из ${t}`,
    cycleOf: (c, t) => `Цикл ${c} из ${t}`,
    roundAndCycle: (r, tr, c, tc) => `Круг ${r}/${tr} • Цикл ${c}/${tc}`,
    sessionParams: 'Параметры сессии',
    collapse: 'Свернуть',
    expand: 'Развернуть',
    paramWork: 'Работа',
    paramBreak: 'Корот. отдых',
    paramRounds: 'Кругов',
    paramLongBreak: 'Длин. отдых',
    paramCycles: 'Цикл',

    sliderTitleWork: 'Время: работа',
    sliderTitleBreak: 'Время отдыха',
    sliderTitleRounds: 'Время кругов',
    sliderTitleLongBreak: 'Время: длинный отдых',
    sliderTitleCycles: 'Количество циклов',

    sliderLabel: 'Бегунок:',
    unitMin: 'мин',
    unitRounds: 'кругов',
    unitCycles: 'циклов',
    totalPomodoroSession: 'Всего Pomodoro:',
    workAbbr: 'Раб:',
    breakAbbr: 'Отд:',
    cycleAbbr: 'Цикл:',
    totalLabel: 'Всего:',
    resetPomodoroTooltip: 'Сбросить Pomodoro сессию',
    sessionCompleted: 'Сессия завершена!',
    formatDuration: (mins: number) =>
      mins >= 60 ? `${Math.floor(mins / 60)}ч ${mins % 60}м` : `${mins} мин`,

    musicTitle: 'Фоновые звуки и музыка (YouTube)',
    ambientYouTube: 'Фоновые звуки природы (YouTube):',
    musicStreamsYouTube: 'Музыкальные потоки (YouTube):',
    refreshList: 'Обновить список',
    stopAudio: 'Остановить',
    playBtn: 'Включить',
    playingBtn: 'Играет',
    playingSub: 'Играет в фоне (не прерывается)',
    pressPlaySub: 'Нажмите «Включить»',
    collapseMusicTooltip: 'Свернуть (звук продолжится)',
    expandMusicTooltip: 'Развернуть',
    playMusicTooltip: 'Включить фоновый звук / музыку',
    pauseMusicTooltip: 'Поставить на паузу',
    nowPlaying: 'Сейчас воспроизводится:',

    photoBg: 'Фото',
    meshBg: 'Меш-градиент',
    dayModeTooltip: 'Дневной режим (темный шрифт)',
    nightModeTooltip: 'Вечерний режим',

    rainSound: 'Дождь с грозой',
    rainDesc: 'Успокаивающий шум ливня с мягкими раскатами грома',
    fireSound: 'Треск камина',
    fireDesc: 'Живое потрескивание березовых дров в камине',
    oceanSound: 'Прибой океана',
    oceanDesc: 'Мягкие накатывающие волны морского побережья',
    cafeSound: 'Шум кофейни',
    cafeDesc: 'Атмосфера уютного кафе и тихий гул зала',

    swDayWallpaper: 'Утренний морской прибой',
    swNightWallpaper: 'Ночные горы и Млечный Путь',
    swDayGradient: 'Меш: Персиковый закат и лаванда',
    swNightGradient: 'Меш: Сумеречный бархат и неоновый пурпур',
    timerDayWallpaper: 'Утренний залитый солнцем сад',
    timerNightWallpaper: 'Звездный ночной лес и озеро',
    timerDayGradient: 'Меш: Мятный шалфей и лимонная заря',
    timerNightGradient: 'Меш: Теплая ночная карамель и амбра',

    brandStudio: (modeName: string) => `Aesthetic Studio • ${modeName}`,
  },
};

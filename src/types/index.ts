export type AppMode = 'stopwatch' | 'timer';
export type TimerSubMode = 'simple' | 'pomodoro';

export type TimeOfDay = 'day' | 'night';
export type BackgroundType = 'image' | 'gradient';

export interface Wallpaper {
  id: string;
  name: string;
  timeOfDay: 'day' | 'night';
  url: string;
  thumbnail: string;
  attribution: string;
  vibe: string;
}

export interface GradientTheme {
  id: string;
  name: string;
  timeOfDay: 'day' | 'night';
  style: React.CSSProperties;
  accentColor: string;
  textColor: string;
}

export interface LapRecord {
  id: string;
  lapNumber: number;
  lapTime: number; // in milliseconds
  splitTime: number; // in milliseconds
}

export type PomodoroPhase = 'work' | 'shortBreak' | 'longBreak';

export interface PomodoroConfig {
  workMinutes: number;
  shortBreakMinutes: number;
  longBreakMinutes: number;
  rounds: number;
  cycles: number;
}


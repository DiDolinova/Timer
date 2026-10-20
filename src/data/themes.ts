import { Wallpaper, GradientTheme } from '../types';

export interface AppThemesConfig {
  stopwatch: {
    dayWallpaper: Wallpaper;
    nightWallpaper: Wallpaper;
    dayGradient: GradientTheme;
    nightGradient: GradientTheme;
    primaryColor: string; // #C71585
  };
  timer: {
    dayWallpaper: Wallpaper;
    nightWallpaper: Wallpaper;
    dayGradient: GradientTheme;
    nightGradient: GradientTheme;
    primaryColor: string; // #FFDAB9
  };
}

export const APP_THEMES: AppThemesConfig = {
  stopwatch: {
    primaryColor: '#F19CBB',
    // Дневная картинка (ОСТАВЛЕНА, НЕ ТРОНУТА)
    dayWallpaper: {
      id: 'sw-day-ocean',
      name: 'Утренний морской прибой',
      timeOfDay: 'day',
      url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=3840&q=95',
      thumbnail: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=300&q=80',
      attribution: 'Sean Oulashin / Unsplash',
      vibe: 'Бирюзовые волны на утреннем песке и легкий морской бриз',
    },
    // Новая ночная природа: звездные горы и галактика над озером (4K, кристальная четкость)
    nightWallpaper: {
      id: 'sw-night-mountain-stars',
      name: 'Ночные горы и Млечный Путь',
      timeOfDay: 'night',
      url: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=3840&q=95',
      thumbnail: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=300&q=80',
      attribution: 'Benjamin Davies / Unsplash',
      vibe: 'Величественные горные пики под бесконечным звездным небом',
    },
    dayGradient: {
      id: 'sw-day-mesh',
      name: 'Меш: Персиковый закат и лаванда',
      timeOfDay: 'day',
      style: {
        backgroundColor: '#fff1f2',
        backgroundImage: `
          radial-gradient(at 15% 15%, #fba379 0px, transparent 55%),
          radial-gradient(at 85% 85%, #cb65ec 0px, transparent 55%),
          radial-gradient(at 15% 85%, #edd489 0px, transparent 50%),
          radial-gradient(at 85% 15%, #f472b6 0px, transparent 50%)
        `,
      },
      accentColor: '#F19CBB',
      textColor: 'text-[#0a192f]',
    },
    nightGradient: {
      id: 'sw-night-mesh',
      name: 'Меш: Сумеречный бархат и неоновый пурпур',
      timeOfDay: 'night',
      style: {
        backgroundColor: '#0c0414',
        backgroundImage: `
          radial-gradient(at 20% 20%, #881337 0px, transparent 55%),
          radial-gradient(at 80% 80%, #581c87 0px, transparent 55%),
          radial-gradient(at 15% 85%, #701a75 0px, transparent 50%),
          radial-gradient(at 85% 15%, #9d174d 0px, transparent 50%)
        `,
      },
      accentColor: '#F19CBB',
      textColor: 'text-white',
    },
  },
  timer: {
    primaryColor: '#FFDAB9',
    // Дневная картинка (ОСТАВЛЕНА, НЕ ТРОНУТА)
    dayWallpaper: {
      id: 'timer-day-garden',
      name: 'Утренний залитый солнцем сад',
      timeOfDay: 'day',
      url: 'https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?auto=format&fit=crop&w=3840&q=95',
      thumbnail: 'https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?auto=format&fit=crop&w=300&q=80',
      attribution: 'Luca Bravo / Unsplash',
      vibe: 'Утренняя листва, роса и мягкие золотистые солнечные лучи',
    },
    // Новая ночная природа: звездный ночной лес и зеркальное озеро (4K, кристальная четкость)
    nightWallpaper: {
      id: 'timer-night-lake-forest',
      name: 'Звездный ночной лес и озеро',
      timeOfDay: 'night',
      url: 'https://images.unsplash.com/photo-1470813740244-df37b8c1edcb?auto=format&fit=crop&w=3840&q=95',
      thumbnail: 'https://images.unsplash.com/photo-1470813740244-df37b8c1edcb?auto=format&fit=crop&w=300&q=80',
      attribution: 'Casey Horner / Unsplash',
      vibe: 'Тихий ночной хвойный лес, отражение звезд и безмятежная природа',
    },
    dayGradient: {
      id: 'timer-day-mesh',
      name: 'Меш: Мятный шалфей и лимонная заря',
      timeOfDay: 'day',
      style: {
        backgroundColor: '#fcfce2',
        backgroundImage: `
          radial-gradient(at 15% 20%, #a8d5ba 0px, transparent 55%),
          radial-gradient(at 85% 20%, #e8f58b 0px, transparent 55%),
          radial-gradient(at 20% 85%, #f0faa0 0px, transparent 50%),
          radial-gradient(at 80% 80%, #b8e2c8 0px, transparent 50%)
        `,
      },
      accentColor: '#FFDAB9',
      textColor: 'text-[#0a192f]',
    },
    nightGradient: {
      id: 'timer-night-mesh',
      name: 'Меш: Теплая ночная карамель и амбра',
      timeOfDay: 'night',
      style: {
        backgroundColor: '#140905',
        backgroundImage: `
          radial-gradient(at 20% 20%, #9a3412 0px, transparent 55%),
          radial-gradient(at 80% 20%, #713f12 0px, transparent 50%),
          radial-gradient(at 85% 85%, #4c1d95 0px, transparent 55%),
          radial-gradient(at 15% 85%, #78350f 0px, transparent 50%)
        `,
      },
      accentColor: '#FFDAB9',
      textColor: 'text-white',
    },
  },
};

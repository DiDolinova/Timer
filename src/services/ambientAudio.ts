export interface MediaStation {
  id: string;
  name: string;
  genre: string;
  youtubeId: string;
  iconType: 'rain' | 'fire' | 'waves' | 'cafe' | 'music';
}

// 4 фоновых звука через YouTube вместо ползунков
export const AMBIENT_SOUND_STATIONS: MediaStation[] = [
  {
    id: 'ambient-rain-thunder',
    name: 'Дождь с грозой',
    genre: 'Успокаивающий шум ливня с мягкими раскатами грома',
    youtubeId: 'mPZkdNFkNps',
    iconType: 'rain',
  },
  {
    id: 'ambient-fireplace',
    name: 'Треск камина',
    genre: 'Живое потрескивание березовых дров в камине',
    youtubeId: 'L_LUpnjgPso',
    iconType: 'fire',
  },
  {
    id: 'ambient-ocean-waves',
    name: 'Прибой океана',
    genre: 'Мягкие накатывающие волны морского побережья',
    youtubeId: 'bn9F19Hi1Lk',
    iconType: 'waves',
  },
  {
    id: 'ambient-cafe-murmur',
    name: 'Шум кофейни',
    genre: 'Атмосфера уютного кафе и тихий гул зала',
    youtubeId: 'h2zkV-l_TbY',
    iconType: 'cafe',
  },
];

// Музыкальные потоки (без Lofi Study Beats!)
export const ALL_MUSIC_STATIONS_POOLS: MediaStation[][] = [
  // Пул 1
  [
    {
      id: 'cozy-jazz-cafe',
      name: 'Cozy Jazz Cafe',
      genre: 'Уютный мягкий джаз для спокойной работы',
      youtubeId: 'Dx5qFachd3A',
      iconType: 'music',
    },
    {
      id: 'calm-piano-focus',
      name: 'Calm Piano Focus',
      genre: 'Умиротворяющее фортепиано для концентрации',
      youtubeId: 'lTRiuFIWV54',
      iconType: 'music',
    },
    {
      id: 'deep-focus-ambient',
      name: 'Deep Focus Study',
      genre: 'Мягкий электронный эмбиент без слов',
      youtubeId: 'TURbeWK2wwg',
      iconType: 'music',
    },
    {
      id: 'tokyo-night-synth',
      name: 'Tokyo Night Chill',
      genre: 'Атмосферный ночной синтвейв и неон',
      youtubeId: '4xDzrJKXOOY',
      iconType: 'music',
    },
  ],
  // Пул 2 (при нажатии "Обновить")
  [
    {
      id: 'coffee-rain-jazz',
      name: 'Warm Coffee & Rain',
      genre: 'Саксофон и тихая дождливая кофейня',
      youtubeId: 'WPni755-Krg',
      iconType: 'music',
    },
    {
      id: 'peaceful-guitar',
      name: 'Peaceful Guitar Garden',
      genre: 'Акустическая гитара и природное спокойствие',
      youtubeId: '3nQNiWdeH2Q',
      iconType: 'music',
    },
    {
      id: 'zen-meditation-chimes',
      name: 'Zen Tibetan Chimes',
      genre: 'Глубокая медитативная ясность ума',
      youtubeId: 'W1Y_M81iVd8',
      iconType: 'music',
    },
    {
      id: 'synth-sunset',
      name: 'Sunset Ambient Chill',
      genre: 'Мягкие теплые аналоговые синтезаторы',
      youtubeId: 'S_MOd40zlsk',
      iconType: 'music',
    },
  ],
];

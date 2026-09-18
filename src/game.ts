export type Screen = 'garage' | 'levels' | 'race' | 'result';

export interface Car {
  id: number;
  name: string;
  series: string;
  color: string;
  image: string;
  description: string;
}

export const CARS: Car[] = [
  { id: 0, name: 'Scarlet', series: 'Sport', color: '#f3423e', image: '/images/scarlet-garage.png', description: 'Semangat merah. Siap jadi yang terdepan.' },
  { id: 1, name: 'Volt', series: 'Supercar', color: '#f7d036', image: '/images/volt-garage.png', description: 'Secepat kilat, seterang semangatmu.' },
  { id: 2, name: 'Phantom', series: 'Street', color: '#bccad6', image: '/images/phantom-garage.png', description: 'Tenang di tikungan, tangguh di lintasan.' },
  { id: 3, name: 'Viper', series: 'Hypercar', color: '#2b9cf1', image: '/images/viper-garage.png', description: 'Biru yang berani. Tak ada kata menyerah.' },
  { id: 4, name: 'Inferno', series: 'Muscle', color: '#f08029', image: '/images/inferno-garage.png', description: 'Kekuatan sang juara ada di tanganmu.' },
];

export interface Level {
  id: number;
  name: string;
  range: string;
  description: string;
  pairs: [number, number][];
}

export const LEVELS: Level[] = [
  {
    id: 0, name: 'Pemanasan', range: '1-20',
    description: 'Perjalanan hebat dimulai dari langkah kecil. Ayo, kamu pasti bisa!',
    pairs: [[8, 3], [10, 4], [9, 2], [12, 5], [15, 4], [14, 6], [18, 7], [16, 8], [20, 9], [17, 5]],
  },
  {
    id: 1, name: 'Tambah Kecepatan', range: '21-40',
    description: 'Mesin sudah hangat. Saatnya menghitung dan melaju lebih jauh!',
    pairs: [[25, 3], [28, 6], [34, 12], [39, 15], [27, 14], [36, 21], [40, 20], [33, 11], [38, 16], [29, 7]],
  },
  {
    id: 2, name: 'Tikungan Seru', range: '41-60',
    description: 'Tetap fokus di setiap tikungan. Angka besar bukan halangan!',
    pairs: [[42, 15], [51, 24], [46, 18], [60, 27], [53, 16], [44, 29], [58, 19], [47, 28], [56, 38], [50, 26]],
  },
  {
    id: 3, name: 'Lintasan Kilat', range: '61-80',
    description: 'Kamu makin jago! Tunjukkan kemampuanmu di lintasan ini.',
    pairs: [[64, 27], [71, 36], [68, 29], [80, 45], [73, 48], [62, 37], [77, 39], [65, 28], [76, 49], [70, 34]],
  },
  {
    id: 4, name: 'Grand Finale', range: '81-100',
    description: 'Satu lintasan lagi menuju juara. Berikan usaha terbaikmu!',
    pairs: [[92, 47], [100, 58], [85, 39], [96, 67], [81, 46], [94, 58], [87, 49], [90, 63], [99, 75], [100, 76]],
  },
];

export interface Question {
  a: number;
  b: number;
  answer: number;
  options: number[];
}

export interface Session {
  levelId: number;
  carId: number;
  questions: Question[];
  answers: number[];
  currentIndex: number;
  coinsEarned: number;
  diamondsEarned: number;
  newlyUnlocked: boolean;
}

export interface Progress {
  version: 1;
  bestScores: (number | null)[];
  coins: number;
  diamonds: number;
  equippedCar: number;
  sound: boolean;
  reducedMotion: boolean;
}

export const STORAGE_KEY = 'race-math-progress-v1';
export const PASS_SCORE = 6;
export const DEFAULT_PROGRESS: Progress = {
  version: 1, bestScores: [null, null, null, null, null], coins: 0,
  diamonds: 0, equippedCar: 0, sound: true, reducedMotion: false,
};

export function getUnlockedLevel(progress: Progress): number {
  let level = 0;
  while (level < LEVELS.length - 1 && (progress.bestScores[level] ?? 0) >= PASS_SCORE) level++;
  return level;
}

export function getStars(score: number): number {
  return score >= 9 ? 3 : score >= 8 ? 2 : score >= PASS_SCORE ? 1 : 0;
}

export function readProgress(): Progress {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { ...DEFAULT_PROGRESS, bestScores: [...DEFAULT_PROGRESS.bestScores] };
    const saved = JSON.parse(raw) as Partial<Progress>;
    if (saved.version !== 1) throw new Error('Unsupported save');
    const bestScores = Array.from({ length: 5 }, (_, i) => {
      const score = saved.bestScores?.[i];
      return typeof score === 'number' && Number.isInteger(score) && score >= 0 && score <= 10 ? score : null;
    });
    const progress: Progress = {
      ...DEFAULT_PROGRESS, bestScores,
      coins: Number.isSafeInteger(saved.coins) && (saved.coins ?? -1) >= 0 ? saved.coins! : 0,
      diamonds: Number.isSafeInteger(saved.diamonds) && (saved.diamonds ?? -1) >= 0 ? saved.diamonds! : 0,
      sound: typeof saved.sound === 'boolean' ? saved.sound : true,
      reducedMotion: typeof saved.reducedMotion === 'boolean' ? saved.reducedMotion : false,
    };
    const car = saved.equippedCar;
    progress.equippedCar = typeof car === 'number' && Number.isInteger(car) && car >= 0 && car <= getUnlockedLevel(progress) ? car : 0;
    return progress;
  } catch {
    return { ...DEFAULT_PROGRESS, bestScores: [...DEFAULT_PROGRESS.bestScores] };
  }
}

function shuffle<T>(items: T[]): T[] {
  const result = [...items];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

export function createQuestions(levelId: number): Question[] {
  return shuffle(LEVELS[levelId].pairs).map(([a, b]) => {
    const answer = a - b;
    const candidates = [...new Set([answer - 1, answer + 1, answer - 2, answer + 2, answer - 10, answer + 10])]
      .filter(value => value >= 1 && value <= 100 && value !== answer);
    return { a, b, answer, options: shuffle([answer, ...shuffle(candidates).slice(0, 2)]) };
  });
}

export function getScore(session: Session): number {
  return session.answers.reduce((score, answer, index) => score + Number(answer === session.questions[index].answer), 0);
}

export function getRacePositions(session: Pick<Session, 'answers' | 'questions'>): { playerPosition: number; rivalPosition: number } {
  const attempts = Math.min(session.answers.length, session.questions.length);
  if (attempts === 0) return { playerPosition: 0, rivalPosition: 0 };

  // Each answer advances both cars into a new segment, so overtaking never moves a car backward.
  // Use the last submitted answer, not the current question or pass score, including at the finish.
  const lastAnswerCorrect = session.answers[attempts - 1] === session.questions[attempts - 1].answer;
  const leadingPosition = attempts / session.questions.length;
  const trailingPosition = (attempts - 0.8) / session.questions.length;

  return {
    playerPosition: lastAnswerCorrect ? leadingPosition : trailingPosition,
    rivalPosition: lastAnswerCorrect ? trailingPosition : leadingPosition,
  };
}

export function explainQuestion(question: Question): string {
  const { a, b, answer } = question;
  const tens = Math.floor(b / 10) * 10;
  const units = b % 10;
  if (tens > 0 && units > 0) {
    return `Kurangi puluhannya dulu: ${a} - ${tens} = ${a - tens}. Lalu ${a - tens} - ${units} = ${answer}.`;
  }
  return `Mulai dari ${a}, lalu hitung mundur ${b} langkah. Kamu sampai di angka ${answer}.`;
}

let audioContext: AudioContext | undefined;

export function playSound(type: 'correct' | 'incorrect' | 'click' | 'start' | 'finish', enabled: boolean): void {
  if (!enabled) return;
  try {
    audioContext ??= new AudioContext();
    void audioContext.resume().catch(() => undefined);
    const notes = {
      correct: [523.25, 659.25, 783.99], incorrect: [329.63, 261.63],
      click: [523.25], start: [329.63, 440, 659.25], finish: [523.25, 659.25, 783.99, 1046.5],
    }[type];
    notes.forEach((frequency, index) => {
      const oscillator = audioContext!.createOscillator();
      const gain = audioContext!.createGain();
      const start = audioContext!.currentTime + index * 0.105;
      oscillator.type = 'sine';
      oscillator.frequency.value = frequency;
      gain.gain.setValueAtTime(0, start);
      gain.gain.linearRampToValueAtTime(0.065, start + 0.012);
      gain.gain.exponentialRampToValueAtTime(0.001, start + 0.19);
      oscillator.connect(gain);
      gain.connect(audioContext!.destination);
      oscillator.onended = () => { oscillator.disconnect(); gain.disconnect(); };
      oscillator.start(start);
      oscillator.stop(start + 0.2);
    });
  } catch {
    // Audio is optional; the game also works in browsers without Web Audio.
  }
}
// Ptolemy Game Types

export interface Question {
  id: string;
  tier: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;
  category: 'biology' | 'physics' | 'chemistry' | 'maths' | 'earth' | 'space' | 'computing' | 'engineering' | 'history';
  question: string;
  answers: [string, string, string, string];
  correctIndex: 0 | 1 | 2 | 3;
  explanation?: string;
}

export interface GameState {
  mode: 'menu' | 'selecting' | 'playing' | 'paused' | 'gameover' | 'passplay-setup' | 'passplay-handoff' | 'passplay-result';
  tier: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10;
  hearts: number;
  streak: number;
  points: number;
  currentQuestion: Question | null;
  currentQuestionIndex: number;
  questionsThisGame: Question[];
  correctInARow: number;
  hasStreakFreeze: boolean;
  timeRemaining: number;
  cooldownEndTime: number | null;
  lastAnswerCorrect: boolean | null;
  showingHeartLoss: boolean;
  showingMilestone: boolean;
  milestoneMessage: string;
}

export interface PassPlayState {
  player1Name: string;
  player2Name: string;
  player1Score: number;
  player2Score: number;
  player1Correct: number;
  player2Correct: number;
  player1Times: number[];
  player2Times: number[];
  currentPlayer: 1 | 2;
  showTarget: boolean;
  questionsPerPlayer: number;
}

export interface LocalPtolemyData {
  bestStreakPerTier: Record<number, number>;
  totalPoints: number;
  tiersUnlocked: number[];
  questionsSeenIds: string[];
  cooldownEndTime: number | null;
  gamesPlayed: number;
  totalCorrect: number;
  totalAnswered: number;
}

export const TIER_NAMES: Record<number, string> = {
  1: 'Spark',
  2: 'Ember',
  3: 'Flame',
  4: 'Fire',
  5: 'Blaze',
  6: 'Furnace',
  7: 'Forge',
  8: 'Crucible',
  9: 'Nova',
  10: 'Supernova',
};

export const TIER_TIMES: Record<number, number> = {
  1: 20,
  2: 18,
  3: 16,
  4: 14,
  5: 12,
  6: 12,
  7: 10,
  8: 10,
  9: 8,
  10: 8,
};

export const TIER_DESCRIPTIONS: Record<number, string> = {
  1: 'Curious child',
  2: 'Engaged student',
  3: 'Keen learner',
  4: 'GCSE level',
  5: 'A-Level',
  6: 'Undergraduate',
  7: 'Graduate',
  8: 'PhD',
  9: 'Specialist',
  10: 'World expert',
};

export const STREAK_MILESTONES: Record<number, string> = {
  5: 'A fine beginning.',
  10: "You're finding your rhythm.",
  25: 'Few travel this far.',
  50: 'I am... impressed.',
  100: 'You walk among the stars now.',
  250: 'Perhaps you should be asking the questions.',
};

export const RANKS = [
  { requirement: 'Just started', title: 'Wonderer', description: "You ask questions. That's where it all begins." },
  { requirement: 'Streak 5+ in Tier 1', title: 'Collector of Sparks', description: "You're gathering light." },
  { requirement: 'Streak 5+ in Tier 2', title: 'Keeper of Embers', description: 'Knowledge takes hold in you.' },
  { requirement: 'Streak 5+ in Tier 3', title: 'Tender of Flames', description: 'You nurture understanding.' },
  { requirement: 'Streak 10+ in Tier 3', title: 'Firebearer', description: 'You carry knowledge forward.' },
  { requirement: 'Streak 5+ in Tier 4', title: 'Illuminator', description: 'You light paths for others.' },
  { requirement: 'Streak 10+ in Tier 4', title: 'Torchbearer', description: 'The dark holds no fear for you.' },
  { requirement: 'Streak 5+ in Tier 5', title: 'Lamplighter', description: 'You bring light to high places.' },
  { requirement: 'Streak 10+ in Tier 5', title: 'Beacon', description: 'Others navigate by your understanding.' },
  { requirement: 'Unlocked Tier 6+', title: 'Astronomer', description: "You've turned your gaze upward." },
  { requirement: 'Streak 5+ in Tier 6', title: 'Stargazer', description: 'You perceive distant fires.' },
  { requirement: 'Streak 5+ in Tier 7', title: 'Navigator', description: 'You chart courses through complexity.' },
  { requirement: 'Streak 5+ in Tier 8', title: 'Cartographer', description: 'You map the unknown.' },
  { requirement: 'Streak 5+ in Tier 9', title: 'Voyager', description: 'You travel where few have been.' },
  { requirement: 'Streak 5+ in Tier 10', title: 'Cosmographer', description: 'You describe the shape of everything.' },
  { requirement: 'Streak 10+ in Tier 10', title: 'Ptolemy', description: 'The stars are your companions.' },
];

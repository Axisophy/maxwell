'use client';

import { useState, useEffect, useCallback } from 'react';
import { GameState, LocalPtolemyData, TIER_NAMES, TIER_TIMES, STREAK_MILESTONES } from '@/lib/ptolemy/types';
import { getRandomQuestions, shuffleAnswers } from '@/lib/ptolemy/questions';

// Initial game state
const initialGameState: GameState = {
  mode: 'menu',
  tier: 1,
  hearts: 3,
  streak: 0,
  points: 0,
  currentQuestion: null,
  currentQuestionIndex: 0,
  questionsThisGame: [],
  correctInARow: 0,
  hasStreakFreeze: false,
  timeRemaining: 20,
  cooldownEndTime: null,
  lastAnswerCorrect: null,
  showingHeartLoss: false,
  showingMilestone: false,
  milestoneMessage: '',
};

// Load local data from localStorage
function loadLocalData(): LocalPtolemyData {
  if (typeof window === 'undefined') return getDefaultLocalData();
  const stored = localStorage.getItem('ptolemy-data');
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch {
      return getDefaultLocalData();
    }
  }
  return getDefaultLocalData();
}

function getDefaultLocalData(): LocalPtolemyData {
  return {
    bestStreakPerTier: {},
    totalPoints: 0,
    tiersUnlocked: [1, 2, 3, 4, 5],
    questionsSeenIds: [],
    cooldownEndTime: null,
    gamesPlayed: 0,
    totalCorrect: 0,
    totalAnswered: 0,
  };
}

function saveLocalData(data: LocalPtolemyData) {
  if (typeof window === 'undefined') return;
  localStorage.setItem('ptolemy-data', JSON.stringify(data));
}

export default function PtolemyGame() {
  const [gameState, setGameState] = useState<GameState>(initialGameState);
  const [localData, setLocalData] = useState<LocalPtolemyData>(getDefaultLocalData());
  const [isAnimating, setIsAnimating] = useState(false);

  // Track asked questions to prevent repetition
  const [askedQuestionIds, setAskedQuestionIds] = useState<Set<string>>(new Set());

  // Track if currently processing an answer (prevent double-clicks)
  const [isProcessingAnswer, setIsProcessingAnswer] = useState(false);

  // Load local data on mount
  useEffect(() => {
    const data = loadLocalData();
    setLocalData(data);
  }, []);

  // Clear focus when question changes
  useEffect(() => {
    setIsProcessingAnswer(false);
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }
  }, [gameState.currentQuestionIndex, gameState.currentQuestion?.id]);

  // Timer effect
  useEffect(() => {
    if (gameState.mode !== 'playing' || gameState.timeRemaining <= 0) return;

    const timer = setInterval(() => {
      setGameState(prev => {
        if (prev.timeRemaining <= 1) {
          return handleWrongAnswer(prev);
        }
        return { ...prev, timeRemaining: prev.timeRemaining - 1 };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [gameState.mode, gameState.timeRemaining]);

  // Handle wrong answer
  const handleWrongAnswer = useCallback((prev: GameState): GameState => {
    const newHearts = prev.hearts - 1;
    setIsProcessingAnswer(false);

    if (newHearts <= 0) {
      const finalStreak = prev.streak;

      setLocalData(current => {
        const updated = {
          ...current,
          gamesPlayed: current.gamesPlayed + 1,
          totalPoints: current.totalPoints + prev.points,
          bestStreakPerTier: {
            ...current.bestStreakPerTier,
            [prev.tier]: Math.max(current.bestStreakPerTier[prev.tier] || 0, finalStreak),
          },
          tiersUnlocked: finalStreak >= 10 && prev.tier === 5 && !current.tiersUnlocked.includes(6)
            ? [...current.tiersUnlocked, 6, 7, 8, 9, 10]
            : current.tiersUnlocked,
        };
        saveLocalData(updated);
        return updated;
      });

      return {
        ...prev,
        mode: 'gameover',
        hearts: 0,
        showingHeartLoss: false,
        cooldownEndTime: null,
      };
    }

    return {
      ...prev,
      hearts: newHearts,
      streak: 0,
      showingHeartLoss: true,
      lastAnswerCorrect: false,
    };
  }, []);

  // Start game
  const startGame = useCallback((tier: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10) => {
    const newAskedIds = new Set<string>();
    const questions = getRandomQuestions(tier, 20);
    const firstQuestion = questions[0];

    questions.forEach(q => newAskedIds.add(q.id));
    setAskedQuestionIds(newAskedIds);

    setIsAnimating(true);
    setTimeout(() => {
      setIsAnimating(false);
    }, 800);

    setGameState({
      ...initialGameState,
      mode: 'playing',
      tier,
      questionsThisGame: questions,
      currentQuestion: shuffleAnswers(firstQuestion),
      currentQuestionIndex: 0,
      timeRemaining: TIER_TIMES[tier],
    });
  }, []);

  // Move to next question helper
  const moveToNextQuestion = useCallback(() => {
    const nextIndex = gameState.currentQuestionIndex + 1;

    if (nextIndex >= gameState.questionsThisGame.length) {
      const excludeIds = Array.from(askedQuestionIds);
      let moreQuestions = getRandomQuestions(gameState.tier, 20, excludeIds);

      if (moreQuestions.length === 0) {
        setAskedQuestionIds(new Set());
        moreQuestions = getRandomQuestions(gameState.tier, 20);
      }

      const newAskedIds = new Set(askedQuestionIds);
      moreQuestions.forEach(q => newAskedIds.add(q.id));
      setAskedQuestionIds(newAskedIds);

      const nextQuestion = moreQuestions[0];

      setGameState(prev => ({
        ...prev,
        questionsThisGame: moreQuestions,
        currentQuestion: shuffleAnswers(nextQuestion),
        currentQuestionIndex: 0,
        timeRemaining: TIER_TIMES[prev.tier],
      }));
    } else {
      const nextQuestion = gameState.questionsThisGame[nextIndex];

      setGameState(prev => ({
        ...prev,
        currentQuestion: shuffleAnswers(nextQuestion),
        currentQuestionIndex: nextIndex,
        timeRemaining: TIER_TIMES[prev.tier],
      }));
    }
  }, [gameState.currentQuestionIndex, gameState.questionsThisGame, gameState.tier, askedQuestionIds]);

  // Select answer
  const selectAnswer = useCallback((answerIndex: number) => {
    if (!gameState.currentQuestion || isProcessingAnswer) return;

    setIsProcessingAnswer(true);

    const isCorrect = answerIndex === gameState.currentQuestion.correctIndex;

    setLocalData(prev => {
      const updated = {
        ...prev,
        totalAnswered: prev.totalAnswered + 1,
        totalCorrect: prev.totalCorrect + (isCorrect ? 1 : 0),
        questionsSeenIds: [...prev.questionsSeenIds, gameState.currentQuestion!.id],
      };
      saveLocalData(updated);
      return updated;
    });

    if (isCorrect) {
      const newStreak = gameState.streak + 1;
      const basePoints = gameState.tier * 10;
      const streakBonus = Math.floor(newStreak / 5) * 5;
      const pointsEarned = basePoints + streakBonus;

      const milestone = STREAK_MILESTONES.find(m => m.streak === newStreak);
      const earnedHeart = milestone && gameState.hearts < 3;

      setIsAnimating(true);

      setGameState(prev => ({
        ...prev,
        streak: newStreak,
        points: prev.points + pointsEarned,
        hearts: earnedHeart ? Math.min(3, prev.hearts + 1) : prev.hearts,
        lastAnswerCorrect: true,
        showingMilestone: !!milestone,
        milestoneMessage: milestone?.message || '',
      }));

      setTimeout(() => {
        setIsAnimating(false);
        moveToNextQuestion();

        if (milestone) {
          setTimeout(() => {
            setGameState(prev => ({ ...prev, showingMilestone: false }));
          }, 2000);
        }
      }, 600);

    } else {
      setIsAnimating(true);
      setGameState(prev => handleWrongAnswer(prev));

      setTimeout(() => {
        setIsAnimating(false);

        setGameState(prev => {
          if (prev.mode === 'gameover') {
            return { ...prev, showingHeartLoss: false };
          }
          return { ...prev, showingHeartLoss: false };
        });

        if (gameState.hearts > 1) {
          moveToNextQuestion();
        }
      }, 800);
    }
  }, [gameState, handleWrongAnswer, isProcessingAnswer, moveToNextQuestion]);

  // Get timer bar width
  const timerPercentage = (gameState.timeRemaining / TIER_TIMES[gameState.tier]) * 100;

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-4 font-['Neue_Haas_Grotesk_Display_Pro',_'Helvetica_Neue',_sans-serif]">
      {/* Menu Screen */}
      {gameState.mode === 'menu' && (
        <div className="w-full max-w-md text-center">
          <h1 className="text-6xl md:text-8xl font-light tracking-tight mb-4 text-black">
            PTOLEMY
          </h1>

          <p className="text-black/40 mb-12 text-lg">The Science Quiz</p>

          {/* Tier Selection */}
          <div className="space-y-2">
            <p className="text-xs text-black/40 uppercase tracking-widest mb-6">Select Tier</p>

            {([1, 2, 3, 4, 5] as const).map(tier => (
              <button
                key={tier}
                onClick={() => startGame(tier)}
                className="w-full p-4 text-left transition-all border border-black/10 hover:border-black hover:bg-black hover:text-white"
              >
                <div className="flex justify-between items-center">
                  <div>
                    <span className="font-medium">Tier {tier}</span>
                    <span className="mx-3 text-black/20">·</span>
                    <span className="text-black/60">{TIER_NAMES[tier]}</span>
                  </div>
                  <div className="text-sm text-black/40 font-mono">
                    {localData.bestStreakPerTier[tier] || 0}
                  </div>
                </div>
              </button>
            ))}

            {/* Locked tiers */}
            {!localData.tiersUnlocked.includes(6) && (
              <div className="mt-8 p-4 border border-dashed border-black/20">
                <p className="text-black/40 text-sm">
                  Tiers 6–10 unlock after streak 10+ on Tier 5
                </p>
              </div>
            )}

            {localData.tiersUnlocked.includes(6) && (
              <>
                <div className="h-px bg-black/10 my-6" />
                {([6, 7, 8, 9, 10] as const).map(tier => (
                  <button
                    key={tier}
                    onClick={() => startGame(tier)}
                    className="w-full p-4 text-left transition-all border border-black/10 hover:border-black hover:bg-black hover:text-white"
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <span className="font-medium">Tier {tier}</span>
                        <span className="mx-3 text-black/20">·</span>
                        <span className="text-black/60">{TIER_NAMES[tier]}</span>
                      </div>
                      <div className="text-sm text-black/40 font-mono">
                        {localData.bestStreakPerTier[tier] || 0}
                      </div>
                    </div>
                  </button>
                ))}
              </>
            )}
          </div>

          {/* Stats */}
          <div className="mt-12 text-sm text-black/30 font-mono">
            {localData.gamesPlayed} games · {localData.totalAnswered > 0
              ? Math.round((localData.totalCorrect / localData.totalAnswered) * 100)
              : 0}% accuracy
          </div>
        </div>
      )}

      {/* Playing Screen */}
      {gameState.mode === 'playing' && gameState.currentQuestion && (
        <div className="w-full max-w-md">
          {/* Stats Bar */}
          <div className="flex justify-between items-center mb-8">
            {/* Hearts */}
            <div className="flex gap-1">
              {[1, 2, 3].map(i => (
                <div
                  key={i}
                  className={`w-3 h-3 rounded-full border border-black transition-all ${
                    i <= gameState.hearts ? 'bg-black' : 'bg-transparent'
                  }`}
                />
              ))}
            </div>

            {/* Streak */}
            <div className="flex items-center gap-2">
              <span className="text-2xl font-light text-black font-mono">
                {gameState.streak}
              </span>
            </div>

            {/* Tier indicator */}
            <div className="text-sm text-black/40 uppercase tracking-widest">
              {TIER_NAMES[gameState.tier]}
            </div>
          </div>

          {/* Timer Bar */}
          <div className="h-px bg-black/10 mb-8 overflow-hidden">
            <div
              className="h-full bg-black transition-all duration-1000 ease-linear"
              style={{ width: `${timerPercentage}%` }}
            />
          </div>

          {/* Milestone message */}
          {gameState.showingMilestone && (
            <div className="text-center mb-6">
              <p className="text-black/60 italic">"{gameState.milestoneMessage}"</p>
              {gameState.hearts < 3 && (
                <p className="text-black/40 text-sm mt-1">+1 life restored</p>
              )}
            </div>
          )}

          {/* Question */}
          <div className="border border-black/10 p-8 mb-8">
            <p className="text-xl text-center font-light text-black leading-relaxed">
              {gameState.currentQuestion.question}
            </p>
          </div>

          {/* Answer Buttons */}
          <div className="space-y-2">
            {gameState.currentQuestion.answers.map((answer, index) => (
              <button
                key={`${gameState.currentQuestion!.id}-${index}`}
                onClick={() => selectAnswer(index)}
                disabled={isProcessingAnswer}
                onTouchEnd={(e) => {
                  e.currentTarget.blur();
                }}
                className="w-full p-4 border border-black/10 text-left transition-all hover:border-black hover:bg-black hover:text-white disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none"
              >
                <span className="font-light">{answer}</span>
              </button>
            ))}
          </div>

          {/* Points */}
          <div className="mt-8 text-center text-sm text-black/30 font-mono">
            {gameState.points} points
          </div>
        </div>
      )}

      {/* Heart Loss Overlay */}
      {gameState.mode === 'playing' && gameState.showingHeartLoss && (
        <div className="fixed inset-0 bg-white flex items-center justify-center z-50">
          <div className="w-8 h-8 rounded-full border-2 border-black bg-transparent" />
        </div>
      )}

      {/* Game Over Screen */}
      {gameState.mode === 'gameover' && (
        <div className="w-full max-w-md text-center">
          <h2 className="text-4xl font-light mb-2 text-black">
            Game Over
          </h2>

          <div className="my-12">
            <p className="text-black/40 text-sm uppercase tracking-widest mb-2">Final Streak</p>
            <p className="text-7xl font-light text-black font-mono">
              {gameState.streak}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-12">
            <div className="border border-black/10 p-6">
              <p className="text-sm text-black/40 uppercase tracking-widest mb-1">Points</p>
              <p className="text-2xl font-light text-black font-mono">
                {gameState.points}
              </p>
            </div>
            <div className="border border-black/10 p-6">
              <p className="text-sm text-black/40 uppercase tracking-widest mb-1">Tier</p>
              <p className="text-2xl font-light text-black">
                {TIER_NAMES[gameState.tier]}
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              setGameState(initialGameState);
              setAskedQuestionIds(new Set());
              setIsProcessingAnswer(false);
              setIsAnimating(false);
            }}
            className="w-full p-4 bg-black text-white font-light hover:bg-black/80 transition-all"
          >
            Play Again
          </button>
        </div>
      )}
    </div>
  );
}

'use client';

import { useState, useEffect } from 'react';
import { GameState, Question, LocalPtolemyData, TIER_NAMES, TIER_TIMES, STREAK_MILESTONES } from '@/lib/ptolemy/types';
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
  const [characterAnimation, setCharacterAnimation] = useState<'idle' | 'bounce' | 'shake' | 'celebrate'>('idle');

  // Load local data on mount
  useEffect(() => {
    const data = loadLocalData();
    setLocalData(data);

    // Check if there's an active cooldown
    if (data.cooldownEndTime && data.cooldownEndTime > Date.now()) {
      setGameState(prev => ({ ...prev, cooldownEndTime: data.cooldownEndTime }));
    }
  }, []);

  // Timer effect
  useEffect(() => {
    if (gameState.mode !== 'playing' || gameState.timeRemaining <= 0) return;

    const timer = setInterval(() => {
      setGameState(prev => {
        if (prev.timeRemaining <= 1) {
          // Time's up - wrong answer
          return handleWrongAnswer(prev);
        }
        return { ...prev, timeRemaining: prev.timeRemaining - 1 };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [gameState.mode, gameState.timeRemaining]);

  // Cooldown timer effect
  useEffect(() => {
    if (!gameState.cooldownEndTime) return;

    const checkCooldown = setInterval(() => {
      if (Date.now() >= gameState.cooldownEndTime!) {
        setGameState(prev => ({ ...prev, cooldownEndTime: null }));
        setLocalData(prev => {
          const updated = { ...prev, cooldownEndTime: null };
          saveLocalData(updated);
          return updated;
        });
      }
    }, 1000);

    return () => clearInterval(checkCooldown);
  }, [gameState.cooldownEndTime]);

  const handleWrongAnswer = (state: GameState): GameState => {
    const newHearts = state.hearts - 1;

    if (newHearts <= 0) {
      // Game over - set cooldown
      const cooldownEnd = Date.now() + (30 * 60 * 1000); // 30 minutes
      setLocalData(prev => {
        const updated = {
          ...prev,
          cooldownEndTime: cooldownEnd,
          gamesPlayed: prev.gamesPlayed + 1,
        };
        saveLocalData(updated);
        return updated;
      });

      return {
        ...state,
        mode: 'gameover',
        hearts: 0,
        cooldownEndTime: cooldownEnd,
        lastAnswerCorrect: false,
        correctInARow: 0,
      };
    }

    return {
      ...state,
      hearts: newHearts,
      lastAnswerCorrect: false,
      correctInARow: 0,
      showingHeartLoss: true,
    };
  };

  const startGame = (tier: number) => {
    const questions = getRandomQuestions(tier, 50, localData.questionsSeenIds);
    const shuffledQuestions = questions.map(q => shuffleAnswers(q));

    if (shuffledQuestions.length === 0) {
      alert('No questions available for this tier!');
      return;
    }

    setGameState({
      ...initialGameState,
      mode: 'playing',
      tier: tier as 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10,
      currentQuestion: shuffledQuestions[0],
      questionsThisGame: shuffledQuestions,
      timeRemaining: TIER_TIMES[tier],
    });
    setCharacterAnimation('idle');
  };

  const selectAnswer = (answerIndex: number) => {
    if (gameState.mode !== 'playing' || !gameState.currentQuestion) return;

    const isCorrect = answerIndex === gameState.currentQuestion.correctIndex;

    if (isCorrect) {
      // Correct answer
      setCharacterAnimation('bounce');
      setTimeout(() => setCharacterAnimation('idle'), 500);

      const newStreak = gameState.streak + 1;
      const newPoints = gameState.points + 10;
      const newCorrectInARow = gameState.correctInARow + 1;

      // Check for heart recovery (3 correct after losing a heart)
      let newHearts = gameState.hearts;
      let resetCorrectInARow = newCorrectInARow;
      if (newCorrectInARow >= 3 && gameState.hearts < 3) {
        newHearts = Math.min(3, gameState.hearts + 1);
        resetCorrectInARow = 0;
      }

      // Check for milestone
      let showMilestone = false;
      let milestoneMsg = '';
      if (STREAK_MILESTONES[newStreak]) {
        showMilestone = true;
        milestoneMsg = STREAK_MILESTONES[newStreak];
        setCharacterAnimation('celebrate');
        setTimeout(() => setCharacterAnimation('idle'), 1500);
      }

      // Update local data
      setLocalData(prev => {
        const bestStreak = prev.bestStreakPerTier[gameState.tier] || 0;
        const updated = {
          ...prev,
          bestStreakPerTier: {
            ...prev.bestStreakPerTier,
            [gameState.tier]: Math.max(bestStreak, newStreak),
          },
          totalPoints: prev.totalPoints + 10,
          totalCorrect: prev.totalCorrect + 1,
          totalAnswered: prev.totalAnswered + 1,
          questionsSeenIds: [...prev.questionsSeenIds, gameState.currentQuestion!.id],
        };

        // Check if tier 6+ should be unlocked
        if (gameState.tier === 5 && newStreak >= 10 && !prev.tiersUnlocked.includes(6)) {
          updated.tiersUnlocked = [...prev.tiersUnlocked, 6, 7, 8, 9, 10];
        }

        saveLocalData(updated);
        return updated;
      });

      // Move to next question
      const nextIndex = gameState.currentQuestionIndex + 1;
      if (nextIndex >= gameState.questionsThisGame.length) {
        // Ran out of questions - shouldn't happen with 50 questions
        setGameState(prev => ({ ...prev, mode: 'gameover' }));
        return;
      }

      setGameState(prev => ({
        ...prev,
        streak: newStreak,
        points: newPoints,
        hearts: newHearts,
        correctInARow: resetCorrectInARow,
        currentQuestionIndex: nextIndex,
        currentQuestion: prev.questionsThisGame[nextIndex],
        timeRemaining: TIER_TIMES[prev.tier],
        lastAnswerCorrect: true,
        showingMilestone: showMilestone,
        milestoneMessage: milestoneMsg,
      }));

      if (showMilestone) {
        setTimeout(() => {
          setGameState(prev => ({ ...prev, showingMilestone: false }));
        }, 2000);
      }

    } else {
      // Wrong answer
      setCharacterAnimation('shake');
      setTimeout(() => setCharacterAnimation('idle'), 500);

      setLocalData(prev => {
        const updated = {
          ...prev,
          totalAnswered: prev.totalAnswered + 1,
        };
        saveLocalData(updated);
        return updated;
      });

      setGameState(prev => {
        const newState = handleWrongAnswer(prev);

        if (newState.mode === 'gameover') {
          return newState;
        }

        // Show heart loss animation then continue
        setTimeout(() => {
          setGameState(p => ({ ...p, showingHeartLoss: false }));
        }, 1500);

        // Move to next question after wrong answer
        const nextIndex = prev.currentQuestionIndex + 1;
        return {
          ...newState,
          currentQuestionIndex: nextIndex,
          currentQuestion: prev.questionsThisGame[nextIndex] || null,
          timeRemaining: TIER_TIMES[prev.tier],
        };
      });
    }
  };

  const formatCooldown = (endTime: number) => {
    const remaining = Math.max(0, endTime - Date.now());
    const minutes = Math.floor(remaining / 60000);
    const seconds = Math.floor((remaining % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  // Check if in cooldown
  const isInCooldown = gameState.cooldownEndTime && gameState.cooldownEndTime > Date.now();

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-4 font-sans">
      {/* Menu Screen */}
      {gameState.mode === 'menu' && (
        <div className="w-full max-w-md text-center">
          {/* Character */}
          <div className="mb-8">
            <div className="w-32 h-32 mx-auto bg-gradient-to-b from-orange-400 to-yellow-500 rounded-full flex items-center justify-center text-6xl">
              🔭
            </div>
          </div>

          {/* Title */}
          <h1 className="text-5xl font-bold mb-2" style={{ fontFamily: 'Cooper Black, serif' }}>
            PTOLEMY
          </h1>
          <p className="text-gray-500 mb-8">The Science Quiz</p>

          {/* Cooldown message */}
          {isInCooldown && (
            <div className="mb-6 p-4 bg-gray-100 rounded-xl">
              <p className="text-gray-600 mb-2">Rest your mind...</p>
              <p className="text-2xl font-mono font-bold">
                {formatCooldown(gameState.cooldownEndTime!)}
              </p>
            </div>
          )}

          {/* Tier Selection */}
          <div className="space-y-3">
            <p className="text-sm text-gray-500 mb-4">Select your tier:</p>

            {[1, 2, 3, 4, 5].map(tier => (
              <button
                key={tier}
                onClick={() => !isInCooldown && startGame(tier)}
                disabled={isInCooldown as boolean}
                className={`w-full p-4 rounded-xl text-left transition-all ${
                  isInCooldown
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-gray-100 hover:bg-gray-200 active:scale-98'
                }`}
              >
                <div className="flex justify-between items-center">
                  <div>
                    <span className="font-bold">Tier {tier}</span>
                    <span className="mx-2">·</span>
                    <span className="text-orange-500">{TIER_NAMES[tier]}</span>
                  </div>
                  <div className="text-sm text-gray-400">
                    Best: {localData.bestStreakPerTier[tier] || 0}
                  </div>
                </div>
              </button>
            ))}

            {/* Locked tiers */}
            {!localData.tiersUnlocked.includes(6) && (
              <div className="mt-6 p-4 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200">
                <p className="text-gray-400 text-sm">
                  🔒 Tiers 6-10 unlock after streak 10+ on Tier 5
                </p>
              </div>
            )}

            {localData.tiersUnlocked.includes(6) && (
              <>
                <div className="h-px bg-gray-200 my-4" />
                {[6, 7, 8, 9, 10].map(tier => (
                  <button
                    key={tier}
                    onClick={() => !isInCooldown && startGame(tier)}
                    disabled={isInCooldown as boolean}
                    className={`w-full p-4 rounded-xl text-left transition-all ${
                      isInCooldown
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        : 'bg-gradient-to-r from-orange-50 to-yellow-50 hover:from-orange-100 hover:to-yellow-100'
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <span className="font-bold">Tier {tier}</span>
                        <span className="mx-2">·</span>
                        <span className="text-orange-600">{TIER_NAMES[tier]}</span>
                      </div>
                      <div className="text-sm text-gray-400">
                        Best: {localData.bestStreakPerTier[tier] || 0}
                      </div>
                    </div>
                  </button>
                ))}
              </>
            )}
          </div>

          {/* Stats */}
          <div className="mt-8 text-sm text-gray-400">
            Games played: {localData.gamesPlayed} ·
            Accuracy: {localData.totalAnswered > 0
              ? Math.round((localData.totalCorrect / localData.totalAnswered) * 100)
              : 0}%
          </div>
        </div>
      )}

      {/* Playing Screen */}
      {gameState.mode === 'playing' && gameState.currentQuestion && (
        <div className="w-full max-w-md">
          {/* Stats Bar */}
          <div className="flex justify-between items-center mb-6">
            {/* Hearts */}
            <div className="flex gap-1">
              {[1, 2, 3].map(i => (
                <span
                  key={i}
                  className={`text-2xl transition-all ${
                    i <= gameState.hearts ? 'opacity-100' : 'opacity-20'
                  }`}
                >
                  ❤️
                </span>
              ))}
            </div>

            {/* Streak with fire */}
            <div className="flex items-center gap-2">
              <span className={`text-2xl ${gameState.streak > 0 ? 'animate-pulse' : ''}`}>
                🔥
              </span>
              <span className="text-2xl font-bold font-mono">
                {gameState.streak}
              </span>
            </div>

            {/* Tier indicator */}
            <div className="text-sm text-gray-400">
              Tier {gameState.tier} · {TIER_NAMES[gameState.tier]}
            </div>
          </div>

          {/* Timer Bar */}
          <div className="h-2 bg-gray-200 rounded-full mb-6 overflow-hidden">
            <div
              className={`h-full transition-all duration-1000 ease-linear rounded-full ${
                gameState.timeRemaining <= 5 ? 'bg-red-500' : 'bg-orange-400'
              }`}
              style={{
                width: `${(gameState.timeRemaining / TIER_TIMES[gameState.tier]) * 100}%`
              }}
            />
          </div>

          {/* Character */}
          <div className={`w-20 h-20 mx-auto mb-6 bg-gradient-to-b from-orange-400 to-yellow-500 rounded-full flex items-center justify-center text-4xl transition-transform ${
            characterAnimation === 'bounce' ? 'animate-bounce' : ''
          } ${
            characterAnimation === 'shake' ? 'animate-shake' : ''
          } ${
            characterAnimation === 'celebrate' ? 'animate-spin' : ''
          }`}>
            🔭
          </div>

          {/* Milestone message */}
          {gameState.showingMilestone && (
            <div className="text-center mb-4 animate-fade-in">
              <p className="text-orange-500 italic">&quot;{gameState.milestoneMessage}&quot;</p>
            </div>
          )}

          {/* Question */}
          <div className="bg-gray-50 rounded-2xl p-6 mb-6">
            <p className="text-lg text-center font-medium">
              {gameState.currentQuestion.question}
            </p>
          </div>

          {/* Answer Buttons */}
          <div className="grid grid-cols-1 gap-3">
            {gameState.currentQuestion.answers.map((answer, index) => (
              <button
                key={index}
                onClick={() => selectAnswer(index)}
                className="w-full p-4 bg-white border-2 border-gray-200 rounded-xl text-left hover:border-orange-400 hover:bg-orange-50 active:scale-98 transition-all"
              >
                <span className="font-medium">{answer}</span>
              </button>
            ))}
          </div>

          {/* Points */}
          <div className="mt-6 text-center text-sm text-gray-400">
            {gameState.points} points
          </div>
        </div>
      )}

      {/* Heart Loss Overlay */}
      {gameState.showingHeartLoss && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 animate-fade-in">
          <div className="text-8xl animate-ping">💔</div>
        </div>
      )}

      {/* Game Over Screen */}
      {gameState.mode === 'gameover' && (
        <div className="w-full max-w-md text-center">
          <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-b from-gray-300 to-gray-400 rounded-full flex items-center justify-center text-5xl">
            😴
          </div>

          <h2 className="text-3xl font-bold mb-2" style={{ fontFamily: 'Cooper Black, serif' }}>
            Game Over
          </h2>

          <div className="my-8">
            <p className="text-gray-500 mb-2">Final Streak</p>
            <p className="text-5xl font-bold font-mono text-orange-500">
              {gameState.streak}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="bg-gray-50 rounded-xl p-4">
              <p className="text-sm text-gray-400">Points</p>
              <p className="text-xl font-bold">{gameState.points}</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-4">
              <p className="text-sm text-gray-400">Tier</p>
              <p className="text-xl font-bold">{TIER_NAMES[gameState.tier]}</p>
            </div>
          </div>

          {gameState.cooldownEndTime && (
            <div className="mb-6 p-4 bg-orange-50 rounded-xl">
              <p className="text-gray-600 mb-2">Play again in:</p>
              <p className="text-3xl font-mono font-bold text-orange-500">
                {formatCooldown(gameState.cooldownEndTime)}
              </p>
            </div>
          )}

          <button
            onClick={() => setGameState({ ...initialGameState, cooldownEndTime: gameState.cooldownEndTime })}
            className="w-full p-4 bg-gray-100 rounded-xl font-medium hover:bg-gray-200 transition-all"
          >
            Back to Menu
          </button>
        </div>
      )}
    </div>
  );
}

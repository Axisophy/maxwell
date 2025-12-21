'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
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

// Character mood type
type CharacterMood = 'happy' | 'thinking' | 'excited' | 'sad';

export default function PtolemyGame() {
  const [gameState, setGameState] = useState<GameState>(initialGameState);
  const [localData, setLocalData] = useState<LocalPtolemyData>(getDefaultLocalData());
  const [characterMood, setCharacterMood] = useState<CharacterMood>('happy');
  const [isAnimating, setIsAnimating] = useState(false);

  // Load local data on mount
  useEffect(() => {
    const data = loadLocalData();
    setLocalData(data);
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

  // Handle wrong answer
  const handleWrongAnswer = useCallback((prev: GameState): GameState => {
    const newHearts = prev.hearts - 1;
    
    // Trigger sad mood
    setCharacterMood('sad');
    setIsAnimating(true);
    setTimeout(() => {
      setIsAnimating(false);
      setCharacterMood('thinking');
    }, 1500);

    if (newHearts <= 0) {
      // Game over
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
          // Unlock tiers 6-10 if achieved streak 10+ on tier 5
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
        showingHeartLoss: true,
        cooldownEndTime: null, // No cooldown
      };
    }

    // Lost a heart but still alive
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
    const questions = getRandomQuestions(tier, 20);
    const firstQuestion = questions[0];
    
    setCharacterMood('excited');
    setIsAnimating(true);
    setTimeout(() => {
      setIsAnimating(false);
      setCharacterMood('thinking');
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

  // Select answer
  const selectAnswer = useCallback((answerIndex: number) => {
    if (!gameState.currentQuestion) return;

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
      // Correct answer!
      const newStreak = gameState.streak + 1;
      const basePoints = gameState.tier * 10;
      const streakBonus = Math.floor(newStreak / 5) * 5;
      const pointsEarned = basePoints + streakBonus;
      
      // Check for milestone
      const milestone = STREAK_MILESTONES.find(m => m.streak === newStreak);
      const earnedHeart = milestone && gameState.hearts < 3;
      
      // Set excited mood
      setCharacterMood('excited');
      setIsAnimating(true);
      setTimeout(() => {
        setIsAnimating(false);
        setCharacterMood('thinking');
      }, 600);

      // Move to next question
      const nextIndex = gameState.currentQuestionIndex + 1;
      
      if (nextIndex >= gameState.questionsThisGame.length) {
        // No more questions - get more
        const moreQuestions = getRandomQuestions(gameState.tier, 20);
        const nextQuestion = moreQuestions[0];
        
        setGameState(prev => ({
          ...prev,
          streak: newStreak,
          points: prev.points + pointsEarned,
          hearts: earnedHeart ? Math.min(3, prev.hearts + 1) : prev.hearts,
          questionsThisGame: moreQuestions,
          currentQuestion: shuffleAnswers(nextQuestion),
          currentQuestionIndex: 0,
          timeRemaining: TIER_TIMES[prev.tier],
          lastAnswerCorrect: true,
          showingMilestone: !!milestone,
          milestoneMessage: milestone?.message || '',
        }));
      } else {
        const nextQuestion = gameState.questionsThisGame[nextIndex];
        
        setGameState(prev => ({
          ...prev,
          streak: newStreak,
          points: prev.points + pointsEarned,
          hearts: earnedHeart ? Math.min(3, prev.hearts + 1) : prev.hearts,
          currentQuestion: shuffleAnswers(nextQuestion),
          currentQuestionIndex: nextIndex,
          timeRemaining: TIER_TIMES[prev.tier],
          lastAnswerCorrect: true,
          showingMilestone: !!milestone,
          milestoneMessage: milestone?.message || '',
        }));
      }

      // Clear milestone message after delay
      if (milestone) {
        setTimeout(() => {
          setGameState(prev => ({ ...prev, showingMilestone: false }));
        }, 2000);
      }
    } else {
      // Wrong answer
      setGameState(prev => handleWrongAnswer(prev));
    }

    // Clear heart loss animation
    setTimeout(() => {
      setGameState(prev => ({ ...prev, showingHeartLoss: false }));
    }, 800);
  }, [gameState, handleWrongAnswer]);

  // Get timer bar color based on time remaining
  const getTimerColor = () => {
    const percentage = gameState.timeRemaining / TIER_TIMES[gameState.tier];
    if (percentage > 0.5) return 'bg-emerald-500';
    if (percentage > 0.25) return 'bg-amber-500';
    return 'bg-red-500';
  };

  // Get character filter based on mood
  const getCharacterStyle = () => {
    const baseStyle = {
      transition: 'all 0.3s ease',
    };
    
    switch (characterMood) {
      case 'excited':
        return { ...baseStyle, filter: 'brightness(1.1)', transform: isAnimating ? 'scale(1.1)' : 'scale(1)' };
      case 'sad':
        return { ...baseStyle, filter: 'brightness(0.8) saturate(0.7)', transform: isAnimating ? 'scale(0.9)' : 'scale(1)' };
      case 'thinking':
        return { ...baseStyle, filter: 'brightness(1)', transform: 'scale(1)' };
      default:
        return baseStyle;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-orange-50 flex flex-col items-center justify-center p-4">
      {/* Menu Screen */}
      {gameState.mode === 'menu' && (
        <div className="w-full max-w-md text-center">
          {/* Character */}
          <div className="mb-6">
            <div className="w-32 h-32 mx-auto relative">
              <Image
                src="/images/ptolemy-character.png"
                alt="Ptolemy"
                width={128}
                height={128}
                className="rounded-full"
                style={getCharacterStyle()}
                priority
              />
            </div>
          </div>

          {/* Title - Strelka Ultra */}
          <h1 
            className="text-5xl mb-2 text-amber-900"
            style={{ fontFamily: '"strelka", sans-serif', fontWeight: 800 }}
          >
            PTOLEMY
          </h1>
          <p className="text-amber-700/70 mb-8">The Science Quiz</p>

          {/* Tier Selection */}
          <div className="space-y-3">
            <p className="text-sm text-amber-700/60 mb-4">Select your tier:</p>
            
            {([1, 2, 3, 4, 5] as const).map(tier => (
              <button
                key={tier}
                onClick={() => startGame(tier)}
                className="w-full p-4 rounded-xl text-left transition-all bg-white/80 hover:bg-white border-2 border-amber-200 hover:border-amber-400 active:scale-[0.98]"
              >
                <div className="flex justify-between items-center">
                  <div>
                    <span 
                      className="font-bold text-amber-900"
                      style={{ fontFamily: '"strelka", sans-serif', fontWeight: 800 }}
                    >
                      Tier {tier}
                    </span>
                    <span className="mx-2 text-amber-400">·</span>
                    <span 
                      className="text-orange-600"
                      style={{ fontFamily: '"strelka", sans-serif', fontWeight: 800 }}
                    >
                      {TIER_NAMES[tier]}
                    </span>
                  </div>
                  <div 
                    className="text-sm text-amber-600/60"
                    style={{ fontFamily: '"Input Mono", monospace' }}
                  >
                    Best: {localData.bestStreakPerTier[tier] || 0}
                  </div>
                </div>
              </button>
            ))}

            {/* Locked tiers */}
            {!localData.tiersUnlocked.includes(6) && (
              <div className="mt-6 p-4 bg-amber-100/50 rounded-xl border-2 border-dashed border-amber-300">
                <p className="text-amber-600/70 text-sm">
                  🔒 Tiers 6-10 unlock after streak 10+ on Tier 5
                </p>
              </div>
            )}

            {localData.tiersUnlocked.includes(6) && (
              <>
                <div className="h-px bg-amber-200 my-4" />
                {([6, 7, 8, 9, 10] as const).map(tier => (
                  <button
                    key={tier}
                    onClick={() => startGame(tier)}
                    className="w-full p-4 rounded-xl text-left transition-all bg-gradient-to-r from-orange-100 to-amber-100 hover:from-orange-200 hover:to-amber-200 border-2 border-orange-300 hover:border-orange-400"
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <span 
                          className="font-bold text-orange-800"
                          style={{ fontFamily: '"strelka", sans-serif', fontWeight: 800 }}
                        >
                          Tier {tier}
                        </span>
                        <span className="mx-2 text-orange-400">·</span>
                        <span 
                          className="text-orange-700"
                          style={{ fontFamily: '"strelka", sans-serif', fontWeight: 800 }}
                        >
                          {TIER_NAMES[tier]}
                        </span>
                      </div>
                      <div 
                        className="text-sm text-orange-500/60"
                        style={{ fontFamily: '"Input Mono", monospace' }}
                      >
                        Best: {localData.bestStreakPerTier[tier] || 0}
                      </div>
                    </div>
                  </button>
                ))}
              </>
            )}
          </div>

          {/* Stats */}
          <div 
            className="mt-8 text-sm text-amber-600/50"
            style={{ fontFamily: '"Input Mono", monospace' }}
          >
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
                    i <= gameState.hearts ? 'opacity-100 scale-100' : 'opacity-20 scale-90'
                  }`}
                >
                  ❤️
                </span>
              ))}
            </div>

            {/* Streak with fire */}
            <div className="flex items-center gap-2">
              <span className={`text-2xl ${gameState.streak > 0 ? 'animate-pulse' : 'opacity-50'}`}>
                🔥
              </span>
              <span 
                className="text-2xl font-bold text-amber-800"
                style={{ fontFamily: '"Input Mono", monospace' }}
              >
                {gameState.streak}
              </span>
            </div>

            {/* Tier indicator */}
            <div 
              className="text-sm text-amber-600/70"
              style={{ fontFamily: '"strelka", sans-serif', fontWeight: 800 }}
            >
              {TIER_NAMES[gameState.tier]}
            </div>
          </div>

          {/* Timer Bar */}
          <div className="h-3 bg-amber-200 rounded-full mb-6 overflow-hidden">
            <div 
              className={`h-full transition-all duration-1000 ease-linear rounded-full ${getTimerColor()}`}
              style={{ 
                width: `${(gameState.timeRemaining / TIER_TIMES[gameState.tier]) * 100}%` 
              }}
            />
          </div>

          {/* Character */}
          <div className="w-24 h-24 mx-auto mb-4 relative">
            <Image
              src="/images/ptolemy-character.png"
              alt="Ptolemy"
              width={96}
              height={96}
              className="rounded-full"
              style={getCharacterStyle()}
            />
          </div>

          {/* Milestone message */}
          {gameState.showingMilestone && (
            <div className="text-center mb-4 animate-bounce">
              <p className="text-orange-600 italic font-medium">"{gameState.milestoneMessage}"</p>
              {gameState.hearts < 3 && (
                <p className="text-emerald-600 text-sm mt-1">+1 ❤️ restored!</p>
              )}
            </div>
          )}

          {/* Question */}
          <div className="bg-white/90 rounded-2xl p-6 mb-6 shadow-sm border border-amber-100">
            <p className="text-lg text-center font-medium text-amber-900">
              {gameState.currentQuestion.question}
            </p>
          </div>

          {/* Answer Buttons */}
          <div className="grid grid-cols-1 gap-3">
            {gameState.currentQuestion.answers.map((answer, index) => (
              <button
                key={index}
                onClick={() => selectAnswer(index)}
                className="w-full p-4 bg-white/90 border-2 border-amber-200 rounded-xl text-left hover:border-orange-400 hover:bg-orange-50 active:scale-[0.98] transition-all"
              >
                <span className="font-medium text-amber-800">{answer}</span>
              </button>
            ))}
          </div>

          {/* Points */}
          <div 
            className="mt-6 text-center text-sm text-amber-600/50"
            style={{ fontFamily: '"Input Mono", monospace' }}
          >
            {gameState.points} points
          </div>
        </div>
      )}

      {/* Heart Loss Overlay */}
      {gameState.showingHeartLoss && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 animate-pulse">
          <div className="text-8xl">💔</div>
        </div>
      )}

      {/* Game Over Screen */}
      {gameState.mode === 'gameover' && (
        <div className="w-full max-w-md text-center">
          <div className="w-24 h-24 mx-auto mb-6 relative">
            <Image
              src="/images/ptolemy-character.png"
              alt="Ptolemy"
              width={96}
              height={96}
              className="rounded-full opacity-60"
              style={{ filter: 'grayscale(50%)' }}
            />
          </div>

          <h2 
            className="text-3xl mb-2 text-amber-800"
            style={{ fontFamily: '"strelka", sans-serif', fontWeight: 800 }}
          >
            Game Over
          </h2>

          <div className="my-8">
            <p className="text-amber-600/60 mb-2">Final Streak</p>
            <p 
              className="text-5xl font-bold text-orange-600"
              style={{ fontFamily: '"Input Mono", monospace' }}
            >
              {gameState.streak}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="bg-white/80 rounded-xl p-4 border border-amber-200">
              <p className="text-sm text-amber-600/60">Points</p>
              <p 
                className="text-xl font-bold text-amber-800"
                style={{ fontFamily: '"Input Mono", monospace' }}
              >
                {gameState.points}
              </p>
            </div>
            <div className="bg-white/80 rounded-xl p-4 border border-amber-200">
              <p className="text-sm text-amber-600/60">Tier</p>
              <p 
                className="text-xl font-bold text-amber-800"
                style={{ fontFamily: '"strelka", sans-serif', fontWeight: 800 }}
              >
                {TIER_NAMES[gameState.tier]}
              </p>
            </div>
          </div>

          <button
            onClick={() => setGameState(initialGameState)}
            className="w-full p-4 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-xl font-medium hover:from-amber-600 hover:to-orange-600 transition-all active:scale-[0.98]"
            style={{ fontFamily: '"strelka", sans-serif', fontWeight: 800 }}
          >
            Play Again
          </button>
        </div>
      )}
    </div>
  );
}

'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';

// ============================================
// GAME THEORY HANDHELD - FUNCTIONAL PROTOTYPE
// ============================================
// 
// A virtual retro LCD handheld game (Tiger Electronics / Game & Watch)
// that teaches fundamental game theory through repeated games.
//
// Features:
// - Prisoner's Dilemma with multiple opponent personalities
// - Authentic LCD segment display aesthetic
// - Physical handheld device frame
// - Blippy sound effects
// - Score tracking across rounds
// - Opponent personality reveal
//
// Styling: Beige plastic case, green-grey LCD, worn stickers
// ============================================

// ---- Types ----

type Choice = 'cooperate' | 'defect';
type OpponentType = 'copycat' | 'grudger' | 'random' | 'sucker' | 'devil' | 'prober' | 'pavlov';

interface GameResult {
  playerChoice: Choice;
  opponentChoice: Choice;
  playerScore: number;
  opponentScore: number;
}

interface OpponentInfo {
  name: string;
  description: string;
  strategy: string;
}

// ---- Constants ----

// Prisoner's Dilemma payoff matrix
// [player cooperate, opponent cooperate] = 3, 3 (mutual cooperation)
// [player cooperate, opponent defect] = 0, 5 (sucker's payoff)
// [player defect, opponent cooperate] = 5, 0 (temptation)
// [player defect, opponent defect] = 1, 1 (mutual defection)
const PAYOFF_MATRIX: Record<Choice, Record<Choice, [number, number]>> = {
  cooperate: {
    cooperate: [3, 3],
    defect: [0, 5],
  },
  defect: {
    cooperate: [5, 0],
    defect: [1, 1],
  },
};

const OPPONENTS: Record<OpponentType, OpponentInfo> = {
  copycat: {
    name: 'COPYCAT',
    description: 'Tit-for-tat strategy',
    strategy: 'Cooperates first, then copies your last move',
  },
  grudger: {
    name: 'GRUDGER',
    description: 'Unforgiving',
    strategy: 'Cooperates until betrayed, then always defects',
  },
  random: {
    name: 'RANDOM',
    description: 'Chaos agent',
    strategy: '50/50 random choice each round',
  },
  sucker: {
    name: 'SUCKER',
    description: 'Always trusting',
    strategy: 'Always cooperates no matter what',
  },
  devil: {
    name: 'DEVIL',
    description: 'Pure evil',
    strategy: 'Always defects no matter what',
  },
  prober: {
    name: 'PROBER',
    description: 'Tests your limits',
    strategy: 'Cooperates, but occasionally defects to test you',
  },
  pavlov: {
    name: 'PAVLOV',
    description: 'Win-stay, lose-shift',
    strategy: 'Repeats choice if it worked, switches if it didn\'t',
  },
};

const ROUNDS_PER_GAME = 10;

// ---- Sound Effects ----

function playSound(type: 'select' | 'score' | 'win' | 'lose' | 'start') {
  if (typeof window === 'undefined') return;
  
  try {
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    
    oscillator.type = 'square';
    gainNode.gain.value = 0.1;
    
    const now = audioContext.currentTime;
    let duration = 0.1;
    
    switch (type) {
      case 'select':
        oscillator.frequency.setValueAtTime(800, now);
        gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
        duration = 0.1;
        break;
      case 'score':
        oscillator.frequency.setValueAtTime(600, now);
        oscillator.frequency.setValueAtTime(900, now + 0.1);
        gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.2);
        duration = 0.2;
        break;
      case 'win':
        oscillator.frequency.setValueAtTime(523, now);
        oscillator.frequency.setValueAtTime(659, now + 0.15);
        oscillator.frequency.setValueAtTime(784, now + 0.3);
        gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.5);
        duration = 0.5;
        break;
      case 'lose':
        oscillator.frequency.setValueAtTime(400, now);
        oscillator.frequency.setValueAtTime(300, now + 0.2);
        gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.4);
        duration = 0.4;
        break;
      case 'start':
        oscillator.frequency.setValueAtTime(440, now);
        oscillator.frequency.setValueAtTime(550, now + 0.1);
        oscillator.frequency.setValueAtTime(660, now + 0.2);
        gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.3);
        duration = 0.3;
        break;
    }
    
    // Start MUST come before stop
    oscillator.start(now);
    oscillator.stop(now + duration);
    
    // Clean up audio context after sound finishes
    setTimeout(() => {
      audioContext.close();
    }, duration * 1000 + 100);
    
  } catch (e) {
    // Silently fail if audio doesn't work
    console.log('Audio not available');
  }
}

// ---- Opponent AI ----

function getOpponentChoice(
  type: OpponentType,
  history: GameResult[],
  wasBetrayed: boolean
): Choice {
  const lastResult = history[history.length - 1];
  
  switch (type) {
    case 'copycat':
      // Tit-for-tat: cooperate first, then copy opponent's last move
      return lastResult ? lastResult.playerChoice : 'cooperate';
      
    case 'grudger':
      // Cooperate until betrayed, then always defect
      return wasBetrayed ? 'defect' : 'cooperate';
      
    case 'random':
      return Math.random() < 0.5 ? 'cooperate' : 'defect';
      
    case 'sucker':
      return 'cooperate';
      
    case 'devil':
      return 'defect';
      
    case 'prober':
      // Mostly tit-for-tat, but occasionally probes with defection
      if (!lastResult) return 'cooperate';
      if (Math.random() < 0.1) return 'defect'; // 10% probe
      return lastResult.playerChoice;
      
    case 'pavlov':
      // Win-stay, lose-shift
      if (!lastResult) return 'cooperate';
      const gotGoodScore = lastResult.opponentScore >= 3;
      return gotGoodScore ? lastResult.opponentChoice : 
             (lastResult.opponentChoice === 'cooperate' ? 'defect' : 'cooperate');
      
    default:
      return 'cooperate';
  }
}

// ---- LCD Digit Component ----

interface LCDDigitProps {
  value: number;
  ghost?: boolean;
}

function LCDDigit({ value, ghost = false }: LCDDigitProps) {
  // 7-segment display mapping
  const segments: Record<number, boolean[]> = {
    0: [true, true, true, true, true, true, false],
    1: [false, true, true, false, false, false, false],
    2: [true, true, false, true, true, false, true],
    3: [true, true, true, true, false, false, true],
    4: [false, true, true, false, false, true, true],
    5: [true, false, true, true, false, true, true],
    6: [true, false, true, true, true, true, true],
    7: [true, true, true, false, false, false, false],
    8: [true, true, true, true, true, true, true],
    9: [true, true, true, true, false, true, true],
  };
  
  const active = segments[value] || segments[0];
  
  return (
    <svg viewBox="0 0 30 50" className="lcd-digit">
      {/* Segment A (top) */}
      <polygon 
        points="4,2 26,2 23,6 7,6" 
        className={`segment ${active[0] ? 'on' : ''} ${ghost ? 'ghost' : ''}`}
      />
      {/* Segment B (top right) */}
      <polygon 
        points="25,4 28,7 26,23 23,20 23,8" 
        className={`segment ${active[1] ? 'on' : ''} ${ghost ? 'ghost' : ''}`}
      />
      {/* Segment C (bottom right) */}
      <polygon 
        points="25,27 28,30 26,46 23,43 23,30" 
        className={`segment ${active[2] ? 'on' : ''} ${ghost ? 'ghost' : ''}`}
      />
      {/* Segment D (bottom) */}
      <polygon 
        points="4,48 26,48 23,44 7,44" 
        className={`segment ${active[3] ? 'on' : ''} ${ghost ? 'ghost' : ''}`}
      />
      {/* Segment E (bottom left) */}
      <polygon 
        points="5,27 2,30 4,46 7,43 7,30" 
        className={`segment ${active[4] ? 'on' : ''} ${ghost ? 'ghost' : ''}`}
      />
      {/* Segment F (top left) */}
      <polygon 
        points="5,4 2,7 4,23 7,20 7,8" 
        className={`segment ${active[5] ? 'on' : ''} ${ghost ? 'ghost' : ''}`}
      />
      {/* Segment G (middle) */}
      <polygon 
        points="6,24 24,24 23,27 7,27 6,25" 
        className={`segment ${active[6] ? 'on' : ''} ${ghost ? 'ghost' : ''}`}
      />
    </svg>
  );
}

// ---- LCD Score Display ----

interface LCDScoreProps {
  value: number;
  digits?: number;
}

function LCDScore({ value, digits = 2 }: LCDScoreProps) {
  const str = String(value).padStart(digits, '0');
  return (
    <div className="lcd-score">
      {str.split('').map((d, i) => (
        <LCDDigit key={i} value={parseInt(d)} />
      ))}
    </div>
  );
}

// ---- Payoff Matrix Display ----

interface PayoffMatrixProps {
  playerChoice: Choice | null;
  opponentChoice: Choice | null;
  showResult: boolean;
}

function PayoffMatrix({ playerChoice, opponentChoice, showResult }: PayoffMatrixProps) {
  return (
    <div className="payoff-matrix">
      <div className="matrix-header">
        <span></span>
        <span className={`col-label ${opponentChoice === 'cooperate' && showResult ? 'highlight' : ''}`}>
          C
        </span>
        <span className={`col-label ${opponentChoice === 'defect' && showResult ? 'highlight' : ''}`}>
          D
        </span>
      </div>
      <div className="matrix-row">
        <span className={`row-label ${playerChoice === 'cooperate' ? 'highlight' : ''}`}>
          C
        </span>
        <span className={`cell ${playerChoice === 'cooperate' && opponentChoice === 'cooperate' && showResult ? 'active' : ''}`}>
          3,3
        </span>
        <span className={`cell ${playerChoice === 'cooperate' && opponentChoice === 'defect' && showResult ? 'active' : ''}`}>
          0,5
        </span>
      </div>
      <div className="matrix-row">
        <span className={`row-label ${playerChoice === 'defect' ? 'highlight' : ''}`}>
          D
        </span>
        <span className={`cell ${playerChoice === 'defect' && opponentChoice === 'cooperate' && showResult ? 'active' : ''}`}>
          5,0
        </span>
        <span className={`cell ${playerChoice === 'defect' && opponentChoice === 'defect' && showResult ? 'active' : ''}`}>
          1,1
        </span>
      </div>
    </div>
  );
}

// ---- Main Component ----

type GameState = 'title' | 'select-opponent' | 'playing' | 'round-result' | 'game-over';

export default function GameTheoryHandheld() {
  // ---- State ----
  const [gameState, setGameState] = useState<GameState>('title');
  const [opponent, setOpponent] = useState<OpponentType>('copycat');
  const [round, setRound] = useState(1);
  const [playerScore, setPlayerScore] = useState(0);
  const [opponentScore, setOpponentScore] = useState(0);
  const [history, setHistory] = useState<GameResult[]>([]);
  const [playerChoice, setPlayerChoice] = useState<Choice | null>(null);
  const [opponentChoice, setOpponentChoice] = useState<Choice | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [wasBetrayed, setWasBetrayed] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [selectedOpponentIndex, setSelectedOpponentIndex] = useState(0);
  const [autoAdvanceCountdown, setAutoAdvanceCountdown] = useState<number | null>(null);
  
  const opponentTypes: OpponentType[] = ['copycat', 'random', 'sucker', 'devil', 'grudger', 'prober', 'pavlov'];
  
  // ---- Sound wrapper ----
  const play = useCallback((type: Parameters<typeof playSound>[0]) => {
    if (soundEnabled) playSound(type);
  }, [soundEnabled]);
  
  // ---- Game Actions ----
  
  const startGame = useCallback(() => {
    play('start');
    setGameState('select-opponent');
    setSelectedOpponentIndex(0);
  }, [play]);
  
  const selectOpponent = useCallback((type: OpponentType) => {
    play('select');
    setOpponent(type);
    setRound(1);
    setPlayerScore(0);
    setOpponentScore(0);
    setHistory([]);
    setWasBetrayed(false);
    setPlayerChoice(null);
    setOpponentChoice(null);
    setShowResult(false);
    setGameState('playing');
  }, [play]);
  
  const makeChoice = useCallback((choice: Choice) => {
    if (gameState !== 'playing' || playerChoice !== null) return;
    
    play('select');
    setPlayerChoice(choice);
    
    // Get opponent's choice
    const oppChoice = getOpponentChoice(opponent, history, wasBetrayed);
    setOpponentChoice(oppChoice);
    
    // Track if player ever defected (for grudger)
    if (choice === 'defect' && !wasBetrayed) {
      setWasBetrayed(true);
    }
    
    // Calculate scores
    const [pScore, oScore] = PAYOFF_MATRIX[choice][oppChoice];
    
    // Show result after brief delay
    setTimeout(() => {
      setShowResult(true);
      play('score');
      
      // Update scores and history
      setPlayerScore(prev => prev + pScore);
      setOpponentScore(prev => prev + oScore);
      setHistory(prev => [...prev, {
        playerChoice: choice,
        opponentChoice: oppChoice,
        playerScore: pScore,
        opponentScore: oScore,
      }]);
      
      // Move to result state
      setTimeout(() => {
        if (round >= ROUNDS_PER_GAME) {
          setGameState('game-over');
          play(playerScore + pScore > opponentScore + oScore ? 'win' : 'lose');
        } else {
          setGameState('round-result');
          setAutoAdvanceCountdown(5); // Start 5 second countdown
        }
      }, 1000);
    }, 500);
  }, [gameState, playerChoice, opponent, history, wasBetrayed, round, play, playerScore, opponentScore]);
  
  const nextRound = useCallback(() => {
    play('select');
    setRound(prev => prev + 1);
    setPlayerChoice(null);
    setOpponentChoice(null);
    setShowResult(false);
    setAutoAdvanceCountdown(null);
    setGameState('playing');
  }, [play]);
  
  // ---- Auto-advance countdown ----
  useEffect(() => {
    if (autoAdvanceCountdown === null || gameState !== 'round-result') return;
    
    if (autoAdvanceCountdown <= 0) {
      nextRound();
      return;
    }
    
    const timer = setTimeout(() => {
      setAutoAdvanceCountdown(prev => prev !== null ? prev - 1 : null);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, [autoAdvanceCountdown, gameState, nextRound]);
  
  const playAgain = useCallback(() => {
    play('start');
    setGameState('select-opponent');
  }, [play]);
  
  const goToTitle = useCallback(() => {
    play('select');
    setGameState('title');
  }, [play]);
  
  // ---- Opponent selection navigation ----
  const navigateOpponent = useCallback((direction: 'up' | 'down') => {
    play('select');
    setSelectedOpponentIndex(prev => {
      if (direction === 'up') {
        return prev > 0 ? prev - 1 : opponentTypes.length - 1;
      } else {
        return prev < opponentTypes.length - 1 ? prev + 1 : 0;
      }
    });
  }, [play, opponentTypes.length]);

  return (
    <div className="handheld-container">
      {/* Physical handheld frame */}
      <div className="handheld-body">
        
        {/* Brand sticker */}
        <div className="brand-sticker">
          <span className="brand-name">GAME THEORY</span>
          <span className="brand-sub">TRAINER</span>
        </div>
        
        {/* LCD Screen */}
        <div className="lcd-bezel">
          <div className="lcd-screen">
            
            {/* Title Screen */}
            {gameState === 'title' && (
              <div className="screen-content title-screen">
                <div className="title-logo">
                  <span className="title-main">PRISONER'S</span>
                  <span className="title-main">DILEMMA</span>
                </div>
                <div className="title-prompt blink">PRESS START</div>
              </div>
            )}
            
            {/* Opponent Selection */}
            {gameState === 'select-opponent' && (
              <div className="screen-content select-screen">
                <div className="select-header">SELECT OPPONENT</div>
                <div className="opponent-list">
                  {opponentTypes.map((type, i) => (
                    <div 
                      key={type}
                      className={`opponent-option ${i === selectedOpponentIndex ? 'selected' : ''}`}
                    >
                      <span className="select-arrow">{i === selectedOpponentIndex ? '►' : ' '}</span>
                      <span className="opponent-name">{OPPONENTS[type].name}</span>
                    </div>
                  ))}
                </div>
                <div className="action-prompt blink">PRESS A OR START</div>
              </div>
            )}
            
            {/* Playing / Round Result */}
            {(gameState === 'playing' || gameState === 'round-result') && (
              <div className="screen-content game-screen">
                {/* Header */}
                <div className="game-header">
                  <span className="round-display">RND {round}/{ROUNDS_PER_GAME}</span>
                  <span className="vs-display">VS {OPPONENTS[opponent].name}</span>
                </div>
                
                {/* Scores */}
                <div className="scores-row">
                  <div className="score-box">
                    <span className="score-label">YOU</span>
                    <LCDScore value={playerScore} />
                  </div>
                  <div className="score-box">
                    <span className="score-label">CPU</span>
                    <LCDScore value={opponentScore} />
                  </div>
                </div>
                
                {/* Choice Display - More prominent */}
                <div className="choice-display">
                  <div className={`choice-box ${playerChoice ? 'chosen' : ''}`}>
                    <span className="choice-label">YOU</span>
                    <span className={`choice-value ${playerChoice === 'cooperate' ? 'cooperate' : ''} ${playerChoice === 'defect' ? 'defect' : ''}`}>
                      {playerChoice ? (playerChoice === 'cooperate' ? 'C' : 'D') : '?'}
                    </span>
                  </div>
                  
                  <span className="vs-symbol">VS</span>
                  
                  <div className={`choice-box ${showResult ? 'chosen' : ''} ${playerChoice && !showResult ? 'thinking' : ''}`}>
                    <span className="choice-label">CPU</span>
                    <span className={`choice-value ${showResult && opponentChoice === 'cooperate' ? 'cooperate' : ''} ${showResult && opponentChoice === 'defect' ? 'defect' : ''}`}>
                      {showResult ? (opponentChoice === 'cooperate' ? 'C' : 'D') : (playerChoice ? '...' : '?')}
                    </span>
                  </div>
                </div>
                
                {/* Result Display */}
                {showResult && (
                  <div className="result-display">
                    <span className="result-points">
                      +{PAYOFF_MATRIX[playerChoice!][opponentChoice!][0]} pts
                    </span>
                    <span className="result-outcome">
                      {playerChoice === 'cooperate' && opponentChoice === 'cooperate' && 'MUTUAL TRUST'}
                      {playerChoice === 'cooperate' && opponentChoice === 'defect' && 'BETRAYED!'}
                      {playerChoice === 'defect' && opponentChoice === 'cooperate' && 'EXPLOITED THEM'}
                      {playerChoice === 'defect' && opponentChoice === 'defect' && 'MUTUAL DISTRUST'}
                    </span>
                  </div>
                )}
                
                {/* Prompt */}
                {gameState === 'playing' && !playerChoice && (
                  <div className="action-prompt blink">
                    <span className="key-hint">A</span>=COOPERATE  <span className="key-hint">B</span>=DEFECT
                  </div>
                )}
                {gameState === 'playing' && playerChoice && !showResult && (
                  <div className="action-prompt">OPPONENT CHOOSING...</div>
                )}
                {gameState === 'round-result' && (
                  <div className="action-prompt countdown-prompt">
                    NEXT IN {autoAdvanceCountdown ?? '...'}s <span className="skip-hint">or press A/B</span>
                  </div>
                )}
              </div>
            )}
            
            {/* Game Over */}
            {gameState === 'game-over' && (
              <div className="screen-content gameover-screen">
                <div className="gameover-title">
                  {playerScore > opponentScore ? 'YOU WIN!' : 
                   playerScore < opponentScore ? 'YOU LOSE' : 'TIE GAME'}
                </div>
                <div className="final-scores">
                  <div className="final-score">
                    <span>YOU</span>
                    <LCDScore value={playerScore} />
                  </div>
                  <div className="final-score">
                    <span>CPU</span>
                    <LCDScore value={opponentScore} />
                  </div>
                </div>
                <div className="opponent-reveal">
                  <span className="reveal-label">OPPONENT WAS:</span>
                  <span className="reveal-name">{OPPONENTS[opponent].name}</span>
                  <span className="reveal-strategy">{OPPONENTS[opponent].strategy}</span>
                </div>
                <div className="action-prompt blink">PRESS START</div>
              </div>
            )}
            
          </div>
        </div>
        
        {/* Controls */}
        <div className="controls-section">
          
          {/* D-Pad */}
          <div className="dpad-container">
            <button 
              className="dpad-btn dpad-up"
              onClick={() => {
                if (gameState === 'select-opponent') navigateOpponent('up');
              }}
            >
              ▲
            </button>
            <button 
              className="dpad-btn dpad-left"
              onClick={() => {}}
            >
              ◄
            </button>
            <div className="dpad-center" />
            <button 
              className="dpad-btn dpad-right"
              onClick={() => {}}
            >
              ►
            </button>
            <button 
              className="dpad-btn dpad-down"
              onClick={() => {
                if (gameState === 'select-opponent') navigateOpponent('down');
              }}
            >
              ▼
            </button>
          </div>
          
          {/* Action Buttons */}
          <div className="action-buttons">
            <div className="button-group">
              <button 
                className="action-btn btn-b"
                onClick={() => {
                  if (gameState === 'playing') makeChoice('defect');
                  else if (gameState === 'round-result') nextRound();
                  else if (gameState === 'select-opponent') selectOpponent(opponentTypes[selectedOpponentIndex]);
                }}
              >
                B
              </button>
              <span className="btn-label">DEFECT</span>
            </div>
            <div className="button-group">
              <button 
                className="action-btn btn-a"
                onClick={() => {
                  if (gameState === 'playing') makeChoice('cooperate');
                  else if (gameState === 'round-result') nextRound();
                  else if (gameState === 'select-opponent') selectOpponent(opponentTypes[selectedOpponentIndex]);
                }}
              >
                A
              </button>
              <span className="btn-label">COOPERATE</span>
            </div>
          </div>
          
        </div>
        
        {/* Start/Select buttons */}
        <div className="menu-buttons">
          <button 
            className="menu-btn"
            onClick={() => {
              if (gameState === 'title') startGame();
              else if (gameState === 'game-over') playAgain();
              else if (gameState === 'select-opponent') selectOpponent(opponentTypes[selectedOpponentIndex]);
            }}
          >
            START
          </button>
          <button 
            className="menu-btn"
            onClick={goToTitle}
          >
            SELECT
          </button>
        </div>
        
        {/* Sound toggle */}
        <div className="sound-toggle">
          <button 
            className={`sound-btn ${soundEnabled ? 'on' : 'off'}`}
            onClick={() => setSoundEnabled(!soundEnabled)}
          >
            {soundEnabled ? '🔊' : '🔇'}
          </button>
        </div>
        
        {/* Speaker grille */}
        <div className="speaker-grille">
          {[...Array(12)].map((_, i) => (
            <div key={i} className="speaker-hole" />
          ))}
        </div>
        
      </div>
      
      {/* Info panel (outside handheld) */}
      <div className="info-panel">
        <div className="info-title">HOW TO PLAY</div>
        <div className="info-text">
          <p><strong>Prisoner's Dilemma:</strong> Each round, you and CPU choose to COOPERATE or DEFECT.</p>
          <p><strong>Payoffs:</strong> Both C = 3,3 • You C, CPU D = 0,5 • You D, CPU C = 5,0 • Both D = 1,1</p>
          <p><strong>Goal:</strong> Score more points than your opponent over {ROUNDS_PER_GAME} rounds.</p>
          <p><strong>Strategy:</strong> Different opponents use different strategies. Can you figure them out?</p>
        </div>
      </div>
      
      {/* Styles */}
      <style jsx>{`
        .handheld-container {
          --lcd-bg: #9ead86;
          --lcd-segment-on: #1a2e1a;
          --lcd-segment-ghost: rgba(26, 46, 26, 0.08);
          --plastic-main: #d4cfc4;
          --plastic-dark: #b8b3a8;
          --plastic-light: #e8e4db;
          --btn-red: #c94444;
          --btn-blue: #4466aa;
          
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 16px;
          padding: 16px;
          font-family: var(--font-sans, system-ui, sans-serif);
        }
        
        .handheld-body {
          position: relative;
          width: 280px;
          padding: 20px;
          background: linear-gradient(145deg, var(--plastic-light) 0%, var(--plastic-main) 50%, var(--plastic-dark) 100%);
          border-radius: 20px;
          box-shadow: 
            0 8px 24px rgba(0, 0, 0, 0.3),
            inset 0 2px 4px rgba(255, 255, 255, 0.4),
            inset 0 -2px 4px rgba(0, 0, 0, 0.1);
        }
        
        .brand-sticker {
          position: absolute;
          top: 8px;
          left: 50%;
          transform: translateX(-50%);
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 2px 12px;
          background: linear-gradient(180deg, #ffd700 0%, #ffaa00 100%);
          border-radius: 2px;
          box-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
        }
        
        .brand-name {
          font-size: 8px;
          font-weight: 900;
          color: #2a1810;
          letter-spacing: 0.5px;
        }
        
        .brand-sub {
          font-size: 6px;
          font-weight: 700;
          color: #4a3020;
          letter-spacing: 1px;
        }
        
        .lcd-bezel {
          background: #2a2a2a;
          border-radius: 8px;
          padding: 8px;
          margin-top: 20px;
          box-shadow: 
            inset 0 2px 8px rgba(0, 0, 0, 0.5),
            0 1px 0 rgba(255, 255, 255, 0.1);
        }
        
        .lcd-screen {
          background: var(--lcd-bg);
          border-radius: 4px;
          width: 220px;
          height: 200px;
          position: relative;
          overflow: hidden;
          box-shadow: inset 0 0 20px rgba(0, 0, 0, 0.1);
        }
        
        /* Add subtle LCD grid texture */
        .lcd-screen::before {
          content: '';
          position: absolute;
          inset: 0;
          background: 
            repeating-linear-gradient(
              0deg,
              transparent,
              transparent 2px,
              rgba(0, 0, 0, 0.03) 2px,
              rgba(0, 0, 0, 0.03) 4px
            );
          pointer-events: none;
        }
        
        .screen-content {
          padding: 8px;
          height: 100%;
          display: flex;
          flex-direction: column;
          color: var(--lcd-segment-on);
          font-family: 'Courier New', monospace;
        }
        
        /* Title Screen */
        .title-screen {
          justify-content: center;
          align-items: center;
          gap: 24px;
        }
        
        .title-logo {
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        
        .title-main {
          font-size: 18px;
          font-weight: 900;
          letter-spacing: 2px;
        }
        
        .title-prompt {
          font-size: 12px;
          letter-spacing: 1px;
        }
        
        .blink {
          animation: blink 1s step-end infinite;
        }
        
        @keyframes blink {
          50% { opacity: 0; }
        }
        
        /* Opponent Selection */
        .select-screen {
          gap: 8px;
        }
        
        .select-header {
          font-size: 11px;
          text-align: center;
          padding-bottom: 4px;
          border-bottom: 1px solid var(--lcd-segment-on);
        }
        
        .opponent-list {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 2px;
          overflow: hidden;
        }
        
        .opponent-option {
          display: flex;
          align-items: center;
          gap: 4px;
          font-size: 11px;
          padding: 2px 4px;
          opacity: 0.4;
        }
        
        .opponent-option.selected {
          opacity: 1;
          background: rgba(26, 46, 26, 0.1);
        }
        
        .select-arrow {
          width: 12px;
        }
        
        .select-screen .action-prompt {
          margin-top: auto;
          padding-top: 4px;
        }
        
        /* Game Screen */
        .game-screen {
          gap: 2px;
        }
        
        .game-header {
          display: flex;
          justify-content: space-between;
          font-size: 9px;
          padding-bottom: 2px;
          border-bottom: 1px solid var(--lcd-segment-on);
        }
        
        .scores-row {
          display: flex;
          justify-content: space-around;
          padding: 2px 0;
        }
        
        .score-box {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1px;
        }
        
        .score-label {
          font-size: 8px;
        }
        
        .lcd-score {
          display: flex;
          gap: 2px;
        }
        
        :global(.lcd-digit) {
          width: 16px;
          height: 26px;
        }
        
        :global(.segment) {
          fill: var(--lcd-segment-ghost);
          transition: fill 0.1s;
        }
        
        :global(.segment.on) {
          fill: var(--lcd-segment-on);
        }
        
        :global(.segment.ghost) {
          fill: var(--lcd-segment-ghost);
        }
        
        /* Choice Display */
        .choice-display {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 4px 0;
        }
        
        .choice-box {
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 4px 10px;
          border: 1px solid rgba(26, 46, 26, 0.3);
          min-width: 44px;
        }
        
        .choice-box.chosen {
          background: rgba(26, 46, 26, 0.1);
          border-color: var(--lcd-segment-on);
        }
        
        .choice-box.thinking {
          animation: pulse 0.5s ease-in-out infinite;
        }
        
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
        
        .choice-label {
          font-size: 7px;
          opacity: 0.6;
        }
        
        .choice-value {
          font-size: 20px;
          font-weight: 900;
          line-height: 1;
        }
        
        .choice-value.cooperate {
          /* Could add color here if we want */
        }
        
        .choice-value.defect {
          /* Could add color here if we want */
        }
        
        .vs-symbol {
          font-size: 9px;
          opacity: 0.5;
        }
        
        /* Result Display */
        .result-display {
          display: flex;
          flex-direction: column;
          align-items: center;
          padding: 3px;
          background: rgba(26, 46, 26, 0.1);
          margin: 2px 0;
        }
        
        .result-points {
          font-size: 12px;
          font-weight: 900;
        }
        
        .result-outcome {
          font-size: 8px;
          opacity: 0.7;
        }
        
        .action-prompt {
          text-align: center;
          font-size: 9px;
          margin-top: auto;
          padding-bottom: 2px;
        }
        
        .countdown-prompt {
          background: rgba(26, 46, 26, 0.15);
          padding: 3px 8px;
          border: 1px solid rgba(26, 46, 26, 0.3);
        }
        
        .key-hint {
          font-weight: 900;
          padding: 0 2px;
        }
        
        .skip-hint {
          opacity: 0.5;
          font-size: 8px;
        }
        
        /* Game Over Screen */
        .gameover-screen {
          align-items: center;
          gap: 8px;
        }
        
        .gameover-title {
          font-size: 16px;
          font-weight: 900;
          margin-top: 8px;
        }
        
        .final-scores {
          display: flex;
          gap: 24px;
        }
        
        .final-score {
          display: flex;
          flex-direction: column;
          align-items: center;
          font-size: 10px;
        }
        
        .opponent-reveal {
          display: flex;
          flex-direction: column;
          align-items: center;
          font-size: 9px;
          padding: 8px;
          background: rgba(26, 46, 26, 0.1);
          border-radius: 4px;
          margin-top: 4px;
        }
        
        .reveal-label {
          opacity: 0.6;
        }
        
        .reveal-name {
          font-weight: bold;
          margin: 2px 0;
        }
        
        .reveal-strategy {
          font-size: 8px;
          opacity: 0.7;
          text-align: center;
        }
        
        /* Controls */
        .controls-section {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: 16px;
          padding: 0 8px;
        }
        
        .dpad-container {
          display: grid;
          grid-template-areas:
            ". up ."
            "left center right"
            ". down .";
          grid-template-columns: 24px 24px 24px;
          grid-template-rows: 24px 24px 24px;
          gap: 0;
        }
        
        .dpad-btn {
          background: #3a3a3a;
          border: none;
          color: #666;
          font-size: 10px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .dpad-btn:active {
          background: #2a2a2a;
          color: #888;
        }
        
        .dpad-up { grid-area: up; border-radius: 4px 4px 0 0; }
        .dpad-down { grid-area: down; border-radius: 0 0 4px 4px; }
        .dpad-left { grid-area: left; border-radius: 4px 0 0 4px; }
        .dpad-right { grid-area: right; border-radius: 0 4px 4px 0; }
        .dpad-center { grid-area: center; background: #3a3a3a; }
        
        .action-buttons {
          display: flex;
          gap: 16px;
        }
        
        .button-group {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 4px;
        }
        
        .action-btn {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          border: none;
          font-weight: 900;
          font-size: 14px;
          cursor: pointer;
          box-shadow: 
            0 4px 8px rgba(0, 0, 0, 0.3),
            inset 0 2px 4px rgba(255, 255, 255, 0.3);
        }
        
        .action-btn:active {
          transform: translateY(2px);
          box-shadow: 
            0 2px 4px rgba(0, 0, 0, 0.3),
            inset 0 2px 4px rgba(255, 255, 255, 0.2);
        }
        
        .btn-a {
          background: linear-gradient(145deg, #5588cc, var(--btn-blue));
          color: white;
        }
        
        .btn-b {
          background: linear-gradient(145deg, #dd6666, var(--btn-red));
          color: white;
        }
        
        .btn-label {
          font-size: 7px;
          color: #666;
          text-transform: uppercase;
        }
        
        .menu-buttons {
          display: flex;
          justify-content: center;
          gap: 24px;
          margin-top: 12px;
        }
        
        .menu-btn {
          padding: 4px 16px;
          background: #555;
          border: none;
          border-radius: 8px;
          color: #999;
          font-size: 8px;
          font-weight: 700;
          letter-spacing: 1px;
          cursor: pointer;
          box-shadow: inset 0 -2px 4px rgba(0, 0, 0, 0.3);
        }
        
        .menu-btn:active {
          background: #444;
          box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.3);
        }
        
        .sound-toggle {
          position: absolute;
          top: 50%;
          right: -8px;
          transform: translateY(-50%);
        }
        
        .sound-btn {
          width: 20px;
          height: 32px;
          background: #888;
          border: none;
          border-radius: 0 4px 4px 0;
          font-size: 10px;
          cursor: pointer;
          box-shadow: 2px 0 4px rgba(0, 0, 0, 0.2);
        }
        
        .speaker-grille {
          position: absolute;
          bottom: 16px;
          right: 16px;
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 3px;
        }
        
        .speaker-hole {
          width: 4px;
          height: 4px;
          background: #666;
          border-radius: 50%;
          box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.5);
        }
        
        /* Info Panel */
        .info-panel {
          max-width: 280px;
          padding: 12px;
          background: #f5f5f5;
          border-radius: 8px;
          font-size: 11px;
          color: #333;
        }
        
        .info-title {
          font-weight: 700;
          margin-bottom: 8px;
          color: #666;
        }
        
        .info-text p {
          margin: 4px 0;
          line-height: 1.4;
        }
        
        .info-text strong {
          color: #000;
        }
      `}</style>
    </div>
  );
}
"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Trophy, Clock, Target, Zap, RotateCcw, Play, Settings } from "lucide-react";

interface GameStats {
  wpm: number;
  accuracy: number;
  timeLeft: number;
  score: number;
  wordsTyped: number;
  totalWords: number;
}

interface LeaderboardEntry {
  id: string;
  name: string;
  wpm: number;
  accuracy: number;
  score: number;
  timestamp: number;
}

interface GameSettings {
  timeDuration: number;
  wordHighlight: boolean;
  mode: 'words' | 'lines';
}

const WORDS = [
  "react", "typescript", "javascript", "nextjs", "node", "python", "flutter", "dart",
  "component", "function", "variable", "interface", "class", "method", "array", "object",
  "async", "await", "promise", "callback", "hook", "state", "props", "context",
  "database", "api", "endpoint", "request", "response", "middleware", "authentication",
  "algorithm", "data", "structure", "binary", "tree", "graph", "sort", "search",
  "development", "programming", "coding", "software", "application", "website", "mobile",
  "frontend", "backend", "fullstack", "devops", "deployment", "testing", "debugging"
];

const CODE_LINES = [
  "Fetching data from the server can take some time depending on the connection.",
  "You should always handle errors carefully to avoid crashing the application.",
  "The response from the server contains important information that needs parsing.",
  "After receiving the data, we can update the state and show it to the user.",
  "If there is a problem, log the error so you can debug it later.",
  "Calculating the total cost of items requires summing up all their prices.",
  "Each item contributes to the total based on its individual price value.",
  "State management is essential when creating interactive user interfaces.",
  "Side effects in applications should be handled in a controlled and predictable way.",
  "It is important to run logic only when the dependencies change.",
  "This component renders a simple greeting to the user in the user interface.",
  "You can define a user with an identification number, name, and email address.",
  "Keeping data structured helps in managing and accessing information efficiently."
];

const TIME_OPTIONS = [
  { value: 30, label: "30 seconds" },
  { value: 60, label: "1 minute" },
  { value: 120, label: "2 minutes" },
  { value: 300, label: "5 minutes" }
];

export default function TypingGame() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [currentWord, setCurrentWord] = useState("");
  const [currentLine, setCurrentLine] = useState("");
  const [userInput, setUserInput] = useState("");
  const [wordIndex, setWordIndex] = useState(0);
  const [lineIndex, setLineIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [settings, setSettings] = useState<GameSettings>({
    timeDuration: 60,
    wordHighlight: true,
    mode: 'lines'
  });
  const [stats, setStats] = useState<GameStats>({
    wpm: 0,
    accuracy: 0,
    timeLeft: 60,
    score: 0,
    wordsTyped: 0,
    totalWords: 0
  });
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [showLeaderboard, setShowLeaderboard] = useState(false);
  const [playerName, setPlayerName] = useState("");
  const [showNameInput, setShowNameInput] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [currentErrors, setCurrentErrors] = useState<number[]>([]);
  
  const inputRef = useRef<HTMLInputElement>(null);
  const textContainerRef = useRef<HTMLDivElement>(null);
  const correctWords = useRef(0);
  const totalChars = useRef(0);
  const correctChars = useRef(0);
  const incorrectChars = useRef(0);

  const generateRandomWords = useCallback(() => {
    const shuffled = [...WORDS].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, 20);
  }, []);

  const generateRandomLines = useCallback(() => {
    const shuffled = [...CODE_LINES].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, 15);
  }, []);

  const scrollToCurrentPosition = useCallback(() => {
    if (!textContainerRef.current) return;
    
    const container = textContainerRef.current;
    const currentCharIndex = userInput.length;
    
    // Find the current character element
    const charElements = container.querySelectorAll('span');
    const currentCharElement = charElements[currentCharIndex];
    
    if (currentCharElement) {
      const containerRect = container.getBoundingClientRect();
      const charRect = currentCharElement.getBoundingClientRect();
      
      // Check if current character is out of view horizontally
      const isOutOfViewHorizontally = 
        charRect.left < containerRect.left || 
        charRect.right > containerRect.right;
      
      if (isOutOfViewHorizontally) {
        // Calculate scroll position to center the current character
        const containerWidth = containerRect.width;
        const charLeft = charRect.left - containerRect.left;
        const charWidth = charRect.width;
        
        // Center the character in the container
        const targetScrollLeft = charLeft - (containerWidth / 2) + (charWidth / 2);
        
        container.scrollTo({
          left: Math.max(0, targetScrollLeft),
          behavior: 'smooth'
        });
      }
    }
  }, [userInput.length]);

  const [words, setWords] = useState<string[]>([]);
  const [lines, setLines] = useState<string[]>([]);

  const startGame = useCallback(() => {
    const duration = settings.timeDuration;
    setTimeLeft(duration);
    setGameOver(false);
    setIsPlaying(true);
    setCurrentErrors([]);
    correctWords.current = 0;
    totalChars.current = 0;
    correctChars.current = 0;
    incorrectChars.current = 0;
    
    if (settings.mode === 'words') {
      const newWords = generateRandomWords();
      setWords(newWords);
      setCurrentWord(newWords[0]);
      setUserInput("");
      setWordIndex(0);
      setStats({
        wpm: 0,
        accuracy: 0,
        timeLeft: duration,
        score: 0,
        wordsTyped: 0,
        totalWords: newWords.length
      });
    } else {
      const newLines = generateRandomLines();
      setLines(newLines);
      setCurrentLine(newLines[0]);
      setUserInput("");
      setLineIndex(0);
      setStats({
        wpm: 0,
        accuracy: 0,
        timeLeft: duration,
        score: 0,
        wordsTyped: 0,
        totalWords: newLines.length
      });
    }
    
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [settings, generateRandomWords, generateRandomLines]);

  const endGame = useCallback(() => {
    setIsPlaying(false);
    setGameOver(true);
    setShowNameInput(true);
  }, []);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (!isPlaying) return;
    
    const value = e.target.value;
    setUserInput(value);
    
    // Track character-level errors
    const targetText = settings.mode === 'words' ? currentWord : currentLine;
    const errors: number[] = [];
    
    for (let i = 0; i < Math.min(value.length, targetText.length); i++) {
      if (value[i] !== targetText[i]) {
        errors.push(i);
      }
    }
    setCurrentErrors(errors);
    
    if (settings.mode === 'words') {
      // Word mode logic
      if (value === currentWord) {
        correctWords.current += 1;
        correctChars.current += currentWord.length;
        setCurrentErrors([]);
        
        // Move to next word
        if (wordIndex < words.length - 1) {
          const nextIndex = wordIndex + 1;
          setWordIndex(nextIndex);
          setCurrentWord(words[nextIndex]);
          setUserInput("");
        } else {
          // All words completed
          endGame();
        }
      } else {
        // Count correct characters for accuracy
        const currentLength = Math.min(value.length, currentWord.length);
        let correctInThisWord = 0;
        for (let i = 0; i < currentLength; i++) {
          if (value[i] === currentWord[i]) {
            correctInThisWord++;
          }
        }
        correctChars.current = correctChars.current - (currentLength - correctInThisWord) + correctInThisWord;
      }
    } else {
      // Line mode logic
      if (value === currentLine) {
        correctWords.current += 1;
        correctChars.current += currentLine.length;
        setCurrentErrors([]);
        
        // Move to next line
        if (lineIndex < lines.length - 1) {
          const nextIndex = lineIndex + 1;
          setLineIndex(nextIndex);
          setCurrentLine(lines[nextIndex]);
          setUserInput("");
        } else {
          // All lines completed
          endGame();
        }
      } else {
        // Count correct characters for accuracy
        const currentLength = Math.min(value.length, currentLine.length);
        let correctInThisLine = 0;
        for (let i = 0; i < currentLength; i++) {
          if (value[i] === currentLine[i]) {
            correctInThisLine++;
          }
        }
        correctChars.current = correctChars.current - (currentLength - correctInThisLine) + correctInThisLine;
      }
    }
    
    // Update total characters typed
    totalChars.current = Math.max(totalChars.current, value.length);
    
    // Auto-scroll to current position after a short delay to allow DOM update
    setTimeout(() => {
      scrollToCurrentPosition();
    }, 10);
  }, [isPlaying, currentWord, currentLine, wordIndex, lineIndex, words, lines, settings.mode, endGame, scrollToCurrentPosition]);

  const submitScore = useCallback(() => {
    if (!playerName.trim()) return;
    
    const newEntry: LeaderboardEntry = {
      id: Date.now().toString(),
      name: playerName.trim(),
      wpm: stats.wpm,
      accuracy: stats.accuracy,
      score: stats.score,
      timestamp: Date.now()
    };
    
    const updatedLeaderboard = [...leaderboard, newEntry]
      .sort((a, b) => b.score - a.score)
      .slice(0, 10); // Keep top 10
    
    setLeaderboard(updatedLeaderboard);
    setShowNameInput(false);
    setShowLeaderboard(true);
    setPlayerName("");
  }, [playerName, stats, leaderboard]);

  // Timer effect
  useEffect(() => {
    if (!isPlaying || timeLeft <= 0) return;
    
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          endGame();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    return () => clearInterval(timer);
  }, [isPlaying, timeLeft, endGame]);

  // Stats calculation
  useEffect(() => {
    if (!isPlaying) return;
    
    const duration = settings.timeDuration;
    const minutes = (duration - timeLeft) / 60;
    const wpm = minutes > 0 ? Math.round((correctWords.current / minutes)) : 0;
    
    // Fix accuracy calculation - ensure it never exceeds 100%
    const accuracy = totalChars.current > 0 ? Math.min(Math.round((correctChars.current / totalChars.current) * 100), 100) : 0;
    const score = wpm * accuracy;
    
    setStats(prev => ({
      ...prev,
      wpm,
      accuracy,
      timeLeft,
      score,
      wordsTyped: correctWords.current
    }));
  }, [isPlaying, timeLeft, settings.timeDuration]);

  // Auto-scroll when game starts or text changes
  useEffect(() => {
    if (isPlaying && textContainerRef.current) {
      // Scroll to beginning when starting a new word/line
      if (userInput.length === 0) {
        textContainerRef.current.scrollLeft = 0;
      } else {
        // Scroll to current position
        scrollToCurrentPosition();
      }
    }
  }, [isPlaying, currentWord, currentLine, scrollToCurrentPosition, userInput.length]);

  const getAccuracyColor = (accuracy: number) => {
    if (accuracy >= 90) return "text-green-500";
    if (accuracy >= 70) return "text-yellow-500";
    return "text-red-500";
  };

  const getWPMColor = (wpm: number) => {
    if (wpm >= 60) return "text-blue-500";
    if (wpm >= 40) return "text-yellow-500";
    return "text-red-500";
  };

  const renderHighlightedText = (text: string, userInput: string, errors: number[]) => {
    const chars = text.split('');
    const inputChars = userInput.split('');
    
    return chars.map((char, index) => {
      const isTyped = index < userInput.length && index < text.length;
      const isCorrect = isTyped && char === inputChars[index];
      const isError = isTyped && errors.includes(index);
      const isCurrent = index === userInput.length;
      
      let className = "transition-colors duration-150 ";
      
      if (isCurrent) {
        className += "bg-primary/20 border-b-2 border-primary animate-pulse";
      } else if (isError) {
        className += "bg-red-500/20 text-red-600 dark:text-red-400";
      } else if (isCorrect) {
        className += "bg-green-500/20 text-green-600 dark:text-green-400";
      } else if (isTyped) {
        className += "bg-yellow-500/20 text-yellow-600 dark:text-yellow-400";
      } else {
        className += "text-muted-foreground";
      }
      
      return (
        <span key={`${lineIndex}-${index}`} className={className}>
          {char === ' ' ? '\u00A0' : char}
        </span>
      );
    });
  };

  return (
    <div className="w-full max-w-3xl mx-auto">
      <Card className="border-0 shadow-lg bg-background/60 backdrop-blur-sm">
        <CardHeader className="text-center pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Zap className="h-6 w-6 text-primary" />
              <CardTitle className="text-2xl">Typing Speed Challenge</CardTitle>
            </div>
            <Dialog open={showSettings} onOpenChange={setShowSettings}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                  <Settings className="h-4 w-4 mr-2" />
                  Settings
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md" showCloseButton={false}>
                <DialogHeader>
                  <DialogTitle>Game Settings</DialogTitle>
                </DialogHeader>
                <div className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="time-duration">Time Duration</Label>
                    <Select
                      value={settings.timeDuration.toString()}
                      onValueChange={(value: string) => setSettings(prev => ({ ...prev, timeDuration: parseInt(value) }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {TIME_OPTIONS.map(option => (
                          <SelectItem key={option.value} value={option.value.toString()}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="mode">Game Mode</Label>
                    <Select
                      value={settings.mode}
                      onValueChange={(value: 'words' | 'lines') => setSettings(prev => ({ ...prev, mode: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="words">Words Mode</SelectItem>
                        <SelectItem value="lines">Lines Mode</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <Label htmlFor="word-highlight">Word Highlighting</Label>
                    <Switch
                      id="word-highlight"
                      checked={settings.wordHighlight}
                      onCheckedChange={(checked: boolean) => setSettings(prev => ({ ...prev, wordHighlight: checked }))}
                    />
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {/* Game Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="text-center p-2 rounded-lg bg-muted/50">
              <div className="flex items-center justify-center gap-1 mb-1">
                <Clock className="h-3 w-3 text-blue-500" />
                <span className="text-xs font-medium">Time</span>
              </div>
              <div className="text-lg font-bold text-blue-600">{timeLeft}s</div>
            </div>
            
            <div className="text-center p-2 rounded-lg bg-muted/50">
              <div className="flex items-center justify-center gap-1 mb-1">
                <Target className="h-3 w-3 text-green-500" />
                <span className="text-xs font-medium">WPM</span>
              </div>
              <div className={`text-lg font-bold ${getWPMColor(stats.wpm)}`}>
                {stats.wpm}
              </div>
            </div>
            
            <div className="text-center p-2 rounded-lg bg-muted/50">
              <div className="flex items-center justify-center gap-1 mb-1">
                <Target className="h-3 w-3 text-purple-500" />
                <span className="text-xs font-medium">Accuracy</span>
              </div>
              <div className={`text-lg font-bold ${getAccuracyColor(stats.accuracy)}`}>
                {stats.accuracy}%
              </div>
            </div>
            
            <div className="text-center p-2 rounded-lg bg-muted/50">
              <div className="flex items-center justify-center gap-1 mb-1">
                <Trophy className="h-3 w-3 text-yellow-500" />
                <span className="text-xs font-medium">Score</span>
              </div>
              <div className="text-lg font-bold text-yellow-600">{stats.score}</div>
            </div>
          </div>

          {/* Game Area */}
          <AnimatePresence mode="wait">
            {!isPlaying && !gameOver && (
              <motion.div
                key="start"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="text-center space-y-4"
              >
                <div className="text-lg text-muted-foreground">
                  Type as many words as you can in 60 seconds!
                </div>
                <Button onClick={startGame} size="lg" className="px-8">
                  <Play className="h-4 w-4 mr-2" />
                  Start Game
                </Button>
              </motion.div>
            )}

            {isPlaying && (
              <motion.div
                key="game"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="space-y-4"
              >
                <div className="text-center">
                  <div className="text-xs text-muted-foreground mb-2">
                    {settings.mode === 'words' ? 'Words Mode' : 'Lines Mode'} • {settings.timeDuration}s
                  </div>
                  <div className="text-xl font-mono font-bold mb-2 min-h-[2rem] flex items-center justify-center leading-relaxed">
                    <div 
                      key={`text-${settings.mode === 'words' ? wordIndex : lineIndex}`}
                      ref={textContainerRef}
                      className="text-left max-w-full overflow-x-auto overflow-y-hidden scrollbar-thin scrollbar-thumb-muted scrollbar-track-transparent"
                      style={{ scrollBehavior: 'smooth' }}
                    >
                      {settings.mode === 'words' 
                        ? renderHighlightedText(currentWord, userInput, currentErrors)
                        : renderHighlightedText(currentLine, userInput, currentErrors)
                      }
                    </div>
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {settings.mode === 'words' 
                      ? `Word ${wordIndex + 1} of ${words.length}`
                      : `Line ${lineIndex + 1} of ${lines.length}`
                    }
                  </div>
                  
                  {/* Color Legend */}
                  <div className="flex items-center justify-center gap-3 text-xs text-muted-foreground mt-1">
                    <div className="flex items-center gap-1">
                      <div className="w-2 h-2 bg-green-500/20 rounded"></div>
                      <span>Correct</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="w-2 h-2 bg-red-500/20 rounded"></div>
                      <span>Wrong</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="w-2 h-2 bg-primary/20 rounded"></div>
                      <span>Current</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-center">
                  <div className="relative w-full max-w-xl">
                    <input
                      ref={inputRef}
                      type="text"
                      value={userInput}
                      onChange={handleInputChange}
                      onPaste={(e) => e.preventDefault()}
                      onCopy={(e) => e.preventDefault()}
                      onCut={(e) => e.preventDefault()}
                      className="w-full px-3 py-2 text-base font-mono text-center border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary opacity-0 absolute"
                      placeholder="Start typing..."
                      autoFocus
                    />
                    <div className="w-full px-3 py-2 text-base font-mono text-center border rounded-lg bg-background/50 backdrop-blur-sm pointer-events-none">
                      {userInput}
                      <span className="animate-pulse">|</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-center">
                  <Button
                    onClick={endGame}
                    variant="outline"
                    size="sm"
                    className="text-xs"
                  >
                    End Game
                  </Button>
                </div>
              </motion.div>
            )}

            {gameOver && (
              <motion.div
                key="gameover"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="text-center space-y-3"
              >
                <div className="text-xl font-bold text-primary mb-1">
                  Game Over!
                </div>
                <div className="text-sm text-muted-foreground mb-3">
                  You typed {stats.wordsTyped} words with {stats.accuracy}% accuracy
                </div>
                
                {showNameInput ? (
                  <div className="space-y-3">
                    <div className="text-xs text-muted-foreground">
                      Enter your name to save your score:
                    </div>
                    <div className="flex gap-2 justify-center">
                      <input
                        type="text"
                        value={playerName}
                        onChange={(e) => setPlayerName(e.target.value)}
                        placeholder="Your name"
                        className="px-3 py-2 text-sm border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary"
                        onKeyPress={(e) => e.key === 'Enter' && submitScore()}
                      />
                      <Button onClick={submitScore} disabled={!playerName.trim()} size="sm">
                        Save Score
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="flex gap-2 justify-center">
                    <Button onClick={startGame} size="sm">
                      <RotateCcw className="h-3 w-3 mr-1" />
                      Play Again
                    </Button>
                    <Button onClick={() => setShowLeaderboard(true)} variant="outline" size="sm">
                      <Trophy className="h-3 w-3 mr-1" />
                      Leaderboard
                    </Button>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Leaderboard */}
          <AnimatePresence>
            {showLeaderboard && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="space-y-3"
              >
                <div className="text-center">
                  <h3 className="text-lg font-bold flex items-center justify-center gap-2">
                    <Trophy className="h-4 w-4 text-yellow-500" />
                    Leaderboard
                  </h3>
                </div>
                
                {leaderboard.length === 0 ? (
                  <div className="text-center text-muted-foreground py-4">
                    No scores yet. Be the first to play!
                  </div>
                ) : (
                  <div className="space-y-1">
                    {leaderboard.map((entry, index) => (
                      <motion.div
                        key={entry.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className={`flex items-center justify-between p-2 rounded-lg ${
                          index === 0 ? 'bg-yellow-50 dark:bg-yellow-950/20 border-yellow-200 dark:border-yellow-800' : 'bg-muted/50'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <div className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold ${
                            index === 0 ? 'bg-yellow-500 text-white' : 'bg-muted text-muted-foreground'
                          }`}>
                            {index + 1}
                          </div>
                          <div>
                            <div className="text-sm font-medium">{entry.name}</div>
                            <div className="text-xs text-muted-foreground">
                              {new Date(entry.timestamp).toLocaleDateString()}
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-3">
                          <div className="text-right">
                            <div className="text-xs font-medium">{entry.wpm} WPM</div>
                            <div className="text-xs text-muted-foreground">{entry.accuracy}% accuracy</div>
                          </div>
                          <Badge variant="secondary" className="text-xs">
                            {entry.score}
                          </Badge>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
                
                <div className="flex justify-center">
                  <Button
                    onClick={() => setShowLeaderboard(false)}
                    variant="outline"
                    size="sm"
                    className="text-xs"
                  >
                    Close
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>
      </Card>
    </div>
  );
}

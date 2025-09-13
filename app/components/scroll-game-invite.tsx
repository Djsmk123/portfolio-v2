"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Gamepad2, Trophy, Zap, X } from "lucide-react";

interface ScrollGameInviteProps {
  onStartGame: () => void;
}

export default function ScrollGameInvite({ onStartGame }: ScrollGameInviteProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const documentHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = Math.min(scrollTop / documentHeight, 1);
      
      setScrollProgress(progress);
      
      // Show invite when user scrolls to bottom (90% of page)
      if (progress >= 0.9 && !isDismissed) {
        setIsVisible(true);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isDismissed]);

  const handleDismiss = () => {
    setIsDismissed(true);
    setIsVisible(false);
  };

  const handleStartGame = () => {
    onStartGame();
    setIsVisible(false);
  };

  if (isDismissed) return null;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          ref={containerRef}
          initial={{ opacity: 0, y: 100, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 100, scale: 0.9 }}
          transition={{ 
            type: "spring", 
            stiffness: 300, 
            damping: 30,
            duration: 0.6 
          }}
          className="fixed bottom-6 right-6 z-50 max-w-sm"
        >
          <Card className="border-0 shadow-2xl bg-gradient-to-br from-primary/10 via-background to-primary/5 backdrop-blur-md">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-full bg-primary/20">
                    <Gamepad2 className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-bold text-lg">Are you bored?</h3>
                    <p className="text-sm text-muted-foreground">Let's play a game!</p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleDismiss}
                  className="h-6 w-6 p-0 hover:bg-muted"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="space-y-3">
                <div className="text-sm text-muted-foreground">
                  Challenge yourself with our typing speed game. Beat the leaderboard and show off your skills!
                </div>
                
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Zap className="h-3 w-3" />
                    <span>60s Challenge</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Trophy className="h-3 w-3" />
                    <span>Leaderboard</span>
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <Button 
                    onClick={handleStartGame}
                    className="flex-1 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70"
                  >
                    <Gamepad2 className="h-4 w-4 mr-2" />
                    Play Now
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={handleDismiss}
                  >
                    Maybe Later
                  </Button>
                </div>
              </div>
              
              {/* Progress indicator */}
              <div className="mt-4">
                <div className="h-1 bg-muted rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-primary to-primary/60"
                    initial={{ width: 0 }}
                    animate={{ width: `${scrollProgress * 100}%` }}
                    transition={{ duration: 0.3 }}
                  />
                </div>
                <div className="text-xs text-muted-foreground mt-1 text-center">
                  {Math.round(scrollProgress * 100)}% scrolled
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

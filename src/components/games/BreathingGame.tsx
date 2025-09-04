import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Play, Pause, RotateCcw } from 'lucide-react';

interface BreathingGameProps {
  onComplete: () => void;
}

type BreathingPhase = 'inhale' | 'hold' | 'exhale' | 'pause';

export const BreathingGame: React.FC<BreathingGameProps> = ({ onComplete }) => {
  const [isActive, setIsActive] = useState(false);
  const [currentPhase, setCurrentPhase] = useState<BreathingPhase>('inhale');
  const [cycleCount, setCycleCount] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(4);
  const [progress, setProgress] = useState(0);

  const phases = {
    inhale: { duration: 4, next: 'hold', instruction: 'Breathe In' },
    hold: { duration: 4, next: 'exhale', instruction: 'Hold' },
    exhale: { duration: 6, next: 'pause', instruction: 'Breathe Out' },
    pause: { duration: 2, next: 'inhale', instruction: 'Pause' }
  };

  const targetCycles = 8;

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isActive && timeRemaining > 0) {
      interval = setInterval(() => {
        setTimeRemaining(prev => prev - 0.1);
        setProgress(prev => prev + (100 / (phases[currentPhase].duration * 10)));
      }, 100);
    } else if (isActive && timeRemaining <= 0) {
      // Move to next phase
      const nextPhase = phases[currentPhase].next as BreathingPhase;
      setCurrentPhase(nextPhase);
      setTimeRemaining(phases[nextPhase].duration);
      setProgress(0);
      
      if (nextPhase === 'inhale') {
        setCycleCount(prev => {
          const newCount = prev + 1;
          if (newCount >= targetCycles) {
            setIsActive(false);
            setTimeout(() => onComplete(), 1000);
          }
          return newCount;
        });
      }
    }

    return () => clearInterval(interval);
  }, [isActive, timeRemaining, currentPhase, cycleCount, onComplete]);

  const handleStart = () => {
    setIsActive(true);
  };

  const handlePause = () => {
    setIsActive(false);
  };

  const handleReset = () => {
    setIsActive(false);
    setCurrentPhase('inhale');
    setCycleCount(0);
    setTimeRemaining(4);
    setProgress(0);
  };

  const getCircleScale = () => {
    switch (currentPhase) {
      case 'inhale':
        return 1 + (progress / 100) * 0.8;
      case 'hold':
        return 1.8;
      case 'exhale':
        return 1.8 - (progress / 100) * 0.8;
      case 'pause':
        return 1;
      default:
        return 1;
    }
  };

  const getCircleColor = () => {
    switch (currentPhase) {
      case 'inhale':
        return 'bg-primary/20 border-primary';
      case 'hold':
        return 'bg-secondary/20 border-secondary';
      case 'exhale':
        return 'bg-accent/20 border-accent';
      case 'pause':
        return 'bg-muted border-muted-foreground';
      default:
        return 'bg-primary/20 border-primary';
    }
  };

  if (cycleCount >= targetCycles && !isActive) {
    return (
      <Card className="max-w-2xl mx-auto">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl text-primary">Congratulations! 🎉</CardTitle>
          <CardDescription>
            You've completed the breathing exercise! You earned 25 points.
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          <p className="text-muted-foreground mb-6">
            Great job on completing {targetCycles} breathing cycles. This practice helps reduce stress and anxiety.
          </p>
          <Button onClick={onComplete}>
            Continue
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl">Mindful Breathing Exercise</CardTitle>
        <CardDescription>
          Follow the breathing pattern: 4-4-6-2 (Inhale-Hold-Exhale-Pause)
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-8">
        {/* Progress */}
        <div className="text-center space-y-2">
          <div className="text-sm text-muted-foreground">
            Cycle {cycleCount + 1} of {targetCycles}
          </div>
          <Progress value={(cycleCount / targetCycles) * 100} className="h-2" />
        </div>

        {/* Breathing Circle */}
        <div className="flex justify-center items-center h-80">
          <div 
            className={`w-40 h-40 rounded-full border-4 transition-all duration-100 ease-linear ${getCircleColor()}`}
            style={{ 
              transform: `scale(${getCircleScale()})`,
            }}
          />
        </div>

        {/* Instructions */}
        <div className="text-center space-y-4">
          <div className="text-3xl font-bold text-foreground">
            {phases[currentPhase].instruction}
          </div>
          <div className="text-xl text-muted-foreground">
            {Math.ceil(timeRemaining)}s
          </div>
        </div>

        {/* Controls */}
        <div className="flex justify-center gap-4">
          {!isActive ? (
            <Button onClick={handleStart} size="lg" className="px-8">
              <Play className="w-5 h-5 mr-2" />
              {cycleCount === 0 ? 'Start' : 'Resume'}
            </Button>
          ) : (
            <Button onClick={handlePause} variant="outline" size="lg" className="px-8">
              <Pause className="w-5 h-5 mr-2" />
              Pause
            </Button>
          )}
          <Button onClick={handleReset} variant="outline" size="lg">
            <RotateCcw className="w-5 h-5" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
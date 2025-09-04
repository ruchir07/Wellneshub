import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Play, Pause, RotateCcw, Clock } from 'lucide-react';

interface MeditationTimerProps {
  onComplete: (duration: number) => void;
}

export const MeditationTimer: React.FC<MeditationTimerProps> = ({ onComplete }) => {
  const [selectedDuration, setSelectedDuration] = useState(300); // 5 minutes default
  const [timeRemaining, setTimeRemaining] = useState(selectedDuration);
  const [isActive, setIsActive] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  const durations = [
    { label: '3 min', value: 180, points: 15 },
    { label: '5 min', value: 300, points: 25 },
    { label: '10 min', value: 600, points: 50 },
    { label: '15 min', value: 900, points: 75 },
    { label: '20 min', value: 1200, points: 100 }
  ];

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isActive && timeRemaining > 0) {
      interval = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            setIsActive(false);
            setIsCompleted(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isActive, timeRemaining]);

  useEffect(() => {
    if (isCompleted) {
      setTimeout(() => {
        onComplete(selectedDuration);
      }, 2000);
    }
  }, [isCompleted, selectedDuration, onComplete]);

  const handleStart = () => {
    setIsActive(true);
  };

  const handlePause = () => {
    setIsActive(false);
  };

  const handleReset = () => {
    setIsActive(false);
    setTimeRemaining(selectedDuration);
    setIsCompleted(false);
  };

  const handleDurationSelect = (duration: number) => {
    if (!isActive) {
      setSelectedDuration(duration);
      setTimeRemaining(duration);
      setIsCompleted(false);
    }
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const getProgressPercentage = () => {
    return ((selectedDuration - timeRemaining) / selectedDuration) * 100;
  };

  if (isCompleted) {
    const earnedPoints = durations.find(d => d.value === selectedDuration)?.points || 0;
    
    return (
      <Card className="max-w-2xl mx-auto">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl text-primary">Meditation Complete! 🧘‍♀️</CardTitle>
          <CardDescription>
            You've successfully completed your meditation session!
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <div className="text-lg text-muted-foreground">
            Duration: {formatTime(selectedDuration)}
          </div>
          <Badge className="text-lg px-4 py-2">
            +{earnedPoints} Points Earned!
          </Badge>
          <p className="text-muted-foreground">
            Regular meditation helps reduce stress, improve focus, and enhance overall well-being.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl">Meditation Timer</CardTitle>
        <CardDescription>
          Choose your meditation duration and find your inner peace
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-8">
        {/* Duration Selection */}
        {!isActive && timeRemaining === selectedDuration && (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-center">Select Duration</h3>
            <div className="grid grid-cols-3 md:grid-cols-5 gap-3">
              {durations.map((duration) => (
                <Button
                  key={duration.value}
                  variant={selectedDuration === duration.value ? "default" : "outline"}
                  onClick={() => handleDurationSelect(duration.value)}
                  className="flex flex-col h-16 p-2"
                >
                  <div className="font-semibold">{duration.label}</div>
                  <div className="text-xs opacity-75">{duration.points}pts</div>
                </Button>
              ))}
            </div>
          </div>
        )}

        {/* Timer Display */}
        <div className="text-center space-y-6">
          <div className="relative">
            <div className="w-48 h-48 mx-auto rounded-full border-8 border-muted flex items-center justify-center relative overflow-hidden">
              {/* Progress ring */}
              <div 
                className="absolute inset-0 rounded-full border-8 border-primary transition-all duration-1000"
                style={{
                  clipPath: `polygon(50% 50%, 50% 0%, ${50 + 50 * Math.cos((getProgressPercentage() / 100) * 2 * Math.PI - Math.PI / 2)}% ${50 + 50 * Math.sin((getProgressPercentage() / 100) * 2 * Math.PI - Math.PI / 2)}%, 100% 100%, 0% 100%)`
                }}
              />
              <div className="text-center z-10">
                <div className="text-4xl font-bold text-foreground">
                  {formatTime(timeRemaining)}
                </div>
                <div className="text-sm text-muted-foreground">
                  {isActive ? 'Meditating...' : 'Ready to start'}
                </div>
              </div>
            </div>
          </div>

          {/* Meditation Instructions */}
          {isActive && (
            <div className="space-y-2">
              <p className="text-lg text-muted-foreground">
                Close your eyes and focus on your breath
              </p>
              <p className="text-sm text-muted-foreground">
                Let thoughts come and go without judgment
              </p>
            </div>
          )}
        </div>

        {/* Controls */}
        <div className="flex justify-center gap-4">
          {!isActive ? (
            <Button onClick={handleStart} size="lg" className="px-8">
              <Play className="w-5 h-5 mr-2" />
              Start Meditation
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

        {/* Tips */}
        <div className="bg-muted/30 rounded-lg p-4 space-y-2">
          <div className="flex items-center gap-2 text-sm font-medium">
            <Clock className="w-4 h-4" />
            Meditation Tips
          </div>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li>• Find a quiet, comfortable place to sit</li>
            <li>• Keep your back straight but relaxed</li>
            <li>• Focus on your natural breathing rhythm</li>
            <li>• It's normal for your mind to wander - gently bring attention back</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};
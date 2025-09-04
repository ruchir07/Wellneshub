import React, { useState, useEffect } from 'react';
import { Navigation } from '@/components/Navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { GameCard } from '@/components/GameCard';
import { RewardSystem } from '@/components/RewardSystem';
import { BreathingGame } from '@/components/games/BreathingGame';
import { MeditationTimer } from '@/components/games/MeditationTimer';
import { GratitudeJournal } from '@/components/games/GratitudeJournal';
import { Trophy, Star, Target, Brain } from 'lucide-react';

const MindfulGames = () => {
  const [userPoints, setUserPoints] = useState(240);
  const [userLevel, setUserLevel] = useState(3);
  const [dailyStreak, setDailyStreak] = useState(7);
  const [activeGame, setActiveGame] = useState<string | null>(null);

  const games = [
    {
      id: 'breathing',
      title: 'Mindful Breathing',
      description: 'Follow the guided breathing exercise to calm your mind',
      icon: Brain,
      points: 25,
      duration: '3-5 min',
      difficulty: 'Easy',
      color: 'text-primary'
    },
    {
      id: 'meditation',
      title: 'Meditation Timer',
      description: 'Set a timer for peaceful meditation session',
      icon: Target,
      points: 30,
      duration: '5-20 min',
      difficulty: 'Medium',
      color: 'text-secondary'
    },
    {
      id: 'gratitude',
      title: 'Gratitude Journal',
      description: 'Write down things you are grateful for today',
      icon: Star,
      points: 20,
      duration: '2-3 min',
      difficulty: 'Easy',
      color: 'text-accent'
    }
  ];

  const addPoints = (points: number) => {
    setUserPoints(prev => {
      const newPoints = prev + points;
      // Level up every 100 points
      const newLevel = Math.floor(newPoints / 100) + 1;
      if (newLevel > userLevel) {
        setUserLevel(newLevel);
      }
      return newPoints;
    });
  };

  const renderActiveGame = () => {
    switch (activeGame) {
      case 'breathing':
        return <BreathingGame onComplete={() => { addPoints(25); setActiveGame(null); }} />;
      case 'meditation':
        return <MeditationTimer onComplete={(duration) => { addPoints(Math.floor(duration / 60) * 5); setActiveGame(null); }} />;
      case 'gratitude':
        return <GratitudeJournal onComplete={() => { addPoints(20); setActiveGame(null); }} />;
      default:
        return null;
    }
  };

  if (activeGame) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-muted/30">
        <Navigation />
        <div className="pt-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <Button 
              variant="outline" 
              onClick={() => setActiveGame(null)}
              className="mb-6"
            >
              ← Back to Games
            </Button>
            {renderActiveGame()}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/30">
      <Navigation />
      <div className="pt-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center space-y-4 mb-12">
            <h1 className="text-4xl lg:text-5xl font-bold text-foreground">
              Mindful Games
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Play daily mindfulness activities to reduce stress and earn rewards while building healthy habits.
            </p>
          </div>

          {/* Reward System */}
          <RewardSystem 
            userPoints={userPoints}
            userLevel={userLevel}
            dailyStreak={dailyStreak}
          />

          {/* Games Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
            {games.map((game) => (
              <GameCard
                key={game.id}
                game={game}
                onPlay={() => setActiveGame(game.id)}
              />
            ))}
          </div>

          {/* Daily Challenge */}
          <Card className="mt-12 border-primary/20 bg-gradient-to-r from-primary/5 to-secondary/5">
            <CardHeader>
              <div className="flex items-center gap-3">
                <Trophy className="w-8 h-8 text-primary" />
                <div>
                  <CardTitle className="text-2xl">Daily Challenge</CardTitle>
                  <CardDescription>Complete today's special challenge for bonus points!</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-lg mb-2">Mindful Moments Streak</h3>
                  <p className="text-muted-foreground mb-4">
                    Complete all three activities today to maintain your streak
                  </p>
                  <div className="flex items-center gap-4">
                    <Badge variant="secondary">+50 Bonus Points</Badge>
                    <Badge variant="outline">Streak: {dailyStreak} days</Badge>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-primary">2/3</div>
                  <div className="text-sm text-muted-foreground">Activities Done</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default MindfulGames;
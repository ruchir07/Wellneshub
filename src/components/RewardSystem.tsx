import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Trophy, Star, Flame, Target } from 'lucide-react';

interface RewardSystemProps {
  userPoints: number;
  userLevel: number;
  dailyStreak: number;
}

export const RewardSystem: React.FC<RewardSystemProps> = ({ 
  userPoints, 
  userLevel, 
  dailyStreak 
}) => {
  const pointsToNextLevel = 100 - (userPoints % 100);
  const progressToNextLevel = (userPoints % 100);
  
  const getLevelBadge = (level: number) => {
    if (level >= 10) return { name: 'Zen Master', color: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200' };
    if (level >= 7) return { name: 'Mindful Guide', color: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200' };
    if (level >= 5) return { name: 'Peace Seeker', color: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' };
    if (level >= 3) return { name: 'Wellness Explorer', color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' };
    return { name: 'Mindful Beginner', color: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200' };
  };

  const levelBadge = getLevelBadge(userLevel);

  return (
    <div className="grid md:grid-cols-3 gap-6 mb-8">
      {/* Level Progress */}
      <Card className="border-primary/20">
        <CardHeader>
          <div className="flex items-center gap-3">
            <Trophy className="w-6 h-6 text-primary" />
            <div>
              <CardTitle className="text-lg">Level {userLevel}</CardTitle>
              <CardDescription>Your mindfulness journey</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <Badge className={levelBadge.color}>
            {levelBadge.name}
          </Badge>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Progress to Level {userLevel + 1}</span>
              <span>{pointsToNextLevel} pts needed</span>
            </div>
            <Progress value={progressToNextLevel} className="h-2" />
          </div>
        </CardContent>
      </Card>

      {/* Total Points */}
      <Card className="border-secondary/20">
        <CardHeader>
          <div className="flex items-center gap-3">
            <Star className="w-6 h-6 text-secondary fill-current" />
            <div>
              <CardTitle className="text-lg">{userPoints.toLocaleString()}</CardTitle>
              <CardDescription>Total points earned</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-sm text-muted-foreground">
            Keep playing daily activities to earn more points and unlock new levels!
          </div>
        </CardContent>
      </Card>

      {/* Daily Streak */}
      <Card className="border-accent/20">
        <CardHeader>
          <div className="flex items-center gap-3">
            <Flame className="w-6 h-6 text-accent" />
            <div>
              <CardTitle className="text-lg">{dailyStreak} Days</CardTitle>
              <CardDescription>Current streak</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2">
            <Target className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">
              Goal: Complete at least one activity daily
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
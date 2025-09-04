import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Clock, Star, LucideIcon } from 'lucide-react';

interface Game {
  id: string;
  title: string;
  description: string;
  icon: LucideIcon;
  points: number;
  duration: string;
  difficulty: string;
  color: string;
}

interface GameCardProps {
  game: Game;
  onPlay: () => void;
}

export const GameCard: React.FC<GameCardProps> = ({ game, onPlay }) => {
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case 'easy':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'hard':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  return (
    <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-border/50">
      <CardHeader className="space-y-4">
        <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform">
          <game.icon className={`w-8 h-8 ${game.color}`} />
        </div>
        <div>
          <CardTitle className="text-xl font-semibold mb-2">
            {game.title}
          </CardTitle>
          <CardDescription className="text-muted-foreground leading-relaxed">
            {game.description}
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Clock className="w-4 h-4" />
            <span>{game.duration}</span>
          </div>
          <Badge className={getDifficultyColor(game.difficulty)}>
            {game.difficulty}
          </Badge>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1">
            <Star className="w-4 h-4 text-primary fill-current" />
            <span className="font-semibold text-primary">{game.points} pts</span>
          </div>
          <Button onClick={onPlay} className="px-6">
            Play Now
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
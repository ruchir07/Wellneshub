import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Heart, Star, CheckCircle } from 'lucide-react';

interface GratitudeJournalProps {
  onComplete: () => void;
}

export const GratitudeJournal: React.FC<GratitudeJournalProps> = ({ onComplete }) => {
  const [entries, setEntries] = useState(['', '', '']);
  const [isCompleted, setIsCompleted] = useState(false);

  const prompts = [
    "Something that made you smile today:",
    "A person you're grateful for and why:",
    "A small moment of joy you experienced:"
  ];

  const handleEntryChange = (index: number, value: string) => {
    const newEntries = [...entries];
    newEntries[index] = value;
    setEntries(newEntries);
  };

  const handleSubmit = () => {
    const filledEntries = entries.filter(entry => entry.trim().length > 0);
    if (filledEntries.length >= 2) {
      setIsCompleted(true);
      setTimeout(() => {
        onComplete();
      }, 2000);
    }
  };

  const getCompletedCount = () => {
    return entries.filter(entry => entry.trim().length > 0).length;
  };

  const canSubmit = () => {
    return getCompletedCount() >= 2;
  };

  if (isCompleted) {
    return (
      <Card className="max-w-2xl mx-auto">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl text-primary">Thank You! 💖</CardTitle>
          <CardDescription>
            Your gratitude practice is complete for today!
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <div className="flex justify-center">
            <CheckCircle className="w-16 h-16 text-green-500" />
          </div>
          <Badge className="text-lg px-4 py-2">
            +20 Points Earned!
          </Badge>
          <p className="text-muted-foreground">
            Practicing gratitude regularly can improve your mood, reduce stress, and enhance overall well-being.
          </p>
          <div className="bg-muted/30 rounded-lg p-4">
            <p className="text-sm text-muted-foreground italic">
              "Gratitude turns what we have into enough, and more. It turns denial into acceptance, 
              chaos into order, confusion into clarity."
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl flex items-center justify-center gap-2">
          <Heart className="w-6 h-6 text-red-500" />
          Gratitude Journal
        </CardTitle>
        <CardDescription>
          Reflect on the positive moments and people in your life. Fill out at least 2 entries.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Progress */}
        <div className="flex items-center justify-between mb-6">
          <div className="text-sm text-muted-foreground">
            Progress: {getCompletedCount()}/3 entries
          </div>
          <div className="flex gap-1">
            {entries.map((entry, index) => (
              <div
                key={index}
                className={`w-3 h-3 rounded-full ${
                  entry.trim().length > 0 ? 'bg-primary' : 'bg-muted'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Journal Entries */}
        <div className="space-y-6">
          {prompts.map((prompt, index) => (
            <div key={index} className="space-y-3">
              <div className="flex items-start gap-3">
                <Star className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                <div className="flex-1">
                  <label className="text-sm font-medium text-foreground block mb-2">
                    {prompt}
                  </label>
                  <Textarea
                    value={entries[index]}
                    onChange={(e) => handleEntryChange(index, e.target.value)}
                    placeholder="Write your thoughts here..."
                    className="resize-none min-h-[100px]"
                    maxLength={200}
                  />
                  <div className="text-xs text-muted-foreground mt-1 text-right">
                    {entries[index].length}/200 characters
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Inspirational Quote */}
        <div className="bg-gradient-to-r from-primary/5 to-secondary/5 rounded-lg p-4 border border-primary/20">
          <div className="text-center">
            <p className="text-sm text-muted-foreground italic mb-2">
              "Be thankful for what you have; you'll end up having more."
            </p>
            <p className="text-xs text-muted-foreground">- Oprah Winfrey</p>
          </div>
        </div>

        {/* Submit Button */}
        <div className="text-center">
          <Button 
            onClick={handleSubmit} 
            disabled={!canSubmit()}
            size="lg"
            className="px-8"
          >
            {canSubmit() ? 'Complete Gratitude Practice' : `Fill ${2 - getCompletedCount()} more entry(s)`}
          </Button>
          {canSubmit() && (
            <p className="text-sm text-muted-foreground mt-2">
              Click to earn your 20 gratitude points!
            </p>
          )}
        </div>

        {/* Benefits */}
        <div className="bg-muted/30 rounded-lg p-4 space-y-2">
          <div className="text-sm font-medium">Benefits of Gratitude Practice:</div>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li>• Improves mental health and reduces stress</li>
            <li>• Enhances sleep quality and overall well-being</li>
            <li>• Strengthens relationships and social connections</li>
            <li>• Increases resilience and positive thinking</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};
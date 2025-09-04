import React, { useState } from 'react';
import { Navigation } from '@/components/Navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { CheckCircle, ArrowLeft, ArrowRight } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const questions = [
  {
    id: 'mood',
    category: 'Daily Mood',
    question: 'How are you feeling today overall?',
    options: [
      { value: '0', label: 'Very low/depressed' },
      { value: '1', label: 'Low/down' },
      { value: '2', label: 'Neutral' },
      { value: '3', label: 'Good/positive' },
      { value: '4', label: 'Very good/excellent' }
    ]
  },
  {
    id: 'anxiety',
    category: 'Anxiety Level',
    question: 'How anxious or worried have you felt today?',
    options: [
      { value: '0', label: 'Not at all' },
      { value: '1', label: 'Slightly anxious' },
      { value: '2', label: 'Moderately anxious' },
      { value: '3', label: 'Very anxious' },
      { value: '4', label: 'Extremely anxious' }
    ]
  },
  {
    id: 'stress',
    category: 'Stress Level',
    question: 'How stressed have you felt about your studies or personal life?',
    options: [
      { value: '0', label: 'No stress' },
      { value: '1', label: 'Mild stress' },
      { value: '2', label: 'Moderate stress' },
      { value: '3', label: 'High stress' },
      { value: '4', label: 'Overwhelming stress' }
    ]
  },
  {
    id: 'sleep',
    category: 'Sleep Quality',
    question: 'How would you rate your sleep quality last night?',
    options: [
      { value: '0', label: 'Very poor' },
      { value: '1', label: 'Poor' },
      { value: '2', label: 'Fair' },
      { value: '3', label: 'Good' },
      { value: '4', label: 'Excellent' }
    ]
  },
  {
    id: 'energy',
    category: 'Energy Level',
    question: 'How energetic do you feel today?',
    options: [
      { value: '0', label: 'No energy at all' },
      { value: '1', label: 'Low energy' },
      { value: '2', label: 'Moderate energy' },
      { value: '3', label: 'Good energy' },
      { value: '4', label: 'High energy' }
    ]
  }
];

const CheckIn = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [isCompleted, setIsCompleted] = useState(false);
  const { toast } = useToast();

  const progress = ((currentQuestion + 1) / questions.length) * 100;

  const handleAnswer = (questionId: string, value: string) => {
    setAnswers(prev => ({ ...prev, [questionId]: value }));
  };

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    } else {
      handleComplete();
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1);
    }
  };

  const handleComplete = () => {
    setIsCompleted(true);
    toast({
      title: "Check-in Complete!",
      description: "Thank you for taking time to check in with yourself today.",
    });
  };

  const currentQ = questions[currentQuestion];
  const currentAnswer = answers[currentQ?.id];

  if (isCompleted) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="max-w-2xl mx-auto px-4 py-20">
          <Card className="text-center space-y-6">
            <CardHeader className="space-y-4">
              <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center mx-auto">
                <CheckCircle className="w-8 h-8 text-white" />
              </div>
              <CardTitle className="text-2xl">Check-in Complete!</CardTitle>
              <CardDescription className="text-lg">
                Thank you for taking time to check in with your mental health today.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="bg-wellness p-6 rounded-lg">
                <h3 className="font-semibold text-wellness-foreground mb-2">Your Wellness Score Today</h3>
                <div className="text-3xl font-bold text-wellness-foreground">
                  {Math.round((Object.values(answers).reduce((sum, val) => sum + parseInt(val), 0) / (questions.length * 4)) * 100)}%
                </div>
              </div>
              <div className="flex gap-4">
                <Button variant="hero" className="flex-1">
                  View Insights
                </Button>
                <Button variant="wellness" className="flex-1">
                  Talk to Counselor
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="max-w-2xl mx-auto px-4 py-12">
        <div className="space-y-6">
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <span>Question {currentQuestion + 1} of {questions.length}</span>
              <span>{Math.round(progress)}% Complete</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          <Card>
            <CardHeader>
              <div className="text-sm font-medium text-primary mb-2">
                {currentQ.category}
              </div>
              <CardTitle className="text-xl leading-relaxed">
                {currentQ.question}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <RadioGroup
                value={currentAnswer || ''}
                onValueChange={(value) => handleAnswer(currentQ.id, value)}
                className="space-y-3"
              >
                {currentQ.options.map((option) => (
                  <div key={option.value} className="flex items-center space-x-3">
                    <RadioGroupItem value={option.value} id={option.value} />
                    <Label 
                      htmlFor={option.value} 
                      className="flex-1 cursor-pointer py-3 px-4 rounded-lg hover:bg-muted/50 transition-colors"
                    >
                      {option.label}
                    </Label>
                  </div>
                ))}
              </RadioGroup>

              <div className="flex gap-3 pt-4">
                <Button
                  variant="outline"
                  onClick={handlePrevious}
                  disabled={currentQuestion === 0}
                  className="flex-1"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Previous
                </Button>
                <Button
                  variant="hero"
                  onClick={handleNext}
                  disabled={!currentAnswer}
                  className="flex-1"
                >
                  {currentQuestion === questions.length - 1 ? 'Complete' : 'Next'}
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CheckIn;
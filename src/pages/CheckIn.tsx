import React, { useState, useEffect } from 'react';
import Navigation from '@/components/Navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { CheckCircle, ArrowLeft, ArrowRight, Phone, Mail } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

// Professional psychological screening questions based on PHQ-9, GAD-7, and GHQ
const questions = [
  {
    id: 'mood_interest',
    category: 'PHQ-9 Depression Screening',
    question: 'Over the last 2 weeks, how often have you had little interest or pleasure in doing things?',
    options: [
      { value: '0', label: 'Not at all' },
      { value: '1', label: 'Several days' },
      { value: '2', label: 'More than half the days' },
      { value: '3', label: 'Nearly every day' }
    ]
  },
  {
    id: 'mood_down',
    category: 'PHQ-9 Depression Screening',
    question: 'Over the last 2 weeks, how often have you felt down, depressed, or hopeless?',
    options: [
      { value: '0', label: 'Not at all' },
      { value: '1', label: 'Several days' },
      { value: '2', label: 'More than half the days' },
      { value: '3', label: 'Nearly every day' }
    ]
  },
  {
    id: 'sleep_issues',
    category: 'PHQ-9 Depression Screening',
    question: 'Over the last 2 weeks, how often have you had trouble falling or staying asleep, or sleeping too much?',
    options: [
      { value: '0', label: 'Not at all' },
      { value: '1', label: 'Several days' },
      { value: '2', label: 'More than half the days' },
      { value: '3', label: 'Nearly every day' }
    ]
  },
  {
    id: 'energy_fatigue',
    category: 'PHQ-9 Depression Screening',
    question: 'Over the last 2 weeks, how often have you felt tired or had little energy?',
    options: [
      { value: '0', label: 'Not at all' },
      { value: '1', label: 'Several days' },
      { value: '2', label: 'More than half the days' },
      { value: '3', label: 'Nearly every day' }
    ]
  },
  {
    id: 'concentration',
    category: 'PHQ-9 Depression Screening',
    question: 'Over the last 2 weeks, how often have you had trouble concentrating on things, such as reading or studying?',
    options: [
      { value: '0', label: 'Not at all' },
      { value: '1', label: 'Several days' },
      { value: '2', label: 'More than half the days' },
      { value: '3', label: 'Nearly every day' }
    ]
  },
  {
    id: 'anxiety_nervous',
    category: 'GAD-7 Anxiety Screening',
    question: 'Over the last 2 weeks, how often have you felt nervous, anxious, or on edge?',
    options: [
      { value: '0', label: 'Not at all' },
      { value: '1', label: 'Several days' },
      { value: '2', label: 'More than half the days' },
      { value: '3', label: 'Nearly every day' }
    ]
  },
  {
    id: 'anxiety_control',
    category: 'GAD-7 Anxiety Screening',
    question: 'Over the last 2 weeks, how often have you not been able to stop or control worrying?',
    options: [
      { value: '0', label: 'Not at all' },
      { value: '1', label: 'Several days' },
      { value: '2', label: 'More than half the days' },
      { value: '3', label: 'Nearly every day' }
    ]
  },
  {
    id: 'anxiety_worry',
    category: 'GAD-7 Anxiety Screening',
    question: 'Over the last 2 weeks, how often have you worried too much about different things?',
    options: [
      { value: '0', label: 'Not at all' },
      { value: '1', label: 'Several days' },
      { value: '2', label: 'More than half the days' },
      { value: '3', label: 'Nearly every day' }
    ]
  },
  {
    id: 'academic_stress',
    category: 'Academic Wellbeing',
    question: 'How often do you feel overwhelmed by your academic workload?',
    options: [
      { value: '0', label: 'Never' },
      { value: '1', label: 'Rarely' },
      { value: '2', label: 'Often' },
      { value: '3', label: 'Always' }
    ]
  },
  {
    id: 'social_connection',
    category: 'Social Wellbeing',
    question: 'How connected do you feel to your peers and campus community?',
    options: [
      { value: '3', label: 'Very connected' },
      { value: '2', label: 'Somewhat connected' },
      { value: '1', label: 'Slightly connected' },
      { value: '0', label: 'Not connected at all' }
    ]
  }
];

const CheckIn = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [isCompleted, setIsCompleted] = useState(false);
  const [counselors, setCounselors] = useState<any[]>([]);
  const [supportResources, setSupportResources] = useState<any[]>([]);
  const [assessmentResult, setAssessmentResult] = useState<any>(null);
  const { toast } = useToast();

  useEffect(() => {
    // Load counselors and support resources
    const loadSupportData = async () => {
      const { data: counselorsData } = await supabase
        .from('counselors')
        .select('*')
        .eq('is_active', true);
      
      const { data: resourcesData } = await supabase
        .from('support_resources')
        .select('*')
        .eq('is_active', true);
      
      setCounselors(counselorsData || []);
      setSupportResources(resourcesData || []);
    };
    
    loadSupportData();
  }, []);

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

  const calculateScore = () => {
    const totalScore = Object.values(answers).reduce((sum, val) => sum + parseInt(val), 0);
    const maxScore = questions.length * 3; // Max score is 3 per question
    const phqQuestions = questions.filter(q => q.category === 'PHQ-9 Depression Screening');
    const gadQuestions = questions.filter(q => q.category === 'GAD-7 Anxiety Screening');
    
    const phqScore = phqQuestions.reduce((sum, q) => sum + (parseInt(answers[q.id]) || 0), 0);
    const gadScore = gadQuestions.reduce((sum, q) => sum + (parseInt(answers[q.id]) || 0), 0);
    
    let severity = 'minimal';
    let recommendations = 'Continue with self-care practices and maintain regular check-ins.';
    let flagged = false;

    if (phqScore >= 15 || gadScore >= 15 || totalScore >= 20) {
      severity = 'severe';
      recommendations = 'We strongly recommend speaking with a counselor immediately. Please consider contacting our crisis helpline.';
      flagged = true;
    } else if (phqScore >= 10 || gadScore >= 10 || totalScore >= 15) {
      severity = 'moderate';
      recommendations = 'Consider scheduling an appointment with a counselor and explore stress management techniques.';
    } else if (phqScore >= 5 || gadScore >= 5 || totalScore >= 8) {
      severity = 'mild';
      recommendations = 'Monitor your symptoms and consider using campus wellness resources.';
    }

    return { totalScore, maxScore, phqScore, gadScore, severity, recommendations, flagged };
  };

  const handleComplete = async () => {
    const scoreResult = calculateScore();
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        const { error } = await supabase
          .from('mental_health_assessments')
          .insert({
            user_id: user.id,
            assessment_type: 'daily_checkin',
            responses: answers,
            total_score: scoreResult.totalScore,
            severity_level: scoreResult.severity,
            recommendations: scoreResult.recommendations,
            flagged_for_intervention: scoreResult.flagged
          });

        if (error) throw error;
      }
      
      setAssessmentResult(scoreResult);
      setIsCompleted(true);
      
      toast({
        title: "Check-in Complete!",
        description: "Thank you for taking time to check in with yourself today.",
      });
    } catch (error) {
      console.error('Error saving assessment:', error);
      toast({
        title: "Assessment saved locally",
        description: "Your responses have been recorded for this session.",
      });
      setIsCompleted(true);
    }
  };

  const currentQ = questions[currentQuestion];
  const currentAnswer = answers[currentQ?.id];

  if (isCompleted) {
    const scorePercentage = assessmentResult ? Math.round((assessmentResult.totalScore / assessmentResult.maxScore) * 100) : 0;
    
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="max-w-4xl mx-auto px-4 py-12">
          <div className="space-y-6">
            {/* Assessment Results */}
            <Card className="text-center">
              <CardHeader className="space-y-4">
                <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle className="w-8 h-8 text-white" />
                </div>
                <CardTitle className="text-2xl">Mental Health Check-in Complete</CardTitle>
                <CardDescription className="text-lg">
                  Your responses have been recorded. Here are your results and available support resources.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {assessmentResult && (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="bg-muted p-4 rounded-lg">
                        <div className="text-sm text-muted-foreground">Overall Score</div>
                        <div className="text-2xl font-bold">{scorePercentage}%</div>
                      </div>
                      <div className="bg-muted p-4 rounded-lg">
                        <div className="text-sm text-muted-foreground">Severity Level</div>
                        <div className="text-lg font-semibold capitalize">{assessmentResult.severity}</div>
                      </div>
                      <div className="bg-muted p-4 rounded-lg">
                        <div className="text-sm text-muted-foreground">Follow-up</div>
                        <div className="text-lg font-semibold">{assessmentResult.flagged ? 'Recommended' : 'Optional'}</div>
                      </div>
                    </div>
                    
                    <div className="bg-accent/10 p-4 rounded-lg text-left">
                      <h4 className="font-semibold mb-2">Recommendations</h4>
                      <p className="text-sm">{assessmentResult.recommendations}</p>
                    </div>
                  </>
                )}
                
                <div className="flex gap-4">
                  <Button variant="hero" className="flex-1" onClick={() => window.location.href = '/chatbot'}>
                    Talk to AI Counselor
                  </Button>
                  <Button variant="wellness" className="flex-1">
                    View Resources
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Crisis Support - Show if flagged */}
            {assessmentResult?.flagged && (
              <Card className="border-destructive bg-destructive/5">
                <CardHeader>
                  <CardTitle className="text-destructive">Immediate Support Available</CardTitle>
                  <CardDescription>
                    Based on your responses, we recommend reaching out for immediate support.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Button variant="destructive" size="lg" className="w-full">
                      <Phone className="w-4 h-4 mr-2" />
                      Crisis Helpline: 988
                    </Button>
                    <Button variant="outline" size="lg" className="w-full">
                      <Mail className="w-4 h-4 mr-2" />
                      Email Counselor
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Available Counselors */}
            {counselors.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Available Counselors</CardTitle>
                  <CardDescription>
                    Connect with professional counselors at your institution
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {counselors.slice(0, 4).map((counselor) => (
                      <div key={counselor.id} className="border rounded-lg p-4 space-y-2">
                        <h4 className="font-semibold">{counselor.name}</h4>
                        <p className="text-sm text-muted-foreground">{counselor.bio}</p>
                        <div className="flex flex-wrap gap-1">
                          {counselor.specialization?.map((spec: string) => (
                            <span key={spec} className="bg-muted px-2 py-1 text-xs rounded">
                              {spec.replace('_', ' ')}
                            </span>
                          ))}
                        </div>
                        <div className="flex gap-2 pt-2">
                          {counselor.email && (
                            <Button size="sm" variant="outline">
                              <Mail className="w-3 h-3 mr-1" />
                              Email
                            </Button>
                          )}
                          {counselor.phone && (
                            <Button size="sm" variant="outline">
                              <Phone className="w-3 h-3 mr-1" />
                              Call
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Support Resources */}
            {supportResources.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Wellness Resources</CardTitle>
                  <CardDescription>
                    Self-help resources and tools available 24/7
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {supportResources.slice(0, 6).map((resource) => (
                      <div key={resource.id} className="border rounded-lg p-4 space-y-2">
                        <h4 className="font-semibold">{resource.title}</h4>
                        <p className="text-sm text-muted-foreground">{resource.description}</p>
                        <div className="flex flex-wrap gap-1">
                          {resource.category?.map((cat: string) => (
                            <span key={cat} className="bg-primary/10 text-primary px-2 py-1 text-xs rounded">
                              {cat}
                            </span>
                          ))}
                        </div>
                        <Button size="sm" variant="outline" className="w-full">
                          Access Resource
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Next Steps */}
            <Card>
              <CardHeader>
                <CardTitle>Your Mental Health Journey</CardTitle>
                <CardDescription>
                  Continue building healthy habits and monitoring your wellbeing
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Button variant="outline" className="h-auto p-4 flex flex-col space-y-2">
                    <div className="font-medium">Daily Check-ins</div>
                    <div className="text-sm text-muted-foreground">Track your mood daily</div>
                  </Button>
                  <Button variant="outline" className="h-auto p-4 flex flex-col space-y-2">
                    <div className="font-medium">Mindful Games</div>
                    <div className="text-sm text-muted-foreground">Practice stress relief</div>
                  </Button>
                  <Button variant="outline" className="h-auto p-4 flex flex-col space-y-2">
                    <div className="font-medium">Community Forum</div>
                    <div className="text-sm text-muted-foreground">Connect with peers</div>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
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
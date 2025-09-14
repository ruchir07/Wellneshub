/**
 * Voice Emotion Analysis Component
 * 
 * DEVELOPMENT MODE: Uses direct API calls to local Python ML server (localhost:5000)
 * PROTOTYPE MODE: Uncomment Supabase Edge Function calls for cloud deployment
 * 
 * To switch to prototype mode:
 * 1. Deploy Supabase Edge Functions: npx supabase functions deploy voice-emotion
 * 2. Deploy Supabase Edge Functions: npx supabase functions deploy federated-update  
 * 3. Comment out the direct API calls (lines ~112-128 and ~194-216)
 * 4. Uncomment the Supabase function calls (lines ~99-109 and ~174-189)
 */

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Mic, 
  MicOff, 
  Play, 
  Pause, 
  RotateCcw, 
  CheckCircle, 
  XCircle, 
  AlertCircle,
  Volume2,
  Brain,
  Heart
} from 'lucide-react';
import { useVoiceRecording } from '@/hooks/useVoiceRecording';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface EmotionPrediction {
  emotion: string;
  confidence: number;
  mentalHealth: {
    status: string;
    severity: string;
    suggestion: string;
  };
  timestamp: string;
  requiresConfirmation: boolean;
}

interface VoiceEmotionProps {
  userId: string;
  onEmotionConfirmed?: (emotion: string, mentalHealthStatus: string) => void;
}

const VoiceEmotion: React.FC<VoiceEmotionProps> = ({ userId, onEmotionConfirmed }) => {
  const [prediction, setPrediction] = useState<EmotionPrediction | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioElement, setAudioElement] = useState<HTMLAudioElement | null>(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [isConfirming, setIsConfirming] = useState(false);
  const { toast } = useToast();

  const {
    isRecording,
    isProcessing,
    audioBlob,
    audioURL,
    duration,
    error,
    startRecording,
    stopRecording,
    resetRecording,
    convertToBase64,
    clearError,
    cleanup
  } = useVoiceRecording();

  // Cleanup on unmount
  useEffect(() => {
    return cleanup;
  }, [cleanup]);

  // Create audio element when audioURL is available
  useEffect(() => {
    if (audioURL) {
      const audio = new Audio(audioURL);
      audio.onended = () => setIsPlaying(false);
      setAudioElement(audio);
      return () => {
        audio.pause();
        setIsPlaying(false);
      };
    }
  }, [audioURL]);

  const handlePlayPause = () => {
    if (!audioElement) return;

    if (isPlaying) {
      audioElement.pause();
      setIsPlaying(false);
    } else {
      audioElement.play();
      setIsPlaying(true);
    }
  };

  const predictEmotion = async () => {
    if (!audioBlob) return;

    try {
      const audioBase64 = await convertToBase64(audioBlob);
      
      // TODO: For prototype deployment, uncomment Supabase Edge Functions:
      /*
      const { data, error } = await supabase.functions.invoke('voice-emotion', {
        body: {
          audioData: audioBase64,
          userId: userId
        }
      });

      if (error) throw error;
      */
      
      // For local development - Direct call to Python ML server
      const response = await fetch('http://localhost:5000/predict', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          audioData: audioBase64,
          userId: userId
        })
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      data.timestamp = new Date().toISOString(); // Add timestamp

      setPrediction(data);
      setShowConfirmation(true);
      
      toast({
        title: "🧠 Emotion Detected",
        description: `We detected ${data.emotion} with ${Math.round(data.confidence * 100)}% confidence`,
      });
    } catch (err) {
      console.error('Emotion prediction failed:', err);
      toast({
        title: "Prediction Failed",
        description: "Unable to analyze your voice. Please make sure the ML server is running on port 5000.",
        variant: "destructive"
      });
    }
  };

  const confirmEmotion = async (isCorrect: boolean) => {
    if (!prediction || !audioBlob) return;

    setIsConfirming(true);
    
    try {
      const confirmedEmotion = isCorrect ? prediction.emotion : 'Incorrect_Prediction';
      
      // Store locally first
      const voiceSession = {
        id: `voice_${Date.now()}`,
        userId,
        originalEmotion: prediction.emotion,
        confirmedEmotion,
        confidence: prediction.confidence,
        timestamp: prediction.timestamp,
        audioData: await convertToBase64(audioBlob),
        mentalHealthStatus: prediction.mentalHealth.status
      };

      // Store in localStorage
      const existingSessions = JSON.parse(localStorage.getItem('voiceEmotionSessions') || '[]');
      existingSessions.push(voiceSession);
      localStorage.setItem('voiceEmotionSessions', JSON.stringify(existingSessions));

      // Send to federated learning server
      // TODO: For prototype deployment, uncomment Supabase Edge Functions:
      /*
      const { data, error } = await supabase.functions.invoke('federated-update', {
        body: {
          userId,
          voiceData: await convertToBase64(audioBlob),
          confirmedEmotion,
          originalEmotion: prediction.emotion,
          confidence: prediction.confidence
        }
      });

      if (error) {
        console.warn('Federated learning update failed, will retry later:', error);
      } else {
        console.log('Federated learning update successful:', data);
      }
      */
      
      // For local development - Direct call to Python ML server
      try {
        const response = await fetch('http://localhost:5000/federated-update', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            userId,
            voiceData: await convertToBase64(audioBlob),
            confirmedEmotion,
            originalEmotion: prediction.emotion,
            confidence: prediction.confidence
          })
        });
        
        if (response.ok) {
          const data = await response.json();
          console.log('Federated learning update successful:', data);
        } else {
          console.warn('Federated learning update failed, will retry later');
        }
      } catch (error) {
        console.warn('Federated learning update failed:', error);
      }

      // Notify parent component
      if (onEmotionConfirmed) {
        onEmotionConfirmed(confirmedEmotion, prediction.mentalHealth.status);
      }

      toast({
        title: isCorrect ? "✅ Emotion Confirmed" : "🔄 Feedback Recorded",
        description: isCorrect 
          ? "Thanks for confirming! This helps improve our AI." 
          : "Thanks for the correction! Our model will learn from this.",
      });

      // Reset state
      setShowConfirmation(false);
      setPrediction(null);
      resetRecording();

    } catch (err) {
      console.error('Confirmation failed:', err);
      toast({
        title: "Confirmation Failed",
        description: "Unable to save your feedback. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsConfirming(false);
    }
  };

  const handleReset = () => {
    setPrediction(null);
    setShowConfirmation(false);
    resetRecording();
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'none': return 'bg-green-100 text-green-800';
      case 'mild': return 'bg-yellow-100 text-yellow-800';
      case 'moderate': return 'bg-orange-100 text-orange-800';
      case 'severe': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (error) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardContent className="pt-6">
          <div className="text-center space-y-4">
            <AlertCircle className="w-12 h-12 text-destructive mx-auto" />
            <div>
              <h3 className="font-semibold text-destructive">Recording Error</h3>
              <p className="text-sm text-muted-foreground mt-1">{error}</p>
            </div>
            <Button onClick={clearError} variant="outline">
              Try Again
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Brain className="w-5 h-5 text-primary" />
          Voice Emotion Analysis
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Recording Controls */}
        <div className="text-center space-y-4">
          {!isRecording && !audioBlob && (
            <div className="space-y-3">
              <div className="w-20 h-20 mx-auto bg-primary/10 rounded-full flex items-center justify-center">
                <Mic className="w-8 h-8 text-primary" />
              </div>
              <p className="text-sm text-muted-foreground">
                Record your voice to analyze your emotions
              </p>
              <Button onClick={startRecording} size="lg" className="w-full">
                <Mic className="w-4 h-4 mr-2" />
                Start Recording
              </Button>
            </div>
          )}

          {isRecording && (
            <div className="space-y-4">
              <div className="w-20 h-20 mx-auto bg-red-100 rounded-full flex items-center justify-center animate-pulse">
                <Mic className="w-8 h-8 text-red-600" />
              </div>
              <div className="space-y-2">
                <p className="text-lg font-semibold text-red-600">
                  Recording... {duration}s
                </p>
                <Progress value={(duration / 10) * 100} className="w-full" />
                <p className="text-xs text-muted-foreground">
                  Speak naturally about how you're feeling
                </p>
              </div>
              <Button onClick={stopRecording} variant="destructive" size="lg" className="w-full">
                <MicOff className="w-4 h-4 mr-2" />
                Stop Recording
              </Button>
            </div>
          )}

          {audioBlob && !showConfirmation && (
            <div className="space-y-4">
              <div className="flex items-center justify-center gap-4">
                <Button 
                  onClick={handlePlayPause} 
                  variant="outline" 
                  size="sm"
                  className="flex items-center gap-2"
                >
                  {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                  {isPlaying ? 'Pause' : 'Play'}
                </Button>
                <Button 
                  onClick={handleReset} 
                  variant="ghost" 
                  size="sm"
                  className="flex items-center gap-2"
                >
                  <RotateCcw className="w-4 h-4" />
                  Reset
                </Button>
              </div>
              
              <Button 
                onClick={predictEmotion} 
                disabled={isProcessing}
                size="lg" 
                className="w-full"
              >
                {isProcessing ? (
                  <>
                    <Brain className="w-4 h-4 mr-2 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Brain className="w-4 h-4 mr-2" />
                    Analyze Emotion
                  </>
                )}
              </Button>
            </div>
          )}
        </div>

        {/* Emotion Prediction Results */}
        {showConfirmation && prediction && (
          <div className="space-y-4 p-4 bg-muted/30 rounded-lg">
            <div className="text-center space-y-3">
              <div className="w-16 h-16 mx-auto bg-primary/10 rounded-full flex items-center justify-center">
                <Heart className="w-8 h-8 text-primary" />
              </div>
              
              <div>
                <h3 className="text-xl font-bold text-primary">
                  {prediction.emotion}
                </h3>
                <p className="text-sm text-muted-foreground">
                  Confidence: {Math.round(prediction.confidence * 100)}%
                </p>
              </div>

              <div className="space-y-2">
                <Badge className={getSeverityColor(prediction.mentalHealth.severity)}>
                  {prediction.mentalHealth.status.replace(/_/g, ' ').toUpperCase()}
                </Badge>
                <p className="text-sm text-muted-foreground">
                  {prediction.mentalHealth.suggestion}
                </p>
              </div>
            </div>

            <div className="space-y-3">
              <p className="text-sm font-medium text-center">
                Is this emotion detection accurate?
              </p>
              <div className="flex gap-2">
                <Button 
                  onClick={() => confirmEmotion(true)}
                  disabled={isConfirming}
                  className="flex-1"
                  variant="default"
                >
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Yes, Correct
                </Button>
                <Button 
                  onClick={() => confirmEmotion(false)}
                  disabled={isConfirming}
                  className="flex-1"
                  variant="outline"
                >
                  <XCircle className="w-4 h-4 mr-2" />
                  No, Wrong
                </Button>
              </div>
              {isConfirming && (
                <p className="text-xs text-center text-muted-foreground">
                  Saving feedback and updating AI model...
                </p>
              )}
            </div>
          </div>
        )}

        {/* Help Text */}
        {!isRecording && !audioBlob && (
          <div className="text-center">
            <p className="text-xs text-muted-foreground">
              Your voice data is processed locally and helps improve our AI while protecting your privacy.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default VoiceEmotion;

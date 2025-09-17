import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Emotion labels matching the CNN model training
const EMOTION_LABELS = [
  'Anger', 'Disgust', 'Fear', 'Happiness', 'Neutral', 'Sadness', 'Surprise'
];

// Mental health status mapping for emotions
const EMOTION_MENTAL_HEALTH_MAPPING = {
  'Anger': { status: 'elevated_stress', severity: 'moderate', suggestion: 'Consider anger management techniques' },
  'Disgust': { status: 'emotional_discomfort', severity: 'mild', suggestion: 'Take time to process these feelings' },
  'Fear': { status: 'anxiety_symptoms', severity: 'moderate', suggestion: 'Try grounding exercises and seek support' },
  'Happiness': { status: 'positive_emotional_state', severity: 'none', suggestion: 'Great! Keep nurturing positive emotions' },
  'Neutral': { status: 'balanced_emotional_state', severity: 'none', suggestion: 'Maintain emotional balance with self-care' },
  'Sadness': { status: 'low_mood_indicators', severity: 'moderate', suggestion: 'Consider reaching out to supportive people' },
  'Surprise': { status: 'emotional_reactivity', severity: 'mild', suggestion: 'Take a moment to process unexpected feelings' }
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { audioData, userId } = await req.json();
    
    if (!audioData || !userId) {
      return new Response(
        JSON.stringify({ error: "Missing audioData or userId" }), 
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    console.log(`Processing voice emotion prediction for user ${userId}`);

    // Call your REAL VoiceBasedEmotionClassifier ML server - NO FALLBACK
    try {
      const mlServerUrl = Deno.env.get('ML_SERVER_URL') || 'http://localhost:5000';
      
      const mlServerResponse = await fetch(`${mlServerUrl}/predict`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          audioData: audioData,
          userId: userId
        })
      });

      if (!mlServerResponse.ok) {
        const errorText = await mlServerResponse.text();
        console.error(`Real ML server error: ${mlServerResponse.status} - ${errorText}`);
        return new Response(
          JSON.stringify({ 
            error: "Real ML server unavailable",
            message: "Voice emotion analysis requires the real ML server to be running. No predictions will be made with fake data.",
            serverStatus: mlServerResponse.status
          }),
          { 
            status: 503,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        );
      }

      const mlResult = await mlServerResponse.json();
      
      if (mlResult.error) {
        console.error('ML prediction error:', mlResult.error);
        return new Response(
          JSON.stringify({ 
            error: "ML prediction failed",
            message: mlResult.error
          }),
          { 
            status: 500,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        );
      }

      const response = {
        emotion: mlResult.emotion,
        confidence: mlResult.confidence,
        mentalHealth: mlResult.mentalHealth,
        timestamp: new Date().toISOString(),
        requiresConfirmation: true,
        modelVersion: mlResult.modelVersion,
        modelType: mlResult.modelType || 'VoiceBasedEmotionClassifier_CNN'
      };

      console.log(`REAL CNN prediction: ${mlResult.emotion} (confidence: ${mlResult.confidence.toFixed(3)})`);

      return new Response(
        JSON.stringify(response),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );

    } catch (mlError) {
      console.error('Failed to connect to real ML server:', mlError);
      
      // NO FALLBACK - Protect model integrity
      return new Response(
        JSON.stringify({ 
          error: "Real ML server connection failed",
          message: "Voice emotion analysis requires the real ML server. Please ensure your VoiceBasedEmotionClassifier server is running."
        }),
        { 
          status: 503,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

  } catch (error) {
    console.error('Voice emotion prediction error:', error);
    return new Response(
      JSON.stringify({ 
        error: "Voice emotion prediction failed",
        message: "Unable to process voice data. Please try again." 
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});

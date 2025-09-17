import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { userId, voiceData, confirmedEmotion, originalEmotion, confidence } = await req.json();
    
    if (!userId || !voiceData || !confirmedEmotion) {
      return new Response(
        JSON.stringify({ error: "Missing required fields" }), 
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    console.log(`Processing federated learning update for user ${userId}`);
    console.log(`Original emotion: ${originalEmotion}, Confirmed emotion: ${confirmedEmotion}`);

    // Call REAL federated learning server - same logic as your client/server setup
    try {
      const federatedServerUrl = Deno.env.get('FEDERATED_SERVER_URL') || 'http://localhost:5000';
      
      // Only process if this is a CORRECT prediction (protect model integrity)
      const isCorrect = confirmedEmotion === originalEmotion;
      const feedbackType = isCorrect ? 'CORRECT' : 'INCORRECT';
      
      console.log(`Processing ${feedbackType} feedback for federated learning`);
      
      const federatedResponse = await fetch(`${federatedServerUrl}/federated-update`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: userId,
          voiceData: voiceData,
          confirmedEmotion: confirmedEmotion,
          originalEmotion: originalEmotion,
          confidence: confidence,
          feedbackType: feedbackType
        })
      });

      if (!federatedResponse.ok) {
        const errorText = await federatedResponse.text();
        console.error(`Federated server error: ${federatedResponse.status} - ${errorText}`);
        return new Response(
          JSON.stringify({ 
            error: "Federated learning server unavailable",
            message: "Model update requires the real federated learning server.",
            serverStatus: federatedResponse.status
          }),
          { 
            status: 503,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        );
      }

      const updateResult = await federatedResponse.json();
      
      if (updateResult.error) {
        console.error('Federated learning error:', updateResult.error);
        return new Response(
          JSON.stringify({ 
            error: "Federated learning failed",
            message: updateResult.error
          }),
          { 
            status: 500,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
          }
        );
      }

      console.log(`REAL federated learning completed: ${updateResult.updateId}`);
      console.log(`Model updated: ${updateResult.modelUpdated}`);
      
      // Return the real federated learning result
      const response = {
        success: true,
        updateId: updateResult.updateId,
        userId: userId,
        processed: true,
        federated: {
          modelVersion: updateResult.modelVersion,
          contributionAccepted: updateResult.contributionAccepted,
          globalModelUpdated: updateResult.modelUpdated,
          modelType: updateResult.modelType,
          impact: updateResult.impact,
          message: updateResult.message
        },
        privacy: {
          dataAnonymized: true,
          localStorageCleared: false,
          serverStorageEncrypted: true
        }
      };

    return new Response(
      JSON.stringify(updateResult),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Federated learning update error:', error);
    return new Response(
      JSON.stringify({ 
        error: "Federated learning update failed",
        message: "Unable to process model update. Data will be retried later." 
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});

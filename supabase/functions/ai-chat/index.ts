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
    const { userId, message } = await req.json();
    
    if (!userId || !message) {
      return new Response(
        JSON.stringify({ error: "Missing userId or message" }), 
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    console.log(`Received message from user ${userId}: ${message}`);

    // Safety keywords check
    const unsafeKeywords = ["suicide", "kill myself", "end my life", "self harm", "want to die"];
    const flagged = unsafeKeywords.some((keyword) =>
      message.toLowerCase().includes(keyword)
    );

    if (flagged) {
      console.log("Message flagged for safety concerns");
      const botReply = "⚠️ I hear you're going through something very serious. Please reach out immediately to a trusted friend, family member, or a professional counselor. If you are in immediate danger, call your local emergency number right now. You matter, and there are people who want to help you.";
      
      return new Response(
        JSON.stringify({ reply: botReply, flagged: true }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Get Gemini API key
    const geminiApiKey = Deno.env.get('GEMINI_API_KEY');
    if (!geminiApiKey) {
      console.error("GEMINI_API_KEY not found in environment");
      return new Response(
        JSON.stringify({ error: "AI service not configured" }), 
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    // Enhanced sentiment analysis prompt
    const sentimentPrompt = `You are a compassionate AI mental health counselor specialized in understanding emotions and providing supportive guidance.

ANALYSIS TASK:
1. Analyze the emotional state and sentiment of this message
2. Identify the emotion type (anxiety, stress, depression, happiness, anger, confusion, etc.)
3. Rate the emotional intensity (1-10 scale)
4. Detect any concerning patterns or crisis indicators

USER MESSAGE: "${message}"

RESPONSE REQUIREMENTS:
- Provide an empathetic, personalized response based on the detected emotional state
- Use therapeutic communication techniques (reflection, validation, gentle questioning)
- Offer specific coping strategies relevant to their emotional state
- Be concise but meaningful (2-4 sentences)
- If detecting high stress/anxiety (7+ intensity), include a breathing or grounding technique
- If detecting depression indicators, focus on validation and gentle encouragement
- Always maintain a hopeful, supportive tone

Begin your response by briefly acknowledging their emotional state, then provide guidance.`;

    console.log("Sending request to Gemini API...");

    // Call Gemini API
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiApiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: sentimentPrompt
              }
            ]
          }
        ],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 1024,
        },
        safetySettings: [
          {
            category: "HARM_CATEGORY_HARASSMENT",
            threshold: "BLOCK_NONE"
          },
          {
            category: "HARM_CATEGORY_HATE_SPEECH", 
            threshold: "BLOCK_NONE"
          },
          {
            category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          },
          {
            category: "HARM_CATEGORY_DANGEROUS_CONTENT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          }
        ]
      })
    });

    if (!response.ok) {
      console.error(`Gemini API error: ${response.status} ${response.statusText}`);
      const errorText = await response.text();
      console.error("Error details:", errorText);
      
      return new Response(
        JSON.stringify({ 
          error: "AI service temporarily unavailable. Please try again.", 
          reply: "I'm having trouble connecting to my AI service right now. In the meantime, remember that it's okay to feel what you're feeling, and seeking support is a sign of strength. Is there something specific you'd like to talk about?" 
        }), 
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    const data = await response.json();
    console.log("Received response from Gemini API");

    if (!data.candidates || !data.candidates[0] || !data.candidates[0].content) {
      console.error("Invalid response structure from Gemini API:", data);
      return new Response(
        JSON.stringify({ 
          error: "Invalid AI response", 
          reply: "I'm here to listen and support you. Could you tell me more about how you're feeling right now?" 
        }), 
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      );
    }

    const botReply = data.candidates[0].content.parts[0].text;
    console.log(`Generated response for user ${userId}`);

    return new Response(
      JSON.stringify({ reply: botReply, flagged: false }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('AI Chat function error:', error);
    return new Response(
      JSON.stringify({ 
        error: "Something went wrong. Please try again.", 
        reply: "I'm experiencing some technical difficulties, but I'm still here for you. How are you feeling right now, and is there anything specific on your mind?" 
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
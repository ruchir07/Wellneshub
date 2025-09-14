# Voice Emotion Feature - Deployment Modes

## 🔧 Current Setup: DEVELOPMENT MODE

**What's Running:**
- Frontend calls **local Python ML server directly** (`localhost:5000`)
- No Supabase Edge Functions needed
- **Your actual CNN model** is being used for predictions

**Benefits:**
- ✅ Works immediately without cloud setup
- ✅ Uses your real trained model  
- ✅ Fast local processing
- ✅ Full control over ML pipeline

## 🚀 Switching to PROTOTYPE MODE (For Final Deployment)

When you're ready to deploy your prototype to the cloud:

### Step 1: Deploy Supabase Edge Functions
```bash
# Login to Supabase
npx supabase login

# Deploy the voice emotion function
npx supabase functions deploy voice-emotion

# Deploy the federated learning function  
npx supabase functions deploy federated-update
```

### Step 2: Update VoiceEmotion.tsx
In `src/components/VoiceEmotion.tsx`:

1. **Comment out lines ~112-128** (direct API calls):
```typescript
// For local development - Direct call to Python ML server
/*
const response = await fetch('http://localhost:5000/predict', {
  // ... rest of direct API code
*/
```

2. **Uncomment lines ~99-109** (Supabase calls):
```typescript
// TODO: For prototype deployment, uncomment Supabase Edge Functions:
const { data, error } = await supabase.functions.invoke('voice-emotion', {
  body: {
    audioData: audioBase64,
    userId: userId
  }
});
```

3. **Do the same for federated learning calls** (comment direct API, uncomment Supabase)

### Step 3: Deploy Frontend
```bash
npm run build
# Deploy the dist folder to your hosting service
```

## 📊 Comparison

| Feature | Development Mode | Prototype Mode |
|---------|-----------------|----------------|
| **ML Processing** | Local Python server | Supabase Edge Functions |
| **Model Used** | Your actual CNN model | Simulated (needs real model integration) |
| **Setup Complexity** | Simple | Requires cloud setup |
| **Performance** | Fast (local) | Network dependent |
| **Scalability** | Limited | Cloud scalable |
| **Cost** | Free | Supabase usage fees |

## 🎯 Recommended Workflow

1. **Use Development Mode** for testing and demos
2. **Switch to Prototype Mode** when ready for final submission
3. **Enhance Edge Functions** to call your Python ML server from the cloud

## ⚠️ Note for Edge Functions

The current Supabase Edge Functions have **simulated predictions**. For full prototype functionality, you'll need to:

1. Deploy your Python ML server to a cloud service (Railway, Heroku, etc.)
2. Update Edge Functions to call your deployed ML server
3. Or integrate TensorFlow.js directly in the Edge Functions

## 🔄 Quick Switch Commands

**To Development Mode (current):**
- Start local ML server: `python ml_integration/voice_emotion_server.py`
- Start frontend: `npm run dev`

**To Prototype Mode:**
- Deploy Edge Functions: `npx supabase functions deploy voice-emotion`
- Update code as described above
- Deploy frontend: `npm run build`

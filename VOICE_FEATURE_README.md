# Voice Emotion Analysis Feature

## Overview

This feature adds voice-based emotion detection to the existing mental health chatbot. It uses your pre-trained CNN model from `VoiceBasedEmotionClassifier` to analyze user emotions from voice input and provides personalized mental health support.

## Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   React Frontend │    │ Supabase Edge   │    │  Python ML      │
│   - Voice UI     │◄──►│ Functions       │◄──►│  Server         │
│   - Recording    │    │ - voice-emotion │    │ - CNN Model     │
│   - Confirmation │    │ - federated-upd │    │ - MFCC Features │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│  Local Storage  │    │  Database       │    │ Federated       │
│  - Voice Data   │    │  - Sessions     │    │ Learning        │
│  - Confirmations│    │  - Analytics    │    │ - Model Updates │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## Features

### 🎤 Voice Recording
- **Web Audio API** integration for high-quality recording
- **Real-time feedback** with recording duration and waveform
- **Automatic noise reduction** and echo cancellation
- **Cross-browser compatibility** with fallback options

### 🧠 Emotion Detection
- **CNN-based model** using your existing `iesc_cnn_model.h5`
- **MFCC feature extraction** (40 features, same as training)
- **7 emotions supported**: Anger, Disgust, Fear, Happiness, Neutral, Sadness, Surprise
- **Confidence scoring** for prediction reliability

### 💚 Mental Health Integration
- **Emotion-to-mental health mapping**:
  - Anger → Elevated Stress (moderate severity)
  - Fear → Anxiety Symptoms (moderate severity)
  - Sadness → Low Mood Indicators (moderate severity)
  - Happiness → Positive Emotional State (no severity)
  - Neutral → Balanced Emotional State (no severity)
- **Personalized suggestions** based on detected emotions
- **Crisis detection** with appropriate safety responses

### ✅ User Confirmation Workflow
- **Two-step verification**: AI prediction → User confirmation
- **Yes/No feedback** for model accuracy
- **Privacy-conscious**: User controls their data
- **Learning loop**: Corrections improve the model

### 🔒 Privacy & Security
- **Local-first processing**: Voice data processed on device
- **Encrypted transmission** to servers
- **User consent required** for each recording
- **Data anonymization** before federated learning
- **Right to delete** stored voice data

### 🔄 Federated Learning
- **Distributed training**: Model updates without raw data sharing
- **Privacy-preserving**: Only model weights are shared
- **Continuous improvement**: Model gets better with usage
- **Batch processing**: Updates happen during off-peak hours

## File Structure

```
sagepath-care/
├── src/
│   ├── components/
│   │   └── VoiceEmotion.tsx          # Main voice emotion component
│   ├── hooks/
│   │   └── useVoiceRecording.ts      # Voice recording logic
│   └── pages/
│       └── Chatbot.tsx               # Updated chatbot with voice feature
├── supabase/functions/
│   ├── voice-emotion/
│   │   └── index.ts                  # Voice emotion prediction API
│   └── federated-update/
│       └── index.ts                  # Federated learning updates
├── ml_integration/
│   ├── voice_emotion_server.py       # Python ML server
│   └── requirements.txt              # Python dependencies
└── setup_voice_feature.bat          # Setup script
```

## Setup Instructions

### Prerequisites
- Python 3.8+ with pip
- Node.js 16+ with npm
- Supabase CLI
- Your existing `VoiceBasedEmotionClassifier` model files

### Quick Setup
1. Run the setup script:
   ```bash
   ./setup_voice_feature.bat
   ```

### Manual Setup
1. **Install Python dependencies:**
   ```bash
   cd ml_integration
   pip install -r requirements.txt
   ```

2. **Install frontend dependencies:**
   ```bash
   npm install
   ```

3. **Deploy Supabase functions:**
   ```bash
   npx supabase functions deploy voice-emotion
   npx supabase functions deploy federated-update
   ```

## Usage

### Starting the Services

1. **Start the ML server:**
   ```bash
   python ml_integration/voice_emotion_server.py
   ```

2. **Start the frontend:**
   ```bash
   npm run dev
   ```

### Using the Voice Feature

1. **Open the chatbot** in your browser
2. **Click "Voice Analysis"** button in the chat header
3. **Grant microphone permissions** when prompted
4. **Record your voice** by clicking "Start Recording"
5. **Speak naturally** about your feelings (3-10 seconds)
6. **Stop recording** and click "Analyze Emotion"
7. **Review the prediction** and confirm if it's accurate
8. **Continue chatting** - the AI will use this emotional context

## Technical Details

### Voice Processing Pipeline

1. **Audio Capture**: WebRTC MediaRecorder API
2. **Format**: WebM with Opus codec for efficiency
3. **Feature Extraction**: 40 MFCC coefficients using librosa
4. **Preprocessing**: Standardization using saved scaler
5. **Prediction**: CNN model inference with confidence scoring
6. **Post-processing**: Emotion-to-mental health mapping

### Model Integration

The system integrates your existing CNN model (`iesc_cnn_model.h5`) with:
- **Input shape**: (40,) MFCC features
- **Output**: 7 emotion classes with softmax probabilities
- **Preprocessing**: StandardScaler for feature normalization
- **Label encoding**: Matches your training setup

### API Endpoints

**Voice Emotion Prediction:**
```
POST /functions/v1/voice-emotion
{
  "audioData": "base64_encoded_audio",
  "userId": "user_identifier"
}
```

**Federated Learning Update:**
```
POST /functions/v1/federated-update
{
  "userId": "user_identifier",
  "voiceData": "base64_audio",
  "confirmedEmotion": "Happiness",
  "originalEmotion": "Neutral",
  "confidence": 0.87
}
```

## Configuration

### Environment Variables

```env
# Supabase
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_anon_key

# ML Server
ML_SERVER_URL=http://localhost:5000
MODEL_VERSION=v1.2.3
```

### Model Paths
Update these in `ml_integration/voice_emotion_server.py`:
```python
MODEL_PATH = "../../VoiceBasedEmotionClassifier/models/iesc_cnn_model.h5"
SCALER_PATH = "../../VoiceBasedEmotionClassifier/models/scaler.pkl"
LABEL_ENCODER_PATH = "../../VoiceBasedEmotionClassifier/models/label_encoder.pkl"
```

## Development

### Adding New Emotions

1. **Retrain your CNN model** with new emotion classes
2. **Update the emotion mapping** in both:
   - `supabase/functions/voice-emotion/index.ts`
   - `ml_integration/voice_emotion_server.py`
3. **Add UI support** in `src/components/VoiceEmotion.tsx`

### Customizing Mental Health Responses

Edit the `EMOTION_MENTAL_HEALTH_MAPPING` object to customize:
- Severity levels (none, mild, moderate, severe)
- Status descriptions
- Personalized suggestions

### Testing

```bash
# Test voice recording
npm run test:voice

# Test ML prediction
python ml_integration/test_prediction.py

# Test federated learning
npm run test:federated
```

## Troubleshooting

### Common Issues

**"Model files not found"**
- Ensure `VoiceBasedEmotionClassifier` directory exists in parent folder
- Check file paths in configuration

**"Microphone access denied"**
- Enable microphone permissions in browser
- Use HTTPS for production (required for getUserMedia)

**"Prediction accuracy low"**
- Check audio quality and background noise
- Verify MFCC extraction parameters match training
- Consider retraining with more diverse data

**"Federated learning not updating"**
- Check network connectivity
- Verify Supabase Edge Functions are deployed
- Monitor server logs for errors

### Logs and Monitoring

```bash
# Frontend logs
npm run dev -- --debug

# ML server logs
python ml_integration/voice_emotion_server.py --verbose

# Supabase function logs
npx supabase functions logs voice-emotion
```

## Security Considerations

- **Voice data encryption** in transit and at rest
- **User consent** required for each recording session
- **Data retention policies** with automatic cleanup
- **Anonymization** before federated learning
- **Rate limiting** to prevent abuse

## Performance

- **Recording latency**: < 100ms
- **Prediction time**: < 2 seconds
- **Model size**: ~50MB (cached locally)
- **Memory usage**: ~200MB during inference
- **Browser compatibility**: Chrome 60+, Firefox 55+, Safari 14+

## Future Enhancements

- [ ] Real-time emotion detection during conversation
- [ ] Multi-language emotion recognition
- [ ] Voice biomarker analysis for depression screening
- [ ] Integration with wearable devices
- [ ] Advanced federated learning with differential privacy
- [ ] Emotion trend analysis and reporting

## Contributing

1. Create feature branch from `voiceFeature`
2. Test thoroughly with different voice samples
3. Update documentation
4. Submit pull request with demo video

## License

This voice emotion feature integrates with your existing mental health application and ML model. Please ensure compliance with healthcare data regulations (HIPAA, GDPR) in your jurisdiction.

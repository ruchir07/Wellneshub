@echo off
echo.
echo ========================================
echo Setting up Voice Emotion Feature
echo ========================================
echo.

:: Check if Python is installed
python --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Python is not installed or not in PATH
    echo Please install Python 3.8+ from https://python.org
    pause
    exit /b 1
)

:: Check if Node.js is installed
node --version >nul 2>&1
if errorlevel 1 (
    echo ERROR: Node.js is not installed or not in PATH
    echo Please install Node.js from https://nodejs.org
    pause
    exit /b 1
)

:: Check if ML model files exist
echo Checking for ML model files...
if not exist "..\VoiceBasedEmotionClassifier\models\iesc_cnn_model.h5" (
    echo ERROR: ML model file not found
    echo Expected: ..\VoiceBasedEmotionClassifier\models\iesc_cnn_model.h5
    echo Please ensure the VoiceBasedEmotionClassifier directory is present
    pause
    exit /b 1
)

echo ✅ ML model files found

:: Install Python dependencies for ML server
echo.
echo Installing Python dependencies for ML server...
cd ml_integration
pip install -r requirements.txt
if errorlevel 1 (
    echo ERROR: Failed to install Python dependencies
    pause
    exit /b 1
)
cd ..

:: Install frontend dependencies
echo.
echo Installing frontend dependencies...
npm install
if errorlevel 1 (
    echo ERROR: Failed to install frontend dependencies
    pause
    exit /b 1
)

:: Deploy Supabase Edge Functions
echo.
echo Deploying Supabase Edge Functions...
npx supabase functions deploy voice-emotion
npx supabase functions deploy federated-update

echo.
echo ========================================
echo ✅ Voice Emotion Feature Setup Complete!
echo ========================================
echo.
echo Next steps:
echo 1. Start the ML server: python ml_integration/voice_emotion_server.py
echo 2. Start the frontend: npm run dev
echo 3. Open the chatbot and test the voice feature
echo.
echo The voice feature includes:
echo - Real-time voice recording and emotion detection
echo - User confirmation workflow for accuracy
echo - Local storage with privacy protection
echo - Federated learning model updates
echo.
pause

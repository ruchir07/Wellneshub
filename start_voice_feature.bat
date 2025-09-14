@echo off
echo.
echo ========================================
echo Starting Voice Emotion Feature
echo ========================================
echo.
echo This will start BOTH services:
echo 1. ML Server (Python) - for voice emotion prediction
echo 2. Frontend (React) - your web application
echo.
echo You need to open TWO terminal windows:
echo.
echo ----------------------------------------
echo TERMINAL 1 - ML Server:
echo ----------------------------------------
echo cd D:\Projects\SIH\sagepath-care\ml_integration
echo python voice_emotion_server.py
echo.
echo ----------------------------------------
echo TERMINAL 2 - Frontend:
echo ----------------------------------------
echo cd D:\Projects\SIH\sagepath-care
echo npm run dev
echo.
echo ========================================
echo Then open: http://localhost:5173
echo Click the "Voice Analysis" button in the chatbot!
echo ========================================
echo.
pause

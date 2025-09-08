require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const { Chat, Summary } = require("./models");   // ✅ both models
const { GoogleGenerativeAI } = require("@google/generative-ai");

const app = express();
app.use(express.json());

const cors = require('cors');
app.use(cors({ origin: 'http://localhost:8080' }));



// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Health check
app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

// Safety keywords
const unsafeKeywords = ["suicide", "kill myself", "end my life", "self harm"];

// Chat endpoint
app.post("/chat", async (req, res) => {
  const { userId, message } = req.body;
  if (!userId || !message) {
    return res.status(400).json({ error: "Missing userId or message" });
  }

  // Save user message
  await Chat.create({ userId, role: "user", content: message });

  // Safety check
  const flagged = unsafeKeywords.some((kw) =>
    message.toLowerCase().includes(kw)
  );

  if (flagged) {
    const botReply =
      "⚠️ I hear you’re going through something very serious. Please reach out immediately to a trusted friend, family member, or a professional counselor. If you are in immediate danger, call your local emergency number right now.";
    await Chat.create({
      userId,
      role: "assistant",
      content: botReply,
      flagged: true,
    });
    return res.json({ reply: botReply, flagged: true });
  }

  try {
    // Gemini API call
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `You are a supportive mental health counselor. Be empathetic, concise, and encouraging. 
    The user says: "${message}"`;

    const result = await model.generateContent(prompt);
    const botReply = result.response.text();

    // Save assistant reply
    await Chat.create({ userId, role: "assistant", content: botReply });

    res.json({ reply: botReply, flagged: false });
  } catch (err) {
    console.error("Gemini API error:", err);
    res.status(500).json({ error: "Chatbot error", details: err.message });
  }
});

// Summarize endpoint
app.post("/summarize/:userId", async (req, res) => {
  const { userId } = req.params;

  try {
    // Get full chat history
    const history = await Chat.find({ userId }).sort({ createdAt: 1 });
    if (history.length === 0) {
      return res.status(404).json({ error: "No chat history found" });
    }

    const conversation = history.map(h => `${h.role}: ${h.content}`).join("\n");

    // Gemini summary
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `Summarize the following counseling conversation into a short, empathetic session summary:\n\n${conversation}`;

    const result = await model.generateContent(prompt);
    const summaryText = result.response.text();

    // ✅ Save into Summaries collection (not Chats)
    await Summary.create({
      userId,
      startDate: history[0].createdAt,
      endDate: history[history.length - 1].createdAt,
      summaryJSON: { text: summaryText }
    });

    res.json({ summary: summaryText });
  } catch (err) {
    console.error("Summarization error:", err);
    res.status(500).json({ error: "Summarization failed", details: err.message });
  }
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));

import React, { useState, useRef, useEffect } from 'react';
import { Navigation } from '@/components/Navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Send, Bot, User, Heart, MessageCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

const botResponses = {
  greeting: [
    "Hello! I'm here to support you. How are you feeling today?",
    "Hi there! I'm your AI wellness companion. What's on your mind?",
    "Welcome! I'm here to listen and help. How can I support you today?"
  ],
  anxiety: [
    "I understand you're feeling anxious. Let's try a quick breathing exercise: breathe in for 4 counts, hold for 4, exhale for 6. Would you like to try this together?",
    "Anxiety can feel overwhelming. Remember, these feelings are temporary. Can you tell me what specifically is making you feel anxious right now?",
    "It's completely normal to feel anxious sometimes. One helpful technique is the 5-4-3-2-1 grounding method. Would you like me to guide you through it?"
  ],
  stress: [
    "I hear that you're stressed. Stress is your body's way of responding to challenges. What's the main source of your stress right now?",
    "Feeling stressed is tough. Let's break this down - is this stress about studies, relationships, or something else? I'm here to help you work through it.",
    "Stress can feel overwhelming, but remember you're stronger than you think. Have you tried any relaxation techniques before?"
  ],
  sadness: [
    "I'm sorry you're going through a difficult time. Your feelings are valid, and it's okay to feel sad. Would you like to talk about what's causing these feelings?",
    "Thank you for sharing that with me. Sadness is a natural emotion, and it's important to acknowledge it. Is there anything specific that triggered these feelings?",
    "I understand you're feeling down. Sometimes talking about it can help. I'm here to listen without judgment."
  ],
  support: [
    "Remember, seeking help is a sign of strength, not weakness. Have you considered speaking with a professional counselor? I can help you book an appointment.",
    "You're taking an important step by reaching out. If you'd like additional support, we have professional counselors available. Would you like to know more?",
    "I'm glad you're here. While I can provide some guidance, sometimes it's helpful to speak with a human counselor too. Our booking system makes it easy and confidential."
  ],
  resources: [
    "We have many resources available including guided meditations, breathing exercises, and wellness articles. What type of support would be most helpful right now?",
    "I can recommend some immediate coping strategies or direct you to our resource library. Which would you prefer?",
    "There are several ways I can help - through guided exercises, providing information, or connecting you with additional resources. What feels right for you?"
  ]
};

const Chatbot = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: "Hello! I'm your AI wellness companion. I'm here to provide support, coping strategies, and a safe space to talk. How are you feeling today?",
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const generateBotResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase();
    
    if (lowerMessage.includes('anxious') || lowerMessage.includes('anxiety') || lowerMessage.includes('worried')) {
      return botResponses.anxiety[Math.floor(Math.random() * botResponses.anxiety.length)];
    }
    if (lowerMessage.includes('stress') || lowerMessage.includes('overwhelmed') || lowerMessage.includes('pressure')) {
      return botResponses.stress[Math.floor(Math.random() * botResponses.stress.length)];
    }
    if (lowerMessage.includes('sad') || lowerMessage.includes('depressed') || lowerMessage.includes('down') || lowerMessage.includes('low')) {
      return botResponses.sadness[Math.floor(Math.random() * botResponses.sadness.length)];
    }
    if (lowerMessage.includes('help') || lowerMessage.includes('support') || lowerMessage.includes('counselor')) {
      return botResponses.support[Math.floor(Math.random() * botResponses.support.length)];
    }
    if (lowerMessage.includes('resource') || lowerMessage.includes('exercise') || lowerMessage.includes('meditation')) {
      return botResponses.resources[Math.floor(Math.random() * botResponses.resources.length)];
    }
    if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('hey')) {
      return botResponses.greeting[Math.floor(Math.random() * botResponses.greeting.length)];
    }
    
    // Default supportive response
    return "Thank you for sharing that with me. I'm here to listen and support you. Can you tell me more about how you're feeling or what's been on your mind lately?";
  };

  const handleSend = async () => {
    if (!inputText.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsTyping(true);

    // Simulate typing delay
    setTimeout(() => {
      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: generateBotResponse(inputText),
        sender: 'bot',
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, botResponse]);
      setIsTyping(false);
    }, 1500);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="max-w-4xl mx-auto px-4 py-6">
        <Card className="h-[calc(100vh-12rem)] flex flex-col">
          <CardHeader className="border-b border-border bg-wellness/30">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-secondary to-accent rounded-full flex items-center justify-center">
                <Bot className="w-6 h-6 text-white" />
              </div>
              <div>
                <CardTitle className="flex items-center gap-2">
                  AI Wellness Companion
                  <Heart className="w-4 h-4 text-secondary" />
                </CardTitle>
                <p className="text-sm text-muted-foreground">Available 24/7 for support</p>
              </div>
            </div>
          </CardHeader>

          <CardContent className="flex-1 overflow-y-auto p-6 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-3 ${message.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
              >
                <Avatar className="w-8 h-8">
                  <AvatarFallback className={message.sender === 'user' ? 'bg-primary text-primary-foreground' : 'bg-secondary text-secondary-foreground'}>
                    {message.sender === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                  </AvatarFallback>
                </Avatar>
                
                <div className={`max-w-[70%] ${message.sender === 'user' ? 'text-right' : 'text-left'}`}>
                  <div
                    className={`inline-block p-3 rounded-2xl ${
                      message.sender === 'user'
                        ? 'bg-primary text-primary-foreground rounded-tr-sm'
                        : 'bg-muted text-muted-foreground rounded-tl-sm'
                    }`}
                  >
                    <p className="leading-relaxed">{message.text}</p>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            ))}
            
            {isTyping && (
              <div className="flex gap-3">
                <Avatar className="w-8 h-8">
                  <AvatarFallback className="bg-secondary text-secondary-foreground">
                    <Bot className="w-4 h-4" />
                  </AvatarFallback>
                </Avatar>
                <div className="bg-muted text-muted-foreground p-3 rounded-2xl rounded-tl-sm">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-current rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <div className="w-2 h-2 bg-current rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <div className="w-2 h-2 bg-current rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </CardContent>

          <div className="border-t border-border p-4">
            <div className="flex gap-2">
              <Input
                placeholder="Type your message here..."
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyPress={handleKeyPress}
                className="flex-1"
              />
              <Button onClick={handleSend} variant="hero" size="icon">
                <Send className="w-4 h-4" />
              </Button>
            </div>
            <p className="text-xs text-muted-foreground mt-2 text-center">
              Remember: For urgent mental health crises, please contact emergency services or a crisis helpline immediately.
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Chatbot;
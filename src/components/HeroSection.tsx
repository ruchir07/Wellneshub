import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight, Shield, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';
import heroImage from '@/assets/hero-wellness.jpg';

export const HeroSection = () => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-background via-wellness to-primary-soft">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 bg-accent-soft text-accent-foreground px-4 py-2 rounded-full text-sm font-medium">
                <Shield className="w-4 h-4" />
                Confidential & Secure Support
              </div>
              <h1 className="text-4xl lg:text-6xl font-bold text-foreground leading-tight">
                Your Mental
                <span className="block text-transparent bg-gradient-to-r from-primary to-secondary bg-clip-text">
                  Wellness
                </span>
                Matters
              </h1>
              <p className="text-xl text-muted-foreground leading-relaxed">
                A safe space for students to access mental health support, connect with counselors, 
                and find resources for stress, anxiety, and daily wellness.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Button variant="hero" size="lg" className="group">
                <Link to="/checkin" className="flex items-center gap-2">
                  Start Daily Check-in
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
              <Button variant="wellness" size="lg">
                <Link to="/chatbot">Talk to AI Counselor</Link>
              </Button>
            </div>

            <div className="flex items-center gap-6 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Heart className="w-4 h-4 text-secondary" />
                <span>Available 24/7</span>
              </div>
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-secondary" />
                <span>100% Confidential</span>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="relative z-10">
              <img 
                src={heroImage} 
                alt="Mental wellness support for students"
                className="rounded-2xl shadow-2xl w-full h-auto"
              />
            </div>
            <div className="absolute -top-4 -right-4 w-full h-full bg-gradient-to-br from-accent/20 to-primary/20 rounded-2xl -z-10"></div>
          </div>
        </div>
      </div>
    </section>
  );
};
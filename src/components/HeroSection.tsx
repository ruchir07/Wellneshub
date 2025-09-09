import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight, Shield, Heart, MessageCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import heroImage from '@/assets/hero-wellness.jpg';

export const HeroSection = () => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-background via-wellness/30 to-primary-soft/50 min-h-screen flex items-center">
      {/* Animated background elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5"></div>
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-gradient-to-br from-primary/10 to-transparent rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-gradient-to-br from-secondary/10 to-transparent rounded-full blur-3xl animate-pulse delay-1000"></div>
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 bg-accent-soft text-accent-foreground px-4 py-2 rounded-full text-sm font-medium">
                <Shield className="w-4 h-4" />
                Confidential & Secure Support
              </div>
              <h1 className="text-4xl lg:text-6xl xl:text-7xl font-bold text-foreground leading-tight tracking-tight">
                Your Mental
                <span className="block text-transparent bg-gradient-to-r from-primary via-accent to-secondary bg-clip-text animate-pulse">
                  Wellness
                </span>
                <span className="block">Journey</span>
              </h1>
              <p className="text-xl text-muted-foreground leading-relaxed">
                A safe space for students to access mental health support, connect with counselors, 
                and find resources for stress, anxiety, and daily wellness.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-6">
              <Button variant="hero" size="lg" className="group relative overflow-hidden shadow-floating hover:shadow-glow transition-all duration-500">
                <Link to="/checkin" className="flex items-center gap-2 relative z-10">
                  Start Daily Check-in
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-2 transition-transform duration-300" />
                </Link>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
              </Button>
              <Button variant="wellness" size="lg" className="group border-2 border-secondary/20 hover:border-secondary/40 transition-all duration-300 hover:scale-105">
                <Link to="/chatbot" className="flex items-center gap-2">
                  Talk to AI Counselor
                  <MessageCircle className="w-4 h-4 group-hover:scale-110 transition-transform" />
                </Link>
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

          <div className="relative group">
            <div className="relative z-10 transform group-hover:scale-105 transition-transform duration-700">
              <img 
                src={heroImage} 
                alt="Mental wellness support for students"
                className="rounded-3xl shadow-floating w-full h-auto"
              />
              <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 via-transparent to-secondary/20 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            </div>
            <div className="absolute -top-6 -right-6 w-full h-full bg-gradient-to-br from-accent/30 to-primary/30 rounded-3xl -z-10 blur-xl"></div>
            <div className="absolute -bottom-4 -left-4 w-3/4 h-3/4 bg-gradient-to-br from-secondary/20 to-transparent rounded-3xl -z-20 blur-2xl"></div>
          </div>
        </div>
      </div>
    </section>
  );
};
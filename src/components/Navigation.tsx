import React from 'react';
import { Button } from '@/components/ui/button';
import { Heart, Menu, User } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Navigation = () => {
  return (
    <nav className="bg-card/80 backdrop-blur-sm border-b border-border sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
              <Heart className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-foreground">WellnessHub</span>
          </Link>
          
          <div className="hidden md:flex items-center gap-6">
            <Link to="/" className="text-muted-foreground hover:text-foreground transition-colors">
              Home
            </Link>
            <Link to="/checkin" className="text-muted-foreground hover:text-foreground transition-colors">
              Check-in
            </Link>
            <Link to="/chatbot" className="text-muted-foreground hover:text-foreground transition-colors">
              AI Support
            </Link>
            <Link to="/booking" className="text-muted-foreground hover:text-foreground transition-colors">
              Book Session
            </Link>
          </div>

          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" className="hidden md:inline-flex">
              Sign In
            </Button>
            <Button variant="hero" size="sm">
              Get Started
            </Button>
            <Button variant="ghost" size="icon" className="md:hidden">
              <Menu className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Heart, Menu, X, Calendar, MessageSquare, Users, Home, Bot, LogIn, LogOut, User } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { User as SupabaseUser, Session } from '@supabase/supabase-js';

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const location = useLocation();

  useEffect(() => {
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
  };

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
          
          {/* Desktop Navigation */}
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
            <Link to="/calendar" className="text-muted-foreground hover:text-foreground transition-colors">
              Academic Calendar
            </Link>
            <Link to="/forum" className="text-muted-foreground hover:text-foreground transition-colors">
              Community Forum
            </Link>
          </div>

          {/* Desktop Auth */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <div className="flex items-center gap-3">
                <span className="text-sm text-muted-foreground truncate max-w-32">
                  {user.email}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleSignOut}
                  className="flex items-center gap-2"
                >
                  <LogOut className="w-4 h-4" />
                  Sign Out
                </Button>
              </div>
            ) : (
              <>
                <Link to="/auth">
                  <Button variant="ghost" size="sm">
                    Sign In
                  </Button>
                </Link>
                <Link to="/auth">
                  <Button variant="hero" size="sm">
                    Get Started
                  </Button>
                </Link>
              </>
            )}
            
            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </Button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden py-4 space-y-2 border-t border-border bg-card/90 backdrop-blur-sm">
            <Link
              to="/"
              className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-colors ${
                location.pathname === "/"
                  ? "bg-primary text-primary-foreground"
                  : "text-foreground hover:bg-accent"
              }`}
              onClick={() => setIsOpen(false)}
            >
              <Home className="w-5 h-5" />
              <span>Home</span>
            </Link>

            <Link
              to="/checkin"
              className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-colors ${
                location.pathname === "/checkin"
                  ? "bg-primary text-primary-foreground"
                  : "text-foreground hover:bg-accent"
              }`}
              onClick={() => setIsOpen(false)}
            >
              <Users className="w-5 h-5" />
              <span>Check-in</span>
            </Link>

            <Link
              to="/chatbot"
              className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-colors ${
                location.pathname === "/chatbot"
                  ? "bg-primary text-primary-foreground"
                  : "text-foreground hover:bg-accent"
              }`}
              onClick={() => setIsOpen(false)}
            >
              <Bot className="w-5 h-5" />
              <span>AI Support</span>
            </Link>

            <Link
              to="/booking"
              className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-colors ${
                location.pathname === "/booking"
                  ? "bg-primary text-primary-foreground"
                  : "text-foreground hover:bg-accent"
              }`}
              onClick={() => setIsOpen(false)}
            >
              <Calendar className="w-5 h-5" />
              <span>Book Session</span>
            </Link>

            <Link
              to="/calendar"
              className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-colors ${
                location.pathname === "/calendar"
                  ? "bg-primary text-primary-foreground"
                  : "text-foreground hover:bg-accent"
              }`}
              onClick={() => setIsOpen(false)}
            >
              <Calendar className="w-5 h-5" />
              <span>Academic Calendar</span>
            </Link>

            <Link
              to="/forum"
              className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-colors ${
                location.pathname === "/forum"
                  ? "bg-primary text-primary-foreground"
                  : "text-foreground hover:bg-accent"
              }`}
              onClick={() => setIsOpen(false)}
            >
              <MessageSquare className="w-5 h-5" />
              <span>Community Forum</span>
            </Link>

            {user ? (
              <div className="pt-4 border-t border-border space-y-2">
                <div className="flex items-center space-x-2 px-4 py-2 text-muted-foreground">
                  <User className="w-4 h-4" />
                  <span className="text-sm truncate">{user.email}</span>
                </div>
                <Button
                  variant="ghost"
                  className="w-full justify-start"
                  onClick={handleSignOut}
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Sign Out
                </Button>
              </div>
            ) : (
              <div className="pt-4 border-t border-border">
                <Link to="/auth" onClick={() => setIsOpen(false)}>
                  <Button variant="ghost" className="w-full justify-start">
                    <LogIn className="w-4 h-4 mr-2" />
                    Sign In
                  </Button>
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
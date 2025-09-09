import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Link } from 'react-router-dom';
import { 
  MessageCircle, 
  Calendar, 
  ClipboardCheck, 
  ArrowRight,
  Sparkles,
  Users
} from 'lucide-react';

const quickActions = [
  {
    icon: ClipboardCheck,
    title: 'Take Daily Check-in',
    description: 'Complete your wellness assessment in just 2 minutes',
    action: 'Start Check-in',
    gradient: 'from-primary to-primary-glow',
    href: '/checkin'
  },
  {
    icon: MessageCircle,
    title: 'Chat with AI Counselor',
    description: 'Get instant support and personalized coping strategies',
    action: 'Start Chat',
    gradient: 'from-secondary to-accent',
    href: '/chatbot'
  },
  {
    icon: Calendar,
    title: 'Book Appointment',
    description: 'Schedule a confidential session with a professional counselor',
    action: 'Book Now',
    gradient: 'from-accent to-primary',
    href: '/booking'
  },
  {
    icon: Users,
    title: 'Join Community',
    description: 'Connect with peers in our supportive forum',
    action: 'Explore Forum',
    gradient: 'from-wellness to-secondary',
    href: '/forum'
  }
];

export const QuickActions = () => {
  return (
    <section className="py-20 bg-gradient-to-b from-background to-muted/20 relative overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,hsl(var(--primary)/0.1),transparent_50%),radial-gradient(circle_at_70%_80%,hsl(var(--secondary)/0.1),transparent_50%)]"></div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center space-y-4 mb-12">
          <div className="inline-flex items-center gap-2 bg-accent-soft text-accent-foreground px-4 py-2 rounded-full text-sm font-medium">
            <Sparkles className="w-4 h-4" />
            Get Started Today
          </div>
          <h2 className="text-3xl lg:text-4xl font-bold text-foreground">
            Take Your First Step
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Choose how you'd like to begin your mental wellness journey with us.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {quickActions.map((action, index) => (
            <Card 
              key={index}
              className="group relative overflow-hidden border-border/50 hover:shadow-floating transition-all duration-500 hover:-translate-y-3 bg-card/80 backdrop-blur-sm hover:bg-card/90 hover:border-primary/30"
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${action.gradient} opacity-5 group-hover:opacity-15 transition-opacity duration-500`} />
              <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              
              <CardHeader className="relative space-y-4 z-10">
                <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${action.gradient} flex items-center justify-center shadow-floating group-hover:shadow-glow group-hover:scale-110 transition-all duration-300`}>
                  <action.icon className="w-7 h-7 text-white group-hover:scale-110 transition-transform duration-300" />
                </div>
                <CardTitle className="text-lg font-semibold">
                  {action.title}
                </CardTitle>
              </CardHeader>
              
              <CardContent className="relative space-y-4">
                <CardDescription className="text-muted-foreground leading-relaxed">
                  {action.description}
                </CardDescription>
                
                <Button 
                  variant="ghost" 
                  className="w-full group-hover:bg-gradient-to-r group-hover:from-primary/10 group-hover:to-secondary/10 group-hover:text-primary transition-all duration-300 border border-transparent group-hover:border-primary/20"
                >
                  <Link to={action.href} className="flex items-center justify-between w-full">
                    {action.action}
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  MessageCircle, 
  Calendar, 
  BookOpen, 
  Activity, 
  Users, 
  Shield,
  Brain,
  Headphones
} from 'lucide-react';

const features = [
  {
    icon: Activity,
    title: 'Daily Check-ins',
    description: 'Quick wellness assessments to track your mental health journey with PHQ-9 and GAD-7 screenings.',
    color: 'text-primary'
  },
  {
    icon: MessageCircle,
    title: 'AI Support Chatbot',
    description: 'Get instant support and coping strategies from our AI counselor available 24/7.',
    color: 'text-secondary'
  },
  {
    icon: Calendar,
    title: 'Book Counselor',
    description: 'Schedule confidential appointments with professional counselors at your convenience.',
    color: 'text-accent'
  },
  {
    icon: BookOpen,
    title: 'Resource Hub',
    description: 'Access curated mental health resources, articles, and educational content.',
    color: 'text-primary'
  },
  {
    icon: Brain,
    title: 'Wellness Exercises',
    description: 'Guided meditation, breathing exercises, and mindfulness activities for daily practice.',
    color: 'text-secondary'
  },
  {
    icon: Users,
    title: 'Peer Support',
    description: 'Connect with fellow students in a safe, moderated community forum.',
    color: 'text-accent'
  },
  {
    icon: Shield,
    title: 'Government Resources',
    description: 'Access helpline numbers, mental health schemes, and official support programs.',
    color: 'text-primary'
  },
  {
    icon: Headphones,
    title: 'Crisis Support',
    description: 'Immediate access to crisis intervention and emergency mental health resources.',
    color: 'text-destructive'
  }
];

export const FeaturesOverview = () => {
  return (
    <section className="py-20 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-4 mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-foreground">
            Comprehensive Mental Health Support
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Everything you need to support your mental wellness journey, from daily check-ins to professional counseling.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <Card 
              key={index}
              className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-border/50"
            >
              <CardHeader className="space-y-3">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                  <feature.icon className={`w-6 h-6 ${feature.color}`} />
                </div>
                <CardTitle className="text-lg font-semibold">
                  {feature.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-muted-foreground leading-relaxed">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
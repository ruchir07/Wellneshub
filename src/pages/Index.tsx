import React from 'react';
import Navigation from '@/components/Navigation';
import { HeroSection } from '@/components/HeroSection';
import { FeaturesOverview } from '@/components/FeaturesOverview';
import { QuickActions } from '@/components/QuickActions';

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main>
        <HeroSection />
        <FeaturesOverview />
        <QuickActions />
      </main>
    </div>
  );
};

export default Index;
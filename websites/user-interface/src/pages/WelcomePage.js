import React from 'react';
import WelcomeHero from '../components/WelcomeHero';
import WelcomeContent from '../components/WelcomeContent';
import WelcomeAboutUs from '../components/WelcomeAboutUs';
import WelcomeTestimonials from '../components/WelcomeTestimonials';
import WelcomeFooter from '../components/WelcomeFooter';

const WelcomePage = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <WelcomeHero />
      <div className="space-y-20">
        <WelcomeAboutUs />
        <WelcomeContent />
        <WelcomeTestimonials />
      </div>
      <WelcomeFooter />
    </div>
  );
};

export default WelcomePage;
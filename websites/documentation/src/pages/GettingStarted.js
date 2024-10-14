import React from 'react';
import Prerequisites from '../components/Prerequisites';
import Installation from '../components/Installation';
import APIKeySetup from '../components/APIKeySetup';
import BasicUsage from '../components/BasicUsage';
import AdvancedUsage from '../components/AdvancedUsage';
import FAQ from '../components/FAQ';
import Troubleshooting from '../components/Troubleshooting';
import Resources from '../components/Resources';

function GettingStarted() {
  return (
    <div className="p-6">
      <h1 className="text-4xl font-bold mb-6">Getting Started</h1>
      <p className="mb-4">
        Welcome to the INBOT AI Library! This guide will help you get started with installing and using the library in your project.
      </p>
      
      <Prerequisites />
      <Installation />
      <APIKeySetup />
      <BasicUsage />
      <AdvancedUsage />
      <FAQ />
      <Troubleshooting />
      <Resources />
    </div>
  );
}

export default GettingStarted;

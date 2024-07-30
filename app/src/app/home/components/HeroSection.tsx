// src/components/HeroSection.tsx
import React from 'react';

const HeroSection: React.FC = () => {
  return (
    <section className="bg-blue-600 text-white text-center py-20">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold">Welcome to My Landing Page</h1>
        <p className="mt-4 text-lg">This is an example landing page built with React, Tailwind CSS, and Shadcn UI.</p>
      </div>
    </section>
  );
};

export default HeroSection;

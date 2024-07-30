// src/components/CTASection.tsx
import React from 'react';

const CTASection: React.FC = () => {
  return (
    <section id="cta" className="bg-green-500 text-white text-center py-20">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold">Get Started Now</h2>
        <p className="mt-4 text-lg">Sign up today and start enjoying the benefits of our service.</p>
        <button className="mt-6 bg-white text-green-500 px-6 py-3 rounded-lg shadow-lg">Sign Up</button>
      </div>
    </section>
  );
};

export default CTASection;

import React from 'react';

const Features: React.FC = () => {
  return (
    <section id="features" className="py-20">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-center">Features</h2>
        <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className=" p-6 rounded-lg shadow-lg">
            <h3 className="text-xl font-bold">Feature 1</h3>
            <p className="mt-2 ">Description of feature 1.</p>
          </div>
          <div className=" p-6 rounded-lg shadow-lg">
            <h3 className="text-xl font-bold">Feature 2</h3>
            <p className="mt-2 ">Description of feature 2.</p>
          </div>
          <div className=" p-6 rounded-lg shadow-lg">
            <h3 className="text-xl font-bold">Feature 3</h3>
            <p className="mt-2 ">Description of feature 3.</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Features;

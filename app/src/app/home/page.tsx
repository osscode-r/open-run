import React from 'react';
// import Header from './components/Header';
import HeroSection from './components/HeroSection';
import Features from './components/Features';
import CTASection from './components/CTASection';
// import Footer from './components/Footer';

const App: React.FC = () => {
    return (
        <div>
            {/* <Header /> */}
            <HeroSection />
            <Features />
            <CTASection />
            {/* <Footer /> */}
        </div>
    );
};

export default App;
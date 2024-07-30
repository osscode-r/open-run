import React from 'react';
import { Header } from '@/components/ui/header';
import Footer from '@/components/ui/footer';

const Landing: React.FC = () => {
    return (
        <div>
            <Header />
            <div className='justify-center flex items-center h-[550px]'>
                Hello, Welcome to Open Run
            </div>
            <Footer />
        </div>
    );
};

export default Landing;
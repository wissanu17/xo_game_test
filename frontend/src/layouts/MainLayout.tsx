import React from 'react';
import Navbar from '../components/ui/Navbar';
import Footer from '../components/ui/Footer';

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen bg-game-bg text-white">
      <Navbar />

      <main className="flex-1 flex flex-col w-full">
        {children}
      </main>

      <Footer />
    </div>
  );
};

export default MainLayout;

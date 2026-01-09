import React from 'react';
import { Navbar } from '../components/common/Navbar';

interface IMainLayoutProps {
  children: React.ReactNode;
  onSearch?: (query: string) => void;
}

/**
 * Main layout wrapper cho tất cả các trang
 */
export const MainLayout: React.FC<IMainLayoutProps> = ({
  children,
  onSearch,
}) => {
  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <Navbar onSearch={onSearch} />
      <main className="max-w-7xl mx-auto px-4 py-8">{children}</main>
      <footer className="bg-black border-t border-gray-800 py-8 mt-16">
        <div className="max-w-7xl mx-auto px-4 text-center text-gray-400 text-sm">
          <p>&copy; 2024 IMDB Clone. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

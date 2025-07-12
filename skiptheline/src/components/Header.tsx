'use client';

import Link from 'next/link';
import { Zap } from 'lucide-react';

export default function Header() {
  return (
    <header className="bg-gray-900/80 backdrop-blur-sm border-b border-gray-800 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center space-x-2 group">
            <div className="p-2 bg-gradient-to-r from-neon-pink to-neon-teal rounded-lg group-hover:scale-105 transition-transform">
              <Zap className="w-6 h-6 text-black" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-neon-pink to-neon-teal bg-clip-text text-transparent">
              SkipTheLine
            </span>
          </Link>
          
          <nav className="flex items-center space-x-6">
            <Link 
              href="/" 
              className="text-gray-300 hover:text-neon-pink transition-colors font-medium"
            >
              Events
            </Link>
            <Link 
              href="/admin" 
              className="text-gray-400 hover:text-gray-300 transition-colors text-sm"
            >
              Admin
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}
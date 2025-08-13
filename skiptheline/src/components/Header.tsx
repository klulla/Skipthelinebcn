'use client';

import Link from 'next/link';
import { Zap, Menu, X, Shield, Star, Globe } from 'lucide-react';
import { useState } from 'react';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="glass-effect-strong border-b border-gray-700/50 sticky top-0 z-50">
      <div className="container-responsive">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="p-3 bg-gradient-to-r from-neon-pink via-neon-purple to-neon-teal rounded-xl group-hover:scale-110 transition-transform duration-300 neon-glow-rainbow">
              <Zap className="w-7 h-7 text-black" />
            </div>
            <div className="flex flex-col">
              <span className="text-2xl font-black bg-gradient-to-r from-neon-pink via-neon-purple to-neon-teal bg-clip-text text-transparent">
                SkipTheLine
              </span>
              <span className="text-xs text-gray-400 font-medium">Premium Nightlife Access</span>
            </div>
          </Link>
          
          {/* Desktop Navigation */}
          <nav 
            className="hidden md:flex items-center"
            style={{ gap: '0.25rem' }}
          >
            <Link 
              href="/cities" 
              className="text-gray-300 hover:text-neon-pink transition-colors font-semibold text-lg flex items-center space-x-2 group"
            >
              <Globe className="w-4 h-4 group-hover:text-neon-pink transition-colors" />
              <span>Cities</span>
            </Link>
            
            <Link 
              href="/" 
              className="text-gray-300 hover:text-neon-pink transition-colors font-semibold text-lg flex items-center space-x-2 group"
            >
              <Star className="w-4 h-4 group-hover:text-neon-pink transition-colors" />
              <span>Events</span>
            </Link>
            
            <div 
              className="flex items-center space-x-2 text-gray-400 text-sm"
              style={{ marginLeft: '0.25rem' }}
            >
              <Shield className="w-4 h-4 text-neon-green" />
              <span>Secure • Instant • Guaranteed</span>
            </div>
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 text-gray-400 hover:text-neon-pink transition-colors"
          >
            {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-700/50">
            <div className="flex flex-col space-y-4">
              <Link 
                href="/cities" 
                className="text-gray-300 hover:text-neon-pink transition-colors font-semibold flex items-center space-x-2"
                onClick={() => setIsMenuOpen(false)}
              >
                <Globe className="w-4 h-4" />
                <span>Cities</span>
              </Link>
              
              <Link 
                href="/" 
                className="text-gray-300 hover:text-neon-pink transition-colors font-semibold flex items-center space-x-2"
                onClick={() => setIsMenuOpen(false)}
              >
                <Star className="w-4 h-4" />
                <span>Events</span>
              </Link>
              
              <div className="flex items-center space-x-2 text-gray-400 text-sm">
                <Shield className="w-4 h-4 text-neon-green" />
                <span>Secure • Instant • Guaranteed</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
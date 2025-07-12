'use client';

import Header from '@/components/Header';
import EventCard from '@/components/EventCard';
import { mockEvents } from '@/data/mockData';
import { Sparkles, Zap, Star } from 'lucide-react';

export default function HomePage() {
  const activeEvents = mockEvents.filter(event => event.status === 'active');

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-neon-pink/10 via-transparent to-neon-teal/10" />
        
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20">
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <div className="p-4 bg-gradient-to-r from-neon-pink to-neon-teal rounded-2xl neon-glow-pink">
                <Zap className="w-12 h-12 text-black" />
              </div>
            </div>
            
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6">
              Skip The Line,
              <br />
              <span className="bg-gradient-to-r from-neon-pink to-neon-teal bg-clip-text text-transparent">
                Own The Night
              </span>
            </h1>
            
            <p className="text-lg sm:text-xl text-gray-300 mb-8 max-w-2xl mx-auto leading-relaxed">
              VIP fast-entry to Barcelona's hottest clubs. 
              <br className="hidden sm:block" />
              No guestlist, no waiting — just pure nightlife access.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
              <div className="flex items-center text-neon-teal">
                <Star className="w-5 h-5 mr-2" />
                <span className="font-medium">VIP Line Access</span>
              </div>
              <div className="flex items-center text-neon-pink">
                <Sparkles className="w-5 h-5 mr-2" />
                <span className="font-medium">Instant Entry</span>
              </div>
              <div className="flex items-center text-neon-teal">
                <Zap className="w-5 h-5 mr-2" />
                <span className="font-medium">No Stress</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Events Section */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            This Weekend's 
            <span className="bg-gradient-to-r from-neon-pink to-neon-teal bg-clip-text text-transparent">
              {" "}Fast Passes
            </span>
          </h2>
          <p className="text-gray-400 text-lg">
            Premium clubs, instant access, unforgettable nights
          </p>
        </div>

        {activeEvents.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
            {activeEvents.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="p-6 bg-gray-900 rounded-2xl border border-gray-800 max-w-md mx-auto">
              <h3 className="text-xl font-semibold text-gray-300 mb-2">
                No Events Available
              </h3>
              <p className="text-gray-500">
                Check back soon for the latest Barcelona nightlife fast passes!
              </p>
            </div>
          </div>
        )}
      </section>

      {/* How It Works */}
      <section className="bg-gray-900/50 border-t border-gray-800">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              How It Works
            </h2>
            <p className="text-gray-400 text-lg">
              Three simple steps to nightlife freedom
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-neon-pink rounded-2xl flex items-center justify-center mx-auto mb-4 neon-glow-pink">
                <span className="text-2xl font-bold text-black">1</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Choose Your Event</h3>
              <p className="text-gray-400">
                Browse premium clubs and select your perfect night out experience
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-neon-teal rounded-2xl flex items-center justify-center mx-auto mb-4 neon-glow-teal">
                <span className="text-2xl font-bold text-black">2</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Secure Your Pass</h3>
              <p className="text-gray-400">
                Quick checkout with instant confirmation and arrival instructions
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-r from-neon-pink to-neon-teal rounded-2xl flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-black">3</span>
              </div>
              <h3 className="text-xl font-semibold mb-2">Walk Right In</h3>
              <p className="text-gray-400">
                Skip the general line and enter through the VIP/express entrance
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 border-t border-gray-800">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <div className="p-2 bg-gradient-to-r from-neon-pink to-neon-teal rounded-lg">
                <Zap className="w-5 h-5 text-black" />
              </div>
              <span className="text-lg font-bold bg-gradient-to-r from-neon-pink to-neon-teal bg-clip-text text-transparent">
                SkipTheLine
              </span>
            </div>
            <p className="text-gray-500 text-sm">
              Premium nightlife access in Barcelona
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

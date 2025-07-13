'use client';

import Header from '@/components/Header';
import EventCard from '@/components/EventCard';
import { mockEvents } from '@/data/mockData';
import { Sparkles, Zap, Star, Shield, Clock, Users, TrendingUp, CheckCircle, Globe, Heart } from 'lucide-react';

export default function HomePage() {
  const activeEvents = mockEvents.filter(event => event.status === 'active');

  return (
    <div className="min-h-screen bg-background gradient-bg">
      <Header />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden min-h-[90vh] flex items-center justify-center">
        {/* Animated background elements */}
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-72 h-72 bg-neon-pink/5 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-neon-teal/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-neon-purple/3 rounded-full blur-3xl pulse-slow"></div>
        </div>
        
        <div className="absolute inset-0 bg-gradient-to-br from-neon-pink/5 via-transparent to-neon-teal/5" />
        
        <div className="container-responsive section-spacing">
          <div className="center-content flex-col">
            <div className="float-animation">
              <div className="center-content element-spacing">
                <div className="p-6 bg-gradient-to-r from-neon-pink via-neon-purple to-neon-teal rounded-3xl neon-glow-rainbow">
                  <Zap className="w-16 h-16 text-black" />
                </div>
              </div>
            </div>
          
            <h1 className="text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-black element-spacing leading-tight center-text">
              Skip The Line,
              <br />
              <span className="bg-gradient-to-r from-neon-pink via-neon-purple to-neon-teal bg-clip-text text-transparent text-glow-pink">
                Own The Night
              </span>
            </h1>
            
            <p className="text-xl sm:text-2xl text-gray-300 element-spacing max-w-4xl mx-auto leading-relaxed font-medium center-text">
              VIP fast-entry to Barcelona's most exclusive clubs. 
              <br className="hidden sm:block" />
              <span className="text-neon-teal">No guestlist, no waiting</span> — just pure nightlife access.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 element-spacing">
              <div className="flex items-center text-neon-teal bg-gray-900/50 px-6 py-3 rounded-full glass-effect">
                <Star className="w-6 h-6 mr-3" />
                <span className="font-semibold text-lg">VIP Line Access</span>
              </div>
              <div className="flex items-center text-neon-pink bg-gray-900/50 px-6 py-3 rounded-full glass-effect">
                <Sparkles className="w-6 h-6 mr-3" />
                <span className="font-semibold text-lg">Instant Entry</span>
              </div>
              <div className="flex items-center text-neon-green bg-gray-900/50 px-6 py-3 rounded-full glass-effect">
                <Shield className="w-6 h-6 mr-3" />
                <span className="font-semibold text-lg">100% Guaranteed</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              <button
                onClick={() => window.location.href = '/clubs'}
                className="btn-neon px-12 py-4 rounded-2xl font-bold text-lg text-black ripple"
              >
                Browse Events
              </button>
              <button className="text-gray-300 hover:text-neon-pink transition-colors font-semibold text-lg flex items-center">
                <Globe className="w-5 h-5 mr-2" />
                How It Works
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Indicators */}
      <section className="section-spacing border-y border-gray-800/50">
        <div className="container-responsive">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div className="space-y-2">
              <div className="text-3xl font-bold text-neon-pink">1000+</div>
              <div className="text-gray-400">Happy Guests</div>
            </div>
            <div className="space-y-2">
              <div className="text-3xl font-bold text-neon-teal">15+</div>
              <div className="text-gray-400">Premium Clubs</div>
            </div>
            <div className="space-y-2">
              <div className="text-3xl font-bold text-neon-purple">24/7</div>
              <div className="text-gray-400">Support</div>
            </div>
            <div className="space-y-2">
              <div className="text-3xl font-bold text-neon-green">100%</div>
              <div className="text-gray-400">Success Rate</div>
            </div>
          </div>
        </div>
      </section>

      {/* Events Section */}
      <section className="container-responsive section-spacing">
        <div className="text-center element-spacing">
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black element-spacing">
            This Weekend's 
            <span className="bg-gradient-to-r from-neon-pink via-neon-purple to-neon-teal bg-clip-text text-transparent">
              {" "}Fast Passes
            </span>
          </h2>
          <p className="text-gray-400 text-xl max-w-2xl mx-auto">
            Premium clubs, instant access, unforgettable nights. Select your perfect Barcelona experience.
          </p>
        </div>

        {activeEvents.length > 0 ? (
          <div className="grid grid-responsive grid-responsive-2">
            {activeEvents.map((event) => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="card-spacing glass-effect rounded-3xl max-w-md mx-auto">
              <div className="w-20 h-20 bg-gradient-to-r from-neon-pink to-neon-teal rounded-full flex items-center justify-center mx-auto element-spacing">
                <Heart className="w-10 h-10 text-black" />
              </div>
              <h3 className="text-2xl font-bold text-gray-300 element-spacing">
                No Events Available
              </h3>
              <p className="text-gray-500 text-lg leading-relaxed">
                Check back soon for the latest Barcelona nightlife fast passes! 
                Follow us for updates on new events.
              </p>
            </div>
          </div>
        )}
      </section>

      {/* How It Works */}
      <section className="bg-gray-950/50 border-y border-gray-800/50">
        <div className="container-responsive section-spacing">
          <div className="text-center element-spacing">
            <h2 className="text-4xl sm:text-5xl font-black element-spacing">
              How It Works
            </h2>
            <p className="text-gray-400 text-xl max-w-2xl mx-auto">
              Three simple steps to nightlife freedom. No complications, just results.
            </p>
          </div>

          <div className="grid grid-responsive md:grid-responsive-3">
            <div className="text-center group">
              <div className="relative element-spacing">
                <div className="w-24 h-24 bg-gradient-to-br from-neon-pink to-neon-purple rounded-3xl flex items-center justify-center mx-auto neon-glow-pink group-hover:scale-110 transition-all duration-300">
                  <span className="text-3xl font-black text-black">1</span>
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-neon-teal rounded-full flex items-center justify-center">
                  <TrendingUp className="w-4 h-4 text-black" />
                </div>
              </div>
              <h3 className="text-2xl font-bold element-spacing">Choose Your Event</h3>
              <p className="text-gray-400 text-lg leading-relaxed">
                Browse premium clubs and select your perfect night out experience. Each venue hand-picked for quality.
              </p>
            </div>

            <div className="text-center group">
              <div className="relative element-spacing">
                <div className="w-24 h-24 bg-gradient-to-br from-neon-teal to-neon-green rounded-3xl flex items-center justify-center mx-auto neon-glow-teal group-hover:scale-110 transition-all duration-300">
                  <span className="text-3xl font-black text-black">2</span>
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-neon-pink rounded-full flex items-center justify-center">
                  <Shield className="w-4 h-4 text-black" />
                </div>
              </div>
              <h3 className="text-2xl font-bold element-spacing">Secure Your Pass</h3>
              <p className="text-gray-400 text-lg leading-relaxed">
                Quick checkout with instant confirmation and detailed arrival instructions. Payment secured by Stripe.
              </p>
            </div>

            <div className="text-center group">
              <div className="relative element-spacing">
                <div className="w-24 h-24 bg-gradient-to-br from-neon-purple to-neon-pink rounded-3xl flex items-center justify-center mx-auto neon-glow-purple group-hover:scale-110 transition-all duration-300">
                  <span className="text-3xl font-black text-black">3</span>
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-neon-green rounded-full flex items-center justify-center">
                  <CheckCircle className="w-4 h-4 text-black" />
                </div>
              </div>
              <h3 className="text-2xl font-bold element-spacing">Walk Right In</h3>
              <p className="text-gray-400 text-lg leading-relaxed">
                Skip the general line and enter through the VIP/express entrance. Show your pass and enjoy the night.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-spacing">
        <div className="container-responsive text-center">
          <div className="glass-effect-strong rounded-3xl card-spacing">
            <h2 className="text-3xl sm:text-4xl font-black element-spacing">
              Ready to Skip The Line?
            </h2>
            <p className="text-gray-400 text-lg element-spacing max-w-2xl mx-auto">
              Join thousands of smart party-goers who've discovered the secret to Barcelona's best nights out.
            </p>
            <button
              onClick={() => window.location.href = '/clubs'}
              className="btn-neon px-10 py-4 rounded-2xl font-bold text-lg text-black ripple"
            >
              View Tonight's Events
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-950 border-t border-gray-800">
        <div className="container-responsive section-spacing">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-3 element-spacing">
              <div className="p-3 bg-gradient-to-r from-neon-pink via-neon-purple to-neon-teal rounded-xl">
                <Zap className="w-8 h-8 text-black" />
              </div>
              <span className="text-2xl font-black bg-gradient-to-r from-neon-pink via-neon-purple to-neon-teal bg-clip-text text-transparent">
                SkipTheLine
              </span>
            </div>
            <p className="text-gray-500 text-lg element-spacing">
              Premium nightlife access in Barcelona
            </p>
            <div className="flex items-center justify-center space-x-8 text-sm text-gray-600">
              <span>Privacy Policy</span>
              <span>Terms of Service</span>
              <span>Contact Support</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

'use client';

import Link from 'next/link';
import { Calendar, Clock, MapPin, Star, TrendingUp, Sparkles, CheckCircle } from 'lucide-react';
import { Event, Club } from '@/types';
import { useState, useEffect } from 'react';
import { getClubs } from '@/lib/firebaseService';

interface EventCardProps {
  event: Event;
}

export default function EventCard({ event }: EventCardProps) {
  const [clubs, setClubs] = useState<Club[]>([]);
  const [loading, setLoading] = useState(true);

  // Load clubs from Firebase
  useEffect(() => {
    const loadClubs = async () => {
      try {
        const clubsData = await getClubs();
        setClubs(clubsData);
      } catch (error) {
        console.error('Error loading clubs:', error);
      } finally {
        setLoading(false);
      }
    };

    loadClubs();
  }, []);

  const club = clubs.find(c => c.id === event.clubId);
  const clubName = club?.name || 'Unknown Club';
  const clubLocation = club?.location || 'Unknown Location';

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const options: Intl.DateTimeFormatOptions = {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    };
    return date.toLocaleDateString('en-US', options);
  };

  const formatFullDate = (dateString: string) => {
    const date = new Date(dateString);
    const options: Intl.DateTimeFormatOptions = {
      weekday: 'long',
      month: 'long',
      day: 'numeric'
    };
    return date.toLocaleDateString('en-US', options);
  };

  const availableTickets = event.availability;
  const isLowStock = availableTickets <= 5;
  const isSoldOut = event.status === 'sold-out' || availableTickets <= 0;
  const soldPercentage = ((event.maxTickets - event.availability) / event.maxTickets) * 100;

  return (
    <div className="group relative overflow-hidden rounded-3xl glass-effect-strong hover:border-neon-pink/30 transition-all duration-500 card-hover">
      {/* Background Image with Overlay */}
      <div className="relative h-80 overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center transform group-hover:scale-110 transition-all duration-700"
          style={{ backgroundImage: `url(${event.imageUrl})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/60 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-br from-neon-pink/10 via-transparent to-neon-teal/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        
        {/* Floating Status Badge */}
        <div className="absolute top-6 right-6">
          {isSoldOut ? (
            <div className="px-4 py-2 bg-red-500/90 backdrop-blur-sm text-white text-sm font-bold rounded-full border border-red-400/50">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-white rounded-full"></div>
                <span>SOLD OUT</span>
              </div>
            </div>
          ) : isLowStock ? (
            <div className="px-4 py-2 bg-yellow-500/90 backdrop-blur-sm text-black text-sm font-bold rounded-full border border-yellow-400/50 neon-glow-pink">
              <div className="flex items-center space-x-2">
                <TrendingUp className="w-3 h-3" />
                <span>LIMITED SPOTS</span>
              </div>
            </div>
          ) : (
            <div className="px-4 py-2 bg-neon-teal/90 backdrop-blur-sm text-black text-sm font-bold rounded-full border border-neon-teal/50 neon-glow-teal">
              <div className="flex items-center space-x-2">
                <Sparkles className="w-3 h-3" />
                <span>AVAILABLE</span>
              </div>
            </div>
          )}
        </div>

        {/* Popularity Indicator */}
        <div className="absolute top-6 left-6">
          <div className="px-3 py-1 bg-gray-900/80 backdrop-blur-sm rounded-full border border-gray-700/50">
            <div className="flex items-center space-x-1 text-yellow-400 text-xs font-medium">
              <Star className="w-3 h-3 fill-current" />
              <span>{club?.type ? club.type.charAt(0).toUpperCase() + club.type.slice(1) : 'Premium'}</span>
            </div>
          </div>
        </div>

        {/* Event Title Overlay */}
        <div className="absolute bottom-6 left-6 right-6">
          <h3 className="text-2xl font-black text-white mb-1 text-glow-pink">{clubName}</h3>
          <p className="text-neon-pink font-bold text-lg">{event.title}</p>
          <div className="mt-3 flex items-center text-gray-300 text-sm">
            <Calendar className="w-4 h-4 mr-2" />
            {formatFullDate(event.date)}
          </div>
        </div>
      </div>

      {/* Event Details Section */}
      <div className="card-spacing">
        {/* Info Grid */}
        <div className="grid grid-cols-2 gap-4 element-spacing">
          <div className="space-y-3">
            <div className="flex items-center text-gray-400 text-sm">
              <Clock className="w-4 h-4 mr-4 text-neon-teal" />
              <span>{event.time}</span>
            </div>
            
            <div className="flex items-center text-gray-400 text-sm">
              <MapPin className="w-4 h-4 mr-4 text-neon-pink" />
              <span className="truncate">{clubLocation.split(',')[0]}</span>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center text-gray-400 text-sm">
              <Star className="w-4 h-4 mr-4 text-neon-purple" />
              <span>VIP Experience</span>
            </div>

            <div className="flex items-center text-gray-400 text-sm">
              <CheckCircle className="w-4 h-4 mr-4 text-neon-green" />
              <span>Guaranteed Entry</span>
            </div>
          </div>
        </div>

        {/* Includes Section */}
        <div className="element-spacing p-4 bg-gradient-to-r from-neon-pink/5 to-neon-teal/5 border border-neon-pink/20 rounded-2xl">
          <div className="flex items-center text-neon-pink text-sm font-semibold mb-2">
            <Sparkles className="w-4 h-4 mr-3" />
            <span>VIP Experience Includes</span>
          </div>
          <div className="text-gray-300 text-sm space-y-1">
            <div>✓ Skip the general line</div>
            <div>✓ VIP/Express entrance</div>
            <div>✓ Full club access</div>
            <div>✓ Instant confirmation</div>
          </div>
        </div>

        {/* Price and CTA */}
        <div className="flex items-center justify-between">
          <div>
            <div className="text-3xl font-black text-transparent bg-gradient-to-r from-neon-pink to-neon-teal bg-clip-text">
              €{event.price}
            </div>
            <div className="text-gray-400 text-sm font-medium">per person</div>
          </div>
          
          <Link 
            href={`/event/${event.id}`}
            className={`relative px-8 py-4 rounded-2xl font-bold transition-all duration-300 ripple ${
              isSoldOut 
                ? 'bg-gray-700 text-gray-400 cursor-not-allowed border border-gray-600' 
                : 'btn-neon text-black hover:shadow-2xl group-hover:scale-105 neon-glow-pink'
            }`}
          >
            {isSoldOut ? (
              <span>Sold Out</span>
            ) : (
              <span className="flex items-center space-x-2">
                <span>Get Pass</span>
                <Sparkles className="w-4 h-4" />
              </span>
            )}
          </Link>
        </div>

        {/* Urgency Indicator - Only show if limited */}
        {!isSoldOut && isLowStock && (
          <div className="mt-4 p-3 bg-yellow-500/10 border border-yellow-500/30 rounded-xl">
            <div className="flex items-center text-yellow-400 text-sm font-medium">
              <TrendingUp className="w-4 h-4 mr-3" />
              <span>High demand - Limited spots remaining!</span>
            </div>
          </div>
        )}
      </div>

      {/* Hover Glow Effect */}
      <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-neon-pink/5 to-neon-teal/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
    </div>
  );
}
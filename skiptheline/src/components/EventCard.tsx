'use client';

import Link from 'next/link';
import { Calendar, Clock, MapPin, Users } from 'lucide-react';
import { Event } from '@/types';

interface EventCardProps {
  event: Event;
}

export default function EventCard({ event }: EventCardProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'short',
      day: 'numeric'
    });
  };

  const availableTickets = event.maxTickets - event.soldTickets;
  const isLowStock = availableTickets <= 5;
  const isSoldOut = event.status === 'sold-out' || availableTickets <= 0;

  return (
    <div className="group relative overflow-hidden rounded-2xl bg-gray-900 border border-gray-800 hover:border-neon-pink/50 transition-all duration-300">
      {/* Background Image */}
      <div 
        className="h-48 sm:h-56 bg-cover bg-center relative"
        style={{ backgroundImage: `url(${event.imageUrl})` }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/50 to-transparent" />
        
        {/* Status Badge */}
        <div className="absolute top-4 right-4">
          {isSoldOut ? (
            <span className="px-3 py-1 bg-red-500 text-white text-xs font-semibold rounded-full">
              SOLD OUT
            </span>
          ) : isLowStock ? (
            <span className="px-3 py-1 bg-yellow-500 text-black text-xs font-semibold rounded-full">
              {availableTickets} LEFT
            </span>
          ) : (
            <span className="px-3 py-1 bg-neon-teal text-black text-xs font-semibold rounded-full">
              AVAILABLE
            </span>
          )}
        </div>

        {/* Club Name */}
        <div className="absolute bottom-4 left-4">
          <h3 className="text-lg font-semibold text-white mb-1">{event.clubName}</h3>
          <p className="text-neon-pink font-medium">{event.title}</p>
        </div>
      </div>

      {/* Event Details */}
      <div className="p-4 sm:p-6">
        <div className="flex flex-col space-y-3 mb-4">
          <div className="flex items-center text-gray-400 text-sm">
            <Calendar className="w-4 h-4 mr-2" />
            {formatDate(event.date)}
          </div>
          
          <div className="flex items-center text-gray-400 text-sm">
            <Clock className="w-4 h-4 mr-2" />
            {event.arrivalWindow}
          </div>
          
          <div className="flex items-center text-gray-400 text-sm">
            <MapPin className="w-4 h-4 mr-2" />
            {event.location}
          </div>

          <div className="flex items-center text-gray-400 text-sm">
            <Users className="w-4 h-4 mr-2" />
            {event.soldTickets}/{event.maxTickets} sold
          </div>
        </div>

        {/* Price and CTA */}
        <div className="flex items-center justify-between">
          <div className="text-2xl font-bold text-neon-pink">
            €{event.price}
            <span className="text-sm text-gray-400 font-normal"> / person</span>
          </div>
          
          <Link 
            href={`/event/${event.id}`}
            className={`px-6 py-3 rounded-lg font-semibold transition-all duration-300 btn-neon ${
              isSoldOut 
                ? 'bg-gray-600 text-gray-400 cursor-not-allowed' 
                : 'bg-neon-pink text-black hover:bg-neon-pink/90 neon-glow-pink'
            }`}
          >
            {isSoldOut ? 'Sold Out' : 'Get Pass'}
          </Link>
        </div>

        {/* Includes */}
        <div className="mt-4 pt-4 border-t border-gray-800">
          <p className="text-sm text-gray-300">
            ✅ <span className="font-medium">Includes:</span> VIP Line Access + Full Entry
          </p>
        </div>
      </div>
    </div>
  );
}
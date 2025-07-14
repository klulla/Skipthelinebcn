'use client';

import { useState } from 'react';
import Header from '@/components/Header';
import EventCard from '@/components/EventCard';
import { getEvents, getClubs } from '@/lib/firebaseService';
import { Club, Event } from '@/types';
import { MapPin, Users, Star, Calendar, Filter, Search } from 'lucide-react';
import { useEffect } from 'react';

export default function ClubsPage() {
  const [selectedClub, setSelectedClub] = useState<Club | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'nightclub' | 'rooftop' | 'beach' | 'underground'>('all');
  const [events, setEvents] = useState<Event[]>([]);
  const [clubs, setClubs] = useState<Club[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const [eventsData, clubsData] = await Promise.all([
          getEvents(),
          getClubs()
        ]);
        setEvents(eventsData);
        setClubs(clubsData);
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const activeClubs = clubs.filter(club => club.status === 'active');
  const activeEvents = events.filter(event => event.status === 'active');

  const filteredClubs = activeClubs.filter(club => {
    const matchesSearch = club.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         club.location.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterType === 'all' || club.type === filterType;
    return matchesSearch && matchesFilter;
  });

  const getClubEvents = (clubId: string) => {
    return activeEvents.filter(event => event.clubId === clubId);
  };

  const getClub = (clubId: string) => {
    return clubs.find(club => club.id === clubId);
  };

  return (
    <div className="min-h-screen bg-background gradient-bg">
      <Header />
      
      <div className="container-responsive section-spacing">
        {/* Header */}
        <div className="text-center element-spacing">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black element-spacing">
            Barcelona's Premier
            <br />
            <span className="bg-gradient-to-r from-neon-pink via-neon-purple to-neon-teal bg-clip-text text-transparent">
              Nightlife Venues
            </span>
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Discover Barcelona's hottest clubs and secure your VIP fast-entry. 
            Click on any venue to see available events.
          </p>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col lg:flex-row gap-6 element-spacing">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search clubs or locations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-gray-800/50 border border-gray-600 rounded-2xl text-white placeholder-gray-400 focus:border-neon-pink focus:outline-none transition-colors input-glow"
            />
          </div>
          
          <div className="relative">
            <Filter className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value as any)}
              className="pl-12 pr-8 py-4 bg-gray-800/50 border border-gray-600 rounded-2xl text-white focus:border-neon-pink focus:outline-none transition-colors appearance-none min-w-[200px]"
            >
              <option value="all">All Venues</option>
              <option value="nightclub">Nightclubs</option>
              <option value="rooftop">Rooftop Bars</option>
              <option value="beach">Beach Clubs</option>
              <option value="underground">Underground</option>
            </select>
          </div>
        </div>

        {/* Clubs Grid */}
        <div className="grid grid-responsive grid-responsive-2 lg:grid-responsive-3">
          {filteredClubs.map((club) => {
            const clubEvents = getClubEvents(club.id);
            const typeColors = {
              nightclub: 'text-neon-pink',
              rooftop: 'text-neon-teal',
              beach: 'text-neon-blue',
              underground: 'text-neon-purple'
            };

            return (
              <div
                key={club.id}
                onClick={() => setSelectedClub(club)}
                className="glass-effect-strong rounded-3xl card-spacing border border-gray-700/50 card-hover cursor-pointer group"
              >
                <div className="relative overflow-hidden rounded-2xl element-spacing">
                  <img
                    src={club.imageUrl}
                    alt={club.name}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4">
                    <div className="flex items-center justify-between">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold glass-effect ${typeColors[club.type]}`}>
                        {club.type.toUpperCase()}
                      </span>
                      <span className="text-white font-bold text-sm">
                        {clubEvents.length} events
                      </span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <h3 className="text-2xl font-bold text-white element-spacing group-hover:text-neon-pink transition-colors">
                      {club.name}
                    </h3>
                    <div className="flex items-center text-gray-400 text-sm">
                      <MapPin className="w-4 h-4 mr-2" />
                      <span className="line-clamp-1">{club.location}</span>
                    </div>
                  </div>

                  <p className="text-gray-300 text-sm leading-relaxed line-clamp-3">
                    {club.description}
                  </p>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-gray-400 text-sm">
                      <Users className="w-4 h-4 mr-2" />
                      <span>Up to {club.capacity} people</span>
                    </div>
                    <div className="flex items-center text-neon-teal text-sm">
                      <Calendar className="w-4 h-4 mr-2" />
                      <span>{clubEvents.length} events</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {club.amenities.slice(0, 3).map((amenity, index) => (
                      <span key={index} className="px-2 py-1 bg-gray-800/50 text-gray-300 text-xs rounded-lg">
                        {amenity}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {filteredClubs.length === 0 && (
          <div className="text-center py-16">
            <div className="card-spacing glass-effect rounded-3xl max-w-md mx-auto">
              <div className="w-20 h-20 bg-gradient-to-r from-neon-pink to-neon-teal rounded-full flex items-center justify-center mx-auto element-spacing">
                <MapPin className="w-10 h-10 text-black" />
              </div>
              <h3 className="text-2xl font-bold text-gray-300 element-spacing">
                No Venues Found
              </h3>
              <p className="text-gray-500 text-lg leading-relaxed">
                Try adjusting your search or filter to find the perfect venue for your night out.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Club Modal */}
      {selectedClub && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-gray-900 rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="relative">
              <img
                src={selectedClub.imageUrl}
                alt={selectedClub.name}
                className="w-full h-64 object-cover rounded-t-3xl"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent rounded-t-3xl" />
              <button
                onClick={() => setSelectedClub(null)}
                className="absolute top-4 right-4 w-10 h-10 bg-black/50 rounded-full flex items-center justify-center text-white hover:bg-black/70 transition-colors"
              >
                ×
              </button>
              <div className="absolute bottom-4 left-6 right-6">
                <h2 className="text-3xl font-black text-white mb-2">{selectedClub.name}</h2>
                <div className="flex items-center text-gray-300">
                  <MapPin className="w-5 h-5 mr-2" />
                  <span>{selectedClub.location}</span>
                </div>
              </div>
            </div>

            <div className="p-8">
              <div className="grid md:grid-cols-2 gap-8 mb-8">
                <div>
                  <h3 className="text-xl font-bold text-white mb-4">About This Venue</h3>
                  <p className="text-gray-300 leading-relaxed mb-6">
                    {selectedClub.description}
                  </p>
                  
                  <div className="space-y-3">
                    <div className="flex items-center text-gray-300">
                      <Users className="w-5 h-5 mr-3 text-neon-teal" />
                      <span>Capacity: {selectedClub.capacity} people</span>
                    </div>
                    <div className="flex items-center text-gray-300">
                      <Star className="w-5 h-5 mr-3 text-neon-pink" />
                      <span>Type: {selectedClub.type.charAt(0).toUpperCase() + selectedClub.type.slice(1)}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-bold text-white mb-4">Amenities</h3>
                  <div className="grid grid-cols-2 gap-2">
                    {selectedClub.amenities.map((amenity, index) => (
                      <div key={index} className="flex items-center text-gray-300 text-sm">
                        <div className="w-2 h-2 bg-neon-teal rounded-full mr-3" />
                        {amenity}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-2xl font-bold text-white mb-6">Available Events</h3>
                {getClubEvents(selectedClub.id).length > 0 ? (
                  <div className="grid md:grid-cols-2 gap-6">
                    {getClubEvents(selectedClub.id).map((event) => (
                      <EventCard key={event.id} event={event} />
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 bg-gradient-to-r from-neon-pink to-neon-teal rounded-full flex items-center justify-center mx-auto mb-4">
                      <Calendar className="w-8 h-8 text-black" />
                    </div>
                    <h4 className="text-xl font-bold text-gray-300 mb-2">No Events Available</h4>
                    <p className="text-gray-500">
                      Check back soon for upcoming events at {selectedClub.name}!
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
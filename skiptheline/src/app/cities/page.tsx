'use client';

import { useState, useEffect } from 'react';
import Header from '@/components/Header';
import { getClubs } from '@/lib/firebaseService';
import { Club } from '@/types';
import { MapPin, Users, Star, Building2, Globe } from 'lucide-react';
import Link from 'next/link';

interface CityData {
  name: string;
  clubCount: number;
  imageUrl: string;
  description: string;
}

export default function CitiesPage() {
  const [cities, setCities] = useState<CityData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCities = async () => {
      try {
        setLoading(true);
        const clubsData = await getClubs();
        
        // Group clubs by city and create city data
        const cityMap = new Map<string, CityData>();
        
        clubsData.forEach(club => {
          if (club.status === 'active') {
            if (cityMap.has(club.city)) {
              const existing = cityMap.get(club.city)!;
              existing.clubCount += 1;
            } else {
              cityMap.set(club.city, {
                name: club.city,
                clubCount: 1,
                imageUrl: club.imageUrl, // Use first club's image as city image
                description: `Discover the best nightlife in ${club.city} with exclusive VIP access to premium clubs and venues.`
              });
            }
          }
        });
        
        setCities(Array.from(cityMap.values()));
      } catch (error) {
        console.error('Error loading cities:', error);
      } finally {
        setLoading(false);
      }
    };

    loadCities();
  }, []);

  return (
    <div className="min-h-screen bg-background gradient-bg">
      <Header />
      
      <div className="container-responsive section-spacing">
        {/* Header */}
        <div className="text-center element-spacing">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black element-spacing">
            Choose Your
            <br />
            <span className="bg-gradient-to-r from-neon-pink via-neon-purple to-neon-teal bg-clip-text text-transparent">
              Nightlife Destination
            </span>
          </h1>

        </div>

        {/* Cities Grid */}
        {loading ? (
          <div className="text-center py-16">
            <div className="spinner w-12 h-12 mx-auto mb-6"></div>
            <p className="text-gray-400 text-lg">Loading cities...</p>
          </div>
        ) : cities.length > 0 ? (
          <div className="grid grid-responsive grid-responsive-2 lg:grid-responsive-3">
            {cities.map((city) => (
              <Link
                key={city.name}
                href={`/cities/${encodeURIComponent(city.name)}`}
                className="group"
              >
                <div className="glass-effect-strong rounded-3xl card-spacing border border-gray-700/50 card-hover cursor-pointer group">
                  <div className="relative overflow-hidden rounded-2xl element-spacing">
                    <img
                      src={city.imageUrl}
                      alt={city.name}
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                    <div className="absolute bottom-4 left-4 right-4">
                      <div className="flex items-center justify-between">
                        <span className="px-3 py-1 rounded-full text-xs font-bold glass-effect text-neon-teal">
                          {city.clubCount} VENUES
                        </span>
                        <span className="text-white font-bold text-sm">
                          <Globe className="w-4 h-4 inline mr-1" />
                          {city.name}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <h3 className="text-2xl font-bold text-white element-spacing group-hover:text-neon-pink transition-colors">
                        {city.name}
                      </h3>
                      <div className="flex items-center text-gray-400 text-sm">
                        <Building2 className="w-4 h-4 mr-2" />
                        <span>{city.clubCount} premium venues</span>
                      </div>
                    </div>

                    <p className="text-gray-300 text-sm leading-relaxed line-clamp-3">
                      {city.description}
                    </p>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center text-gray-400 text-sm">
                        <Users className="w-4 h-4 mr-2" />
                        <span>Multiple venues</span>
                      </div>
                      <div className="flex items-center text-neon-teal text-sm">
                        <Star className="w-4 h-4 mr-2" />
                        <span>VIP Access</span>
                      </div>
                    </div>

                    <div className="pt-2">
                      <div className="w-full bg-gray-800/50 rounded-full h-2">
                        <div 
                          className="bg-gradient-to-r from-neon-pink to-neon-teal h-2 rounded-full transition-all duration-300"
                          style={{ width: `${Math.min((city.clubCount / 10) * 100, 100)}%` }}
                        ></div>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        {city.clubCount} active venues
                      </p>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="card-spacing glass-effect rounded-3xl max-w-md mx-auto">
              <div className="w-20 h-20 bg-gradient-to-r from-neon-pink to-neon-teal rounded-full flex items-center justify-center mx-auto element-spacing">
                <MapPin className="w-10 h-10 text-black" />
              </div>
              <h3 className="text-2xl font-bold text-gray-300 element-spacing">
                No Cities Available
              </h3>
              <p className="text-gray-500 text-lg leading-relaxed">
                Check back soon for new cities and venues! 
                Follow us for updates on new locations.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

'use client';

import { useState, useEffect } from 'react';
import { 
  getEvents, 
  getClubs, 
  getPurchases, 
  createEvent, 
  updateEvent, 
  deleteEvent,
  createClub,
  updateClub,
  deleteClub,
  getSalesAnalytics
} from '@/lib/firebaseService';
import { Event, Club, Purchase, EventFormData } from '@/types';
import { 
  Calendar, 
  Building, 
  Users, 
  DollarSign, 
  TrendingUp, 
  Plus, 
  Edit3, 
  Trash2, 
  Eye,
  EyeOff,
  CheckCircle,
  X,
  Filter,
  Search,
  Star,
  MapPin,
  Globe
} from 'lucide-react';
import EventForm from '@/components/EventForm';
import ClubForm from '@/components/ClubForm';
import CityForm from '@/components/CityForm';

interface City {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  status: 'active' | 'inactive';
}

export default function AdminPage() {
  // Data states
  const [events, setEvents] = useState<Event[]>([]);
  const [clubs, setClubs] = useState<Club[]>([]);
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  const [analytics, setAnalytics] = useState<any>(null);
  
  // Loading states
  const [loading, setLoading] = useState(true);
  const [eventsLoading, setEventsLoading] = useState(false);
  const [clubsLoading, setClubsLoading] = useState(false);
  const [citiesLoading, setCitiesLoading] = useState(false);
  
  // Form states
  const [showEventForm, setShowEventForm] = useState(false);
  const [showClubForm, setShowClubForm] = useState(false);
  const [showCityForm, setShowCityForm] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [editingClub, setEditingClub] = useState<Club | null>(null);
  const [editingCity, setEditingCity] = useState<City | null>(null);
  
  // Filter states
  const [activeTab, setActiveTab] = useState<'overview' | 'events' | 'clubs' | 'cities'>('overview');
  const [eventFilterStatus, setEventFilterStatus] = useState<'all' | 'active' | 'sold-out' | 'hidden'>('all');
  const [clubFilterStatus, setClubFilterStatus] = useState<'all' | 'active' | 'inactive'>('all');
  const [cityFilterStatus, setCityFilterStatus] = useState<'all' | 'active' | 'inactive'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = async () => {
    try {
      setLoading(true);
      const [eventsData, clubsData, purchasesData, analyticsData] = await Promise.all([
        getEvents(),
        getClubs(),
        getPurchases(),
        getSalesAnalytics()
      ]);
      
      setEvents(eventsData);
      setClubs(clubsData);
      setPurchases(purchasesData);
      setAnalytics(analyticsData);
      
      // Extract unique cities from clubs
      const uniqueCities = Array.from(new Set(clubsData.map(club => club.city)))
        .filter(cityName => cityName) // Filter out empty city names
        .map(cityName => ({
          id: cityName.toLowerCase().replace(/\s+/g, '-'),
          name: cityName,
          description: `Premium nightlife venues in ${cityName}`,
          imageUrl: clubsData.find(club => club.city === cityName)?.imageUrl || 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=800&h=400&fit=crop',
          status: 'active' as const
        }));
      
      // If no cities found in clubs, create a default Barcelona city
      if (uniqueCities.length === 0) {
        uniqueCities.push({
          id: 'barcelona',
          name: 'Barcelona',
          description: 'Premium nightlife venues in Barcelona',
          imageUrl: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=800&h=400&fit=crop',
          status: 'active' as const
        });
      }
      
      console.log('Clubs loaded:', clubsData);
      console.log('Cities extracted:', uniqueCities);
      
      setCities(uniqueCities);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Event handlers
  const handleCreateEvent = async (eventData: EventFormData) => {
    try {
      setEventsLoading(true);
      const newEvent = await createEvent({
        ...eventData,
        soldTickets: 0,
        status: 'active',
        stripePaymentLink: ''
      });
      setEvents(prev => [newEvent, ...prev]);
      setShowEventForm(false);
    } catch (error) {
      console.error('Error creating event:', error);
    } finally {
      setEventsLoading(false);
    }
  };

  const handleEditEvent = async (eventData: EventFormData) => {
    if (!editingEvent) return;
    try {
      setEventsLoading(true);
      await updateEvent(editingEvent.id, eventData);
      setEvents(prev => prev.map(e => e.id === editingEvent.id ? { ...e, ...eventData } : e));
      setShowEventForm(false);
      setEditingEvent(null);
    } catch (error) {
      console.error('Error updating event:', error);
    } finally {
      setEventsLoading(false);
    }
  };

  const deleteEventHandler = async (eventId: string) => {
    if (confirm('Are you sure you want to delete this event?')) {
      try {
        setEventsLoading(true);
        await deleteEvent(eventId);
        setEvents(prev => prev.filter(e => e.id !== eventId));
      } catch (error) {
        console.error('Error deleting event:', error);
      } finally {
        setEventsLoading(false);
      }
    }
  };

  // Club handlers
  const handleCreateClub = (clubData: Omit<Club, 'id'>) => {
    try {
      setClubsLoading(true);
      createClub(clubData).then(newClub => {
        setClubs(prev => [newClub, ...prev]);
        
        // Add city if it doesn't exist
        if (!cities.find(city => city.name === clubData.city)) {
          const newCity: City = {
            id: clubData.city.toLowerCase().replace(/\s+/g, '-'),
            name: clubData.city,
            description: `Premium nightlife venues in ${clubData.city}`,
            imageUrl: clubData.imageUrl,
            status: 'active'
          };
          setCities(prev => [...prev, newCity]);
        }
        
        setShowClubForm(false);
      }).catch(error => {
        console.error('Error creating club:', error);
      }).finally(() => {
        setClubsLoading(false);
      });
    } catch (error) {
      console.error('Error creating club:', error);
      setClubsLoading(false);
    }
  };

  const handleEditClub = (clubData: Partial<Club>) => {
    if (!editingClub) return;
    try {
      setClubsLoading(true);
      updateClub(editingClub.id, clubData).then(() => {
        setClubs(prev => prev.map(c => c.id === editingClub.id ? { ...c, ...clubData } : c));
        setShowClubForm(false);
        setEditingClub(null);
      }).catch(error => {
        console.error('Error updating club:', error);
      }).finally(() => {
        setClubsLoading(false);
      });
    } catch (error) {
      console.error('Error updating club:', error);
      setClubsLoading(false);
    }
  };

  const deleteClubHandler = async (clubId: string) => {
    if (confirm('Are you sure you want to delete this club?')) {
      try {
        setClubsLoading(true);
        await deleteClub(clubId);
        setClubs(prev => prev.filter(c => c.id !== clubId));
      } catch (error) {
        console.error('Error deleting club:', error);
      } finally {
        setClubsLoading(false);
      }
    }
  };

  // City handlers
  const handleCreateCity = (cityData: Omit<City, 'id'>) => {
    try {
      setCitiesLoading(true);
      const newCity: City = {
        ...cityData,
        id: cityData.name.toLowerCase().replace(/\s+/g, '-')
      };
      setCities(prev => [newCity, ...prev]);
      setShowCityForm(false);
      setCitiesLoading(false);
    } catch (error) {
      console.error('Error creating city:', error);
      setCitiesLoading(false);
    }
  };

  const handleEditCity = (cityData: Partial<City>) => {
    if (!editingCity) return;
    try {
      setCitiesLoading(true);
      setCities(prev => prev.map(c => c.id === editingCity.id ? { ...c, ...cityData } : c));
      setShowCityForm(false);
      setEditingCity(null);
      setCitiesLoading(false);
    } catch (error) {
      console.error('Error updating city:', error);
      setCitiesLoading(false);
    }
  };

  const deleteCityHandler = async (cityId: string) => {
    const city = cities.find(c => c.id === cityId);
    if (!city) return;
    
    // Check if city has clubs
    const cityClubs = clubs.filter(club => club.city === city.name);
    if (cityClubs.length > 0) {
      alert(`Cannot delete ${city.name} - it has ${cityClubs.length} clubs. Please delete or move the clubs first.`);
      return;
    }
    
    if (confirm(`Are you sure you want to delete ${city.name}?`)) {
      try {
        setCitiesLoading(true);
        setCities(prev => prev.filter(c => c.id !== cityId));
      } catch (error) {
        console.error('Error deleting city:', error);
      } finally {
        setCitiesLoading(false);
      }
    }
  };

  // Filter functions
  const filteredEvents = events.filter(event => {
    const matchesStatus = eventFilterStatus === 'all' || event.status === eventFilterStatus;
    const matchesSearch = event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         event.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const filteredClubs = clubs.filter(club => {
    const matchesStatus = clubFilterStatus === 'all' || club.status === clubFilterStatus;
    const matchesSearch = club.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         club.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         club.location.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const filteredCities = cities.filter(city => {
    const matchesStatus = cityFilterStatus === 'all' || city.status === cityFilterStatus;
    const matchesSearch = city.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         city.description.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-background gradient-bg flex items-center justify-center">
        <div className="text-center">
          <div className="spinner w-12 h-12 mx-auto mb-6"></div>
          <p className="text-gray-400 text-lg">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background gradient-bg">
      <div className="container-responsive section-spacing">
        {/* Header */}
        <div className="text-center element-spacing">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black element-spacing">
            Admin
            <span className="bg-gradient-to-r from-neon-pink via-neon-purple to-neon-teal bg-clip-text text-transparent"> Dashboard</span>
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Manage events, clubs, cities, and monitor performance
          </p>
        </div>

        {/* Navigation Tabs */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {[
            { id: 'overview', label: 'Overview', icon: TrendingUp },
            { id: 'events', label: 'Events', icon: Calendar },
            { id: 'clubs', label: 'Clubs', icon: Building },
            { id: 'cities', label: 'Cities', icon: Globe }
          ].map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id as any)}
              className={`flex items-center space-x-2 px-6 py-3 rounded-2xl font-bold transition-all duration-300 ${
                activeTab === id
                  ? 'bg-gradient-to-r from-neon-pink to-neon-teal text-black shadow-lg'
                  : 'bg-gray-800/50 text-gray-300 hover:bg-gray-700/50'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span>{label}</span>
            </button>
          ))}
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-12">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="glass-effect-strong rounded-3xl p-6 text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-neon-pink to-neon-purple rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Calendar className="w-8 h-8 text-black" />
                </div>
                <div className="text-3xl font-bold text-white mb-2">{events.length}</div>
                <div className="text-gray-400">Total Events</div>
              </div>
              
              <div className="glass-effect-strong rounded-3xl p-6 text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-neon-teal to-neon-green rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Building className="w-8 h-8 text-black" />
                </div>
                <div className="text-3xl font-bold text-white mb-2">{clubs.length}</div>
                <div className="text-gray-400">Total Clubs</div>
              </div>
              
              <div className="glass-effect-strong rounded-3xl p-6 text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-neon-purple to-neon-pink rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Globe className="w-8 h-8 text-black" />
                </div>
                <div className="text-3xl font-bold text-white mb-2">{cities.length}</div>
                <div className="text-gray-400">Total Cities</div>
              </div>
              
              <div className="glass-effect-strong rounded-3xl p-6 text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-neon-green to-neon-teal rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Users className="w-8 h-8 text-black" />
                </div>
                <div className="text-3xl font-bold text-white mb-2">{purchases.length}</div>
                <div className="text-gray-400">Total Purchases</div>
              </div>
            </div>

            {/* Revenue Analytics */}
            {analytics && (
              <div className="glass-effect-strong rounded-3xl p-8">
                <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                  <DollarSign className="w-6 h-6 mr-3 text-neon-green" />
                  Revenue Analytics
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-neon-green mb-2">
                      €{analytics.totalRevenue?.toFixed(2) || '0.00'}
                    </div>
                    <div className="text-gray-400">Total Revenue</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-neon-teal mb-2">
                      {analytics.totalTickets || 0}
                    </div>
                    <div className="text-gray-400">Tickets Sold</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-neon-pink mb-2">
                      €{analytics.averageTicketPrice?.toFixed(2) || '0.00'}
                    </div>
                    <div className="text-gray-400">Avg. Ticket Price</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Events Tab */}
        {activeTab === 'events' && (
          <div className="space-y-8">
            <div className="flex flex-col lg:flex-row gap-6 items-center justify-between">
              <div className="flex flex-col lg:flex-row gap-4 flex-1">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search events..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-12 pr-4 py-3 bg-gray-800/50 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:border-neon-pink focus:outline-none transition-colors min-w-[300px]"
                  />
                </div>
                <select
                  value={eventFilterStatus}
                  onChange={(e) => setEventFilterStatus(e.target.value as any)}
                  className="pl-10 pr-8 py-3 bg-gray-800/50 border border-gray-600 rounded-xl text-white focus:border-neon-pink focus:outline-none transition-colors appearance-none"
                >
                  <option value="all">All Status</option>
                  <option value="active">Active</option>
                  <option value="sold-out">Sold Out</option>
                  <option value="hidden">Hidden</option>
                </select>
              </div>
              <button
                onClick={() => {
                  setEditingEvent(null);
                  setShowEventForm(true);
                }}
                className="btn-neon px-6 py-3 rounded-2xl font-bold text-black ripple flex items-center space-x-2"
              >
                <Plus className="w-5 h-5" />
                <span>Create Event</span>
              </button>
            </div>
            <div className="grid grid-responsive grid-responsive-2 xl:grid-responsive-3">
              {filteredEvents.map((event) => (
                <div key={event.id} className="glass-effect-strong rounded-3xl card-spacing border border-gray-700/50 card-hover">
                  <div className="flex justify-between items-start mb-6">
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-white mb-2">{event.title}</h3>
                      <p className="text-gray-400 font-medium">{event.date} at {event.time}</p>
                      <p className="text-gray-500 text-sm mt-1">€{event.price}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => {
                          setEditingEvent(event);
                          setShowEventForm(true);
                        }}
                        className="p-2 bg-neon-teal/10 text-neon-teal rounded-lg hover:bg-neon-teal/20 transition-colors"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => deleteEventHandler(event.id)}
                        className="p-2 bg-red-500/10 text-red-400 rounded-lg hover:bg-red-500/20 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  <div className="space-y-4 mb-6">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Available</span>
                      <span className="text-white font-semibold">{event.availability}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Sold</span>
                      <span className="text-white font-semibold">{event.soldTickets}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Status</span>
                      <span className={`font-bold flex items-center ${
                        event.status === 'active' ? 'text-green-400' : 
                        event.status === 'sold-out' ? 'text-red-400' : 'text-gray-400'
                      }`}>
                        {event.status === 'active' && <CheckCircle className="w-4 h-4 mr-1" />}
                        {event.status === 'sold-out' && <X className="w-4 h-4 mr-1" />}
                        {event.status.toUpperCase()}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Cities Tab */}
        {activeTab === 'cities' && (
          <div className="space-y-8">
            {/* Debug Info - Remove this later */}
            <div className="glass-effect-strong rounded-3xl p-6 border border-gray-700/50">
              <h3 className="text-lg font-bold text-white mb-4">Debug Info</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div>
                  <span className="text-gray-400">Total Cities:</span>
                  <span className="text-white ml-2">{cities.length}</span>
                </div>
                <div>
                  <span className="text-gray-400">Filtered Cities:</span>
                  <span className="text-white ml-2">{filteredCities.length}</span>
                </div>
                <div>
                  <span className="text-gray-400">Total Clubs:</span>
                  <span className="text-white ml-2">{clubs.length}</span>
                </div>
              </div>
              <div className="mt-4">
                <span className="text-gray-400">Cities:</span>
                <div className="text-white mt-2">
                  {cities.map(city => (
                    <div key={city.id} className="text-sm">• {city.name} ({city.status})</div>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex flex-col lg:flex-row gap-6 items-center justify-between">
              <div className="flex flex-col lg:flex-row gap-4 flex-1">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search cities..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-12 pr-4 py-3 bg-gray-800/50 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:border-neon-pink focus:outline-none transition-colors min-w-[300px]"
                  />
                </div>
                <select
                  value={cityFilterStatus}
                  onChange={(e) => setCityFilterStatus(e.target.value as any)}
                  className="pl-10 pr-8 py-3 bg-gray-800/50 border border-gray-600 rounded-xl text-white focus:border-neon-pink focus:outline-none transition-colors appearance-none"
                >
                  <option value="all">All Status</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
              <button
                onClick={() => {
                  setEditingCity(null);
                  setShowCityForm(true);
                }}
                className="btn-neon px-6 py-3 rounded-2xl font-bold text-black ripple flex items-center space-x-2"
              >
                <Plus className="w-5 h-5" />
                <span>Create City</span>
              </button>
            </div>

            {filteredCities.length === 0 ? (
              <div className="text-center py-16">
                <div className="card-spacing glass-effect rounded-3xl max-w-md mx-auto">
                  <div className="w-20 h-20 bg-gradient-to-r from-neon-pink to-neon-teal rounded-full flex items-center justify-center mx-auto element-spacing">
                    <Globe className="w-10 h-10 text-black" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-300 element-spacing">
                    No Cities Found
                  </h3>
                  <p className="text-gray-500 text-lg leading-relaxed mb-6">
                    {searchQuery || cityFilterStatus !== 'all' 
                      ? 'Try adjusting your search or filter to find cities.'
                      : 'Create your first city to get started!'
                    }
                  </p>
                  {!searchQuery && cityFilterStatus === 'all' && (
                    <button
                      onClick={() => {
                        setEditingCity(null);
                        setShowCityForm(true);
                      }}
                      className="btn-neon px-6 py-3 rounded-xl font-bold text-black"
                    >
                      Create First City
                    </button>
                  )}
                </div>
              </div>
            ) : (
              <div className="grid grid-responsive grid-responsive-2 xl:grid-responsive-3">
                {filteredCities.map((city) => {
                  const cityClubs = clubs.filter(club => club.city === city.name);
                  const activeClubs = cityClubs.filter(club => club.status === 'active');
                  
                  return (
                    <div key={city.id} className="glass-effect-strong rounded-3xl card-spacing border border-gray-700/50 card-hover">
                      {/* City Image Header */}
                      <div className="relative overflow-hidden rounded-2xl element-spacing mb-6">
                        <img
                          src={city.imageUrl || 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=800&h=400&fit=crop'}
                          alt={city.name}
                          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                        <div className="absolute bottom-4 left-4 right-4">
                          <div className="flex items-center justify-between">
                            <span className="px-3 py-1 rounded-full text-xs font-bold glass-effect text-neon-teal">
                              {cityClubs.length} VENUES
                            </span>
                            <span className="text-white font-bold text-sm">
                              {activeClubs.length} active
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* City Info */}
                      <div className="space-y-4">
                        <div>
                          <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-neon-pink transition-colors">
                            {city.name}
                          </h3>
                          <p className="text-gray-300 text-sm leading-relaxed" style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                            {city.description}
                          </p>
                        </div>

                        {/* Stats */}
                        <div className="grid grid-cols-2 gap-4 py-4 border-t border-gray-700/50">
                          <div className="text-center">
                            <div className="text-2xl font-bold text-neon-teal mb-1">{cityClubs.length}</div>
                            <div className="text-gray-400 text-sm">Total Venues</div>
                          </div>
                          <div className="text-center">
                            <div className="text-2xl font-bold text-neon-pink mb-1">{activeClubs.length}</div>
                            <div className="text-gray-400 text-sm">Active Venues</div>
                          </div>
                        </div>

                        {/* Status and Actions */}
                        <div className="flex items-center justify-between pt-2">
                          <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                            city.status === 'active' 
                              ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
                              : 'bg-gray-700/50 text-gray-300 border border-gray-600/50'
                          }`}>
                            {city.status === 'active' && <CheckCircle className="w-3 h-3 inline mr-1" />}
                            {city.status.toUpperCase()}
                          </span>
                          
                          <div className="flex items-center space-x-2">
                            <button
                              onClick={() => {
                                setEditingCity(city);
                                setShowCityForm(true);
                              }}
                              className="p-2 bg-neon-teal/10 text-neon-teal rounded-lg hover:bg-neon-teal/20 transition-colors"
                              title="Edit City"
                            >
                              <Edit3 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => deleteCityHandler(city.id)}
                              className="p-2 bg-red-500/10 text-red-400 rounded-lg hover:bg-red-500/20 transition-colors"
                              title="Delete City"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>

                        {/* Quick Club Preview */}
                        {cityClubs.length > 0 && (
                          <div className="pt-4 border-t border-gray-700/50">
                            <h4 className="text-sm font-semibold text-gray-400 mb-3">Venues in {city.name}</h4>
                            <div className="space-y-2">
                              {cityClubs.slice(0, 3).map((club) => (
                                <div key={club.id} className="flex items-center justify-between p-2 bg-gray-800/30 rounded-lg">
                                  <div className="flex items-center space-x-2">
                                    <div className="w-2 h-2 bg-neon-teal rounded-full"></div>
                                    <span className="text-white text-sm">{club.name}</span>
                                  </div>
                                  <span className={`px-2 py-1 rounded-full text-xs ${
                                    club.status === 'active' 
                                      ? 'bg-green-500/20 text-green-400' 
                                      : 'bg-gray-700/50 text-gray-400'
                                  }`}>
                                    {club.status}
                                  </span>
                                </div>
                              ))}
                              {cityClubs.length > 3 && (
                                <div className="text-center text-gray-500 text-xs">
                                  +{cityClubs.length - 3} more venues
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Clubs Tab */}
        {activeTab === 'clubs' && (
          <div className="space-y-8">
            <div className="flex flex-col lg:flex-row gap-6 items-center justify-between">
              <div className="flex flex-col lg:flex-row gap-4 flex-1">
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search clubs..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-12 pr-4 py-3 bg-gray-800/50 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:border-neon-pink focus:outline-none transition-colors min-w-[300px]"
                  />
                </div>
                <select
                  value={clubFilterStatus}
                  onChange={(e) => setClubFilterStatus(e.target.value as any)}
                  className="pl-10 pr-8 py-3 bg-gray-800/50 border border-gray-600 rounded-xl text-white focus:border-neon-pink focus:outline-none transition-colors appearance-none"
                >
                  <option value="all">All Status</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
              <button
                onClick={() => {
                  setEditingClub(null);
                  setShowClubForm(true);
                }}
                className="btn-neon px-6 py-3 rounded-2xl font-bold text-black ripple flex items-center space-x-2"
              >
                <Plus className="w-5 h-5" />
                <span>Create Club</span>
              </button>
            </div>
            <div className="grid grid-responsive grid-responsive-2 xl:grid-responsive-3">
              {filteredClubs.map((club) => (
                <div key={club.id} className="glass-effect-strong rounded-3xl card-spacing border border-gray-700/50 card-hover">
                  <div className="flex justify-between items-start mb-6">
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-white mb-2">{club.name}</h3>
                      <p className="text-gray-400 font-medium">{club.city}, {club.location}</p>
                      <p className="text-gray-500 text-sm mt-1">{club.type.charAt(0).toUpperCase() + club.type.slice(1)}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => {
                          setEditingClub(club);
                          setShowClubForm(true);
                        }}
                        className="p-2 bg-neon-teal/10 text-neon-teal rounded-lg hover:bg-neon-teal/20 transition-colors"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => deleteClubHandler(club.id)}
                        className="p-2 bg-red-500/10 text-red-400 rounded-lg hover:bg-red-500/20 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  <div className="space-y-4 mb-6">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Capacity</span>
                      <span className="text-white font-semibold">{club.capacity}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Amenities</span>
                      <span className="text-white font-semibold">{club.amenities.length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Status</span>
                      <span className={`font-bold flex items-center ${
                        club.status === 'active' ? 'text-green-400' : 'text-gray-400'
                      }`}>
                        {club.status === 'active' && <CheckCircle className="w-4 h-4 mr-1" />}
                        {club.status.toUpperCase()}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Event Form Modal */}
      {showEventForm && (
        <EventForm
          event={editingEvent}
          onSave={editingEvent ? handleEditEvent : handleCreateEvent}
          onCancel={() => {
            setShowEventForm(false);
            setEditingEvent(null);
          }}
          isEditing={!!editingEvent}
        />
      )}

      {/* Club Form Modal */}
      {showClubForm && (
        <ClubForm
          club={editingClub}
          onSave={editingClub ? handleEditClub : handleCreateClub}
          onCancel={() => {
            setShowClubForm(false);
            setEditingClub(null);
          }}
          isEditing={!!editingClub}
          cities={cities}
        />
      )}

      {/* City Form Modal */}
      {showCityForm && (
        <CityForm
          city={editingCity}
          onSave={editingCity ? handleEditCity : handleCreateCity}
          onCancel={() => {
            setShowCityForm(false);
            setEditingCity(null);
          }}
          isEditing={!!editingCity}
        />
      )}
    </div>
  );
}
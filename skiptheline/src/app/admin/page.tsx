"use client";
import { useAuth } from "@/lib/useAuth";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Header from '@/components/Header';
import EventForm from '@/components/EventForm';
import ClubForm from '@/components/ClubForm';
import { createEvent, updateEvent, deleteEvent, getEvents, getPurchases, getSalesAnalytics, createClub, updateClub, deleteClub, getClubs, eventsCollection } from '@/lib/firebaseService';
import { query, limit, getDocs } from 'firebase/firestore';
import { Event, Purchase, EventFormData, Club } from '@/types';
import { 
  Plus, 
  Edit3, 
  Trash2, 
  Download, 
  Calendar,
  Users,
  TrendingUp,
  Euro,
  ToggleLeft,
  ToggleRight,
  Activity,
  BarChart3,
  Clock,
  Star,
  AlertCircle,
  CheckCircle,
  Settings,
  Search,
  Filter,
  RefreshCcw,
  Building
} from 'lucide-react';
import { auth } from '@/lib/firebase';

export default function AdminPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  // All hooks must be called unconditionally, at the top:
  const [events, setEvents] = useState<Event[]>([]);
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [selectedTab, setSelectedTab] = useState<'overview' | 'events' | 'sales' | 'analytics' | 'clubs'>('overview');
  const [showEventForm, setShowEventForm] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'hidden' | 'sold-out'>('all');
  
  // Club management state
  const [clubs, setClubs] = useState<Club[]>([]);
  const [showClubForm, setShowClubForm] = useState(false);
  const [editingClub, setEditingClub] = useState<Club | null>(null);
  const [clubSearchQuery, setClubSearchQuery] = useState('');
  const [clubFilterStatus, setClubFilterStatus] = useState<'all' | 'active' | 'inactive'>('all');

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  // Load events and purchases from Firestore (or fallback to mock if needed)
  useEffect(() => {
    async function fetchData() {
      try {
        const [eventsData, purchasesData, clubsData] = await Promise.all([
          getEvents(),
          getPurchases(),
          getClubs()
        ]);
        setEvents(eventsData);
        setPurchases(purchasesData);
        setClubs(clubsData);
      } catch (error) {
        // fallback to mock data if Firestore fails
        // import { mockEvents, mockPurchases } from '@/data/mockData';
        // setEvents(mockEvents);
        // setPurchases(mockPurchases);
      }
    }
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-background gradient-bg">
        <Header />
        <div className="container-responsive section-spacing admin-container">
          <div className="flex items-center justify-center min-h-[50vh]">
            <div className="text-center">
              <div className="spinner w-12 h-12 mx-auto mb-6"></div>
              <p className="text-gray-400 text-lg">Loading dashboard...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }
  if (!user) return null;

  // --- Begin restored admin dashboard code ---
  // (This code is now protected by Firebase Auth)

  // --- State and logic from user's previous admin page ---
  // const [events, setEvents] = useState<Event[]>([]);
  // const [purchases, setPurchases] = useState<Purchase[]>([]);
  // const [selectedTab, setSelectedTab] = useState<'overview' | 'events' | 'sales' | 'analytics'>('overview');
  // const [showEventForm, setShowEventForm] = useState(false);
  // const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  // const [searchQuery, setSearchQuery] = useState('');
  // const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'hidden' | 'sold-out'>('all');

  // Load events and purchases from Firestore (or fallback to mock if needed)
  // useEffect(() => {
  //   async function fetchData() {
  //     try {
  //       const [eventsData, purchasesData] = await Promise.all([
  //         getEvents(),
  //         getPurchases()
  //       ]);
  //       setEvents(eventsData);
  //       setPurchases(purchasesData);
  //     } catch (error) {
  //       // fallback to mock data if Firestore fails
  //       // import { mockEvents, mockPurchases } from '@/data/mockData';
  //       // setEvents(mockEvents);
  //       // setPurchases(mockPurchases);
  //     }
  //   }
  //   fetchData();
  // }, []);

  const handleLogout = () => {
    // Firebase sign out
    import('firebase/auth').then(({ signOut }) => signOut(auth));
    router.push('/login');
  };

  const handleCreateEvent = async (eventData: EventFormData) => {
    try {
      const newEvent = await createEvent({
        ...eventData,
        soldTickets: 0,
        status: 'active',
        stripePaymentLink: '' // Will be generated when needed
      });
      setEvents(prev => [...prev, newEvent]);
      setShowEventForm(false);
    } catch (error) {
      alert('Failed to create event.');
    }
  };

  const handleEditEvent = async (eventData: EventFormData) => {
    if (editingEvent) {
      try {
        await updateEvent(editingEvent.id, eventData);
        setEvents(prev => prev.map(event => 
          event.id === editingEvent.id 
            ? { ...event, ...eventData }
            : event
        ));
        setEditingEvent(null);
        setShowEventForm(false);
      } catch (error) {
        alert('Failed to update event.');
      }
    }
  };

  const toggleEventStatus = async (eventId: string) => {
    setEvents(prev => prev.map(event => 
      event.id === eventId 
        ? { ...event, status: event.status === 'active' ? 'hidden' : 'active' }
        : event
    ));
    // Optionally update in Firestore
  };

  const deleteEventHandler = async (eventId: string) => {
    if (confirm('Are you sure you want to delete this event?')) {
      try {
        await deleteEvent(eventId);
        setEvents(prev => prev.filter(event => event.id !== eventId));
        setPurchases(prev => prev.filter(purchase => purchase.eventId !== eventId));
      } catch (error) {
        alert('Failed to delete event.');
      }
    }
  };

  // Club management handlers
  const handleCreateClub = async (clubData: Omit<Club, 'id'>) => {
    try {
      const newClub = await createClub(clubData);
      setClubs(prev => [...prev, newClub]);
      setShowClubForm(false);
    } catch (error) {
      alert('Failed to create club.');
    }
  };

  const handleEditClub = async (clubData: Omit<Club, 'id'>) => {
    if (editingClub) {
      try {
        await updateClub(editingClub.id, clubData);
        setClubs(prev => prev.map(club => 
          club.id === editingClub.id 
            ? { ...club, ...clubData }
            : club
        ));
        setEditingClub(null);
        setShowClubForm(false);
      } catch (error) {
        alert('Failed to update club.');
      }
    }
  };

  const deleteClubHandler = async (clubId: string) => {
    if (confirm('Are you sure you want to delete this club?')) {
      try {
        await deleteClub(clubId);
        setClubs(prev => prev.filter(club => club.id !== clubId));
      } catch (error) {
        alert('Failed to delete club.');
      }
    }
  };

  const exportGuestList = (eventId: string) => {
    const eventPurchases = purchases.filter(p => p.eventId === eventId);
    const event = events.find(e => e.id === eventId);
    const csvContent = [
      'Guest Name,Email,Party Size,Purchase Date,Total Amount,Status',
      ...eventPurchases.map(p => 
        `${p.guestName},${p.email},${p.partySize},${p.purchaseDate},€${p.totalAmount},${p.status}`
      )
    ].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `guest-list-${event?.title || eventId}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };



  
  // Calculate stats
  const totalRevenue = purchases.reduce((sum, p) => sum + p.totalAmount, 0);
  const totalTicketsSold = purchases.reduce((sum, p) => sum + p.partySize, 0);
  const activeEvents = events.filter(e => e.status === 'active').length;
  const todayPurchases = purchases.filter(p => {
    const today = new Date().toDateString();
    const purchaseDate = new Date(p.purchaseDate).toDateString();
    return today === purchaseDate;
  }).length;

  // Filter events
  const filteredEvents = events.filter(event => {
    // You may want to fetch clubs from Firestore or use mockClubs
    // import { mockClubs } from '@/data/mockData';
    const clubName = event.clubId || 'Unknown Club';
    const matchesSearch = event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         clubName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterStatus === 'all' || event.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  // Filter clubs
  const filteredClubs = clubs.filter(club => {
    const matchesSearch = club.name.toLowerCase().includes(clubSearchQuery.toLowerCase()) ||
                         club.location.toLowerCase().includes(clubSearchQuery.toLowerCase());
    const matchesFilter = clubFilterStatus === 'all' || club.status === clubFilterStatus;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="min-h-screen bg-background gradient-bg">
      <Header />
      <div className="container-responsive section-spacing admin-container">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between element-spacing">
          <div>
            <h1 className="text-4xl font-black mb-3 bg-gradient-to-r from-neon-pink via-neon-purple to-neon-teal bg-clip-text text-transparent">
              Admin Dashboard
            </h1>
            <p className="text-gray-400 text-lg">Manage events, track sales, and monitor performance</p>
          </div>
          <div className="flex items-center space-x-4 mt-6 lg:mt-0">

            <button className="p-3 glass-effect rounded-xl border border-gray-700/50 hover:border-neon-teal/30 transition-colors">
              <RefreshCcw className="w-5 h-5 text-gray-400" />
            </button>
            <button className="p-3 glass-effect rounded-xl border border-gray-700/50 hover:border-neon-pink/30 transition-colors">
              <Settings className="w-5 h-5 text-gray-400" />
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center px-6 py-3 glass-effect rounded-xl border border-gray-700/50 text-gray-300 hover:text-red-400 hover:border-red-400/30 transition-all"
            >
              <Building className="w-4 h-4 mr-2" />
              <span className="font-semibold">Logout</span>
            </button>
          </div>
        </div>
        {/* Tab Navigation */}
        <div className="flex flex-wrap space-x-2 element-spacing glass-effect-strong p-2 rounded-2xl w-fit border border-gray-700/50">
          {[
            { key: 'overview', label: 'Overview', icon: BarChart3 },
            { key: 'events', label: 'Events', icon: Calendar },
            { key: 'sales', label: 'Sales', icon: Users },
            { key: 'analytics', label: 'Analytics', icon: TrendingUp },
            { key: 'clubs', label: 'Clubs', icon: Building }
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.key}
                onClick={() => setSelectedTab(tab.key as any)}
                className={`flex items-center px-6 py-3 rounded-xl font-semibold transition-all ${
                  selectedTab === tab.key
                    ? 'btn-neon text-black'
                    : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
                }`}
              >
                <Icon className="w-4 h-4 mr-2" />
                {tab.label}
              </button>
            );
          })}
        </div>
        {/* Overview Tab */}
        {selectedTab === 'overview' && (
          <div className="space-y-10">
            {/* Stats Grid */}
            <div className="grid grid-responsive grid-responsive-2 lg:grid-responsive-4">
              <div className="glass-effect-strong rounded-2xl card-spacing border border-gray-700/50 card-hover">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm font-medium mb-1">Total Revenue</p>
                    <p className="text-3xl font-black text-neon-pink">€{totalRevenue.toLocaleString()}</p>
                    <p className="text-xs text-green-400 mt-1">↑ 12% from last month</p>
                  </div>
                  <div className="p-3 bg-neon-pink/10 rounded-xl">
                    <Euro className="w-8 h-8 text-neon-pink" />
                  </div>
                </div>
              </div>
              <div className="glass-effect-strong rounded-2xl card-spacing border border-gray-700/50 card-hover">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm font-medium mb-1">Tickets Sold</p>
                    <p className="text-3xl font-black text-neon-teal">{totalTicketsSold}</p>
                    <p className="text-xs text-green-400 mt-1">↑ 8% from last week</p>
                  </div>
                  <div className="p-3 bg-neon-teal/10 rounded-xl">
                    <Users className="w-8 h-8 text-neon-teal" />
                  </div>
                </div>
              </div>
              <div className="glass-effect-strong rounded-2xl card-spacing border border-gray-700/50 card-hover">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm font-medium mb-1">Active Events</p>
                    <p className="text-3xl font-black text-neon-green">{activeEvents}</p>
                    <p className="text-xs text-yellow-400 mt-1">2 ending soon</p>
                  </div>
                  <div className="p-3 bg-neon-green/10 rounded-xl">
                    <Calendar className="w-8 h-8 text-neon-green" />
                  </div>
                </div>
              </div>
              <div className="glass-effect-strong rounded-2xl card-spacing border border-gray-700/50 card-hover">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm font-medium mb-1">Today's Sales</p>
                    <p className="text-3xl font-black text-neon-purple">{todayPurchases}</p>
                    <p className="text-xs text-green-400 mt-1">New record!</p>
                  </div>
                  <div className="p-3 bg-neon-purple/10 rounded-xl">
                    <Activity className="w-8 h-8 text-neon-purple" />
                  </div>
                </div>
              </div>
            </div>
            {/* Recent Activity */}
            <div className="glass-effect-strong rounded-3xl card-spacing border border-gray-700/50">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-black text-white">Recent Purchases</h2>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-neon-green rounded-full animate-pulse"></div>
                  <span className="text-sm text-gray-400">Live updates</span>
                </div>
              </div>
              <div className="space-y-4">
                {purchases.slice(0, 5).map((purchase, index) => {
                  const event = events.find(e => e.id === purchase.eventId);
                  return (
                    <div key={purchase.id} className="flex items-center justify-between p-6 bg-gray-800/30 rounded-2xl border border-gray-700/30 hover:border-neon-pink/30 transition-all">
                      <div className="flex items-center space-x-4">
                        <div className="p-3 bg-neon-pink/10 rounded-xl">
                          <Star className="w-5 h-5 text-neon-pink" />
                        </div>
                        <div>
                          <p className="font-bold text-white">{purchase.guestName}</p>
                          <p className="text-sm text-gray-400">{event?.title} • {purchase.partySize} people</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-black text-neon-pink text-lg">€{purchase.totalAmount}</p>
                        <p className="text-xs text-gray-400">{new Date(purchase.purchaseDate).toLocaleDateString()}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}
        {/* Events Tab */}
        {selectedTab === 'events' && (
          <div className="space-y-8">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search events..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 pr-4 py-3 bg-gray-800/50 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:border-neon-pink transition-colors input-glow w-64"
                  />
                </div>
                <div className="relative">
                  <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value as any)}
                    className="pl-10 pr-8 py-3 bg-gray-800/50 border border-gray-600 rounded-xl text-white focus:border-neon-pink transition-colors appearance-none"
                  >
                    <option value="all">All Status</option>
                    <option value="active">Active</option>
                    <option value="hidden">Hidden</option>
                    <option value="sold-out">Sold Out</option>
                  </select>
                </div>
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
              {filteredEvents.map((event) => {
                const clubName = event.clubId || 'Unknown Club';
                const soldPercentage = ((event.maxTickets - event.availability) / event.maxTickets) * 100;
                return (
                  <div key={event.id} className="glass-effect-strong rounded-3xl card-spacing border border-gray-700/50 card-hover">
                    <div className="flex justify-between items-start mb-6">
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-white mb-2">{event.title}</h3>
                        <p className="text-gray-400 font-medium">{clubName}</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => toggleEventStatus(event.id)}
                          className={`p-2 rounded-lg transition-colors ${
                            event.status === 'active' 
                              ? 'bg-green-500/10 text-green-400 hover:bg-green-500/20' 
                              : 'bg-gray-700/50 text-gray-400 hover:bg-gray-600/50'
                          }`}
                        >
                          {event.status === 'active' ? (
                            <ToggleRight className="w-5 h-5" />
                          ) : (
                            <ToggleLeft className="w-5 h-5" />
                          )}
                        </button>
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
                        <span className="text-gray-400">Price</span>
                        <span className="text-neon-pink font-bold">€{event.price}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Available</span>
                        <span className="text-white font-semibold">{event.availability}/{event.maxTickets}</span>
                      </div>
                      {/* Progress Bar */}
                      <div>
                        <div className="flex justify-between text-sm text-gray-400 mb-2">
                          <span>Progress</span>
                          <span>{Math.round(soldPercentage)}%</span>
                        </div>
                        <div className="w-full bg-gray-800 rounded-full h-2">
                          <div 
                            className="h-full bg-gradient-to-r from-neon-pink to-neon-teal rounded-full transition-all duration-500"
                            style={{ width: `${Math.min(soldPercentage, 100)}%` }}
                          />
                        </div>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Status</span>
                        <span className={`font-bold flex items-center ${
                          event.status === 'active' ? 'text-green-400' : 
                          event.status === 'sold-out' ? 'text-red-400' : 'text-gray-400'
                        }`}>
                          {event.status === 'active' && <CheckCircle className="w-4 h-4 mr-1" />}
                          {event.status === 'sold-out' && <AlertCircle className="w-4 h-4 mr-1" />}
                          {event.status.toUpperCase()}
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => exportGuestList(event.id)}
                      className="w-full flex items-center justify-center px-4 py-3 bg-gray-800/50 text-gray-300 rounded-2xl hover:bg-gray-700/50 transition-colors border border-gray-700/50 hover:border-gray-600/50"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Export Guest List
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}
        {/* Sales Tab */}
        {selectedTab === 'sales' && (
          <div className="space-y-8">
            <h2 className="text-3xl font-black text-white">Sales Overview</h2>
            <div className="glass-effect-strong rounded-3xl card-spacing border border-gray-700/50">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-700/50">
                      <th className="text-left py-4 text-gray-400 font-semibold">Guest</th>
                      <th className="text-left py-4 text-gray-400 font-semibold">Event</th>
                      <th className="text-left py-4 text-gray-400 font-semibold">Party Size</th>
                      <th className="text-left py-4 text-gray-400 font-semibold">Amount</th>
                      <th className="text-left py-4 text-gray-400 font-semibold">Date</th>
                      <th className="text-left py-4 text-gray-400 font-semibold">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {purchases.map((purchase) => {
                      const event = events.find(e => e.id === purchase.eventId);
                      return (
                        <tr key={purchase.id} className="border-b border-gray-800/30 hover:bg-gray-800/20 transition-colors">
                          <td className="py-4">
                            <div>
                              <p className="text-white font-semibold">{purchase.guestName}</p>
                              <p className="text-gray-400 text-sm">{purchase.email}</p>
                            </div>
                          </td>
                          <td className="py-4 text-gray-300 font-medium">{event?.title}</td>
                          <td className="py-4 text-gray-300">{purchase.partySize}</td>
                          <td className="py-4 text-neon-pink font-bold">€{purchase.totalAmount}</td>
                          <td className="py-4 text-gray-300">
                            {new Date(purchase.purchaseDate).toLocaleDateString()}
                          </td>
                          <td className="py-4">
                            <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                              purchase.status === 'confirmed' 
                                ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
                                : 'bg-gray-700/50 text-gray-300 border border-gray-600/50'
                            }`}>
                              {purchase.status.toUpperCase()}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
        {/* Analytics Tab */}
        {selectedTab === 'analytics' && (
          <div className="space-y-8">
            <h2 className="text-3xl font-black text-white">Analytics Dashboard</h2>
            <div className="grid grid-responsive grid-responsive-2">
              <div className="glass-effect-strong rounded-3xl card-spacing border border-gray-700/50">
                <h3 className="text-xl font-bold text-white mb-6">Revenue Trends</h3>
                <div className="text-center py-12">
                  <BarChart3 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-400">Chart visualization would go here</p>
                </div>
              </div>
              <div className="glass-effect-strong rounded-3xl card-spacing border border-gray-700/50">
                <h3 className="text-xl font-bold text-white mb-6">Popular Events</h3>
                <div className="space-y-4">
                  {events.map((event, index) => (
                    <div key={event.id} className="flex items-center justify-between p-4 bg-gray-800/30 rounded-xl">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-neon-pink/20 rounded-lg flex items-center justify-center text-neon-pink font-bold text-sm">
                          {index + 1}
                        </div>
                        <span className="text-white font-medium">{event.title}</span>
                      </div>
                      <span className="text-gray-400">{event.maxTickets - event.availability} sold</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
        {/* Clubs Tab */}
        {selectedTab === 'clubs' && (
          <div className="space-y-8">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search clubs..."
                    value={clubSearchQuery}
                    onChange={(e) => setClubSearchQuery(e.target.value)}
                    className="pl-10 pr-4 py-3 bg-gray-800/50 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:border-neon-pink transition-colors input-glow w-64"
                  />
                </div>
                <div className="relative">
                  <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <select
                    value={clubFilterStatus}
                    onChange={(e) => setClubFilterStatus(e.target.value as any)}
                    className="pl-10 pr-8 py-3 bg-gray-800/50 border border-gray-600 rounded-xl text-white focus:border-neon-pink transition-colors appearance-none"
                  >
                    <option value="all">All Status</option>
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
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
                      <p className="text-gray-400 font-medium">{club.location}</p>
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
        />
      )}
    </div>
  );
}
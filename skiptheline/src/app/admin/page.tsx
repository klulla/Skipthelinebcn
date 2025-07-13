'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import EventForm from '@/components/EventForm';
import { mockEvents, mockPurchases, adminCredentials, mockClubs } from '@/data/mockData';
import { Event, Purchase, EventFormData } from '@/types';
import { 
  Lock, 
  Eye, 
  EyeOff, 
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
  LogOut,
  Shield,
  Activity,
  BarChart3,
  Clock,
  Star,
  AlertCircle,
  CheckCircle,
  Settings,
  Search,
  Filter,
  RefreshCcw
} from 'lucide-react';

export default function AdminPage() {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loginForm, setLoginForm] = useState({ username: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [events, setEvents] = useState<Event[]>(mockEvents);
  const [purchases, setPurchases] = useState<Purchase[]>(mockPurchases);
  const [selectedTab, setSelectedTab] = useState<'overview' | 'events' | 'sales' | 'analytics'>('overview');
  const [showEventForm, setShowEventForm] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'hidden' | 'sold-out'>('all');

  // Check if user is already logged in
  useEffect(() => {
    const isAuthenticated = localStorage.getItem('adminLoggedIn') === 'true';
    setIsLoggedIn(isAuthenticated);
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (loginForm.username === adminCredentials.username && 
        loginForm.password === adminCredentials.password) {
      setIsLoggedIn(true);
      localStorage.setItem('adminLoggedIn', 'true');
      setLoginForm({ username: '', password: '' });
    } else {
      alert('Invalid credentials');
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    localStorage.removeItem('adminLoggedIn');
    setLoginForm({ username: '', password: '' });
  };

  const handleCreateEvent = (eventData: EventFormData) => {
    const newEvent: Event = {
      id: `event-${Date.now()}`,
      ...eventData,
      soldTickets: 0,
      status: 'active'
    };
    
    setEvents(prev => [...prev, newEvent]);
    setShowEventForm(false);
  };

  const handleEditEvent = (eventData: EventFormData) => {
    if (editingEvent) {
      setEvents(prev => prev.map(event => 
        event.id === editingEvent.id 
          ? { ...event, ...eventData }
          : event
      ));
      setEditingEvent(null);
      setShowEventForm(false);
    }
  };

  const toggleEventStatus = (eventId: string) => {
    setEvents(prev => prev.map(event => 
      event.id === eventId 
        ? { ...event, status: event.status === 'active' ? 'hidden' : 'active' }
        : event
    ));
  };

  const deleteEvent = (eventId: string) => {
    if (confirm('Are you sure you want to delete this event?')) {
      setEvents(prev => prev.filter(event => event.id !== eventId));
      setPurchases(prev => prev.filter(purchase => purchase.eventId !== eventId));
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
    const club = mockClubs.find(c => c.id === event.clubId);
    const clubName = club?.name || 'Unknown Club';
    const matchesSearch = event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         clubName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterStatus === 'all' || event.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-background gradient-bg">
        <Header />
        
        <div className="min-h-[calc(100vh-5rem)] flex items-center justify-center p-4">
          <div className="max-w-lg w-full">
            <div className="glass-effect-strong rounded-3xl card-spacing border border-gray-700/50">
              <div className="text-center mb-10">
                <div className="p-6 bg-gradient-to-r from-neon-pink via-neon-purple to-neon-teal rounded-2xl w-fit mx-auto mb-6 neon-glow-rainbow">
                  <Lock className="w-10 h-10 text-black" />
                </div>
                <h1 className="text-3xl font-black mb-3 bg-gradient-to-r from-neon-pink to-neon-teal bg-clip-text text-transparent">
                  Admin Portal
                </h1>
                <p className="text-gray-400 text-lg">Secure access to SkipTheLine dashboard</p>
              </div>

              <form onSubmit={handleLogin} className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-3">
                    Username
                  </label>
                  <input
                    type="text"
                    value={loginForm.username}
                    onChange={(e) => setLoginForm(prev => ({ ...prev, username: e.target.value }))}
                    className="w-full px-4 py-4 bg-gray-800/50 border border-gray-600 rounded-2xl focus:border-neon-pink focus:outline-none text-white transition-colors input-glow"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-3">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={loginForm.password}
                      onChange={(e) => setLoginForm(prev => ({ ...prev, password: e.target.value }))}
                      className="w-full px-4 py-4 bg-gray-800/50 border border-gray-600 rounded-2xl focus:border-neon-pink focus:outline-none text-white pr-12 transition-colors input-glow"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-300"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full btn-neon text-black font-bold py-4 rounded-2xl transition-all duration-300 ripple"
                >
                  Access Dashboard
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    );
  }

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
              <LogOut className="w-4 h-4 mr-2" />
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
            { key: 'analytics', label: 'Analytics', icon: TrendingUp }
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
                const club = mockClubs.find(c => c.id === event.clubId);
                const clubName = club?.name || 'Unknown Club';
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
                          onClick={() => deleteEvent(event.id)}
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
    </div>
  );
}
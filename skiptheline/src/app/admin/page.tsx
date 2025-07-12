'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import { mockEvents, mockPurchases, adminCredentials } from '@/data/mockData';
import { Event, Purchase } from '@/types';
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
  LogOut
} from 'lucide-react';

export default function AdminPage() {
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loginForm, setLoginForm] = useState({ username: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [events, setEvents] = useState<Event[]>(mockEvents);
  const [purchases, setPurchases] = useState<Purchase[]>(mockPurchases);
  const [selectedTab, setSelectedTab] = useState<'overview' | 'events' | 'sales'>('overview');
  const [showEventForm, setShowEventForm] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);

  // Check if user is already logged in (in a real app, this would check JWT or session)
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
    a.download = `guest-list-${eventId}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  // Calculate overview stats
  const totalRevenue = purchases.reduce((sum, p) => sum + p.totalAmount, 0);
  const totalTicketsSold = purchases.reduce((sum, p) => sum + p.partySize, 0);
  const activeEvents = events.filter(e => e.status === 'active').length;

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        
        <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4">
          <div className="max-w-md w-full">
            <div className="bg-gray-900 rounded-2xl p-8 border border-gray-800">
              <div className="text-center mb-8">
                <div className="p-4 bg-neon-pink rounded-full w-fit mx-auto mb-4">
                  <Lock className="w-8 h-8 text-black" />
                </div>
                <h1 className="text-2xl font-bold mb-2">Admin Login</h1>
                <p className="text-gray-400">Secure access to SkipTheLine dashboard</p>
              </div>

              <form onSubmit={handleLogin} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Username
                  </label>
                  <input
                    type="text"
                    value={loginForm.username}
                    onChange={(e) => setLoginForm(prev => ({ ...prev, username: e.target.value }))}
                    className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:border-neon-pink focus:outline-none text-white"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={loginForm.password}
                      onChange={(e) => setLoginForm(prev => ({ ...prev, password: e.target.value }))}
                      className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:border-neon-pink focus:outline-none text-white pr-12"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-300"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full bg-neon-pink text-black font-bold py-3 rounded-lg hover:bg-neon-pink/90 transition-colors"
                >
                  Login
                </button>
              </form>

              <div className="mt-6 p-4 bg-gray-800 rounded-lg">
                <p className="text-xs text-gray-400 mb-2">Demo Credentials:</p>
                <p className="text-xs text-gray-300">Username: admin</p>
                <p className="text-xs text-gray-300">Password: skiptheline2024</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
            <p className="text-gray-400">Manage events and track sales</p>
          </div>
          
          <button
            onClick={handleLogout}
            className="flex items-center px-4 py-2 text-gray-400 hover:text-red-400 transition-colors mt-4 sm:mt-0"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex space-x-1 mb-8 bg-gray-900 p-1 rounded-lg w-fit">
          {[
            { key: 'overview', label: 'Overview' },
            { key: 'events', label: 'Events' },
            { key: 'sales', label: 'Sales' }
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setSelectedTab(tab.key as any)}
              className={`px-6 py-2 rounded-md font-medium transition-colors ${
                selectedTab === tab.key
                  ? 'bg-neon-pink text-black'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Overview Tab */}
        {selectedTab === 'overview' && (
          <div className="space-y-8">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">Total Revenue</p>
                    <p className="text-2xl font-bold text-neon-pink">€{totalRevenue}</p>
                  </div>
                  <Euro className="w-8 h-8 text-neon-pink" />
                </div>
              </div>

              <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">Tickets Sold</p>
                    <p className="text-2xl font-bold text-neon-teal">{totalTicketsSold}</p>
                  </div>
                  <Users className="w-8 h-8 text-neon-teal" />
                </div>
              </div>

              <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">Active Events</p>
                    <p className="text-2xl font-bold text-green-400">{activeEvents}</p>
                  </div>
                  <Calendar className="w-8 h-8 text-green-400" />
                </div>
              </div>

              <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">Avg. Price</p>
                    <p className="text-2xl font-bold text-yellow-400">
                      €{totalTicketsSold > 0 ? Math.round(totalRevenue / totalTicketsSold) : 0}
                    </p>
                  </div>
                  <TrendingUp className="w-8 h-8 text-yellow-400" />
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
              <h2 className="text-xl font-bold mb-4">Recent Purchases</h2>
              <div className="space-y-4">
                {purchases.slice(0, 5).map((purchase) => {
                  const event = events.find(e => e.id === purchase.eventId);
                  return (
                    <div key={purchase.id} className="flex items-center justify-between p-4 bg-gray-800 rounded-lg">
                      <div>
                        <p className="font-medium text-white">{purchase.guestName}</p>
                        <p className="text-sm text-gray-400">{event?.title} • {purchase.partySize} people</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-neon-pink">€{purchase.totalAmount}</p>
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
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Event Management</h2>
              <button
                onClick={() => setShowEventForm(true)}
                className="flex items-center px-4 py-2 bg-neon-pink text-black font-semibold rounded-lg hover:bg-neon-pink/90 transition-colors"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Event
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {events.map((event) => (
                <div key={event.id} className="bg-gray-900 rounded-xl p-6 border border-gray-800">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-1">{event.title}</h3>
                      <p className="text-gray-400">{event.clubName}</p>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => toggleEventStatus(event.id)}
                        className="text-gray-400 hover:text-white transition-colors"
                      >
                        {event.status === 'active' ? (
                          <ToggleRight className="w-6 h-6 text-green-400" />
                        ) : (
                          <ToggleLeft className="w-6 h-6" />
                        )}
                      </button>
                      
                      <button
                        onClick={() => setEditingEvent(event)}
                        className="text-gray-400 hover:text-neon-teal transition-colors"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      
                      <button
                        onClick={() => deleteEvent(event.id)}
                        className="text-gray-400 hover:text-red-400 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Price:</span>
                      <span className="text-white">€{event.price}</span>
                    </div>
                    
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Sold:</span>
                      <span className="text-white">{event.soldTickets}/{event.maxTickets}</span>
                    </div>
                    
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-400">Status:</span>
                      <span className={`font-medium ${
                        event.status === 'active' ? 'text-green-400' : 'text-gray-400'
                      }`}>
                        {event.status.toUpperCase()}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => exportGuestList(event.id)}
                    className="w-full flex items-center justify-center px-4 py-2 bg-gray-800 text-gray-300 rounded-lg hover:bg-gray-700 transition-colors"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Export Guest List
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Sales Tab */}
        {selectedTab === 'sales' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Sales Overview</h2>
            
            <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-700">
                      <th className="text-left py-3 text-gray-400">Guest</th>
                      <th className="text-left py-3 text-gray-400">Event</th>
                      <th className="text-left py-3 text-gray-400">Party Size</th>
                      <th className="text-left py-3 text-gray-400">Amount</th>
                      <th className="text-left py-3 text-gray-400">Date</th>
                      <th className="text-left py-3 text-gray-400">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {purchases.map((purchase) => {
                      const event = events.find(e => e.id === purchase.eventId);
                      return (
                        <tr key={purchase.id} className="border-b border-gray-800">
                          <td className="py-3">
                            <div>
                              <p className="text-white font-medium">{purchase.guestName}</p>
                              <p className="text-gray-400 text-sm">{purchase.email}</p>
                            </div>
                          </td>
                          <td className="py-3 text-gray-300">{event?.title}</td>
                          <td className="py-3 text-gray-300">{purchase.partySize}</td>
                          <td className="py-3 text-neon-pink font-semibold">€{purchase.totalAmount}</td>
                          <td className="py-3 text-gray-300">
                            {new Date(purchase.purchaseDate).toLocaleDateString()}
                          </td>
                          <td className="py-3">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              purchase.status === 'confirmed' 
                                ? 'bg-green-900 text-green-300' 
                                : 'bg-gray-700 text-gray-300'
                            }`}>
                              {purchase.status}
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
      </div>
    </div>
  );
}
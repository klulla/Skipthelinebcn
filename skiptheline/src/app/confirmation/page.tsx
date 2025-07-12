'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Header from '@/components/Header';
import { mockEvents } from '@/data/mockData';
import { 
  CheckCircle, 
  Calendar, 
  Clock, 
  MapPin, 
  Users, 
  Download,
  Mail,
  Smartphone,
  ArrowLeft,
  Zap
} from 'lucide-react';

export default function ConfirmationPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [confirmationId, setConfirmationId] = useState('');

  const eventId = searchParams.get('event');
  const partySize = parseInt(searchParams.get('party') || '1');
  const totalAmount = parseInt(searchParams.get('total') || '0');

  const event = mockEvents.find(e => e.id === eventId);

  useEffect(() => {
    // Generate a random confirmation ID
    const id = `STL${Date.now().toString().slice(-6)}${Math.random().toString(36).substr(2, 3).toUpperCase()}`;
    setConfirmationId(id);
  }, []);

  if (!event) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-300 mb-4">Invalid Confirmation</h1>
            <button 
              onClick={() => router.push('/')}
              className="text-neon-pink hover:text-neon-pink/80 transition-colors"
            >
              ← Back to Events
            </button>
          </div>
        </div>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Success Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-6">
            <div className="p-4 bg-green-500 rounded-full neon-glow-teal">
              <CheckCircle className="w-12 h-12 text-white" />
            </div>
          </div>
          
          <h1 className="text-3xl sm:text-4xl font-bold mb-4">
            Fast Pass Confirmed!
          </h1>
          
          <p className="text-lg text-gray-300 mb-2">
            You're all set for an amazing night at {event.clubName}
          </p>
          
          <p className="text-sm text-gray-400">
            Confirmation ID: <span className="text-neon-pink font-mono">{confirmationId}</span>
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Purchase Details */}
          <div className="bg-gray-900 rounded-2xl p-6 border border-gray-800">
            <h2 className="text-2xl font-bold mb-6">Purchase Details</h2>
            
            <div className="space-y-4 mb-6">
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Event</span>
                <span className="text-white font-medium">{event.title}</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Venue</span>
                <span className="text-white font-medium">{event.clubName}</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Date</span>
                <span className="text-white font-medium">{formatDate(event.date)}</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Arrival Window</span>
                <span className="text-white font-medium">{event.arrivalWindow}</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-gray-400">Party Size</span>
                <span className="text-white font-medium">{partySize} {partySize === 1 ? 'person' : 'people'}</span>
              </div>
              
              <div className="flex justify-between items-center pt-4 border-t border-gray-700">
                <span className="text-lg font-semibold">Total Paid</span>
                <span className="text-2xl font-bold text-neon-pink">€{totalAmount}</span>
              </div>
            </div>

            <div className="p-4 bg-neon-pink/10 border border-neon-pink/20 rounded-xl">
              <h3 className="font-semibold text-neon-pink mb-2">✅ What's Included</h3>
              <ul className="text-gray-300 text-sm space-y-1">
                <li>• VIP Line Access for {partySize} {partySize === 1 ? 'person' : 'people'}</li>
                <li>• Full Entry to {event.clubName}</li>
                <li>• No Additional Door Fees</li>
                <li>• Priority Customer Support</li>
              </ul>
            </div>
          </div>

          {/* Arrival Instructions */}
          <div className="bg-gray-900 rounded-2xl p-6 border border-gray-800">
            <h2 className="text-2xl font-bold mb-6">Arrival Instructions</h2>
            
            <div className="space-y-6">
              <div className="flex items-start space-x-3">
                <div className="p-2 bg-neon-teal rounded-lg">
                  <Clock className="w-5 h-5 text-black" />
                </div>
                <div>
                  <h3 className="font-semibold text-white mb-1">Timing</h3>
                  <p className="text-gray-400 text-sm">
                    Arrive during your window: <span className="text-neon-teal">{event.arrivalWindow}</span>
                    <br />
                    Late arrivals may not be honored.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="p-2 bg-neon-pink rounded-lg">
                  <MapPin className="w-5 h-5 text-black" />
                </div>
                <div>
                  <h3 className="font-semibold text-white mb-1">Location</h3>
                  <p className="text-gray-400 text-sm">
                    {event.location}
                    <br />
                    Look for the VIP/Express Line entrance.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="p-2 bg-gradient-to-r from-neon-pink to-neon-teal rounded-lg">
                  <Smartphone className="w-5 h-5 text-black" />
                </div>
                <div>
                  <h3 className="font-semibold text-white mb-1">What to Show</h3>
                  <p className="text-gray-400 text-sm">
                    Show this confirmation screen or your confirmation email
                    <br />
                    Confirmation ID: <span className="text-neon-pink font-mono">{confirmationId}</span>
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-3">
                <div className="p-2 bg-yellow-500 rounded-lg">
                  <Users className="w-5 h-5 text-black" />
                </div>
                <div>
                  <h3 className="font-semibold text-white mb-1">Important</h3>
                  <p className="text-gray-400 text-sm">
                    All {partySize} {partySize === 1 ? 'person' : 'people'} must arrive together
                    <br />
                    Bring valid ID for everyone in your group.
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-6 p-4 bg-gray-800 rounded-xl">
              <h4 className="font-semibold text-white mb-2">Need Help?</h4>
              <p className="text-gray-400 text-sm mb-2">
                Contact our support team if you have any questions or issues.
              </p>
              <p className="text-neon-teal text-sm">
                WhatsApp: +34 123 456 789
                <br />
                Email: support@skiptheline.barcelona
              </p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
          <button className="flex items-center justify-center px-6 py-3 bg-neon-teal text-black font-semibold rounded-lg hover:bg-neon-teal/90 transition-colors">
            <Mail className="w-5 h-5 mr-2" />
            Email Confirmation
          </button>
          
          <button className="flex items-center justify-center px-6 py-3 bg-gray-700 text-white font-semibold rounded-lg hover:bg-gray-600 transition-colors">
            <Download className="w-5 h-5 mr-2" />
            Download Pass
          </button>
          
          <button 
            onClick={() => router.push('/')}
            className="flex items-center justify-center px-6 py-3 border border-gray-600 text-gray-300 font-semibold rounded-lg hover:border-gray-500 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-5 h-5 mr-2" />
            Browse More Events
          </button>
        </div>

        {/* Social Sharing */}
        <div className="mt-12 text-center">
          <p className="text-gray-400 mb-4">
            Share your night out with friends!
          </p>
          <div className="flex justify-center space-x-4">
            <button className="p-3 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors">
              <span className="text-blue-400">📱 WhatsApp</span>
            </button>
            <button className="p-3 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors">
              <span className="text-pink-400">📸 Instagram</span>
            </button>
            <button className="p-3 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors">
              <span className="text-blue-500">🐦 Twitter</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
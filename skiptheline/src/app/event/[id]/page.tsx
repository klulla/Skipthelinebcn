'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Header from '@/components/Header';
import { mockEvents, faqs, testimonials } from '@/data/mockData';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Users, 
  ChevronDown, 
  ChevronUp, 
  Star,
  Shield,
  Zap,
  ArrowLeft
} from 'lucide-react';

export default function EventPage() {
  const params = useParams();
  const router = useRouter();
  const [partySize, setPartySize] = useState(1);
  const [expandedFAQ, setExpandedFAQ] = useState<number | null>(null);

  const event = mockEvents.find(e => e.id === params.id);

  if (!event) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-300 mb-4">Event Not Found</h1>
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

  const availableTickets = event.maxTickets - event.soldTickets;
  const isSoldOut = event.status === 'sold-out' || availableTickets <= 0;
  const totalPrice = event.price * partySize;

  const handlePurchase = () => {
    // This would integrate with Stripe in a real app
    const purchaseData = {
      eventId: event.id,
      partySize,
      totalAmount: totalPrice
    };
    
    // For now, redirect to confirmation page with data
    router.push(`/confirmation?event=${event.id}&party=${partySize}&total=${totalPrice}`);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      {/* Back Button */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
        <button 
          onClick={() => router.push('/')}
          className="flex items-center text-gray-400 hover:text-neon-pink transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Events
        </button>
      </div>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div 
          className="h-64 sm:h-80 bg-cover bg-center relative"
          style={{ backgroundImage: `url(${event.imageUrl})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/70 to-transparent" />
          
          <div className="absolute bottom-6 left-0 right-0">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-2">
                {event.clubName}
              </h1>
              <p className="text-xl text-neon-pink font-semibold">
                {event.title}
              </p>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Event Details */}
            <div className="bg-gray-900 rounded-2xl p-6 border border-gray-800">
              <h2 className="text-2xl font-bold mb-6">Event Details</h2>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                <div className="flex items-center text-gray-300">
                  <Calendar className="w-5 h-5 mr-3 text-neon-pink" />
                  <span>{formatDate(event.date)}</span>
                </div>
                
                <div className="flex items-center text-gray-300">
                  <Clock className="w-5 h-5 mr-3 text-neon-teal" />
                  <span>{event.arrivalWindow}</span>
                </div>
                
                <div className="flex items-center text-gray-300">
                  <MapPin className="w-5 h-5 mr-3 text-neon-pink" />
                  <span>{event.location}</span>
                </div>
                
                <div className="flex items-center text-gray-300">
                  <Users className="w-5 h-5 mr-3 text-neon-teal" />
                  <span>{event.soldTickets}/{event.maxTickets} sold</span>
                </div>
              </div>

              <div className="p-4 bg-neon-pink/10 border border-neon-pink/20 rounded-xl mb-6">
                <h3 className="font-semibold text-neon-pink mb-2">✅ Includes VIP Line Access + Full Entry</h3>
                <p className="text-gray-300 text-sm">
                  Walk straight into the club through the express line. Avoid the wait.
                </p>
              </div>

              <p className="text-gray-300 leading-relaxed">
                {event.description}
              </p>
            </div>

            {/* FAQs */}
            <div className="bg-gray-900 rounded-2xl p-6 border border-gray-800">
              <h2 className="text-2xl font-bold mb-6">Frequently Asked Questions</h2>
              
              <div className="space-y-4">
                {faqs.map((faq, index) => (
                  <div key={index} className="border border-gray-700 rounded-lg">
                    <button
                      onClick={() => setExpandedFAQ(expandedFAQ === index ? null : index)}
                      className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-800 transition-colors"
                    >
                      <span className="font-medium text-gray-200">{faq.question}</span>
                      {expandedFAQ === index ? (
                        <ChevronUp className="w-5 h-5 text-neon-pink" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-gray-400" />
                      )}
                    </button>
                    
                    {expandedFAQ === index && (
                      <div className="p-4 pt-0 text-gray-400 leading-relaxed">
                        {faq.answer}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Testimonials */}
            <div className="bg-gray-900 rounded-2xl p-6 border border-gray-800">
              <h2 className="text-2xl font-bold mb-6">What Guests Say</h2>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {testimonials.map((testimonial, index) => (
                  <div key={index} className="bg-gray-800 rounded-xl p-4">
                    <div className="flex items-center mb-3">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 text-yellow-400 fill-current" />
                      ))}
                    </div>
                    <p className="text-gray-300 mb-3 italic">"{testimonial.quote}"</p>
                    <p className="text-gray-500 text-sm">— {testimonial.author}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Purchase Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-gray-900 rounded-2xl p-6 border border-gray-800 sticky top-24">
              <div className="text-center mb-6">
                <div className="text-3xl font-bold text-neon-pink mb-2">
                  €{event.price}
                  <span className="text-lg text-gray-400 font-normal"> / person</span>
                </div>
                
                {!isSoldOut && (
                  <p className="text-sm text-gray-400">
                    {availableTickets} passes remaining
                  </p>
                )}
              </div>

              {!isSoldOut ? (
                <div className="space-y-6">
                  {/* Party Size Selector */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-3">
                      Party Size
                    </label>
                    <div className="grid grid-cols-4 gap-2">
                      {[1, 2, 3, 4].map((size) => (
                        <button
                          key={size}
                          onClick={() => setPartySize(size)}
                          className={`py-2 px-3 rounded-lg border transition-colors ${
                            partySize === size
                              ? 'border-neon-pink bg-neon-pink/10 text-neon-pink'
                              : 'border-gray-600 text-gray-400 hover:border-gray-500'
                          }`}
                        >
                          {size}
                        </button>
                      ))}
                    </div>
                    <p className="text-xs text-gray-500 mt-2">
                      Larger groups? Contact us for custom packages.
                    </p>
                  </div>

                  {/* Total Price */}
                  <div className="bg-gray-800 rounded-lg p-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-gray-400">Fast Pass × {partySize}</span>
                      <span className="text-gray-300">€{totalPrice}</span>
                    </div>
                    <div className="flex justify-between items-center font-semibold text-lg">
                      <span>Total</span>
                      <span className="text-neon-pink">€{totalPrice}</span>
                    </div>
                  </div>

                  {/* Buy Button */}
                  <button
                    onClick={handlePurchase}
                    className="w-full bg-neon-pink text-black font-bold py-4 rounded-lg hover:bg-neon-pink/90 transition-all duration-300 btn-neon neon-glow-pink"
                  >
                    Buy Fast Pass
                  </button>

                  {/* Security Info */}
                  <div className="flex items-center justify-center space-x-4 text-xs text-gray-500">
                    <div className="flex items-center">
                      <Shield className="w-4 h-4 mr-1" />
                      Secure Payment
                    </div>
                    <div className="flex items-center">
                      <Zap className="w-4 h-4 mr-1" />
                      Instant Confirmation
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center">
                  <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 mb-4">
                    <h3 className="font-semibold text-red-400 mb-2">Sold Out</h3>
                    <p className="text-gray-400 text-sm">
                      This event has reached capacity. Check back for future events!
                    </p>
                  </div>
                  
                  <button 
                    onClick={() => router.push('/')}
                    className="w-full bg-gray-700 text-gray-300 font-medium py-3 rounded-lg hover:bg-gray-600 transition-colors"
                  >
                    Browse Other Events
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
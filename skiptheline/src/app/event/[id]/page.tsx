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
  ArrowLeft,
  CreditCard,
  Lock,
  CheckCircle,
  Mail,
  User,
  PartyPopper,
  Heart
} from 'lucide-react';
import PaymentForm from '@/components/PaymentForm';

export default function EventPage() {
  const params = useParams();
  const router = useRouter();
  const [partySize, setPartySize] = useState(1);
  const [expandedFAQ, setExpandedFAQ] = useState<number | null>(null);
  const [showPayment, setShowPayment] = useState(false);
  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    email: ''
  });

  const event = mockEvents.find(e => e.id === params.id);

  if (!event) {
    return (
      <div className="min-h-screen bg-background gradient-bg">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <div className="w-24 h-24 bg-gradient-to-r from-neon-pink to-neon-teal rounded-full flex items-center justify-center mx-auto mb-8">
              <Heart className="w-12 h-12 text-black" />
            </div>
            <h1 className="text-3xl font-black text-gray-300 mb-6">Event Not Found</h1>
            <p className="text-gray-500 text-lg mb-8">
              The event you're looking for doesn't exist or has been removed.
            </p>
            <button 
              onClick={() => router.push('/')}
              className="btn-neon px-8 py-4 rounded-2xl font-bold text-lg text-black ripple"
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
  const soldPercentage = (event.soldTickets / event.maxTickets) * 100;

  const handlePurchaseClick = () => {
    if (!customerInfo.name || !customerInfo.email) {
      alert('Please fill in your name and email before proceeding to payment.');
      return;
    }
    setShowPayment(true);
  };

  return (
    <div className="min-h-screen bg-background gradient-bg">
      <Header />
      
      {/* Back Button */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <button 
          onClick={() => router.push('/')}
          className="flex items-center text-gray-400 hover:text-neon-pink transition-colors mb-8 group"
        >
          <ArrowLeft className="w-5 h-5 mr-2 group-hover:transform group-hover:-translate-x-1 transition-transform" />
          <span className="font-semibold">Back to Events</span>
        </button>
      </div>

      {/* Hero Section */}
      <section className="relative overflow-hidden mb-12">
        <div 
          className="h-80 sm:h-96 bg-cover bg-center relative"
          style={{ backgroundImage: `url(${event.imageUrl})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/70 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-br from-neon-pink/10 via-transparent to-neon-teal/10" />
          
          {/* Floating elements */}
          <div className="absolute top-8 right-8">
            <div className="px-4 py-2 glass-effect rounded-full border border-neon-teal/30">
              <div className="flex items-center space-x-2 text-neon-teal text-sm font-semibold">
                <Star className="w-4 h-4 fill-current" />
                <span>Premium Event</span>
              </div>
            </div>
          </div>
          
          <div className="absolute bottom-8 left-0 right-0">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="glass-effect-strong rounded-3xl p-8 mx-4">
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white mb-4 text-glow-pink">
                  {event.clubName}
                </h1>
                <p className="text-2xl text-neon-pink font-bold mb-6">
                  {event.title}
                </p>
                <div className="flex flex-wrap items-center gap-6">
                  <div className="flex items-center text-gray-300">
                    <Calendar className="w-5 h-5 mr-3 text-neon-teal" />
                    <span className="font-medium">{formatDate(event.date)}</span>
                  </div>
                  <div className="flex items-center text-gray-300">
                    <Clock className="w-5 h-5 mr-3 text-neon-pink" />
                    <span className="font-medium">{event.arrivalWindow}</span>
                  </div>
                  <div className="flex items-center text-gray-300">
                    <Users className="w-5 h-5 mr-3 text-neon-purple" />
                    <span className="font-medium">{event.soldTickets}/{event.maxTickets} sold</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-12">
            {/* Event Details */}
            <div className="glass-effect-strong rounded-3xl p-8 border border-gray-700/50">
              <h2 className="text-3xl font-black mb-8 bg-gradient-to-r from-neon-pink to-neon-teal bg-clip-text text-transparent">
                Event Details
              </h2>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
                <div className="space-y-4">
                  <div className="flex items-center text-gray-300">
                    <Calendar className="w-6 h-6 mr-4 text-neon-pink" />
                    <div>
                      <div className="font-semibold">{formatDate(event.date)}</div>
                      <div className="text-sm text-gray-500">Event Date</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center text-gray-300">
                    <Clock className="w-6 h-6 mr-4 text-neon-teal" />
                    <div>
                      <div className="font-semibold">{event.arrivalWindow}</div>
                      <div className="text-sm text-gray-500">Arrival Window</div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center text-gray-300">
                    <MapPin className="w-6 h-6 mr-4 text-neon-pink" />
                    <div>
                      <div className="font-semibold">{event.location.split(',')[0]}</div>
                      <div className="text-sm text-gray-500">Venue Location</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center text-gray-300">
                    <Users className="w-6 h-6 mr-4 text-neon-purple" />
                    <div>
                      <div className="font-semibold">{event.soldTickets}/{event.maxTickets} sold</div>
                      <div className="text-sm text-gray-500">Capacity</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mb-8">
                <div className="flex justify-between text-sm text-gray-400 mb-2">
                  <span>Event Popularity</span>
                  <span>{Math.round(soldPercentage)}% sold</span>
                </div>
                <div className="w-full bg-gray-800 rounded-full h-3 overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-neon-pink via-neon-purple to-neon-teal rounded-full transition-all duration-1000"
                    style={{ width: `${Math.min(soldPercentage, 100)}%` }}
                  />
                </div>
              </div>

              <div className="p-6 bg-gradient-to-r from-neon-pink/10 to-neon-teal/10 border border-neon-pink/20 rounded-2xl mb-8">
                <h3 className="font-bold text-neon-pink mb-4 flex items-center">
                  <CheckCircle className="w-5 h-5 mr-2" />
                  VIP Experience Includes
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-gray-300">
                  <div className="flex items-center">
                    <Zap className="w-4 h-4 mr-2 text-neon-teal" />
                    <span>Skip the general line</span>
                  </div>
                  <div className="flex items-center">
                    <Shield className="w-4 h-4 mr-2 text-neon-green" />
                    <span>VIP/Express entrance</span>
                  </div>
                  <div className="flex items-center">
                    <PartyPopper className="w-4 h-4 mr-2 text-neon-pink" />
                    <span>Full club access</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="w-4 h-4 mr-2 text-neon-purple" />
                    <span>Instant confirmation</span>
                  </div>
                </div>
              </div>

              <p className="text-gray-300 leading-relaxed text-lg">
                {event.description}
              </p>
            </div>

            {/* FAQs */}
            <div className="glass-effect-strong rounded-3xl p-8 border border-gray-700/50">
              <h2 className="text-3xl font-black mb-8 bg-gradient-to-r from-neon-pink to-neon-teal bg-clip-text text-transparent">
                Frequently Asked Questions
              </h2>
              
              <div className="space-y-4">
                {faqs.map((faq, index) => (
                  <div key={index} className="border border-gray-700/50 rounded-2xl overflow-hidden">
                    <button
                      onClick={() => setExpandedFAQ(expandedFAQ === index ? null : index)}
                      className="w-full flex items-center justify-between p-6 text-left hover:bg-gray-800/50 transition-colors"
                    >
                      <span className="font-semibold text-gray-200 text-lg">{faq.question}</span>
                      {expandedFAQ === index ? (
                        <ChevronUp className="w-6 h-6 text-neon-pink" />
                      ) : (
                        <ChevronDown className="w-6 h-6 text-gray-400" />
                      )}
                    </button>
                    
                    {expandedFAQ === index && (
                      <div className="p-6 pt-0 text-gray-400 leading-relaxed text-lg">
                        {faq.answer}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Testimonials */}
            <div className="glass-effect-strong rounded-3xl p-8 border border-gray-700/50">
              <h2 className="text-3xl font-black mb-8 bg-gradient-to-r from-neon-pink to-neon-teal bg-clip-text text-transparent">
                What Guests Say
              </h2>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {testimonials.map((testimonial, index) => (
                  <div key={index} className="bg-gray-800/50 rounded-2xl p-6 border border-gray-700/30">
                    <div className="flex items-center mb-4">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                      ))}
                    </div>
                    <p className="text-gray-300 mb-4 italic text-lg">"{testimonial.quote}"</p>
                    <p className="text-gray-500 font-medium">— {testimonial.author}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Purchase Sidebar */}
          <div className="lg:col-span-1">
            <div className="glass-effect-strong rounded-3xl p-8 border border-gray-700/50 sticky top-28">
              {!showPayment ? (
                <>
                  <div className="text-center mb-8">
                    <div className="text-4xl font-black text-transparent bg-gradient-to-r from-neon-pink to-neon-teal bg-clip-text mb-2">
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
                    <div className="space-y-8">
                      {/* Customer Info */}
                      <div className="space-y-4">
                        <h3 className="font-bold text-gray-200 mb-4">Your Information</h3>
                        
                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">
                            Full Name *
                          </label>
                          <div className="relative">
                            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                              type="text"
                              value={customerInfo.name}
                              onChange={(e) => setCustomerInfo(prev => ({ ...prev, name: e.target.value }))}
                              className="w-full pl-10 pr-4 py-3 bg-gray-800/50 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:border-neon-pink focus:ring-1 focus:ring-neon-pink transition-colors input-glow"
                              placeholder="Enter your full name"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-300 mb-2">
                            Email Address *
                          </label>
                          <div className="relative">
                            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                            <input
                              type="email"
                              value={customerInfo.email}
                              onChange={(e) => setCustomerInfo(prev => ({ ...prev, email: e.target.value }))}
                              className="w-full pl-10 pr-4 py-3 bg-gray-800/50 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:border-neon-pink focus:ring-1 focus:ring-neon-pink transition-colors input-glow"
                              placeholder="Enter your email"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Party Size Selector */}
                      <div>
                        <label className="block text-sm font-medium text-gray-300 mb-4">
                          Party Size
                        </label>
                        <div className="grid grid-cols-4 gap-3">
                          {[1, 2, 3, 4].map((size) => (
                            <button
                              key={size}
                              onClick={() => setPartySize(size)}
                              className={`py-3 px-4 rounded-xl border transition-all font-semibold ${
                                partySize === size
                                  ? 'border-neon-pink bg-neon-pink/10 text-neon-pink neon-glow-pink'
                                  : 'border-gray-600 text-gray-400 hover:border-gray-500 hover:text-gray-300'
                              }`}
                            >
                              {size}
                            </button>
                          ))}
                        </div>
                        <p className="text-xs text-gray-500 mt-2">
                          Need more? Contact us for custom packages.
                        </p>
                      </div>

                      {/* Total Price */}
                      <div className="bg-gray-800/50 rounded-2xl p-6 border border-gray-700/50">
                        <div className="flex justify-between items-center mb-3">
                          <span className="text-gray-400">Fast Pass × {partySize}</span>
                          <span className="text-gray-300 font-semibold">€{totalPrice}</span>
                        </div>
                        <div className="flex justify-between items-center font-bold text-xl">
                          <span className="text-gray-200">Total</span>
                          <span className="text-transparent bg-gradient-to-r from-neon-pink to-neon-teal bg-clip-text">€{totalPrice}</span>
                        </div>
                      </div>

                      {/* Buy Button */}
                      <button
                        onClick={handlePurchaseClick}
                        disabled={!customerInfo.name || !customerInfo.email}
                        className="w-full btn-neon text-black font-bold py-4 rounded-2xl transition-all duration-300 ripple disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                      >
                        <CreditCard className="w-5 h-5" />
                        <span>Proceed to Payment</span>
                      </button>

                      {/* Security Info */}
                      <div className="flex items-center justify-center space-x-6 text-xs text-gray-500">
                        <div className="flex items-center">
                          <Shield className="w-4 h-4 mr-2" />
                          <span>Secure Payment</span>
                        </div>
                        <div className="flex items-center">
                          <Lock className="w-4 h-4 mr-2" />
                          <span>SSL Encrypted</span>
                        </div>
                        <div className="flex items-center">
                          <Zap className="w-4 h-4 mr-2" />
                          <span>Instant Confirmation</span>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center">
                      <div className="bg-red-500/10 border border-red-500/20 rounded-2xl p-6 mb-6">
                        <h3 className="font-bold text-red-400 mb-3 text-xl">Sold Out</h3>
                        <p className="text-gray-400 leading-relaxed">
                          This event has reached capacity. Check back for future events or join our waitlist!
                        </p>
                      </div>
                      
                      <button 
                        onClick={() => router.push('/')}
                        className="w-full bg-gray-700 text-gray-300 font-semibold py-4 rounded-2xl hover:bg-gray-600 transition-colors"
                      >
                        Browse Other Events
                      </button>
                    </div>
                  )}
                </>
              ) : (
                <>
                  <div className="mb-6">
                    <button
                      onClick={() => setShowPayment(false)}
                      className="flex items-center text-gray-400 hover:text-neon-pink transition-colors"
                    >
                      <ArrowLeft className="w-4 h-4 mr-2" />
                      Back to Details
                    </button>
                  </div>
                  
                  <PaymentForm
                    amount={totalPrice}
                    eventId={event.id}
                    partySize={partySize}
                    customerInfo={customerInfo}
                  />
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
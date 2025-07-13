'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { CreditCard, Lock, Shield, CheckCircle, AlertCircle, Loader } from 'lucide-react';

interface PaymentFormProps {
  amount: number;
  eventId: string;
  partySize: number;
  customerInfo: {
    name: string;
    email: string;
  };
}

export default function PaymentForm({ amount, eventId, partySize, customerInfo }: PaymentFormProps) {
  const router = useRouter();
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  // Mock payment processing for demo purposes
  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    setPaymentError(null);

    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // For demo purposes, we'll just simulate success
      // In a real app, you would integrate with Stripe here
      setPaymentSuccess(true);
      
      // Redirect to confirmation after success
      setTimeout(() => {
        router.push(`/confirmation?event=${eventId}&party=${partySize}&total=${amount}&name=${encodeURIComponent(customerInfo.name)}&email=${encodeURIComponent(customerInfo.email)}`);
      }, 1500);
      
    } catch (error) {
      setPaymentError('Payment failed. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  if (paymentSuccess) {
    return (
      <div className="text-center py-8">
        <div className="w-20 h-20 bg-gradient-to-r from-neon-green to-neon-teal rounded-full flex items-center justify-center mx-auto mb-6 neon-glow-teal">
          <CheckCircle className="w-10 h-10 text-black" />
        </div>
        <h3 className="text-2xl font-bold text-neon-green mb-4">Payment Successful!</h3>
        <p className="text-gray-400 mb-6">Redirecting to your confirmation...</p>
        <div className="flex justify-center">
          <div className="spinner"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h3 className="text-xl font-bold text-gray-200 mb-2">Complete Your Purchase</h3>
        <p className="text-gray-400">Secure payment powered by Stripe</p>
      </div>

      {/* Order Summary */}
      <div className="bg-gray-800/50 rounded-2xl p-6 border border-gray-700/50">
        <h4 className="font-semibold text-gray-200 mb-4">Order Summary</h4>
        <div className="space-y-3">
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">Guest Name</span>
            <span className="text-gray-300">{customerInfo.name}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">Email</span>
            <span className="text-gray-300">{customerInfo.email}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">Party Size</span>
            <span className="text-gray-300">{partySize} {partySize === 1 ? 'person' : 'people'}</span>
          </div>
          <div className="border-t border-gray-700 pt-3">
            <div className="flex justify-between font-bold text-lg">
              <span className="text-gray-200">Total</span>
              <span className="text-transparent bg-gradient-to-r from-neon-pink to-neon-teal bg-clip-text">€{amount}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Form */}
      <form onSubmit={handlePayment} className="space-y-6">
        {/* Card Number */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Card Number
          </label>
          <div className="relative">
            <CreditCard className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="1234 5678 9012 3456"
              className="w-full pl-10 pr-4 py-3 bg-gray-800/50 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:border-neon-pink focus:ring-1 focus:ring-neon-pink transition-colors input-glow"
              required
            />
          </div>
        </div>

        {/* Expiry and CVC */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Expiry Date
            </label>
            <input
              type="text"
              placeholder="MM/YY"
              className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:border-neon-pink focus:ring-1 focus:ring-neon-pink transition-colors input-glow"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              CVC
            </label>
            <input
              type="text"
              placeholder="123"
              className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:border-neon-pink focus:ring-1 focus:ring-neon-pink transition-colors input-glow"
              required
            />
          </div>
        </div>

        {/* Billing Address */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Billing Address
          </label>
          <input
            type="text"
            placeholder="Street address"
            className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:border-neon-pink focus:ring-1 focus:ring-neon-pink transition-colors input-glow"
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <input
              type="text"
              placeholder="City"
              className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:border-neon-pink focus:ring-1 focus:ring-neon-pink transition-colors input-glow"
              required
            />
          </div>
          <div>
            <input
              type="text"
              placeholder="Postal Code"
              className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:border-neon-pink focus:ring-1 focus:ring-neon-pink transition-colors input-glow"
              required
            />
          </div>
        </div>

        {/* Error Message */}
        {paymentError && (
          <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl flex items-center text-red-400">
            <AlertCircle className="w-5 h-5 mr-3" />
            <span>{paymentError}</span>
          </div>
        )}

        {/* Payment Button */}
        <button
          type="submit"
          disabled={isProcessing}
          className="w-full btn-neon text-black font-bold py-4 rounded-2xl transition-all duration-300 ripple disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
        >
          {isProcessing ? (
            <>
              <div className="spinner"></div>
              <span>Processing...</span>
            </>
          ) : (
            <>
              <Lock className="w-5 h-5" />
              <span>Pay €{amount} Securely</span>
            </>
          )}
        </button>

        {/* Security Notice */}
        <div className="text-center">
          <div className="flex items-center justify-center space-x-6 text-xs text-gray-500 mb-4">
            <div className="flex items-center">
              <Shield className="w-4 h-4 mr-2" />
              <span>256-bit SSL</span>
            </div>
            <div className="flex items-center">
              <Lock className="w-4 h-4 mr-2" />
              <span>PCI Compliant</span>
            </div>
          </div>
          <p className="text-xs text-gray-500">
            Your payment information is secure and encrypted. This is a demo - no real payment will be processed.
          </p>
        </div>
      </form>
    </div>
  );
}
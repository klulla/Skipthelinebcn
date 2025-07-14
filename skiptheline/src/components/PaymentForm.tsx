'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ExternalLink, Shield, CheckCircle, AlertCircle, Loader, Mail, FileSpreadsheet, Copy } from 'lucide-react';

interface PaymentFormProps {
  amount: number;
  eventId: string;
  eventTitle: string;
  partySize: number;
  customerInfo: {
    name: string;
    email: string;
  };
  stripePaymentLink: string;
  spreadsheetLink?: string;
}

// Generate a random confirmation ID
const generateConfirmationId = (): string => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < 8; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
};

export default function PaymentForm({ amount, eventId, eventTitle, partySize, customerInfo, stripePaymentLink, spreadsheetLink }: PaymentFormProps) {
  const router = useRouter();
  const [confirmationId, setConfirmationId] = useState('');
  const [copied, setCopied] = useState(false);
  const [isCreatingPaymentLink, setIsCreatingPaymentLink] = useState(false);

  // Generate confirmation ID when component mounts
  useEffect(() => {
    setConfirmationId(generateConfirmationId());
  }, []);

  // Copy confirmation ID to clipboard
  const copyConfirmationId = () => {
    navigator.clipboard.writeText(confirmationId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Create a new Stripe payment link with fixed quantity and redirect
  const createPaymentLink = async () => {
    setIsCreatingPaymentLink(true);
    try {
      const response = await fetch('/api/create-payment-intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: amount * 100, // Convert to cents
          quantity: partySize,
          eventId,
          eventTitle,
          guestName: customerInfo.name,
          email: customerInfo.email,
          confirmationId,
          spreadsheetLink,
          redirectUrl: `${window.location.origin}/confirmation?id=${confirmationId}&event=${eventId}&party=${partySize}&total=${amount}`
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create payment link');
      }

      const data = await response.json();
      
      // Redirect to the new payment link
      window.location.href = data.paymentLink;
    } catch (error) {
      console.error('Error creating payment link:', error);
      alert('Failed to create payment link. Please try again.');
    } finally {
      setIsCreatingPaymentLink(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="glass-effect-strong rounded-3xl p-8 border border-gray-700/50">
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-gradient-to-r from-neon-pink to-neon-teal rounded-full flex items-center justify-center mx-auto mb-6">
            <Shield className="w-10 h-10 text-black" />
          </div>
          <h2 className="text-3xl font-black mb-3 bg-gradient-to-r from-neon-pink to-neon-teal bg-clip-text text-transparent">
            Secure Payment
          </h2>
          <p className="text-gray-400 text-lg">Complete your purchase with Stripe</p>
        </div>

        {/* Order Summary */}
        <div className="bg-gray-800/50 rounded-2xl p-6 mb-8 border border-gray-700/50">
          <h3 className="text-xl font-bold text-white mb-4">Order Summary</h3>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-400">Event</span>
              <span className="text-white font-medium">{eventTitle}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Party Size</span>
              <span className="text-white font-medium">{partySize} people</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-400">Price per person</span>
              <span className="text-white font-medium">€{amount / partySize}</span>
            </div>
            <div className="border-t border-gray-700 pt-3">
              <div className="flex justify-between">
                <span className="text-lg font-bold text-white">Total</span>
                <span className="text-2xl font-black text-neon-pink">€{amount}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Customer Info */}
        <div className="bg-gray-800/50 rounded-2xl p-6 mb-8 border border-gray-700/50">
          <h3 className="text-lg font-bold text-white mb-4">Customer Information</h3>
          <div className="space-y-3">
            <div>
              <span className="text-gray-400 text-sm">Name</span>
              <p className="text-white font-medium">{customerInfo.name}</p>
            </div>
            <div>
              <span className="text-gray-400 text-sm">Email</span>
              <p className="text-white font-medium">{customerInfo.email}</p>
            </div>
          </div>
        </div>

        {/* Confirmation ID Preview */}
        <div className="bg-gradient-to-r from-neon-pink/10 to-neon-teal/10 rounded-2xl p-6 mb-8 border border-neon-pink/20">
          <h3 className="text-lg font-bold text-white mb-3">Your Confirmation ID</h3>
          <div className="bg-gray-900/50 p-4 rounded-xl">
            <span className="text-neon-teal font-mono text-xl">{confirmationId}</span>
          </div>
          <p className="text-gray-400 text-sm mt-2">This will be saved to our records and emailed to you</p>
        </div>

        {/* Important Note */}
        <div className="bg-blue-500/10 border border-blue-500/20 rounded-2xl p-6 mb-8">
          <div className="flex items-start space-x-4">
            <AlertCircle className="w-6 h-6 text-blue-400 mt-0.5 flex-shrink-0 mr-3" />
            <div>
              <h4 className="font-bold text-blue-400 mb-2">Fixed Quantity Payment</h4>
              <p className="text-gray-300 text-sm leading-relaxed">
                Your party size of {partySize} people is locked in and cannot be changed during payment. 
                After successful payment, you'll automatically be redirected to the confirmation page 
                and receive a confirmation email.
              </p>
            </div>
          </div>
        </div>

        {/* Payment Button */}
        <div className="text-center">
          <button
            onClick={createPaymentLink}
            disabled={isCreatingPaymentLink}
            className="inline-flex items-center px-8 py-4 btn-neon text-black font-bold rounded-2xl transition-all duration-300 ripple disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isCreatingPaymentLink ? (
              <>
                <Loader className="w-5 h-5 mr-3 animate-spin" />
                Creating Payment...
              </>
            ) : (
              <>
                <span className="mr-3">Complete Payment</span>
                <ExternalLink className="w-5 h-5" />
              </>
            )}
          </button>
          <p className="text-gray-500 text-sm mt-4">
            You'll be redirected to Stripe to complete your payment securely
          </p>
        </div>

        {/* Security Note */}
        <div className="flex items-center justify-center text-gray-400 text-sm mt-8">
          <Shield className="w-4 h-4 mr-3" />
          <span>Secured by Stripe • SSL Encrypted</span>
        </div>
      </div>
    </div>
  );
}
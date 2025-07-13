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

export default function PaymentForm({ amount, eventId, eventTitle, partySize, customerInfo, stripePaymentLink }: PaymentFormProps) {
  const router = useRouter();
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [confirmationId, setConfirmationId] = useState('');
  const [copied, setCopied] = useState(false);

  // Generate confirmation ID when component mounts
  useEffect(() => {
    setConfirmationId(generateConfirmationId());
  }, []);

  // Function to save to Google Sheets
  const saveToGoogleSheets = async (purchaseData: any) => {
    try {
      // TODO: Replace with actual Google Sheets integration
      // const response = await fetch('/api/sheets/add-purchase', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(purchaseData)
      // });
      
      console.log('Saving to Google Sheets:', purchaseData);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
    } catch (error) {
      console.error('Error saving to Google Sheets:', error);
      throw error;
    }
  };

  // Function to send confirmation email
  const sendConfirmationEmail = async (customerData: any) => {
    try {
      // TODO: Replace with actual email service integration
      // const response = await fetch('/api/email/send-confirmation', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(customerData)
      // });
      
      console.log('Sending confirmation email:', customerData);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
    } catch (error) {
      console.error('Error sending confirmation email:', error);
      throw error;
    }
  };

  // Handle successful payment (this would be called via webhook in real implementation)
  const handlePaymentSuccess = async () => {
    setIsProcessing(true);

    try {
      const purchaseData = {
        confirmationId,
        eventId,
        eventTitle,
        customerName: customerInfo.name,
        email: customerInfo.email,
        partySize,
        totalAmount: amount,
        purchaseDate: new Date().toISOString(),
        status: 'confirmed',
        // Add sheet ID for this specific event
        sheetId: `${eventId}_purchases`
      };

      // Save to Google Sheets
      await saveToGoogleSheets(purchaseData);

      // Send confirmation email
      await sendConfirmationEmail({
        ...purchaseData,
        eventName: eventTitle
      });

      setPaymentSuccess(true);
      
      // Redirect to confirmation after success
      setTimeout(() => {
        router.push(`/confirmation?id=${confirmationId}&event=${eventId}&party=${partySize}&total=${amount}&name=${encodeURIComponent(customerInfo.name)}&email=${encodeURIComponent(customerInfo.email)}`);
      }, 3000);
      
    } catch (error) {
      console.error('Error processing payment success:', error);
      // Handle error appropriately
    } finally {
      setIsProcessing(false);
    }
  };

  // Copy confirmation ID to clipboard
  const copyConfirmationId = () => {
    navigator.clipboard.writeText(confirmationId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Construct Stripe payment link with prefilled data
  const constructStripeUrl = () => {
    const url = new URL(stripePaymentLink);
    
    // Add prefilled data to Stripe payment link
    if (customerInfo.email) {
      url.searchParams.set('prefilled_email', customerInfo.email);
    }
    
    // Add client reference ID for tracking
    url.searchParams.set('client_reference_id', confirmationId);
    
    return url.toString();
  };

  if (paymentSuccess) {
    return (
      <div className="text-center py-12">
        <div className="w-24 h-24 bg-gradient-to-r from-neon-green to-neon-teal rounded-full flex items-center justify-center mx-auto mb-8 neon-glow-teal">
          <CheckCircle className="w-12 h-12 text-black" />
        </div>
        <h3 className="text-3xl font-bold text-neon-green mb-4">Payment Successful!</h3>
        <p className="text-gray-400 mb-8 text-lg">Processing your order and sending confirmation...</p>
        
        <div className="bg-gray-800/50 p-6 rounded-2xl max-w-md mx-auto border border-neon-green/20">
          <h4 className="text-lg font-bold text-white mb-3">Your Confirmation ID</h4>
          <div className="flex items-center justify-between bg-gray-900/50 p-4 rounded-xl">
            <span className="text-neon-green font-mono text-xl">{confirmationId}</span>
            <button
              onClick={copyConfirmationId}
              className="p-2 text-gray-400 hover:text-neon-green transition-colors"
            >
              <Copy className="w-5 h-5" />
            </button>
          </div>
          {copied && <p className="text-neon-green text-sm mt-2">Copied to clipboard!</p>}
        </div>
        
        <div className="flex items-center justify-center gap-8 mt-8">
          <div className="flex items-center text-gray-400">
            <FileSpreadsheet className="w-5 h-5 mr-2" />
            <span>Saved to records</span>
          </div>
          <div className="flex items-center text-gray-400">
            <Mail className="w-5 h-5 mr-2" />
            <span>Email sent</span>
          </div>
        </div>
      </div>
    );
  }

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

        {/* Payment Button */}
        <div className="text-center">
          <a
            href={constructStripeUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center px-8 py-4 btn-neon text-black font-bold rounded-2xl transition-all duration-300 ripple"
          >
            <span className="mr-3">Complete Payment</span>
            <ExternalLink className="w-5 h-5" />
          </a>
          <p className="text-gray-500 text-sm mt-4">
            You'll be redirected to Stripe to complete your payment securely
          </p>
        </div>

        {/* Security Note */}
        <div className="flex items-center justify-center text-gray-400 text-sm mt-8">
          <Shield className="w-4 h-4 mr-2" />
          <span>Secured by Stripe • SSL Encrypted</span>
        </div>

        {/* Test Payment Button (Remove in production) */}
        <div className="text-center mt-6">
          <button
            onClick={handlePaymentSuccess}
            disabled={isProcessing}
            className="px-6 py-3 bg-gray-800 text-gray-400 rounded-xl hover:bg-gray-700 transition-colors text-sm border border-gray-600"
          >
            {isProcessing ? (
              <>
                <Loader className="w-4 h-4 mr-2 animate-spin inline" />
                Processing...
              </>
            ) : (
              'Test Success (Remove in Production)'
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
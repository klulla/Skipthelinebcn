'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ExternalLink, Shield, CheckCircle, AlertCircle, Loader, Mail, FileSpreadsheet } from 'lucide-react';

interface PaymentFormProps {
  amount: number;
  eventId: string;
  partySize: number;
  customerInfo: {
    name: string;
    email: string;
  };
  stripePaymentLink: string;
}

export default function PaymentForm({ amount, eventId, partySize, customerInfo, stripePaymentLink }: PaymentFormProps) {
  const router = useRouter();
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  // Mock function to save to Google Sheets
  const saveToGoogleSheets = async (purchaseData: any) => {
    // This would integrate with Google Sheets API
    console.log('Saving to Google Sheets:', purchaseData);
    // Placeholder for Google Sheets integration
    return new Promise(resolve => setTimeout(resolve, 500));
  };

  // Mock function to send confirmation email
  const sendConfirmationEmail = async (customerData: any) => {
    // This would integrate with email service (SendGrid, Nodemailer, etc.)
    console.log('Sending confirmation email:', customerData);
    // Placeholder for email service integration
    return new Promise(resolve => setTimeout(resolve, 500));
  };

  // Handle payment completion (this would be called via webhook in real implementation)
  const handlePaymentSuccess = async () => {
    setIsProcessing(true);

    try {
      const purchaseData = {
        eventId,
        customerName: customerInfo.name,
        email: customerInfo.email,
        partySize,
        totalAmount: amount,
        purchaseDate: new Date().toISOString(),
        status: 'confirmed'
      };

      // Save to Google Sheets
      await saveToGoogleSheets(purchaseData);

      // Send confirmation email
      await sendConfirmationEmail({
        ...purchaseData,
        eventName: 'Event Name' // Would get from event data
      });

      setPaymentSuccess(true);
      
      // Redirect to confirmation after success
      setTimeout(() => {
        router.push(`/confirmation?event=${eventId}&party=${partySize}&total=${amount}&name=${encodeURIComponent(customerInfo.name)}&email=${encodeURIComponent(customerInfo.email)}`);
      }, 2000);
      
    } catch (error) {
      console.error('Error processing payment success:', error);
      // Handle error appropriately
    } finally {
      setIsProcessing(false);
    }
  };

  // Construct Stripe payment link with prefilled data
  const constructStripeUrl = () => {
    const url = new URL(stripePaymentLink);
    
    // Add prefilled data to Stripe payment link
    if (customerInfo.email) {
      url.searchParams.set('prefilled_email', customerInfo.email);
    }
    
    // For quantity, we'll need to handle this in the payment link setup
    // or use Stripe's quantity parameter if supported
    
    return url.toString();
  };

  if (paymentSuccess) {
    return (
      <div className="text-center py-8">
        <div className="w-20 h-20 bg-gradient-to-r from-neon-green to-neon-teal rounded-full flex items-center justify-center mx-auto mb-6 neon-glow-teal">
          <CheckCircle className="w-10 h-10 text-black" />
        </div>
        <h3 className="text-2xl font-bold text-neon-green mb-4">Payment Successful!</h3>
        <p className="text-gray-400 mb-6">Processing your order and sending confirmation...</p>
        <div className="flex justify-center items-center space-x-4 text-sm text-gray-500">
          <div className="flex items-center">
            <FileSpreadsheet className="w-4 h-4 mr-2" />
            <span>Saving to database</span>
          </div>
          <div className="flex items-center">
            <Mail className="w-4 h-4 mr-2" />
            <span>Sending confirmation</span>
          </div>
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
      <div className="glass-effect-strong rounded-2xl p-6 border border-gray-700/50">
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

      {/* Stripe Payment Button */}
      <div className="space-y-4">
        <a
          href={constructStripeUrl()}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full btn-neon text-black font-bold py-4 rounded-2xl transition-all duration-300 ripple flex items-center justify-center space-x-3 no-underline"
        >
          <Shield className="w-5 h-5" />
          <span>Pay €{amount} with Stripe</span>
          <ExternalLink className="w-5 h-5" />
        </a>
        
        {/* Demo Success Button */}
        <button
          onClick={handlePaymentSuccess}
          disabled={isProcessing}
          className="w-full bg-green-600 hover:bg-green-500 text-white font-bold py-3 rounded-2xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
        >
          {isProcessing ? (
            <>
              <div className="spinner"></div>
              <span>Processing...</span>
            </>
          ) : (
            <>
              <CheckCircle className="w-5 h-5" />
              <span>Demo: Simulate Payment Success</span>
            </>
          )}
        </button>
      </div>

      {/* Payment Instructions */}
      <div className="bg-blue-500/10 border border-blue-500/20 rounded-2xl p-6">
        <div className="flex items-start space-x-3">
          <AlertCircle className="w-6 h-6 text-blue-400 mt-0.5" />
          <div>
            <h4 className="font-semibold text-blue-400 mb-2">Payment Instructions</h4>
            <div className="text-gray-300 text-sm space-y-2">
              <p>1. Click "Pay with Stripe" to open the secure payment page</p>
              <p>2. Complete your payment using your preferred method</p>
              <p>3. You'll receive an instant confirmation email</p>
              <p>4. Show your confirmation at the venue for VIP entry</p>
            </div>
          </div>
        </div>
      </div>

      {/* Security Notice */}
      <div className="text-center">
        <div className="flex items-center justify-center space-x-6 text-xs text-gray-500 mb-4">
          <div className="flex items-center">
            <Shield className="w-4 h-4 mr-2" />
            <span>256-bit SSL</span>
          </div>
          <div className="flex items-center">
            <CheckCircle className="w-4 h-4 mr-2" />
            <span>PCI Compliant</span>
          </div>
          <div className="flex items-center">
            <ExternalLink className="w-4 h-4 mr-2" />
            <span>Stripe Secure</span>
          </div>
        </div>
        <p className="text-xs text-gray-500">
          Your payment is processed securely by Stripe. We never store your payment information.
        </p>
      </div>
    </div>
  );
}
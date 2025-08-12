import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createPurchase, getEvent } from '@/lib/firebaseService';
import { sendEmail } from '@/lib/emailService';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-06-30.basil',
});

export async function POST(request: NextRequest) {
  try {
    console.log('🔔 Webhook received');
    
    const body = await request.text();
    const signature = request.headers.get('stripe-signature')!;
    
    console.log('📝 Webhook body length:', body.length);
    console.log('🔑 Signature present:', !!signature);
    console.log('🔑 Webhook secret present:', !!process.env.STRIPE_WEBHOOK_SECRET);
    
    const event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
    
    console.log('✅ Webhook signature verified');
    console.log('📦 Event type:', event.type);
    
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session;
      
      console.log('💰 Checkout session completed');
      console.log('📧 Customer email:', session.customer_email);
      console.log('🏷️ Metadata:', session.metadata);
      
      // Extract data from session metadata
      const eventId = session.metadata?.eventId;
      const guestName = session.metadata?.guestName;
      const partySize = parseInt(session.metadata?.partySize || '1');
      const eventTitle = session.metadata?.eventTitle;
      const eventDate = session.metadata?.eventDate;
      const confirmationId = session.metadata?.confirmationId;
      // Use customer_email or customer_details.email
      const email = session.customer_email || session.customer_details?.email;
      
      console.log('📋 Extracted data:', {
        eventId,
        guestName,
        partySize,
        eventTitle,
        confirmationId,
        email
      });
      
      if (eventId && guestName && email) {
        console.log('✅ All required data present, checking event status...');
        
        try {
          // Get the event to check if it's locked
          const eventData = await getEvent(eventId);
          if (!eventData) {
            console.error('❌ Event not found:', eventId);
            return NextResponse.json({ error: 'Event not found' }, { status: 404 });
          }
          
          // Check if event is locked (past lock time)
          if (eventData.lockTime) {
            const lockTime = new Date(eventData.lockTime);
            const now = new Date();
            
            if (now > lockTime) {
              console.log('❌ Event is locked, payment rejected');
              return NextResponse.json({ 
                error: 'Event is locked - ticket sales have ended' 
              }, { status: 400 });
            }
          }
          
          console.log('✅ Event is not locked, creating purchase...');
          
          // Create purchase in Firebase
          const purchase = await createPurchase({
            eventId,
            guestName,
            email,
            partySize,
            purchaseDate: new Date().toISOString(),
            status: 'confirmed',
            totalAmount: (session.amount_total || 0) / 100, // Convert from cents
            stripePaymentId: session.id,
            confirmationId: confirmationId || `STL${Date.now().toString().slice(-6)}`
          });
          
          console.log('✅ Purchase created in Firebase:', purchase.id);
          
          // Send confirmation email
          try {
            console.log('📧 Sending confirmation email...');
            await sendEmail({
              to: email,
              subject: `Booking Confirmed - ${eventTitle}`,
              html: `
                <h2>Booking Confirmed!</h2>
                <p>Hi ${guestName},</p>
                <p>Your booking for <strong>${eventTitle}</strong> has been confirmed.</p>
                <p><strong>Details:</strong></p>
                <ul>
                  <li>Party Size: ${partySize} people</li>
                  <li>Total Amount: €${(session.amount_total || 0) / 100}</li>
                  <li>Confirmation ID: ${confirmationId || purchase.confirmationId}</li>
                </ul>
                <p>We'll see you there!</p>
                <p>- SkipTheLine Team</p>
              `
            });
            console.log('✅ Confirmation email sent successfully');
          } catch (emailError) {
            console.error('❌ Failed to send confirmation email:', emailError);
          }
          
          console.log('🎉 Payment processed successfully:', {
            purchaseId: purchase.id,
            eventId,
            guestName,
            partySize,
            amount: (session.amount_total || 0) / 100,
            confirmationId: confirmationId || purchase.confirmationId
          });
        } catch (purchaseError) {
          console.error('❌ Failed to create purchase:', purchaseError);
          throw purchaseError;
        }
      } else {
        console.log('❌ Missing required data:', {
          hasEventId: !!eventId,
          hasGuestName: !!guestName,
          hasEmail: !!email
        });
      }
    }
    
    console.log('✅ Webhook processed successfully');
    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('❌ Webhook error:', error);
    console.error('❌ Error details:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    });
    return NextResponse.json({ error: 'Webhook failed' }, { status: 400 });
  }
} 
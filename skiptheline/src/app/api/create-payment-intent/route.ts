import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2025-06-30.basil',
});

export async function POST(request: NextRequest) {
  try {
    const { 
      amount, 
      quantity, 
      eventId, 
      eventTitle, 
      guestName, 
      email, 
      confirmationId, 
      spreadsheetLink,
      redirectUrl 
    } = await request.json();

    console.log('🔗 Creating payment link with data:', {
      amount,
      quantity,
      eventId,
      eventTitle,
      guestName,
      email,
      confirmationId,
      redirectUrl
    });

    if (!amount || !quantity || !eventId || !eventTitle || !guestName || !email || !confirmationId) {
      console.log('❌ Missing required parameters');
      return NextResponse.json({ error: 'Missing required parameters' }, { status: 400 });
    }

    // First create a product and price
    const product = await stripe.products.create({
      name: eventTitle,
      description: `Fast Pass for ${guestName} - ${quantity} ${quantity === 1 ? 'person' : 'people'}`,
    });

    const price = await stripe.prices.create({
      product: product.id,
      unit_amount: Math.round(amount / quantity), // Price per person in cents
      currency: 'eur',
    });

    const metadata = {
      eventId,
      eventTitle,
      guestName,
      partySize: quantity.toString(),
      confirmationId,
      spreadsheetLink: spreadsheetLink || '',
    };

    console.log('📋 Payment link metadata:', metadata);

    // Create a payment link with fixed quantity and redirect
    const paymentLink = await stripe.paymentLinks.create({
      line_items: [
        {
          price: price.id,
          quantity: quantity,
          adjustable_quantity: {
            enabled: false, // Disable quantity adjustment
          },
        },
      ],
      after_completion: {
        type: 'redirect',
        redirect: {
          url: redirectUrl,
        },
      },
      metadata,
      allow_promotion_codes: false,
      billing_address_collection: 'auto',
      phone_number_collection: {
        enabled: false,
      },
    });

    console.log('✅ Payment link created:', paymentLink.id);
    console.log('🔗 Payment link URL:', paymentLink.url);

    return NextResponse.json({
      paymentLink: paymentLink.url,
      paymentLinkId: paymentLink.id,
    });
  } catch (error) {
    console.error('❌ Error creating payment link:', error);
    return NextResponse.json(
      { error: 'Failed to create payment link' },
      { status: 500 }
    );
  }
}
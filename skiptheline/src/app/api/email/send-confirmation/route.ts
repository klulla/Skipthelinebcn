import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: NextRequest) {
  try {
    const { confirmationId, eventTitle, customerName, email, partySize, totalAmount, purchaseDate } = await request.json();
    
    const { data, error } = await resend.emails.send({
      from: process.env.FROM_EMAIL!,
      to: [email],
      subject: `SkipTheLine Confirmation - ${eventTitle}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #ff2d72; font-size: 28px; margin: 0;">SkipTheLine Barcelona</h1>
            <h2 style="color: #333; margin: 10px 0;">Booking Confirmed! 🎉</h2>
          </div>
          
          <div style="background: #f8f9fa; padding: 25px; border-radius: 10px; margin: 20px 0;">
            <h3 style="color: #333; margin-top: 0;">Confirmation Details</h3>
            <p><strong>Confirmation ID:</strong> <span style="color: #ff2d72; font-family: monospace; font-size: 18px;">${confirmationId}</span></p>
            <p><strong>Event:</strong> ${eventTitle}</p>
            <p><strong>Guest Name:</strong> ${customerName}</p>
            <p><strong>Party Size:</strong> ${partySize} people</p>
            <p><strong>Total Amount:</strong> €${totalAmount}</p>
            <p><strong>Purchase Date:</strong> ${new Date(purchaseDate).toLocaleString()}</p>
          </div>
          
          <div style="background: #e3f2fd; padding: 25px; border-radius: 10px; margin: 20px 0;">
            <h3 style="color: #1976d2; margin-top: 0;">What's Next?</h3>
            <ol style="color: #333; line-height: 1.6;">
              <li>Save this confirmation ID: <strong style="color: #ff2d72;">${confirmationId}</strong></li>
              <li>Arrive at the venue during the event time</li>
              <li>Show this email or your confirmation ID at the VIP entrance</li>
              <li>Skip the line and enjoy your night!</li>
            </ol>
          </div>
          
          <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd;">
            <p style="color: #666; font-size: 14px;">
              Questions? Contact us at <a href="mailto:support@skipthelinebcn.com" style="color: #ff2d72;">support@skipthelinebcn.com</a>
            </p>
            <p style="color: #999; font-size: 12px;">
              SkipTheLine Barcelona - Premium Nightlife Access
            </p>
          </div>
        </div>
      `
    });

    if (error) {
      return NextResponse.json({ error }, { status: 400 });
    }

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('Error sending email:', error);
    return NextResponse.json({ error: 'Failed to send email' }, { status: 500 });
  }
} 
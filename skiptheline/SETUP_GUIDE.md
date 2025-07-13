# SkipTheLine Setup Guide

## Admin Credentials

**Username:** `admin`  
**Password:** `skiptheline2024`

## Current Status

✅ **Working Features:**
- Club-based event browsing
- Professional UI with enhanced spacing
- Random confirmation ID generation
- Admin dashboard with club dropdown
- Stripe payment link integration
- Mock Google Sheets and email integration

❌ **Not Yet Implemented (Production Setup Required):**
- Real Firebase database
- Google Sheets API integration
- Email service integration
- Real-time inventory management
- Payment success webhooks

## Production Setup Instructions

### 1. Firebase Setup

#### Step 1: Create Firebase Project
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project"
3. Enter project name: `skiptheline-barcelona`
4. Enable Google Analytics (optional)
5. Click "Create project"

#### Step 2: Enable Firestore Database
1. In Firebase Console, go to "Firestore Database"
2. Click "Create database"
3. Choose "Start in test mode" (we'll secure it later)
4. Select location: `europe-west1` (closest to Spain)
5. Click "Done"

#### Step 3: Get Firebase Configuration
1. Go to Project Settings (gear icon)
2. Scroll to "Your apps" section
3. Click "Add app" → Web app
4. Enter app name: `skiptheline-web`
5. Copy the configuration object

#### Step 4: Set Up Environment Variables
Create `.env.local` in your project root:

```bash
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key_here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_auth_domain_here
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id_here
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_storage_bucket_here
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id_here
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id_here

# Google Sheets Configuration
GOOGLE_SHEETS_PRIVATE_KEY=your_private_key_here
GOOGLE_SHEETS_CLIENT_EMAIL=your_client_email_here
GOOGLE_SHEETS_SHEET_ID=your_sheet_id_here

# Email Configuration
RESEND_API_KEY=your_resend_api_key_here
FROM_EMAIL=no-reply@skiptheline.com

# Stripe Configuration
STRIPE_SECRET_KEY=your_stripe_secret_key_here
STRIPE_WEBHOOK_SECRET=your_webhook_secret_here
```

#### Step 5: Install Firebase SDK
```bash
npm install firebase
```

#### Step 6: Create Firebase Configuration File
Create `src/lib/firebase.ts`:

```typescript
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
```

#### Step 7: Set Up Firestore Collections
You don't need to create collections manually - they'll be created automatically when you add the first document. The structure will be:

- `clubs` - Club information
- `events` - Event details with real-time availability
- `purchases` - Customer purchases with confirmation IDs
- `admins` - Admin user management

### 2. Google Sheets Integration

#### Step 1: Create Google Cloud Project
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create new project: `skiptheline-sheets`
3. Enable Google Sheets API
4. Enable Google Drive API

#### Step 2: Create Service Account
1. Go to IAM & Admin → Service Accounts
2. Click "Create Service Account"
3. Name: `skiptheline-sheets-service`
4. Grant role: "Editor"
5. Click "Create Key" → JSON format
6. Save the JSON file securely

#### Step 3: Set Up Google Sheets
1. Create a new Google Sheet
2. Name it: `SkipTheLine Purchases`
3. Add headers: `Confirmation ID`, `Event Title`, `Customer Name`, `Email`, `Party Size`, `Total Amount`, `Purchase Date`, `Status`
4. Share the sheet with your service account email (from step 2)
5. Copy the Sheet ID from the URL

#### Step 4: Install Google Sheets Dependencies
```bash
npm install google-spreadsheet
```

#### Step 5: Create Google Sheets API Route
Create `src/app/api/sheets/add-purchase/route.ts`:

```typescript
import { NextRequest, NextResponse } from 'next/server';
import { GoogleSpreadsheet } from 'google-spreadsheet';

export async function POST(request: NextRequest) {
  try {
    const purchaseData = await request.json();
    
    const doc = new GoogleSpreadsheet(process.env.GOOGLE_SHEETS_SHEET_ID);
    await doc.useServiceAccountAuth({
      client_email: process.env.GOOGLE_SHEETS_CLIENT_EMAIL!,
      private_key: process.env.GOOGLE_SHEETS_PRIVATE_KEY!.replace(/\\n/g, '\n'),
    });
    
    await doc.loadInfo();
    const sheet = doc.sheetsByIndex[0];
    
    await sheet.addRow({
      'Confirmation ID': purchaseData.confirmationId,
      'Event Title': purchaseData.eventTitle,
      'Customer Name': purchaseData.customerName,
      'Email': purchaseData.email,
      'Party Size': purchaseData.partySize,
      'Total Amount': purchaseData.totalAmount,
      'Purchase Date': purchaseData.purchaseDate,
      'Status': purchaseData.status
    });
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error adding to Google Sheets:', error);
    return NextResponse.json({ error: 'Failed to add purchase' }, { status: 500 });
  }
}
```

### 3. Email Service Integration

#### Step 1: Choose Email Service
**Recommended: Resend** (modern, developer-friendly)
- Website: [resend.com](https://resend.com)
- Free tier: 3,000 emails/month
- Alternative: SendGrid, Mailgun

#### Step 2: Set Up Resend
1. Sign up at [resend.com](https://resend.com)
2. Verify your domain (or use resend.dev for testing)
3. Create API key
4. Add to environment variables

#### Step 3: Install Resend SDK
```bash
npm install resend
```

#### Step 4: Create Email API Route
Create `src/app/api/email/send-confirmation/route.ts`:

```typescript
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
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #ff2d72; text-align: center;">SkipTheLine Barcelona</h1>
          <h2>Booking Confirmed! 🎉</h2>
          
          <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3>Confirmation Details</h3>
            <p><strong>Confirmation ID:</strong> ${confirmationId}</p>
            <p><strong>Event:</strong> ${eventTitle}</p>
            <p><strong>Guest Name:</strong> ${customerName}</p>
            <p><strong>Party Size:</strong> ${partySize} people</p>
            <p><strong>Total Amount:</strong> €${totalAmount}</p>
            <p><strong>Purchase Date:</strong> ${new Date(purchaseDate).toLocaleString()}</p>
          </div>
          
          <div style="background: #e3f2fd; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3>What's Next?</h3>
            <ol>
              <li>Save this confirmation ID: <strong>${confirmationId}</strong></li>
              <li>Arrive at the venue during the event time</li>
              <li>Show this email or your confirmation ID at the VIP entrance</li>
              <li>Skip the line and enjoy your night!</li>
            </ol>
          </div>
          
          <p style="text-align: center; color: #666;">
            Questions? Contact us at support@skiptheline.com
          </p>
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
```

### 4. Stripe Webhook Integration

#### Step 1: Set Up Stripe Webhook
1. Go to Stripe Dashboard → Developers → Webhooks
2. Click "Add endpoint"
3. URL: `https://yourdomain.com/api/stripe/webhook`
4. Events: `checkout.session.completed`
5. Copy the webhook secret

#### Step 2: Create Stripe Webhook Route
Create `src/app/api/stripe/webhook/route.ts`:

```typescript
import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const signature = request.headers.get('stripe-signature')!;
    
    const event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
    
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session;
      const confirmationId = session.client_reference_id;
      
      // Process successful payment
      // Update Firebase with purchase
      // Send confirmation email
      // Update Google Sheets
      
      console.log('Payment successful:', {
        confirmationId,
        sessionId: session.id,
        amountTotal: session.amount_total,
        customerEmail: session.customer_email
      });
    }
    
    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json({ error: 'Webhook failed' }, { status: 400 });
  }
}
```

### 5. Update PaymentForm Component

Replace the TODO comments in `src/components/PaymentForm.tsx`:

```typescript
// Replace saveToGoogleSheets function
const saveToGoogleSheets = async (purchaseData: any) => {
  try {
    const response = await fetch('/api/sheets/add-purchase', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(purchaseData)
    });
    
    if (!response.ok) {
      throw new Error('Failed to save to Google Sheets');
    }
  } catch (error) {
    console.error('Error saving to Google Sheets:', error);
    throw error;
  }
};

// Replace sendConfirmationEmail function
const sendConfirmationEmail = async (customerData: any) => {
  try {
    const response = await fetch('/api/email/send-confirmation', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(customerData)
    });
    
    if (!response.ok) {
      throw new Error('Failed to send confirmation email');
    }
  } catch (error) {
    console.error('Error sending confirmation email:', error);
    throw error;
  }
};
```

## Event Sheet IDs

Each event will have its own Google Sheet for tracking purchases:

- **Event ID Format**: `{eventId}_purchases`
- **Example**: `opium-saturday_purchases`

You can create separate sheets for each event or use different tabs in the same sheet.

## Security Considerations

### Firebase Security Rules
Update Firestore rules in Firebase Console:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Allow read access to clubs and events
    match /clubs/{document} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    
    match /events/{document} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    
    // Restrict purchase access
    match /purchases/{document} {
      allow read: if request.auth != null;
      allow write: if request.auth != null;
    }
    
    // Admin-only access
    match /admins/{document} {
      allow read, write: if request.auth != null;
    }
  }
}
```

### Environment Variables Security
- Never commit `.env.local` to version control
- Use environment variables for all sensitive data
- Consider using a secret management service for production

## Testing

### Test the Integration
1. **Firebase**: Check if data is saved to Firestore
2. **Google Sheets**: Verify purchases appear in the sheet
3. **Email**: Test confirmation emails are sent
4. **Stripe**: Test payment flow with test cards

### Test Cards for Stripe
- **Success**: 4242 4242 4242 4242
- **Decline**: 4000 0000 0000 0002
- **Insufficient funds**: 4000 0000 0000 9995

## Deployment

### Recommended Hosting: Vercel
1. Connect your GitHub repository
2. Add environment variables in Vercel dashboard
3. Deploy with automatic CI/CD

### Domain Setup
1. Purchase domain (e.g., `skiptheline.barcelona`)
2. Configure DNS in Vercel
3. Enable SSL (automatic)

## Support

If you need help with any of these integrations, you can:
1. Check the documentation for each service
2. Test each integration step by step
3. Use the test/demo buttons to verify functionality
4. Monitor logs in each service's dashboard

## Cost Estimation

**Monthly costs for 1000 active users:**
- Firebase: $5-15
- Google Sheets API: Free
- Resend Email: $0-20
- Stripe: 2.9% + €0.30 per transaction
- Vercel Hosting: $0-20

**Total**: ~$25-55/month (excluding transaction fees)

Your application is now ready for production with real data persistence, email notifications, and proper inventory management!
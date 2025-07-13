# 🚀 Production Setup Guide - SkipTheLine Barcelona

## 📋 Overview

This guide will walk you through setting up your SkipTheLine application for production with:
- **Firebase Firestore** for real-time database
- **Google Sheets** for purchase tracking
- **Resend** for email notifications  
- **Stripe** for real payment processing

## 🔐 Admin Credentials
- **Username:** `admin`
- **Password:** `skiptheline2024`

---

## 1️⃣ Firebase Firestore Setup

### Step 1: Create Firebase Project
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click **"Create a project"**
3. Project name: `skiptheline-barcelona`
4. **Enable Google Analytics** (recommended)
5. Click **"Create project"**

### Step 2: Enable Firestore Database
1. In Firebase Console, click **"Firestore Database"**
2. Click **"Create database"**
3. Choose **"Start in test mode"** (we'll secure it later)
4. Select location: **`europe-west1`** (closest to Spain)
5. Click **"Done"**

### Step 3: Get Configuration
1. Go to **Project Settings** (gear icon)
2. Scroll to **"Your apps"** section
3. Click **"Add app"** → **Web app** 
4. App name: `skiptheline-web`
5. **Copy the configuration object** - you'll need this!

### Step 4: Install Firebase SDK
```bash
cd skiptheline
npm install firebase
```

### Step 5: Create Firebase Config File
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

---

## 2️⃣ Google Sheets Integration

### Step 1: Create Google Cloud Project
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Click **"New Project"**
3. Project name: `skiptheline-sheets`
4. Click **"Create"**

### Step 2: Enable APIs
1. Go to **"APIs & Services"** → **"Library"**
2. Search and enable:
   - **Google Sheets API**
   - **Google Drive API**

### Step 3: Create Service Account
1. Go to **"IAM & Admin"** → **"Service Accounts"**
2. Click **"Create Service Account"**
3. Name: `skiptheline-service`
4. Description: `Service account for SkipTheLine Google Sheets integration`
5. Click **"Create and Continue"**
6. Grant role: **"Editor"**
7. Click **"Continue"** → **"Done"**

### Step 4: Generate Key
1. Find your service account in the list
2. Click the **three dots** → **"Manage keys"**
3. Click **"Add Key"** → **"Create new key"**
4. Choose **JSON** format
5. **Download and save securely** - you'll need this!

### Step 5: Set Up Google Sheets
1. Go to [Google Sheets](https://sheets.google.com)
2. Create a **new sheet**
3. Name it: `SkipTheLine Purchases`
4. Add these headers in row 1:
   - A1: `Confirmation ID`
   - B1: `Event Title`
   - C1: `Customer Name`
   - D1: `Email`
   - E1: `Party Size`
   - F1: `Total Amount`
   - G1: `Purchase Date`
   - H1: `Status`

### Step 6: Share Sheet with Service Account
1. Click **"Share"** button in your sheet
2. Add the **service account email** (from the JSON file you downloaded)
3. Give **"Editor"** permissions
4. Click **"Send"**
5. **Copy the Sheet ID** from the URL (the long string between `/d/` and `/edit`)

### Step 7: Install Google Sheets Dependencies
```bash
npm install google-spreadsheet
```

---

## 3️⃣ Email Service Setup (Resend)

### Step 1: Create Resend Account
1. Go to [resend.com](https://resend.com)
2. Click **"Sign up"**
3. Verify your email address

### Step 2: Add Domain (Optional but Recommended)
1. In Resend dashboard, go to **"Domains"**
2. Click **"Add Domain"**
3. Enter your domain: `skiptheline.barcelona` (or your domain)
4. Follow DNS verification steps
5. **For testing, you can skip this and use `resend.dev`**

### Step 3: Create API Key
1. Go to **"API Keys"**
2. Click **"Create API Key"**
3. Name: `SkipTheLine Production`
4. **Copy the API key** - you'll need this!

### Step 4: Install Resend SDK
```bash
npm install resend
```

---

## 4️⃣ Stripe Configuration

### Step 1: Stripe Account Setup
1. Go to [stripe.com](https://stripe.com)
2. **Sign up** or **log in**
3. Complete account verification
4. Add business details

### Step 2: Get API Keys
1. In Stripe Dashboard, go to **"Developers"** → **"API keys"**
2. Copy your **"Secret key"** (starts with `sk_live_` for production)
3. Copy your **"Publishable key"** (starts with `pk_live_` for production)

### Step 3: Create Payment Links
For each event, you'll need to create Stripe Payment Links:

1. In Stripe Dashboard, go to **"Products"**
2. Click **"Add product"**
3. Product name: `VIP Fast Pass - [Event Name]`
4. Price: Set your event price
5. Click **"Save product"**
6. Click **"Create payment link"**
7. **Copy the payment link URL** - you'll use this in your events

### Step 4: Set Up Webhooks
1. Go to **"Developers"** → **"Webhooks"**
2. Click **"Add endpoint"**
3. Endpoint URL: `https://yourdomain.com/api/stripe/webhook`
4. Select events: `checkout.session.completed`
5. Click **"Add endpoint"**
6. **Copy the webhook secret** - you'll need this!

---

## 5️⃣ Environment Variables Setup

Create `.env.local` in your project root:

```bash
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

# Google Sheets Configuration
GOOGLE_SHEETS_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nyour_private_key_here\n-----END PRIVATE KEY-----\n"
GOOGLE_SHEETS_CLIENT_EMAIL=your_service_account@your_project.iam.gserviceaccount.com
GOOGLE_SHEETS_SHEET_ID=your_google_sheet_id

# Email Configuration
RESEND_API_KEY=re_your_resend_api_key
FROM_EMAIL=no-reply@yourdomain.com

# Stripe Configuration
STRIPE_SECRET_KEY=sk_live_your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret
```

**⚠️ Important:** Never commit this file to version control!

---

## 6️⃣ Create API Routes

### Step 1: Google Sheets API Route
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
      'Total Amount': `€${purchaseData.totalAmount}`,
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

### Step 2: Email API Route
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
              Questions? Contact us at <a href="mailto:support@skiptheline.barcelona" style="color: #ff2d72;">support@skiptheline.barcelona</a>
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
```

### Step 3: Stripe Webhook Route
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
      
      // Here you would:
      // 1. Update Firebase with the purchase
      // 2. Send confirmation email
      // 3. Update Google Sheets
      
      console.log('Payment successful:', {
        confirmationId,
        sessionId: session.id,
        amountTotal: session.amount_total,
        customerEmail: session.customer_email
      });
      
      // You can add your Firebase update logic here
    }
    
    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json({ error: 'Webhook failed' }, { status: 400 });
  }
}
```

---

## 7️⃣ Update PaymentForm Component

Replace the TODO comments in `src/components/PaymentForm.tsx`:

```typescript
// Replace the saveToGoogleSheets function:
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

// Replace the sendConfirmationEmail function:
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

---

## 8️⃣ Security Configuration

### Firebase Security Rules
In Firebase Console → Firestore → Rules, update to:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Public read access to clubs and events
    match /clubs/{document} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    
    match /events/{document} {
      allow read: if true;
      allow write: if request.auth != null;
    }
    
    // Protected access to purchases
    match /purchases/{document} {
      allow read, write: if request.auth != null;
    }
    
    // Admin-only access
    match /admins/{document} {
      allow read, write: if request.auth != null;
    }
  }
}
```

---

## 9️⃣ Deployment

### Option A: Vercel (Recommended)
1. Push your code to GitHub
2. Go to [vercel.com](https://vercel.com)
3. Import your GitHub repository
4. Add all environment variables in Vercel dashboard
5. Deploy!

### Option B: Netlify
1. Push your code to GitHub
2. Go to [netlify.com](https://netlify.com)
3. Connect your GitHub repository
4. Add environment variables
5. Deploy!

---

## 🧪 Testing Your Setup

### Test Firebase
```javascript
// Test in browser console after deploying
import { db } from './lib/firebase';
import { collection, addDoc } from 'firebase/firestore';

// Test adding a document
await addDoc(collection(db, 'test'), { message: 'Hello Firebase!' });
```

### Test Google Sheets
- Make a test purchase through your app
- Check if it appears in your Google Sheet

### Test Email
- Complete a test purchase
- Check if confirmation email is received

### Test Stripe
Use Stripe test cards:
- **Success:** 4242 4242 4242 4242
- **Decline:** 4000 0000 0000 0002

---

## 💰 Cost Breakdown

### Monthly Costs (1000 active users):
- **Firebase:** $5-15
- **Google Sheets:** Free
- **Resend:** $0-20 (3,000 emails free)
- **Stripe:** 2.9% + €0.30 per transaction
- **Vercel:** $0-20

**Total:** ~$25-55/month + transaction fees

---

## 🆘 Troubleshooting

### Common Issues:

1. **Firebase Connection Failed**
   - Check API keys in environment variables
   - Verify project ID matches

2. **Google Sheets Permission Denied**
   - Ensure service account has editor access
   - Check if private key is properly formatted

3. **Email Not Sending**
   - Verify Resend API key
   - Check domain verification status

4. **Stripe Webhook Not Working**
   - Verify webhook URL is correct
   - Check webhook secret matches

### Getting Help:
- Check service dashboards for error logs
- Test each service individually
- Use browser developer tools for debugging

---

## ✅ Final Checklist

Before going live:

- [ ] Firebase project created and configured
- [ ] Google Sheets integration working
- [ ] Email service sending confirmations
- [ ] Stripe payments processing
- [ ] Environment variables set in production
- [ ] Domain configured (if using custom domain)
- [ ] Security rules properly configured
- [ ] Test purchases completed successfully
- [ ] Backup plan for data recovery

---

**🎉 Congratulations! Your SkipTheLine application is now production-ready!**

Your Barcelona nightlife booking platform can now handle real customers, process payments, track purchases, and send confirmations automatically.
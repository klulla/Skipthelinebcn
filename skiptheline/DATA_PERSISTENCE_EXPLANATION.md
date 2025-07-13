# Data Persistence & State Management

## Current System Overview

### How Data is Currently Stored
The SkipTheLine application currently uses **in-memory mock data** for all information:

- **Events**: Stored in `src/data/mockData.ts` as `mockEvents` array
- **Clubs**: Stored in `src/data/mockData.ts` as `mockClubs` array  
- **Purchases**: Stored in `src/data/mockData.ts` as `mockPurchases` array
- **Admin Authentication**: Simple username/password in `adminCredentials`

### Current State Management
- **React State**: All data is managed through React's `useState` hooks in individual components
- **No Persistence**: Data resets on page refresh or app restart
- **Local Storage**: Only used for admin login sessions (`adminLoggedIn` flag)

### What This Means for Ticket Availability
❌ **Current Issues:**
- Ticket counts and availability are NOT saved between sessions
- Multiple users can theoretically book the same spots
- No real inventory management
- Data is lost on server restart
- No synchronization between different users

## Problems with Current Setup

### 1. No Real Inventory Control
- `event.availability` is just a number in memory
- No prevention of overselling
- No real-time updates across users

### 2. No Data Persistence
- All purchases are lost on refresh
- Event modifications don't persist
- Club data changes are temporary

### 3. No Multi-User Support
- No synchronization between different browsers/users
- Race conditions possible during booking

## Recommended Solution: Firebase Integration

### Why Firebase?
- **Real-time Database**: Instant updates across all users
- **Authentication**: Built-in user management
- **Serverless**: No backend server management needed
- **Scalable**: Handles growth automatically
- **Stripe Integration**: Works well with payment processing

### Firebase Database Structure
```javascript
// Firestore Collections
{
  clubs: {
    clubId: {
      id: string,
      name: string,
      location: string,
      description: string,
      imageUrl: string,
      capacity: number,
      type: string,
      amenities: array,
      status: string,
      createdAt: timestamp
    }
  },
  
  events: {
    eventId: {
      id: string,
      title: string,
      clubId: string,
      date: string,
      time: string,
      price: number,
      description: string,
      maxTickets: number,
      soldTickets: number,
      availability: number, // Real-time updated
      imageUrl: string,
      status: string,
      stripePaymentLink: string,
      createdAt: timestamp,
      updatedAt: timestamp
    }
  },
  
  purchases: {
    purchaseId: {
      id: string,
      eventId: string,
      guestName: string,
      email: string,
      partySize: number,
      purchaseDate: timestamp,
      status: string,
      totalAmount: number,
      stripePaymentId: string,
      confirmationCode: string
    }
  },
  
  admins: {
    adminId: {
      uid: string,
      email: string,
      role: string,
      createdAt: timestamp
    }
  }
}
```

### Implementation Steps

#### 1. Install Firebase
```bash
npm install firebase
```

#### 2. Firebase Configuration
```javascript
// src/lib/firebase.ts
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  // Your Firebase config
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
```

#### 3. Real-time Availability Updates
```javascript
// Real-time listener for event availability
import { onSnapshot, doc } from 'firebase/firestore';

const unsubscribe = onSnapshot(doc(db, 'events', eventId), (doc) => {
  if (doc.exists()) {
    const eventData = doc.data();
    setAvailability(eventData.availability);
  }
});
```

#### 4. Atomic Ticket Purchase
```javascript
// Prevent overselling with transactions
import { runTransaction } from 'firebase/firestore';

const purchaseTickets = async (eventId, partySize) => {
  await runTransaction(db, async (transaction) => {
    const eventDoc = await transaction.get(doc(db, 'events', eventId));
    const currentAvailability = eventDoc.data().availability;
    
    if (currentAvailability >= partySize) {
      transaction.update(doc(db, 'events', eventId), {
        availability: currentAvailability - partySize,
        soldTickets: eventDoc.data().soldTickets + partySize
      });
    } else {
      throw new Error('Not enough tickets available');
    }
  });
};
```

### Additional Integrations

#### Google Sheets Integration
```javascript
// src/lib/googleSheets.ts
import { GoogleSpreadsheet } from 'google-spreadsheet';

const addPurchaseToSheet = async (purchaseData) => {
  const doc = new GoogleSpreadsheet(process.env.GOOGLE_SHEET_ID);
  await doc.useServiceAccountAuth({
    client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
    private_key: process.env.GOOGLE_PRIVATE_KEY,
  });
  
  const sheet = doc.sheetsByIndex[0];
  await sheet.addRow(purchaseData);
};
```

#### Email Service Integration
```javascript
// src/lib/email.ts
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

const sendConfirmationEmail = async (purchase) => {
  await resend.emails.send({
    from: 'no-reply@skiptheline.com',
    to: purchase.email,
    subject: 'Ticket Confirmation',
    html: `<h1>Your tickets for ${purchase.eventTitle}</h1>...`
  });
};
```

## Migration Plan

### Phase 1: Firebase Setup
1. Create Firebase project
2. Set up Firestore database
3. Configure authentication
4. Migrate mock data to Firestore

### Phase 2: Real-time Features
1. Implement real-time availability updates
2. Add transaction-based ticket purchasing
3. Set up event synchronization

### Phase 3: Enhanced Features
1. Add Google Sheets integration
2. Implement email notifications
3. Add user authentication
4. Create admin dashboard with real data

### Phase 4: Production Optimization
1. Add caching strategies
2. Implement offline support
3. Add analytics tracking
4. Set up monitoring and alerts

## Cost Considerations

### Firebase Pricing
- **Free Tier**: 1GB storage, 50K reads/day, 20K writes/day
- **Pay-as-you-go**: Very affordable for small to medium apps
- **Predictable**: Can set budget alerts

### Estimated Monthly Costs (1000 active users)
- **Firebase**: $5-15/month
- **Google Sheets API**: Free (within limits)
- **Email Service**: $5-10/month
- **Total**: ~$10-25/month

## Conclusion

The current mock data system works for development but needs Firebase integration for production. This will provide:

✅ **Real inventory management**  
✅ **Data persistence**  
✅ **Multi-user synchronization**  
✅ **Scalability**  
✅ **Real-time updates**  
✅ **Professional backend**

The migration to Firebase is essential for a production-ready nightlife booking platform where accurate ticket availability and reliable data persistence are crucial for business success.
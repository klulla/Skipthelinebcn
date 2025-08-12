import { db } from './firebase';
import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  getDocs, 
  getDoc,
  query, 
  orderBy,
  where,
  serverTimestamp,
  increment,
  writeBatch
} from 'firebase/firestore';
import { Event, Purchase, Club } from '@/types';

// Collections
export const eventsCollection = collection(db, 'events');
export const purchasesCollection = collection(db, 'purchases');
export const clubsCollection = collection(db, 'clubs');

// Event operations
export const createEvent = async (eventData: Omit<Event, 'id'>) => {
  try {
    console.log('Firebase createEvent called with:', eventData);
    
    // Ensure all required fields are present
    const eventToCreate = {
      ...eventData,
      soldTickets: eventData.soldTickets || 0,
      availability: eventData.availability || eventData.maxTickets,
      status: eventData.status || 'active',
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    };
    
    console.log('Event data to save:', eventToCreate);
    
    const docRef = await addDoc(eventsCollection, eventToCreate);
    
    console.log('Firebase document created with ID:', docRef.id);
    
    const result = { id: docRef.id, ...eventToCreate };
    console.log('Returning event:', result);
    return result;
  } catch (error) {
    console.error('Firebase createEvent error:', error);
    console.error('Error details:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      code: (error as any)?.code,
      stack: error instanceof Error ? error.stack : undefined
    });
    throw error;
  }
};

export const getEvent = async (eventId: string) => {
  try {
    const eventRef = doc(db, 'events', eventId);
    const eventDoc = await getDoc(eventRef);
    
    if (eventDoc.exists()) {
      return { id: eventDoc.id, ...eventDoc.data() } as Event;
    } else {
      return null;
    }
  } catch (error) {
    console.error('Error getting event:', error);
    throw error;
  }
};

export const updateEvent = async (eventId: string, eventData: Partial<Event>) => {
  try {
    const eventRef = doc(db, 'events', eventId);
    await updateDoc(eventRef, {
      ...eventData,
      updatedAt: serverTimestamp()
    });
    return { id: eventId, ...eventData };
  } catch (error) {
    console.error('Error updating event:', error);
    throw error;
  }
};

export const deleteEvent = async (eventId: string) => {
  try {
    const eventRef = doc(db, 'events', eventId);
    await deleteDoc(eventRef);
    return true;
  } catch (error) {
    console.error('Error deleting event:', error);
    throw error;
  }
};

export const getEvents = async () => {
  try {
    const q = query(eventsCollection, orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    const events: Event[] = [];
    querySnapshot.forEach((doc) => {
      events.push({ id: doc.id, ...doc.data() } as Event);
    });
    return events;
  } catch (error) {
    console.error('Error getting events:', error);
    throw error;
  }
};

// Purchase operations with pass updates
export const createPurchase = async (purchaseData: Omit<Purchase, 'id'>) => {
  try {
    const batch = writeBatch(db);
    
    // Add purchase document
    const purchaseRef = doc(purchasesCollection);
    batch.set(purchaseRef, {
      ...purchaseData,
      createdAt: serverTimestamp()
    });
    
    // Update event availability and sold tickets
    const eventRef = doc(db, 'events', purchaseData.eventId);
    batch.update(eventRef, {
      soldTickets: increment(purchaseData.partySize),
      availability: increment(-purchaseData.partySize),
      updatedAt: serverTimestamp()
    });
    
    await batch.commit();
    
    return { id: purchaseRef.id, ...purchaseData };
  } catch (error) {
    console.error('Error creating purchase:', error);
    throw error;
  }
};

export const getPurchases = async () => {
  try {
    const q = query(purchasesCollection, orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    const purchases: Purchase[] = [];
    querySnapshot.forEach((doc) => {
      purchases.push({ id: doc.id, ...doc.data() } as Purchase);
    });
    return purchases;
  } catch (error) {
    console.error('Error getting purchases:', error);
    throw error;
  }
};

export const getPurchasesByEvent = async (eventId: string) => {
  try {
    const q = query(
      purchasesCollection, 
      where('eventId', '==', eventId),
      orderBy('createdAt', 'desc')
    );
    const querySnapshot = await getDocs(q);
    const purchases: Purchase[] = [];
    querySnapshot.forEach((doc) => {
      purchases.push({ id: doc.id, ...doc.data() } as Purchase);
    });
    return purchases;
  } catch (error) {
    console.error('Error getting purchases by event:', error);
    throw error;
  }
};

// Club operations
export const createClub = async (clubData: Omit<Club, 'id'>) => {
  try {
    const docRef = await addDoc(clubsCollection, {
      ...clubData,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    return { id: docRef.id, ...clubData };
  } catch (error) {
    console.error('Error creating club:', error);
    throw error;
  }
};

export const updateClub = async (clubId: string, clubData: Partial<Club>) => {
  try {
    const clubRef = doc(db, 'clubs', clubId);
    await updateDoc(clubRef, {
      ...clubData,
      updatedAt: serverTimestamp()
    });
    return { id: clubId, ...clubData };
  } catch (error) {
    console.error('Error updating club:', error);
    throw error;
  }
};

export const deleteClub = async (clubId: string) => {
  try {
    const clubRef = doc(db, 'clubs', clubId);
    await deleteDoc(clubRef);
    return true;
  } catch (error) {
    console.error('Error deleting club:', error);
    throw error;
  }
};

export const getClubs = async () => {
  try {
    const q = query(clubsCollection, orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    const clubs: Club[] = [];
    querySnapshot.forEach((doc) => {
      clubs.push({ id: doc.id, ...doc.data() } as Club);
    });
    return clubs;
  } catch (error) {
    console.error('Error getting clubs:', error);
    throw error;
  }
};

export const getClubsByCity = async (city: string) => {
  try {
    const q = query(
      clubsCollection, 
      where('city', '==', city),
      where('status', '==', 'active'),
      orderBy('createdAt', 'desc')
    );
    const querySnapshot = await getDocs(q);
    const clubs: Club[] = [];
    querySnapshot.forEach((doc) => {
      clubs.push({ id: doc.id, ...doc.data() } as Club);
    });
    return clubs;
  } catch (error) {
    console.error('Error getting clubs by city:', error);
    throw error;
  }
};

// Sales analytics
export const getSalesAnalytics = async () => {
  try {
    const [events, purchases] = await Promise.all([
      getEvents(),
      getPurchases()
    ]);
    
    // Calculate revenue by event
    const revenueByEvent = events.map(event => {
      const eventPurchases = purchases.filter(p => p.eventId === event.id);
      const totalRevenue = eventPurchases.reduce((sum, p) => sum + p.totalAmount, 0);
      const totalTickets = eventPurchases.reduce((sum, p) => sum + p.partySize, 0);
      
      return {
        eventId: event.id,
        eventTitle: event.title,
        totalRevenue,
        totalTickets,
        averageTicketPrice: totalTickets > 0 ? totalRevenue / totalTickets : 0
      };
    });
    
    // Calculate overall stats
    const totalRevenue = purchases.reduce((sum, p) => sum + p.totalAmount, 0);
    const totalTickets = purchases.reduce((sum, p) => sum + p.partySize, 0);
    
    return {
      totalRevenue,
      totalTickets,
      averageTicketPrice: totalTickets > 0 ? totalRevenue / totalTickets : 0,
      revenueByEvent,
      topEvents: revenueByEvent
        .sort((a, b) => b.totalRevenue - a.totalRevenue)
        .slice(0, 5)
    };
  } catch (error) {
    console.error('Error getting sales analytics:', error);
    throw error;
  }
}; 
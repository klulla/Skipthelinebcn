export interface Club {
  id: string;
  name: string;
  city: string; // New field for city-based organization
  location: string;
  description: string;
  imageUrl: string;
  capacity: number;
  type: 'nightclub' | 'rooftop' | 'beach' | 'underground';
  amenities: string[];
  status: 'active' | 'inactive';
}

export interface Event {
  id: string;
  title: string;
  clubId: string; // Changed from clubName to clubId
  date: string;
  time: string;
  price: number;
  description: string;
  // Removed arrivalWindow
  maxTickets: number;
  soldTickets: number;
  imageUrl: string;
  status: 'active' | 'sold-out' | 'hidden';
  stripePaymentLink: string;
  lockTime?: string; // Time when ticket sales stop (ISO string)
  availability: number; // Available spots remaining (maxTickets - soldTickets but managed separately)
}

export interface Purchase {
  id: string;
  eventId: string;
  guestName: string;
  email: string;
  partySize: number;
  purchaseDate: string;
  status: 'confirmed' | 'used' | 'cancelled';
  totalAmount: number;
  stripePaymentId?: string;
  confirmationId?: string;
}

export interface Admin {
  username: string;
  password: string;
}

export interface FAQ {
  question: string;
  answer: string;
}

export interface Testimonial {
  quote: string;
  author: string;
}

export interface EventFormData {
  title: string;
  clubId: string; // Changed from clubName to clubId
  date: string;
  time: string;
  price: number;
  description: string;
  // Removed arrivalWindow
  maxTickets: number;
  imageUrl: string;
  lockTime?: string; // Time when ticket sales stop (ISO string)
  availability: number;
}

export interface GoogleSheetsData {
  eventName: string;
  customerName: string;
  email: string;
  partySize: number;
  totalAmount: number;
  purchaseDate: string;
  eventDate: string;
  status: string;
}
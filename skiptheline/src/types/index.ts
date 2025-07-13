export interface Event {
  id: string;
  title: string;
  clubName: string;
  date: string;
  time: string;
  price: number;
  description: string;
  arrivalWindow: string;
  maxTickets: number;
  soldTickets: number;
  imageUrl: string;
  status: 'active' | 'sold-out' | 'hidden';
  location: string;
  stripePaymentLink: string;
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
  clubName: string;
  date: string;
  time: string;
  price: number;
  description: string;
  arrivalWindow: string;
  maxTickets: number;
  imageUrl: string;
  location: string;
  stripePaymentLink: string;
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
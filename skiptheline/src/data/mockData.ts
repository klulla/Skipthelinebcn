import { Event, FAQ, Testimonial, Purchase } from '@/types';

export const mockEvents: Event[] = [
  {
    id: 'opium-saturday',
    title: 'Saturday @ Opium – Fast Pass',
    clubName: 'Opium Barcelona',
    date: '2024-01-20',
    time: '00:00',
    price: 45,
    description: 'Walk straight into the club through the express line. Avoid the wait and enjoy the ultimate Saturday night experience at one of Barcelona\'s most exclusive venues.',
    arrivalWindow: '12:00 AM - 1:30 AM',
    maxTickets: 30,
    soldTickets: 12,
    availability: 18,
    imageUrl: 'https://images.unsplash.com/photo-1566737236500-c8ac43014a8e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
    status: 'active',
    location: 'Passeig Marítim de la Barceloneta, 34, Barcelona',
    stripePaymentLink: 'https://buy.stripe.com/5kQ00k7Zyd4j42x4cL8k801'
  },
  {
    id: 'shoko-friday',
    title: 'Friday @ Shôko – Fast Pass',
    clubName: 'Shôko Barcelona',
    date: '2024-01-19',
    time: '23:30',
    price: 40,
    description: 'Skip the queue at Barcelona\'s premier beachfront nightclub. Experience the perfect blend of Asian cuisine and electrifying nightlife with guaranteed VIP line access.',
    arrivalWindow: '11:30 PM - 1:00 AM',
    maxTickets: 25,
    soldTickets: 8,
    availability: 17,
    imageUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
    status: 'active',
    location: 'Passeig Marítim de la Barceloneta, 36, Barcelona',
    stripePaymentLink: 'https://buy.stripe.com/5kQ00k7Zyd4j42x4cL8k801'
  }
];

export const faqs: FAQ[] = [
  {
    question: "Is this a table?",
    answer: "No. This is VIP line entry and full access to the club. You're purchasing fast-track entry, not a reserved table."
  },
  {
    question: "What if I come late?",
    answer: "Entry is only guaranteed during the listed time window. Late arrivals may not be honored, and no refunds will be provided."
  },
  {
    question: "Is it refundable?",
    answer: "All sales are final. No refunds for no-shows or late arrivals. Please ensure you can arrive within the specified time window."
  },
  {
    question: "Do I still wait?",
    answer: "You skip the general queue and enter via the VIP/express line. This significantly reduces your wait time but doesn't guarantee instant entry."
  },
  {
    question: "What's included in the price?",
    answer: "VIP line access and full entry to the club. Drinks and additional services are not included and must be purchased separately inside the venue."
  },
  {
    question: "Can I bring friends?",
    answer: "You can select your party size when purchasing. Each person in your group needs to be accounted for in the purchase."
  }
];

export const testimonials: Testimonial[] = [
  {
    quote: "We walked past a huge line — worth every euro.",
    author: "Maria, Madrid"
  },
  {
    quote: "Bought my pass on the way and was inside in 3 minutes.",
    author: "Alex, Barcelona"
  },
  {
    quote: "No stress, no guestlist. Just clean VIP access.",
    author: "Sophie, London"
  },
  {
    quote: "Best investment for a night out in Barcelona!",
    author: "Carlos, Valencia"
  }
];

export const mockPurchases: Purchase[] = [
  {
    id: 'purchase-1',
    eventId: 'opium-saturday',
    guestName: 'John Doe',
    email: 'john@example.com',
    partySize: 2,
    purchaseDate: '2024-01-15T10:30:00Z',
    status: 'confirmed',
    totalAmount: 90,
    stripePaymentId: 'pi_test_1234567890'
  },
  {
    id: 'purchase-2',
    eventId: 'shoko-friday',
    guestName: 'Jane Smith',
    email: 'jane@example.com',
    partySize: 4,
    purchaseDate: '2024-01-14T16:45:00Z',
    status: 'confirmed',
    totalAmount: 160,
    stripePaymentId: 'pi_test_0987654321'
  }
];

export const adminCredentials = {
  username: 'admin',
  password: 'skiptheline2024'
};
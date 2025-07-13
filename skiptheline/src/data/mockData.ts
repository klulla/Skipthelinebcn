import { Event, FAQ, Testimonial, Purchase, Club } from '@/types';

export const mockClubs: Club[] = [
  {
    id: 'opium-barcelona',
    name: 'Opium Barcelona',
    location: 'Passeig Marítim de la Barceloneta, 34, Barcelona',
    description: 'One of Barcelona\'s most exclusive beachfront nightclubs, featuring world-class DJs and stunning Mediterranean views.',
    imageUrl: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
    capacity: 800,
    type: 'nightclub',
    amenities: ['VIP Tables', 'Beachfront Terrace', 'Premium Sound System', 'International DJs'],
    status: 'active'
  },
  {
    id: 'shoko-barcelona',
    name: 'Shôko Barcelona',
    location: 'Passeig Marítim de la Barceloneta, 36, Barcelona',
    description: 'Premier Asian-inspired nightclub with sophisticated atmosphere and beachfront location.',
    imageUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
    capacity: 600,
    type: 'nightclub',
    amenities: ['Asian Cuisine', 'Cocktail Bar', 'Outdoor Terrace', 'Live Entertainment'],
    status: 'active'
  },
  {
    id: 'pacha-barcelona',
    name: 'Pacha Barcelona',
    location: 'Av. del Gregorio Marañón, 17, Barcelona',
    description: 'Legendary nightclub brand with cutting-edge music and unparalleled party atmosphere.',
    imageUrl: 'https://images.unsplash.com/photo-1566737236500-c8ac43014a8e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
    capacity: 1200,
    type: 'nightclub',
    amenities: ['Multiple Rooms', 'VIP Areas', 'World-Class DJs', 'Premium Bar Service'],
    status: 'active'
  },
  {
    id: 'eclipse-barcelona',
    name: 'Eclipse Barcelona',
    location: 'W Barcelona, Plaça de la Rosa dels Vents, 1, Barcelona',
    description: 'Sky-high rooftop club with panoramic city views and exclusive atmosphere.',
    imageUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
    capacity: 300,
    type: 'rooftop',
    amenities: ['Panoramic Views', 'Rooftop Terrace', 'Craft Cocktails', 'Exclusive Access'],
    status: 'active'
  },
  {
    id: 'cdlc-barcelona',
    name: 'CDLC Barcelona',
    location: 'Passeig Marítim de la Barceloneta, 32, Barcelona',
    description: 'Carpe Diem Lounge Club - sophisticated beachfront venue with restaurant and club.',
    imageUrl: 'https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
    capacity: 500,
    type: 'beach',
    amenities: ['Beachfront Location', 'Fine Dining', 'Cocktail Lounge', 'Live Music'],
    status: 'active'
  },
  {
    id: 'razzmatazz-barcelona',
    name: 'Razzmatazz Barcelona',
    location: 'Carrer dels Almogàvers, 122, Barcelona',
    description: 'Iconic underground club with multiple rooms and diverse music styles.',
    imageUrl: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
    capacity: 1000,
    type: 'underground',
    amenities: ['5 Different Rooms', 'Underground Atmosphere', 'Alternative Music', 'Live Concerts'],
    status: 'active'
  }
];

export const mockEvents: Event[] = [
  {
    id: 'opium-saturday',
    title: 'Saturday Night @ Opium – Fast Pass',
    clubId: 'opium-barcelona',
    date: '2024-01-20',
    time: '00:00',
    price: 45,
    description: 'Walk straight into the club through the express line. Avoid the wait and enjoy the ultimate Saturday night experience at one of Barcelona\'s most exclusive beachfront venues.',
    maxTickets: 30,
    soldTickets: 12,
    availability: 18,
    imageUrl: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
    status: 'active',
    stripePaymentLink: 'https://buy.stripe.com/5kQ00k7Zyd4j42x4cL8k801'
  },
  {
    id: 'shoko-friday',
    title: 'Friday Night @ Shôko – Fast Pass',
    clubId: 'shoko-barcelona',
    date: '2024-01-19',
    time: '23:30',
    price: 40,
    description: 'Skip the queue at Barcelona\'s premier beachfront nightclub. Experience the perfect blend of Asian cuisine and electrifying nightlife with guaranteed VIP line access.',
    maxTickets: 25,
    soldTickets: 8,
    availability: 17,
    imageUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
    status: 'active',
    stripePaymentLink: 'https://buy.stripe.com/5kQ00k7Zyd4j42x4cL8k801'
  },
  {
    id: 'pacha-saturday',
    title: 'Saturday @ Pacha – VIP Entry',
    clubId: 'pacha-barcelona',
    date: '2024-01-20',
    time: '01:00',
    price: 55,
    description: 'Experience the legendary Pacha Barcelona with VIP fast-track entry. Multiple rooms, world-class DJs, and the ultimate party atmosphere.',
    maxTickets: 40,
    soldTickets: 15,
    availability: 25,
    imageUrl: 'https://images.unsplash.com/photo-1566737236500-c8ac43014a8e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
    status: 'active',
    stripePaymentLink: 'https://buy.stripe.com/5kQ00k7Zyd4j42x4cL8k801'
  },
  {
    id: 'eclipse-friday',
    title: 'Friday @ Eclipse – Rooftop Access',
    clubId: 'eclipse-barcelona',
    date: '2024-01-19',
    time: '22:00',
    price: 70,
    description: 'Exclusive access to Barcelona\'s premier rooftop club with stunning city and sea views. Premium cocktails and sophisticated atmosphere.',
    maxTickets: 20,
    soldTickets: 18,
    availability: 2,
    imageUrl: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
    status: 'active',
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
# SkipTheLine - VIP Fast-Entry Barcelona Nightlife

A mobile-first, responsive web application for purchasing VIP fast-entry passes to Barcelona's hottest nightclubs. Skip the line, own the night.

![SkipTheLine Demo](https://images.unsplash.com/photo-1566737236500-c8ac43014a8e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80)

## 🌟 Features

### 🎟️ User Frontend
- **Homepage** with luxurious nightlife design featuring event listings
- **Event Detail Pages** with comprehensive information:
  - Club details, pricing, and availability
  - Arrival window and location information
  - Party size selector (1-4 people)
  - Interactive FAQs dropdown
  - Real customer testimonials
  - Secure purchase flow
- **Confirmation Page** with purchase details and arrival instructions
- **Mobile-first responsive design** with neon pink (#FF2D55) and teal (#2DD4BF) accents

### 🔐 Admin Dashboard
- **Secure login** system (Username: `admin`, Password: `skiptheline2024`)
- **Event Management**:
  - Add, edit, and delete events
  - Toggle event status (Active/Hidden)
  - Real-time ticket sales tracking
- **Sales Analytics**:
  - Revenue tracking and statistics
  - Guest list management
  - CSV export functionality
- **Overview Dashboard** with key metrics and recent activity

### 🎨 Design Features
- **Black background** with neon accent colors
- **Inter font family** for clean, modern typography
- **Neon glow effects** and smooth animations
- **Mobile-first** responsive layout
- **Custom scrollbar** styling
- **Gradient text effects** and dynamic hover states

## 🚀 Demo Events

1. **Saturday @ Opium – Fast Pass**
   - Price: €45 per person
   - Capacity: 30 tickets (12 sold)
   - Arrival Window: 12:00 AM - 1:30 AM

2. **Friday @ Shôko – Fast Pass**
   - Price: €40 per person
   - Capacity: 25 tickets (8 sold)
   - Arrival Window: 11:30 PM - 1:00 AM

## 🛠️ Technology Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS v4 with custom theme
- **Icons**: Lucide React
- **Build Tool**: Turbopack (Next.js)
- **State Management**: React Hooks (useState, useEffect)

## 🏗️ Project Structure

```
skiptheline/
├── src/
│   ├── app/
│   │   ├── admin/                 # Admin dashboard
│   │   ├── event/[id]/           # Dynamic event pages
│   │   ├── confirmation/         # Purchase confirmation
│   │   ├── layout.tsx            # Root layout
│   │   ├── page.tsx              # Homepage
│   │   └── globals.css           # Global styles & theme
│   ├── components/
│   │   ├── Header.tsx            # Navigation header
│   │   └── EventCard.tsx         # Event listing cards
│   ├── data/
│   │   └── mockData.ts           # Demo events & content
│   └── types/
│       └── index.ts              # TypeScript interfaces
```

## 🎯 Key User Flows

### Customer Purchase Flow
1. Browse events on homepage
2. Click "Get Pass" on desired event
3. Review event details, FAQs, and testimonials
4. Select party size (1-4 people)
5. Click "Buy Fast Pass"
6. View confirmation with arrival instructions

### Admin Management Flow
1. Login to admin dashboard
2. View overview statistics and recent sales
3. Manage events (add/edit/delete/toggle status)
4. Export guest lists as CSV
5. Monitor sales performance

## 🔧 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd skiptheline
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   ```
   http://localhost:3000
   ```

### Admin Access
- URL: `http://localhost:3000/admin`
- Username: `admin`
- Password: `skiptheline2024`

## 📱 Mobile-First Design

The application is built with a mobile-first approach:
- **Responsive grid layouts** that adapt from 1 column on mobile to multi-column on desktop
- **Touch-friendly buttons** with proper sizing and spacing
- **Optimized typography** with scalable font sizes
- **Mobile navigation** with sticky header
- **Gesture-friendly interactions** with hover states that work on touch devices

## 🎨 Color Palette

- **Background**: `#000000` (Pure black)
- **Neon Pink**: `#FF2D55` (Primary accent)
- **Neon Teal**: `#2DD4BF` (Secondary accent)
- **Gray Scale**: Various shades from `#111111` to `#cccccc`

## 🚀 Production Considerations

For a production deployment, consider adding:

### Backend Integration
- Real database (PostgreSQL, MongoDB)
- User authentication system
- Stripe payment processing
- Email confirmation system
- Real-time inventory management

### Performance Optimizations
- Image optimization and CDN
- Database query optimization
- Caching strategies
- Progressive Web App (PWA) features

### Security Enhancements
- JWT authentication
- Rate limiting
- Input validation and sanitization
- HTTPS encryption
- Environment variable management

## 📝 API Integration Notes

The current implementation uses mock data. To integrate with real services:

1. **Payment Processing**: Replace placeholder purchase flow with Stripe integration
2. **Email Service**: Add email confirmation system (SendGrid, AWS SES)
3. **Database**: Replace mock data with real database queries
4. **Authentication**: Implement proper JWT-based admin authentication

## 🎉 Features Implemented

✅ Mobile-first responsive design  
✅ Event listing homepage  
✅ Detailed event pages with FAQs  
✅ Customer testimonials section  
✅ Party size selector  
✅ Purchase confirmation flow  
✅ Admin login system  
✅ Event management dashboard  
✅ Sales tracking and analytics  
✅ Guest list CSV export  
✅ Neon nightlife aesthetic  
✅ Custom animations and effects  
✅ TypeScript implementation  
✅ Accessibility considerations  

## 🌟 Design Philosophy

SkipTheLine embodies the essence of Barcelona's vibrant nightlife scene:
- **Luxury meets accessibility**: Premium experience with user-friendly design
- **Speed and efficiency**: Fast loading, quick interactions
- **Visual impact**: Bold colors and striking typography that captures the energy of nightlife
- **Trust and security**: Clear information and secure feeling throughout the purchase process

---

**SkipTheLine** - Where nightlife meets technology. Skip the line, own the night. 🌙✨

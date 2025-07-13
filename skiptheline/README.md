# SkipTheLine Barcelona 🎉

A premium nightlife platform offering VIP fast-entry to Barcelona's hottest clubs. Built with Next.js, TypeScript, and Tailwind CSS, featuring Stripe payment integration.

## ✨ Features

- **Modern UI/UX**: Professional design with glass morphism effects and neon styling
- **Payment Processing**: Secure Stripe integration for handling transactions
- **Admin Dashboard**: Comprehensive management system for events and sales
- **Responsive Design**: Mobile-first approach with beautiful animations
- **Type Safety**: Built with TypeScript for robust development
- **Real-time Updates**: Live admin dashboard with real-time statistics

## 🚀 Live Demo

The application showcases:
- Beautiful homepage with animated elements
- Event browsing and detailed pages
- Secure payment flow (demo mode)
- Professional admin portal

## 🛠 Technology Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **Styling**: Tailwind CSS 4 with custom animations
- **Payments**: Stripe integration
- **Icons**: Lucide React
- **Deployment**: Vercel-ready

## 📦 Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/skiptheline
cd skiptheline
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
```

4. Configure your environment variables in `.env.local`:
```env
# Stripe Configuration (Required for payments)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_publishable_key_here
STRIPE_SECRET_KEY=sk_test_your_secret_key_here

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

5. Run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## 🔑 Stripe Setup

To enable real payment processing:

1. **Create a Stripe Account**:
   - Visit [stripe.com](https://stripe.com) and create an account
   - Navigate to the Dashboard

2. **Get API Keys**:
   - Go to Developers > API keys
   - Copy your Publishable key (`pk_test_...`)
   - Copy your Secret key (`sk_test_...`)

3. **Update Environment Variables**:
   ```env
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_51...
   STRIPE_SECRET_KEY=sk_test_51...
   ```

4. **Test Cards** (for testing):
   - Success: `4242 4242 4242 4242`
   - Declined: `4000 0000 0000 0002`
   - Requires Authentication: `4000 0025 0000 3155`

## 🎨 Design System

The application features a custom design system with:

- **Color Palette**: Neon pink, teal, purple, and green accents
- **Typography**: Inter font family with various weights
- **Components**: Glass morphism effects, animated gradients
- **Animations**: Smooth transitions, hover effects, and loading states
- **Responsive**: Mobile-first design with breakpoint optimization

## 👨‍💼 Admin Access

Access the admin dashboard at `/admin` with:
- **Username**: `admin`
- **Password**: `skiptheline2024`

Admin features include:
- Event management (create, edit, delete)
- Sales analytics and reporting
- Guest list exports
- Real-time dashboard statistics

## � Pages Overview

### Public Pages
- **Homepage** (`/`): Event browsing with beautiful hero section
- **Event Details** (`/event/[id]`): Detailed event information and booking
- **Confirmation** (`/confirmation`): Post-purchase confirmation

### Admin Pages
- **Admin Login** (`/admin`): Secure authentication
- **Dashboard**: Overview with key metrics
- **Event Management**: CRUD operations for events
- **Sales Analytics**: Detailed sales reporting

## 🔧 Development

### Scripts
```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint
```

### Project Structure
```
src/
├── app/                    # Next.js app router
│   ├── admin/             # Admin dashboard
│   ├── event/[id]/        # Event details
│   ├── confirmation/      # Purchase confirmation
│   └── api/               # API routes
├── components/            # React components
├── lib/                   # Utility functions
├── types/                 # TypeScript definitions
└── data/                  # Mock data
```

## 💡 Key Features Implementation

### Payment Flow
1. Customer selects event and party size
2. Enters personal information
3. Proceeds to secure Stripe checkout
4. Receives confirmation with event details

### Admin Dashboard
- Real-time sales metrics
- Event management tools
- Customer data exports
- Analytics and reporting

### Security
- Secure authentication for admin
- Stripe PCI compliance
- Input validation and sanitization
- Environment variable protection

## 🚀 Deployment

### Vercel (Recommended)
1. Push to GitHub
2. Connect repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy automatically

### Manual Deployment
```bash
npm run build
npm run start
```

## 🔒 Environment Variables

Required variables:
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`: Stripe publishable key
- `STRIPE_SECRET_KEY`: Stripe secret key
- `NEXT_PUBLIC_APP_URL`: Application URL

## � TODO / Future Enhancements

- [ ] Database integration (PostgreSQL/MongoDB)
- [ ] Email notifications (SendGrid/Nodemailer)
- [ ] QR code generation for tickets
- [ ] Multi-language support
- [ ] Social media integration
- [ ] Advanced analytics dashboard
- [ ] Real-time chat support
- [ ] Mobile app development

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Support

For support and questions:
- Email: support@skiptheline.com
- Discord: [Join our community](https://discord.gg/skiptheline)
- Documentation: [docs.skiptheline.com](https://docs.skiptheline.com)

## 🎉 Acknowledgments

- Design inspiration from modern nightlife platforms
- Icons by [Lucide](https://lucide.dev)
- Fonts by [Google Fonts](https://fonts.google.com)
- Payment processing by [Stripe](https://stripe.com)

---

**Made with ❤️ for Barcelona's nightlife community**

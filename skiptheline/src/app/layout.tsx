import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: "SkipTheLine - VIP Fast-Entry Nightlife",
  description: "Skip the queue at the world's hottest clubs. Prepay for VIP line access and walk straight in. No guestlist, no waiting - just pure nightlife access.",
  keywords: "nightlife, VIP access, club tickets, skip the line, fast entry, premium clubs",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-background text-foreground antialiased">
        <main className="min-h-screen">
          {children}
        </main>
      </body>
    </html>
  );
}

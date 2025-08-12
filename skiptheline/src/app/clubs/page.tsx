'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function ClubsPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to cities page since we're now city-based
    router.replace('/cities');
  }, [router]);

  return (
    <div className="min-h-screen bg-background gradient-bg flex items-center justify-center">
      <div className="text-center">
        <div className="spinner w-12 h-12 mx-auto mb-6"></div>
        <p className="text-gray-400 text-lg">Redirecting to cities...</p>
      </div>
    </div>
  );
}
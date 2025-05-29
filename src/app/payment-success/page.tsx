'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function PaymentSuccessPage() {
  const router = useRouter();

  useEffect(() => {
    // You can handle any post-payment success logic here
    // For example, updating user's membership status
  }, []);

  return (
    <div className="min-h-screen bg-[#111714] flex items-center justify-center px-4">
      <div className="text-center">
        <div className="mb-6 inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#38e07b]/20">
          <svg className="w-8 h-8 text-[#38e07b]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h1 className="text-3xl font-bold text-white mb-4">
          Payment Successful!
        </h1>
        <p className="text-gray-300 mb-8">
          Thank you for your purchase. Your membership has been activated.
        </p>
        <div className="space-x-4">
          <Link
            href="/dashboard"
            className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-black bg-[#38e07b] hover:bg-[#2bc665] transition-colors"
          >
            Go to Dashboard
          </Link>
          <Link
            href="/profile"
            className="inline-flex items-center justify-center px-6 py-3 border border-[#38e07b] text-base font-medium rounded-md text-[#38e07b] hover:bg-[#38e07b]/10 transition-colors"
          >
            View Profile
          </Link>
        </div>
      </div>
    </div>
  );
} 
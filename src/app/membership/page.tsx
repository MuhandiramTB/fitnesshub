'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import StripePaymentForm from '@/components/StripePaymentForm';

// Initialize Stripe with error handling
const stripePromise = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
  ? loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY)
  : Promise.reject(new Error('Stripe publishable key is missing'));

if (!process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY) {
  console.error('Warning: Stripe publishable key is missing. Please check your environment variables.');
}

const plans = [
  {
    name: 'Basic',
    price: 'LKR 5,000',
    features: [
      'Access to gym floor',
      'Group fitness classes',
      'Personal training session (1/month)',
    ],
  },
  {
    name: 'Premium',
    price: 'LKR 8,000',
    features: [
      'All Basic features',
      'Unlimited group classes',
      'Personal training session (2/month)',
      'Access to sauna and steam room',
    ],
  },
  {
    name: 'Elite',
    price: 'LKR 12,000',
    features: [
      'All Premium features',
      'Unlimited personal training sessions',
      'Exclusive access to VIP lounge',
      'Complimentary towel service',
    ],
  },
];

export default function MembershipPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    address: '',
    membershipPlan: '',
  });
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<'stripe' | 'qr' | null>(null);
  const [paymentStatus, setPaymentStatus] = useState<'pending' | 'completed' | 'failed' | null>(null);
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [clientSecret, setClientSecret] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsAuthenticated(!!token);
  }, []);

  const handlePlanSelection = async (planName: string) => {
    if (!isAuthenticated) {
      setShowAuthModal(true);
      return;
    }
    setSelectedPlan(planName);
    setShowPaymentModal(true);
  };

  const handlePaymentMethodSelection = async (method: 'stripe' | 'qr') => {
    setPaymentMethod(method);
    const token = localStorage.getItem('token');
    
    try {
      const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      const response = await fetch(`${apiBaseUrl}/api/payment/create-payment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          membershipPlan: selectedPlan,
          paymentMethod: method
        })
      });

      if (!response.ok) {
        throw new Error('Payment creation failed');
      }

      const data = await response.json();

      if (method === 'stripe') {
        setClientSecret(data.clientSecret);
      } else if (method === 'qr') {
        setQrCode(data.qrCode);
        // Start polling for payment status
        startPaymentStatusPolling(data.paymentId);
      }
    } catch (error) {
      console.error('Payment error:', error);
      setPaymentStatus('failed');
    }
  };

  const startPaymentStatusPolling = (paymentId: string) => {
    const pollInterval = setInterval(async () => {
      const token = localStorage.getItem('token');
      try {
        const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
        const response = await fetch(`${apiBaseUrl}/api/payment/status/${paymentId}`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) {
          throw new Error('Status check failed');
        }

        const { status } = await response.json();
        if (status === 'completed') {
          setPaymentStatus('completed');
          clearInterval(pollInterval);
          // Handle successful payment
          window.location.reload();
        } else if (status === 'failed') {
          setPaymentStatus('failed');
          clearInterval(pollInterval);
        }
      } catch (error) {
        console.error('Status check error:', error);
        clearInterval(pollInterval);
      }
    }, 3000); // Poll every 3 seconds

    // Clear interval after 5 minutes
    setTimeout(() => clearInterval(pollInterval), 300000);
  };

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const email = formData.get('email');
    const password = formData.get('password');

    try {
      const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      const response = await fetch(`${apiBaseUrl}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem('token', data.token);
        setIsAuthenticated(true);
        setShowAuthModal(false);
        // Refresh the page to update authentication state
        window.location.reload();
      } else {
        throw new Error('Login failed');
      }
    } catch (error) {
      console.error('Login error:', error);
      // Handle login error (show message to user)
    }
  };

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const name = formData.get('name');
    const email = formData.get('email');
    const password = formData.get('password');

    try {
      const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      const response = await fetch(`${apiBaseUrl}/api/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password }),
      });

      if (response.ok) {
        // Switch to login form after successful registration
        setIsLogin(true);
      } else {
        throw new Error('Registration failed');
      }
    } catch (error) {
      console.error('Registration error:', error);
      // Handle registration error (show message to user)
    }
  };

  return (
    <section className="py-12 bg-[#111714] text-white mt-12">
      <Navbar/>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-white mb-4">
            Membership Options
          </h2>
          <p className="text-lg text-gray-300">
            Choose the plan that best fits your fitness goals and lifestyle. We offer a variety of options to suit every need and budget.
          </p>
        </div>

        {/* Membership Plans */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className="bg-[#29382f] rounded-lg p-8 border border-[#38e07b]/20 hover:border-[#38e07b] transition-all duration-300"
            >
              <h3 className="text-xl font-bold text-white mb-2">
                {plan.name}
              </h3>
              <div className="text-3xl font-bold text-[#38e07b] mb-6">
                {plan.price}
                <span className="text-sm font-normal text-gray-300 ml-1">per month</span>
              </div>
              <button 
                className="w-full mb-6 bg-[#38e07b] text-black py-2 px-4 rounded-md hover:bg-[#2bc665] transition-colors font-medium"
                onClick={() => handlePlanSelection(plan.name)}
              >
                Join {plan.name}
              </button>
              <ul className="space-y-3">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start">
                    <svg
                      className="w-5 h-5 text-[#38e07b] mr-2 mt-1 flex-shrink-0"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    <span className="text-gray-300">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Auth Modal */}
        {showAuthModal && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center">
            <div className="bg-[#1a1f1c] rounded-2xl p-8 w-full max-w-md m-4">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-white">
                  {isLogin ? 'Login to Continue' : 'Create an Account'}
                </h3>
                <button
                  onClick={() => setShowAuthModal(false)}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {isLogin ? (
                <form onSubmit={handleLogin} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Email</label>
                    <input
                      type="email"
                      name="email"
                      required
                      className="w-full px-4 py-3 rounded-xl bg-[#29382f] text-white border-none focus:ring-2 focus:ring-[#38e07b] transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Password</label>
                    <input
                      type="password"
                      name="password"
                      required
                      className="w-full px-4 py-3 rounded-xl bg-[#29382f] text-white border-none focus:ring-2 focus:ring-[#38e07b] transition-colors"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full bg-[#38e07b] text-black py-3 px-4 rounded-xl font-medium hover:bg-[#2bc665] transition-colors"
                  >
                    Login
                  </button>
                  <p className="text-center text-gray-400 text-sm">
                    Don't have an account?{' '}
                    <button
                      type="button"
                      onClick={() => setIsLogin(false)}
                      className="text-[#38e07b] hover:text-[#2bc665] transition-colors"
                    >
                      Register
                    </button>
                  </p>
                </form>
              ) : (
                <form onSubmit={handleRegister} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Name</label>
                    <input
                      type="text"
                      name="name"
                      required
                      className="w-full px-4 py-3 rounded-xl bg-[#29382f] text-white border-none focus:ring-2 focus:ring-[#38e07b] transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Email</label>
                    <input
                      type="email"
                      name="email"
                      required
                      className="w-full px-4 py-3 rounded-xl bg-[#29382f] text-white border-none focus:ring-2 focus:ring-[#38e07b] transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Password</label>
                    <input
                      type="password"
                      name="password"
                      required
                      className="w-full px-4 py-3 rounded-xl bg-[#29382f] text-white border-none focus:ring-2 focus:ring-[#38e07b] transition-colors"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full bg-[#38e07b] text-black py-3 px-4 rounded-xl font-medium hover:bg-[#2bc665] transition-colors"
                  >
                    Register
                  </button>
                  <p className="text-center text-gray-400 text-sm">
                    Already have an account?{' '}
                    <button
                      type="button"
                      onClick={() => setIsLogin(true)}
                      className="text-[#38e07b] hover:text-[#2bc665] transition-colors"
                    >
                      Login
                    </button>
                  </p>
                </form>
              )}
            </div>
          </div>
        )}

        {/* Payment Modal */}
        {showPaymentModal && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center">
            <div className="bg-[#1a1f1c] rounded-2xl p-8 w-full max-w-md m-4">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-white">
                  Choose Payment Method
                </h3>
                <button
                  onClick={() => {
                    setShowPaymentModal(false);
                    setPaymentMethod(null);
                    setQrCode(null);
                    setClientSecret(null);
                  }}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {!paymentMethod ? (
                <div className="space-y-4">
                  <button
                    onClick={() => handlePaymentMethodSelection('stripe')}
                    className="w-full flex items-center justify-center gap-3 bg-white text-black py-3 px-4 rounded-xl font-medium hover:bg-gray-100 transition-colors"
                  >
                    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 0C5.383 0 0 5.383 0 12s5.383 12 12 12 12-5.383 12-12S18.617 0 12 0zm-1.53 14.47c-.293.293-.767.293-1.06 0l-2.83-2.83c-.293-.293-.293-.767 0-1.06.293-.293.767-.293 1.06 0l2.83 2.83c.293.293.293.767 0 1.06zm6.53-3.53l-4 4c-.293.293-.767.293-1.06 0-.293-.293-.293-.767 0-1.06l4-4c.293-.293.767-.293 1.06 0 .293.293.293.767 0 1.06z"/>
                    </svg>
                    Pay with Card
                  </button>
                  <button
                    onClick={() => handlePaymentMethodSelection('qr')}
                    className="w-full flex items-center justify-center gap-3 bg-[#38e07b] text-black py-3 px-4 rounded-xl font-medium hover:bg-[#2bc665] transition-colors"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v-4m6 0h-2m2 0v4m-6-4h-2m2 0v4m-6 0h-2m2 0v4m-6-4h-2m2 0v4m-6-4h-2m2 0v4m-6-4h-2m2 0v4m-6-4h-2m2 0v4m-6-4h-2m2 0v4m-6-4h-2m2 0v4m-6-4h-2m2 0v4m-6-4h-2m2 0v4" />
                    </svg>
                    Pay with QR Code
                  </button>
                </div>
              ) : paymentMethod === 'stripe' && clientSecret ? (
                stripePromise ? (
                  <Elements stripe={stripePromise} options={{ clientSecret }}>
                    <StripePaymentForm />
                  </Elements>
                ) : (
                  <div className="text-center text-red-500 mt-4">
                    Stripe payment is not available. Please try another payment method or contact support.
                  </div>
                )
              ) : paymentMethod === 'qr' && qrCode ? (
                <div className="space-y-4">
                  <div className="bg-white p-4 rounded-lg">
                    <img src={qrCode} alt="Payment QR Code" className="w-full" />
                  </div>
                  <p className="text-center text-gray-300">
                    Scan the QR code with your banking app to complete the payment
                  </p>
                  {paymentStatus === 'pending' && (
                    <div className="flex items-center justify-center gap-2 text-[#38e07b]">
                      <svg className="w-5 h-5 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                      Waiting for payment...
                    </div>
                  )}
                </div>
              ) : null}

              {paymentStatus === 'completed' && (
                <div className="text-center text-[#38e07b] mt-4">
                  Payment completed successfully!
                </div>
              )}

              {paymentStatus === 'failed' && (
                <div className="text-center text-red-500 mt-4">
                  Payment failed. Please try again.
                </div>
              )}
            </div>
          </div>
        )}
      </div>
      <Footer/>
    </section>
  );
} 
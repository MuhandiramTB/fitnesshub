'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

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

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsAuthenticated(!!token);
  }, []);

  const handlePlanSelection = (planName: string) => {
    if (!isAuthenticated) {
      setShowAuthModal(true);
      return;
    }
    setFormData(prev => ({ ...prev, membershipPlan: planName }));
    // Handle authenticated user's plan selection
    console.log('Selected plan:', planName);
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
      </div>
      <Footer/>
    </section>
  );
} 
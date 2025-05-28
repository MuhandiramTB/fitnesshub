'use client';

import { useState } from 'react';
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
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    address: '',
    membershipPlan: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission here
    console.log('Form submitted:', formData);
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
                onClick={() => setFormData(prev => ({ ...prev, membershipPlan: plan.name }))}
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

        {/* Registration Form */}
        <div className="max-w-2xl mx-auto">
          <h3 className="text-2xl font-bold text-white mb-8">Register Now</h3>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium text-gray-300 mb-1">
                  First Name
                </label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 bg-[#29382f] border border-[#38e07b]/20 rounded-md focus:ring-2 focus:ring-[#38e07b] focus:border-[#38e07b] text-white placeholder-gray-400"
                  placeholder="Enter your first name"
                />
              </div>
              <div>
                <label htmlFor="lastName" className="block text-sm font-medium text-gray-300 mb-1">
                  Last Name
                </label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 bg-[#29382f] border border-[#38e07b]/20 rounded-md focus:ring-2 focus:ring-[#38e07b] focus:border-[#38e07b] text-white placeholder-gray-400"
                  placeholder="Enter your last name"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 bg-[#29382f] border border-[#38e07b]/20 rounded-md focus:ring-2 focus:ring-[#38e07b] focus:border-[#38e07b] text-white placeholder-gray-400"
                  placeholder="Enter your email address"
                />
              </div>
              <div>
                <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-300 mb-1">
                  Phone Number
                </label>
                <input
                  type="tel"
                  id="phoneNumber"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 bg-[#29382f] border border-[#38e07b]/20 rounded-md focus:ring-2 focus:ring-[#38e07b] focus:border-[#38e07b] text-white placeholder-gray-400"
                  placeholder="Enter your phone number"
                />
              </div>
            </div>

            <div>
              <label htmlFor="address" className="block text-sm font-medium text-gray-300 mb-1">
                Address
              </label>
              <input
                type="text"
                id="address"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                className="w-full px-4 py-2 bg-[#29382f] border border-[#38e07b]/20 rounded-md focus:ring-2 focus:ring-[#38e07b] focus:border-[#38e07b] text-white placeholder-gray-400"
                placeholder="Enter your address"
              />
            </div>

            <div>
              <label htmlFor="membershipPlan" className="block text-sm font-medium text-gray-300 mb-1">
                Membership Plan
              </label>
              <select
                id="membershipPlan"
                name="membershipPlan"
                value={formData.membershipPlan}
                onChange={handleInputChange}
                className="w-full px-4 py-2 bg-[#29382f] border border-[#38e07b]/20 rounded-md focus:ring-2 focus:ring-[#38e07b] focus:border-[#38e07b] text-white"
              >
                <option value="" className="bg-[#29382f]">Select a plan</option>
                {plans.map(plan => (
                  <option key={plan.name} value={plan.name} className="bg-[#29382f]">{plan.name}</option>
                ))}
              </select>
            </div>

            <button
              type="submit"
              className="w-full bg-[#38e07b] text-black py-3 px-6 rounded-md hover:bg-[#2bc665] transition-colors font-medium"
            >
              Submit
            </button>
          </form>
        </div>
      </div>
      <Footer/>
    </section>
  );
} 
'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from "@/components/Navbar";
import Link from 'next/link';

interface AnalyticsData {
  revenue: {
    total: number;
    monthly: number;
    trend: number;
    history: {
      date: string;
      amount: number;
    }[];
  };
  members: {
    total: number;
    active: number;
    new: number;
    trend: number;
    history: {
      date: string;
      count: number;
    }[];
  };
  attendance: {
    current: number;
    daily: number;
    weekly: number;
    history: {
      date: string;
      count: number;
    }[];
  };
  packages: {
    total: number;
    popular: {
      name: string;
      count: number;
    }[];
  };
  services: {
    total: number;
    popular: {
      name: string;
      bookings: number;
    }[];
  };
}

export default function AnalyticsPage() {
  const router = useRouter();
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [timeRange, setTimeRange] = useState<'week' | 'month' | 'year'>('month');

  useEffect(() => {
    fetchAnalytics();
  }, [timeRange]);

  const fetchAnalytics = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/');
      return;
    }

    try {
      const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      const response = await fetch(`${apiBaseUrl}/api/admin/analytics?timeRange=${timeRange}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch analytics data');
      }

      const data = await response.json();
      setAnalyticsData(data);
    } catch (error) {
      console.error('Error fetching analytics:', error);
      setError('Failed to load analytics data. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#111714] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#38e07b]"></div>
      </div>
    );
  }

  if (!analyticsData) {
    return (
      <div className="min-h-screen bg-[#111714] flex items-center justify-center">
        <p className="text-[#9eb7a8]">No analytics data available</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#111714]">
      <Navbar />
      <main className="pt-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-[32px] text-white font-bold tracking-[-0.02em] mb-1">Analytics Dashboard</h1>
              <p className="text-[#9eb7a8] text-base">Track your gym's performance and growth</p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setTimeRange('week')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  timeRange === 'week'
                    ? 'bg-[#38e07b] text-black'
                    : 'bg-[#29382f] text-[#9eb7a8] hover:text-white'
                }`}
              >
                Week
              </button>
              <button
                onClick={() => setTimeRange('month')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  timeRange === 'month'
                    ? 'bg-[#38e07b] text-black'
                    : 'bg-[#29382f] text-[#9eb7a8] hover:text-white'
                }`}
              >
                Month
              </button>
              <button
                onClick={() => setTimeRange('year')}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  timeRange === 'year'
                    ? 'bg-[#38e07b] text-black'
                    : 'bg-[#29382f] text-[#9eb7a8] hover:text-white'
                }`}
              >
                Year
              </button>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 rounded-xl bg-red-400/10 border border-red-400/20 text-red-400">
              {error}
            </div>
          )}

          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {/* Revenue Card */}
            <div className="bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-sm rounded-2xl p-6 border border-white/10">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-[#9eb7a8] text-sm font-medium">Total Revenue</h3>
                <span className={`text-sm font-medium ${
                  analyticsData.revenue.trend >= 0 ? 'text-[#38e07b]' : 'text-red-400'
                }`}>
                  {analyticsData.revenue.trend >= 0 ? '+' : ''}{analyticsData.revenue.trend}%
                </span>
              </div>
              <p className="text-2xl text-white font-bold mb-1">
                LKR {analyticsData.revenue.total.toLocaleString()}
              </p>
              <p className="text-[#9eb7a8] text-sm">
                {timeRange === 'week' ? 'This Week' : timeRange === 'month' ? 'This Month' : 'This Year'}
              </p>
            </div>

            {/* Members Card */}
            <div className="bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-sm rounded-2xl p-6 border border-white/10">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-[#9eb7a8] text-sm font-medium">Total Members</h3>
                <span className={`text-sm font-medium ${
                  analyticsData.members.trend >= 0 ? 'text-[#38e07b]' : 'text-red-400'
                }`}>
                  {analyticsData.members.trend >= 0 ? '+' : ''}{analyticsData.members.trend}%
                </span>
              </div>
              <p className="text-2xl text-white font-bold mb-1">
                {analyticsData.members.total.toLocaleString()}
              </p>
              <p className="text-[#9eb7a8] text-sm">
                {analyticsData.members.active} Active Members
              </p>
            </div>

            {/* Attendance Card */}
            <div className="bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-sm rounded-2xl p-6 border border-white/10">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-[#9eb7a8] text-sm font-medium">Current Attendance</h3>
                <span className="text-[#38e07b] text-sm font-medium">
                  {analyticsData.attendance.current} Present
                </span>
              </div>
              <p className="text-2xl text-white font-bold mb-1">
                {analyticsData.attendance.daily.toLocaleString()}
              </p>
              <p className="text-[#9eb7a8] text-sm">
                Daily Average
              </p>
            </div>

            {/* New Members Card */}
            <div className="bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-sm rounded-2xl p-6 border border-white/10">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-[#9eb7a8] text-sm font-medium">New Members</h3>
                <span className="text-[#38e07b] text-sm font-medium">
                  This {timeRange}
                </span>
              </div>
              <p className="text-2xl text-white font-bold mb-1">
                {analyticsData.members.new.toLocaleString()}
              </p>
              <p className="text-[#9eb7a8] text-sm">
                New Sign-ups
              </p>
            </div>
          </div>

          {/* Charts and Detailed Analytics */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Revenue Chart */}
            <div className="bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-sm rounded-2xl p-6 border border-white/10">
              <h3 className="text-white font-bold mb-4">Revenue Trend</h3>
              <div className="h-64">
                {/* Add your preferred charting library here */}
                <div className="w-full h-full flex items-center justify-center text-[#9eb7a8]">
                  Revenue chart visualization
                </div>
              </div>
            </div>

            {/* Membership Chart */}
            <div className="bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-sm rounded-2xl p-6 border border-white/10">
              <h3 className="text-white font-bold mb-4">Membership Growth</h3>
              <div className="h-64">
                {/* Add your preferred charting library here */}
                <div className="w-full h-full flex items-center justify-center text-[#9eb7a8]">
                  Membership growth chart visualization
                </div>
              </div>
            </div>

            {/* Popular Packages */}
            <div className="bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-sm rounded-2xl p-6 border border-white/10">
              <h3 className="text-white font-bold mb-4">Popular Packages</h3>
              <div className="space-y-4">
                {analyticsData.packages.popular.map((package_, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <span className="text-[#9eb7a8]">{package_.name}</span>
                    <span className="text-white font-medium">{package_.count} members</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Popular Services */}
            <div className="bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-sm rounded-2xl p-6 border border-white/10">
              <h3 className="text-white font-bold mb-4">Popular Services</h3>
              <div className="space-y-4">
                {analyticsData.services.popular.map((service, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <span className="text-[#9eb7a8]">{service.name}</span>
                    <span className="text-white font-medium">{service.bookings} bookings</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
} 
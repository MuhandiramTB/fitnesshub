'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from "@/components/Navbar";
import Link from 'next/link';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

interface UserProfile {
  id: string;
  name: string;
  email: string;
  createdAt: string;
  weight: number;
  targetWeight: number;
  workoutFrequency: number;
  achievements: {
    firstWorkout: boolean;
    workoutsCompleted: number;
    consistencyStreak: number;
  };
}

interface NavItem {
  href: string;
  label: string;
  icon: JSX.Element;
  isActive?: boolean;
}

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [editForm, setEditForm] = useState({
    name: '',
    email: '',
    targetWeight: '',
    workoutFrequency: ''
  });
  const [error, setError] = useState('');

  const navItems: NavItem[] = [
    {
      href: "/dashboard",
      label: "Dashboard",
      isActive: true,
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      )
    },
    {
      href: "/workouts",
      label: "Workouts",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
      )
    },
    {
      href: "/nutrition",
      label: "Nutrition",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
        </svg>
      )
    },
    {
      href: "/progress",
      label: "Progress",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      )
    },
    {
      href: "/community",
      label: "Community",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      )
    }
  ];

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/');
        return;
      }

      try {
        const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
        const response = await fetch(`${apiBaseUrl}/api/user/profile`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch profile');
        }

        const userData = await response.json();
        setUser(userData);
        setEditForm({
          name: userData.name,
          email: userData.email,
          targetWeight: userData.targetWeight?.toString() || '',
          workoutFrequency: userData.workoutFrequency?.toString() || ''
        });
      } catch (error) {
        console.error('Error fetching profile:', error);
        setError('Failed to load profile');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, [router]);

  const handleSave = async () => {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      const response = await fetch(`${apiBaseUrl}/api/user/profile/update`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...editForm,
          targetWeight: parseFloat(editForm.targetWeight),
          workoutFrequency: parseInt(editForm.workoutFrequency)
        })
      });

      if (!response.ok) {
        throw new Error('Failed to update profile');
      }

      const updatedUser = await response.json();
      setUser(updatedUser);
      setError('');
    } catch (error) {
      console.error('Error updating profile:', error);
      setError('Failed to update profile');
    }
  };

  const weightData = {
    labels: ['Jan', 'Feb', 'Mar'],
    datasets: [
      {
        label: 'Weight',
        data: [75, 73, 74],
        borderColor: '#38e07b',
        backgroundColor: 'rgba(56, 224, 123, 0.1)',
        tension: 0.4,
        fill: true,
        pointRadius: 0,
        borderWidth: 2
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        enabled: false
      }
    },
    scales: {
      x: {
        grid: {
          display: false,
          drawBorder: false
        },
        ticks: {
          color: '#9eb7a8',
          font: {
            size: 12,
            family: 'Inter'
          }
        },
        border: {
          display: false
        }
      },
      y: {
        display: false,
        grid: {
          display: false
        }
      }
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#111714] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#38e07b]"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#111714] flex">
      {/* Sidebar */}
      <div className={`w-64 bg-[#1a1f1c] min-h-screen fixed left-0 top-0 z-30 transform mt-16 ${
        isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
      } lg:translate-x-0 transition-transform duration-300 ease-in-out`}>
        <div className="flex flex-col h-full p-4">
          {/* User Profile */}
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-full bg-[#38e07b] flex items-center justify-center text-black text-lg font-bold">
              {user?.name?.charAt(0).toUpperCase()}
            </div>
            <div className="flex flex-col">
              <h2 className="text-white text-sm font-medium">{user?.name}</h2>
              <p className="text-[#9eb7a8] text-xs">Member since {new Date(user?.createdAt || '').getFullYear()}</p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="flex-1">
            <ul className="space-y-1">
              {navItems.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                      item.isActive
                        ? 'bg-[#29382f] text-white'
                        : 'text-[#9eb7a8] hover:text-white hover:bg-[#29382f]'
                    }`}
                  >
                    {item.icon}
                    <span className="text-sm font-medium">{item.label}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 lg:ml-64 mt-10">
        {/* Mobile Menu Button */}
        <div className="fixed top-4 left-4 lg:hidden z-50">
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2 rounded-lg bg-[#29382f] text-white hover:bg-[#38e07b] transition-colors"
            aria-label="Toggle menu"
          >
            {isSidebarOpen ? (
              // Close icon
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              // Menu icon
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>

        {/* Overlay for mobile */}
        {isSidebarOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden"
            onClick={() => setIsSidebarOpen(false)}
          ></div>
        )}

        <Navbar />
        <main className="px-4 sm:px-6 lg:px-8 py-8">
          {/* Welcome Section */}
          <div className="mb-8">
            <h1 className="text-[32px] text-white font-bold tracking-[-0.02em] mb-1">Welcome back, {user?.name}</h1>
            <p className="text-[#9eb7a8] text-base">Member since {new Date(user?.createdAt || '').getFullYear()}</p>
          </div>

          {/* Progress Section */}
          <section className="mb-12">
            <h2 className="text-xl text-white font-bold mb-6">Your Progress</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Weight Progress Card */}
              <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6">
                <div className="flex flex-col">
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <h3 className="text-[32px] text-white font-bold mb-1">75 kg</h3>
                      <p className="text-[#9eb7a8] text-sm">Weight Over Time</p>
                    </div>
                    <span className="text-red-400 text-sm">Last 3 Months -2%</span>
                  </div>
                  <div className="h-[160px] w-full">
                    <Line data={weightData} options={chartOptions} />
                  </div>
                  <div className="flex justify-between mt-2">
                    <span className="text-[#9eb7a8] text-xs">Jan</span>
                    <span className="text-[#9eb7a8] text-xs">Feb</span>
                    <span className="text-[#9eb7a8] text-xs">Mar</span>
                  </div>
                </div>
              </div>

              {/* Workout Frequency Card */}
              <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6">
                <div className="flex flex-col">
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <h3 className="text-[32px] text-white font-bold mb-1">3 times/week</h3>
                      <p className="text-[#9eb7a8] text-sm">Workout Frequency</p>
                    </div>
                    <span className="text-[#38e07b] text-sm">This Week +1</span>
                  </div>
                  <div className="grid grid-cols-7 gap-2">
                    {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, i) => (
                      <div key={day} className="flex flex-col items-center gap-2">
                        <div className={`h-24 w-full ${i % 2 === 0 ? 'bg-[#38e07b]/10' : 'bg-white/5'} rounded-lg transition-colors`}></div>
                        <span className="text-[#9eb7a8] text-xs">{day}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Achievements Section */}
          <section>
            <h2 className="text-xl text-white font-bold mb-6">Achievements</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* First Workout Achievement */}
              <div className="bg-white/5 backdrop-blur-sm rounded-2xl overflow-hidden">
                <div className="aspect-square relative">
                  <img
                    src="https://images.unsplash.com/photo-1526506118085-60ce8714f8c5"
                    alt="First Workout"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-4">
                  <h3 className="text-white font-medium mb-1">First Workout</h3>
                  <p className="text-[#9eb7a8] text-sm">Completed your first workout!</p>
                </div>
              </div>

              {/* 5 Workouts Achievement */}
              <div className="bg-white/5 backdrop-blur-sm rounded-2xl overflow-hidden">
                <div className="aspect-square relative">
                  <img
                    src="https://images.unsplash.com/photo-1574680096145-d05b474e2155"
                    alt="5 Workouts"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-4">
                  <h3 className="text-white font-medium mb-1">5 Workouts Completed</h3>
                  <p className="text-[#9eb7a8] text-sm">You've completed 5 workouts. Keep it up!</p>
                </div>
              </div>

              {/* Consistency Badge */}
              <div className="bg-white/5 backdrop-blur-sm rounded-2xl overflow-hidden">
                <div className="aspect-square relative bg-[#f8c4b9]">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="bg-white rounded-xl p-4 shadow-lg">
                      <svg className="w-12 h-12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 15C13.6569 15 15 13.6569 15 12C15 10.3431 13.6569 9 12 9C10.3431 9 9 10.3431 9 12C9 13.6569 10.3431 15 12 15Z" stroke="#111714" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M12 4V3" stroke="#111714" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M12 21V20" stroke="#111714" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M20 12H21" stroke="#111714" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M3 12H4" stroke="#111714" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M17.6569 6.34314L18.364 5.63603" stroke="#111714" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M5.63605 18.364L6.34315 17.6569" stroke="#111714" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M17.6569 17.6569L18.364 18.364" stroke="#111714" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        <path d="M5.63605 5.63603L6.34315 6.34314" stroke="#111714" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </div>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="text-white font-medium mb-1">Consistency Badge</h3>
                  <p className="text-[#9eb7a8] text-sm">Workout 3 times a week for a month</p>
                </div>
              </div>
            </div>
          </section>

          {/* Set New Goals Section */}
          <section className="mt-12">
            <h2 className="text-xl text-white font-bold mb-6">Set New Goals</h2>
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-[#9eb7a8] mb-2">Target Weight (kg)</label>
                  <input
                    type="number"
                    value={editForm.targetWeight}
                    onChange={(e) => setEditForm({ ...editForm, targetWeight: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-[#29382f] text-white border-none focus:ring-2 focus:ring-[#38e07b] transition-colors"
                    placeholder="Enter your target weight"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#9eb7a8] mb-2">Workout Frequency (times/week)</label>
                  <input
                    type="number"
                    value={editForm.workoutFrequency}
                    onChange={(e) => setEditForm({ ...editForm, workoutFrequency: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-[#29382f] text-white border-none focus:ring-2 focus:ring-[#38e07b] transition-colors"
                    placeholder="Enter your workout frequency"
                  />
                </div>
              </div>
              <div className="mt-6">
                <button
                  onClick={handleSave}
                  className="w-full sm:w-auto bg-[#38e07b] text-black px-6 py-3 rounded-xl text-sm font-bold hover:bg-[#2bc665] transition-colors"
                >
                  Update Goals
                </button>
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
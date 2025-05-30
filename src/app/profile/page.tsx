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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
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
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path d="M4 6C4 4.89543 4.89543 4 6 4H8C9.10457 4 10 4.89543 10 6V8C10 9.10457 9.10457 10 8 10H6C4.89543 10 4 9.10457 4 8V6Z" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round"/>
          <path d="M14 6C14 4.89543 14.8954 4 16 4H18C19.1046 4 20 4.89543 20 6V8C20 9.10457 19.1046 10 18 10H16C14.8954 10 14 9.10457 14 8V6Z" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round"/>
          <path d="M4 16C4 14.8954 4.89543 14 6 14H8C9.10457 14 10 14.8954 10 16V18C10 19.1046 9.10457 20 8 20H6C4.89543 20 4 19.1046 4 18V16Z" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round"/>
          <path d="M14 16C14 14.8954 14.8954 14 16 14H18C19.1046 14 20 14.8954 20 16V18C20 19.1046 19.1046 20 18 20H16C14.8954 20 14 19.1046 14 18V16Z" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round"/>
        </svg>
      )
    },
    {
      href: "/workouts",
      label: "Workouts",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path d="M6.5 4C4.567 4 3 5.567 3 7.5C3 9.433 4.567 11 6.5 11C8.433 11 10 9.433 10 7.5C10 5.567 8.433 4 6.5 4Z" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round"/>
          <path d="M17.5 4C15.567 4 14 5.567 14 7.5C14 9.433 15.567 11 17.5 11C19.433 11 21 9.433 21 7.5C21 5.567 19.433 4 17.5 4Z" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round"/>
          <path d="M6.5 13C4.567 13 3 14.567 3 16.5C3 18.433 4.567 20 6.5 20C8.433 20 10 18.433 10 16.5C10 14.567 8.433 13 6.5 13Z" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round"/>
          <path d="M17.5 13C15.567 13 14 14.567 14 16.5C14 18.433 15.567 20 17.5 20C19.433 20 21 18.433 21 16.5C21 14.567 19.433 13 17.5 13Z" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round"/>
        </svg>
      )
    },
    {
      href: "/nutrition",
      label: "Nutrition",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path d="M6.115 6.792C6.115 4.692 7.825 3 10.001 3C12.177 3 13.887 4.692 13.887 6.792C13.887 8.892 12.177 10.584 10.001 10.584C7.825 10.584 6.115 8.892 6.115 6.792Z" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round"/>
          <path d="M15.001 21H5.00098C4.44869 21 4.00098 20.5523 4.00098 20V19C4.00098 16.2386 6.23955 14 9.00098 14H11.001C13.7624 14 16.001 16.2386 16.001 19V20C16.001 20.5523 15.5533 21 15.001 21Z" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round"/>
          <path d="M17.001 3H20.001C20.5533 3 21.001 3.44772 21.001 4V7" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round"/>
          <path d="M17.001 21H20.001C20.5533 21 21.001 20.5523 21.001 20V17" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round"/>
        </svg>
      )
    },
    {
      href: "/progress",
      label: "Progress",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path d="M3 12L7 16L11 12" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M3 6L7 2L11 6" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M13 8L17 12L21 8" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M13 18L17 14L21 18" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      )
    },
    {
      href: "/community",
      label: "Community",
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 11C14.2091 11 16 9.20914 16 7C16 4.79086 14.2091 3 12 3C9.79086 3 8 4.79086 8 7C8 9.20914 9.79086 11 12 11Z" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round"/>
          <path d="M19 21H5C4.44772 21 4 20.5523 4 20V19C4 16.2386 6.23858 14 9 14H15C17.7614 14 20 16.2386 20 19V20C20 20.5523 19.5523 21 19 21Z" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round"/>
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

  const handleLogout = () => {
    localStorage.removeItem('token');
    router.push('/');
  };

  const handleBack = () => {
    router.back();
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
    <div className="min-h-screen bg-[#111714] flex flex-col">
      <Navbar />
      <div className="flex-1 w-full pt-16">
        {/* Desktop Sidebar */}
        <aside className="hidden lg:block fixed left-0 top-16 bottom-0 w-64 bg-[#111714] border-r border-[#38e07b]/10">
          <div className="p-6 flex flex-col h-full">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-12 h-12 rounded-full bg-[#38e07b] flex items-center justify-center text-black text-xl font-bold">
                {user?.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <h3 className="text-white font-medium">{user?.name}</h3>
                <p className="text-[#9eb7a8] text-sm">Member since {new Date(user?.createdAt || '').getFullYear()}</p>
              </div>
            </div>
            <nav className="space-y-1 flex-1">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                    item.isActive 
                      ? 'bg-[#38e07b] text-black' 
                      : 'text-[#9eb7a8] hover:text-white hover:bg-white/5'
                  }`}
                >
                  {item.icon}
                  {item.label}
                </Link>
              ))}
            </nav>
            
            {/* Bottom Navigation */}
            <div className="space-y-2 pt-4 border-t border-white/10">
              <Link
                href="/"
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-[#9eb7a8] hover:text-white hover:bg-white/5 transition-all duration-200"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                Home
              </Link>
              <button
                onClick={handleLogout}
                className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-400 hover:text-red-300 hover:bg-red-400/10 transition-all duration-200 w-full text-left"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                Logout
              </button>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="px-4 sm:px-6 lg:pl-72 lg:pr-8 py-8 pb-20 lg:pb-0">
          {/* Mobile Menu Button */}
          <div className="lg:hidden fixed top-4 right-4 z-50">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-lg bg-[#111714] border border-[#38e07b]/10"
            >
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>

          {/* Mobile Menu */}
          {isMobileMenuOpen && (
            <div className="fixed inset-y-0 right-0 w-64 bg-[#111714] transform transition-transform duration-300 ease-in-out md:hidden z-50">
              <div className="absolute inset-0 bg-black/50" onClick={() => setIsMobileMenuOpen(false)} />
              <div className="absolute right-0 top-0 bottom-0 w-64 bg-[#111714] border-l border-[#38e07b]/10 p-6">
                <div className="flex items-center gap-3 mb-8">
                  <div className="w-12 h-12 rounded-full bg-[#38e07b] flex items-center justify-center text-black text-xl font-bold">
                    {user?.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="text-white font-medium">{user?.name}</h3>
                    <p className="text-[#9eb7a8] text-sm">Member since {new Date(user?.createdAt || '').getFullYear()}</p>
                  </div>
                </div>
                <nav className="space-y-2">
                  <Link
                    href="/"
                    className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-[#9eb7a8] hover:text-white hover:bg-white/5 transition-all duration-200"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                    </svg>
                    Home
                  </Link>
                  <Link
                    href="/profile"
                    className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium bg-[#38e07b] text-black"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    Profile Details
                  </Link>
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsMobileMenuOpen(false);
                    }}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-400 hover:text-red-300 hover:bg-red-400/10 transition-all duration-200 w-full text-left"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                    Logout
                  </button>
                </nav>
              </div>
            </div>
          )}

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
              <div className="bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:border-[#38e07b]/20 transition-colors">
                <div className="flex flex-col">
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <h3 className="text-[32px] text-white font-bold mb-1">75 kg</h3>
                      <p className="text-[#9eb7a8] text-sm">Weight Over Time</p>
                    </div>
                    <span className="text-red-400 text-sm bg-red-400/10 px-3 py-1 rounded-full">Last 3 Months -2%</span>
                  </div>
                  <div className="h-[160px] w-full">
                    <Line data={weightData} options={chartOptions} />
                  </div>
                </div>
              </div>

              {/* Workout Frequency Card */}
              <div className="bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:border-[#38e07b]/20 transition-colors">
                <div className="flex flex-col">
                  <div className="flex justify-between items-start mb-6">
                    <div>
                      <h3 className="text-[32px] text-white font-bold mb-1">3 times/week</h3>
                      <p className="text-[#9eb7a8] text-sm">Workout Frequency</p>
                    </div>
                    <span className="text-[#38e07b] text-sm bg-[#38e07b]/10 px-3 py-1 rounded-full">This Week +1</span>
                  </div>
                  <div className="grid grid-cols-7 gap-2">
                    {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, i) => (
                      <div key={day} className="flex flex-col items-center gap-2">
                        <div className={`h-24 w-full ${
                          i % 2 === 0 
                            ? 'bg-[#38e07b]/10 hover:bg-[#38e07b]/20' 
                            : 'bg-white/5 hover:bg-white/10'
                          } rounded-xl transition-all cursor-pointer`}>
                        </div>
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
            <h2 className="text-xl text-white font-bold mb-1">Set New Goals</h2>
            <div className="bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-sm rounded-2xl p-6 border border-white/10">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-[#9eb7a8] mb-2">Target Weight (kg)</label>
                  <div className="relative">
                    <input
                      type="number"
                      value={editForm.targetWeight}
                      onChange={(e) => setEditForm({ ...editForm, targetWeight: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-[#29382f]/50 text-white border border-white/10 focus:border-[#38e07b] focus:ring-1 focus:ring-[#38e07b] transition-all placeholder-white/30"
                      placeholder="Enter your target weight"
                    />
                    <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
                      <span className="text-[#9eb7a8] text-sm">kg</span>
                    </div>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#9eb7a8] mb-2">Workout Frequency (times/week)</label>
                  <div className="relative">
                    <input
                      type="number"
                      value={editForm.workoutFrequency}
                      onChange={(e) => setEditForm({ ...editForm, workoutFrequency: e.target.value })}
                      className="w-full px-4 py-3 rounded-xl bg-[#29382f]/50 text-white border border-white/10 focus:border-[#38e07b] focus:ring-1 focus:ring-[#38e07b] transition-all placeholder-white/30"
                      placeholder="Enter your workout frequency"
                    />
                    <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
                      <span className="text-[#9eb7a8] text-sm">/ week</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-6">
                <button
                  onClick={handleSave}
                  className="flex items-center justify-center gap-2 w-full sm:w-auto bg-[#38e07b] text-black px-6 py-3 rounded-xl text-sm font-bold hover:bg-[#2bc665] transition-all focus:ring-2 focus:ring-[#38e07b] focus:ring-offset-2 focus:ring-offset-[#111714]"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M5 12L10 17L19 8" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  Update Goals
                </button>
              </div>
            </div>
          </section>
        </main>
      </div>
       {/* Bottom Navigation Bar - Mobile Only */}
       <nav className="fixed bottom-0 left-0 right-0 z-50 bg-[#1a1f1c] border-t border-[#38e07b]/10 flex justify-around items-center py-2 lg:hidden">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`flex flex-col items-center justify-center gap-1 px-2 py-1 rounded-lg transition-all duration-200 text-xs font-medium ${
              item.isActive ? 'text-[#38e07b]' : 'text-[#9eb7a8] hover:text-white'
            }`}
          >
            {item.icon}
            <span>{item.label}</span>
          </Link>
        ))}
        <nav/>
      </nav>
    </div>
  );
}
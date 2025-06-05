'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from "@/components/Navbar";
import Link from 'next/link';

interface Member {
  id: string;
  name: string;
  email: string;
  membershipPlan: string;
  profilePicture?: string;
}

interface AttendanceRecord {
  id: string;
  memberId: string;
  member: Member;
  checkInTime: string;
  checkOutTime?: string;
  status: 'checked-in' | 'checked-out';
}

export default function AttendancePage() {
  const router = useRouter();
  const [currentAttendance, setCurrentAttendance] = useState<AttendanceRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [showCheckInModal, setShowCheckInModal] = useState(false);
  const [members, setMembers] = useState<Member[]>([]);
  const [selectedMemberId, setSelectedMemberId] = useState('');

  useEffect(() => {
    fetchCurrentAttendance();
    fetchMembers();
  }, []);

  const fetchCurrentAttendance = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/');
      return;
    }

    try {
      const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      const response = await fetch(`${apiBaseUrl}/api/admin/attendance/current`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch attendance records');
      }

      const data = await response.json();
      setCurrentAttendance(data);
    } catch (error) {
      console.error('Error fetching attendance:', error);
      setError('Failed to load attendance records. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchMembers = async () => {
    const token = localStorage.getItem('token');
    if (!token) return;

    try {
      const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      const response = await fetch(`${apiBaseUrl}/api/admin/members`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch members');
      }

      const data = await response.json();
      setMembers(data);
    } catch (error) {
      console.error('Error fetching members:', error);
    }
  };

  const handleCheckIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      const token = localStorage.getItem('token');
      const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      const response = await fetch(`${apiBaseUrl}/api/admin/attendance/check-in`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          memberId: selectedMemberId
        })
      });

      if (!response.ok) {
        throw new Error('Failed to check in member');
      }

      setSuccess('Member checked in successfully!');
      setShowCheckInModal(false);
      setSelectedMemberId('');
      fetchCurrentAttendance();
    } catch (error) {
      console.error('Error checking in member:', error);
      setError('Failed to check in member. Please try again.');
    }
  };

  const handleCheckOut = async (recordId: string) => {
    try {
      const token = localStorage.getItem('token');
      const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      const response = await fetch(`${apiBaseUrl}/api/admin/attendance/check-out/${recordId}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to check out member');
      }

      setSuccess('Member checked out successfully!');
      fetchCurrentAttendance();
    } catch (error) {
      console.error('Error checking out member:', error);
      setError('Failed to check out member. Please try again.');
    }
  };

  const filteredAttendance = currentAttendance.filter(record =>
    record.member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    record.member.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#111714] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#38e07b]"></div>
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
              <h1 className="text-[32px] text-white font-bold tracking-[-0.02em] mb-1">Attendance Tracking</h1>
              <p className="text-[#9eb7a8] text-base">Monitor gym attendance and manage check-ins</p>
            </div>
            <button
              onClick={() => setShowCheckInModal(true)}
              className="bg-[#38e07b] text-black px-6 py-3 rounded-xl text-sm font-bold hover:bg-[#2bc665] transition-all"
            >
              Check In Member
            </button>
          </div>

          {/* Error and Success Messages */}
          {error && (
            <div className="mb-6 p-4 rounded-xl bg-red-400/10 border border-red-400/20 text-red-400">
              {error}
            </div>
          )}
          {success && (
            <div className="mb-6 p-4 rounded-xl bg-[#38e07b]/10 border border-[#38e07b]/20 text-[#38e07b]">
              {success}
            </div>
          )}

          {/* Search */}
          <div className="mb-6">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search members..."
              className="w-full px-4 py-3 rounded-xl bg-[#29382f]/50 text-white border border-white/10 focus:border-[#38e07b] focus:ring-1 focus:ring-[#38e07b] transition-all"
            />
          </div>

          {/* Current Attendance */}
          <div className="bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-sm rounded-2xl p-6 border border-white/10">
            <h2 className="text-xl text-white font-bold mb-6">Currently Checked In</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredAttendance.map((record) => (
                <div
                  key={record.id}
                  className="bg-[#1a1f1c] rounded-xl p-6 border border-white/10"
                >
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 rounded-full bg-[#29382f] flex items-center justify-center">
                      {record.member.profilePicture ? (
                        <img
                          src={record.member.profilePicture}
                          alt={record.member.name}
                          className="w-12 h-12 rounded-full object-cover"
                        />
                      ) : (
                        <span className="text-xl text-[#38e07b]">
                          {record.member.name.charAt(0).toUpperCase()}
                        </span>
                      )}
                    </div>
                    <div>
                      <h3 className="text-white font-bold">{record.member.name}</h3>
                      <p className="text-[#9eb7a8] text-sm">{record.member.email}</p>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[#9eb7a8] text-sm">Membership Plan</span>
                      <span className="text-white text-sm">{record.member.membershipPlan}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-[#9eb7a8] text-sm">Check-in Time</span>
                      <span className="text-white text-sm">
                        {new Date(record.checkInTime).toLocaleTimeString()}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-[#9eb7a8] text-sm">Duration</span>
                      <span className="text-white text-sm">
                        {(() => {
                          const checkIn = new Date(record.checkInTime);
                          const now = new Date();
                          const diff = now.getTime() - checkIn.getTime();
                          const hours = Math.floor(diff / (1000 * 60 * 60));
                          const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
                          return `${hours}h ${minutes}m`;
                        })()}
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => handleCheckOut(record.id)}
                    className="mt-4 w-full bg-red-400/10 text-red-400 px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-400/20 transition-colors"
                  >
                    Check Out
                  </button>
                </div>
              ))}
              {filteredAttendance.length === 0 && (
                <div className="col-span-full text-center py-12">
                  <p className="text-[#9eb7a8]">No members currently checked in</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Check In Modal */}
      {showCheckInModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="bg-[#1a1f1c] rounded-2xl p-8 w-full max-w-md m-4">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-white">Check In Member</h3>
              <button
                onClick={() => setShowCheckInModal(false)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <form onSubmit={handleCheckIn} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-[#9eb7a8] mb-2">Select Member</label>
                <select
                  value={selectedMemberId}
                  onChange={(e) => setSelectedMemberId(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-[#29382f]/50 text-white border border-white/10 focus:border-[#38e07b] focus:ring-1 focus:ring-[#38e07b] transition-all"
                  required
                >
                  <option value="">Select a member</option>
                  {members.map((member) => (
                    <option key={member.id} value={member.id}>
                      {member.name} - {member.membershipPlan}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex justify-end gap-4">
                <button
                  type="button"
                  onClick={() => setShowCheckInModal(false)}
                  className="px-6 py-3 rounded-xl text-sm font-medium text-[#9eb7a8] hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-[#38e07b] text-black px-6 py-3 rounded-xl text-sm font-bold hover:bg-[#2bc665] transition-all"
                >
                  Check In
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
} 
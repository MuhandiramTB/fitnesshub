'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from "@/components/Navbar";
import Link from 'next/link';

interface Member {
  id: string;
  name: string;
  email: string;
  phoneNumber: string;
  membershipPlan: string;
  joinDate: string;
  status: 'active' | 'inactive' | 'expired';
  lastAttendance: string;
}

export default function MembersPage() {
  const router = useRouter();
  const [members, setMembers] = useState<Member[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive' | 'expired'>('all');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phoneNumber: '',
    membershipPlan: '',
    status: 'active'
  });

  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/');
      return;
    }

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
      setError('Failed to load members. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateMember = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      const token = localStorage.getItem('token');
      const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      const response = await fetch(`${apiBaseUrl}/api/admin/members`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        throw new Error('Failed to create member');
      }

      setSuccess('Member created successfully!');
      setShowCreateModal(false);
      setFormData({
        name: '',
        email: '',
        phoneNumber: '',
        membershipPlan: '',
        status: 'active'
      });
      fetchMembers();
    } catch (error) {
      console.error('Error creating member:', error);
      setError('Failed to create member. Please try again.');
    }
  };

  const handleEditMember = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      const token = localStorage.getItem('token');
      const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      const response = await fetch(`${apiBaseUrl}/api/admin/members/${selectedMember?.id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        throw new Error('Failed to update member');
      }

      setSuccess('Member updated successfully!');
      setShowEditModal(false);
      setSelectedMember(null);
      fetchMembers();
    } catch (error) {
      console.error('Error updating member:', error);
      setError('Failed to update member. Please try again.');
    }
  };

  const handleDeleteMember = async (memberId: string) => {
    if (!confirm('Are you sure you want to delete this member?')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      const response = await fetch(`${apiBaseUrl}/api/admin/members/${memberId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to delete member');
      }

      setSuccess('Member deleted successfully!');
      fetchMembers();
    } catch (error) {
      console.error('Error deleting member:', error);
      setError('Failed to delete member. Please try again.');
    }
  };

  const filteredMembers = members.filter(member => {
    const matchesSearch = member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         member.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         member.phoneNumber.includes(searchQuery);
    const matchesStatus = statusFilter === 'all' || member.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

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
              <h1 className="text-[32px] text-white font-bold tracking-[-0.02em] mb-1">Members</h1>
              <p className="text-[#9eb7a8] text-base">Manage your gym members</p>
            </div>
            <button
              onClick={() => setShowCreateModal(true)}
              className="bg-[#38e07b] text-black px-6 py-3 rounded-xl text-sm font-bold hover:bg-[#2bc665] transition-all"
            >
              Add New Member
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

          {/* Filters */}
          <div className="mb-6 flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search members..."
                className="w-full px-4 py-3 rounded-xl bg-[#29382f]/50 text-white border border-white/10 focus:border-[#38e07b] focus:ring-1 focus:ring-[#38e07b] transition-all"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="px-4 py-3 rounded-xl bg-[#29382f]/50 text-white border border-white/10 focus:border-[#38e07b] focus:ring-1 focus:ring-[#38e07b] transition-all"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="expired">Expired</option>
            </select>
          </div>

          {/* Members Table */}
          <div className="bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-sm rounded-2xl border border-white/10 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="px-6 py-4 text-left text-sm font-medium text-[#9eb7a8]">Name</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-[#9eb7a8]">Email</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-[#9eb7a8]">Phone</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-[#9eb7a8]">Membership</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-[#9eb7a8]">Join Date</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-[#9eb7a8]">Status</th>
                    <th className="px-6 py-4 text-left text-sm font-medium text-[#9eb7a8]">Last Attendance</th>
                    <th className="px-6 py-4 text-right text-sm font-medium text-[#9eb7a8]">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/10">
                  {filteredMembers.map((member) => (
                    <tr key={member.id} className="hover:bg-white/5 transition-colors">
                      <td className="px-6 py-4 text-sm text-white">{member.name}</td>
                      <td className="px-6 py-4 text-sm text-[#9eb7a8]">{member.email}</td>
                      <td className="px-6 py-4 text-sm text-[#9eb7a8]">{member.phoneNumber}</td>
                      <td className="px-6 py-4 text-sm text-[#9eb7a8]">{member.membershipPlan}</td>
                      <td className="px-6 py-4 text-sm text-[#9eb7a8]">
                        {new Date(member.joinDate).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                          member.status === 'active'
                            ? 'bg-[#38e07b]/10 text-[#38e07b]'
                            : member.status === 'inactive'
                            ? 'bg-yellow-400/10 text-yellow-400'
                            : 'bg-red-400/10 text-red-400'
                        }`}>
                          {member.status.charAt(0).toUpperCase() + member.status.slice(1)}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-[#9eb7a8]">
                        {member.lastAttendance
                          ? new Date(member.lastAttendance).toLocaleDateString()
                          : 'Never'}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => {
                              setSelectedMember(member);
                              setFormData({
                                name: member.name,
                                email: member.email,
                                phoneNumber: member.phoneNumber,
                                membershipPlan: member.membershipPlan,
                                status: member.status
                              });
                              setShowEditModal(true);
                            }}
                            className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
                          >
                            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </button>
                          <button
                            onClick={() => handleDeleteMember(member.id)}
                            className="p-2 rounded-lg bg-red-400/10 hover:bg-red-400/20 transition-colors"
                          >
                            <svg className="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>

      {/* Create Member Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="bg-[#1a1f1c] rounded-2xl p-8 w-full max-w-2xl m-4">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-white">Add New Member</h3>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <form onSubmit={handleCreateMember} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-[#9eb7a8] mb-2">Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-[#29382f]/50 text-white border border-white/10 focus:border-[#38e07b] focus:ring-1 focus:ring-[#38e07b] transition-all"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#9eb7a8] mb-2">Email</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-[#29382f]/50 text-white border border-white/10 focus:border-[#38e07b] focus:ring-1 focus:ring-[#38e07b] transition-all"
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-[#9eb7a8] mb-2">Phone Number</label>
                  <input
                    type="tel"
                    value={formData.phoneNumber}
                    onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-[#29382f]/50 text-white border border-white/10 focus:border-[#38e07b] focus:ring-1 focus:ring-[#38e07b] transition-all"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#9eb7a8] mb-2">Membership Plan</label>
                  <select
                    value={formData.membershipPlan}
                    onChange={(e) => setFormData({ ...formData, membershipPlan: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-[#29382f]/50 text-white border border-white/10 focus:border-[#38e07b] focus:ring-1 focus:ring-[#38e07b] transition-all"
                    required
                  >
                    <option value="">Select a plan</option>
                    <option value="basic">Basic</option>
                    <option value="premium">Premium</option>
                    <option value="elite">Elite</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-[#9eb7a8] mb-2">Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                  className="w-full px-4 py-3 rounded-xl bg-[#29382f]/50 text-white border border-white/10 focus:border-[#38e07b] focus:ring-1 focus:ring-[#38e07b] transition-all"
                  required
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="expired">Expired</option>
                </select>
              </div>
              <div className="flex justify-end gap-4">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-6 py-3 rounded-xl text-sm font-medium text-[#9eb7a8] hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-[#38e07b] text-black px-6 py-3 rounded-xl text-sm font-bold hover:bg-[#2bc665] transition-all"
                >
                  Add Member
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Member Modal */}
      {showEditModal && selectedMember && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="bg-[#1a1f1c] rounded-2xl p-8 w-full max-w-2xl m-4">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-white">Edit Member</h3>
              <button
                onClick={() => {
                  setShowEditModal(false);
                  setSelectedMember(null);
                }}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <form onSubmit={handleEditMember} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-[#9eb7a8] mb-2">Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-[#29382f]/50 text-white border border-white/10 focus:border-[#38e07b] focus:ring-1 focus:ring-[#38e07b] transition-all"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#9eb7a8] mb-2">Email</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-[#29382f]/50 text-white border border-white/10 focus:border-[#38e07b] focus:ring-1 focus:ring-[#38e07b] transition-all"
                    required
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-[#9eb7a8] mb-2">Phone Number</label>
                  <input
                    type="tel"
                    value={formData.phoneNumber}
                    onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-[#29382f]/50 text-white border border-white/10 focus:border-[#38e07b] focus:ring-1 focus:ring-[#38e07b] transition-all"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#9eb7a8] mb-2">Membership Plan</label>
                  <select
                    value={formData.membershipPlan}
                    onChange={(e) => setFormData({ ...formData, membershipPlan: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-[#29382f]/50 text-white border border-white/10 focus:border-[#38e07b] focus:ring-1 focus:ring-[#38e07b] transition-all"
                    required
                  >
                    <option value="">Select a plan</option>
                    <option value="basic">Basic</option>
                    <option value="premium">Premium</option>
                    <option value="elite">Elite</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-[#9eb7a8] mb-2">Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                  className="w-full px-4 py-3 rounded-xl bg-[#29382f]/50 text-white border border-white/10 focus:border-[#38e07b] focus:ring-1 focus:ring-[#38e07b] transition-all"
                  required
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="expired">Expired</option>
                </select>
              </div>
              <div className="flex justify-end gap-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowEditModal(false);
                    setSelectedMember(null);
                  }}
                  className="px-6 py-3 rounded-xl text-sm font-medium text-[#9eb7a8] hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-[#38e07b] text-black px-6 py-3 rounded-xl text-sm font-bold hover:bg-[#2bc665] transition-all"
                >
                  Update Member
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
} 
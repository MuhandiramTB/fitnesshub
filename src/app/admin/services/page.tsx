'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Navbar from "@/components/Navbar";
import Link from 'next/link';

interface Service {
  id: string;
  name: string;
  description: string;
  price: number;
  billingCycle: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'annually' | 'fixed';
  category: 'fitness' | 'wellness' | 'training' | 'other';
  isActive: boolean;
  capacity: number;
  currentBookings: number;
}

export default function ServicesPage() {
  const router = useRouter();
  const [services, setServices] = useState<Service[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<'all' | 'fitness' | 'wellness' | 'training' | 'other'>('all');
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    billingCycle: 'monthly',
    category: 'fitness',
    isActive: true,
    capacity: ''
  });

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/');
      return;
    }

    try {
      const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      const response = await fetch(`${apiBaseUrl}/api/admin/services`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch services');
      }

      const data = await response.json();
      setServices(data);
    } catch (error) {
      console.error('Error fetching services:', error);
      setError('Failed to load services. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateService = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      const token = localStorage.getItem('token');
      const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      const response = await fetch(`${apiBaseUrl}/api/admin/services`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...formData,
          price: parseFloat(formData.price),
          capacity: parseInt(formData.capacity)
        })
      });

      if (!response.ok) {
        throw new Error('Failed to create service');
      }

      setSuccess('Service created successfully!');
      setShowCreateModal(false);
      setFormData({
        name: '',
        description: '',
        price: '',
        billingCycle: 'monthly',
        category: 'fitness',
        isActive: true,
        capacity: ''
      });
      fetchServices();
    } catch (error) {
      console.error('Error creating service:', error);
      setError('Failed to create service. Please try again.');
    }
  };

  const handleEditService = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      const token = localStorage.getItem('token');
      const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      const response = await fetch(`${apiBaseUrl}/api/admin/services/${selectedService?.id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...formData,
          price: parseFloat(formData.price),
          capacity: parseInt(formData.capacity)
        })
      });

      if (!response.ok) {
        throw new Error('Failed to update service');
      }

      setSuccess('Service updated successfully!');
      setShowEditModal(false);
      setSelectedService(null);
      fetchServices();
    } catch (error) {
      console.error('Error updating service:', error);
      setError('Failed to update service. Please try again.');
    }
  };

  const handleDeleteService = async (serviceId: string) => {
    if (!confirm('Are you sure you want to delete this service?')) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      const response = await fetch(`${apiBaseUrl}/api/admin/services/${serviceId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to delete service');
      }

      setSuccess('Service deleted successfully!');
      fetchServices();
    } catch (error) {
      console.error('Error deleting service:', error);
      setError('Failed to delete service. Please try again.');
    }
  };

  const filteredServices = services.filter(service => {
    const matchesSearch = service.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         service.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || service.category === categoryFilter;
    return matchesSearch && matchesCategory;
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
              <h1 className="text-[32px] text-white font-bold tracking-[-0.02em] mb-1">Services & Billing</h1>
              <p className="text-[#9eb7a8] text-base">Manage gym services and billing cycles</p>
            </div>
            <button
              onClick={() => setShowCreateModal(true)}
              className="bg-[#38e07b] text-black px-6 py-3 rounded-xl text-sm font-bold hover:bg-[#2bc665] transition-all"
            >
              Add New Service
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
                placeholder="Search services..."
                className="w-full px-4 py-3 rounded-xl bg-[#29382f]/50 text-white border border-white/10 focus:border-[#38e07b] focus:ring-1 focus:ring-[#38e07b] transition-all"
              />
            </div>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value as any)}
              className="px-4 py-3 rounded-xl bg-[#29382f]/50 text-white border border-white/10 focus:border-[#38e07b] focus:ring-1 focus:ring-[#38e07b] transition-all"
            >
              <option value="all">All Categories</option>
              <option value="fitness">Fitness</option>
              <option value="wellness">Wellness</option>
              <option value="training">Training</option>
              <option value="other">Other</option>
            </select>
          </div>

          {/* Services Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredServices.map((service) => (
              <div
                key={service.id}
                className="bg-gradient-to-br from-white/5 to-white/[0.02] backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:border-[#38e07b]/20 transition-colors"
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl text-white font-bold mb-1">{service.name}</h3>
                    <p className="text-[#9eb7a8] text-sm">LKR {service.price.toLocaleString()} / {service.billingCycle}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        setSelectedService(service);
                        setFormData({
                          name: service.name,
                          description: service.description,
                          price: service.price.toString(),
                          billingCycle: service.billingCycle,
                          category: service.category,
                          isActive: service.isActive,
                          capacity: service.capacity.toString()
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
                      onClick={() => handleDeleteService(service.id)}
                      className="p-2 rounded-lg bg-red-400/10 hover:bg-red-400/20 transition-colors"
                    >
                      <svg className="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </div>
                <p className="text-[#9eb7a8] text-sm mb-4">{service.description}</p>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[#9eb7a8] text-sm">Category</span>
                    <span className="text-white text-sm capitalize">{service.category}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[#9eb7a8] text-sm">Capacity</span>
                    <span className="text-white text-sm">{service.currentBookings}/{service.capacity}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[#9eb7a8] text-sm">Status</span>
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                      service.isActive
                        ? 'bg-[#38e07b]/10 text-[#38e07b]'
                        : 'bg-red-400/10 text-red-400'
                    }`}>
                      {service.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Create Service Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="bg-[#1a1f1c] rounded-2xl p-8 w-full max-w-2xl m-4">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-white">Add New Service</h3>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <form onSubmit={handleCreateService} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-[#9eb7a8] mb-2">Service Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-[#29382f]/50 text-white border border-white/10 focus:border-[#38e07b] focus:ring-1 focus:ring-[#38e07b] transition-all"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#9eb7a8] mb-2">Price (LKR)</label>
                  <input
                    type="number"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-[#29382f]/50 text-white border border-white/10 focus:border-[#38e07b] focus:ring-1 focus:ring-[#38e07b] transition-all"
                    required
                    min="0"
                    step="0.01"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-[#9eb7a8] mb-2">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-[#29382f]/50 text-white border border-white/10 focus:border-[#38e07b] focus:ring-1 focus:ring-[#38e07b] transition-all"
                  rows={3}
                  required
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-[#9eb7a8] mb-2">Billing Cycle</label>
                  <select
                    value={formData.billingCycle}
                    onChange={(e) => setFormData({ ...formData, billingCycle: e.target.value as any })}
                    className="w-full px-4 py-3 rounded-xl bg-[#29382f]/50 text-white border border-white/10 focus:border-[#38e07b] focus:ring-1 focus:ring-[#38e07b] transition-all"
                    required
                  >
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                    <option value="quarterly">Quarterly</option>
                    <option value="annually">Annually</option>
                    <option value="fixed">Fixed</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#9eb7a8] mb-2">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                    className="w-full px-4 py-3 rounded-xl bg-[#29382f]/50 text-white border border-white/10 focus:border-[#38e07b] focus:ring-1 focus:ring-[#38e07b] transition-all"
                    required
                  >
                    <option value="fitness">Fitness</option>
                    <option value="wellness">Wellness</option>
                    <option value="training">Training</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-[#9eb7a8] mb-2">Capacity</label>
                <input
                  type="number"
                  value={formData.capacity}
                  onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-[#29382f]/50 text-white border border-white/10 focus:border-[#38e07b] focus:ring-1 focus:ring-[#38e07b] transition-all"
                  required
                  min="1"
                />
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  className="w-4 h-4 rounded border-white/10 bg-[#29382f]/50 text-[#38e07b] focus:ring-[#38e07b]"
                />
                <label htmlFor="isActive" className="ml-2 text-sm text-[#9eb7a8]">
                  Active Service
                </label>
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
                  Add Service
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Service Modal */}
      {showEditModal && selectedService && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="bg-[#1a1f1c] rounded-2xl p-8 w-full max-w-2xl m-4">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-white">Edit Service</h3>
              <button
                onClick={() => {
                  setShowEditModal(false);
                  setSelectedService(null);
                }}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <form onSubmit={handleEditService} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-[#9eb7a8] mb-2">Service Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-[#29382f]/50 text-white border border-white/10 focus:border-[#38e07b] focus:ring-1 focus:ring-[#38e07b] transition-all"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#9eb7a8] mb-2">Price (LKR)</label>
                  <input
                    type="number"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-[#29382f]/50 text-white border border-white/10 focus:border-[#38e07b] focus:ring-1 focus:ring-[#38e07b] transition-all"
                    required
                    min="0"
                    step="0.01"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-[#9eb7a8] mb-2">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-[#29382f]/50 text-white border border-white/10 focus:border-[#38e07b] focus:ring-1 focus:ring-[#38e07b] transition-all"
                  rows={3}
                  required
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-[#9eb7a8] mb-2">Billing Cycle</label>
                  <select
                    value={formData.billingCycle}
                    onChange={(e) => setFormData({ ...formData, billingCycle: e.target.value as any })}
                    className="w-full px-4 py-3 rounded-xl bg-[#29382f]/50 text-white border border-white/10 focus:border-[#38e07b] focus:ring-1 focus:ring-[#38e07b] transition-all"
                    required
                  >
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                    <option value="quarterly">Quarterly</option>
                    <option value="annually">Annually</option>
                    <option value="fixed">Fixed</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#9eb7a8] mb-2">Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                    className="w-full px-4 py-3 rounded-xl bg-[#29382f]/50 text-white border border-white/10 focus:border-[#38e07b] focus:ring-1 focus:ring-[#38e07b] transition-all"
                    required
                  >
                    <option value="fitness">Fitness</option>
                    <option value="wellness">Wellness</option>
                    <option value="training">Training</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-[#9eb7a8] mb-2">Capacity</label>
                <input
                  type="number"
                  value={formData.capacity}
                  onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl bg-[#29382f]/50 text-white border border-white/10 focus:border-[#38e07b] focus:ring-1 focus:ring-[#38e07b] transition-all"
                  required
                  min="1"
                />
              </div>
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  className="w-4 h-4 rounded border-white/10 bg-[#29382f]/50 text-[#38e07b] focus:ring-[#38e07b]"
                />
                <label htmlFor="isActive" className="ml-2 text-sm text-[#9eb7a8]">
                  Active Service
                </label>
              </div>
              <div className="flex justify-end gap-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowEditModal(false);
                    setSelectedService(null);
                  }}
                  className="px-6 py-3 rounded-xl text-sm font-medium text-[#9eb7a8] hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-[#38e07b] text-black px-6 py-3 rounded-xl text-sm font-bold hover:bg-[#2bc665] transition-all"
                >
                  Update Service
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
} 
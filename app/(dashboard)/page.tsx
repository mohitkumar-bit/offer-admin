"use client";

import React, { useEffect, useState } from 'react';
import API from '@/lib/axios';
import { Users, Store, Ticket, Clock, ArrowUpRight, Loader2, Star } from 'lucide-react';

interface Stats {
  totalUsers: number;
  totalBusinesses: number;
  pendingBusinesses: number;
  totalCoupons: number;
  pendingCoupons?: number;
  approvedCoupons?: number;
  featuredCoupons?: number;
}

export default function DashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await API.get('/admin/dashboard');
        setStats(res.data);
      } catch (err) {
        console.error("Error fetching dashboard stats:", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <Loader2 className="animate-spin text-blue-600" size={40} />
      </div>
    );
  }

  const cards = [
    {
      label: 'Total Users',
      value: stats?.totalUsers || 0,
      icon: Users,
      color: 'bg-blue-500',
      lightColor: 'bg-blue-50',
      textColor: 'text-blue-600'
    },
    {
      label: 'Total Businesses',
      value: stats?.totalBusinesses || 0,
      icon: Store,
      color: 'bg-indigo-500',
      lightColor: 'bg-indigo-50',
      textColor: 'text-indigo-600'
    },
    {
      label: 'Pending Businesses',
      value: stats?.pendingBusinesses || 0,
      icon: Clock,
      color: 'bg-orange-500',
      lightColor: 'bg-orange-50',
      textColor: 'text-orange-600'
    },
    {
      label: 'Pending Offers',
      value: stats?.pendingCoupons || 0,
      icon: Ticket,
      color: 'bg-amber-500',
      lightColor: 'bg-amber-50',
      textColor: 'text-amber-600'
    },
    {
      label: 'Live Offers',
      value: stats?.approvedCoupons || 0,
      icon: Ticket,
      color: 'bg-emerald-500',
      lightColor: 'bg-emerald-50',
      textColor: 'text-emerald-600'
    },
    {
      label: 'Featured Posts',
      value: stats?.featuredCoupons || 0,
      icon: Star,
      color: 'bg-amber-500',
      lightColor: 'bg-amber-50',
      textColor: 'text-amber-600'
    },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard Overview</h1>
        <p className="text-gray-500">Welcome back! Here's what's happening today.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <div key={card.label} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 rounded-xl ${card.lightColor} ${card.textColor}`}>
                  <Icon size={24} />
                </div>
                <span className="flex items-center text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-1 rounded-full">
                  <ArrowUpRight size={14} className="mr-1" />
                  Active
                </span>
              </div>
              <div>
                <h3 className="text-gray-500 text-sm font-medium">{card.label}</h3>
                <p className="text-2xl font-bold text-gray-900 mt-1">{card.value.toLocaleString()}</p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Placeholder for Recent Activity or Charts */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 min-h-[300px]">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Quick Stats</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
              <span className="text-gray-600">Growth Month-over-Month</span>
              <span className="font-bold text-blue-600">+12.5%</span>
            </div>
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
              <span className="text-gray-600">Active Coupons</span>
              <span className="font-bold text-emerald-600">{stats?.totalCoupons}</span>
            </div>
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
              <span className="text-gray-600">Verification Rate</span>
              <span className="font-bold text-indigo-600">
                {stats?.totalBusinesses ? Math.round(((stats.totalBusinesses - stats.pendingBusinesses) / stats.totalBusinesses) * 100) : 100}%
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 min-h-[300px] flex flex-col justify-center items-center text-center">
          <div className="p-4 bg-blue-50 rounded-full text-blue-600 mb-4">
            <LayoutDashboard size={32} />
          </div>
          <h2 className="text-lg font-bold text-gray-900">System Insights</h2>
          <p className="text-gray-500 mt-2 max-w-xs">
            The platform is currently performing within optimal parameters.
          </p>
        </div>
      </div>
    </div>
  );
}

import { LayoutDashboard } from 'lucide-react';

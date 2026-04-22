"use client";

import React, { useEffect, useState } from 'react';
import API from '@/lib/axios';
import { CheckCircle, XCircle, Clock, Store, Mail, AlertTriangle, Loader2 } from 'lucide-react';

interface Business {
    _id: string;
    shopName: string;
    status: string;
    ownerId: {
        name: string;
        email: string;
    };
    category: string;
    createdAt: string;
}

export default function VerificationsPage() {
    const [businesses, setBusinesses] = useState<Business[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState<string | null>(null);

    const fetchPending = async () => {
        try {
            const res = await API.get('/admin/businesses?status=Pending');
            setBusinesses(res.data);
        } catch (err) {
            console.error("Error fetching pending businesses:", err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchPending();
    }, []);

    const handleAction = async (id: string, status: 'Approved' | 'Rejected') => {
        setActionLoading(id);
        try {
            await API.put(`/admin/businesses/${id}/verify`, { status });
            // Remove from list
            setBusinesses(businesses.filter(b => b._id !== id));
        } catch (err) {
            console.error(`Error updating business to ${status}:`, err);
        } finally {
            setActionLoading(null);
        }
    };

    if (isLoading) {
        return (
            <div className="h-full flex items-center justify-center">
                <Loader2 className="animate-spin text-blue-600" size={40} />
            </div>
        );
    }

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div>
                <h1 className="text-2xl font-bold text-gray-900">Pending Verifications</h1>
                <p className="text-gray-500">Review and approve new business applications.</p>
            </div>

            {businesses.length === 0 ? (
                <div className="bg-white p-12 rounded-2xl shadow-sm border border-gray-100 flex flex-col items-center justify-center text-center">
                    <div className="w-16 h-16 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mb-4">
                        <CheckCircle size={32} />
                    </div>
                    <h2 className="text-lg font-bold text-gray-900">All caught up!</h2>
                    <p className="text-gray-500 mt-1 max-w-sm">
                        There are no pending business verifications at the moment.
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {businesses.map((b) => (
                        <div key={b._id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col">
                            <div className="p-6 flex-1">
                                <div className="flex items-start justify-between mb-4">
                                    <div className="w-12 h-12 rounded-xl bg-orange-50 text-orange-500 flex items-center justify-center">
                                        <Store size={24} />
                                    </div>
                                    <span className="flex items-center gap-1.5 px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-orange-100 text-orange-700">
                                        <Clock size={12} /> Pending
                                    </span>
                                </div>
                                <h3 className="text-lg font-bold text-gray-900 leading-tight">{b.shopName}</h3>
                                <p className="text-sm text-gray-500 mt-1">{b.category}</p>

                                <div className="mt-6 space-y-3">
                                    <div className="flex items-center gap-3 text-sm text-gray-600">
                                        <Mail size={16} className="text-gray-400" />
                                        <span>{b.ownerId?.email}</span>
                                    </div>
                                    <div className="flex items-center gap-3 text-sm text-gray-600 font-medium">
                                        <div className="w-4 h-4 bg-gray-100 rounded-full flex items-center justify-center text-[10px]">👤</div>
                                        <span>{b.ownerId?.name}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="p-4 bg-gray-50 border-t border-gray-100 flex items-center gap-3">
                                <button
                                    onClick={() => handleAction(b._id, 'Approved')}
                                    disabled={!!actionLoading}
                                    className="flex-1 bg-white border border-gray-200 text-emerald-600 hover:bg-emerald-50 hover:border-emerald-200 py-2 rounded-lg text-sm font-bold transition-all flex items-center justify-center gap-2"
                                >
                                    {actionLoading === b._id ? <Loader2 className="animate-spin text-emerald-500" size={16} /> : <CheckCircle size={16} />}
                                    Approve
                                </button>
                                <button
                                    onClick={() => handleAction(b._id, 'Rejected')}
                                    disabled={!!actionLoading}
                                    className="flex-1 bg-white border border-gray-200 text-red-600 hover:bg-red-50 hover:border-red-200 py-2 rounded-lg text-sm font-bold transition-all flex items-center justify-center gap-2"
                                >
                                    {actionLoading === b._id ? <Loader2 className="animate-spin text-red-500" size={16} /> : <XCircle size={16} />}
                                    Reject
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

"use client";

import React, { useEffect, useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import API from '@/lib/axios';
import { Ticket, Store, Tag, Calendar, Search, Loader2, User, Info, XCircle, CheckCircle, Clock, ArrowLeft } from 'lucide-react';
import { SidePanel, DetailRow, DetailSection } from '@/components/SidePanel';

interface Coupon {
    _id: string;
    title: string;
    detail: string;
    discount: string;
    category?: string;
    status?: 'Pending' | 'Approved' | 'Rejected';
    businessId: {
        shopName: string;
        ownerId?: {
            name: string;
            email: string;
        };
    };
    expiryDate?: string;
    createdAt: string;
}

type StatusFilter = 'all' | 'Pending' | 'Approved' | 'Rejected';

function CouponsPageContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const businessIdFilter = searchParams.get('businessId');
    const shopNameFilter = searchParams.get('shopName');

    const [coupons, setCoupons] = useState<Coupon[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState<StatusFilter>(businessIdFilter ? 'all' : 'Pending');
    const [selectedCoupon, setSelectedCoupon] = useState<Coupon | null>(null);
    const [actionLoading, setActionLoading] = useState<string | null>(null);

    const fetchCoupons = async () => {
        try {
            setIsLoading(true);
            const params = new URLSearchParams();
            if (statusFilter !== 'all') params.set('status', statusFilter);
            if (businessIdFilter) params.set('businessId', businessIdFilter);
            const query = params.toString() ? `?${params.toString()}` : '';
            const res = await API.get(`/admin/coupons${query}`);
            setCoupons(res.data);
        } catch (err) {
            console.error("Error fetching coupons:", err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchCoupons();
    }, [statusFilter, businessIdFilter]);

    const handleVerify = async (id: string, status: 'Approved' | 'Rejected') => {
        setActionLoading(id);
        try {
            await API.put(`/admin/coupons/${id}/verify`, { status });
            setCoupons((prev) => prev.filter((c) => c._id !== id));
            setSelectedCoupon(null);
        } catch (err) {
            console.error(`Error updating coupon to ${status}:`, err);
            alert('Failed to update coupon status');
        } finally {
            setActionLoading(null);
        }
    };

    const handleDeleteCoupon = async (id: string) => {
        if (!window.confirm("Are you sure you want to delete this coupon? This action cannot be undone.")) return;

        try {
            await API.delete(`/admin/coupons/${id}`);
            setCoupons(coupons.filter(c => c._id !== id));
            setSelectedCoupon(null);
        } catch (err) {
            console.error("Error deleting coupon:", err);
            alert("Failed to delete coupon");
        }
    };

    const filteredCoupons = coupons.filter((c) =>
        c.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.businessId?.shopName?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const statusBadge = (status?: string) => {
        if (status === 'Approved') return 'bg-emerald-100 text-emerald-700';
        if (status === 'Rejected') return 'bg-red-100 text-red-700';
        return 'bg-orange-100 text-orange-700';
    };

    if (isLoading) {
        return (
            <div className="h-full flex items-center justify-center">
                <Loader2 className="animate-spin text-blue-600" size={40} />
            </div>
        );
    }

    return (
        <>
            <div className="space-y-6 animate-in fade-in duration-500">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">
                            {businessIdFilter ? `${shopNameFilter || 'Business'} Posts` : 'Offer Approvals'}
                        </h1>
                        <p className="text-gray-500">
                            {businessIdFilter
                                ? `Showing all offers posted by ${shopNameFilter || 'this business'}.`
                                : 'Review and approve coupons before they appear in the app.'}
                        </p>
                    </div>

                    <div className="relative w-full md:w-96">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                            <Search size={18} />
                        </div>
                        <input
                            type="text"
                            placeholder="Search coupon or business..."
                            className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                {businessIdFilter && (
                    <div className="flex items-center justify-between gap-4 bg-blue-50 border border-blue-100 rounded-2xl px-5 py-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center">
                                <Store size={18} />
                            </div>
                            <div>
                                <div className="text-sm font-bold text-blue-900">{shopNameFilter || 'Business posts'}</div>
                                <div className="text-xs text-blue-700">{filteredCoupons.length} post(s) shown</div>
                            </div>
                        </div>
                        <button
                            onClick={() => router.push('/coupons')}
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold bg-white text-blue-700 border border-blue-200 hover:bg-blue-100 transition-colors"
                        >
                            <ArrowLeft size={16} />
                            All Offers
                        </button>
                    </div>
                )}

                <div className="flex flex-wrap gap-2">
                    {(['Pending', 'Approved', 'Rejected', 'all'] as StatusFilter[]).map((filter) => (
                        <button
                            key={filter}
                            onClick={() => setStatusFilter(filter)}
                            className={`px-4 py-2 rounded-xl text-sm font-semibold transition-colors ${
                                statusFilter === filter
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
                            }`}
                        >
                            {filter === 'all' ? 'All' : filter}
                        </button>
                    ))}
                </div>

                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="bg-gray-50 border-b border-gray-100">
                                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Coupon</th>
                                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Business</th>
                                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Discount</th>
                                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {filteredCoupons.length > 0 ? (
                                    filteredCoupons.map((c) => (
                                        <tr
                                            key={c._id}
                                            onClick={() => setSelectedCoupon(c)}
                                            className="hover:bg-gray-50 transition-colors cursor-pointer"
                                        >
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center">
                                                        <Ticket size={20} />
                                                    </div>
                                                    <div>
                                                        <div className="font-semibold text-gray-900">{c.title}</div>
                                                        <div className="text-xs text-gray-400 truncate max-w-[200px]">{c.detail}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2 text-sm text-gray-700">
                                                    <Store size={14} className="text-gray-400" />
                                                    {c.businessId?.shopName}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-700">
                                                    <Tag size={12} /> {c.discount}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${statusBadge(c.status)}`}>
                                                    {c.status === 'Pending' && <Clock size={12} />}
                                                    {c.status || 'Pending'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4" onClick={(e) => e.stopPropagation()}>
                                                <div className="flex items-center gap-2">
                                                    {c.status === 'Pending' && (
                                                        <>
                                                            <button
                                                                onClick={() => handleVerify(c._id, 'Approved')}
                                                                disabled={!!actionLoading}
                                                                className="px-3 py-1.5 rounded-lg text-xs font-bold bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                                                            >
                                                                Approve
                                                            </button>
                                                            <button
                                                                onClick={() => handleVerify(c._id, 'Rejected')}
                                                                disabled={!!actionLoading}
                                                                className="px-3 py-1.5 rounded-lg text-xs font-bold bg-red-50 text-red-700 hover:bg-red-100"
                                                            >
                                                                Reject
                                                            </button>
                                                        </>
                                                    )}
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={5} className="px-6 py-10 text-center text-gray-500">
                                            No coupons found for this filter.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            <SidePanel
                open={!!selectedCoupon}
                onClose={() => setSelectedCoupon(null)}
                header={
                    <div className="h-36 bg-gradient-to-br from-purple-600 to-indigo-700 flex items-end p-6">
                        <div className="flex items-end gap-4">
                            <div className="w-14 h-14 rounded-2xl bg-white flex items-center justify-center text-purple-600 shadow-lg">
                                <Ticket size={26} />
                            </div>
                            <div className="text-white min-w-0">
                                <h2 className="text-xl font-bold truncate">{selectedCoupon?.title}</h2>
                                <p className="text-purple-100 text-sm">{selectedCoupon?.businessId?.shopName}</p>
                            </div>
                        </div>
                    </div>
                }
                footer={
                    selectedCoupon ? (
                        <div className="flex gap-3">
                            {selectedCoupon.status === 'Pending' && (
                                <>
                                    <button
                                        onClick={() => handleVerify(selectedCoupon._id, 'Approved')}
                                        disabled={!!actionLoading}
                                        className="flex-1 py-3 bg-emerald-600 text-white rounded-2xl font-bold hover:bg-emerald-700 transition-colors flex items-center justify-center gap-2"
                                    >
                                        <CheckCircle size={18} /> Approve
                                    </button>
                                    <button
                                        onClick={() => handleVerify(selectedCoupon._id, 'Rejected')}
                                        disabled={!!actionLoading}
                                        className="flex-1 py-3 bg-red-50 text-red-600 rounded-2xl font-bold hover:bg-red-100 transition-colors flex items-center justify-center gap-2"
                                    >
                                        <XCircle size={18} /> Reject
                                    </button>
                                </>
                            )}
                            <button
                                onClick={() => handleDeleteCoupon(selectedCoupon._id)}
                                className="px-5 py-3 bg-red-50 text-red-600 rounded-2xl font-bold hover:bg-red-100 transition-colors flex items-center gap-2"
                            >
                                <XCircle size={18} /> Delete
                            </button>
                        </div>
                    ) : null
                }
            >
                {selectedCoupon && (
                    <>
                        <div className="flex items-center gap-3">
                            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${statusBadge(selectedCoupon.status)}`}>
                                {selectedCoupon.status || 'Pending'}
                            </span>
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-700">
                                <Tag size={12} /> {selectedCoupon.discount}
                            </span>
                        </div>

                        <p className="text-sm text-slate-600 leading-relaxed">{selectedCoupon.detail}</p>

                        <DetailSection title="Offer Details">
                            <DetailRow icon={Ticket} label="Title" value={selectedCoupon.title} />
                            <DetailRow icon={Tag} label="Discount" value={selectedCoupon.discount} />
                            <DetailRow icon={Tag} label="Category" value={selectedCoupon.category} />
                            {selectedCoupon.expiryDate && (
                                <DetailRow icon={Calendar} label="Expires" value={new Date(selectedCoupon.expiryDate).toLocaleDateString()} />
                            )}
                        </DetailSection>

                        <DetailSection title="Business">
                            <DetailRow icon={Store} label="Shop Name" value={selectedCoupon.businessId?.shopName} />
                            <DetailRow icon={User} label="Owner" value={selectedCoupon.businessId?.ownerId?.name} />
                            <DetailRow icon={Info} label="Owner Email" value={selectedCoupon.businessId?.ownerId?.email} />
                        </DetailSection>

                        <DetailSection title="Timeline">
                            <DetailRow icon={Calendar} label="Created" value={new Date(selectedCoupon.createdAt).toLocaleString()} />
                        </DetailSection>
                    </>
                )}
            </SidePanel>
        </>
    );
}

export default function CouponsPage() {
    return (
        <Suspense fallback={
            <div className="h-full flex items-center justify-center">
                <Loader2 className="animate-spin text-blue-600" size={40} />
            </div>
        }>
            <CouponsPageContent />
        </Suspense>
    );
}

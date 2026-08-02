"use client";

import React, { useEffect, useState } from 'react';
import API from '@/lib/axios';
import {
    Star,
    Search,
    Loader2,
    Ticket,
    Store,
    Tag,
    Clock,
    CheckCircle2,
} from 'lucide-react';
import { SidePanel, DetailRow, DetailSection } from '@/components/SidePanel';

interface Coupon {
    _id: string;
    title: string;
    detail: string;
    discount: string;
    category?: string;
    status?: string;
    isActive?: boolean;
    isFeatured?: boolean;
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

type ViewFilter = 'all' | 'featured' | 'available';

export default function FeaturedPage() {
    const [coupons, setCoupons] = useState<Coupon[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [viewFilter, setViewFilter] = useState<ViewFilter>('all');
    const [selectedCoupon, setSelectedCoupon] = useState<Coupon | null>(null);
    const [actionLoading, setActionLoading] = useState<string | null>(null);

    const fetchCoupons = async () => {
        try {
            setIsLoading(true);
            const res = await API.get('/admin/coupons?status=Approved');
            const liveOffers = res.data.filter((c: Coupon) => c.isActive !== false);
            setCoupons(liveOffers);
        } catch (err) {
            console.error('Error fetching coupons:', err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchCoupons();
    }, []);

    const handleToggleFeature = async (coupon: Coupon) => {
        const nextValue = !coupon.isFeatured;
        setActionLoading(coupon._id);
        try {
            await API.put(`/admin/coupons/${coupon._id}/feature`, { isFeatured: nextValue });
            const updated = coupons.map((c) =>
                c._id === coupon._id ? { ...c, isFeatured: nextValue } : c
            );
            setCoupons(updated);
            if (selectedCoupon?._id === coupon._id) {
                setSelectedCoupon({ ...selectedCoupon, isFeatured: nextValue });
            }
        } catch (err: any) {
            alert(err.response?.data?.message || 'Failed to update featured status');
        } finally {
            setActionLoading(null);
        }
    };

    const featuredCount = coupons.filter((c) => c.isFeatured).length;

    const filteredCoupons = coupons.filter((c) => {
        const matchesSearch =
            c.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            c.businessId?.shopName?.toLowerCase().includes(searchTerm.toLowerCase());

        if (!matchesSearch) return false;
        if (viewFilter === 'featured') return c.isFeatured;
        if (viewFilter === 'available') return !c.isFeatured;
        return true;
    });

    if (isLoading) {
        return (
            <div className="h-full flex items-center justify-center">
                <Loader2 className="animate-spin text-blue-600" size={40} />
            </div>
        );
    }

    return (
        <>
            <div className="space-y-6 animate-in fade-in duration-500 pb-12">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">Featured Posts</h1>
                        <p className="text-gray-500">
                            Choose which approved offers appear in the app&apos;s Featured section.
                        </p>
                    </div>

                    <div className="relative w-full md:w-96">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                            <Search size={18} />
                        </div>
                        <input
                            type="text"
                            placeholder="Search offer or business..."
                            className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-amber-50 border border-amber-100 rounded-2xl p-5">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center">
                                <Star size={20} />
                            </div>
                            <div>
                                <div className="text-2xl font-bold text-amber-900">{featuredCount}</div>
                                <div className="text-sm text-amber-700">Currently Featured</div>
                            </div>
                        </div>
                    </div>
                    <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-5">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center">
                                <CheckCircle2 size={20} />
                            </div>
                            <div>
                                <div className="text-2xl font-bold text-emerald-900">{coupons.length}</div>
                                <div className="text-sm text-emerald-700">Live Offers</div>
                            </div>
                        </div>
                    </div>
                    <div className="bg-blue-50 border border-blue-100 rounded-2xl p-5">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center">
                                <Ticket size={20} />
                            </div>
                            <div>
                                <div className="text-2xl font-bold text-blue-900">{coupons.length - featuredCount}</div>
                                <div className="text-sm text-blue-700">Available to Feature</div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex flex-wrap gap-2">
                    {([
                        ['all', 'All Live Offers'],
                        ['featured', 'Featured'],
                        ['available', 'Not Featured'],
                    ] as [ViewFilter, string][]).map(([filter, label]) => (
                        <button
                            key={filter}
                            onClick={() => setViewFilter(filter)}
                            className={`px-4 py-2 rounded-xl text-sm font-semibold transition-colors ${
                                viewFilter === filter
                                    ? 'bg-amber-500 text-white'
                                    : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
                            }`}
                        >
                            {label}
                        </button>
                    ))}
                </div>

                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead>
                                <tr className="bg-gray-50 border-b border-gray-100">
                                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Offer</th>
                                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Business</th>
                                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Discount</th>
                                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Featured</th>
                                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Action</th>
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
                                                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${c.isFeatured ? 'bg-amber-100 text-amber-600' : 'bg-purple-100 text-purple-600'}`}>
                                                        {c.isFeatured ? <Star size={18} fill="currentColor" /> : <Ticket size={20} />}
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
                                                {c.isFeatured ? (
                                                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-700">
                                                        <Star size={12} fill="currentColor" /> Featured
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-gray-100 text-gray-500">
                                                        <Clock size={12} /> Not featured
                                                    </span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4 text-right" onClick={(e) => e.stopPropagation()}>
                                                <button
                                                    onClick={() => handleToggleFeature(c)}
                                                    disabled={actionLoading === c._id}
                                                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                                                        c.isFeatured
                                                            ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                                            : 'bg-amber-50 text-amber-700 hover:bg-amber-100'
                                                    }`}
                                                >
                                                    {actionLoading === c._id ? (
                                                        <Loader2 className="animate-spin inline" size={14} />
                                                    ) : c.isFeatured ? (
                                                        'Remove'
                                                    ) : (
                                                        'Feature'
                                                    )}
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={5} className="px-6 py-10 text-center text-gray-500">
                                            No live offers found. Approve offers first before featuring them.
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
                    <div className="h-36 bg-gradient-to-br from-amber-500 to-orange-600 flex items-end p-6">
                        <div className="flex items-end gap-4">
                            <div className="w-14 h-14 rounded-2xl bg-white flex items-center justify-center text-amber-600 shadow-lg">
                                <Star size={26} fill={selectedCoupon?.isFeatured ? 'currentColor' : 'none'} />
                            </div>
                            <div className="text-white min-w-0">
                                <h2 className="text-xl font-bold truncate">{selectedCoupon?.title}</h2>
                                <p className="text-amber-100 text-sm">{selectedCoupon?.businessId?.shopName}</p>
                            </div>
                        </div>
                    </div>
                }
                footer={
                    selectedCoupon ? (
                        <button
                            onClick={() => handleToggleFeature(selectedCoupon)}
                            disabled={actionLoading === selectedCoupon._id}
                            className={`w-full py-3 rounded-2xl font-bold transition-colors flex items-center justify-center gap-2 ${
                                selectedCoupon.isFeatured
                                    ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                    : 'bg-amber-500 text-white hover:bg-amber-600'
                            }`}
                        >
                            <Star size={18} fill={selectedCoupon.isFeatured ? 'currentColor' : 'none'} />
                            {selectedCoupon.isFeatured ? 'Remove from Featured' : 'Add to Featured'}
                        </button>
                    ) : null
                }
            >
                {selectedCoupon && (
                    <>
                        <div className="flex items-center gap-3">
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-700">
                                Live
                            </span>
                            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${selectedCoupon.isFeatured ? 'bg-amber-100 text-amber-700' : 'bg-gray-100 text-gray-500'}`}>
                                {selectedCoupon.isFeatured ? 'Featured in app' : 'Not featured'}
                            </span>
                        </div>

                        <p className="text-sm text-slate-600 leading-relaxed">{selectedCoupon.detail}</p>

                        <DetailSection title="Offer Details">
                            <DetailRow icon={Ticket} label="Title" value={selectedCoupon.title} />
                            <DetailRow icon={Tag} label="Discount" value={selectedCoupon.discount} />
                            <DetailRow icon={Tag} label="Category" value={selectedCoupon.category} />
                        </DetailSection>

                        <DetailSection title="Business">
                            <DetailRow icon={Store} label="Shop Name" value={selectedCoupon.businessId?.shopName} />
                        </DetailSection>
                    </>
                )}
            </SidePanel>
        </>
    );
}

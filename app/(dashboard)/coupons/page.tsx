"use client";

import React, { useEffect, useState } from 'react';
import API from '@/lib/axios';
import { Ticket, Store, Tag, Calendar, Search, Loader2, X, User, MapPin, Info, XCircle } from 'lucide-react';

interface Coupon {
    _id: string;
    couponTitle: string;
    description: string;
    discountValue: string;
    businessId: {
        shopName: string;
        ownerId?: {
            name: string;
            email: string;
        };
    };
    expiryDate: string;
    createdAt: string;
}

export default function CouponsPage() {
    const [coupons, setCoupons] = useState<Coupon[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCoupon, setSelectedCoupon] = useState<Coupon | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        const fetchCoupons = async () => {
            try {
                const res = await API.get('/admin/coupons');
                setCoupons(res.data);
            } catch (err) {
                console.error("Error fetching coupons:", err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchCoupons();
    }, []);



    const handleDeleteCoupon = async (id: string) => {
        if (!window.confirm("Are you sure you want to delete this coupon? This action cannot be undone.")) return;

        try {
            await API.delete(`/admin/coupons/${id}`);
            setCoupons(coupons.filter(c => c._id !== id));
            setIsModalOpen(false);
            setSelectedCoupon(null);
        } catch (err) {
            console.error("Error deleting coupon:", err);
            alert("Failed to delete coupon");
        }
    };
    const filteredCoupons = coupons.filter((c) =>
        c.couponTitle?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.businessId?.shopName?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    if (isLoading) {
        return (
            <div className="h-full flex items-center justify-center">
                <Loader2 className="animate-spin text-blue-600" size={40} />
            </div>
        );
    }

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">Offers & Coupons</h1>
                    <p className="text-gray-500">Overview of all coupons across the platform.</p>
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

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-gray-50 border-b border-gray-100">
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Coupon</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Business</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Value</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Expiry</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {filteredCoupons.length > 0 ? (
                                filteredCoupons.map((c) => (
                                    <tr
                                        key={c._id}
                                        className="hover:bg-gray-50 transition-colors cursor-pointer group"
                                        onClick={() => {
                                            setSelectedCoupon(c);
                                            setIsModalOpen(true);
                                        }}
                                    >
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center">
                                                    <Ticket size={20} />
                                                </div>
                                                <div>
                                                    <div className="font-semibold text-gray-900">{c.couponTitle}</div>
                                                    <div className="text-xs text-gray-400 truncate max-w-[200px]">{c.description}</div>
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
                                                <Tag size={12} /> {c.discountValue}% OFF
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2 text-sm text-gray-600 font-medium">
                                                <Calendar size={14} className="text-gray-400" />
                                                {new Date(c.expiryDate).toLocaleDateString()}
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={4} className="px-6 py-10 text-center text-gray-500">
                                        No coupons found.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Coupon Details Modal */}
            {isModalOpen && selectedCoupon && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
                        <div className="relative h-32 bg-gradient-to-r from-blue-600 to-indigo-700 flex items-center justify-center">
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="absolute top-4 right-4 p-2 bg-white/20 hover:bg-white/30 rounded-full text-white transition-colors"
                            >
                                <X size={20} />
                            </button>
                            <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-blue-600 shadow-lg">
                                <Ticket size={32} />
                            </div>
                        </div>

                        <div className="p-8 space-y-6">
                            <div>
                                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">{selectedCoupon.couponTitle}</h2>
                                <p className="text-slate-500 dark:text-slate-400 mt-2">{selectedCoupon.description}</p>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-2xl">
                                    <div className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider mb-1">Discount</div>
                                    <div className="text-lg font-bold text-blue-700 dark:text-blue-300 flex items-center gap-1.5">
                                        <Tag size={18} /> {selectedCoupon.discountValue}% OFF
                                    </div>
                                </div>
                                <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-2xl">
                                    <div className="text-xs font-bold text-purple-600 dark:text-purple-400 uppercase tracking-wider mb-1">Expires</div>
                                    <div className="text-lg font-bold text-purple-700 dark:text-purple-300 flex items-center gap-1.5">
                                        <Calendar size={18} /> {new Date(selectedCoupon.expiryDate).toLocaleDateString()}
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="flex items-start gap-3">
                                    <div className="mt-1 w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500">
                                        <Store size={16} />
                                    </div>
                                    <div>
                                        <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Business</div>
                                        <div className="text-sm font-semibold text-slate-900 dark:text-white">{selectedCoupon.businessId.shopName}</div>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3">
                                    <div className="mt-1 w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500">
                                        <User size={16} />
                                    </div>
                                    <div>
                                        <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Created By (Owner)</div>
                                        <div className="text-sm font-semibold text-slate-900 dark:text-white">{selectedCoupon.businessId.ownerId?.name || 'N/A'}</div>
                                        <div className="text-xs text-slate-500">{selectedCoupon.businessId.ownerId?.email}</div>
                                    </div>
                                </div>

                                <div className="flex items-start gap-3">
                                    <div className="mt-1 w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-500">
                                        <Info size={16} />
                                    </div>
                                    <div>
                                        <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Additional Info</div>
                                        <div className="text-xs text-slate-500">Created on {new Date(selectedCoupon.createdAt).toLocaleString()}</div>
                                        <div className="text-xs text-slate-500">Coupon ID: {selectedCoupon._id}</div>
                                    </div>
                                </div>
                            </div>

                            <div className="flex gap-3 pt-2">
                                <button
                                    onClick={() => setIsModalOpen(false)}
                                    className="flex-1 py-3 bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white rounded-2xl font-bold hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                                >
                                    Close
                                </button>
                                <button
                                    onClick={() => selectedCoupon && handleDeleteCoupon(selectedCoupon._id)}
                                    className="px-6 py-3 bg-red-50 text-red-600 rounded-2xl font-bold hover:bg-red-100 transition-colors flex items-center gap-2"
                                >
                                    <XCircle size={18} /> Delete Coupon
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

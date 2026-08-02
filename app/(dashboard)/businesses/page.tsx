"use client";

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import API from '@/lib/axios';
import {
    Store,
    Search,
    Loader2,
    CheckCircle2,
    XCircle,
    MapPin,
    Mail,
    Ticket,
    User,
    Phone,
    Tag,
    Calendar,
    Hash,
} from 'lucide-react';
import { SidePanel, DetailRow, DetailSection } from '@/components/SidePanel';

interface Business {
    _id: string;
    shopName: string;
    ownerName: string;
    businessType: string;
    location: string;
    phone: string;
    email: string;
    promoCode?: string;
    thumbnail?: string;
    status: string;
    postCount?: number;
    createdAt?: string;
    updatedAt?: string;
    ownerId: {
        name: string;
        email: string;
    };
}

export default function BusinessesPage() {
    const router = useRouter();
    const [businesses, setBusinesses] = useState<Business[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedBusiness, setSelectedBusiness] = useState<Business | null>(null);

    useEffect(() => {
        const fetchBusinesses = async () => {
            try {
                const res = await API.get('/admin/businesses');
                setBusinesses(res.data);
            } catch (err) {
                console.error("Error fetching businesses:", err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchBusinesses();
    }, []);

    const filteredBusinesses = businesses.filter((b) =>
        b.shopName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        b.ownerId?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        b.businessType?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleToggleBlock = async (id: string, currentStatus: string) => {
        const newStatus = currentStatus === 'Blocked' ? 'Approved' : 'Blocked';
        try {
            await API.put(`/admin/businesses/${id}/verify`, { status: newStatus });
            const updated = businesses.map(b => b._id === id ? { ...b, status: newStatus } : b);
            setBusinesses(updated);
            if (selectedBusiness?._id === id) {
                setSelectedBusiness({ ...selectedBusiness, status: newStatus });
            }
        } catch (err) {
            console.error("Error toggling business status:", err);
        }
    };

    const handleViewPosts = (business: Business) => {
        const params = new URLSearchParams({
            businessId: business._id,
            shopName: business.shopName,
        });
        router.push(`/coupons?${params.toString()}`);
    };

    const statusClass = (status: string) => {
        if (status === 'Approved') return 'bg-emerald-100 text-emerald-700';
        if (status === 'Rejected') return 'bg-red-100 text-red-700';
        if (status === 'Blocked') return 'bg-red-600 text-white';
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
            <div className="space-y-8 animate-in fade-in duration-500 pb-12">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight">Businesses</h1>
                        <p className="text-slate-500 dark:text-slate-400 mt-1">Manage partner shops and verification status.</p>
                    </div>

                    <div className="relative w-full md:w-96 group">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-blue-500 transition-colors">
                            <Search size={18} />
                        </div>
                        <input
                            type="text"
                            placeholder="Search shops or owners..."
                            className="block w-full pl-11 pr-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-sm"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-100 dark:border-slate-800 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="bg-slate-50/50 dark:bg-slate-800/50 border-b border-slate-100 dark:border-slate-800">
                                    <th className="px-8 py-5 text-[11px] font-bold text-slate-400 uppercase tracking-widest">Shop Name</th>
                                    <th className="px-8 py-5 text-[11px] font-bold text-slate-400 uppercase tracking-widest">Owner info</th>
                                    <th className="px-8 py-5 text-[11px] font-bold text-slate-400 uppercase tracking-widest">Category</th>
                                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Total Posts</th>
                                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {filteredBusinesses.length > 0 ? (
                                    filteredBusinesses.map((b) => (
                                        <tr
                                            key={b._id}
                                            onClick={() => setSelectedBusiness(b)}
                                            className="hover:bg-gray-50 transition-colors cursor-pointer"
                                        >
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold ${b.status === 'Blocked' ? 'bg-red-50 text-red-400' : 'bg-indigo-100 text-indigo-600'
                                                        }`}>
                                                        <Store size={20} />
                                                    </div>
                                                    <div>
                                                        <div className={`font-semibold ${b.status === 'Blocked' ? 'text-gray-400 line-through' : 'text-gray-900'}`}>{b.shopName}</div>
                                                        <div className="text-xs text-gray-400 flex items-center gap-1">
                                                            <MapPin size={10} /> {b.location}
                                                        </div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className={b.status === 'Blocked' ? 'opacity-50' : ''}>
                                                    <div className="text-sm font-medium text-gray-900">{b.ownerId?.name}</div>
                                                    <div className="text-xs text-gray-500 flex items-center gap-1">
                                                        <Mail size={10} /> {b.ownerId?.email}
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${b.status === 'Blocked' ? 'bg-gray-50 text-gray-400' : 'bg-gray-100 text-gray-800'
                                                    }`}>
                                                    {b.businessType || 'N/A'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-purple-50 text-purple-700">
                                                    <Ticket size={12} />
                                                    {b.postCount ?? 0}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${statusClass(b.status)}`}>
                                                    {b.status === 'Approved' ? <CheckCircle2 size={14} /> :
                                                        b.status === 'Rejected' || b.status === 'Blocked' ? <XCircle size={14} /> : null}
                                                    {b.status}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-right" onClick={(e) => e.stopPropagation()}>
                                                <div className="flex items-center justify-end gap-2">
                                                    <button
                                                        onClick={() => handleViewPosts(b)}
                                                        className="px-3 py-1.5 rounded-lg text-xs font-bold bg-blue-50 text-blue-600 hover:bg-blue-100 transition-all"
                                                    >
                                                        View Posts
                                                    </button>
                                                    <button
                                                        onClick={() => handleToggleBlock(b._id, b.status)}
                                                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${b.status === 'Blocked'
                                                            ? 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100'
                                                            : 'bg-red-50 text-red-600 hover:bg-red-100'
                                                            }`}
                                                    >
                                                        {b.status === 'Blocked' ? 'Restore' : 'Block Shop'}
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={6} className="px-6 py-10 text-center text-gray-500">
                                            No businesses found.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            <SidePanel
                open={!!selectedBusiness}
                onClose={() => setSelectedBusiness(null)}
                header={
                    <div className="relative h-40 bg-gradient-to-br from-indigo-600 to-blue-700">
                        {selectedBusiness?.thumbnail ? (
                            <img
                                src={selectedBusiness.thumbnail}
                                alt={selectedBusiness.shopName}
                                className="absolute inset-0 w-full h-full object-cover opacity-30"
                            />
                        ) : null}
                        <div className="absolute bottom-0 left-0 right-0 p-6">
                            <div className="flex items-end gap-4">
                                <div className="w-16 h-16 rounded-2xl bg-white flex items-center justify-center text-indigo-600 shadow-lg shrink-0 overflow-hidden">
                                    {selectedBusiness?.thumbnail ? (
                                        <img src={selectedBusiness.thumbnail} alt="" className="w-full h-full object-cover" />
                                    ) : (
                                        <Store size={28} />
                                    )}
                                </div>
                                <div className="text-white min-w-0">
                                    <h2 className="text-xl font-bold truncate">{selectedBusiness?.shopName}</h2>
                                    <p className="text-indigo-100 text-sm">{selectedBusiness?.businessType}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                }
                footer={
                    selectedBusiness ? (
                        <div className="flex gap-3">
                            <button
                                onClick={() => handleViewPosts(selectedBusiness)}
                                className="flex-1 py-3 bg-blue-600 text-white rounded-2xl font-bold hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
                            >
                                <Ticket size={18} />
                                View Posts
                            </button>
                            <button
                                onClick={() => handleToggleBlock(selectedBusiness._id, selectedBusiness.status)}
                                className={`px-5 py-3 rounded-2xl font-bold transition-colors ${selectedBusiness.status === 'Blocked'
                                    ? 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100'
                                    : 'bg-red-50 text-red-600 hover:bg-red-100'
                                    }`}
                            >
                                {selectedBusiness.status === 'Blocked' ? 'Restore' : 'Block'}
                            </button>
                        </div>
                    ) : null
                }
            >
                {selectedBusiness && (
                    <>
                        <div className="flex items-center justify-between">
                            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${statusClass(selectedBusiness.status)}`}>
                                {selectedBusiness.status}
                            </span>
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-purple-50 text-purple-700">
                                <Ticket size={12} />
                                {selectedBusiness.postCount ?? 0} posts
                            </span>
                        </div>

                        <DetailSection title="Business Details">
                            <DetailRow icon={Store} label="Shop Name" value={selectedBusiness.shopName} />
                            <DetailRow icon={Tag} label="Category" value={selectedBusiness.businessType} />
                            <DetailRow icon={MapPin} label="Location" value={selectedBusiness.location} />
                            <DetailRow icon={Mail} label="Business Email" value={selectedBusiness.email} />
                            <DetailRow icon={Phone} label="Phone" value={selectedBusiness.phone} />
                            {selectedBusiness.promoCode && (
                                <DetailRow icon={Hash} label="Promo Code" value={selectedBusiness.promoCode} />
                            )}
                        </DetailSection>

                        <DetailSection title="Owner Details">
                            <DetailRow icon={User} label="Owner Name" value={selectedBusiness.ownerName || selectedBusiness.ownerId?.name} />
                            <DetailRow icon={Mail} label="Owner Email" value={selectedBusiness.ownerId?.email} />
                        </DetailSection>

                        <DetailSection title="Timeline">
                            {selectedBusiness.createdAt && (
                                <DetailRow icon={Calendar} label="Registered" value={new Date(selectedBusiness.createdAt).toLocaleString()} />
                            )}
                            {selectedBusiness.updatedAt && (
                                <DetailRow icon={Calendar} label="Last Updated" value={new Date(selectedBusiness.updatedAt).toLocaleString()} />
                            )}
                        </DetailSection>
                    </>
                )}
            </SidePanel>
        </>
    );
}

"use client";

import React, { useEffect, useState } from 'react';
import API from '@/lib/axios';
import { Users, Mail, Phone, Calendar, Search, Loader2 } from 'lucide-react';

interface User {
    _id: string;
    name: string;
    email: string;
    phone?: string;
    role: string;
    isBlocked?: boolean;
    createdAt: string;
}

export default function UsersPage() {
    const [users, setUsers] = useState<User[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [actionLoading, setActionLoading] = useState<string | null>(null);

    const fetchUsers = async () => {
        try {
            const res = await API.get('/admin/users');
            setUsers(res.data);
        } catch (err) {
            console.error("Error fetching users:", err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleToggleBlock = async (id: string) => {
        setActionLoading(id);
        try {
            const res = await API.put(`/admin/users/${id}/block`);
            const updatedUser = res.data.user;
            setUsers(users.map(u => u._id === id ? { ...u, isBlocked: updatedUser.isBlocked } : u));
        } catch (err) {
            console.error("Error toggling user block status:", err);
        } finally {
            setActionLoading(null);
        }
    };

    const filteredUsers = users.filter((user) =>
        user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.phone?.includes(searchTerm)
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
                    <h1 className="text-2xl font-bold text-gray-900">Users Management</h1>
                    <p className="text-gray-500">View and manage all registered users.</p>
                </div>

                <div className="relative w-full md:w-96">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                        <Search size={18} />
                    </div>
                    <input
                        type="text"
                        placeholder="Search by name, email or phone..."
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
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">User</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Contact</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Role</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Joined</th>
                                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {filteredUsers.length > 0 ? (
                                filteredUsers.map((user) => (
                                    <tr key={user._id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold relative">
                                                    {user.name?.charAt(0) || 'U'}
                                                    {user.isBlocked && (
                                                        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-red-500 border-2 border-white rounded-full" title="Blocked"></div>
                                                    )}
                                                </div>
                                                <div>
                                                    <div className={`font-semibold ${user.isBlocked ? 'text-gray-400 line-through' : 'text-gray-900'}`}>{user.name}</div>
                                                    <div className="text-xs text-gray-400">ID: {user._id.substring(0, 8)}...</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="space-y-1">
                                                <div className={`flex items-center gap-2 text-sm ${user.isBlocked ? 'text-gray-400' : 'text-gray-600'}`}>
                                                    <Mail size={14} className="text-gray-400" />
                                                    {user.email}
                                                </div>
                                                {user.phone && (
                                                    <div className={`flex items-center gap-2 text-sm ${user.isBlocked ? 'text-gray-400' : 'text-gray-600'}`}>
                                                        <Phone size={14} className="text-gray-400" />
                                                        {user.phone}
                                                    </div>
                                                )}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${user.isBlocked ? 'bg-red-50 text-red-600 border border-red-100' :
                                                    user.role === 'admin' ? 'bg-purple-100 text-purple-800' :
                                                        user.role === 'business' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'
                                                }`}>
                                                {user.isBlocked ? 'blocked' : user.role}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className={`flex items-center gap-2 text-sm font-medium ${user.isBlocked ? 'text-gray-400' : 'text-gray-600'}`}>
                                                <Calendar size={14} className="text-gray-400" />
                                                {new Date(user.createdAt).toLocaleDateString()}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            {user.role !== 'admin' && (
                                                <button
                                                    onClick={() => handleToggleBlock(user._id)}
                                                    disabled={actionLoading === user._id}
                                                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${user.isBlocked
                                                            ? 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100'
                                                            : 'bg-red-50 text-red-600 hover:bg-red-100'
                                                        } disabled:opacity-50`}
                                                >
                                                    {actionLoading === user._id ? (
                                                        <Loader2 className="animate-spin" size={14} />
                                                    ) : (
                                                        user.isBlocked ? 'Unblock' : 'Block'
                                                    )}
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={5} className="px-6 py-10 text-center text-gray-500">
                                        No users found matching your search.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

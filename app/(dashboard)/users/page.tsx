"use client";

import React, { useEffect, useState } from 'react';
import API from '@/lib/axios';
import { Users, Mail, Phone, Calendar, Search, Loader2, User, Hash, Shield } from 'lucide-react';
import { SidePanel, DetailRow, DetailSection } from '@/components/SidePanel';

interface UserRecord {
    _id: string;
    name: string;
    email: string;
    phone?: string;
    role: string;
    avatar?: string;
    isBlocked?: boolean;
    createdAt: string;
    updatedAt?: string;
}

export default function UsersPage() {
    const [users, setUsers] = useState<UserRecord[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [actionLoading, setActionLoading] = useState<string | null>(null);
    const [selectedUser, setSelectedUser] = useState<UserRecord | null>(null);

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
            if (selectedUser?._id === id) {
                setSelectedUser({ ...selectedUser, isBlocked: updatedUser.isBlocked });
            }
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

    const roleBadge = (user: UserRecord) => {
        if (user.isBlocked) return 'bg-red-50 text-red-600 border border-red-100';
        if (user.role === 'admin') return 'bg-purple-100 text-purple-800';
        return 'bg-gray-100 text-gray-800';
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
                                        <tr
                                            key={user._id}
                                            onClick={() => setSelectedUser(user)}
                                            className="hover:bg-gray-50 transition-colors cursor-pointer"
                                        >
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
                                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${roleBadge(user)}`}>
                                                    {user.isBlocked ? 'blocked' : user.role}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className={`flex items-center gap-2 text-sm font-medium ${user.isBlocked ? 'text-gray-400' : 'text-gray-600'}`}>
                                                    <Calendar size={14} className="text-gray-400" />
                                                    {new Date(user.createdAt).toLocaleDateString()}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-right" onClick={(e) => e.stopPropagation()}>
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

            <SidePanel
                open={!!selectedUser}
                onClose={() => setSelectedUser(null)}
                header={
                    <div className="h-36 bg-gradient-to-br from-blue-600 to-indigo-700 flex items-end p-6">
                        <div className="flex items-end gap-4">
                            <div className="w-14 h-14 rounded-2xl bg-white flex items-center justify-center text-blue-600 shadow-lg text-xl font-bold">
                                {selectedUser?.name?.charAt(0) || 'U'}
                            </div>
                            <div className="text-white min-w-0">
                                <h2 className="text-xl font-bold truncate">{selectedUser?.name}</h2>
                                <p className="text-blue-100 text-sm">{selectedUser?.email}</p>
                            </div>
                        </div>
                    </div>
                }
                footer={
                    selectedUser && selectedUser.role !== 'admin' ? (
                        <button
                            onClick={() => handleToggleBlock(selectedUser._id)}
                            disabled={actionLoading === selectedUser._id}
                            className={`w-full py-3 rounded-2xl font-bold transition-colors ${selectedUser.isBlocked
                                ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                                : 'bg-red-50 text-red-600 hover:bg-red-100'
                                }`}
                        >
                            {selectedUser.isBlocked ? 'Unblock User' : 'Block User'}
                        </button>
                    ) : null
                }
            >
                {selectedUser && (
                    <>
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold ${roleBadge(selectedUser)}`}>
                            {selectedUser.isBlocked ? 'Blocked' : selectedUser.role}
                        </span>

                        <DetailSection title="Account Details">
                            <DetailRow icon={User} label="Full Name" value={selectedUser.name} />
                            <DetailRow icon={Mail} label="Email" value={selectedUser.email} />
                            <DetailRow icon={Phone} label="Phone" value={selectedUser.phone} />
                            <DetailRow icon={Shield} label="Role" value={selectedUser.role} />
                            <DetailRow icon={Hash} label="User ID" value={selectedUser._id} />
                        </DetailSection>

                        <DetailSection title="Timeline">
                            <DetailRow icon={Calendar} label="Joined" value={new Date(selectedUser.createdAt).toLocaleString()} />
                            {selectedUser.updatedAt && (
                                <DetailRow icon={Calendar} label="Last Updated" value={new Date(selectedUser.updatedAt).toLocaleString()} />
                            )}
                        </DetailSection>
                    </>
                )}
            </SidePanel>
        </>
    );
}

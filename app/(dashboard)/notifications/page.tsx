"use client";

import React, { useState, useEffect } from 'react';
import API from '@/lib/axios';
import { Bell, Send, Loader2, AlertCircle, CheckCircle2, Trash2, History } from 'lucide-react';

export default function NotificationsPage() {
    const [title, setTitle] = useState('');
    const [message, setMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isFetching, setIsFetching] = useState(true);
    const [notifications, setNotifications] = useState<any[]>([]);
    const [status, setStatus] = useState<{ type: 'success' | 'error', message: string } | null>(null);

    useEffect(() => {
        fetchNotifications();
    }, []);

    const fetchNotifications = async () => {
        try {
            const res = await API.get('/admin/notifications');
            setNotifications(res.data);
        } catch (err) {
            console.error('Error fetching notifications:', err);
        } finally {
            setIsFetching(false);
        }
    };

    const handleSend = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setStatus(null);

        try {
            await API.post('/admin/notifications', { title, message, type: 'global' });
            setStatus({ type: 'success', message: 'Notification sent successfully to all users!' });
            setTitle('');
            setMessage('');
            fetchNotifications(); // Refresh list
        } catch (err: any) {
            setStatus({ type: 'error', message: err.response?.data?.message || 'Failed to send notification' });
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this notification?')) return;

        try {
            await API.delete(`/admin/notifications/${id}`);
            setNotifications(prev => prev.filter(n => n._id !== id));
        } catch (err) {
            console.error('Error deleting notification:', err);
            alert('Failed to delete notification');
        }
    };

    return (
        <div className="max-w-4xl mx-auto space-y-12 animate-in fade-in duration-500 py-8">
            <div className="max-w-2xl mx-auto">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight text-center">Push Notifications</h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-1 text-center">Send global announcements to all app users.</p>
                </div>

                <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-xl border border-slate-100 dark:border-slate-800 overflow-hidden mt-8">
                    <div className="p-8">
                        <form onSubmit={handleSend} className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-sm font-bold text-slate-700 dark:text-slate-300 ml-1">Notification Title</label>
                                <input
                                    type="text"
                                    placeholder="e.g. Weekend Flash Sale! ⚡️"
                                    className="block w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-bold text-slate-700 dark:text-slate-300 ml-1">Message Content</label>
                                <textarea
                                    placeholder="Describe your announcement..."
                                    rows={4}
                                    className="block w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium resize-none"
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    required
                                />
                            </div>

                            {status && (
                                <div className={`p-4 rounded-2xl flex items-start gap-3 animate-in slide-in-from-top-2 duration-300 ${status.type === 'success' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100' : 'bg-red-50 text-red-700 border border-red-100'
                                    }`}>
                                    {status.type === 'success' ? <CheckCircle2 className="shrink-0" size={20} /> : <AlertCircle className="shrink-0" size={20} />}
                                    <span className="text-sm font-semibold">{status.message}</span>
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-blue-200 dark:shadow-none transition-all disabled:opacity-70 active:scale-[0.98]"
                            >
                                {isLoading ? <Loader2 className="animate-spin" size={20} /> : <><Send size={18} /> Send Notification Now</>}
                            </button>
                        </form>
                    </div>

                    <div className="px-8 py-6 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-800">
                        <div className="flex items-center gap-3 text-slate-500">
                            <Bell className="text-blue-500" size={20} />
                            <p className="text-xs font-medium">Notifications sent from here are pushed immediately to the "Notifications" tab in the user applications.</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="mt-12">
                <div className="flex items-center gap-2 mb-6">
                    <History className="text-slate-400" size={20} />
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white">Sent Notifications History</h2>
                </div>

                {isFetching ? (
                    <div className="flex justify-center py-12">
                        <Loader2 className="animate-spin text-blue-500" size={32} />
                    </div>
                ) : notifications.length === 0 ? (
                    <div className="text-center py-12 bg-white dark:bg-slate-900 rounded-3xl border border-dashed border-slate-200 dark:border-slate-800">
                        <Bell className="mx-auto text-slate-300 mb-3" size={40} />
                        <p className="text-slate-500 font-medium">No notifications sent yet.</p>
                    </div>
                ) : (
                    <div className="grid gap-4">
                        {notifications.map((notif) => (
                            <div key={notif._id} className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 flex items-start justify-between group hover:border-blue-500/30 transition-all">
                                <div className="space-y-1">
                                    <h3 className="font-bold text-slate-900 dark:text-white">{notif.title}</h3>
                                    <p className="text-slate-600 dark:text-slate-400 text-sm">{notif.message}</p>
                                    <div className="flex items-center gap-2 mt-2">
                                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${notif.type === 'global' ? 'bg-blue-50 text-blue-600' : 'bg-purple-50 text-purple-600'}`}>
                                            {notif.type}
                                        </span>
                                        <span className="text-[10px] text-slate-400 font-medium">
                                            {new Date(notif.createdAt).toLocaleString()}
                                        </span>
                                    </div>
                                </div>
                                <button
                                    onClick={() => handleDelete(notif._id)}
                                    className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
                                    title="Delete notification"
                                >
                                    <Trash2 size={18} />
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}


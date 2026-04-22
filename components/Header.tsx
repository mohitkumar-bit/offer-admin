"use client";

import React from 'react';
import { useAuth } from '../context/AuthContext';
import { LogOut, User } from 'lucide-react';

export default function Header() {
    const { admin, logout } = useAuth();

    return (
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 shadow-sm">
            <div className="text-xl font-semibold text-gray-800">Admin Portal</div>

            {admin && (
                <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2 text-gray-600">
                        <User size={20} />
                        <span className="font-medium text-sm">{admin.name || 'Admin User'}</span>
                        <span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full ml-1">
                            Admin
                        </span>
                    </div>

                    <button
                        onClick={logout}
                        className="flex items-center gap-2 text-sm text-gray-500 hover:text-red-600 transition-colors"
                    >
                        <LogOut size={18} />
                        <span>Logout</span>
                    </button>
                </div>
            )}
        </header>
    );
}

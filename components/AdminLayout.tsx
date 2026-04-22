"use client";

import React, { useState } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import { useAuth } from '../context/AuthContext';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const { token, isLoading } = useAuth();
    const [isCollapsed, setIsCollapsed] = useState(false);

    // If calculating authentication state, show empty or loading
    if (isLoading) {
        return <div className="h-screen flex items-center justify-center bg-gray-50">Loading...</div>;
    }

    // If no token exists, the AuthContext pushes to '/login', 
    // but to prevent flash of content we can return null here.
    if (!token) {
        return null;
    }

    return (
        <div className="flex h-screen bg-gray-50 overflow-hidden font-sans">
            <Sidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
            <div className="flex flex-col flex-1 overflow-hidden transition-all duration-300 ease-in-out">
                <Header />
                <main className="flex-1 overflow-y-auto p-6 md:p-8">
                    <div className="max-w-7xl mx-auto h-full">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}

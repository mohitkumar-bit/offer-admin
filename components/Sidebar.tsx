"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, CheckSquare, Users, Store, Ticket, ChevronLeft, ChevronRight, Bell, Star } from 'lucide-react';

const navItems = [
    { label: 'Dashboard', href: '/', icon: LayoutDashboard },
    { label: 'Business Approvals', href: '/verifications', icon: CheckSquare },
    { label: 'Businesses', href: '/businesses', icon: Store },
    { label: 'Users', href: '/users', icon: Users },
    { label: 'Offer Approvals', href: '/coupons', icon: Ticket },
    { label: 'Featured Posts', href: '/featured', icon: Star },
    { label: 'Notifications', href: '/notifications', icon: Bell },
];

interface SidebarProps {
    isCollapsed: boolean;
    setIsCollapsed: (value: boolean) => void;
}

export default function Sidebar({ isCollapsed, setIsCollapsed }: SidebarProps) {
    const pathname = usePathname();

    return (
        <aside
            className={`bg-gray-900 text-white flex flex-col h-full border-r border-gray-800 transition-all duration-300 ease-in-out relative ${isCollapsed ? 'w-20' : 'w-64'
                }`}
        >
            <div className={`h-16 flex items-center border-b border-gray-800 px-6 ${isCollapsed ? 'justify-center' : 'justify-between'}`}>
                {!isCollapsed && <span className="text-xl font-bold tracking-wider animate-in fade-in">OfferAdmin</span>}
                {isCollapsed && <span className="text-xl font-bold text-blue-500">OA</span>}
            </div>

            <button
                onClick={() => setIsCollapsed(!isCollapsed)}
                className="absolute -right-3 top-20 bg-blue-600 text-white rounded-full p-1 shadow-lg hover:bg-blue-700 transition-colors z-10"
            >
                {isCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
            </button>

            <nav className="flex-1 py-6 px-4 space-y-2 overflow-y-auto overflow-x-hidden">
                {navItems.map((item) => {
                    const isActive = pathname === item.href;
                    const Icon = item.icon;

                    return (
                        <Link
                            key={item.label}
                            href={item.href}
                            title={isCollapsed ? item.label : undefined}
                            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${isActive
                                ? 'bg-blue-600 text-white shadow-md'
                                : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                                } ${isCollapsed ? 'justify-center px-2' : ''}`}
                        >
                            <Icon size={20} className="shrink-0" />
                            {!isCollapsed && (
                                <span className="font-medium truncate animate-in slide-in-from-left-2 duration-300">
                                    {item.label}
                                </span>
                            )}
                        </Link>
                    );
                })}
            </nav>

            <div className={`p-4 border-t border-gray-800 text-xs text-gray-500 text-center ${isCollapsed ? 'px-1' : ''}`}>
                {isCollapsed ? '©' : `© ${new Date().getFullYear()} OfferAdmin`}
            </div>
        </aside>
    );
}

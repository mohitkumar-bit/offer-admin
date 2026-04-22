"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import { useRouter, usePathname } from 'next/navigation';
import API from '../lib/axios';

interface AuthContextType {
    token: string | null;
    admin: any | null;
    login: (token: string, adminData: any, refreshToken: string) => void;
    logout: () => void;
    isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [token, setToken] = useState<string | null>(null);
    const [admin, setAdmin] = useState<any | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        const storedToken = Cookies.get('adminToken');
        const storedAdmin = Cookies.get('adminData');

        if (storedToken && storedAdmin) {
            setToken(storedToken);
            try {
                setAdmin(JSON.parse(storedAdmin));
            } catch (e) {
                setAdmin(null);
            }
        } else if (pathname !== '/login') {
            router.push('/login');
        }

        const handleUnauthorized = () => {
            // This line seems to be an error in the instruction, as `user` is not defined here.
            // Assuming the intent was to call `logout()` or handle re-authentication.
            // For now, I'll keep the original `logout()` as `user` is not available in this scope.
            // If the intention was to re-login, more context or a different approach would be needed.
            logout();
        };

        window.addEventListener('unauthorized', handleUnauthorized);

        setIsLoading(false);

        return () => {
            window.removeEventListener('unauthorized', handleUnauthorized);
        };
    }, [pathname, router]);

    const login = (newToken: string, adminData: any, newRefreshToken: string) => {
        // Only allow admins to login to this dashboard
        if (adminData.role !== 'admin') {
            throw new Error("Access Denied. You do not have admin privileges.");
        }

        Cookies.set('adminToken', newToken, { expires: 7 });
        Cookies.set('adminRefreshToken', newRefreshToken, { expires: 7 });
        Cookies.set('adminData', JSON.stringify(adminData), { expires: 7 });
        setToken(newToken);
        setAdmin(adminData);
        router.push('/');
    };

    const logout = () => {
        Cookies.remove('adminToken');
        Cookies.remove('adminRefreshToken');
        Cookies.remove('adminData');
        setToken(null);
        setAdmin(null);
        router.push('/login');
    };

    return (
        <AuthContext.Provider value={{ token, admin, login, logout, isLoading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

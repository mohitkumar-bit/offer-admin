"use client";

import React from 'react';
import { X } from 'lucide-react';

interface SidePanelProps {
    open: boolean;
    onClose: () => void;
    header: React.ReactNode;
    footer?: React.ReactNode;
    children: React.ReactNode;
}

export function SidePanel({ open, onClose, header, footer, children }: SidePanelProps) {
    if (!open) return null;

    return (
        <div className="fixed inset-0 z-50 flex justify-end">
            <div
                className="absolute inset-0 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200"
                onClick={onClose}
            />

            <div className="relative w-full max-w-md h-full bg-white shadow-2xl animate-in slide-in-from-right duration-300 flex flex-col">
                <div className="relative shrink-0">
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 z-10 p-2 bg-white/20 hover:bg-white/30 rounded-full text-white transition-colors"
                    >
                        <X size={20} />
                    </button>
                    {header}
                </div>

                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                    {children}
                </div>

                {footer && (
                    <div className="p-6 border-t border-slate-100 shrink-0">
                        {footer}
                    </div>
                )}
            </div>
        </div>
    );
}

interface DetailRowProps {
    icon: React.ComponentType<{ size?: number; className?: string }>;
    label: string;
    value?: string;
}

export function DetailRow({ icon: Icon, label, value }: DetailRowProps) {
    return (
        <div className="flex items-start gap-3">
            <div className="mt-0.5 w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center text-slate-500 shrink-0">
                <Icon size={16} />
            </div>
            <div className="min-w-0">
                <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">{label}</div>
                <div className="text-sm font-semibold text-slate-900 break-words">{value || 'N/A'}</div>
            </div>
        </div>
    );
}

export function DetailSection({ title, children }: { title: string; children: React.ReactNode }) {
    return (
        <section className="space-y-4">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">{title}</h3>
            {children}
        </section>
    );
}

'use client';

import type { ReactNode } from 'react';
import { ThemeProvider } from '@/components/ThemeProvider';
import { Sidebar } from '@/components/Sidebar';

export function ClientLayout({ children }: { children: ReactNode }) {
    return (
        <ThemeProvider>
            <div className="flex min-h-screen">
                <Sidebar />
                <main className="ml-64 flex-1">
                    {children}
                </main>
            </div>
        </ThemeProvider>
    );
}

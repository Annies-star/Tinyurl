'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, BarChart2, Settings, Sun, Moon, LinkIcon } from 'lucide-react';
import { useTheme } from './ThemeProvider';
import { cn } from '@/lib/utils';
import { Button } from './ui/button';

const navItems = [
    { href: '/', label: 'Dashboard', icon: Home },
    { href: '/analytics', label: 'Analytics', icon: BarChart2 },
    { href: '/settings', label: 'Settings', icon: Settings },
];

export function Sidebar() {
    const pathname = usePathname();
    const { theme, toggleTheme } = useTheme();

    return (
        <aside className="fixed left-0 top-0 z-40 h-screen w-64 border-r bg-card">
            <div className="flex h-full flex-col">
                {/* Logo */}
                <div className="flex h-16 items-center gap-2 border-b px-6">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-purple-500 to-blue-500">
                        <LinkIcon className="h-5 w-5 text-white" />
                    </div>
                    <span className="bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-xl font-bold text-transparent">
                        TinyLink
                    </span>
                </div>

                {/* Navigation */}
                <nav className="flex-1 space-y-1 p-4">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={cn(
                                    'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                                    isActive
                                        ? 'bg-primary text-primary-foreground'
                                        : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                                )}
                            >
                                <Icon className="h-5 w-5" />
                                {item.label}
                            </Link>
                        );
                    })}
                </nav>

                {/* Theme Toggle & User */}
                <div className="border-t p-4">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={toggleTheme}
                        className="mb-3 w-full justify-start gap-2"
                    >
                        {theme === 'dark' ? (
                            <>
                                <Sun className="h-4 w-4" />
                                Light Mode
                            </>
                        ) : (
                            <>
                                <Moon className="h-4 w-4" />
                                Dark Mode
                            </>
                        )}
                    </Button>
                    <div className="flex items-center gap-3 rounded-lg bg-muted px-3 py-2">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-purple-500 to-blue-500 text-xs font-semibold text-white">
                            U
                        </div>
                        <div className="flex-1 overflow-hidden">
                            <div className="truncate text-sm font-medium">User</div>
                            <div className="truncate text-xs text-muted-foreground">user@tinylink.com</div>
                        </div>
                    </div>
                </div>
            </div>
        </aside>
    );
}

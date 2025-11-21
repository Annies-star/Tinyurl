import Link from 'next/link';
import { Link as LinkIcon } from 'lucide-react';

export function Header() {
    return (
        <header className="glass-strong sticky top-0 z-50 border-b">
            <div className="container mx-auto flex h-16 items-center justify-between px-4">
                <Link href="/" className="flex items-center gap-2 text-lg font-bold tracking-tight transition-opacity hover:opacity-80">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-gray-800 to-gray-600 shadow-lg">
                        <LinkIcon className="h-5 w-5 text-white" />
                    </div>
                    <span className="text-foreground">TinyLink</span>
                </Link>
                <nav className="flex items-center gap-6">
                    <Link href="/" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
                        Dashboard
                    </Link>
                    <Link href="https://github.com" target="_blank" rel="noopener noreferrer" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
                        GitHub
                    </Link>
                </nav>
            </div>
        </header>
    );
}

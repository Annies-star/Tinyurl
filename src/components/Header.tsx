import Link from 'next/link';
import { Link as LinkIcon } from 'lucide-react';

export function Header() {
    return (
        <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-black/20 backdrop-blur-xl supports-[backdrop-filter]:bg-black/20">
            <div className="container mx-auto flex h-16 items-center justify-between px-4">
                <Link href="/" className="flex items-center gap-2 text-lg font-bold tracking-tight text-white transition-opacity hover:opacity-80">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg shadow-indigo-500/20">
                        <LinkIcon className="h-5 w-5 text-white" />
                    </div>
                    <span className="bg-gradient-to-r from-white to-white/80 bg-clip-text text-transparent">TinyLink</span>
                </Link>
                <nav className="flex items-center gap-6">
                    <Link href="/" className="text-sm font-medium text-zinc-400 transition-colors hover:text-white">
                        Dashboard
                    </Link>
                    <a
                        href="https://github.com"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm font-medium text-zinc-400 transition-colors hover:text-white"
                    >
                        GitHub
                    </a>
                </nav>
            </div>
        </header>
    );
}

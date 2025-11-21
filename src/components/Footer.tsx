export function Footer() {
    return (
        <footer className="border-t border-white/10 bg-black/20 py-8 backdrop-blur-xl">
            <div className="container mx-auto flex flex-col items-center justify-between gap-4 px-4 md:flex-row">
                <p className="text-center text-sm text-zinc-500 md:text-left">
                    &copy; {new Date().getFullYear()} TinyLink. Built for the Take-Home Assignment.
                </p>
                <div className="flex gap-4">
                    <a href="#" className="text-sm text-zinc-500 transition-colors hover:text-white">
                        Privacy
                    </a>
                    <a href="#" className="text-sm text-zinc-500 transition-colors hover:text-white">
                        Terms
                    </a>
                </div>
            </div>
        </footer>
    );
}

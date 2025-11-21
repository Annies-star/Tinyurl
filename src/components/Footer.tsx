export function Footer() {
    return (
        <footer className="glass border-t py-6">
            <div className="container mx-auto px-4">
                <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
                    <p className="text-center text-sm text-muted-foreground md:text-left">
                        &copy; {new Date().getFullYear()} TinyLink. Built for the Take-Home Assignment.
                    </p>
                    <div className="flex gap-4 text-sm text-muted-foreground">
                        <a href="#" className="transition-colors hover:text-foreground">Privacy</a>
                        <a href="#" className="transition-colors hover:text-foreground">Terms</a>
                    </div>
                </div>
            </div>
        </footer>
    );
}

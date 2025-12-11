import { TopNavbar } from './TopNavbar';

export function Layout({ children }) {
    return (
        <div className="min-h-screen bg-background flex flex-col">
            <TopNavbar />
            <main className="flex-1 animate-fade-in">
                <div className="container mx-auto p-8 max-w-7xl">
                    {children}
                </div>
            </main>
        </div>
    );
}

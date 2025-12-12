import { ReactNode } from 'react';
import { TopNavbar } from './TopNavbar';

interface LayoutProps {
    children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
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

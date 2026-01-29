import React from 'react';

interface MainLayoutProps {
    currentView: 'physical' | 'user' | 'admin';
    onChangeView: (view: 'physical' | 'user' | 'admin') => void;
    children: React.ReactNode;
}

export const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
    return (
        <div className="flex flex-col h-screen w-full text-white bg-transparent overflow-hidden relative">
            <main className="flex-1 w-full relative">
                {children}
            </main>
        </div>
    );
};

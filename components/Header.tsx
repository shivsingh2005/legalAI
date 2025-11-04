import React from 'react';
import { SunIcon } from './icons/SunIcon';
import { MoonIcon } from './icons/MoonIcon';
import type { Theme, UserRole } from '../App';

interface HeaderProps {
    userRole: UserRole;
    handleLogout: () => void;
    theme: Theme;
    setTheme: (theme: Theme) => void;
}

export const Header: React.FC<HeaderProps> = ({ userRole, handleLogout, theme, setTheme }) => {
    const toggleTheme = () => {
        setTheme(theme === 'light' ? 'dark' : 'light');
    };

    const getRoleTitle = (role: UserRole) => {
        switch (role) {
            case 'citizen': return 'Citizen';
            case 'advocate': return 'Advocate';
            case 'judge': return 'Judge';
        }
    }

    const getInitials = (role: UserRole) => {
        switch (role) {
            case 'citizen': return 'C';
            case 'advocate': return 'A';
            case 'judge': return 'J';
        }
    }

    return (
        <header className="bg-[rgb(var(--card))] text-[rgb(var(--card-foreground))] shadow-sm border-b border-[rgb(var(--border))]">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <div className="flex items-center">
                        <h1 className="text-xl font-semibold">AI Legal Intelligence Hub</h1>
                    </div>
                    <div className="flex items-center space-x-4">
                        <button
                            onClick={toggleTheme}
                            className="p-2 rounded-full text-[rgb(var(--muted-foreground))] hover:bg-[rgb(var(--muted))] hover:text-[rgb(var(--foreground))] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[rgb(var(--background))] focus:ring-[rgb(var(--ring))]"
                            aria-label="Toggle theme"
                        >
                            {theme === 'light' ? <MoonIcon className="h-6 w-6" /> : <SunIcon className="h-6 w-6" />}
                        </button>
                         <div className="flex items-center space-x-3">
                            <div className="hidden sm:block text-right">
                                <div className="font-medium text-sm">Welcome</div>
                                <div className="text-xs text-[rgb(var(--muted-foreground))]">{getRoleTitle(userRole)}</div>
                            </div>
                            <div className="h-10 w-10 bg-slate-300 dark:bg-slate-600 rounded-full flex items-center justify-center font-bold text-slate-500 dark:text-slate-300">
                                {getInitials(userRole)}
                            </div>
                        </div>
                        <button
                            onClick={handleLogout}
                            className="px-3 py-2 text-sm font-medium rounded-md text-[rgb(var(--muted-foreground))] hover:bg-[rgb(var(--muted))] hover:text-[rgb(var(--foreground))] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[rgb(var(--background))] focus:ring-[rgb(var(--ring))]"
                        >
                            Logout
                        </button>
                    </div>
                </div>
            </div>
        </header>
    );
};
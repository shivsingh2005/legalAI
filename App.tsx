import React, { useState, useEffect } from 'react';
import { DashboardLayout } from './components/DashboardLayout';
import { LoginPage } from './components/LoginPage';
import { JudgeDashboard } from './components/JudgeDashboard';
import { AdvocateDashboard } from './components/AdvocateDashboard';
import { CitizenDashboard } from './components/CitizenDashboard';

export type UserRole = 'citizen' | 'advocate' | 'judge';
export type ViewType = 'dashboard' | 'search' | 'builder' | 'analytics' | 'workspace' | 'case_filing';
export type Theme = 'light' | 'dark';

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState<UserRole | null>(null);
  const [activeView, setActiveView] = useState<ViewType>('dashboard');
  const [theme, setTheme] = useState<Theme>('light');

  useEffect(() => {
    const root = window.document.documentElement;
    root.setAttribute('data-theme', theme);
  }, [theme]);

  const handleLogin = (role: UserRole) => {
    setUserRole(role);
    setIsLoggedIn(true);
    setActiveView('dashboard'); // Reset to dashboard view on login
  };

  const handleLogout = () => {
    setUserRole(null);
    setIsLoggedIn(false);
  };

  const renderContent = () => {
    if (!userRole) return null;

    // This switch determines which main dashboard component to show
    switch (userRole) {
      case 'judge':
        // The Judge's dashboard is complex and can manage its own internal views
        return <JudgeDashboard />;
      case 'advocate':
        return <AdvocateDashboard />;
      case 'citizen':
        return <CitizenDashboard />;
      default:
        return <div>Invalid role selected.</div>;
    }
  };

  if (!isLoggedIn || !userRole) {
    return <LoginPage onLogin={handleLogin} />;
  }

  return (
    <DashboardLayout 
      userRole={userRole}
      handleLogout={handleLogout}
      activeView={activeView} 
      setActiveView={setActiveView}
      theme={theme}
      setTheme={setTheme}
    >
      {renderContent()}
    </DashboardLayout>
  );
}
import React from 'react';
import type { ViewType, UserRole } from '../App';
import { SearchIcon } from './icons/SearchIcon';
import { BriefcaseIcon } from './icons/BriefcaseIcon';
import { ChartBarIcon } from './icons/ChartBarIcon';
import { UsersIcon } from './icons/UsersIcon';
import { GavelIcon } from './icons/GavelIcon';
import { FileTextIcon } from './icons/FileTextIcon';


interface SidebarProps {
  userRole: UserRole;
  activeView: ViewType;
  setActiveView: (view: ViewType) => void;
}

interface NavItemProps {
  view: ViewType;
  label: string;
  icon: React.ReactNode;
  isActive: boolean;
  onClick: (view: ViewType) => void;
}

const NavItem: React.FC<NavItemProps> = ({ view, label, icon, isActive, onClick }) => (
  <button
    onClick={() => onClick(view)}
    className={`w-full flex items-center px-4 py-3 text-sm font-medium transition-colors duration-200 relative ${
      isActive
        ? 'bg-slate-700 text-white'
        : 'text-slate-400 hover:bg-slate-700 hover:text-white'
    }`}
  >
    {isActive && <div className="absolute left-0 top-0 h-full w-1 bg-[rgb(var(--primary))] rounded-r-full"></div>}
    {icon}
    <span className="ml-3">{label}</span>
  </button>
);

const getNavItemsForRole = (role: UserRole) => {
    const judgeItems = [
        { view: 'dashboard' as ViewType, label: "Judge's Dashboard", icon: <GavelIcon className="h-5 w-5" /> },
        { view: 'analytics' as ViewType, label: 'Judicial Analytics', icon: <ChartBarIcon className="h-5 w-5" /> },
    ];

    const advocateItems = [
        { view: 'dashboard' as ViewType, label: 'Advocate Dashboard', icon: <BriefcaseIcon className="h-5 w-5" /> },
        { view: 'search' as ViewType, label: 'Precedent Search', icon: <SearchIcon className="h-5 w-5" /> },
        { view: 'builder' as ViewType, label: 'Argument Builder', icon: <UsersIcon className="h-5 w-5" /> },
    ];

    const citizenItems = [
        { view: 'dashboard' as ViewType, label: 'Citizen Dashboard', icon: <UsersIcon className="h-5 w-5" /> },
        { view: 'case_filing' as ViewType, label: 'Case Filing', icon: <FileTextIcon className="h-5 w-5" /> },
    ];
    
    switch (role) {
        case 'judge': return judgeItems;
        case 'advocate': return advocateItems;
        case 'citizen': return citizenItems;
        default: return [];
    }
}


export const Sidebar: React.FC<SidebarProps> = ({ userRole, activeView, setActiveView }) => {
  
  const navItems = getNavItemsForRole(userRole);

  const handleNavigation = (view: ViewType) => {
    // For now, the main dashboards handle their own content.
    // This logic can be expanded if sidebar needs to control views inside a dashboard.
    // For simplicity, we can just switch to the main dashboard for each role.
    if(view === 'dashboard' || view === 'search' || view === 'builder' || view === 'analytics' || view === 'case_filing') {
         // This is a placeholder for more complex routing logic if needed.
         // For now, we assume each role's dashboard shows all its components.
         // The setActiveView is kept for potential future use.
         setActiveView(view);
         console.log(`Switching to view: ${view}`);
    }
  }


  return (
    <div className="hidden lg:flex w-64 bg-slate-900 text-white flex-col">
      <div className="flex items-center justify-center h-16 border-b border-slate-700">
        <h2 className="text-xl font-bold tracking-wider text-white">AI Justice Hub</h2>
      </div>
      <nav className="flex-1 mt-6 space-y-1">
        {navItems.map((item) => (
          <NavItem
            key={item.view}
            view={item.view}
            label={item.label}
            icon={item.icon}
            isActive={activeView === item.view}
            onClick={handleNavigation}
          />
        ))}
      </nav>
       <div className="p-4 border-t border-slate-700 text-center">
            <p className="text-xs text-slate-400">DPDP Act 2023 Compliant</p>
        </div>
    </div>
  );
};
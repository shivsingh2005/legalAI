import React from 'react';
import type { ViewType } from '../App';
import { SearchIcon } from './icons/SearchIcon';
import { BriefcaseIcon } from './icons/BriefcaseIcon';
import { ChartBarIcon } from './icons/ChartBarIcon';
import { UsersIcon } from './icons/UsersIcon';
import { GavelIcon } from './icons/GavelIcon';

interface SidebarProps {
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
    className={`w-full flex items-center px-4 py-3 text-sm font-medium transition-colors duration-200 ${
      isActive
        ? 'bg-gray-700 text-white'
        : 'text-gray-400 hover:bg-gray-700 hover:text-white'
    }`}
  >
    {icon}
    <span className="ml-3">{label}</span>
  </button>
);

export const Sidebar: React.FC<SidebarProps> = ({ activeView, setActiveView }) => {
  const navItems = [
    { view: 'judge' as ViewType, label: "Judge's Dashboard", icon: <GavelIcon className="h-5 w-5" /> },
    { view: 'analytics' as ViewType, label: 'Judicial Analytics', icon: <ChartBarIcon className="h-5 w-5" /> },
    { view: 'search' as ViewType, label: 'Advocate Search', icon: <SearchIcon className="h-5 w-5" /> },
    { view: 'builder' as ViewType, label: 'Argument Builder', icon: <BriefcaseIcon className="h-5 w-5" /> },
    { view: 'workspace' as ViewType, label: 'Workspace', icon: <UsersIcon className="h-5 w-5" /> },
  ];

  return (
    <div className="w-64 bg-gray-900 text-white flex flex-col">
      <div className="flex items-center justify-center h-16 bg-gray-900 shadow-md">
        <h2 className="text-xl font-bold tracking-wider">AI Justice Hub</h2>
      </div>
      <nav className="flex-1 mt-6">
        {navItems.map((item) => (
          <NavItem
            key={item.view}
            view={item.view}
            label={item.label}
            icon={item.icon}
            isActive={activeView === item.view}
            onClick={setActiveView}
          />
        ))}
      </nav>
    </div>
  );
};

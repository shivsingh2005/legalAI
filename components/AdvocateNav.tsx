import React from 'react';
import type { AdvocateView } from './AdvocateDashboard';
import { MailIcon } from './icons/MailIcon';
import { FlaskConicalIcon } from './icons/FlaskConicalIcon';
import { FileClockIcon } from './icons/FileClockIcon';
import { SearchIcon } from './icons/SearchIcon';
import { UsersIcon } from './icons/UsersIcon';
import { FeatherIcon } from './icons/FeatherIcon';
import { CalendarIcon } from './icons/CalendarIcon';
import { FEATURE_FLAGS } from '../featureFlags';
import { useTranslations } from '../hooks/useTranslations';

interface AdvocateNavProps {
  activeView: AdvocateView;
  setActiveView: (view: AdvocateView) => void;
}

export const AdvocateNav: React.FC<AdvocateNavProps> = ({ activeView, setActiveView }) => {
  const t = useTranslations();
  const navItems = [
    { id: 'caserequests', label: t.advocateNav.caseRequests, icon: MailIcon, flag: true },
    { id: 'airesearch', label: t.advocateNav.aiResearch, icon: FlaskConicalIcon, flag: true },
    { id: 'aidrafts', label: t.advocateNav.aiDrafts, icon: FeatherIcon, flag: FEATURE_FLAGS.aiDraftGenerator },
    { id: 'similarcases', label: t.advocateNav.similarCases, icon: FileClockIcon, flag: true },
    { id: 'precedentsearch', label: t.advocateNav.precedentSearch, icon: SearchIcon, flag: true },
    { id: 'argumentbuilder', label: t.advocateNav.argumentBuilder, icon: UsersIcon, flag: true },
    { id: 'calendar', label: t.advocateNav.smartCalendar, icon: CalendarIcon, flag: FEATURE_FLAGS.smartCalendar },
  ];
  const availableNavItems = navItems.filter(item => item.flag);
  
  return (
    <nav className="w-full md:w-64 flex-shrink-0">
      <div className="bg-[rgb(var(--card))] rounded-lg shadow-md border border-[rgb(var(--border))] p-2">
        <h2 className="text-lg font-bold text-[rgb(var(--card-foreground))] p-3">{t.advocateNav.tools}</h2>
        <ul className="space-y-1">
          {availableNavItems.map((item) => {
            const isActive = activeView === item.id;
            return (
              <li key={item.id}>
                <button
                  onClick={() => setActiveView(item.id as AdvocateView)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-md transition-colors duration-200 ${
                    isActive
                      ? 'bg-[rgb(var(--primary))] text-[rgb(var(--primary-foreground))]'
                      : 'text-[rgb(var(--muted-foreground))] hover:bg-[rgb(var(--muted))] hover:text-[rgb(var(--foreground))]'
                  }`}
                >
                  <item.icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
};
import React from 'react';
import { GavelIcon } from './icons/GavelIcon';
import { BriefcaseIcon } from './icons/BriefcaseIcon';
import { UsersIcon } from './icons/UsersIcon';
import type { UserRole } from '../App';

interface LoginPageProps {
  onLogin: (role: UserRole) => void;
}

const RoleCard: React.FC<{
  role: UserRole;
  title: string;
  description: string;
  icon: React.ReactNode;
  onSelect: (role: UserRole) => void;
}> = ({ role, title, description, icon, onSelect }) => (
  <button
    onClick={() => onSelect(role)}
    className="w-full text-left p-6 bg-[rgb(var(--card))] border border-[rgb(var(--border))] rounded-lg shadow-sm hover:shadow-lg hover:border-[rgb(var(--primary))] focus:ring-2 focus:ring-[rgb(var(--ring))] focus:outline-none transition-all duration-200"
  >
    <div className="flex items-center">
      <div className="p-3 bg-[rgb(var(--muted))] rounded-full mr-4">
        {icon}
      </div>
      <div>
        <h3 className="text-lg font-semibold text-[rgb(var(--card-foreground))]">{title}</h3>
        <p className="text-sm text-[rgb(var(--muted-foreground))] mt-1">{description}</p>
      </div>
    </div>
  </button>
);

export const LoginPage: React.FC<LoginPageProps> = ({ onLogin }) => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[rgb(var(--background))] p-4 font-sans">
      <div className="w-full max-w-2xl mx-auto">
        <div className="text-center mb-10">
            <h1 className="text-4xl font-bold text-[rgb(var(--foreground))]">AI Justice Hub</h1>
            <p className="mt-2 text-lg text-[rgb(var(--muted-foreground))]">AI-Driven Judicial Precedent & Case Management</p>
        </div>
        
        <div className="bg-[rgb(var(--card))] border border-[rgb(var(--border))] rounded-xl p-8 shadow-lg">
          <h2 className="text-2xl font-semibold text-center text-[rgb(var(--card-foreground))] mb-6">Select Your Role</h2>
          <div className="space-y-4">
            <RoleCard
              role="citizen"
              title="Citizen / User"
              description="File a new case, get AI-powered legal summaries, and find lawyer recommendations."
              icon={<UsersIcon className="h-6 w-6 text-[rgb(var(--primary))]" />}
              onSelect={onLogin}
            />
            <RoleCard
              role="advocate"
              title="Advocate"
              description="Access precedent search, analytics, and build compelling legal arguments."
              icon={<BriefcaseIcon className="h-6 w-6 text-[rgb(var(--primary))]" />}
              onSelect={onLogin}
            />
            <RoleCard
              role="judge"
              title="Judge"
              description="Utilize the precedent engine, explainable AI, and view immutable case logs."
              icon={<GavelIcon className="h-6 w-6 text-[rgb(var(--primary))]" />}
              onSelect={onLogin}
            />
          </div>
        </div>
         <p className="text-xs text-[rgb(var(--muted-foreground))] mt-6 text-center">
            This platform is DPDP Act 2023 Compliant. All data is handled with strict privacy protocols.
        </p>
      </div>
    </div>
  );
};
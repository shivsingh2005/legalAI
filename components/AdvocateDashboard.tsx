import React from 'react';
import { PrecedentSearch } from './PrecedentSearch';
import { ArgumentBuilder } from './ArgumentBuilder';

export const AdvocateDashboard: React.FC = () => {
  return (
    <div>
      <h1 className="text-3xl font-bold text-[rgb(var(--foreground))] mb-6">Advocate's Dashboard</h1>
      <div className="space-y-8">
        <PrecedentSearch />
        <ArgumentBuilder />
      </div>
    </div>
  );
};
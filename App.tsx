import React, { useState } from 'react';
import { DashboardLayout } from './components/DashboardLayout';
import { PrecedentSearch } from './components/PrecedentSearch';
import { ArgumentBuilder } from './components/ArgumentBuilder';
import { Workspace } from './components/Workspace';
import { JudgeDashboard } from './components/JudgeDashboard';
import { JudicialAnalyticsDashboard } from './components/JudicialAnalyticsDashboard';

export type ViewType = 'search' | 'builder' | 'analytics' | 'workspace' | 'judge';

export default function App() {
  const [activeView, setActiveView] = useState<ViewType>('judge');

  const renderContent = () => {
    switch (activeView) {
      case 'judge':
        return <JudgeDashboard />;
      case 'search':
        return <PrecedentSearch />;
      case 'builder':
        return <ArgumentBuilder />;
      case 'analytics':
        return <JudicialAnalyticsDashboard />;
      case 'workspace':
        return <Workspace />;
      default:
        return <JudgeDashboard />;
    }
  };

  return (
    <DashboardLayout activeView={activeView} setActiveView={setActiveView}>
      {renderContent()}
    </DashboardLayout>
  );
}
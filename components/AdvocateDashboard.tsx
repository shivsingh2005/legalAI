import React, { useState } from 'react';
import { PrecedentSearch } from './PrecedentSearch';
import { SimilarCaseAnalyzer } from './SimilarCaseAnalyzer';
import { AdvocateNav } from './AdvocateNav';
import { CaseRequests } from './CaseRequests';
import { AIResearchHub } from './AIResearchHub';
import { ArgumentBuilder } from './ArgumentBuilder';

export type AdvocateView = 'caserequests' | 'airesearch' | 'similarcases' | 'precedentsearch' | 'argumentbuilder';

export const AdvocateDashboard: React.FC = () => {
  const [activeView, setActiveView] = useState<AdvocateView>('caserequests');

  const renderContent = () => {
    switch (activeView) {
      case 'caserequests':
        return <CaseRequests />;
      case 'airesearch':
        return <AIResearchHub />;
      case 'similarcases':
        return <SimilarCaseAnalyzer />;
      case 'precedentsearch':
        return <PrecedentSearch />;
      case 'argumentbuilder':
        return <ArgumentBuilder />;
      default:
        return <CaseRequests />;
    }
  };

  return (
    <div className="flex flex-col md:flex-row gap-8">
      <AdvocateNav activeView={activeView} setActiveView={setActiveView} />
      <div className="flex-1">
        {renderContent()}
      </div>
    </div>
  );
};

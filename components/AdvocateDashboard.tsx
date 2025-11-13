import React, { useState } from 'react';
import { PrecedentSearch } from './PrecedentSearch';
import { SimilarCaseAnalyzer } from './SimilarCaseAnalyzer';
import { AdvocateNav } from './AdvocateNav';
import { CaseRequests } from './CaseRequests';
import { AIResearchHub } from './AIResearchHub';
import { ArgumentBuilder } from './ArgumentBuilder';
import { FEATURE_FLAGS } from '../featureFlags';
import { LegalDraftGenerator } from './addons/LegalDraftGenerator';
import { SmartCalendar } from './addons/SmartCalendar';

export type AdvocateView = 'caserequests' | 'airesearch' | 'similarcases' | 'precedentsearch' | 'argumentbuilder' | 'aidrafts' | 'calendar';

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
      case 'aidrafts':
        return FEATURE_FLAGS.aiDraftGenerator ? <LegalDraftGenerator /> : null;
       case 'calendar':
        return FEATURE_FLAGS.smartCalendar ? <SmartCalendar /> : null;
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

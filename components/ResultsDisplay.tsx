import React from 'react';
import type { CitizenAnalysisResult, RecommendedLawyer } from '../types';
import { Spinner } from './Spinner';
import { RecommendedLawyerCard } from './RecommendedLawyerCard';
import { CheckCircleIcon } from './icons/CheckCircleIcon';
import { ExclamationTriangleIcon } from './icons/ExclamationTriangleIcon';
import { InformationCircleIcon } from './icons/InformationCircleIcon';
import { GlobeAltIcon } from './icons/GlobeAltIcon';

interface ResultsDisplayProps {
  result: CitizenAnalysisResult | null;
  isLoading: boolean;
  error: string | null;
  onSendRequest: (lawyer: RecommendedLawyer, summary: string) => void;
}

const InfoCard: React.FC<{ title: string; value: string; urgency?: string }> = ({ title, value, urgency }) => {
  const getUrgencyStyles = () => {
    if (!urgency) return { icon: null, color: 'text-[rgb(var(--foreground))]', };
    switch (urgency.toLowerCase()) {
      case 'high':
        return { icon: <ExclamationTriangleIcon className="w-5 h-5 mr-1.5" />, color: 'text-red-500' };
      case 'medium':
        return { icon: <ExclamationTriangleIcon className="w-5 h-5 mr-1.5" />, color: 'text-amber-500' };
      case 'low':
        return { icon: <InformationCircleIcon className="w-5 h-5 mr-1.5" />, color: 'text-blue-500' };
      default:
        return { icon: null, color: 'text-[rgb(var(--foreground))]' };
    }
  };
  const { icon, color } = getUrgencyStyles();
  
  return (
      <div className="bg-[rgb(var(--muted))] p-4 rounded-lg">
          <h4 className="text-sm font-semibold text-[rgb(var(--muted-foreground))]">{title}</h4>
          <p className={`text-base font-bold flex items-center mt-1 ${color}`}>
            {icon}
            {value}
          </p>
      </div>
  );
};


export const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ result, isLoading, error, onSendRequest }) => {
  if (isLoading) {
    return (
      <div className="bg-[rgb(var(--card))] p-6 rounded-lg shadow-lg text-center">
        <div className="flex justify-center items-center gap-4">
          <Spinner />
          <p className="text-lg text-[rgb(var(--muted-foreground))]">AI is analyzing your case. This may take a moment...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-500/10 border border-red-500/20 text-red-500 px-4 py-3 rounded-lg shadow-lg" role="alert">
        <strong className="font-bold">Error: </strong>
        <span className="block sm:inline">{error}</span>
      </div>
    );
  }

  if (!result) {
    return null;
  }
  
  return (
    <div className="bg-[rgb(var(--card))] p-6 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-[rgb(var(--card-foreground))] mb-4">Case Analysis & Recommendations</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <InfoCard title="Case Classification" value={result.case_classification} />
        <InfoCard title="Urgency Level" value={result.urgency} urgency={result.urgency} />
        <InfoCard title="Legal Domain" value={result.legal_domain} />
        <InfoCard title="Primary Issue" value={result.primary_issue} />
      </div>

      <div className="mt-6 border-t border-[rgb(var(--border))] pt-6">
        <h3 className="text-lg font-semibold text-[rgb(var(--card-foreground))] mb-2">Legal Summary</h3>
        <p className="text-[rgb(var(--foreground))] bg-[rgb(var(--muted))] p-4 rounded-md">{result.legal_summary}</p>
      </div>

      <div className="mt-6">
        <h3 className="text-lg font-semibold text-[rgb(var(--card-foreground))] mb-2 flex items-center">
            <CheckCircleIcon className="w-5 h-5 mr-2 text-green-500" />
            Probable Remedy / Next Steps
        </h3>
        <div className="text-[rgb(var(--foreground))] bg-green-500/10 border-l-4 border-green-500 p-4 rounded-r-md">
            {result.probable_remedy}
        </div>
      </div>
      
      {result.portal_recommendation && result.portal_recommendation.toLowerCase() !== 'n/a' && (
          <div className="mt-6">
              <h3 className="text-lg font-semibold text-[rgb(var(--card-foreground))] mb-2 flex items-center">
                  <GlobeAltIcon className="w-5 h-5 mr-2 text-blue-500" />
                  Relevant Portal / Authority
              </h3>
              <div className="text-[rgb(var(--foreground))] bg-blue-500/10 p-4 rounded-md">
                  {result.portal_recommendation}
              </div>
          </div>
      )}
      
      <div className="mt-6 border-t border-[rgb(var(--border))] pt-6">
        <h3 className="text-lg font-semibold text-[rgb(var(--card-foreground))] mb-1">Top 3 Recommended Lawyers</h3>
        <p className="text-sm text-[rgb(var(--muted-foreground))] mb-4">Based on your case, we suggest consulting a <strong>{result.suggested_lawyer_type}</strong>. Here are some recommendations:</p>
        <div className="space-y-4">
            {result.recommended_lawyers.map((lawyer) => (
                <RecommendedLawyerCard 
                    key={lawyer.profile_id} 
                    lawyer={lawyer} 
                    onRequest={(selectedLawyer) => onSendRequest(selectedLawyer, result.lawyer_request_summary)}
                />
            ))}
        </div>
      </div>

    </div>
  );
};

import React, { useState } from 'react';
import type { AnalysisResult } from '../types';
import { LawyerCard } from './LawyerCard';
import { Spinner } from './Spinner';

interface ResultsDisplayProps {
  result: AnalysisResult | null;
  isLoading: boolean;
  error: string | null;
}

type ActiveTab = 'summary' | 'lawyers' | 'petition';

export const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ result, isLoading, error }) => {
  const [activeTab, setActiveTab] = useState<ActiveTab>('summary');

  if (isLoading) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-lg text-center">
        <div className="flex justify-center items-center gap-4">
          <Spinner />
          <p className="text-lg text-gray-600">AI is analyzing your case. This may take a moment...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg shadow-lg" role="alert">
        <strong className="font-bold">Error: </strong>
        <span className="block sm:inline">{error}</span>
      </div>
    );
  }

  if (!result) {
    return null;
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case 'summary':
        return (
          <div>
            <h3 className="text-xl font-semibold mb-2 text-gray-700">Legal Summary</h3>
            <p className="text-gray-600 whitespace-pre-wrap">{result.legalSummary}</p>
          </div>
        );
      case 'lawyers':
        return (
          <div>
            <h3 className="text-xl font-semibold mb-2 text-gray-700">Lawyer Recommendations</h3>
            <p className="text-sm text-gray-500 mb-4">
              Disclaimer: These are AI-generated, hypothetical lawyer profiles for illustrative purposes only.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {result.lawyerRecommendations.map((lawyer, index) => (
                <LawyerCard key={index} lawyer={lawyer} />
              ))}
            </div>
          </div>
        );
      case 'petition':
        return (
          <div>
            <div className="flex justify-between items-center mb-2">
                <h3 className="text-xl font-semibold text-gray-700">AI-Generated Petition Draft</h3>
                <button 
                    onClick={() => navigator.clipboard.writeText(result.petitionDraft)}
                    className="px-3 py-1 text-sm bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition"
                >
                    Copy Text
                </button>
            </div>
            <pre className="bg-gray-100 p-4 rounded-md text-sm text-gray-800 whitespace-pre-wrap overflow-x-auto font-mono">
              {result.petitionDraft}
            </pre>
          </div>
        );
      default:
        return null;
    }
  };

  const TabButton:React.FC<{tabName: ActiveTab, label: string}> = ({tabName, label}) => (
    <button
        onClick={() => setActiveTab(tabName)}
        className={`px-4 py-2 font-medium rounded-t-lg transition-colors text-sm sm:text-base ${activeTab === tabName ? 'bg-white text-blue-600 border-b-2 border-blue-600' : 'bg-transparent text-gray-500 hover:text-blue-600'}`}
    >
        {label}
    </button>
  );

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <div className="mb-4">
        <h2 className="text-2xl font-bold text-gray-800">Case Analysis Report</h2>
        <div className="mt-1 text-lg bg-blue-100 text-blue-800 px-3 py-1 rounded-full inline-block">
          <strong>Case Classification:</strong> {result.caseClassification}
        </div>
      </div>

      <div className="border-b border-gray-200 mb-4 bg-gray-50 rounded-t-lg">
        <nav className="flex -mb-px">
          <TabButton tabName='summary' label='Simple Summary' />
          <TabButton tabName='lawyers' label='Find a Lawyer' />
          <TabButton tabName='petition' label='Petition Draft' />
        </nav>
      </div>
      
      <div className="mt-4">{renderTabContent()}</div>
    </div>
  );
};

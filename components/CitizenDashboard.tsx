import React, { useState, useCallback } from 'react';
import { DisputeInputForm } from './DisputeInputForm';
import { ResultsDisplay } from './ResultsDisplay';
import type { CitizenAnalysisResult, RecommendedLawyer } from '../types';
import { getCitizenCaseAnalysis } from '../services/geminiService';

export const CitizenDashboard: React.FC = () => {
  const [analysisResult, setAnalysisResult] = useState<CitizenAnalysisResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = useCallback(async (disputeText: string) => {
    if (!disputeText.trim()) {
      setError("Please provide details about your case.");
      return;
    }
    setIsLoading(true);
    setError(null);
    setAnalysisResult(null);

    try {
      const result = await getCitizenCaseAnalysis(disputeText);
      setAnalysisResult(result);
    } catch (e) {
      console.error(e);
      setError("An error occurred during analysis. The AI model may have returned an invalid response. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleSendRequest = useCallback((lawyer: RecommendedLawyer, summary: string) => {
    // In a real application, this would trigger a backend API call.
    // For this prototype, we'll show an alert.
    console.log("Sending request to:", lawyer);
    console.log("Request Summary:", summary);
    alert(`A request has been sent to ${lawyer.name}. They will be in touch shortly.\n\nRequest Summary:\n"${summary}"`);
  }, []);

  return (
    <div>
      <h1 className="text-3xl font-bold text-[rgb(var(--foreground))] mb-6">Citizen's Dashboard</h1>
      <div className="space-y-8">
        <DisputeInputForm onAnalyze={handleAnalyze} isLoading={isLoading} />
        <ResultsDisplay 
          result={analysisResult} 
          isLoading={isLoading} 
          error={error}
          onSendRequest={handleSendRequest}
        />
      </div>
    </div>
  );
};
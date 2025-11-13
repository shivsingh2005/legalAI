import React, { useState, useCallback } from 'react';
import { DisputeInputForm } from './DisputeInputForm';
import { ResultsDisplay } from './ResultsDisplay';
import { analyzeDispute } from '../services/geminiService';
import type { CitizenAnalysisResult, RecommendedLawyer } from '../types';
import { Chatbot } from './Chatbot';
import { ChatBubbleIcon } from './icons/ChatBubbleIcon';

export const CitizenDashboard: React.FC = () => {
  const [analysisResult, setAnalysisResult] =
    useState<CitizenAnalysisResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);

  const handleAnalyze = useCallback(async (disputeText: string) => {
    if (!disputeText.trim()) {
      setError('Please enter a description of your dispute.');
      return;
    }
    setIsLoading(true);
    setError(null);
    setAnalysisResult(null);

    try {
      const result = await analyzeDispute(disputeText);
      setAnalysisResult(result);
    } catch (e) {
      console.error('Analysis failed:', e);
      setError(
        'An error occurred during the analysis. The AI model may have returned an invalid response. Please try again.'
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleSendRequest = (lawyer: RecommendedLawyer, summary: string) => {
    // In a real application, this would trigger an API call to send the request.
    // For this demo, we'll just show an alert.
    alert(
      `Request sent to ${lawyer.name} with the following summary:\n\n"${summary}"`
    );
  };

  return (
    <div>
      <h1 className="text-3xl font-bold text-[rgb(var(--foreground))] mb-2">
        Citizen Dashboard
      </h1>
      <p className="text-lg text-[rgb(var(--muted-foreground))] mb-6">
        Get an AI-powered analysis of your legal issue.
      </p>

      <DisputeInputForm onAnalyze={handleAnalyze} isLoading={isLoading} />

      <ResultsDisplay
        result={analysisResult}
        isLoading={isLoading}
        error={error}
        onSendRequest={handleSendRequest}
      />
      
      {!isChatbotOpen && (
          <button
              onClick={() => setIsChatbotOpen(true)}
              className="fixed bottom-8 right-8 bg-[rgb(var(--primary))] text-[rgb(var(--primary-foreground))] p-4 rounded-full shadow-custom-lg hover:opacity-90 transition-all duration-300 z-40 transform hover:scale-110 animate-pulse"
              aria-label="Open AI Assistant"
          >
              <ChatBubbleIcon className="w-8 h-8" />
          </button>
      )}

      {isChatbotOpen && (
          <Chatbot 
              onClose={() => setIsChatbotOpen(false)} 
              caseContext={analysisResult?.lawyer_request_summary}
          />
      )}
    </div>
  );
};
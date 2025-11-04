import React, { useState, useCallback } from 'react';
import { DisputeInputForm } from './DisputeInputForm';
import { ResultsDisplay } from './ResultsDisplay';
import type { AnalysisResult } from '../types';
import { createChatSession } from '../services/geminiService'; // Assuming a service to get analysis

// This is a mock function. In a real app, this would call your Gemini backend.
async function getCaseAnalysis(disputeText: string): Promise<AnalysisResult> {
    console.log("Analyzing text:", disputeText);
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Return mock data that matches the AnalysisResult type
    return {
        caseClassification: "Civil - Property Dispute",
        legalSummary: "This case involves a disagreement over a property boundary line between two neighbors. The primary legal issue is determining the accurate boundary based on historical deeds and local zoning regulations. Potential resolutions include mediation or a court-ordered survey.",
        lawyerRecommendations: [
            { name: "John Smith, Esq.", specialization: "Real Estate Law", location: "Cityville", successRate: "92%", contact: "jsmith@lawfirm.com" },
            { name: "Jane Doe, Esq.", specialization: "Property & Mediation", location: "Cityville", successRate: "88%", contact: "jdoe@legal.com" }
        ],
        petitionDraft: `
[Your Name]
[Your Address]
[Your City, State, Zip]
[Date]

Clerk of the Court
[Court Address]
[City, State, Zip]

Re: Petition to Quiet Title and for Declaratory Relief Regarding Property Boundary

Petitioner, [Your Name], respectfully alleges:
1. Petitioner is the owner of the real property located at [Your Address].
2. Respondent, [Neighbor's Name], is the owner of the adjacent property located at [Neighbor's Address].
3. A dispute has arisen concerning the location of the common boundary line between the two properties.
... (further details of the dispute) ...

WHEREFORE, Petitioner prays for a judgment:
a) Quieting title to the disputed property in Petitioner's name.
b) Declaring the true boundary line between the properties.
c) For such other relief as the Court deems just and proper.

Respectfully submitted,
______________________
[Your Name]
`
    };
}


export const CitizenDashboard: React.FC = () => {
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
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
      // In a real app, you would call your actual Gemini service here.
      const result = await getCaseAnalysis(disputeText);
      setAnalysisResult(result);
    } catch (e) {
      console.error(e);
      setError("An error occurred during analysis. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }, []);


  return (
    <div>
      <h1 className="text-3xl font-bold text-[rgb(var(--foreground))] mb-6">Citizen's Dashboard</h1>
      <div className="space-y-8">
        <DisputeInputForm onAnalyze={handleAnalyze} isLoading={isLoading} />
        <ResultsDisplay result={analysisResult} isLoading={isLoading} error={error} />
      </div>
    </div>
  );
};
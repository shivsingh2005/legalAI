import { Chat } from "@google/genai";

export interface RAGResult {
  answer: string;
  citations: string[];
}

// New type for the recommended lawyers in the citizen analysis
export interface RecommendedLawyer {
  name: string;
  specialization: string;
  experience_years: number;
  success_rate: string;
  location: string;
  profile_id: string;
  contact_option: string; // Should be "Send Request"
}

// Updated type for Citizen Dashboard based on user's request
export interface CitizenAnalysisResult {
  case_classification: string;
  legal_domain: string;
  primary_issue: string;
  legal_summary: string;
  probable_remedy: string;
  suggested_lawyer_type: string;
  recommended_lawyers: RecommendedLawyer[];
  lawyer_request_summary: string;
  urgency: string;
  portal_recommendation: string;
}


export interface ChatMessage {
  sender: 'user' | 'bot';
  text: string;
}

// FIX: Add missing Lawyer interface for LawyerCard.tsx
export interface Lawyer {
  name: string;
  specialization: string;
  location: string;
  successRate: string;
  contact: string;
}

// Phase 3: Types for Explainable AI Dashboard
export interface InfluencingStatute {
  statute: string;
  quote: string;
  relevance: string;
}

export interface ConsistencyCheck {
  issue: string;
  explanation: string;
}

export interface BiasDetection {
  warning: string;
}

export interface PrecedentAnalysisResult {
  keyArguments: {
    plaintiff: string;
    defendant: string;
  };
  influencingStatutes: InfluencingStatute[];
  consistencyCheck: ConsistencyCheck[];
  biasDetection: BiasDetection;
}


// Phase 3: Types for Judicial Analytics
export interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor: string[];
    borderColor?: string[];
    borderWidth?: number;
  }[];
}
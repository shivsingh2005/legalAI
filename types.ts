export interface RAGResult {
  answer: string;
  citations: string[];
}

export interface Lawyer {
  name: string;
  specialization: string;
  location: string;
  successRate: string;
  contact: string;
}

export interface AnalysisResult {
  caseClassification: string;
  legalSummary: string;
  lawyerRecommendations: Lawyer[];
  petitionDraft: string;
}

export interface ChatMessage {
  sender: 'user' | 'bot';
  text: string;
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

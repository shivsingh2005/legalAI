import { GoogleGenAI, Type, Chat } from "@google/genai";
import type { RAGResult, PrecedentAnalysisResult, CitizenAnalysisResult, SimilarCaseAnalysisResult, AIResearchPipelineResult } from '../types';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

// Schema for Citizen's Case Analysis
const citizenAnalysisSchema = {
    type: Type.OBJECT,
    properties: {
        case_classification: { type: Type.STRING, description: "Classification of the case (e.g., Traffic Violation, Civil Dispute, Consumer Complaint, Criminal Case, Property Dispute)." },
        legal_domain: { type: Type.STRING, description: "The relevant Indian legal act or domain (e.g., Motor Vehicle Act 1988, Consumer Protection Act 2019)." },
        primary_issue: { type: Type.STRING, description: "A one-sentence description of the core legal problem." },
        legal_summary: { type: Type.STRING, description: "3-5 sentences explaining the background, possible laws involved, and citizen rights under Indian law." },
        probable_remedy: { type: Type.STRING, description: "Detailed explanation of what the citizen can do (online/offline process, where to file, required documents)." },
        suggested_lawyer_type: { type: Type.STRING, description: "The specific type of Indian lawyer to consult (e.g., 'Traffic Lawyer', 'Consumer Court Advocate')." },
        recommended_lawyers: {
            type: Type.ARRAY,
            description: "A list of the top 3 recommended lawyers (mock data).",
            items: {
                type: Type.OBJECT,
                properties: {
                    name: { type: Type.STRING },
                    specialization: { type: Type.STRING },
                    experience_years: { type: Type.INTEGER },
                    success_rate: { type: Type.STRING },
                    location: { type: Type.STRING },
                    profile_id: { type: Type.STRING },
                    contact_option: { type: Type.STRING, description: "Must be 'Send Request'." }
                },
                required: ["name", "specialization", "experience_years", "success_rate", "location", "profile_id", "contact_option"]
            }
        },
        lawyer_request_summary: { type: Type.STRING, description: "A compact, professional case request note to be sent to the selected lawyer." },
        urgency: { type: Type.STRING, description: "The urgency level: 'Low', 'Medium', or 'High'." },
        portal_recommendation: { type: Type.STRING, description: "A relevant government portal or authority link if applicable (e.g., 'Visit parivahan.gov.in'). State 'N/A' if not applicable." },
    },
    required: ["case_classification", "legal_domain", "primary_issue", "legal_summary", "probable_remedy", "suggested_lawyer_type", "recommended_lawyers", "lawyer_request_summary", "urgency", "portal_recommendation"]
};

const similarCaseAnalyzerSchema = {
    type: Type.OBJECT,
    properties: {
        role: { type: Type.STRING, description: "Should always be 'Advocate'." },
        feature: { type: Type.STRING, description: "Should always be 'Similar Case Analyzer'." },
        case_context_summary: { type: Type.STRING, description: "A brief summary of the user's provided case context." },
        similar_cases_found: {
            type: Type.ARRAY,
            description: "A list of 3 relevant, concluded Indian court judgments.",
            items: {
                type: Type.OBJECT,
                properties: {
                    case_title: { type: Type.STRING, description: "The full title of the case (e.g., 'K. Bhaskaran v. Sankaran Vaidhyan Balan')." },
                    citation_or_year: { type: Type.STRING, description: "The legal citation or year of the judgment (e.g., '1999 (7) SCC 510')." },
                    court_name: { type: Type.STRING, description: "The court that delivered the judgment (e.g., 'Supreme Court of India')." },
                    summary_of_decision: { type: Type.STRING, description: "A concise summary of the court's final decision or ruling." },
                    relevance_score: { type: Type.NUMBER, description: "A numerical score from 0.0 to 1.0 indicating the relevance to the user's query." },
                    key_sections_cited: { type: Type.ARRAY, items: { type: Type.STRING }, description: "List of key legal sections or acts cited in the judgment." },
                    legal_takeaway: { type: Type.STRING, description: "The primary legal principle or takeaway from the judgment that is relevant to the advocate." }
                },
                required: ["case_title", "citation_or_year", "court_name", "summary_of_decision", "relevance_score", "key_sections_cited", "legal_takeaway"]
            }
        },
        overall_summary: { type: Type.STRING, description: "A concluding summary of the findings." },
        suggested_action: { type: Type.STRING, description: "A suggested next step for the advocate, like citing the cases." }
    },
    required: ["role", "feature", "case_context_summary", "similar_cases_found", "overall_summary", "suggested_action"]
};

const aiResearchPipelineSchema = {
    type: Type.OBJECT,
    properties: {
        pipeline_stage: { type: Type.STRING, description: "Should be 'Complete'." },
        case_context: { type: Type.STRING, description: "A one-sentence summary of the original case facts provided by the advocate." },
        similar_cases: {
            type: Type.ARRAY,
            items: {
                type: Type.OBJECT,
                properties: {
                    case_title: { type: Type.STRING },
                    court_name: { type: Type.STRING },
                    citation: { type: Type.STRING },
                    relevance_score: { type: Type.NUMBER }
                },
                required: ["case_title", "court_name", "citation", "relevance_score"]
            },
            description: "A summarized list of the most relevant cases found in the previous pipeline stage."
        },
        rag_results: {
            type: Type.ARRAY,
            items: {
                type: Type.OBJECT,
                properties: {
                    section: { type: Type.STRING },
                    summary: { type: Type.STRING }
                },
                required: ["section", "summary"]
            },
            description: "A summarized list of relevant statutes or precedents from the RAG search."
        },
        final_summary: { type: Type.STRING, description: "A synthesized, expert legal summary combining insights from both similar cases and RAG results, explaining the legal standing of the case." },
        argument_suggestion: { type: Type.STRING, description: "A concise, actionable suggestion for the primary legal argument the advocate should pursue." }
    },
    required: ["pipeline_stage", "case_context", "similar_cases", "rag_results", "final_summary", "argument_suggestion"]
};


export async function getCitizenCaseAnalysis(userInput: string): Promise<CitizenAnalysisResult> {
    const model = 'gemini-2.5-pro';
    const systemInstruction = `You are an advanced AI assistant integrated into an "AI-Driven Judicial Precedent & Case Management Ecosystem" built for India. Your module is specifically for the Citizen/User section. Your job is to analyze user queries, provide a detailed, India-specific legal case analysis, recommend lawyers, and generate a lawyer-hiring request summary. You must return a complete, structured JSON output. Always tailor your answers to Indian legal frameworks. Use accurate, verified references. Write in simple, professional, citizen-friendly English. The output must strictly follow the provided JSON schema. For the 'recommended_lawyers' field, you must generate realistic mock data for three lawyers.`;

    const prompt = `User's legal problem: "${userInput}"`;

    try {
        const response = await ai.models.generateContent({
            model,
            contents: prompt,
            config: {
                systemInstruction,
                responseMimeType: "application/json",
                responseSchema: citizenAnalysisSchema,
                temperature: 0.3,
            },
        });
        const jsonText = response.text.trim();
        return JSON.parse(jsonText) as CitizenAnalysisResult;
    } catch (error) {
        console.error("Error in Gemini citizen case analysis:", error);
        throw new Error("Failed to get a valid case analysis from the AI model.");
    }
}

export async function getSimilarCases(caseFacts: string): Promise<SimilarCaseAnalysisResult> {
    const model = 'gemini-2.5-pro';
    const systemInstruction = `You are an AI Legal Research Assistant for the Advocate Dashboard of an "AI-Driven Judicial Precedent & Case Management Ecosystem" in India. Your task is to analyze an advocate's case facts and return the most relevant, legally similar, concluded Indian court judgments. Understand the context, domain, and facts. Search conceptually for similar judgments, summarizing each one clearly. Output only real or plausible Indian judgments, focusing on landmark cases where possible. Your response must be professional, factual, and strictly follow the provided JSON schema.`;

    const prompt = `Analyze the following case and return similar Indian judgments: "${caseFacts}"`;

    try {
        const response = await ai.models.generateContent({
            model,
            contents: prompt,
            config: {
                systemInstruction,
                responseMimeType: "application/json",
                responseSchema: similarCaseAnalyzerSchema,
                temperature: 0.4,
            },
        });
        const jsonText = response.text.trim();
        return JSON.parse(jsonText) as SimilarCaseAnalysisResult;
    } catch (error) {
        console.error("Error in Gemini similar case analysis:", error);
        throw new Error("Failed to find similar cases from the AI model.");
    }
}

export async function getAIResearchSummary(
  caseFacts: string, 
  similarCasesResult: SimilarCaseAnalysisResult, 
  ragResult: RAGResult
): Promise<AIResearchPipelineResult> {
    const model = 'gemini-2.5-pro';
    const systemInstruction = `You are an expert AI Legal Analyst for an Indian law firm. You have received inputs from two different AI research modules and your job is to synthesize them into a final, consolidated legal research summary for a senior advocate. The summary must be sharp, legally precise, and actionable. Strictly adhere to the provided JSON schema.`;

    const prompt = `
      ADVOCATE'S ORIGINAL CASE FACTS:
      ---
      ${caseFacts}
      ---
      
      STAGE 1 - SIMILAR CASE ANALYZER RESULTS:
      ---
      ${JSON.stringify(similarCasesResult.similar_cases_found, null, 2)}
      ---
      
      STAGE 2 - RAG PRECEDENT SEARCH RESULTS:
      ---
      ${JSON.stringify(ragResult, null, 2)}
      ---
      
      TASK:
      Based on all the provided information, generate a final, consolidated AI Legal Research Summary.
      1. Briefly summarize the advocate's original case context.
      2. Extract and list the most critical similar cases, simplifying the data.
      3. Extract and list the most relevant legal sections from the RAG results.
      4. Write a 'final_summary' that connects the precedents and statutes to the advocate's case facts, providing a clear legal outlook.
      5. Provide a sharp, one-sentence 'argument_suggestion' that the advocate can use as a starting point.
      
      Your output must be a valid JSON object matching the required schema.
    `;

    try {
        const response = await ai.models.generateContent({
            model,
            contents: prompt,
            config: {
                systemInstruction,
                responseMimeType: "application/json",
                responseSchema: aiResearchPipelineSchema,
                temperature: 0.5,
            },
        });
        const jsonText = response.text.trim();
        return JSON.parse(jsonText) as AIResearchPipelineResult;
    } catch (error) {
        console.error("Error in Gemini research summary generation:", error);
        throw new Error("Failed to generate the final AI research summary.");
    }
}


// Schema for Advocate RAG search
const ragSchema = {
    type: Type.OBJECT,
    properties: {
        answer: {
            type: Type.STRING,
            description: "A concise, synthesized answer to the user's question based *only* on the provided context."
        },
        citations: {
            type: Type.ARRAY,
            description: "A list of direct quotes from the context that support the answer. Each quote should be a separate string.",
            items: {
                type: Type.STRING
            }
        }
    },
    required: ["answer", "citations"]
};

// Schema for Judge's Explainable AI Analysis
const precedentAnalysisSchema = {
  type: Type.OBJECT,
  properties: {
    keyArguments: {
      type: Type.OBJECT,
      properties: {
        plaintiff: { type: Type.STRING, description: "A concise summary of the plaintiff's core legal argument." },
        defendant: { type: Type.STRING, description: "A concise summary of the defendant's core legal argument." },
      },
      required: ["plaintiff", "defendant"]
    },
    influencingStatutes: {
      type: Type.ARRAY,
      description: "The top 3-5 statutes, regulations, or precedents influencing the case.",
      items: {
        type: Type.OBJECT,
        properties: {
          statute: { type: Type.STRING, description: "The name or citation of the statute/precedent." },
          quote: { type: Type.STRING, description: "A direct, relevant quote from the provided context." },
          relevance: { type: Type.STRING, description: "A brief explanation of how this statute applies to the case." },
        },
        required: ["statute", "quote", "relevance"]
      }
    },
    consistencyCheck: {
      type: Type.ARRAY,
      description: "Identified gaps or inconsistencies in legal reasoning.",
      items: {
        type: Type.OBJECT,
        properties: {
            issue: { type: Type.STRING, description: "The specific logical issue or gap found." },
            explanation: { type: Type.STRING, description: "A brief explanation of the inconsistency." },
        },
        required: ["issue", "explanation"]
      }
    },
    biasDetection: {
      type: Type.OBJECT,
      properties: {
          warning: { type: Type.STRING, description: "A concise warning if any potential bias is detected in the language or arguments. If none, state 'No potential bias detected.'." }
      },
      required: ["warning"]
    }
  },
  required: ["keyArguments", "influencingStatutes", "consistencyCheck", "biasDetection"]
};


export async function performRAGSearch(query: string, context: string): Promise<RAGResult> {
  const model = "gemini-2.5-pro";
  const prompt = `
    You are an expert AI legal research assistant. Your task is to analyze the provided legal document context and answer the user's question based *exclusively* on that context.
    USER QUESTION: "${query}"
    DOCUMENT CONTEXT:
    ---
    ${context}
    ---
    Format the final output as a valid JSON object matching the required schema.
  `;

  try {
    const response = await ai.models.generateContent({
      model,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: ragSchema,
        temperature: 0.2,
      },
    });
    const jsonText = response.text.trim();
    if (!jsonText) {
      // For this specific use case, return a default value instead of throwing an error
      return { answer: "No specific precedents found in the provided context for the query.", citations: ["The RAG model could not extract direct citations based on the input."] };
    }
    return JSON.parse(jsonText) as RAGResult;
  } catch (error) {
    console.error("Error in Gemini RAG search:", error);
    // For this specific use case, return a default value instead of throwing an error
    return { answer: "An error occurred during the RAG search.", citations: ["The model failed to produce a valid response."] };
  }
}

export async function getPrecedentAnalysis(context: string): Promise<PrecedentAnalysisResult> {
    const model = "gemini-2.5-pro";
    const prompt = `
        You are an expert AI judicial assistant. Your task is to perform a comprehensive analysis of the provided case context and structure your findings in a precise JSON format.

        1.  **Summarize Key Arguments**: Distill the core legal arguments from both the plaintiff and defendant.
        2.  **Identify Influencing Statutes**: Pinpoint the top 3 statutes or key precedents from the context that are most influential. For each one, provide a clear, direct quote and a brief explanation of its relevance.
        3.  **Check for Logical Consistency**: Analyze the arguments. Identify any potential gaps in legal reasoning or failures to address a critical point.
        4.  **Detect Potential Bias**: Scrutinize the language for any indication of implicit bias. If detected, issue a concise warning.

        CASE CONTEXT:
        ---
        ${context}
        ---

        Your response MUST be a valid JSON object matching the required schema.
    `;

    try {
        const response = await ai.models.generateContent({
            model,
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: precedentAnalysisSchema,
                temperature: 0.3,
            },
        });
        const jsonText = response.text.trim();
        return JSON.parse(jsonText) as PrecedentAnalysisResult;
    } catch (error) {
        console.error("Error in Gemini precedent analysis:", error);
        throw new Error("Failed to get a valid precedent analysis from the AI model.");
    }
}


export function createChatSession(): Chat {
  const chat = ai.chats.create({
    model: 'gemini-2.5-flash',
    config: {
      systemInstruction: 'You are a helpful legal assistant. You can answer general legal questions, but you must state that you are not a lawyer and the user should consult with a qualified professional for legal advice.',
    },
  });
  return chat;
}

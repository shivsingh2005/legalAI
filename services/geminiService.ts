import { GoogleGenAI, Type, Chat } from "@google/genai";
import type { RAGResult, PrecedentAnalysisResult, CitizenAnalysisResult } from '../types';

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
      throw new Error("Received an empty response from the AI model.");
    }
    return JSON.parse(jsonText) as RAGResult;
  } catch (error) {
    console.error("Error in Gemini RAG search:", error);
    throw new Error("Failed to get a valid RAG analysis from the AI model.");
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
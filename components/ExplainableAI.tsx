import React, { useState, useCallback } from 'react';
import { getPrecedentAnalysis } from '../services/geminiService';
import type { PrecedentAnalysisResult } from '../types';
import { Spinner } from './Spinner';
import { UploadIcon } from './icons/UploadIcon';
import { FileTextIcon } from './icons/FileTextIcon';
import { GavelIcon } from './icons/GavelIcon';

export const ExplainableAI: React.FC = () => {
  const [documentText, setDocumentText] = useState('');
  const [fileName, setFileName] = useState('');
  const [result, setResult] = useState<PrecedentAnalysisResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type === "text/plain") {
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target?.result as string;
        setDocumentText(text);
        setFileName(file.name);
        setResult(null);
        setError(null);
      };
      reader.readAsText(file);
    } else {
      alert("Please upload a valid .txt file.");
      setFileName('');
      setDocumentText('');
    }
    event.target.value = '';
  };

  const handleAnalyze = useCallback(async () => {
    if (!documentText.trim()) {
      setError("Please upload a document to analyze.");
      return;
    }
    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const analysisResult = await getPrecedentAnalysis(documentText);
      setResult(analysisResult);
    } catch (e) {
      console.error(e);
      setError("An error occurred during analysis. The AI model may have returned an invalid response. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }, [documentText]);

  return (
    <div className="bg-white p-6 rounded-lg shadow-md h-full flex flex-col">
      <h2 className="text-xl font-semibold mb-4 text-gray-700">Explainable AI: Precedent Analysis</h2>
      
      {/* Upload Section */}
      <div className="flex-shrink-0">
        <label className="flex flex-col items-center justify-center w-full h-24 px-4 transition bg-white border-2 border-gray-300 border-dashed rounded-md appearance-none cursor-pointer hover:border-gray-400">
          {fileName ? (
            <div className="text-center">
              <FileTextIcon className="mx-auto h-7 w-7 text-green-500" />
              <span className="mt-1 block text-sm font-medium text-gray-900">{fileName}</span>
            </div>
          ) : (
            <div className="text-center">
              <UploadIcon className="mx-auto h-7 w-7 text-gray-400" />
              <span className="mt-1 block text-sm font-medium text-gray-600">Upload Case Document (.txt)</span>
            </div>
          )}
          <input type="file" className="hidden" onChange={handleFileChange} accept=".txt" disabled={isLoading} />
        </label>
        <button
          onClick={handleAnalyze}
          disabled={isLoading || !documentText}
          className="mt-4 w-full px-6 py-3 bg-indigo-600 text-white font-semibold rounded-md hover:bg-indigo-700 disabled:bg-gray-400 flex items-center justify-center gap-2"
        >
          {isLoading ? <><Spinner /> Analyzing...</> : <><GavelIcon className="w-5 h-5" /> Analyze Precedents</>}
        </button>
      </div>

      {/* Results Section */}
      <div className="flex-grow mt-4 overflow-y-auto">
        {isLoading && (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <Spinner />
              <p className="mt-2 text-gray-600">AI is performing deep analysis...</p>
            </div>
          </div>
        )}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg" role="alert">
            <p><strong className="font-bold">Error: </strong>{error}</p>
          </div>
        )}
        {result && (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-bold text-gray-800 border-b pb-1 mb-2">Key Arguments</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div className="bg-blue-50 p-3 rounded-lg"><strong className="text-blue-800">Plaintiff:</strong> {result.keyArguments.plaintiff}</div>
                <div className="bg-green-50 p-3 rounded-lg"><strong className="text-green-800">Defendant:</strong> {result.keyArguments.defendant}</div>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-bold text-gray-800 border-b pb-1 mb-2">Influencing Statutes & Precedents</h3>
              <div className="space-y-3">
                {result.influencingStatutes.map((item, index) => (
                  <div key={index} className="bg-gray-50 p-3 rounded-lg">
                    <p className="font-semibold text-gray-700">{item.statute}</p>
                    <blockquote className="border-l-4 border-indigo-400 pl-3 my-1 text-sm text-gray-600 italic">"{item.quote}"</blockquote>
                    <p className="text-xs text-gray-800"><strong className="font-medium">Relevance:</strong> {item.relevance}</p>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-lg font-bold text-gray-800 border-b pb-1 mb-2">Legal Consistency Check</h3>
               {result.consistencyCheck.length > 0 ? (
                    result.consistencyCheck.map((item, index) => (
                        <div key={index} className="bg-yellow-50 border border-yellow-200 p-3 rounded-lg text-sm mb-2">
                            <p className="font-semibold text-yellow-800">Issue: {item.issue}</p>
                            <p className="text-yellow-700">{item.explanation}</p>
                        </div>
                    ))
                ) : <p className="text-sm text-gray-600">No major logical inconsistencies detected.</p>}
            </div>

             <div>
              <h3 className="text-lg font-bold text-gray-800 border-b pb-1 mb-2">Bias Detection</h3>
              <div className={`p-3 rounded-lg text-sm ${result.biasDetection.warning.includes('No potential bias') ? 'bg-gray-100' : 'bg-red-100 border border-red-200'}`}>
                <p>{result.biasDetection.warning}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

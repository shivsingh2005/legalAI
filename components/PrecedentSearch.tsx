import React, { useState, useCallback } from 'react';
import { performRAGSearch } from '../services/geminiService';
import type { RAGResult } from '../types';
import { Spinner } from './Spinner';
import { UploadIcon } from './icons/UploadIcon';
import { FileTextIcon } from './icons/FileTextIcon';
import { SearchIcon } from './icons/SearchIcon';

export const PrecedentSearch: React.FC = () => {
  const [documentText, setDocumentText] = useState('');
  const [fileName, setFileName] = useState('');
  const [query, setQuery] = useState('');
  const [result, setResult] = useState<RAGResult | null>(null);
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

  const handleSearch = useCallback(async () => {
    if (!query.trim() || !documentText.trim()) {
      setError("Please upload a document and enter a search query.");
      return;
    }
    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const searchResult = await performRAGSearch(query, documentText);
      setResult(searchResult);
    } catch (e) {
      console.error(e);
      setError("An error occurred during the search. The AI model may have returned an invalid response. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }, [query, documentText]);

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-6">RAG-Based Precedent Search</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Input Section */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4 text-gray-700">1. Upload Case Document</h2>
          <label className="flex flex-col items-center justify-center w-full h-32 px-4 transition bg-white border-2 border-gray-300 border-dashed rounded-md appearance-none cursor-pointer hover:border-gray-400 focus:outline-none">
            {fileName ? (
              <div className="text-center">
                <FileTextIcon className="mx-auto h-8 w-8 text-green-500" />
                <span className="mt-2 block text-sm font-medium text-gray-900">{fileName}</span>
              </div>
            ) : (
              <div className="text-center">
                <UploadIcon className="mx-auto h-8 w-8 text-gray-400" />
                <span className="mt-2 block text-sm font-medium text-gray-600">Click to upload a .txt file</span>
              </div>
            )}
            <input type="file" className="hidden" onChange={handleFileChange} accept=".txt" disabled={isLoading} />
          </label>

          <h2 className="text-xl font-semibold mb-2 mt-6 text-gray-700">2. Ask a Question</h2>
          <p className="text-sm text-gray-500 mb-4">Ask a specific question about the uploaded document.</p>
          <div className="relative">
            <textarea
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="e.g., 'What was the court's reasoning regarding contributory negligence?'"
              className="w-full h-24 p-3 pr-12 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
              disabled={isLoading || !documentText}
            />
          </div>
          <button
            onClick={handleSearch}
            disabled={isLoading || !query || !documentText}
            className="mt-4 w-full px-6 py-3 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 disabled:bg-gray-400 flex items-center justify-center gap-2"
          >
            {isLoading ? <><Spinner /> Searching...</> : <><SearchIcon className="w-5 h-5" /> Search</>}
          </button>
        </div>

        {/* Output Section */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4 text-gray-700">3. AI-Generated Insights</h2>
          {isLoading && (
            <div className="flex items-center justify-center h-full">
                <div className="text-center">
                    <Spinner />
                    <p className="mt-2 text-gray-600">Analyzing document and generating response...</p>
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
                <h3 className="text-lg font-bold text-gray-800">Answer</h3>
                <p className="mt-1 text-gray-700 bg-gray-50 p-3 rounded-md">{result.answer}</p>
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-800">Supporting Citations</h3>
                <div className="mt-2 space-y-3">
                  {result.citations.map((citation, index) => (
                    <blockquote key={index} className="border-l-4 border-blue-500 pl-4 text-gray-600 italic">
                      "{citation}"
                    </blockquote>
                  ))}
                </div>
              </div>
            </div>
          )}
          {!isLoading && !error && !result && (
            <div className="flex items-center justify-center h-full text-center text-gray-500">
                <p>Upload a document and ask a question to see the results.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

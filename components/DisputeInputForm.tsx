
import React, { useState } from 'react';
import { UploadIcon } from './icons/UploadIcon';
import { Spinner } from './Spinner';

interface DisputeInputFormProps {
  onAnalyze: (disputeText: string) => void;
  isLoading: boolean;
}

export const DisputeInputForm: React.FC<DisputeInputFormProps> = ({ onAnalyze, isLoading }) => {
  const [disputeText, setDisputeText] = useState('');
  const [fileName, setFileName] = useState('');

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type === "text/plain") {
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target?.result as string;
        setDisputeText(text);
        setFileName(file.name);
      };
      reader.readAsText(file);
    } else {
      alert("Please upload a valid .txt file.");
      setFileName('');
    }
    // Reset file input value to allow re-uploading the same file
    event.target.value = '';
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    onAnalyze(disputeText);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg mb-8">
      <h2 className="text-2xl font-semibold mb-4 text-gray-700">Describe Your Case</h2>
      <p className="text-gray-600 mb-4">
        Provide details about your legal dispute below. You can either type directly into the text box or upload a plain text (.txt) file. The more detail you provide, the more accurate the AI analysis will be.
      </p>
      <form onSubmit={handleSubmit}>
        <textarea
          value={disputeText}
          onChange={(e) => setDisputeText(e.target.value)}
          placeholder="For example: 'I had a property dispute with my neighbor regarding the boundary line...'"
          className="w-full h-48 p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
          disabled={isLoading}
        />
        
        <div className="mt-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <label className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-md cursor-pointer hover:bg-gray-200 transition">
            <UploadIcon className="w-5 h-5" />
            <span>{fileName ? `File: ${fileName}` : 'Upload .txt Document'}</span>
            <input type="file" className="hidden" onChange={handleFileChange} accept=".txt" disabled={isLoading} />
          </label>
          <button
            type="submit"
            disabled={isLoading || !disputeText}
            className="w-full sm:w-auto px-6 py-3 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
          >
            {isLoading ? <><Spinner /> Analyzing...</> : 'Analyze Case'}
          </button>
        </div>
      </form>
      <p className="text-xs text-gray-500 mt-4 text-center">
        <strong>Data Privacy Notice:</strong> By submitting your case, you agree to have the data analyzed by an AI model. Please do not include sensitive personal identifiable information. We are compliant with the DPDP Act 2023.
      </p>
    </div>
  );
};

import React from 'react';
import { CubeTransparentIcon } from './icons/CubeTransparentIcon';

export const BlockchainLog: React.FC = () => {
    // Mock data
    const logItems = [
        { block: 893451, hash: '0x2a1d...b8e4', event: 'RULING_ISSUED' },
        { block: 893449, hash: '0x9c3f...a221', event: 'EVIDENCE_SUBMITTED' },
        { block: 893412, hash: '0x1e8b...f04c', event: 'MOTION_FILED' },
        { block: 893401, hash: '0x5d0a...337a', event: 'CASE_CREATED' },
    ];
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4 text-gray-700 flex items-center">
        <CubeTransparentIcon className="w-6 h-6 mr-2 text-blue-600" />
        Blockchain Case Log
      </h2>
      <div className="space-y-2 text-sm font-mono">
        {logItems.map(item => (
            <div key={item.block} className="p-2 bg-gray-50 rounded-md hover:bg-gray-100">
                <p className="text-gray-500">Block: <span className="text-black">{item.block}</span></p>
                <p className="truncate text-gray-500">Hash: <span className="text-blue-700">{item.hash}</span></p>
                <p className="text-gray-500">Event: <span className="font-sans font-semibold text-gray-800 bg-gray-200 px-2 py-0.5 rounded">{item.event}</span></p>
            </div>
        ))}
      </div>
      <p className="text-xs text-gray-400 mt-4 text-center">Simulated immutable log of case events.</p>
    </div>
  );
};

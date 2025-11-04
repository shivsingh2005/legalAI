import React from 'react';
import { ExplainableAI } from './ExplainableAI';
import { LiveCaseFeed } from './LiveCaseFeed';
import { BlockchainLog } from './BlockchainLog';

export const JudgeDashboard: React.FC = () => {
  return (
    <div>
        <h1 className="text-3xl font-bold text-[rgb(var(--foreground))] mb-6">Judge's AI-Powered Dashboard</h1>
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            {/* Main Content: Explainable AI */}
            <div className="xl:col-span-2">
                <ExplainableAI />
            </div>

            {/* Side Content: Transparency Layers */}
            <div className="space-y-6">
                <LiveCaseFeed />
                <BlockchainLog />
            </div>
        </div>
    </div>
  );
};
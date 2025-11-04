import React from 'react';
import { SignalIcon } from './icons/SignalIcon';

export const LiveCaseFeed: React.FC = () => {
  // Mock data to simulate live updates
  const feedItems = [
    { time: '14:32:15', event: 'Motion to suppress filed by defense.', case: 'C-2024-1138' },
    { time: '14:31:58', event: 'Evidence log #78B submitted by prosecution.', case: 'C-2024-1138' },
    { time: '14:29:04', event: 'Case #C-2024-1255 hearing scheduled.', case: 'C-2024-1255' },
    { time: '14:28:11', event: 'Witness testimony recorded.', case: 'C-2024-1138' },
  ];

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4 text-gray-700 flex items-center">
        <SignalIcon className="w-6 h-6 mr-2 text-red-500 animate-pulse" />
        Live Case Feed (MQTT)
      </h2>
      <div className="space-y-3 text-sm">
        {feedItems.map((item, index) => (
          <div key={index} className="flex items-start">
            <span className="font-mono text-gray-500 mr-3">{item.time}</span>
            <p className="text-gray-800">
              <span className="font-semibold">{item.case}:</span> {item.event}
            </p>
          </div>
        ))}
      </div>
       <p className="text-xs text-gray-400 mt-4 text-center">This is a simulated feed representing live court updates.</p>
    </div>
  );
};

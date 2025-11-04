import React, { useState, useEffect } from 'react';
import type { CaseRequest } from '../types';
import { RequestCard } from './RequestCard';

const mockCaseRequests: CaseRequest[] = [
  {
    id: 'REQ001',
    userName: 'Rohan Sharma',
    caseSummary: 'Received a traffic challan for jumping a red light in Mumbai. The fine amount seems excessive and I wish to contest it.',
    legalDomain: 'Motor Vehicle Act, 1988',
    urgency: 'Medium',
    status: 'Pending',
    timestamp: '2024-07-28T10:30:00Z',
  },
  {
    id: 'REQ002',
    userName: 'Priya Desai',
    caseSummary: 'My landlord is refusing to return the security deposit after I vacated the flat, citing unreasonable damages.',
    legalDomain: 'Tenancy & Rent Control Law',
    urgency: 'High',
    status: 'Pending',
    timestamp: '2024-07-28T09:15:00Z',
  },
  {
    id: 'REQ003',
    userName: 'Amit Patel',
    caseSummary: 'A newly purchased mobile phone stopped working within a week. The seller is refusing to replace or refund the amount.',
    legalDomain: 'Consumer Protection Act, 2019',
    urgency: 'Low',
    status: 'Accepted',
    timestamp: '2024-07-27T15:00:00Z',
  },
   {
    id: 'REQ004',
    userName: 'Sunita Verma',
    caseSummary: 'Dispute with a neighbor over the construction of a boundary wall that encroaches on my property line.',
    legalDomain: 'Property & Real Estate Law',
    urgency: 'Medium',
    status: 'Rejected',
    timestamp: '2024-07-26T11:45:00Z',
  }
];

export const CaseRequests: React.FC = () => {
  const [requests, setRequests] = useState<CaseRequest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API fetch
    setTimeout(() => {
      setRequests(mockCaseRequests);
      setLoading(false);
    }, 500);
  }, []);

  const handleUpdateRequest = (requestId: string, newStatus: 'Accepted' | 'Rejected') => {
    // In a real app, you would call an API here.
    // e.g., fetch(`/api/lawyer-requests/${requestId}/${newStatus.toLowerCase()}`, { method: 'POST' });
    
    setRequests(prevRequests =>
      prevRequests.map(req =>
        req.id === requestId ? { ...req, status: newStatus } : req
      )
    );
  };

  const pendingRequests = requests.filter(r => r.status === 'Pending');
  const handledRequests = requests.filter(r => r.status !== 'Pending');

  return (
    <div>
      <h1 className="text-2xl font-bold text-[rgb(var(--foreground))] mb-1">Case Requests</h1>
      <p className="text-[rgb(var(--muted-foreground))] mb-6">Review and respond to incoming client requests.</p>

      {loading ? (
        <p>Loading requests...</p>
      ) : (
        <div className="space-y-6">
          <div>
            <h2 className="text-lg font-semibold text-[rgb(var(--card-foreground))] mb-3">Pending Requests ({pendingRequests.length})</h2>
            {pendingRequests.length > 0 ? (
                <div className="space-y-4">
                {pendingRequests.map(request => (
                    <RequestCard 
                        key={request.id} 
                        request={request} 
                        onAccept={() => handleUpdateRequest(request.id, 'Accepted')}
                        onReject={() => handleUpdateRequest(request.id, 'Rejected')}
                    />
                ))}
                </div>
            ) : (
                <div className="bg-[rgb(var(--card))] border border-[rgb(var(--border))] rounded-lg p-6 text-center">
                    <p className="text-[rgb(var(--muted-foreground))]">No pending requests at the moment.</p>
                </div>
            )}
          </div>
          <div>
            <h2 className="text-lg font-semibold text-[rgb(var(--card-foreground))] mb-3">Handled Requests ({handledRequests.length})</h2>
            {handledRequests.length > 0 ? (
                <div className="space-y-4">
                {handledRequests.map(request => (
                    <RequestCard 
                        key={request.id} 
                        request={request} 
                    />
                ))}
                </div>
            ) : (
                 <div className="bg-[rgb(var(--card))] border border-[rgb(var(--border))] rounded-lg p-6 text-center">
                    <p className="text-[rgb(var(--muted-foreground))]">No handled requests to show.</p>
                </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

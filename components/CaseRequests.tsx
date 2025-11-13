import React, { useState, useEffect } from 'react';
import type { CaseRequest, CaseChatMessage } from '../types';
import { RequestCard } from './RequestCard';
import { initialCaseRequests, initialChatHistories } from '../data/mockData';
import { CaseChat } from './CaseChat';
import { getChatSummary, getSuggestedNextSteps } from '../services/geminiService';
import { ChatIcon } from './icons/ChatIcon';

export const CaseRequests: React.FC = () => {
  const [requests, setRequests] = useState<CaseRequest[]>([]);
  const [chatHistories, setChatHistories] = useState(initialChatHistories);
  const [loading, setLoading] = useState(true);
  const [chattingCase, setChattingCase] = useState<CaseRequest | null>(null);

  useEffect(() => {
    // Simulate API fetch
    setTimeout(() => {
      setRequests(initialCaseRequests);
      setLoading(false);
    }, 500);
  }, []);

  const handleUpdateRequest = (requestId: string, newStatus: 'Accepted' | 'Rejected') => {
    setRequests(prevRequests =>
      prevRequests.map(req =>
        req.id === requestId ? { ...req, status: newStatus } : req
      )
    );
  };

  const handleOpenChat = (caseId: string) => {
    const caseToChat = requests.find(c => c.id === caseId);
    if (caseToChat) {
      setChattingCase(caseToChat);
    }
  };

  const handleSendMessage = (text: string) => {
    if (!chattingCase) return;

    const newMessage: CaseChatMessage = {
        id: `msg-${Date.now()}`,
        caseId: chattingCase.id,
        role: 'advocate',
        text,
        timestamp: new Date().toISOString(),
    };
    
    const updatedHistory = [...(chatHistories[chattingCase.id] || []), newMessage];
    setChatHistories(prev => ({...prev, [chattingCase.id]: updatedHistory }));

    // Simulate citizen reply for demo purposes
    setTimeout(() => {
        const citizenReply: CaseChatMessage = {
            id: `msg-${Date.now() + 1}`,
            caseId: chattingCase.id,
            role: 'citizen',
            text: "Okay, thank you for the update. I will prepare the documents.",
            timestamp: new Date().toISOString(),
        };
        setChatHistories(prev => ({...prev, [chattingCase.id]: [...updatedHistory, citizenReply] }));
    }, 2500);
  };

  const pendingRequests = requests.filter(r => r.status === 'Pending');
  const handledRequests = requests.filter(r => r.status !== 'Pending');

  return (
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-6" style={{ height: 'calc(100vh - 150px)'}}>
        <div className="lg:col-span-2 overflow-y-auto pr-2">
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
                                onOpenChat={handleOpenChat}
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
        <div className="lg:col-span-3 h-full">
            {chattingCase ? (
                <CaseChat
                caseRequest={chattingCase}
                messages={chatHistories[chattingCase.id] || []}
                currentUserRole="advocate"
                onClose={() => setChattingCase(null)}
                onSendMessage={handleSendMessage}
                getSummary={getChatSummary}
                getSuggestedNextSteps={getSuggestedNextSteps}
                />
            ) : (
                <div className="bg-[rgb(var(--card))] border-2 border-dashed border-[rgb(var(--border))] rounded-lg h-full flex flex-col items-center justify-center text-center p-4">
                    <ChatIcon className="w-16 h-16 text-[rgb(var(--muted-foreground))]"/>
                    <h3 className="mt-4 text-lg font-semibold text-[rgb(var(--card-foreground))]">Secure Case Chat</h3>
                    <p className="mt-1 text-sm text-[rgb(var(--muted-foreground))]">Select an 'Accepted' case from the list to view the conversation.</p>
                </div>
            )}
        </div>
    </div>
  );
};
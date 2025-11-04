import React from 'react';

export const Header: React.FC = () => {
  return (
    <header className="bg-gray-800 text-white shadow-md">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <h1 className="text-2xl font-bold">AI Legal Intelligence Hub</h1>
      </div>
    </header>
  );
};
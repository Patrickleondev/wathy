import React from 'react';
import LLMChatbot from '../../components/LLMChatbot';

const LLMChatbotPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                🔍 Oracle Audit Assistant
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-2">
                Analysez vos logs d'audit Oracle avec l'intelligence artificielle
              </p>
            </div>
            <div className="p-6">
              <LLMChatbot />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LLMChatbotPage; 
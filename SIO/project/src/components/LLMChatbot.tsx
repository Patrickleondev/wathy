import React, { useState, useRef, useEffect } from 'react';
import { Upload, MessageCircle, FileText, Brain, AlertTriangle, CheckCircle, Send, Bot, User, Download, Trash2, Zap } from 'lucide-react';

interface LLMResponse {
  success: boolean;
  answer: string;
  confidence: number;
  analysis_type: string;
  sources: any[];
  error?: string;
}

interface UploadResponse {
  success: boolean;
  message: string;
  log_id?: string;
  events_count: number;
  summary?: string;
  error?: string;
}

interface Message {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  confidence?: number;
  analysis_type?: string;
}

// Questions prédéfinies organisées par catégorie
const PREDEFINED_QUESTIONS = {
  "Questions générales": [
    "Combien d'événements d'audit sont enregistrés dans ce fichier ?",
    "Quelle est la plage de dates couverte par ces données ?",
    "Quels sont les types d'actions (ACTION_NAME) les plus fréquents ?"
  ],
  "Utilisateurs et Sessions": [
    "Combien d'utilisateurs différents (OS_USERNAME) sont enregistrés ?",
    "Quels sont les utilisateurs les plus actifs ?",
    "Y a-t-il des sessions suspectes ou anormales ?"
  ],
  "Actions spécifiques": [
    "Combien d'opérations SELECT ont été effectuées ?",
    "Combien d'actions destructives (DELETE, DROP, TRUNCATE) ont été détectées ?",
    "Quels programmes clients sont les plus utilisés ?"
  ],
  "Sécurité": [
    "Y a-t-il des activités suspectes ou non autorisées ?",
    "Quels sont les accès aux objets sensibles ?",
    "Y a-t-il des tentatives d'accès échouées ?"
  ],
  "Performance": [
    "Quels sont les pics d'activité dans les logs ?",
    "Y a-t-il des requêtes lentes ou problématiques ?",
    "Quelle est la répartition des activités par heure ?"
  ]
};

const LLMChatbot: React.FC = () => {
  // États avec persistance dans localStorage
  const [messages, setMessages] = useState<Message[]>(() => {
    const saved = localStorage.getItem('oracle_audit_messages');
    return saved ? JSON.parse(saved) : [];
  });
  
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [uploadStatus, setUploadStatus] = useState<'idle' | 'uploading' | 'success' | 'error'>('idle');
  const [uploadResponse, setUploadResponse] = useState<UploadResponse | null>(() => {
    const saved = localStorage.getItem('oracle_audit_upload');
    return saved ? JSON.parse(saved) : null;
  });
  const [logId, setLogId] = useState<string | null>(() => {
    const saved = localStorage.getItem('oracle_audit_log_id');
    return saved || null;
  });
  const [showQuickQuestions, setShowQuickQuestions] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Persistance des messages
  useEffect(() => {
    localStorage.setItem('oracle_audit_messages', JSON.stringify(messages));
  }, [messages]);

  // Persistance de l'upload
  useEffect(() => {
    if (uploadResponse) {
      localStorage.setItem('oracle_audit_upload', JSON.stringify(uploadResponse));
    }
  }, [uploadResponse]);

  // Persistance du log ID
  useEffect(() => {
    if (logId) {
      localStorage.setItem('oracle_audit_log_id', logId);
    }
  }, [logId]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleFileUpload = async (file: File) => {
    setUploadStatus('uploading');
    setIsLoading(true);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('http://localhost:8001/api/upload-logs', {
        method: 'POST',
        body: formData,
      });

      const result: UploadResponse = await response.json();

      if (result.success) {
        setUploadStatus('success');
        setUploadResponse(result);
        setLogId(result.log_id || null);
        setMessages(prev => [...prev, {
          id: Date.now().toString(),
          type: 'assistant',
          content: `📁 **Log uploadé avec succès!**\n\n${result.message}\n\n${result.summary || ''}`,
          timestamp: new Date()
        }]);
      } else {
        setUploadStatus('error');
        setMessages(prev => [...prev, {
          id: Date.now().toString(),
          type: 'assistant',
          content: `❌ **Erreur lors de l'upload:** ${result.error || 'Erreur inconnue'}`,
          timestamp: new Date()
        }]);
      }
    } catch (error) {
      setUploadStatus('error');
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        type: 'assistant',
        content: `❌ **Erreur de connexion:** ${error}`,
        timestamp: new Date()
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setUploadedFile(file);
      handleFileUpload(file);
    }
  };

  const handleQuestionSubmit = async (question: string) => {
    if (!question.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: question,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      const response = await fetch('http://localhost:8001/api/ask-llm', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          question,
          log_id: logId
        }),
      });

      const result: LLMResponse = await response.json();

      if (result.success) {
        setMessages(prev => [...prev, {
          id: (Date.now() + 1).toString(),
          type: 'assistant',
          content: result.answer,
          timestamp: new Date(),
          confidence: result.confidence,
          analysis_type: result.analysis_type
        }]);
      } else {
        setMessages(prev => [...prev, {
          id: (Date.now() + 1).toString(),
          type: 'assistant',
          content: `❌ **Erreur:** ${result.error || 'Erreur inconnue'}`,
          timestamp: new Date()
        }]);
      }
    } catch (error) {
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: `❌ **Erreur de connexion:** ${error}`,
        timestamp: new Date()
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickQuestion = (question: string) => {
    handleQuestionSubmit(question);
    setShowQuickQuestions(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleQuestionSubmit(inputValue);
  };

  const clearConversation = () => {
    setMessages([]);
    setUploadResponse(null);
    setLogId(null);
    setUploadStatus('idle');
    setUploadedFile(null);
    localStorage.removeItem('oracle_audit_messages');
    localStorage.removeItem('oracle_audit_upload');
    localStorage.removeItem('oracle_audit_log_id');
  };

  const exportConversation = () => {
    const conversation = messages.map(msg => 
      `${msg.type === 'user' ? '👤 Vous' : '🤖 Assistant'}: ${msg.content}`
    ).join('\n\n');
    
    const blob = new Blob([conversation], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `oracle_audit_conversation_${new Date().toISOString().split('T')[0]}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const getAnalysisTypeIcon = (type: string) => {
    switch (type) {
      case 'user_analysis': return '👤';
      case 'action_analysis': return '⚡';
      case 'security_analysis': return '🔒';
      case 'performance_analysis': return '📊';
      default: return '🤖';
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.8) return 'text-green-600';
    if (confidence >= 0.6) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="flex flex-col h-full bg-gray-50 dark:bg-gray-900">
      {/* Header avec statut */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Brain className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            <div>
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                Oracle Audit Assistant
              </h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {uploadStatus === 'success' ? 'Log chargé et prêt' : 'En attente de log'}
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            {uploadStatus === 'success' && (
              <div className="flex items-center space-x-2 text-sm">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <span className="text-green-600 dark:text-green-400">
                  {uploadResponse?.events_count || 0} événements
                </span>
              </div>
            )}
            
            <button
              onClick={clearConversation}
              className="p-2 text-gray-500 hover:text-red-500 transition-colors"
              title="Effacer la conversation"
            >
              <Trash2 className="h-4 w-4" />
            </button>
            
            {messages.length > 0 && (
              <button
                onClick={exportConversation}
                className="p-2 text-gray-500 hover:text-blue-500 transition-colors"
                title="Exporter la conversation"
              >
                <Download className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Zone de chat */}
      <div className="flex-1 overflow-hidden">
        <div className="h-full flex flex-col">
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.length === 0 ? (
              <div className="text-center py-8">
                <Brain className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  Bienvenue dans Oracle Audit Assistant
                </h3>
                <p className="text-gray-500 dark:text-gray-400 mb-6">
                  Uploadez un fichier de log Oracle pour commencer l'analyse
                </p>
                
                {/* Zone d'upload */}
                <div className="max-w-md mx-auto">
                  <label className="block w-full p-4 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg text-center cursor-pointer hover:border-blue-500 dark:hover:border-blue-400 transition-colors">
                    <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      Cliquez pour uploader un fichier de log Oracle
                    </span>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".csv,.txt"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>
            ) : (
              messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                      message.type === 'user'
                        ? 'bg-blue-600 text-white'
                        : 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-600'
                    }`}
                  >
                    <div className="flex items-start space-x-2">
                      {message.type === 'assistant' && (
                        <span className="text-sm mt-1">
                          {getAnalysisTypeIcon(message.analysis_type || 'default')}
                        </span>
                      )}
                      <div className="flex-1">
                        <div className="whitespace-pre-wrap text-sm">{message.content}</div>
                        {message.confidence && (
                          <div className="mt-1 text-xs">
                            <span className={`${getConfidenceColor(message.confidence)}`}>
                              Confiance: {(message.confidence * 100).toFixed(0)}%
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="text-xs opacity-70 mt-1">
                      {message.timestamp.toLocaleTimeString()}
                    </div>
                  </div>
                </div>
              ))
            )}
            
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg px-4 py-2">
                  <div className="flex items-center space-x-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      Assistant en train de réfléchir...
                    </span>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Questions rapides */}
          {uploadStatus === 'success' && (
            <div className="border-t border-gray-200 dark:border-gray-700 p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Questions rapides
                </h3>
                <button
                  onClick={() => setShowQuickQuestions(!showQuickQuestions)}
                  className="flex items-center space-x-1 text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
                >
                  <Zap className="h-4 w-4" />
                  <span>{showQuickQuestions ? 'Masquer' : 'Afficher'}</span>
                </button>
              </div>
              
              {showQuickQuestions && (
                <div className="space-y-3">
                  {Object.entries(PREDEFINED_QUESTIONS).map(([category, questions]) => (
                    <div key={category} className="space-y-2">
                      <h4 className="text-xs font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wide">
                        {category}
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {questions.map((question, index) => (
                          <button
                            key={index}
                            onClick={() => handleQuickQuestion(question)}
                            disabled={isLoading}
                            className="px-3 py-1 text-xs bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded-full hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {question}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Zone de saisie */}
          <div className="border-t border-gray-200 dark:border-gray-700 p-4">
            <form onSubmit={handleSubmit} className="flex space-x-2">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Posez votre question sur les logs d'audit..."
                className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                disabled={isLoading || uploadStatus !== 'success'}
              />
              <button
                type="submit"
                disabled={isLoading || !inputValue.trim() || uploadStatus !== 'success'}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <Send className="h-4 w-4" />
              </button>
            </form>
            
            {uploadStatus !== 'success' && (
              <div className="mt-2 text-center">
                <label className="block w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg text-center cursor-pointer hover:border-blue-500 dark:hover:border-blue-400 transition-colors">
                  <Upload className="h-4 w-4 inline mr-2" />
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    Uploader un fichier de log Oracle
                  </span>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".csv,.txt"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </label>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LLMChatbot; 
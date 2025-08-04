import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Send, Brain, User, Download, Trash2, Upload, FileText, AlertCircle, Lightbulb } from 'lucide-react';
import logger, { logChatbot, logUserAction } from '../../utils/logger';
import { auditQuestions, getQuestionsByCategory } from '../../utils/auditQuestions';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  type?: 'text' | 'upload' | 'analysis' | 'error' | 'success' | 'warning';
  data?: any;
  explanation?: string;
  summary?: string;
}

interface UploadedLog {
  id: string;
  name: string;
  size: number;
  content: string;
  timestamp: Date;
}

const OracleAuditPage: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Bienvenue dans l\'Assistant Oracle Audit ! Uploadez vos logs d\'audit et posez vos questions.',
      sender: 'bot',
      timestamp: new Date(),
      type: 'text'
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [uploadedLogs, setUploadedLogs] = useState<UploadedLog[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [randomQuestions, setRandomQuestions] = useState<typeof auditQuestions>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Fonction de scroll sécurisée
  const scrollToBottom = useCallback(() => {
    try {
      if (messagesEndRef.current) {
        messagesEndRef.current.scrollIntoView({ 
          behavior: 'smooth',
          block: 'end'
        });
      }
    } catch (error) {
      console.warn('Erreur lors du scroll automatique:', error);
    }
  }, []);

  // Scroll automatique après chaque message
  useEffect(() => {
    const timer = setTimeout(scrollToBottom, 100);
    return () => clearTimeout(timer);
  }, [messages, scrollToBottom]);

  // Charger les données persistées au chargement
  useEffect(() => {
    // Charger les logs uploadés depuis localStorage
    const savedLogs = localStorage.getItem('oracle_audit_logs');
    if (savedLogs) {
      try {
        const parsedLogs = JSON.parse(savedLogs);
        setUploadedLogs(parsedLogs);
      } catch (error) {
        console.warn('Erreur lors du chargement des logs:', error);
      }
    }

    // Charger les messages depuis localStorage
    const savedMessages = localStorage.getItem('oracle_audit_messages');
    if (savedMessages) {
      try {
        const parsedMessages = JSON.parse(savedMessages);
        // Convertir les timestamps en objets Date
        const messagesWithDates = parsedMessages.map((msg: any) => ({
          ...msg,
          timestamp: new Date(msg.timestamp)
        }));
        setMessages(messagesWithDates);
      } catch (error) {
        console.warn('Erreur lors du chargement des messages:', error);
      }
    }

    // Générer 3 questions aléatoires
    generateRandomQuestions();
  }, []);

  // Fonction pour générer 3 questions aléatoires
  const generateRandomQuestions = () => {
    const shuffled = [...auditQuestions].sort(() => 0.5 - Math.random());
    setRandomQuestions(shuffled.slice(0, 3));
  };

  // Gestion de l'upload de fichiers
  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    setIsUploading(true);
    logUserAction('upload_logs', 'OracleAuditPage', { fileCount: files.length });

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const content = await file.text();
        
        const logFile: UploadedLog = {
          id: Date.now().toString() + i,
          name: file.name,
          size: file.size,
          content: content,
          timestamp: new Date()
        };

        setUploadedLogs(prev => {
          const newLogs = [...prev, logFile];
          // Sauvegarder dans localStorage
          localStorage.setItem('oracle_audit_logs', JSON.stringify(newLogs));
          return newLogs;
        });

        // Message de confirmation
        const uploadMessage: Message = {
          id: Date.now().toString() + '_upload_' + i,
          text: `✅ Log uploadé: ${file.name} (${(file.size / 1024).toFixed(1)} KB)`,
          sender: 'bot',
          timestamp: new Date(),
          type: 'success'
        };

        setMessages(prev => {
          const newMessages = [...prev, uploadMessage];
          // Sauvegarder dans localStorage
          localStorage.setItem('oracle_audit_messages', JSON.stringify(newMessages));
          return newMessages;
        });
      }

      // Message de résumé
      const summaryMessage: Message = {
        id: Date.now().toString() + '_summary',
        text: `📊 ${files.length} log(s) d'audit Oracle prêt(s) pour analyse. Vous pouvez maintenant poser vos questions ou cliquer sur les questions suggérées ci-dessous !`,
        sender: 'bot',
        timestamp: new Date(),
        type: 'text'
      };

      setMessages(prev => {
        const newMessages = [...prev, summaryMessage];
        // Sauvegarder dans localStorage
        localStorage.setItem('oracle_audit_messages', JSON.stringify(newMessages));
        return newMessages;
      });
      logger.info('Logs uploadés avec succès', 'ORACLE_AUDIT', { fileCount: files.length });

    } catch (error) {
      logger.error('Erreur lors de l\'upload des logs', error, 'ORACLE_AUDIT');
      
      const errorMessage: Message = {
        id: Date.now().toString() + '_error',
        text: '❌ Erreur lors de l\'upload des fichiers. Veuillez réessayer.',
        sender: 'bot',
        timestamp: new Date(),
        type: 'error'
      };

      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  // Fonction d'envoi de question
  const handleSendMessage = async () => {
    if (!inputText.trim() || isLoading) return;

    if (uploadedLogs.length === 0) {
      const warningMessage: Message = {
        id: Date.now().toString(),
        text: '⚠️ Veuillez d\'abord uploader vos logs d\'audit Oracle avant de poser des questions.',
        sender: 'bot',
        timestamp: new Date(),
        type: 'warning'
      };
      setMessages(prev => [...prev, warningMessage]);
      return;
    }

    logUserAction('send_audit_question', 'OracleAuditPage', { question: inputText.trim() });

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText.trim(),
      sender: 'user',
      timestamp: new Date(),
      type: 'text'
    };

    setMessages(prev => {
      const newMessages = [...prev, userMessage];
      // Sauvegarder dans localStorage
      localStorage.setItem('oracle_audit_messages', JSON.stringify(newMessages));
      return newMessages;
    });
    setInputText('');
    setIsTyping(true);
    setIsLoading(true);

    try {
      const startTime = Date.now();
      logger.info('Tentative d\'appel API Oracle Audit', 'ORACLE_AUDIT_API', { 
        question: userMessage.text,
        logCount: uploadedLogs.length 
      });
      
      // Vérifier d'abord la santé du backend
      try {
        const healthResponse = await fetch('http://localhost:8001/', { timeout: 5000 });
        if (!healthResponse.ok) {
          throw new Error('Backend non accessible');
        }
      } catch (healthError) {
        throw new Error('Serveur backend LLM non démarré. Vérifiez que le serveur fonctionne sur http://localhost:8001');
      }
      
      // Appel à l'API backend
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 15000); // 15s timeout

      // Préparer les logs pour l'envoi au backend
      const logsData = uploadedLogs.map(log => ({
        name: log.name,
        content: log.content
      }));

      const response = await fetch('http://localhost:8001/api/ask-llm', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          question: userMessage.text,
          log_id: uploadedLogs.length > 0 ? 'current_logs' : null,
          logs: logsData
        }),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      const responseTime = Date.now() - startTime;
      logger.info('Réponse API Oracle Audit reçue', 'ORACLE_AUDIT_API', { 
        status: data.status, 
        responseTime 
      });
      
      let botMessage: Message;

      if (data.success && data.answer) {
        botMessage = {
          id: (Date.now() + 1).toString(),
          text: data.answer,
          sender: 'bot',
          timestamp: new Date(),
          type: 'analysis',
          data: data.sources,
          explanation: data.analysis_type,
          summary: `Confiance: ${data.confidence}%`
        };
      } else {
        botMessage = {
          id: (Date.now() + 1).toString(),
          text: data.error || 'Erreur lors de l\'analyse de vos logs d\'audit',
          sender: 'bot',
          timestamp: new Date(),
          type: 'error'
        };
      }

      setMessages(prev => {
        const newMessages = [...prev, botMessage];
        // Sauvegarder dans localStorage
        localStorage.setItem('oracle_audit_messages', JSON.stringify(newMessages));
        return newMessages;
      });
      logChatbot('audit_analysis_complete', userMessage.text, botMessage.text);

    } catch (error) {
      logger.error('Erreur lors de la communication avec le serveur Oracle Audit', error, 'ORACLE_AUDIT_API');
      
      // Réponse de fallback
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: error.message || 'Je n\'ai pas pu analyser vos logs pour le moment. Vérifiez que le serveur backend LLM est démarré sur http://localhost:8001 et réessayez.',
        sender: 'bot',
        timestamp: new Date(),
        type: 'error'
      };

      setMessages(prev => {
        const newMessages = [...prev, botMessage];
        // Sauvegarder dans localStorage
        localStorage.setItem('oracle_audit_messages', JSON.stringify(newMessages));
        return newMessages;
      });
      logChatbot('audit_analysis_error', userMessage.text, null, error);
    } finally {
      setIsTyping(false);
      setIsLoading(false);
      logger.info('Traitement de la question d\'audit terminé', 'ORACLE_AUDIT_PROCESSING');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const clearConversation = () => {
    logUserAction('clear_audit_conversation', 'OracleAuditPage');
    logger.info('Conversation d\'audit effacée', 'ORACLE_AUDIT_UI');
    
    const initialMessage = {
      id: '1',
      text: 'Bienvenue dans l\'Assistant Oracle Audit ! Uploadez vos logs d\'audit et posez vos questions.',
      sender: 'bot',
      timestamp: new Date(),
      type: 'text'
    };
    
    setMessages([initialMessage]);
    setUploadedLogs([]);
    
    // Nettoyer le localStorage
    localStorage.removeItem('oracle_audit_logs');
    localStorage.setItem('oracle_audit_messages', JSON.stringify([initialMessage]));
    
    // Vider les logs côté backend
    fetch('http://localhost:8001/api/clear-logs', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      }
    }).catch(error => {
      console.warn('Erreur lors du nettoyage côté backend:', error);
    });
  };

  const exportConversation = () => {
    try {
      logUserAction('export_audit_conversation', 'OracleAuditPage', { messageCount: messages.length });
      logger.info('Export de conversation d\'audit', 'ORACLE_AUDIT_UI', { messageCount: messages.length });
      
      const conversation = messages.map(msg =>
        `[${msg.timestamp.toLocaleString()}] ${msg.sender === 'user' ? 'Vous' : 'Assistant Audit'}: ${msg.text}`
      ).join('\n\n');
      
      const blob = new Blob([conversation], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `audit-conversation-${new Date().toISOString().split('T')[0]}.txt`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      logger.error('Erreur lors de l\'export de conversation d\'audit', error, 'ORACLE_AUDIT_UI');
    }
  };

  const triggerFileUpload = () => {
    fileInputRef.current?.click();
  };

  const handleSuggestedQuestion = (question: string) => {
    setInputText(question);
    setShowSuggestions(false);
  };

  const handleRandomQuestion = (question: string) => {
    setInputText(question);
    generateRandomQuestions(); // Générer de nouvelles questions aléatoires
  };

  const toggleSuggestions = () => {
    setShowSuggestions(!showSuggestions);
  };

  const checkLogsStatus = async () => {
    try {
      const response = await fetch('http://localhost:8001/api/logs-status');
      const data = await response.json();
      console.log('Logs status:', data);
      return data;
    } catch (error: unknown) {
      console.error('Error checking logs status:', error);
      return null;
    }
  };

  return (
    <div className="h-full w-full bg-gradient-to-br from-blue-950 via-blue-900 to-blue-800 flex flex-col overflow-hidden">
      {/* Header fixe */}
      <div className="flex-shrink-0 bg-blue-950/90 backdrop-blur-sm border-b border-blue-800/50 p-4 md:p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-4 md:gap-6 justify-center">
            <Brain className="h-8 w-8 md:h-12 md:w-12 text-blue-300 drop-shadow-lg" />
            <div className="text-center">
              <h1 className="text-2xl md:text-3xl lg:text-4xl font-extrabold text-blue-100 drop-shadow-lg">
                Oracle Audit Assistant
              </h1>
              <p className="text-xs md:text-sm lg:text-lg text-blue-200 mt-1 md:mt-2 max-w-2xl mx-auto">
                Analysez vos logs d'audit Oracle avec l'intelligence artificielle
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Contenu principal */}
      <div className="flex-1 flex flex-col max-w-7xl mx-auto w-full px-3 md:px-6 lg:px-8 py-4 md:py-6 overflow-hidden">
        {/* Zone des messages */}
        <div 
          ref={messagesContainerRef}
          className="flex-1 overflow-y-auto bg-blue-950/50 rounded-xl md:rounded-2xl shadow-2xl border border-blue-900/50 mb-4 md:mb-6 p-3 md:p-6 lg:p-8 min-h-0"
        >
          <div className="space-y-4 md:space-y-6">
            {messages.map((message) => (
              <div key={message.id} className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-full md:max-w-4xl w-full p-3 md:p-4 lg:p-6 rounded-xl md:rounded-2xl ${
                  message.sender === 'user'
                    ? 'bg-blue-800 text-white'
                    : message.type === 'error'
                    ? 'bg-red-900/80 text-red-100'
                    : message.type === 'warning'
                    ? 'bg-yellow-900/80 text-yellow-100'
                    : message.type === 'success'
                    ? 'bg-green-900/80 text-green-100'
                    : 'bg-blue-950/80 text-blue-100'
                } flex flex-col shadow-lg border border-blue-900/40`}>
                  {/* En-tête du message */}
                  <div className="flex items-center gap-2 md:gap-3 mb-2 md:mb-3">
                    {message.sender === 'bot' && <Brain className="h-4 w-4 md:h-5 md:w-5 text-blue-400" />}
                    {message.sender === 'user' && <User className="h-4 w-4 md:h-5 md:w-5 text-blue-200" />}
                    <span className="text-xs text-blue-300">
                      {message.timestamp.toLocaleTimeString()}
                    </span>
                  </div>
                  
                  {/* Contenu du message */}
                  <div className="space-y-2 md:space-y-3">
                    <div className="text-blue-100 text-sm md:text-base leading-relaxed">
                      {message.text}
                    </div>
                    
                    {message.explanation && (
                      <div className="p-2 md:p-3 bg-blue-900/30 border-l-4 border-blue-400 rounded text-blue-200 text-xs md:text-sm">
                        {message.explanation}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}

            {/* Questions aléatoires suggérées - seulement si pas de logs uploadés ou première fois */}
            {messages.length === 1 && uploadedLogs.length === 0 && (
              <div className="flex justify-start">
                <div className="max-w-full md:max-w-4xl w-full p-3 md:p-4 lg:p-6 rounded-xl md:rounded-2xl bg-blue-950/80 text-blue-100 flex flex-col shadow-lg border border-blue-900/40">
                  <div className="flex items-center gap-2 md:gap-3 mb-3">
                    <Lightbulb className="h-4 w-4 md:h-5 md:w-5 text-blue-400" />
                    <span className="text-xs text-blue-300">Questions suggérées</span>
                  </div>
                  
                  <div className="space-y-2">
                    <p className="text-blue-200 text-sm mb-3">
                      Uploadez d'abord vos logs d'audit, puis cliquez sur une question :
                    </p>
                    
                    <div className="space-y-2">
                      {randomQuestions.map((question, index) => (
                        <button
                          key={question.id}
                          onClick={() => handleRandomQuestion(question.question)}
                          className="w-full text-left p-3 bg-blue-900/50 hover:bg-blue-800/70 rounded-lg transition-colors border border-blue-800/50 hover:border-blue-700/50"
                        >
                          <div className="flex items-start gap-2">
                            <span className="text-blue-400 text-xs font-medium min-w-[20px]">
                              {index + 1}.
                            </span>
                            <div className="flex-1">
                              <p className="text-blue-100 text-sm leading-relaxed">
                                {question.question}
                              </p>
                              <p className="text-blue-300 text-xs mt-1">
                                {question.category}
                              </p>
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                    
                    <div className="mt-3 pt-3 border-t border-blue-800/50">
                      <button
                        onClick={generateRandomQuestions}
                        className="text-blue-300 hover:text-blue-100 text-xs transition-colors flex items-center gap-1"
                      >
                        <span>🔄</span>
                        <span>Autres questions</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {/* Indicateur de frappe */}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-blue-900/80 text-blue-100 p-3 md:p-4 rounded-xl md:rounded-2xl flex items-center gap-2 md:gap-3 shadow">
                  <Brain className="h-4 w-4 md:h-5 md:w-5 text-blue-400" />
                  <div className="flex gap-1">
                    <div className="w-1.5 h-1.5 md:w-2 md:h-2 bg-blue-400 rounded-full animate-bounce"></div>
                    <div className="w-1.5 h-1.5 md:w-2 md:h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-1.5 h-1.5 md:w-2 md:h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            )}

            {/* Questions suggérées pour les logs uploadés */}
            {showSuggestions && uploadedLogs.length > 0 && (
              <div className="flex justify-start mt-4">
                <div className="max-w-full md:max-w-4xl w-full p-3 md:p-4 lg:p-6 rounded-xl md:rounded-2xl bg-blue-950/80 text-blue-100 flex flex-col shadow-lg border border-blue-900/40">
                  <div className="flex items-center gap-2 md:gap-3 mb-3">
                    <Lightbulb className="h-4 w-4 md:h-5 md:w-5 text-blue-400" />
                    <span className="text-xs text-blue-300">Questions suggérées</span>
                  </div>
                  
                  <div className="space-y-2">
                    <p className="text-blue-200 text-sm mb-3">
                      Cliquez sur une question pour l'analyser :
                    </p>
                    
                    <div className="space-y-2">
                      {randomQuestions.map((question, index) => (
                        <button
                          key={question.id}
                          onClick={() => handleRandomQuestion(question.question)}
                          className="w-full text-left p-3 bg-blue-900/50 hover:bg-blue-800/70 rounded-lg transition-colors border border-blue-800/50 hover:border-blue-700/50"
                        >
                          <div className="flex items-start gap-2">
                            <span className="text-blue-400 text-xs font-medium min-w-[20px]">
                              {index + 1}.
                            </span>
                            <div className="flex-1">
                              <p className="text-blue-100 text-sm leading-relaxed">
                                {question.question}
                              </p>
                              <p className="text-blue-300 text-xs mt-1">
                                {question.category}
                              </p>
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                    
                    <div className="mt-3 pt-3 border-t border-blue-800/50">
                      <button
                        onClick={generateRandomQuestions}
                        className="text-blue-300 hover:text-blue-100 text-xs transition-colors flex items-center gap-1"
                      >
                        <span>🔄</span>
                        <span>Autres questions</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Zone d'upload et saisie */}
        <div className="flex-shrink-0 space-y-2 md:space-y-4">
          {/* Zone d'upload */}
          <div className="flex gap-2 md:gap-3 w-full">
            <button
              onClick={triggerFileUpload}
              disabled={isUploading}
              className="px-4 md:px-6 lg:px-8 py-2 md:py-3 lg:py-4 bg-green-900 text-white rounded-lg md:rounded-xl hover:bg-green-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 font-semibold shadow-lg text-sm md:text-base"
            >
              <Upload className="h-4 w-4 md:h-5 md:w-5" />
              <span className="hidden sm:inline">
                {isUploading ? 'Upload...' : 'Upload Logs'}
              </span>
            </button>
            
            {uploadedLogs.length > 0 && (
              <div className="flex items-center gap-2 px-3 md:px-4 py-2 md:py-3 bg-blue-900/50 rounded-lg text-blue-200 text-xs md:text-sm">
                <FileText className="h-3 w-3 md:h-4 md:w-4" />
                <span>{uploadedLogs.length} log(s) uploadé(s)</span>
              </div>
            )}

            {/* Bouton pour afficher/masquer les questions suggérées */}
            {uploadedLogs.length > 0 && (
              <button
                onClick={toggleSuggestions}
                className="px-3 md:px-4 py-2 md:py-3 bg-blue-800 text-blue-100 rounded-lg md:rounded-xl hover:bg-blue-700 transition-colors flex items-center gap-2 font-semibold shadow text-xs md:text-sm"
              >
                <Lightbulb className="h-3 w-3 md:h-4 md:w-4" />
                <span className="hidden sm:inline">
                  {showSuggestions ? 'Masquer' : 'Questions'}
                </span>
              </button>
            )}

            {/* Bouton pour vider les logs */}
            {uploadedLogs.length > 0 && (
              <button
                onClick={() => {
                  setUploadedLogs([]);
                  localStorage.removeItem('oracle_audit_logs');
                  setMessages([
                    {
                      id: '1',
                      text: 'Logs supprimés. Uploadez de nouveaux logs d\'audit.',
                      sender: 'bot',
                      timestamp: new Date(),
                      type: 'text'
                    }
                  ]);
                  localStorage.setItem('oracle_audit_messages', JSON.stringify([
                    {
                      id: '1',
                      text: 'Logs supprimés. Uploadez de nouveaux logs d\'audit.',
                      sender: 'bot',
                      timestamp: new Date(),
                      type: 'text'
                    }
                  ]));
                }}
                className="px-3 md:px-4 py-2 md:py-3 bg-red-800 text-red-100 rounded-lg md:rounded-xl hover:bg-red-700 transition-colors flex items-center gap-2 font-semibold shadow text-xs md:text-sm"
                title="Vider les logs uploadés"
              >
                <Trash2 className="h-3 w-3 md:h-4 md:w-4" />
                <span className="hidden sm:inline">Vider</span>
              </button>
            )}
          </div>

          {/* Zone de saisie */}
          <div className="flex gap-2 md:gap-3 w-full">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Posez votre question sur les logs d'audit..."
              disabled={isLoading}
              className="flex-1 px-3 md:px-4 lg:px-6 py-2 md:py-3 lg:py-4 border border-blue-900 rounded-lg md:rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 bg-blue-950 text-blue-100 shadow-lg text-sm md:text-base disabled:opacity-50"
            />
            
            <button
              onClick={handleSendMessage}
              disabled={!inputText.trim() || isLoading}
              className="px-4 md:px-6 lg:px-8 py-2 md:py-3 lg:py-4 bg-blue-900 text-white rounded-lg md:rounded-xl hover:bg-blue-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 font-semibold shadow-lg text-sm md:text-base"
            >
              <Send className="h-4 w-4 md:h-5 md:w-5" />
              <span className="hidden sm:inline">Analyser</span>
            </button>
          </div>
          
          <div className="text-xs text-blue-200 text-center">
            Entrée pour analyser, Shift+Entrée pour une nouvelle ligne
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2 md:gap-3 justify-center mt-4 md:mt-6">
          <button 
            onClick={exportConversation} 
            className="px-3 md:px-4 lg:px-6 py-2 md:py-3 bg-blue-800 text-blue-100 rounded-lg md:rounded-xl hover:bg-blue-700 flex items-center gap-2 font-semibold shadow text-xs md:text-sm"
          >
            <Download className="h-3 w-3 md:h-4 md:w-4" />
            <span className="hidden sm:inline">Exporter</span>
          </button>
          <button 
            onClick={clearConversation} 
            className="px-3 md:px-4 lg:px-6 py-2 md:py-3 bg-red-800 text-red-100 rounded-lg md:rounded-xl hover:bg-red-700 flex items-center gap-2 font-semibold shadow text-xs md:text-sm"
          >
            <Trash2 className="h-3 w-3 md:h-4 md:w-4" />
            <span className="hidden sm:inline">Effacer</span>
          </button>
        </div>
      </div>

      {/* Input file caché */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept=".txt,.log,.csv"
        onChange={handleFileUpload}
        className="hidden"
      />
    </div>
  );
};

export default OracleAuditPage; 
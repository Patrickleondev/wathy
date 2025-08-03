import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Send, Bot, User, Download, Trash2 } from 'lucide-react';
import { staticAnswers } from '../../utils/staticAnswers';
import logger, { logChatbot, logUserAction } from '../../utils/logger';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  type?: 'text' | 'query' | 'result' | 'error' | 'stats' | 'count' | 'help' | 'actions' | 'table';
  data?: any;
  explanation?: string;
  stats?: any;
  summary?: string;
  suggestions?: string[];
  columns?: string[];
}

const ChatbotPage: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Bienvenue ! Posez votre question Oracle.',
      sender: 'bot',
      timestamp: new Date(),
      type: 'text'
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);

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

  // Fonction d'envoi améliorée et robuste
  const handleSendMessage = async () => {
    if (!inputText.trim() || isLoading) return;

    logUserAction('send_message', 'ChatbotPage', { question: inputText.trim() });
    logChatbot('question_sent', inputText.trim());

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText.trim(),
      sender: 'user',
      timestamp: new Date(),
      type: 'text'
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsTyping(true);
    setIsLoading(true);

    try {
      const startTime = Date.now();
      logger.info('Tentative d\'appel API chatbot', 'CHATBOT_API', { question: userMessage.text });
      
      // Appel à l'API backend avec timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10s timeout

      const response = await fetch('http://localhost:4000/api/chatbot', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ question: userMessage.text }),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      const responseTime = Date.now() - startTime;
      logger.info('Réponse API chatbot reçue', 'CHATBOT_API', { 
        status: data.status, 
        responseTime 
      });
      
      let botMessage: Message;

      if (data.status === 'success' && data.data) {
        botMessage = {
          id: (Date.now() + 1).toString(),
          text: data.data.summary || data.data.explanation || 'Réponse reçue',
          sender: 'bot',
          timestamp: new Date(),
          type: data.data.type || 'text',
          data: data.data.data,
          explanation: data.data.explanation,
          summary: data.data.summary,
          columns: data.data.columns
        };
      } else {
        botMessage = {
          id: (Date.now() + 1).toString(),
          text: data.message || 'Erreur lors du traitement de votre question',
          sender: 'bot',
          timestamp: new Date(),
          type: 'error'
        };
      }

      setMessages(prev => [...prev, botMessage]);
      logChatbot('response_received', userMessage.text, botMessage.text);
    } catch (error) {
      logger.error('Erreur lors de la communication avec le serveur', error, 'CHATBOT_API');
      logChatbot('error', userMessage.text, null, error);
      
      // Fallback vers les réponses statiques si l'API échoue
      logger.warn('Utilisation du fallback statique', 'CHATBOT_FALLBACK', { question: userMessage.text });
      const answer = staticAnswers[userMessage.text];
      let botMessage: Message;

      if (answer) {
        botMessage = {
          id: (Date.now() + 1).toString(),
          text: answer,
          sender: 'bot',
          timestamp: new Date(),
          type: 'text'
        };
      } else {
        botMessage = {
          id: (Date.now() + 1).toString(),
          text: 'Je n\'ai pas pu traiter votre question. Veuillez reformuler ou essayer plus tard.',
          sender: 'bot',
          timestamp: new Date(),
          type: 'error'
        };
      }

      setMessages(prev => [...prev, botMessage]);
      logChatbot('fallback_used', userMessage.text, botMessage.text);
    } finally {
      setIsTyping(false);
      setIsLoading(false);
      logger.info('Traitement de la question terminé', 'CHATBOT_PROCESSING');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const clearConversation = () => {
    logUserAction('clear_conversation', 'ChatbotPage');
    logger.info('Conversation effacée', 'CHATBOT_UI');
    setMessages([
      {
        id: '1',
        text: 'Bienvenue ! Posez votre question Oracle.',
        sender: 'bot',
        timestamp: new Date(),
        type: 'text'
      }
    ]);
  };

  const exportConversation = () => {
    try {
      logUserAction('export_conversation', 'ChatbotPage', { messageCount: messages.length });
      logger.info('Export de conversation', 'CHATBOT_UI', { messageCount: messages.length });
      
      const conversation = messages.map(msg =>
        `[${msg.timestamp.toLocaleString()}] ${msg.sender === 'user' ? 'Vous' : 'Assistant'}: ${msg.text}`
      ).join('\n\n');
      const blob = new Blob([conversation], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `conversation-oracle-${new Date().toISOString().split('T')[0]}.txt`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      logger.error('Erreur lors de l\'export de conversation', error, 'CHATBOT_UI');
    }
  };

  return (
    <div className="h-full w-full bg-gradient-to-br from-blue-950 via-blue-900 to-blue-800 flex flex-col overflow-hidden">
      {/* Header fixe */}
      <div className="flex-shrink-0 bg-blue-950/90 backdrop-blur-sm border-b border-blue-800/50 p-4 md:p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-4 md:gap-6 justify-center">
            <Bot className="h-8 w-8 md:h-12 md:w-12 text-blue-300 drop-shadow-lg" />
            <div className="text-center">
              <h1 className="text-2xl md:text-3xl lg:text-4xl font-extrabold text-blue-100 drop-shadow-lg">
                Assistant Oracle IA
              </h1>
              <p className="text-xs md:text-sm lg:text-lg text-blue-200 mt-1 md:mt-2 max-w-2xl mx-auto">
                Posez vos questions Oracle, obtenez des réponses claires et des tableaux de résultats.
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
                    : 'bg-blue-950/80 text-blue-100'
                } flex flex-col shadow-lg border border-blue-900/40`}>
                  {/* En-tête du message */}
                  <div className="flex items-center gap-2 md:gap-3 mb-2 md:mb-3">
                    {message.sender === 'bot' && <Bot className="h-4 w-4 md:h-5 md:w-5 text-blue-400" />}
                    {message.sender === 'user' && <User className="h-4 w-4 md:h-5 md:w-5 text-blue-200" />}
                    <span className="text-xs text-blue-300">
                      {message.timestamp.toLocaleTimeString()}
                    </span>
                  </div>
                  
                  {/* Contenu du message */}
                  <div className="space-y-2 md:space-y-3">
                    {/* Message texte simple */}
                    {message.type === 'text' && (
                      <div className="text-blue-100 text-sm md:text-base leading-relaxed">
                        {message.summary || message.text}
                      </div>
                    )}

                    {/* Message d'erreur */}
                    {message.type === 'error' && (
                      <div className="p-2 md:p-3 bg-red-900/30 border-l-4 border-red-400 rounded text-red-200 text-sm md:text-base">
                        {message.text}
                      </div>
                    )}

                    {/* Tableau de données */}
                    {message.type === 'table' && Array.isArray(message.data) && message.columns && (
                      <div className="space-y-3 md:space-y-4">
                        {message.summary && (
                          <div className="p-2 md:p-3 bg-yellow-900/40 border-l-4 border-yellow-400 rounded text-yellow-200 text-sm md:text-base font-medium">
                            {message.summary}
                          </div>
                        )}
                        
                        <div className="overflow-x-auto">
                          <table className="min-w-full text-xs md:text-sm border border-blue-900 rounded-lg shadow">
                            <thead className="bg-blue-900/80">
                              <tr>
                                {message.columns.map((col) => (
                                  <th key={col} className="px-2 md:px-3 py-1 md:py-2 text-left font-semibold text-blue-200 border-b border-blue-800">
                                    {col}
                                  </th>
                                ))}
                              </tr>
                            </thead>
                            <tbody>
                              {message.data.map((row: any, idx: number) => (
                                <tr key={idx} className="hover:bg-blue-900/40 transition-colors">
                                  {message.columns && message.columns.map((col) => (
                                    <td key={col} className="px-2 md:px-3 py-1 md:py-2 text-blue-100 border-b border-blue-900">
                                      {row[col] !== undefined && row[col] !== null 
                                        ? row[col].toString() 
                                        : <span className="italic text-blue-400">N/A</span>
                                      }
                                    </td>
                                  ))}
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>

                        {message.explanation && (
                          <div className="p-2 md:p-3 bg-blue-900/30 border-l-4 border-blue-400 rounded text-blue-200 text-xs md:text-sm">
                            {message.explanation}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
            
            {/* Indicateur de frappe */}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-blue-900/80 text-blue-100 p-3 md:p-4 rounded-xl md:rounded-2xl flex items-center gap-2 md:gap-3 shadow">
                  <Bot className="h-4 w-4 md:h-5 md:w-5 text-blue-400" />
                  <div className="flex gap-1">
                    <div className="w-1.5 h-1.5 md:w-2 md:h-2 bg-blue-400 rounded-full animate-bounce"></div>
                    <div className="w-1.5 h-1.5 md:w-2 md:h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-1.5 h-1.5 md:w-2 md:h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Zone de saisie */}
        <div className="flex-shrink-0 space-y-2 md:space-y-4">
          <div className="flex gap-2 md:gap-3 w-full">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Posez votre question Oracle..."
              disabled={isLoading}
              className="flex-1 px-3 md:px-4 lg:px-6 py-2 md:py-3 lg:py-4 border border-blue-900 rounded-lg md:rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 bg-blue-950 text-blue-100 shadow-lg text-sm md:text-base disabled:opacity-50"
            />
            <button
              onClick={handleSendMessage}
              disabled={!inputText.trim() || isLoading}
              className="px-4 md:px-6 lg:px-8 py-2 md:py-3 lg:py-4 bg-blue-900 text-white rounded-lg md:rounded-xl hover:bg-blue-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 font-semibold shadow-lg text-sm md:text-base"
            >
              <Send className="h-4 w-4 md:h-5 md:w-5" />
              <span className="hidden sm:inline">Envoyer</span>
            </button>
          </div>
          
          <div className="text-xs text-blue-200 text-center">
            Entrée pour envoyer, Shift+Entrée pour une nouvelle ligne
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
    </div>
  );
};

export default ChatbotPage;
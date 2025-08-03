import React, { useState, useRef, useEffect } from 'react';
import { 
  Send, 
  Bot, 
  User, 
  Minimize2, 
  MessageSquare, 
  AlertTriangle, 
  ChartBar, 
  Users, 
  Clock, 
  Shield, 
  Terminal, 
  Monitor,
  Lightbulb,
  ListChecks,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  ArrowUpRight
} from 'lucide-react';

// Types
interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  type?: 'error' | 'message' | 'suggestions' | 'statistics' | 'table' | 'behavioral' | 'frequency' | 'security';
  data?: any;
  columns?: string[];
  summary?: string;
  explanation?: string;
  suggestions?: string[];
  interpretation?: {
    summary: string;
    insights: string[];
    recommendations: string[];
    anomalies: string[];
    trends: string[];
  };
}

interface StatisticalData {
  actionsByUser?: Array<{
    _id: string;
    actionCount: number;
    uniqueObjects: string[];
    uniquePrograms: string[];
  }>;
  hourlyActivity?: Array<{
    _id: number;
    count: number;
  }>;
  terminalUsers?: Array<{
    _id: string;
    users: string[];
    count: number;
  }>;
  clientPrograms?: Array<{
    _id: string;
    count: number;
    users: string[];
  }>;
}

// Composant pour afficher les tableaux de données
const TableDisplay: React.FC<{ data: any[]; columns: string[]; summary: string }> = ({ data, columns, summary }) => {
  const formatValue = (value: any): string => {
    if (Array.isArray(value)) return value.length.toString();
    if (typeof value === 'boolean') return value ? 'Oui' : 'Non';
    if (typeof value === 'number') return new Intl.NumberFormat('fr-FR').format(value);
    return value?.toString() || '';
  };

    return (
    <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-4 mt-2 border border-gray-700">
      <h3 className="text-lg font-semibold mb-4 text-white flex items-center">
        <ChartBar className="w-5 h-5 mr-2 text-blue-400" />
        {summary}
      </h3>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-700/50">
          <thead>
            <tr>
              {columns.map((column) => (
                <th key={column} className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider bg-gray-800/30">
                  {column}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700/50">
            {data.map((row, index) => (
              <tr key={index} className="hover:bg-gray-700/30 transition-colors">
                {columns.map((column) => {
                  const value = formatValue(row[column.toLowerCase()]);
                  const isNumeric = !isNaN(Number(value));
                  return (
                    <td key={column} className={`px-4 py-3 text-sm ${isNumeric ? 'text-right font-mono text-blue-300' : 'text-gray-300'}`}>
                      {value}
                  </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      </div>
    );
  };

// Composant pour afficher les statistiques
const StatisticsDisplay: React.FC<{ data: StatisticalData }> = ({ data }) => {
  const formatNumber = (num: number): string => new Intl.NumberFormat('fr-FR').format(num);

  return (
    <div className="space-y-6">
      {/* Statistiques utilisateurs */}
      {data.actionsByUser && (
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-4 border border-gray-700">
          <h3 className="text-lg font-semibold mb-4 text-white flex items-center">
            <Users className="w-5 h-5 mr-2 text-blue-400" />
            Statistiques par Utilisateur
          </h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-700/50">
              <thead>
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-400 uppercase tracking-wider bg-gray-800/30">Utilisateur</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider bg-gray-800/30">Actions</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider bg-gray-800/30">Objets uniques</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-400 uppercase tracking-wider bg-gray-800/30">Programmes</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-700/50">
                {data.actionsByUser.map((user) => (
                  <tr key={user._id} className="hover:bg-gray-700/30 transition-colors">
                    <td className="px-4 py-3 text-sm text-gray-300">{user._id}</td>
                    <td className="px-4 py-3 text-sm text-right font-mono text-blue-300">{formatNumber(user.actionCount)}</td>
                    <td className="px-4 py-3 text-sm text-right font-mono text-blue-300">{formatNumber(user.uniqueObjects.length)}</td>
                    <td className="px-4 py-3 text-sm text-right font-mono text-blue-300">{formatNumber(user.uniquePrograms.length)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Distribution horaire */}
      {data.hourlyActivity && (
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-4 border border-gray-700">
          <h3 className="text-lg font-semibold mb-4 text-white flex items-center">
            <Clock className="w-5 h-5 mr-2 text-blue-400" />
            Distribution Horaire
          </h3>
          <div className="grid grid-cols-24 gap-1 h-40 relative">
            {data.hourlyActivity.map((hour) => {
              const maxCount = Math.max(...data.hourlyActivity!.map(h => h.count));
              const height = (hour.count / maxCount) * 100;
    return (
                <div
                  key={hour._id}
                  className="flex flex-col items-center justify-end group"
                >
                  <div className="relative w-full">
                    <div
                      className="w-full bg-blue-500/20 absolute bottom-0 transition-all duration-200 group-hover:bg-blue-400"
                      style={{ height: `${height}%` }}
                    />
                  </div>
                  <div className="absolute top-full mt-2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-gray-900 text-white text-xs rounded px-2 py-1">
                    {hour._id}h: {formatNumber(hour.count)}
                  </div>
                  <span className="text-[10px] mt-1 text-gray-400">{hour._id}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Statistiques de sécurité */}
      {data.terminalUsers && (
        <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-4 border border-gray-700">
          <h3 className="text-lg font-semibold mb-4 text-white flex items-center">
            <Shield className="w-5 h-5 mr-2 text-blue-400" />
            Analyse de Sécurité
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h4 className="text-sm font-medium text-gray-300 flex items-center">
                <Terminal className="w-4 h-4 mr-2 text-blue-400" />
                Terminaux Partagés
              </h4>
              <ul className="space-y-2">
                {data.terminalUsers.map((terminal) => (
                  <li key={terminal._id} className="flex justify-between items-center p-2 rounded bg-gray-700/30 hover:bg-gray-700/50 transition-colors">
                    <span className="text-gray-300 text-sm">{terminal._id}</span>
                    <span className="text-xs bg-yellow-500/20 text-yellow-200 px-2 py-1 rounded-full">
                      {terminal.users.length} utilisateurs
                    </span>
                  </li>
                ))}
              </ul>
            </div>
            {data.clientPrograms && (
              <div className="space-y-4">
                <h4 className="text-sm font-medium text-gray-300 flex items-center">
                  <Monitor className="w-4 h-4 mr-2 text-blue-400" />
                  Programmes Clients
                </h4>
                <ul className="space-y-2">
                  {data.clientPrograms.map((program) => (
                    <li key={program._id} className="flex justify-between items-center p-2 rounded bg-gray-700/30 hover:bg-gray-700/50 transition-colors">
                      <span className="text-gray-300 text-sm">{program._id}</span>
                      <span className="text-xs bg-blue-500/20 text-blue-200 px-2 py-1 rounded-full">
                        {formatNumber(program.count)} utilisations
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      )}
      </div>
    );
  };

// Composant pour afficher l'analyse
const AnalysisDisplay: React.FC<{ interpretation: Message['interpretation'] }> = ({ interpretation }) => {
  if (!interpretation) return null;

      return (
    <div className="space-y-4 mt-4">
      {/* Résumé */}
      {interpretation.summary && (
        <div className="bg-blue-900/20 backdrop-blur-sm border border-blue-800/30 rounded-lg p-4">
          <h4 className="text-sm font-medium text-blue-300 flex items-center mb-2">
            <ChartBar className="w-4 h-4 mr-2" />
            Résumé de l'analyse
          </h4>
          <p className="text-sm text-blue-100">{interpretation.summary}</p>
        </div>
      )}

      {/* Insights */}
      {interpretation.insights && interpretation.insights.length > 0 && (
        <div className="bg-indigo-900/20 backdrop-blur-sm border border-indigo-800/30 rounded-lg p-4">
          <h4 className="text-sm font-medium text-indigo-300 flex items-center mb-2">
            <Lightbulb className="w-4 h-4 mr-2" />
            Points clés
          </h4>
          <ul className="space-y-2">
            {interpretation.insights.map((insight, index) => (
              <li key={index} className="text-sm text-indigo-100 flex items-start">
                <span className="mr-2">•</span>
                {insight}
              </li>
            ))}
          </ul>
            </div>
          )}

      {/* Recommandations */}
      {interpretation.recommendations && interpretation.recommendations.length > 0 && (
        <div className="bg-emerald-900/20 backdrop-blur-sm border border-emerald-800/30 rounded-lg p-4">
          <h4 className="text-sm font-medium text-emerald-300 flex items-center mb-2">
            <ListChecks className="w-4 h-4 mr-2" />
            Recommandations
          </h4>
          <ul className="space-y-2">
            {interpretation.recommendations.map((recommendation, index) => (
              <li key={index} className="text-sm text-emerald-100 flex items-start">
                <CheckCircle2 className="w-4 h-4 mr-2 flex-shrink-0 mt-0.5" />
                {recommendation}
              </li>
            ))}
          </ul>
          </div>
      )}

      {/* Anomalies */}
      {interpretation.anomalies && interpretation.anomalies.length > 0 && (
        <div className="bg-red-900/20 backdrop-blur-sm border border-red-800/30 rounded-lg p-4">
          <h4 className="text-sm font-medium text-red-300 flex items-center mb-2">
            <AlertTriangle className="w-4 h-4 mr-2" />
            Points d'attention
          </h4>
          <ul className="space-y-2">
            {interpretation.anomalies.map((anomaly, index) => (
              <li key={index} className="text-sm text-red-100 flex items-start">
                <AlertCircle className="w-4 h-4 mr-2 flex-shrink-0 mt-0.5" />
                {anomaly}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Tendances */}
      {interpretation.trends && interpretation.trends.length > 0 && (
        <div className="bg-purple-900/20 backdrop-blur-sm border border-purple-800/30 rounded-lg p-4">
          <h4 className="text-sm font-medium text-purple-300 flex items-center mb-2">
            <TrendingUp className="w-4 h-4 mr-2" />
            Tendances
          </h4>
          <ul className="space-y-2">
            {interpretation.trends.map((trend, index) => (
              <li key={index} className="text-sm text-purple-100 flex items-start">
                <ArrowUpRight className="w-4 h-4 mr-2 flex-shrink-0 mt-0.5" />
                {trend}
              </li>
            ))}
          </ul>
        </div>
      )}
        </div>
      );
};

// Composant principal du chatbot
const Chatbot: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isMinimized, setIsMinimized] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [showStatistics, setShowStatistics] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputText.trim()) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      text: inputText,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, newMessage]);
    setInputText('');
    setIsTyping(true);

    try {
      const response = await fetch('http://localhost:4000/api/chatbot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: inputText })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      // Support for SQLite direct results
      let botMessage: Message;
      if (data.type === 'table' && Array.isArray(data.data) && Array.isArray(data.columns)) {
        botMessage = {
          id: (Date.now() + 1).toString(),
          text: '',
          sender: 'bot',
          timestamp: new Date(),
          type: 'table',
          data: data.data,
          columns: data.columns,
          summary: data.summary || '',
          explanation: data.explanation,
          interpretation: data.interpretation
        };
      } else {
        botMessage = {
          id: (Date.now() + 1).toString(),
          text: data.data || data.summary || 'Réponse reçue.',
          sender: 'bot',
          timestamp: new Date(),
          type: data.type,
          data: data.data,
          columns: data.columns,
          summary: data.summary,
          explanation: data.explanation,
          interpretation: data.interpretation
        };
      }
      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      console.error('Erreur lors de la communication avec le serveur:', error);
      setMessages(prev => [
        ...prev,
        {
          id: (Date.now() + 4).toString(),
          text: "Une erreur est survenue lors de la communication avec le serveur.",
          sender: 'bot',
          timestamp: new Date(),
          type: 'error'
        }
      ]);
    }
    setIsTyping(false);
  };

  // Affichage d'un message du bot
  const renderBotMessage = (response) => {
    // Affiche le résumé textuel
    if (response.type === 'text') {
      return <div className="bot-message">{response.summary}</div>;
    }
    // Affiche un tableau si besoin
    if (response.type === 'table' && response.data && response.columns) {
      return (
        <table className="bot-table">
          <thead>
            <tr>
              {response.columns.map(col => <th key={col}>{col}</th>)}
            </tr>
          </thead>
          <tbody>
            {response.data.map((row, i) => (
              <tr key={i}>
                {response.columns.map(col => <td key={col}>{row[col]}</td>)}
              </tr>
            ))}
          </tbody>
        </table>
      );
    }
    // Par défaut, affiche le résumé
    return <div className="bot-message">{response.summary}</div>;
  };

  if (isMinimized) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <button
          onClick={() => setIsMinimized(false)}
          className="bg-blue-900 dark:bg-blue-800 text-white p-4 rounded-full shadow-lg hover:bg-blue-800 dark:hover:bg-blue-700 transition-colors"
        >
          <Bot className="h-6 w-6" />
        </button>
      </div>
    );
  }

  return (
    <div className="fixed bottom-6 right-6 w-[550px] bg-gray-900 border border-gray-800 rounded-2xl shadow-2xl z-50 backdrop-blur-lg font-sans">
      <div className="flex items-center justify-between p-6 border-b border-gray-800 bg-blue-900 dark:bg-blue-800 text-white rounded-t-2xl">
        <div className="flex items-center space-x-3">
          <Bot className="h-7 w-7" />
          <span className="font-bold text-lg">Assistant Oracle IA</span>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setShowStatistics(!showStatistics)}
            className="text-white hover:text-gray-300 transition-colors p-2 rounded-lg hover:bg-white/10"
            title="Statistiques"
          >
            <MessageSquare className="h-5 w-5" />
          </button>
        <button
          onClick={() => setIsMinimized(true)}
          className="text-white hover:text-gray-300 transition-colors p-2 rounded-lg hover:bg-white/10"
        >
          <Minimize2 className="h-5 w-5" />
        </button>
        </div>
      </div>

      <div className="h-[600px] flex flex-col">
        <div className="flex-1 overflow-y-auto p-6 space-y-5 scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-900">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[90%] p-4 rounded-xl shadow-lg flex items-start space-x-3 transition-all duration-200 ${
                  message.sender === 'user'
                    ? 'bg-blue-900 dark:bg-blue-700 text-white'
                    : 'bg-gray-800 text-gray-100 border border-gray-700'
                }`}
              >
                {message.sender === 'user' ? (
                  <User className="h-6 w-6 text-blue-300" />
                ) : (
                  <Bot className="h-6 w-6 text-green-300" />
                )}
                <div className="flex-1">
                  {message.sender === 'bot' ? renderBotMessage(message) : (
                    <div className="whitespace-pre-wrap text-base text-blue-100 font-medium">{message.text}</div>
                  )}
                </div>
              </div>
            </div>
          ))}
          {isTyping && (
            <div className="flex justify-start">
              <div className="max-w-[90%] p-4 rounded-xl shadow-lg bg-gray-800 text-gray-100 border border-gray-700 flex items-center animate-pulse">
                <Bot className="h-6 w-6 text-green-300 mr-3" />
                <span className="text-base text-gray-300 font-medium">L'assistant analyse votre demande...</span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="border-t border-gray-800 p-6 bg-gray-900 rounded-b-2xl">
          <form
            className="flex items-center gap-3"
            onSubmit={e => {
              e.preventDefault();
              handleSendMessage();
            }}
          >
            <input
              type="text"
              className="flex-1 bg-gray-800 text-white rounded-xl px-5 py-3 text-base focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400 font-medium"
              placeholder="Posez votre question sur la base de données..."
              value={inputText}
              onChange={e => setInputText(e.target.value)}
              autoFocus
            />
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl px-6 py-3 transition-colors flex items-center gap-2 font-semibold text-base shadow-lg hover:shadow-xl"
              disabled={isTyping || !inputText.trim()}
            >
              <Send className="h-6 w-6" />
              Envoyer
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Chatbot;
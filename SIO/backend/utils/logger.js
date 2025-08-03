const fs = require('fs');
const path = require('path');

// Configuration des chemins de logs
const LOGS_DIR = path.join(__dirname, '..', '..', 'logs');
const BACKEND_LOG_FILE = path.join(LOGS_DIR, 'backend.log');
const BACKEND_ERROR_LOG_FILE = path.join(LOGS_DIR, 'backend-errors.log');
const API_LOG_FILE = path.join(LOGS_DIR, 'api.log');
const CHATBOT_LOG_FILE = path.join(LOGS_DIR, 'chatbot.log');
const MONGODB_LOG_FILE = path.join(LOGS_DIR, 'mongodb.log');

// Créer le dossier logs s'il n'existe pas
if (!fs.existsSync(LOGS_DIR)) {
  fs.mkdirSync(LOGS_DIR, { recursive: true });
}

// Fonction utilitaire pour formater la date
const formatTimestamp = () => {
  return new Date().toISOString();
};

// Fonction utilitaire pour écrire dans un fichier
const writeToFile = (filePath, message) => {
  try {
    const logEntry = `${formatTimestamp()} ${message}\n`;
    fs.appendFileSync(filePath, logEntry, 'utf8');
  } catch (error) {
    console.error('Erreur lors de l\'écriture du log:', error);
  }
};

// Fonction utilitaire pour nettoyer les anciens logs (garder seulement les 7 derniers jours)
const cleanOldLogs = (filePath) => {
  try {
    if (fs.existsSync(filePath)) {
      const stats = fs.statSync(filePath);
      const daysOld = (Date.now() - stats.mtime.getTime()) / (1000 * 60 * 60 * 24);
      
      if (daysOld > 7) {
        // Garder seulement les 1000 dernières lignes
        const content = fs.readFileSync(filePath, 'utf8');
        const lines = content.split('\n');
        if (lines.length > 1000) {
          const recentLines = lines.slice(-1000);
          fs.writeFileSync(filePath, recentLines.join('\n') + '\n', 'utf8');
        }
      }
    }
  } catch (error) {
    console.error('Erreur lors du nettoyage des logs:', error);
  }
};

// Logger principal pour le backend
const backendLogger = {
  info: (message, context = '') => {
    const logMessage = `[INFO] [${context}] ${message}`;
    console.log(logMessage);
    writeToFile(BACKEND_LOG_FILE, logMessage);
  },
  
  warn: (message, context = '') => {
    const logMessage = `[WARN] [${context}] ${message}`;
    console.warn(logMessage);
    writeToFile(BACKEND_LOG_FILE, logMessage);
  },
  
  error: (message, error = null, context = '') => {
    let logMessage = `[ERROR] [${context}] ${message}`;
    if (error) {
      logMessage += `\nStack: ${error.stack || error.message || error}`;
    }
    console.error(logMessage);
    writeToFile(BACKEND_ERROR_LOG_FILE, logMessage);
    writeToFile(BACKEND_LOG_FILE, logMessage);
  },
  
  debug: (message, context = '') => {
    const logMessage = `[DEBUG] [${context}] ${message}`;
    console.log(logMessage);
    writeToFile(BACKEND_LOG_FILE, logMessage);
  }
};

// Logger spécifique pour l'API
const apiLogger = {
  request: (method, url, ip, userAgent) => {
    const logMessage = `[API_REQUEST] ${method} ${url} - IP: ${ip} - User-Agent: ${userAgent}`;
    writeToFile(API_LOG_FILE, logMessage);
  },
  
  response: (method, url, statusCode, responseTime) => {
    const logMessage = `[API_RESPONSE] ${method} ${url} - Status: ${statusCode} - Time: ${responseTime}ms`;
    writeToFile(API_LOG_FILE, logMessage);
  },
  
  error: (method, url, error, statusCode = 500) => {
    const logMessage = `[API_ERROR] ${method} ${url} - Status: ${statusCode} - Error: ${error.message || error}`;
    writeToFile(API_LOG_FILE, logMessage);
  }
};

// Logger spécifique pour le chatbot
const chatbotLogger = {
  question: (question, userId = 'anonymous') => {
    const logMessage = `[CHATBOT_QUESTION] User: ${userId} - Question: "${question}"`;
    writeToFile(CHATBOT_LOG_FILE, logMessage);
  },
  
  response: (question, response, responseTime) => {
    const logMessage = `[CHATBOT_RESPONSE] Question: "${question}" - Response: "${response}" - Time: ${responseTime}ms`;
    writeToFile(CHATBOT_LOG_FILE, logMessage);
  },
  
  error: (question, error) => {
    const logMessage = `[CHATBOT_ERROR] Question: "${question}" - Error: ${error.message || error}`;
    writeToFile(CHATBOT_LOG_FILE, logMessage);
  },
  
  fallback: (question, fallbackResponse) => {
    const logMessage = `[CHATBOT_FALLBACK] Question: "${question}" - Fallback: "${fallbackResponse}"`;
    writeToFile(CHATBOT_LOG_FILE, logMessage);
  }
};

// Logger spécifique pour MongoDB
const mongodbLogger = {
  connect: (uri) => {
    const logMessage = `[MONGODB_CONNECT] Attempting connection to: ${uri}`;
    writeToFile(MONGODB_LOG_FILE, logMessage);
  },
  
  connected: (uri) => {
    const logMessage = `[MONGODB_CONNECTED] Successfully connected to: ${uri}`;
    writeToFile(MONGODB_LOG_FILE, logMessage);
  },
  
  error: (error, context = '') => {
    const logMessage = `[MONGODB_ERROR] [${context}] ${error.message || error}`;
    writeToFile(MONGODB_LOG_FILE, logMessage);
  },
  
  query: (collection, operation, query = {}) => {
    const logMessage = `[MONGODB_QUERY] Collection: ${collection} - Operation: ${operation} - Query: ${JSON.stringify(query)}`;
    writeToFile(MONGODB_LOG_FILE, logMessage);
  },
  
  result: (collection, operation, count) => {
    const logMessage = `[MONGODB_RESULT] Collection: ${collection} - Operation: ${operation} - Count: ${count}`;
    writeToFile(MONGODB_LOG_FILE, logMessage);
  }
};

// Fonction de nettoyage périodique des logs
const cleanLogs = () => {
  cleanOldLogs(BACKEND_LOG_FILE);
  cleanOldLogs(BACKEND_ERROR_LOG_FILE);
  cleanOldLogs(API_LOG_FILE);
  cleanOldLogs(CHATBOT_LOG_FILE);
  cleanOldLogs(MONGODB_LOG_FILE);
};

// Nettoyer les logs au démarrage
cleanLogs();

// Middleware Express pour logger les requêtes
const requestLogger = (req, res, next) => {
  const start = Date.now();
  
  // Logger la requête
  apiLogger.request(
    req.method,
    req.originalUrl,
    req.ip || req.connection.remoteAddress,
    req.get('User-Agent') || 'Unknown'
  );
  
  // Intercepter la réponse
  res.on('finish', () => {
    const duration = Date.now() - start;
    apiLogger.response(req.method, req.originalUrl, res.statusCode, duration);
  });
  
  next();
};

// Fonction pour logger les erreurs non capturées
const setupErrorHandling = () => {
  process.on('uncaughtException', (error) => {
    backendLogger.error('Uncaught Exception', error, 'PROCESS');
    process.exit(1);
  });
  
  process.on('unhandledRejection', (reason, promise) => {
    backendLogger.error('Unhandled Rejection', reason, 'PROCESS');
  });
  
  process.on('SIGTERM', () => {
    backendLogger.info('SIGTERM received, shutting down gracefully', 'PROCESS');
    process.exit(0);
  });
  
  process.on('SIGINT', () => {
    backendLogger.info('SIGINT received, shutting down gracefully', 'PROCESS');
    process.exit(0);
  });
};

module.exports = {
  backendLogger,
  apiLogger,
  chatbotLogger,
  mongodbLogger,
  requestLogger,
  setupErrorHandling,
  cleanLogs
}; 
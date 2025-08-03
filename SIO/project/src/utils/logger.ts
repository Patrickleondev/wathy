// Système de logging pour le frontend
interface LogLevel {
  INFO: 'INFO';
  WARN: 'WARN';
  ERROR: 'ERROR';
  DEBUG: 'DEBUG';
}

interface LogEntry {
  timestamp: string;
  level: string;
  context: string;
  message: string;
  data?: any;
}

class FrontendLogger {
  private static instance: FrontendLogger;
  private logsDir: string = '/logs'; // Dossier relatif pour les logs frontend
  private maxLogSize: number = 1000; // Nombre maximum de lignes par fichier

  private constructor() {
    this.initializeLogs();
  }

  public static getInstance(): FrontendLogger {
    if (!FrontendLogger.instance) {
      FrontendLogger.instance = new FrontendLogger();
    }
    return FrontendLogger.instance;
  }

  private initializeLogs(): void {
    // Créer les fichiers de logs s'ils n'existent pas
    this.createLogFile('frontend.log');
    this.createLogFile('frontend-errors.log');
    this.createLogFile('frontend-ui.log');
    this.createLogFile('frontend-api.log');
    this.createLogFile('frontend-chatbot.log');
  }

  private createLogFile(filename: string): void {
    try {
      const logEntry = `${new Date().toISOString()} [SYSTEM] Initialisation du fichier de log: ${filename}\n`;
      this.writeToFile(filename, logEntry);
    } catch (error) {
      console.error(`Erreur lors de la création du fichier de log ${filename}:`, error);
    }
  }

  private writeToFile(filename: string, message: string): void {
    try {
      // En production, on pourrait envoyer les logs au serveur
      // Pour le développement, on utilise localStorage comme fallback
      const logs = JSON.parse(localStorage.getItem(`logs_${filename}`) || '[]');
      logs.push({
        timestamp: new Date().toISOString(),
        message: message.trim()
      });

      // Limiter la taille des logs
      if (logs.length > this.maxLogSize) {
        logs.splice(0, logs.length - this.maxLogSize);
      }

      localStorage.setItem(`logs_${filename}`, JSON.stringify(logs));
    } catch (error) {
      console.error(`Erreur lors de l'écriture dans ${filename}:`, error);
    }
  }

  private formatLogEntry(level: string, context: string, message: string, data?: any): string {
    const timestamp = new Date().toISOString();
    let logEntry = `${timestamp} [${level}] [${context}] ${message}`;
    
    if (data) {
      logEntry += ` - Data: ${JSON.stringify(data)}`;
    }
    
    return logEntry + '\n';
  }

  public info(message: string, context: string = 'GENERAL', data?: any): void {
    const logEntry = this.formatLogEntry('INFO', context, message, data);
    this.writeToFile('frontend.log', logEntry);
    console.log(`[INFO] [${context}] ${message}`, data || '');
  }

  public warn(message: string, context: string = 'GENERAL', data?: any): void {
    const logEntry = this.formatLogEntry('WARN', context, message, data);
    this.writeToFile('frontend.log', logEntry);
    console.warn(`[WARN] [${context}] ${message}`, data || '');
  }

  public error(message: string, error?: any, context: string = 'GENERAL', data?: any): void {
    let errorMessage = message;
    if (error) {
      errorMessage += ` - Error: ${error.message || error}`;
      if (error.stack) {
        errorMessage += ` - Stack: ${error.stack}`;
      }
    }

    const logEntry = this.formatLogEntry('ERROR', context, errorMessage, data);
    this.writeToFile('frontend-errors.log', logEntry);
    this.writeToFile('frontend.log', logEntry);
    console.error(`[ERROR] [${context}] ${errorMessage}`, data || '');
  }

  public debug(message: string, context: string = 'GENERAL', data?: any): void {
    const logEntry = this.formatLogEntry('DEBUG', context, message, data);
    this.writeToFile('frontend.log', logEntry);
    console.log(`[DEBUG] [${context}] ${message}`, data || '');
  }

  // Logger spécifique pour l'UI
  public ui(action: string, component: string, details?: any): void {
    const message = `UI Action: ${action}`;
    const context = `UI_${component}`;
    this.info(message, context, details);
    this.writeToFile('frontend-ui.log', this.formatLogEntry('INFO', context, message, details));
  }

  // Logger spécifique pour les appels API
  public api(method: string, url: string, status?: number, responseTime?: number, error?: any): void {
    const message = `${method} ${url}`;
    const context = 'API';
    const data = { status, responseTime, error: error?.message };
    
    if (error) {
      this.error(message, error, context, data);
      this.writeToFile('frontend-api.log', this.formatLogEntry('ERROR', context, message, data));
    } else {
      this.info(message, context, data);
      this.writeToFile('frontend-api.log', this.formatLogEntry('INFO', context, message, data));
    }
  }

  // Logger spécifique pour le chatbot
  public chatbot(action: string, question?: string, response?: any, error?: any): void {
    const message = `Chatbot ${action}`;
    const context = 'CHATBOT';
    const data = { question, response, error: error?.message };
    
    if (error) {
      this.error(message, error, context, data);
      this.writeToFile('frontend-chatbot.log', this.formatLogEntry('ERROR', context, message, data));
    } else {
      this.info(message, context, data);
      this.writeToFile('frontend-chatbot.log', this.formatLogEntry('INFO', context, message, data));
    }
  }

  // Fonction pour récupérer les logs (pour debug)
  public getLogs(filename: string): any[] {
    try {
      return JSON.parse(localStorage.getItem(`logs_${filename}`) || '[]');
    } catch (error) {
      console.error(`Erreur lors de la récupération des logs ${filename}:`, error);
      return [];
    }
  }

  // Fonction pour nettoyer les logs
  public clearLogs(filename?: string): void {
    if (filename) {
      localStorage.removeItem(`logs_${filename}`);
    } else {
      // Nettoyer tous les logs
      const logFiles = ['frontend.log', 'frontend-errors.log', 'frontend-ui.log', 'frontend-api.log', 'frontend-chatbot.log'];
      logFiles.forEach(file => localStorage.removeItem(`logs_${file}`));
    }
  }

  // Fonction pour exporter les logs
  public exportLogs(filename: string): string {
    try {
      const logs = this.getLogs(filename);
      return logs.map(log => `${log.timestamp} ${log.message}`).join('\n');
    } catch (error) {
      console.error(`Erreur lors de l'export des logs ${filename}:`, error);
      return '';
    }
  }
}

// Instance singleton
const logger = FrontendLogger.getInstance();

// Fonction utilitaire pour logger les erreurs non capturées
export const setupErrorHandling = (): void => {
  // Logger les erreurs JavaScript non capturées
  window.addEventListener('error', (event) => {
    logger.error('Erreur JavaScript non capturée', event.error, 'UNCAUGHT_ERROR', {
      filename: event.filename,
      lineno: event.lineno,
      colno: event.colno
    });
  });

  // Logger les promesses rejetées non gérées
  window.addEventListener('unhandledrejection', (event) => {
    logger.error('Promesse rejetée non gérée', event.reason, 'UNHANDLED_REJECTION');
  });

  // Logger les erreurs de chargement de ressources
  window.addEventListener('error', (event) => {
    if (event.target !== window) {
      logger.error('Erreur de chargement de ressource', event.error, 'RESOURCE_ERROR', {
        target: event.target,
        type: event.type
      });
    }
  }, true);
};

// Fonction utilitaire pour logger les performances
export const logPerformance = (name: string, duration: number): void => {
  logger.info(`Performance: ${name}`, 'PERFORMANCE', { duration });
};

// Fonction utilitaire pour logger les actions utilisateur
export const logUserAction = (action: string, component: string, details?: any): void => {
  logger.ui(action, component, details);
};

// Fonction utilitaire pour logger les appels API
export const logApiCall = (method: string, url: string, status?: number, responseTime?: number, error?: any): void => {
  logger.api(method, url, status, responseTime, error);
};

// Fonction utilitaire pour logger les interactions chatbot
export const logChatbot = (action: string, question?: string, response?: any, error?: any): void => {
  logger.chatbot(action, question, response, error);
};

export default logger; 
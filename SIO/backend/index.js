const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const { answerQuestion } = require('./questionTemplates');
const { 
  backendLogger, 
  apiLogger, 
  chatbotLogger, 
  mongodbLogger, 
  requestLogger, 
  setupErrorHandling 
} = require('./utils/logger');

const app = express();
const PORT = process.env.PORT || 4000;

// Configuration des logs d'erreurs non capturées
setupErrorHandling();

// Middleware
app.use(cors());
app.use(express.json());

// Middleware de logging des requêtes
app.use(requestLogger);

// Configuration MongoDB
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/auditdb';

// Fonction pour obtenir des données d'audit par défaut quand MongoDB n'est pas disponible
const getDefaultAuditData = () => {
  return [
    {
      _id: 'default_1',
      OS_USERNAME: 'datchemi',
      DBUSERNAME: 'datchemi',
      ACTION_NAME: 'SELECT',
      OBJECT_NAME: 'SEQ$',
      EVENT_TIMESTAMP: '2025-07-31T10:30:00Z',
      CLIENT_PROGRAM_NAME: 'SQL Developer',
      TERMINAL: 'unknown',
      AUTHENTICATION_TYPE: 'DATABASE',
      OBJECT_SCHEMA: 'SYS',
      USERHOST: '192.168.60.42'
    },
    {
      _id: 'default_2',
      OS_USERNAME: 'ATCHEMI',
      DBUSERNAME: 'ATCHEMI',
      ACTION_NAME: 'INSERT',
      OBJECT_NAME: 'SEQ$',
      EVENT_TIMESTAMP: '2025-07-31T11:15:00Z',
      CLIENT_PROGRAM_NAME: 'SQL Developer',
      TERMINAL: 'unknown',
      AUTHENTICATION_TYPE: 'DATABASE',
      OBJECT_SCHEMA: 'USER_SCHEMA',
      USERHOST: '192.168.60.42'
    },
    {
      _id: 'default_3',
      OS_USERNAME: 'SYSTEM',
      DBUSERNAME: 'SYSTEM',
      ACTION_NAME: 'UPDATE',
      OBJECT_NAME: 'DBA_USERS',
      EVENT_TIMESTAMP: '2025-07-31T11:45:00Z',
      CLIENT_PROGRAM_NAME: 'SQL*Plus',
      TERMINAL: 'unknown',
      AUTHENTICATION_TYPE: 'DATABASE',
      OBJECT_SCHEMA: 'SYS',
      USERHOST: '192.168.60.42'
    },
    {
      _id: 'default_4',
      OS_USERNAME: 'SYS',
      DBUSERNAME: 'SYS',
      ACTION_NAME: 'SELECT',
      OBJECT_NAME: 'SUM$',
      EVENT_TIMESTAMP: '2025-07-31T12:00:00Z',
      CLIENT_PROGRAM_NAME: 'SQL Developer',
      TERMINAL: 'unknown',
      AUTHENTICATION_TYPE: 'DATABASE',
      OBJECT_SCHEMA: 'SYS',
      USERHOST: '192.168.60.42'
    },
    {
      _id: 'default_5',
      OS_USERNAME: 'datchemi',
      DBUSERNAME: 'datchemi',
      ACTION_NAME: 'DELETE',
      OBJECT_NAME: 'TEMP_TABLE',
      EVENT_TIMESTAMP: '2025-07-31T12:30:00Z',
      CLIENT_PROGRAM_NAME: 'SQL Developer',
      TERMINAL: 'unknown',
      AUTHENTICATION_TYPE: 'DATABASE',
      OBJECT_SCHEMA: 'USER_SCHEMA',
      USERHOST: '192.168.60.42'
    }
  ];
};

// Connexion MongoDB avec logging
const connectToMongoDB = async () => {
  try {
    mongodbLogger.connect(MONGODB_URI);
    
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    mongodbLogger.connected(MONGODB_URI);
    backendLogger.info('MongoDB connecté avec succès', 'DATABASE');
    return true;
  } catch (error) {
    mongodbLogger.error(error, 'CONNECTION');
    backendLogger.error('Erreur de connexion MongoDB', error, 'DATABASE');
    return false;
  }
};

// Endpoint de santé
app.get('/api/health', (req, res) => {
  backendLogger.info('Health check demandé', 'HEALTH');
  res.json({ 
    status: 'success', 
    message: 'Serveur Oracle Audit en ligne',
    timestamp: new Date().toISOString(),
    mongodb: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
  });
});

// Endpoint de diagnostic MongoDB
app.get('/api/mongodb/diagnostic', async (req, res) => {
  try {
    backendLogger.info('Diagnostic MongoDB demandé', 'DIAGNOSTIC');
    
    const diagnostic = {
      connection: {
        readyState: mongoose.connection.readyState,
        connected: mongoose.connection.readyState === 1,
        uri: MONGODB_URI
      },
      database: null,
      collections: [],
      auditData: {
        count: 0,
        sample: null
      }
    };
    
    if (mongoose.connection.readyState === 1) {
      try {
        const db = mongoose.connection.db;
        diagnostic.database = {
          name: db.databaseName,
          collections: await db.listCollections().toArray()
        };
        
        // Vérifier la collection actions_audit
        const auditCollection = db.collection('actions_audit');
        const count = await auditCollection.countDocuments();
        diagnostic.auditData.count = count;
        
        if (count > 0) {
          const sample = await auditCollection.find({}).limit(1).toArray();
          diagnostic.auditData.sample = sample[0];
        }
        
        backendLogger.info(`Diagnostic MongoDB: ${count} documents trouvés`, 'DIAGNOSTIC');
        
      } catch (dbError) {
        backendLogger.error('Erreur lors du diagnostic MongoDB', dbError, 'DIAGNOSTIC');
        diagnostic.error = dbError.message;
      }
    }
    
    res.json({ status: 'success', data: diagnostic });
    
  } catch (error) {
    backendLogger.error('Erreur lors du diagnostic MongoDB', error, 'DIAGNOSTIC');
    res.status(500).json({
      status: 'error',
      message: 'Erreur lors du diagnostic MongoDB',
      error: error.message
    });
  }
});

// Endpoint pour récupérer les données d'audit
app.get('/api/audit/raw', async (req, res) => {
  try {
    backendLogger.info('Demande de données d\'audit brutes', 'AUDIT');
    
    if (mongoose.connection.readyState === 1) {
      mongodbLogger.query('actions_audit', 'find', {});
      
      const auditData = await mongoose.connection.db
        .collection('actions_audit')
        .find({})
        .toArray(); // Récupérer toutes les données sans limite
      
      mongodbLogger.result('actions_audit', 'find', auditData.length);
      
      if (auditData.length === 0) {
        backendLogger.warn('Aucune donnée trouvée dans MongoDB, utilisation des données par défaut', 'AUDIT');
        const defaultData = getDefaultAuditData();
        res.json({ status: 'success', data: defaultData, source: 'default' });
      } else {
        backendLogger.info(`${auditData.length} entrées d'audit récupérées depuis MongoDB`, 'AUDIT');
        res.json({ status: 'success', data: auditData, source: 'mongodb' });
      }
    } else {
      backendLogger.warn('MongoDB non connecté, utilisation des données par défaut', 'AUDIT');
      const defaultData = getDefaultAuditData();
      res.json({ status: 'success', data: defaultData, source: 'default' });
    }
  } catch (error) {
    backendLogger.error('Erreur lors de la récupération des données d\'audit, utilisation des données par défaut', error, 'AUDIT');
    apiLogger.error('GET', '/api/audit/raw', error, 500);
    
    const defaultData = getDefaultAuditData();
    res.json({ status: 'success', data: defaultData, source: 'default', error: error.message });
  }
});

// Endpoint chatbot avec logging détaillé
app.post('/api/chatbot', async (req, res) => {
  const startTime = Date.now();
  const { question } = req.body;
  
  try {
    if (!question || typeof question !== 'string') {
      chatbotLogger.error(question || 'undefined', new Error('Question invalide'));
      return res.status(400).json({ 
        status: 'error', 
        message: 'Question requise et doit être une chaîne de caractères' 
      });
    }
    
    chatbotLogger.question(question);
    backendLogger.info(`Question chatbot reçue: "${question}"`, 'CHATBOT');
    
    // Récupérer les données d'audit depuis MongoDB ou utiliser les données par défaut
    let auditData = [];
    let dataSource = 'mongodb';
    
    if (mongoose.connection.readyState === 1) {
      try {
        auditData = await mongoose.connection.db
          .collection('actions_audit')
          .find({})
          .toArray(); // Récupérer toutes les données sans limite
        
        backendLogger.info(`Récupération de ${auditData.length} entrées depuis MongoDB pour le chatbot`, 'CHATBOT');
        
        if (auditData.length === 0) {
          backendLogger.warn('Aucune donnée MongoDB, utilisation des données par défaut', 'CHATBOT');
          auditData = getDefaultAuditData();
          dataSource = 'default';
        }
      } catch (dbError) {
        backendLogger.error('Erreur lors de la récupération des données MongoDB, utilisation des données par défaut', dbError, 'CHATBOT');
        auditData = getDefaultAuditData();
        dataSource = 'default';
      }
    } else {
      backendLogger.warn('MongoDB non connecté, utilisation des données par défaut', 'CHATBOT');
      auditData = getDefaultAuditData();
      dataSource = 'default';
    }
    
    // Traiter la question
    const result = answerQuestion(auditData, question);
    const responseTime = Date.now() - startTime;
    
    chatbotLogger.response(question, result.summary, responseTime);
    backendLogger.info(`Réponse chatbot générée en ${responseTime}ms`, 'CHATBOT');
    
    res.json({
      status: 'success',
      data: result,
      responseTime: responseTime,
      dataSource: dataSource
    });
    
  } catch (error) {
    const responseTime = Date.now() - startTime;
    chatbotLogger.error(question, error);
    backendLogger.error('Erreur lors du traitement de la question chatbot', error, 'CHATBOT');
    apiLogger.error('POST', '/api/chatbot', error, 500);
    
    res.status(500).json({
      status: 'error',
      message: 'Erreur lors du traitement de votre question',
      error: error.message,
      responseTime: responseTime
    });
  }
});

// Endpoint pour les statistiques détaillées
app.get('/api/stats', async (req, res) => {
  try {
    backendLogger.info('Demande de statistiques', 'STATS');
    
    let auditData = [];
    let dataSource = 'mongodb';
    
    if (mongoose.connection.readyState === 1) {
      try {
        auditData = await mongoose.connection.db
          .collection('actions_audit')
          .find({})
          .toArray(); // Récupérer toutes les données sans limite
        
        if (auditData.length === 0) {
          backendLogger.warn('Aucune donnée MongoDB, utilisation des données par défaut pour les statistiques', 'STATS');
          auditData = getDefaultAuditData();
          dataSource = 'default';
        }
      } catch (dbError) {
        backendLogger.error('Erreur lors de la récupération des statistiques, utilisation des données par défaut', dbError, 'STATS');
        auditData = getDefaultAuditData();
        dataSource = 'default';
      }
    } else {
      backendLogger.warn('MongoDB non connecté, utilisation des données par défaut pour les statistiques', 'STATS');
      auditData = getDefaultAuditData();
      dataSource = 'default';
    }
    
    const stats = {
      totalEntries: auditData.length,
      uniqueUsers: [...new Set(auditData.map(item => item.dbusername))].length,
      uniqueActions: [...new Set(auditData.map(item => item.action_name))].length,
      uniqueObjects: [...new Set(auditData.map(item => item.object_name))].length,
      source: dataSource
    };
    
    backendLogger.info(`Statistiques générées: ${JSON.stringify(stats)}`, 'STATS');
    res.json({ status: 'success', data: stats });
    
  } catch (error) {
    backendLogger.error('Erreur lors de la génération des statistiques', error, 'STATS');
    apiLogger.error('GET', '/api/stats', error, 500);
    
    res.status(500).json({
      status: 'error',
      message: 'Erreur lors de la génération des statistiques',
      error: error.message
    });
  }
});

// Gestion des erreurs 404 - doit être la dernière route
app.use((req, res) => {
  backendLogger.warn(`Route non trouvée: ${req.method} ${req.originalUrl}`, 'ROUTING');
  apiLogger.error(req.method, req.originalUrl, new Error('Route non trouvée'), 404);
  
  res.status(404).json({
    status: 'error',
    message: 'Route non trouvée'
  });
});

// Gestion des erreurs globales
app.use((error, req, res, next) => {
  backendLogger.error('Erreur serveur globale', error, 'SERVER');
  apiLogger.error(req.method, req.originalUrl, error, 500);
  
  res.status(500).json({
    status: 'error',
    message: 'Erreur interne du serveur',
    error: process.env.NODE_ENV === 'development' ? error.message : 'Erreur interne'
  });
});

// Démarrage du serveur
const startServer = async () => {
  try {
    // Tentative de connexion MongoDB
    const mongoConnected = await connectToMongoDB();
    
    if (mongoConnected) {
      backendLogger.info('Mode: MongoDB connecté', 'SERVER');
    } else {
      backendLogger.warn('Mode: Données mock (MongoDB non disponible)', 'SERVER');
    }
    
    app.listen(PORT, () => {
      backendLogger.info(`Serveur démarré sur le port ${PORT}`, 'SERVER');
      console.log(`🚀 Serveur Oracle Audit démarré sur http://localhost:${PORT}`);
      console.log(`📊 Mode: ${mongoConnected ? 'MongoDB' : 'Mock Data'}`);
      console.log(`📝 Logs disponibles dans le dossier logs/`);
    });
    
  } catch (error) {
    backendLogger.error('Erreur lors du démarrage du serveur', error, 'SERVER');
    console.error('❌ Erreur lors du démarrage du serveur:', error);
    process.exit(1);
  }
};

// Nettoyage des logs toutes les 24h
setInterval(() => {
  const { cleanLogs } = require('./utils/logger');
  cleanLogs();
  backendLogger.info('Nettoyage automatique des logs effectué', 'MAINTENANCE');
}, 24 * 60 * 60 * 1000);

startServer();
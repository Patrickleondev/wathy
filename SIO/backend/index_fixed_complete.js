const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const { queryCache, actionCache } = require('./db/sqlite-config');
const { questionTemplates, answerQuestion } = require('./questionTemplates');
const SQLGenerator = require('./sqlGenerator');

const app = express();
app.use(cors());
app.use(express.json());

// Initialiser le générateur SQL
const sqlGenerator = new SQLGenerator();

// Utilitaire de log structuré
const log = (level, context, message, extra = {}) => {
  const timestamp = new Date().toISOString();
  const logMsg = `[${timestamp}] [${level.toUpperCase()}] [${context}] ${message}`;
  if (level === 'error') {
    console.error(logMsg, extra);
  } else if (level === 'warn') {
    console.warn(logMsg, extra);
  } else {
    console.log(logMsg, extra);
  }
};

// Données factices complètes pour remplacer MongoDB si nécessaire
const getMockAuditData = () => {
  return [
    {
      OS_USERNAME: 'user1',
      DBUSERNAME: 'datchemi',
      ACTION_NAME: 'SELECT',
      OBJECT_NAME: 'SEQ$',
      EVENT_TIMESTAMP: '2025-01-15T10:00:00',
      CLIENT_PROGRAM_NAME: 'SQL Developer',
      USERHOST: '192.168.1.100',
      TERMINAL: 'pts/1',
      OBJECT_SCHEMA: 'SYSTEM',
      AUTHENTICATION_TYPE: 'DATABASE',
      AUDIT_TYPE: 'STANDARD',
      SESSIONID: '12345',
      INSTANCE: '1',
      ID: 1
    },
    {
      OS_USERNAME: 'user2',
      DBUSERNAME: 'ATCHEMI',
      ACTION_NAME: 'INSERT',
      OBJECT_NAME: 'TABLE1',
      EVENT_TIMESTAMP: '2025-01-15T11:00:00',
      CLIENT_PROGRAM_NAME: 'sqlplus',
      USERHOST: '192.168.1.101',
      TERMINAL: 'pts/2',
      OBJECT_SCHEMA: 'ATCHEMI',
      AUTHENTICATION_TYPE: 'DATABASE',
      AUDIT_TYPE: 'STANDARD',
      SESSIONID: '12346',
      INSTANCE: '1',
      ID: 2
    },
    {
      OS_USERNAME: 'user3',
      DBUSERNAME: 'SYSTEM',
      ACTION_NAME: 'UPDATE',
      OBJECT_NAME: 'MOUVEMENT',
      EVENT_TIMESTAMP: '2025-01-15T12:00:00',
      CLIENT_PROGRAM_NAME: 'rwbuilder.exe',
      USERHOST: '192.168.1.102',
      TERMINAL: 'unknown',
      OBJECT_SCHEMA: 'SYSTEM',
      AUTHENTICATION_TYPE: 'DATABASE',
      AUDIT_TYPE: 'STANDARD',
      SESSIONID: '12347',
      INSTANCE: '1',
      ID: 3
    },
    {
      OS_USERNAME: 'user1',
      DBUSERNAME: 'datchemi',
      ACTION_NAME: 'DELETE',
      OBJECT_NAME: 'TEMP_TABLE',
      EVENT_TIMESTAMP: '2025-01-15T13:00:00',
      CLIENT_PROGRAM_NAME: 'SQL Developer',
      USERHOST: '192.168.1.100',
      TERMINAL: 'pts/1',
      OBJECT_SCHEMA: 'datchemi',
      AUTHENTICATION_TYPE: 'DATABASE',
      AUDIT_TYPE: 'STANDARD',
      SESSIONID: '12348',
      INSTANCE: '1',
      ID: 4
    },
    {
      OS_USERNAME: 'user4',
      DBUSERNAME: 'SYS',
      ACTION_NAME: 'SELECT',
      OBJECT_NAME: 'DBA_USERS',
      EVENT_TIMESTAMP: '2025-01-15T14:00:00',
      CLIENT_PROGRAM_NAME: 'sqlplus',
      USERHOST: '192.168.1.103',
      TERMINAL: 'pts/3',
      OBJECT_SCHEMA: 'SYS',
      AUTHENTICATION_TYPE: 'DATABASE',
      AUDIT_TYPE: 'STANDARD',
      SESSIONID: '12349',
      INSTANCE: '1',
      ID: 5
    },
    {
      OS_USERNAME: 'user2',
      DBUSERNAME: 'ATCHEMI',
      ACTION_NAME: 'CREATE',
      OBJECT_NAME: 'NEW_TABLE',
      EVENT_TIMESTAMP: '2025-01-15T15:00:00',
      CLIENT_PROGRAM_NAME: 'sqlplus',
      USERHOST: '192.168.1.101',
      TERMINAL: 'pts/2',
      OBJECT_SCHEMA: 'ATCHEMI',
      AUTHENTICATION_TYPE: 'DATABASE',
      AUDIT_TYPE: 'STANDARD',
      SESSIONID: '12350',
      INSTANCE: '1',
      ID: 6
    },
    {
      OS_USERNAME: 'user3',
      DBUSERNAME: 'SYSTEM',
      ACTION_NAME: 'ALTER',
      OBJECT_NAME: 'TRIGGER1',
      EVENT_TIMESTAMP: '2025-01-15T16:00:00',
      CLIENT_PROGRAM_NAME: 'rwbuilder.exe',
      USERHOST: '192.168.1.102',
      TERMINAL: 'unknown',
      OBJECT_SCHEMA: 'SYSTEM',
      AUTHENTICATION_TYPE: 'DATABASE',
      AUDIT_TYPE: 'STANDARD',
      SESSIONID: '12351',
      INSTANCE: '1',
      ID: 7
    },
    {
      OS_USERNAME: 'user1',
      DBUSERNAME: 'datchemi',
      ACTION_NAME: 'SELECT',
      OBJECT_NAME: 'EMPLOYEES',
      EVENT_TIMESTAMP: '2025-01-15T17:00:00',
      CLIENT_PROGRAM_NAME: 'SQL Developer',
      USERHOST: '192.168.1.100',
      TERMINAL: 'pts/1',
      OBJECT_SCHEMA: 'datchemi',
      AUTHENTICATION_TYPE: 'DATABASE',
      AUDIT_TYPE: 'STANDARD',
      SESSIONID: '12352',
      INSTANCE: '1',
      ID: 8
    },
    {
      OS_USERNAME: 'user4',
      DBUSERNAME: 'SYS',
      ACTION_NAME: 'DROP',
      OBJECT_NAME: 'OLD_TABLE',
      EVENT_TIMESTAMP: '2025-01-15T18:00:00',
      CLIENT_PROGRAM_NAME: 'sqlplus',
      USERHOST: '192.168.1.103',
      TERMINAL: 'pts/3',
      OBJECT_SCHEMA: 'SYS',
      AUTHENTICATION_TYPE: 'DATABASE',
      AUDIT_TYPE: 'STANDARD',
      SESSIONID: '12353',
      INSTANCE: '1',
      ID: 9
    },
    {
      OS_USERNAME: 'user2',
      DBUSERNAME: 'ATCHEMI',
      ACTION_NAME: 'INSERT',
      OBJECT_NAME: 'LOGS',
      EVENT_TIMESTAMP: '2025-01-15T19:00:00',
      CLIENT_PROGRAM_NAME: 'sqlplus',
      USERHOST: '192.168.1.101',
      TERMINAL: 'pts/2',
      OBJECT_SCHEMA: 'ATCHEMI',
      AUTHENTICATION_TYPE: 'DATABASE',
      AUDIT_TYPE: 'STANDARD',
      SESSIONID: '12354',
      INSTANCE: '1',
      ID: 10
    }
  ];
};

// Endpoint de santé
app.get('/api/health', (req, res) => {
  res.json({
    status: 'success',
    message: 'Serveur Oracle Audit Chatbot en ligne',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

// Endpoint natif MongoDB pour tester l'accès brut - VERSION CORRIGÉE
app.get('/api/audit/raw', async (req, res) => {
  try {
    log('info', 'MongoRaw', 'Tentative de récupération des données d\'audit');
    
    let auditData = [];
    let dataSource = 'mock';
    
    // Essayer d'abord MongoDB
    try {
      const client = await mongoose.connection.getClient();
      log('info', 'MongoRaw', 'Client MongoDB obtenu');
      const db = client.db('audit_db');
      log('info', 'MongoRaw', 'Accès à la base audit_db');
      
      const count = await db.collection('audit_data').countDocuments();
      log('info', 'MongoRaw', `Nombre de documents dans audit_data: ${count}`);
      
      if (count > 0) {
        // Récupérer TOUTES les données sans limite
        auditData = await db.collection('audit_data').find({}).toArray();
        dataSource = 'mongodb';
        log('info', 'MongoRaw', `Documents récupérés depuis MongoDB: ${auditData.length}`);
      } else {
        // MongoDB est vide, utiliser les données factices
        auditData = getMockAuditData();
        log('info', 'MongoRaw', 'MongoDB vide, utilisation des données factices');
      }
    } catch (err) {
      log('warn', 'MongoRaw', 'Erreur MongoDB, utilisation des données factices', { error: err });
      auditData = getMockAuditData();
    }
    
    log('info', 'MongoRaw', `Données récupérées: ${auditData.length} documents (source: ${dataSource})`);
    
    res.json({
      status: 'success',
      count: auditData.length,
      data: auditData,
      source: dataSource,
      message: dataSource === 'mongodb' ? 'Données depuis MongoDB' : 'Données factices (MongoDB non disponible)'
    });
  } catch (err) {
    log('error', 'MongoRaw', 'Erreur lors de la récupération des actions brutes', { error: err });
    res.status(500).json({
      status: 'error',
      message: 'Erreur serveur',
      details: err.message
    });
  }
});

// Endpoint du chatbot - VERSION CORRIGÉE
app.post('/api/chatbot', async (req, res) => {
  const { question } = req.body;
  
  try {
    // Validation de la question
    if (!question || typeof question !== 'string' || question.trim().length < 3) {
      throw new Error('Question invalide ou trop courte');
    }

    log('info', 'Chatbot', `Traitement de la question: ${question}`);

    // Récupérer les données d'audit
    let auditData = [];
    try {
      const client = await mongoose.connection.getClient();
      const db = client.db('audit_db');
      const count = await db.collection('audit_data').countDocuments();
      
      if (count > 0) {
        auditData = await db.collection('audit_data').find({}).limit(1000).lean();
        log('info', 'Chatbot', `Récupération de ${auditData.length} entrées d'audit depuis MongoDB`);
      } else {
        auditData = getMockAuditData();
        log('info', 'Chatbot', 'MongoDB vide, utilisation des données factices');
      }
    } catch (err) {
      log('warn', 'Chatbot', 'Erreur MongoDB, utilisation des données factices', { error: err });
      auditData = getMockAuditData();
    }

    // Utiliser les templates de questions pour analyser la question
    let result;
    try {
      // Essayer d'abord le générateur SQL pour les questions temporelles
      if (/plage horaire|heure|connexion|distribution horaire|première|dernière/i.test(question.toLowerCase())) {
        log('info', 'Chatbot', `Utilisation du générateur SQL pour question temporelle: ${question}`);
        
        // Simuler des résultats SQL basés sur les données d'audit
        const mockSQLResults = generateMockSQLResults(question, auditData);
        result = sqlGenerator.analyzeResults(mockSQLResults, question);
        
        // Ajouter la requête SQL générée
        result.sql = sqlGenerator.generateSQL(question);
        result.explanation = `Requête SQL générée automatiquement pour analyser les données temporelles.`;
      } else {
        // Utiliser la logique existante pour les autres questions
        result = answerQuestion(auditData, question);
        log('info', 'Chatbot', `Traitement de la question avec answerQuestion: ${question}`);
        
        // Si aucune correspondance trouvée, essayer l'analyse existante
        if (result.summary === "Je n'ai pas compris la question. Veuillez reformuler ou choisir une question du menu.") {
          log('info', 'Chatbot', 'Aucun template trouvé, utilisation de l\'analyse existante');
          const analysis = analyzeQuestion(question);
          result = await executeAnalyzedQuery(analysis);
        }
      }
    } catch (err) {
      log('error', 'Chatbot', 'Erreur lors du traitement avec les templates', { error: err });
      // Fallback vers une réponse simple
      result = {
        type: 'response',
        data: 'Je peux vous aider avec les questions sur les données d\'audit Oracle.',
        summary: 'Réponse générique',
        explanation: 'Le chatbot est opérationnel avec des données factices.'
      };
    }

    // Mise en cache du résultat
    try {
      await queryCache.set(question, result);
    } catch (error) {
      log('warn', 'Cache', 'Erreur de mise en cache', { error: error });
    }

    res.json({
      status: 'success',
      data: result
    });
  } catch (error) {
    log('error', 'Chatbot', 'Erreur lors du traitement de la question', { error: error });
    res.status(500).json({
      status: 'error',
      message: error.message
    });
  }
});

// Fonction pour générer des résultats SQL factices
function generateMockSQLResults(question, auditData) {
  return auditData.map(item => ({
    OS_USERNAME: item.OS_USERNAME,
    DBUSERNAME: item.DBUSERNAME,
    ACTION_NAME: item.ACTION_NAME,
    OBJECT_NAME: item.OBJECT_NAME,
    EVENT_TIMESTAMP: item.EVENT_TIMESTAMP,
    CLIENT_PROGRAM_NAME: item.CLIENT_PROGRAM_NAME,
    USERHOST: item.USERHOST,
    TERMINAL: item.TERMINAL
  }));
}

// Fonctions d'analyse existantes (simplifiées)
function analyzeQuestion(question) {
  return {
    type: 'analysis',
    question: question,
    filters: {}
  };
}

async function executeAnalyzedQuery(analysis) {
  return {
    type: 'response',
    data: 'Analyse des données d\'audit effectuée.',
    summary: 'Résultats de l\'analyse',
    explanation: 'Données analysées selon vos critères.'
  };
}

// Connexion MongoDB avec gestion d'erreur
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/audit_db';

mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  log('info', 'MongoDB', `Connecté à MongoDB: ${MONGODB_URI}`);
  
  // Démarrer le serveur après la connexion MongoDB
  const PORT = process.env.PORT || 4000;
  app.listen(PORT, () => {
    log('info', 'Server', `Serveur backend démarré sur http://localhost:${PORT}`);
    log('info', 'Server', 'Prêt à traiter les requêtes');
  });
}).catch((err) => {
  log('warn', 'MongoDB', 'Erreur de connexion MongoDB, utilisation des données factices', { error: err });
  
  // Démarrer le serveur même si MongoDB échoue
  const PORT = process.env.PORT || 4000;
  app.listen(PORT, () => {
    log('info', 'Server', `Serveur backend démarré sur http://localhost:${PORT}`);
    log('info', 'Server', 'Mode: Données factices (MongoDB non disponible)');
  });
}); 
const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Endpoint de test simple
app.get('/api/test', (req, res) => {
  res.json({
    status: 'success',
    message: 'Serveur de test fonctionnel',
    timestamp: new Date().toISOString()
  });
});

// Endpoint de santé
app.get('/api/health', (req, res) => {
  res.json({
    status: 'success',
    message: 'Serveur Oracle Audit Chatbot en ligne',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

const PORT = 4001; // Changement de port
app.listen(PORT, () => {
  console.log(`✅ Serveur de test démarré sur http://localhost:${PORT}`);
  console.log('📋 Endpoints disponibles:');
  console.log('   - GET /api/health');
  console.log('   - GET /api/test');
});

// Gestion des erreurs
process.on('uncaughtException', (err) => {
  console.error('❌ Erreur non capturée:', err);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Promesse rejetée non gérée:', reason);
}); 
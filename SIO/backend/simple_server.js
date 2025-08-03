const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Endpoint de santé
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'success', 
    message: 'Serveur simple OK',
    timestamp: new Date().toISOString()
  });
});

// Endpoint SQL de test
app.post('/api/sql/execute', (req, res) => {
  const { query } = req.body;
  
  console.log('📝 Requête reçue:', query);
  
  // Simuler des résultats
  const mockResults = [
    { DBUSERNAME: 'datchemi', ACTION_NAME: 'SELECT', nombre_actions: 15 },
    { DBUSERNAME: 'ATCHEMI', ACTION_NAME: 'SELECT', nombre_actions: 8 },
    { DBUSERNAME: 'SYSTEM', ACTION_NAME: 'UPDATE', nombre_actions: 3 },
    { DBUSERNAME: 'SYS', ACTION_NAME: 'SELECT', nombre_actions: 12 }
  ];
  
  res.json({
    status: 'success',
    data: mockResults,
    message: 'Requête exécutée avec succès (données de test)',
    query: query
  });
});

// Endpoint de test
app.get('/api/test', (req, res) => {
  res.json({
    status: 'success',
    message: 'Serveur de test fonctionnel',
    endpoints: ['/api/health', '/api/sql/execute', '/api/test']
  });
});

const PORT = 4000;
app.listen(PORT, () => {
  console.log(`✅ Serveur simple démarré sur http://localhost:${PORT}`);
  console.log('📋 Endpoints disponibles:');
  console.log('   - GET  /api/health');
  console.log('   - POST /api/sql/execute');
  console.log('   - GET  /api/test');
  console.log('');
  console.log('🧪 Pour tester:');
  console.log(`   curl http://localhost:${PORT}/api/health`);
  console.log(`   curl -X POST http://localhost:${PORT}/api/sql/execute -H "Content-Type: application/json" -d '{"query":"SELECT * FROM test"}'`);
});

// Gestion des erreurs
process.on('uncaughtException', (err) => {
  console.error('❌ Erreur non capturée:', err);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Promesse rejetée non gérée:', reason);
}); 
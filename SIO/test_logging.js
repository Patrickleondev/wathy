const { 
  backendLogger, 
  apiLogger, 
  chatbotLogger, 
  mongodbLogger 
} = require('./backend/utils/logger');

console.log('🧪 Test du système de logging\n');

// Test des logs backend
console.log('📝 Test des logs backend...');
backendLogger.info('Test de log info', 'TEST');
backendLogger.warn('Test de log warning', 'TEST');
backendLogger.error('Test de log error', new Error('Erreur de test'), 'TEST');
backendLogger.debug('Test de log debug', 'TEST');

// Test des logs API
console.log('\n🌐 Test des logs API...');
apiLogger.request('GET', '/api/test', '192.168.1.1', 'Mozilla/5.0');
apiLogger.response('GET', '/api/test', 200, 150);
apiLogger.error('POST', '/api/test', new Error('Erreur API'), 500);

// Test des logs chatbot
console.log('\n🤖 Test des logs chatbot...');
chatbotLogger.question('Quels utilisateurs ont utilisé SQL Developer ?', 'test_user');
chatbotLogger.response('Quels utilisateurs ont utilisé SQL Developer ?', 'Les utilisateurs sont: datchemi, ATCHEMI', 250);
chatbotLogger.error('Question invalide', new Error('Question non reconnue'));
chatbotLogger.fallback('Question inconnue', 'Je n\'ai pas compris la question');

// Test des logs MongoDB
console.log('\n🗄️ Test des logs MongoDB...');
mongodbLogger.connect('mongodb://localhost:27017/test');
mongodbLogger.connected('mongodb://localhost:27017/test');
mongodbLogger.query('actions_audit', 'find', { DBUSERNAME: 'datchemi' });
mongodbLogger.result('actions_audit', 'find', 5);
mongodbLogger.error(new Error('Connexion MongoDB échouée'), 'CONNECTION');

console.log('\n✅ Tests de logging terminés !');
console.log('📁 Vérifiez les fichiers dans le dossier logs/ :');
console.log('   - backend.log');
console.log('   - backend-errors.log');
console.log('   - api.log');
console.log('   - chatbot.log');
console.log('   - mongodb.log'); 
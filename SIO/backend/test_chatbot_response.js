const { answerQuestion } = require('./questionTemplates');

// Données de test
const mockData = [
  {
    _id: 'mock_1',
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
    _id: 'mock_2',
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
  }
];

// Test de la fonction answerQuestion
console.log('=== Test de la fonction answerQuestion ===');
console.log('Données d\'entrée:', mockData.length, 'entrées');

const questions = [
  'Quels sont les utilisateurs?',
  'Combien d\'actions y a-t-il?',
  'Quels sont les objets accédés?',
  'Quelles sont les actions effectuées?'
];

questions.forEach(question => {
  console.log(`\n--- Question: "${question}" ---`);
  try {
    const result = answerQuestion(mockData, question);
    console.log('Résultat:', JSON.stringify(result, null, 2));
  } catch (error) {
    console.error('Erreur:', error.message);
  }
});

console.log('\n=== Test terminé ==='); 
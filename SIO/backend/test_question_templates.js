const { answerQuestion } = require('./questionTemplates');

console.log('=== Test de questionTemplates.js ===');
console.log('Type de answerQuestion:', typeof answerQuestion);

const testData = [
  {
    DBUSERNAME: 'testuser',
    ACTION_NAME: 'SELECT',
    OBJECT_NAME: 'test_table'
  }
];

const result = answerQuestion(testData, 'Quels sont les utilisateurs?');
console.log('Résultat du test:', JSON.stringify(result, null, 2));
console.log('=== Test terminé ==='); 
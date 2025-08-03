const axios = require('axios');
const { answerQuestion } = require('./questionTemplates');

async function testChatbot() {
  const questions = [
    "Quels utilisateurs ont utilisé SQL Developer ?",
    "Quels utilisateurs ont utilisé des terminaux inconnus ?",
    "Y a-t-il un utilisateur qui accède fréquemment aux objets du schéma SYS ?",
    "Quels objets sont fréquemment accédés entre 11h et 12h ?",
    "Quelles actions ont été effectuées depuis le port 51105 ?",
    "Combien d'actions ont été réalisées depuis le terminal unknown ?",
    "Est-ce que l'adresse 192.168.60.42 a tenté d'accéder à des objets sensibles ?",
    "Peut-on détecter un comportement anormal dans les accès d'aujourd'hui ?",
    "Quelles actions sont les plus fréquentes pour chaque utilisateur ?"
  ];

  console.log('🧪 Test du chatbot amélioré\n');

  for (let i = 0; i < questions.length; i++) {
    const question = questions[i];
    console.log(`\n${i + 1}. Question: "${question}"`);
    
    try {
      const response = await axios.post('http://localhost:4000/api/chatbot', {
        question: question
      }, {
        headers: {
          'Content-Type': 'application/json'
        },
        timeout: 5000
      });

      if (response.data.status === 'success') {
        console.log('✅ Succès');
        console.log(`📝 Résumé: ${response.data.data.summary}`);
        if (response.data.data.explanation) {
          console.log(`💡 Explication: ${response.data.data.explanation}`);
        }
      } else {
        console.log('❌ Erreur:', response.data.message);
      }
    } catch (error) {
      console.log('❌ Erreur de connexion:', error.message);
    }
  }

  console.log('\n🏁 Test terminé');
}

// Test de santé du serveur
async function testHealth() {
  try {
    console.log('🏥 Test de santé du serveur...');
    const response = await axios.get('http://localhost:4000/api/health');
    console.log('✅ Serveur en ligne:', response.data.message);
    return true;
  } catch (error) {
    console.log('❌ Serveur hors ligne:', error.message);
    return false;
  }
}

// Exécution des tests
async function runTests() {
  console.log('🚀 Démarrage des tests du chatbot amélioré\n');
  
  const serverOk = await testHealth();
  if (serverOk) {
    await testChatbot();
  } else {
    console.log('❌ Impossible de tester le chatbot - serveur non disponible');
  }
}

console.log('Test de questionTemplates.js');
console.log('Type de answerQuestion:', typeof answerQuestion);

const testData = [
  {
    DBUSERNAME: 'testuser',
    ACTION_NAME: 'SELECT',
    OBJECT_NAME: 'test_table'
  }
];

const result = answerQuestion(testData, 'Quels sont les utilisateurs?');
console.log('Résultat du test:', result);

runTests().catch(console.error); 
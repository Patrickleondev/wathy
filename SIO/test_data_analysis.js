const axios = require('axios');

const baseURL = 'http://localhost:4000';

async function testDataAnalysis() {
  console.log('🧪 Test de l\'analyse complète des données\n');

  const testQuestions = [
    'Quels sont les utilisateurs les plus actifs ?',
    'Quelles sont les actions les plus fréquentes ?',
    'Quels objets sont les plus consultés ?',
    'Y a-t-il des activités suspectes ?',
    'Quelle est la distribution horaire des connexions ?',
    'Combien d\'utilisateurs distincts y a-t-il ?',
    'Quels programmes clients sont utilisés ?',
    'Quelle est l\'activité par schéma ?'
  ];

  for (const question of testQuestions) {
    try {
      console.log(`\n📝 Question: "${question}"`);
      
      const response = await axios.post(`${baseURL}/api/chatbot`, {
        question: question
      }, {
        headers: { 'Content-Type': 'application/json' },
        timeout: 10000
      });

      if (response.data.status === 'success') {
        const result = response.data.data;
        console.log(`✅ Réponse reçue (type: ${result.type})`);
        console.log(`📊 Résumé: ${result.summary}`);
        
        if (result.data && result.data.length > 0) {
          console.log(`📋 Données: ${result.data.length} éléments`);
          if (result.columns && result.columns.length > 0) {
            console.log(`📋 Colonnes: ${result.columns.join(', ')}`);
          }
        }
        
        if (result.explanation) {
          console.log(`💡 Explication: ${result.explanation}`);
        }
      } else {
        console.log(`❌ Erreur: ${response.data.message}`);
      }
      
    } catch (error) {
      console.log(`❌ Erreur pour "${question}": ${error.message}`);
      if (error.response) {
        console.log(`📋 Détails: ${JSON.stringify(error.response.data)}`);
      }
    }
  }

  // Test de l'endpoint de diagnostic MongoDB
  try {
    console.log('\n🔍 Test du diagnostic MongoDB...');
    const diagnosticResponse = await axios.get(`${baseURL}/api/mongodb/diagnostic`);
    
    if (diagnosticResponse.data.status === 'success') {
      const diagnostic = diagnosticResponse.data.data;
      console.log(`✅ MongoDB connecté: ${diagnostic.connection.connected}`);
      console.log(`📊 Base de données: ${diagnostic.database?.name}`);
      console.log(`📋 Collections: ${diagnostic.database?.collections?.map(c => c.name).join(', ')}`);
      console.log(`📊 Documents dans actions_audit: ${diagnostic.auditData.count}`);
      
      if (diagnostic.auditData.sample) {
        console.log(`📋 Exemple de document:`, diagnostic.auditData.sample);
      }
    } else {
      console.log(`❌ Erreur diagnostic: ${diagnosticResponse.data.message}`);
    }
  } catch (error) {
    console.log(`❌ Erreur diagnostic: ${error.message}`);
  }

  // Test de l'endpoint des données brutes
  try {
    console.log('\n📊 Test des données brutes...');
    const rawResponse = await axios.get(`${baseURL}/api/audit/raw`);
    
    if (rawResponse.data.status === 'success') {
      console.log(`✅ Données récupérées: ${rawResponse.data.data.length} documents`);
      console.log(`📋 Source: ${rawResponse.data.source}`);
      
      if (rawResponse.data.data.length > 0) {
        const sample = rawResponse.data.data[0];
        console.log(`📋 Exemple de document:`, {
          OS_USERNAME: sample.OS_USERNAME,
          DBUSERNAME: sample.DBUSERNAME,
          ACTION_NAME: sample.ACTION_NAME,
          OBJECT_NAME: sample.OBJECT_NAME,
          EVENT_TIMESTAMP: sample.EVENT_TIMESTAMP
        });
      }
    } else {
      console.log(`❌ Erreur données brutes: ${rawResponse.data.message}`);
    }
  } catch (error) {
    console.log(`❌ Erreur données brutes: ${error.message}`);
  }

  console.log('\n🏁 Test de l\'analyse des données terminé');
}

// Test des statistiques
async function testStats() {
  console.log('\n📈 Test des statistiques...');
  
  try {
    const statsResponse = await axios.get(`${baseURL}/api/stats`);
    
    if (statsResponse.data.status === 'success') {
      const stats = statsResponse.data.data;
      console.log('✅ Statistiques récupérées:');
      console.log(`📊 Utilisateurs uniques: ${stats.uniqueUsers}`);
      console.log(`📊 Actions totales: ${stats.totalActions}`);
      console.log(`📊 Objets uniques: ${stats.uniqueObjects}`);
      console.log(`📊 Période: ${stats.timeRange}`);
      
      if (stats.topUsers && stats.topUsers.length > 0) {
        console.log('👥 Top utilisateurs:');
        stats.topUsers.forEach((user, index) => {
          console.log(`  ${index + 1}. ${user.user} (${user.count} actions)`);
        });
      }
      
      if (stats.topActions && stats.topActions.length > 0) {
        console.log('⚡ Top actions:');
        stats.topActions.forEach((action, index) => {
          console.log(`  ${index + 1}. ${action.action} (${action.count} fois)`);
        });
      }
    } else {
      console.log(`❌ Erreur statistiques: ${statsResponse.data.message}`);
    }
  } catch (error) {
    console.log(`❌ Erreur statistiques: ${error.message}`);
  }
}

async function runTests() {
  await testDataAnalysis();
  await testStats();
}

runTests().catch(console.error); 
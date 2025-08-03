const axios = require('axios');

// Test de l'éditeur SQL
async function testSQLEditor() {
  const baseURL = 'http://localhost:4000';
  
  console.log('🧪 Test de l\'éditeur SQL Oracle\n');

  // Test 1: Endpoint de santé
  try {
    console.log('1. Test de santé du serveur...');
    const healthResponse = await axios.get(`${baseURL}/api/health`);
    console.log('✅ Serveur en ligne:', healthResponse.data.message);
  } catch (error) {
    console.log('❌ Serveur hors ligne:', error.message);
    return;
  }

  // Test 2: Requête SQL simple
  try {
    console.log('\n2. Test de requête SQL simple...');
    const sqlResponse = await axios.post(`${baseURL}/api/sql/execute`, {
      query: 'SELECT DBUSERNAME, COUNT(*) as nombre_actions FROM actions_audit GROUP BY DBUSERNAME',
      database: 'oracle'
    }, {
      headers: { 'Content-Type': 'application/json' },
      timeout: 10000
    });

    if (sqlResponse.data.status === 'success') {
      console.log('✅ Requête SQL exécutée avec succès');
      console.log(`📊 Résultats: ${sqlResponse.data.data.length} lignes`);
      console.log('📋 Données:', sqlResponse.data.data.slice(0, 3));
    } else {
      console.log('❌ Erreur SQL:', sqlResponse.data.message);
    }
  } catch (error) {
    console.log('❌ Erreur lors de l\'exécution SQL:', error.message);
    if (error.response) {
      console.log('📋 Détails:', error.response.data);
    }
  }

  // Test 3: Requête avec filtres
  try {
    console.log('\n3. Test de requête avec filtres...');
    const filteredResponse = await axios.post(`${baseURL}/api/sql/execute`, {
      query: 'SELECT ACTION_NAME, COUNT(*) as nombre_actions FROM actions_audit WHERE EVENT_TIMESTAMP >= SYSDATE - 1 GROUP BY ACTION_NAME',
      database: 'oracle'
    }, {
      headers: { 'Content-Type': 'application/json' },
      timeout: 10000
    });

    if (filteredResponse.data.status === 'success') {
      console.log('✅ Requête filtrée exécutée avec succès');
      console.log(`📊 Résultats: ${filteredResponse.data.data.length} lignes`);
    } else {
      console.log('❌ Erreur requête filtrée:', filteredResponse.data.message);
    }
  } catch (error) {
    console.log('❌ Erreur requête filtrée:', error.message);
  }

  // Test 4: Requête non autorisée (pour tester la sécurité)
  try {
    console.log('\n4. Test de sécurité (requête non autorisée)...');
    const dangerousResponse = await axios.post(`${baseURL}/api/sql/execute`, {
      query: 'DELETE FROM actions_audit',
      database: 'oracle'
    }, {
      headers: { 'Content-Type': 'application/json' },
      timeout: 10000
    });
  } catch (error) {
    if (error.response && error.response.status === 400) {
      console.log('✅ Sécurité: Requête dangereuse correctement bloquée');
      console.log('📋 Message:', error.response.data.message);
    } else {
      console.log('❌ Erreur de sécurité:', error.message);
    }
  }

  // Test 5: Requête complexe
  try {
    console.log('\n5. Test de requête complexe...');
    const complexResponse = await axios.post(`${baseURL}/api/sql/execute`, {
      query: `SELECT 
        DBUSERNAME,
        ACTION_NAME,
        OBJECT_NAME,
        EVENT_TIMESTAMP
      FROM actions_audit
      WHERE EVENT_TIMESTAMP >= SYSDATE - 1
      ORDER BY EVENT_TIMESTAMP DESC
      LIMIT 10`,
      database: 'oracle'
    }, {
      headers: { 'Content-Type': 'application/json' },
      timeout: 10000
    });

    if (complexResponse.data.status === 'success') {
      console.log('✅ Requête complexe exécutée avec succès');
      console.log(`📊 Résultats: ${complexResponse.data.data.length} lignes`);
    } else {
      console.log('❌ Erreur requête complexe:', complexResponse.data.message);
    }
  } catch (error) {
    console.log('❌ Erreur requête complexe:', error.message);
  }

  console.log('\n🏁 Test de l\'éditeur SQL terminé');
}

// Test du frontend
async function testFrontend() {
  console.log('\n🌐 Test du frontend...');
  
  try {
    const response = await axios.get('http://localhost:5173', {
      timeout: 5000
    });
    console.log('✅ Frontend accessible sur http://localhost:5173');
  } catch (error) {
    console.log('❌ Frontend non accessible:', error.message);
    console.log('💡 Assurez-vous que le frontend est démarré avec: npm run dev');
  }
}

// Exécution des tests
async function runTests() {
  console.log('🚀 Démarrage des tests de l\'éditeur SQL\n');
  
  await testSQLEditor();
  await testFrontend();
}

// Exécuter si le script est appelé directement
if (require.main === module) {
  runTests().catch(console.error);
}

module.exports = { testSQLEditor, testFrontend }; 
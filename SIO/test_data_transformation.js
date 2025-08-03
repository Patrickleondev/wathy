const axios = require('axios');

const baseURL = 'http://localhost:4000';

async function testDataTransformation() {
  console.log('🔍 Test de la transformation des données MongoDB');
  
  try {
    // 1. Récupérer les données brutes
    console.log('\n1. Récupération des données brutes...');
    const rawResponse = await axios.get(`${baseURL}/api/audit/raw`);
    console.log('✅ Données brutes récupérées');
    console.log(`📊 Source: ${rawResponse.data.source}`);
    console.log(`📊 Nombre de documents: ${rawResponse.data.data.length}`);
    
    if (rawResponse.data.data.length > 0) {
      console.log('\n📋 Premier document brut:');
      console.log(JSON.stringify(rawResponse.data.data[0], null, 2));
    }
    
    // 2. Tester une question simple
    console.log('\n2. Test d\'une question simple...');
    const questionResponse = await axios.post(`${baseURL}/api/chatbot`, {
      question: "Combien d'utilisateurs y a-t-il ?"
    });
    
    console.log('✅ Réponse reçue');
    console.log(`📊 Source: ${questionResponse.data.dataSource}`);
    console.log(`📊 Résumé: ${questionResponse.data.data.summary}`);
    console.log(`📊 Explication: ${questionResponse.data.data.explanation}`);
    
    // 3. Tester les statistiques
    console.log('\n3. Test des statistiques...');
    const statsResponse = await axios.get(`${baseURL}/api/stats`);
    console.log('✅ Statistiques récupérées');
    console.log(`📊 Utilisateurs uniques: ${statsResponse.data.data.uniqueUsers}`);
    console.log(`📊 Actions totales: ${statsResponse.data.data.totalActions}`);
    console.log(`📊 Objets uniques: ${statsResponse.data.data.uniqueObjects}`);
    
    // 4. Analyser la structure des données
    console.log('\n4. Analyse de la structure...');
    if (rawResponse.data.data.length > 0) {
      const firstDoc = rawResponse.data.data[0];
      console.log('📋 Champs disponibles:');
      Object.keys(firstDoc).forEach(key => {
        console.log(`  - ${key}: ${typeof firstDoc[key]} = "${firstDoc[key]}"`);
      });
      
      // Vérifier les champs utilisateur
      const userFields = ['OS_USERNAME', 'os_username', 'DBUSERNAME', 'dbusername'];
      console.log('\n🔍 Recherche des champs utilisateur:');
      userFields.forEach(field => {
        if (firstDoc.hasOwnProperty(field)) {
          console.log(`  ✅ ${field}: "${firstDoc[field]}"`);
        } else {
          console.log(`  ❌ ${field}: non trouvé`);
        }
      });
      
      // Vérifier les champs action
      const actionFields = ['ACTION_NAME', 'action_name'];
      console.log('\n🔍 Recherche des champs action:');
      actionFields.forEach(field => {
        if (firstDoc.hasOwnProperty(field)) {
          console.log(`  ✅ ${field}: "${firstDoc[field]}"`);
        } else {
          console.log(`  ❌ ${field}: non trouvé`);
        }
      });
    }
    
  } catch (error) {
    console.error('❌ Erreur lors du test:', error.message);
    if (error.response) {
      console.error('📊 Réponse d\'erreur:', error.response.data);
    }
  }
}

// Lancer le test
testDataTransformation().then(() => {
  console.log('\n🏁 Test de transformation terminé');
}).catch(error => {
  console.error('❌ Erreur fatale:', error);
}); 
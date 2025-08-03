const axios = require('axios');

const baseURL = 'http://localhost:4000';

async function testSimple() {
  console.log('🔍 Test simple de récupération des données');
  
  try {
    // 1. Récupérer les données brutes
    console.log('\n1. Récupération des données brutes...');
    const rawResponse = await axios.get(`${baseURL}/api/audit/raw`);
    console.log(`✅ Source: ${rawResponse.data.source}`);
    console.log(`✅ Nombre de documents: ${rawResponse.data.data.length}`);
    
    if (rawResponse.data.data.length > 0) {
      const firstDoc = rawResponse.data.data[0];
      console.log('\n📋 Premier document:');
      console.log(JSON.stringify(firstDoc, null, 2));
      
      // Vérifier les champs utilisateur
      console.log('\n🔍 Vérification des champs utilisateur:');
      console.log(`dbusername: "${firstDoc.dbusername}"`);
      console.log(`os_username: "${firstDoc.os_username}"`);
      console.log(`action_name: "${firstDoc.action_name}"`);
      console.log(`object_name: "${firstDoc.object_name}"`);
      
      // Extraire tous les utilisateurs
      const users = [...new Set(rawResponse.data.data.map(doc => doc.dbusername).filter(Boolean))];
      console.log(`\n📊 Utilisateurs trouvés (${users.length}): ${users.join(', ')}`);
      
      // Extraire toutes les actions
      const actions = [...new Set(rawResponse.data.data.map(doc => doc.action_name).filter(Boolean))];
      console.log(`📊 Actions trouvées (${actions.length}): ${actions.join(', ')}`);
      
      // Extraire tous les objets
      const objects = [...new Set(rawResponse.data.data.map(doc => doc.object_name).filter(Boolean))];
      console.log(`📊 Objets trouvés (${objects.length}): ${objects.slice(0, 10).join(', ')}...`);
    }
    
  } catch (error) {
    console.error('❌ Erreur:', error.message);
    if (error.response) {
      console.error('📊 Réponse d\'erreur:', error.response.data);
    }
  }
}

testSimple().then(() => {
  console.log('\n🏁 Test terminé');
}).catch(error => {
  console.error('❌ Erreur fatale:', error);
}); 
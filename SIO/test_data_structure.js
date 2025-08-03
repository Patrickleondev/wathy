const axios = require('axios');

const baseURL = 'http://localhost:4000';

async function testDataStructure() {
  console.log('🔍 Analyse de la structure des données\n');

  try {
    // Récupérer les données brutes
    const response = await axios.get(`${baseURL}/api/audit/raw`);
    
    if (response.data.status === 'success' && response.data.data.length > 0) {
      const sampleData = response.data.data[0];
      console.log('📋 Structure du premier document:');
      console.log(JSON.stringify(sampleData, null, 2));
      
      console.log('\n📊 Analyse des champs disponibles:');
      const fields = Object.keys(sampleData);
      fields.forEach(field => {
        console.log(`  - ${field}: ${typeof sampleData[field]} = "${sampleData[field]}"`);
      });
      
      console.log('\n🔍 Recherche des champs utilisateurs:');
      const userFields = fields.filter(f => f.toLowerCase().includes('user'));
      console.log('Champs utilisateur:', userFields);
      
      console.log('\n🔍 Recherche des champs actions:');
      const actionFields = fields.filter(f => f.toLowerCase().includes('action'));
      console.log('Champs action:', actionFields);
      
      console.log('\n🔍 Recherche des champs objets:');
      const objectFields = fields.filter(f => f.toLowerCase().includes('object'));
      console.log('Champs objet:', objectFields);
      
      console.log('\n📈 Statistiques des données:');
      const data = response.data.data;
      console.log(`Nombre total de documents: ${data.length}`);
      
      // Analyser les utilisateurs uniques
      const uniqueUsers = [...new Set(data.map(d => d.dbusername || d.DBUSERNAME).filter(Boolean))];
      console.log(`Utilisateurs uniques: ${uniqueUsers.length} - ${uniqueUsers.join(', ')}`);
      
      // Analyser les actions uniques
      const uniqueActions = [...new Set(data.map(d => d.action_name || d.ACTION_NAME).filter(Boolean))];
      console.log(`Actions uniques: ${uniqueActions.length} - ${uniqueActions.join(', ')}`);
      
      // Analyser les objets uniques
      const uniqueObjects = [...new Set(data.map(d => d.object_name || d.OBJECT_NAME).filter(Boolean))];
      console.log(`Objets uniques: ${uniqueObjects.length} - ${uniqueObjects.slice(0, 10).join(', ')}`);
      
      // Analyser les programmes clients
      const uniquePrograms = [...new Set(data.map(d => d.client_program_name || d.CLIENT_PROGRAM_NAME).filter(Boolean))];
      console.log(`Programmes clients: ${uniquePrograms.length} - ${uniquePrograms.join(', ')}`);
      
    } else {
      console.log('❌ Aucune donnée récupérée');
    }
    
  } catch (error) {
    console.error('❌ Erreur:', error.message);
  }
}

testDataStructure().catch(console.error); 
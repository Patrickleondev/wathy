const axios = require('axios');
const DataAnalyzer = require('./backend/dataAnalyzer');

const baseURL = 'http://localhost:4000';

async function debugAnalyzer() {
  console.log('🔍 Debug de l\'analyseur de données');
  
  try {
    // 1. Récupérer les données MongoDB
    console.log('\n1. Récupération des données MongoDB...');
    const response = await axios.get(`${baseURL}/api/audit/raw`);
    const auditData = response.data.data;
    console.log(`✅ ${auditData.length} documents récupérés`);
    
    // 2. Afficher un exemple de document
    if (auditData.length > 0) {
      console.log('\n📋 Exemple de document MongoDB:');
      console.log(JSON.stringify(auditData[0], null, 2));
    }
    
    // 3. Tester l'analyseur directement
    console.log('\n2. Test de l\'analyseur...');
    const analyzer = new DataAnalyzer();
    
    const loadSuccess = analyzer.loadData(auditData);
    console.log(`✅ Chargement des données: ${loadSuccess ? 'SUCCÈS' : 'ÉCHEC'}`);
    
    if (loadSuccess) {
      // Analyser les utilisateurs
      console.log('\n3. Analyse des utilisateurs...');
      const users = analyzer.analyzeUsers();
      console.log(`📊 Utilisateurs OS: ${users.os_users.length} - ${users.os_users.join(', ')}`);
      console.log(`📊 Utilisateurs DB: ${users.db_users.length} - ${users.db_users.join(', ')}`);
      
      // Analyser les actions
      console.log('\n4. Analyse des actions...');
      const actions = analyzer.analyzeActions();
      console.log(`📊 Types d'actions: ${actions.types.length} - ${actions.types.join(', ')}`);
      
      // Analyser les objets
      console.log('\n5. Analyse des objets...');
      const objects = analyzer.analyzeObjects();
      console.log(`📊 Objets uniques: ${objects.names.length}`);
      console.log(`📊 Schémas: ${objects.schemas.length} - ${objects.schemas.join(', ')}`);
      
      // Analyse complète
      console.log('\n6. Analyse complète...');
      const analysis = analyzer.analyzeAll();
      console.log(`📊 Total d'analyses: ${Object.keys(analysis).length}`);
      
      // Statistiques détaillées
      console.log('\n7. Statistiques détaillées...');
      const stats = analyzer.generateDetailedStats();
      console.log(`📊 Utilisateurs uniques: ${stats.uniqueUsers}`);
      console.log(`📊 Actions totales: ${stats.totalActions}`);
      console.log(`📊 Objets uniques: ${stats.uniqueObjects}`);
      console.log(`📊 Période: ${stats.period}`);
      
    } else {
      console.log('❌ Échec du chargement des données');
    }
    
  } catch (error) {
    console.error('❌ Erreur lors du debug:', error.message);
    if (error.response) {
      console.error('📊 Réponse d\'erreur:', error.response.data);
    }
  }
}

// Lancer le debug
debugAnalyzer().then(() => {
  console.log('\n🏁 Debug terminé');
}).catch(error => {
  console.error('❌ Erreur fatale:', error);
}); 
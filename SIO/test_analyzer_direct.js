const axios = require('axios');
const DataAnalyzer = require('./backend/dataAnalyzer');

const baseURL = 'http://localhost:4000';

async function testAnalyzerDirect() {
  console.log('🧪 Test direct de l\'analyseur\n');

  try {
    // Récupérer les données brutes
    const response = await axios.get(`${baseURL}/api/audit/raw`);
    
    if (response.data.status === 'success' && response.data.data.length > 0) {
      const data = response.data.data;
      console.log(`📊 Données récupérées: ${data.length} documents`);
      
      // Créer l'analyseur
      const analyzer = new DataAnalyzer();
      
      // Charger les données
      const loadSuccess = analyzer.loadData(data);
      console.log(`✅ Chargement des données: ${loadSuccess ? 'Succès' : 'Échec'}`);
      
      if (loadSuccess) {
        // Analyser les utilisateurs
        console.log('\n👥 Analyse des utilisateurs:');
        const users = analyzer.analyzeUsers();
        console.log(`Utilisateurs OS: ${users.os_users.length} - ${users.os_users.join(', ')}`);
        console.log(`Utilisateurs DB: ${users.db_users.length} - ${users.db_users.join(', ')}`);
        
        // Analyser les actions
        console.log('\n⚡ Analyse des actions:');
        const actions = analyzer.analyzeActions();
        console.log(`Types d'actions: ${actions.types.length} - ${actions.types.join(', ')}`);
        
        // Analyser les objets
        console.log('\n📦 Analyse des objets:');
        const objects = analyzer.analyzeObjects();
        console.log(`Noms d'objets: ${objects.names.length} - ${objects.names.slice(0, 10).join(', ')}`);
        console.log(`Schémas: ${objects.schemas.length} - ${objects.schemas.join(', ')}`);
        
        // Analyse complète
        console.log('\n📈 Analyse complète:');
        const analysis = analyzer.analyzeAll();
        console.log('Résultats:', JSON.stringify(analysis, null, 2));
        
        // Patterns suspects
        console.log('\n🚨 Patterns suspects:');
        const patterns = analyzer.findSuspiciousPatterns();
        console.log('Patterns:', JSON.stringify(patterns, null, 2));
        
      } else {
        console.log('❌ Échec du chargement des données');
      }
      
    } else {
      console.log('❌ Aucune donnée récupérée');
    }
    
  } catch (error) {
    console.error('❌ Erreur:', error.message);
  }
}

testAnalyzerDirect().catch(console.error); 
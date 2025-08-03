const mongoose = require('mongoose');

// Configuration de connexion MongoDB
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/audit_db';

console.log('=== Test de connexion MongoDB ===');
console.log('URI de connexion:', MONGODB_URI);

async function testConnection() {
  try {
    console.log('\n1. Tentative de connexion...');
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000 // Timeout de 5 secondes
    });
    console.log('✅ Connexion MongoDB réussie');

    const db = mongoose.connection.db;
    console.log('✅ Base de données:', db.databaseName);

    console.log('\n2. Vérification des collections...');
    const collections = await db.listCollections().toArray();
    console.log('Collections disponibles:', collections.map(c => c.name));

    if (collections.some(c => c.name === 'actions_audit')) {
      console.log('✅ Collection actions_audit trouvée');
      
      const auditCollection = db.collection('actions_audit');
      const count = await auditCollection.countDocuments();
      console.log(`📊 Nombre de documents: ${count}`);
      
      if (count > 0) {
        console.log('\n3. Récupération d\'un échantillon...');
        const sample = await auditCollection.find({}).limit(3).toArray();
        console.log('Échantillon de données:');
        sample.forEach((doc, index) => {
          console.log(`\nDocument ${index + 1}:`);
          console.log(`  OS_USERNAME: ${doc.OS_USERNAME}`);
          console.log(`  DBUSERNAME: ${doc.DBUSERNAME}`);
          console.log(`  ACTION_NAME: ${doc.ACTION_NAME}`);
          console.log(`  OBJECT_NAME: ${doc.OBJECT_NAME}`);
          console.log(`  EVENT_TIMESTAMP: ${doc.EVENT_TIMESTAMP}`);
        });
      } else {
        console.log('⚠️  Collection vide');
      }
    } else {
      console.log('❌ Collection actions_audit non trouvée');
    }

    console.log('\n✅ Test de connexion réussi');

  } catch (error) {
    console.error('❌ Erreur de connexion:', error.message);
    
    if (error.message.includes('ECONNREFUSED')) {
      console.log('\n💡 MongoDB n\'est pas démarré. Options:');
      console.log('1. Installer MongoDB localement');
      console.log('2. Utiliser Docker: docker run -d -p 27017:27017 --name mongodb-audit mongo:latest');
      console.log('3. Utiliser le script PowerShell: .\\start_mongodb.ps1');
    }
  } finally {
    await mongoose.disconnect();
    console.log('\nConnexion fermée');
  }
}

testConnection(); 
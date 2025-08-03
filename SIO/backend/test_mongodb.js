const mongoose = require('mongoose');

// Configuration de connexion MongoDB
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/audit_db';

console.log('=== Diagnostic MongoDB ===');
console.log('URI de connexion:', MONGODB_URI);

async function testMongoConnection() {
  try {
    console.log('\n1. Tentative de connexion à MongoDB...');
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('✅ Connexion MongoDB réussie');

    console.log('\n2. Test de l\'accès à la base de données...');
    const client = await mongoose.connection.getClient();
    console.log('✅ Client MongoDB obtenu');

    const db = client.db('audit_db');
    console.log('✅ Accès à la base audit_db');

    console.log('\n3. Test de la collection actions_audit...');
    const collections = await db.listCollections().toArray();
    console.log('Collections disponibles:', collections.map(c => c.name));

    if (collections.some(c => c.name === 'actions_audit')) {
      console.log('✅ Collection actions_audit trouvée');
      
      const count = await db.collection('actions_audit').countDocuments();
      console.log(`✅ Nombre de documents dans actions_audit: ${count}`);
      
      if (count > 0) {
        const sample = await db.collection('actions_audit').find({}).limit(1).toArray();
        console.log('✅ Exemple de document:', JSON.stringify(sample[0], null, 2));
      } else {
        console.log('⚠️  Collection vide - insertion de données de test...');
        
        // Insérer des données de test
        const testData = [
          {
            OS_USERNAME: 'user1',
            DBUSERNAME: 'datchemi',
            ACTION_NAME: 'SELECT',
            OBJECT_NAME: 'SEQ$',
            EVENT_TIMESTAMP: '2025-01-15T10:00:00',
            CLIENT_PROGRAM_NAME: 'SQL Developer',
            USERHOST: '192.168.1.100',
            TERMINAL: 'pts/1'
          },
          {
            OS_USERNAME: 'user2',
            DBUSERNAME: 'ATCHEMI',
            ACTION_NAME: 'INSERT',
            OBJECT_NAME: 'TABLE1',
            EVENT_TIMESTAMP: '2025-01-15T11:00:00',
            CLIENT_PROGRAM_NAME: 'sqlplus',
            USERHOST: '192.168.1.101',
            TERMINAL: 'pts/2'
          },
          {
            OS_USERNAME: 'user3',
            DBUSERNAME: 'SYSTEM',
            ACTION_NAME: 'UPDATE',
            OBJECT_NAME: 'MOUVEMENT',
            EVENT_TIMESTAMP: '2025-01-15T12:00:00',
            CLIENT_PROGRAM_NAME: 'rwbuilder.exe',
            USERHOST: '192.168.1.102',
            TERMINAL: 'unknown'
          }
        ];
        
        await db.collection('actions_audit').insertMany(testData);
        console.log('✅ Données de test insérées');
        
        const newCount = await db.collection('actions_audit').countDocuments();
        console.log(`✅ Nouveau nombre de documents: ${newCount}`);
      }
    } else {
      console.log('❌ Collection actions_audit non trouvée');
      console.log('Création de la collection avec des données de test...');
      
      // Insérer des données de test
      const testData = [
        {
          OS_USERNAME: 'user1',
          DBUSERNAME: 'datchemi',
          ACTION_NAME: 'SELECT',
          OBJECT_NAME: 'SEQ$',
          EVENT_TIMESTAMP: '2025-01-15T10:00:00',
          CLIENT_PROGRAM_NAME: 'SQL Developer',
          USERHOST: '192.168.1.100',
          TERMINAL: 'pts/1'
        },
        {
          OS_USERNAME: 'user2',
          DBUSERNAME: 'ATCHEMI',
          ACTION_NAME: 'INSERT',
          OBJECT_NAME: 'TABLE1',
          EVENT_TIMESTAMP: '2025-01-15T11:00:00',
          CLIENT_PROGRAM_NAME: 'sqlplus',
          USERHOST: '192.168.1.101',
          TERMINAL: 'pts/2'
        }
      ];
      
      await db.collection('actions_audit').insertMany(testData);
      console.log('✅ Données de test insérées');
    }

  } catch (error) {
    console.error('❌ Erreur lors du test MongoDB:', error.message);
    console.error('Stack trace:', error.stack);
  } finally {
    await mongoose.disconnect();
    console.log('\nConnexion MongoDB fermée');
  }
}

testMongoConnection(); 
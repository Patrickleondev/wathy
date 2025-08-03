const oracledb = require('oracledb');

async function testConnection() {
  try {
    const connection = await oracledb.getConnection({
      user: 'test',
      password: 'test',
      connectString: 'fakehost:9999/FAKESERVICE'
    });

    console.log('Connexion réussie !');
    await connection.close();
  } catch (err) {
    console.error('Erreur de connexion :', err);
  }
}

testConnection(); 
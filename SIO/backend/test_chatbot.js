const axios = require('axios');

async function testChatbot() {
  try {
    console.log('Test du chatbot...');
    
    const response = await axios.post('http://localhost:4000/api/chatbot', {
      question: 'Quels sont les utilisateurs système ayant accédé à la base aujourd\'hui?'
    }, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    console.log('Réponse du chatbot:');
    console.log(JSON.stringify(response.data, null, 2));
    
  } catch (error) {
    console.error('Erreur:', error.response ? error.response.data : error.message);
  }
}

testChatbot(); 
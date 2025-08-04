#!/usr/bin/env python3
"""
Test simple pour vérifier le serveur LLM
"""

import requests
import time

def test_server():
    """Test simple du serveur"""
    print("🧪 Test simple du serveur LLM")
    print("=" * 50)
    
    # Test 1: Health check
    print("🔍 Test de santé du service...")
    try:
        response = requests.get("http://localhost:8001/", timeout=5)
        if response.status_code == 200:
            print("✅ Serveur accessible")
            print(f"📊 Réponse: {response.json()}")
        else:
            print(f"❌ Erreur HTTP: {response.status_code}")
    except requests.exceptions.ConnectionError:
        print("❌ Impossible de se connecter au serveur")
        print("💡 Assurez-vous que le serveur est démarré avec: python simple_api_server.py")
        return False
    except Exception as e:
        print(f"❌ Erreur: {e}")
        return False
    
    # Test 2: Sample questions
    print("\n📝 Test des questions d'exemple...")
    try:
        response = requests.get("http://localhost:8001/api/sample-questions", timeout=5)
        if response.status_code == 200:
            data = response.json()
            print("✅ Questions d'exemple récupérées")
            print(f"📋 {len(data.get('questions', []))} questions disponibles")
        else:
            print(f"❌ Erreur HTTP: {response.status_code}")
    except Exception as e:
        print(f"❌ Erreur: {e}")
    
    # Test 3: Model info
    print("\n🤖 Test des informations du modèle...")
    try:
        response = requests.get("http://localhost:8001/api/model-info", timeout=5)
        if response.status_code == 200:
            data = response.json()
            print("✅ Informations du modèle récupérées")
            print(f"📊 Modèle: {data.get('model_name', 'N/A')}")
        else:
            print(f"❌ Erreur HTTP: {response.status_code}")
    except Exception as e:
        print(f"❌ Erreur: {e}")
    
    print("\n🎉 Tests terminés!")
    return True

if __name__ == "__main__":
    test_server() 
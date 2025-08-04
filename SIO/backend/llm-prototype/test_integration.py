#!/usr/bin/env python3
"""
Test d'intégration complet du système LLM Oracle Audit
"""

import requests
import time
import json

def test_integration():
    """Test complet du système"""
    print("🧪 Test d'intégration du système LLM Oracle Audit")
    print("=" * 60)
    
    base_url = "http://localhost:8001"
    
    # Test 1: Health check
    print("\n🔍 Test 1: Vérification de santé du serveur...")
    try:
        response = requests.get(f"{base_url}/", timeout=5)
        if response.status_code == 200:
            data = response.json()
            print(f"✅ Serveur accessible - Status: {data.get('status')}")
            print(f"📊 Version: {data.get('version')}")
        else:
            print(f"❌ Erreur HTTP: {response.status_code}")
            return False
    except Exception as e:
        print(f"❌ Impossible de se connecter au serveur: {e}")
        return False
    
    # Test 2: Questions d'exemple
    print("\n📝 Test 2: Récupération des questions d'exemple...")
    try:
        response = requests.get(f"{base_url}/api/sample-questions", timeout=5)
        if response.status_code == 200:
            data = response.json()
            questions = data.get('questions', [])
            categories = data.get('categories', [])
            print(f"✅ {len(questions)} questions d'exemple récupérées")
            print(f"📋 {len(categories)} catégories disponibles")
            
            # Afficher quelques exemples
            print("\n📋 Exemples de questions:")
            for i, question in enumerate(questions[:5], 1):
                print(f"  {i}. {question}")
            
        else:
            print(f"❌ Erreur HTTP: {response.status_code}")
    except Exception as e:
        print(f"❌ Erreur: {e}")
    
    # Test 3: Informations du modèle
    print("\n🤖 Test 3: Informations du modèle...")
    try:
        response = requests.get(f"{base_url}/api/model-info", timeout=5)
        if response.status_code == 200:
            data = response.json()
            print(f"✅ Modèle: {data.get('model_name')}")
            print(f"📊 Fonctionnalités: {len(data.get('features', []))} disponibles")
        else:
            print(f"❌ Erreur HTTP: {response.status_code}")
    except Exception as e:
        print(f"❌ Erreur: {e}")
    
    # Test 4: Question LLM (simulation)
    print("\n💬 Test 4: Test de question LLM...")
    try:
        question_data = {
            "question": "Combien d'événements d'audit sont enregistrés dans ce fichier ?",
            "log_id": "test_log"
        }
        
        response = requests.post(
            f"{base_url}/api/ask-llm",
            json=question_data,
            timeout=10
        )
        
        if response.status_code == 200:
            data = response.json()
            print(f"✅ Réponse générée avec succès")
            print(f"📊 Confiance: {data.get('confidence', 0):.2f}")
            print(f"🔍 Type d'analyse: {data.get('analysis_type', 'N/A')}")
            print(f"💬 Réponse: {data.get('answer', '')[:100]}...")
        else:
            print(f"❌ Erreur HTTP: {response.status_code}")
    except Exception as e:
        print(f"❌ Erreur: {e}")
    
    # Test 5: Test de parsing (avec données d'exemple)
    print("\n📄 Test 5: Test de parsing de logs...")
    try:
        # Données d'exemple de log Oracle
        sample_log = """2024-01-15 10:30:15,USER1,DBUSER1,SELECT,TABLE1,SCHEMA1,SQLPLUS,192.168.1.100,SESS001,PROD
2024-01-15 10:31:20,USER2,DBUSER2,INSERT,TABLE2,SCHEMA2,TOAD,192.168.1.101,SESS002,PROD
2024-01-15 10:32:45,USER1,DBUSER1,UPDATE,TABLE3,SCHEMA1,SQLPLUS,192.168.1.100,SESS001,PROD"""
        
        response = requests.post(
            f"{base_url}/api/test-parse",
            data=sample_log,
            timeout=10
        )
        
        if response.status_code == 200:
            data = response.json()
            print(f"✅ Parsing réussi: {data.get('events_count', 0)} événements")
            print(f"📊 Événements d'exemple: {len(data.get('sample_events', []))}")
        else:
            print(f"❌ Erreur HTTP: {response.status_code}")
    except Exception as e:
        print(f"❌ Erreur: {e}")
    
    print("\n🎉 Tests d'intégration terminés!")
    print("\n📋 Instructions pour tester l'interface:")
    print("1. Ouvrez votre navigateur sur http://localhost:5173")
    print("2. Connectez-vous à l'application")
    print("3. Allez dans la section 'LLM Audit' (icône Brain)")
    print("4. Uploadez un fichier de log Oracle")
    print("5. Posez des questions d'audit!")
    
    return True

if __name__ == "__main__":
    test_integration() 
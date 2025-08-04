#!/usr/bin/env python3
"""
Script de test pour le système LLM d'audit Oracle
Démontre les fonctionnalités principales
"""

import requests
import json
import time
from pathlib import Path

# Configuration
API_BASE_URL = "http://localhost:8001"

def test_health_check():
    """Test de la santé du service"""
    print("🔍 Test de santé du service...")
    try:
        response = requests.get(f"{API_BASE_URL}/")
        if response.status_code == 200:
            data = response.json()
            print(f"✅ Service en ligne - Modèle: {data['model_loaded']}, Vector DB: {data['vector_db_ready']}")
            return True
        else:
            print(f"❌ Service indisponible: {response.status_code}")
            return False
    except Exception as e:
        print(f"❌ Erreur de connexion: {e}")
        return False

def create_sample_log():
    """Crée un fichier de log d'exemple"""
    sample_log_content = """2025-01-15 10:00:00,user1,datchemi,SELECT,SEQ$,SYSTEM,SQL Developer,192.168.1.100,pts/1,12345,1
2025-01-15 10:05:00,user2,ATCHEMI,INSERT,TABLE1,ATCHEMI,sqlplus,192.168.1.101,pts/2,12346,1
2025-01-15 10:10:00,user3,SYSTEM,UPDATE,MOUVEMENT,SYSTEM,rwbuilder.exe,192.168.1.102,unknown,12347,1
2025-01-15 10:15:00,user1,datchemi,DELETE,TEMP_TABLE,datchemi,SQL Developer,192.168.1.100,pts/1,12348,1
2025-01-15 10:20:00,user4,SYS,SELECT,DBA_USERS,SYS,Toad.exe,192.168.1.103,pts/3,12349,1
2025-01-15 10:25:00,user2,ATCHEMI,TRUNCATE,MOUVEMENT_UL,IMOBILE,JDBC Thin Client,192.168.1.101,pts/2,12350,1
2025-01-15 10:30:00,user3,SYSTEM,SET ROLE,ROLE1,SYSTEM,rwbuilder.exe,192.168.1.102,unknown,12351,1
2025-01-15 10:35:00,user1,datchemi,CREATE INDEX,IDX_TABLE1,datchemi,SQL Developer,192.168.1.100,pts/1,12352,1
2025-01-15 10:40:00,user4,SYS,SELECT,SYS.OBJ$,SYS,Toad.exe,192.168.1.103,pts/3,12353,1
2025-01-15 10:45:00,user2,ATCHEMI,UPDATE,COMPTE,SPT,sqlplus,192.168.1.101,pts/2,12354,1"""
    
    log_file = Path("sample_audit.log")
    log_file.write_text(sample_log_content)
    print(f"📝 Fichier de log d'exemple créé: {log_file}")
    return log_file

def test_log_upload(log_file_path):
    """Test de l'upload de logs"""
    print(f"📤 Test d'upload du fichier: {log_file_path}")
    
    try:
        with open(log_file_path, 'rb') as f:
            files = {'file': f}
            response = requests.post(f"{API_BASE_URL}/api/upload-logs", files=files)
        
        if response.status_code == 200:
            data = response.json()
            if data['success']:
                print(f"✅ Upload réussi: {data['events_count']} événements analysés")
                print(f"📊 Résumé: {data['summary']}")
                return data.get('log_id')
            else:
                print(f"❌ Erreur d'upload: {data.get('error', 'Erreur inconnue')}")
                return None
        else:
            print(f"❌ Erreur HTTP: {response.status_code}")
            return None
            
    except Exception as e:
        print(f"❌ Erreur lors de l'upload: {e}")
        return None

def test_llm_questions(log_id=None):
    """Test des questions LLM"""
    questions = [
        "Quels sont les utilisateurs les plus actifs ?",
        "Combien d'opérations SELECT ont été effectuées ?",
        "Y a-t-il des activités suspectes ?",
        "Quels programmes clients sont les plus utilisés ?",
        "Combien d'actions destructives ont été détectées ?"
    ]
    
    print("🤖 Test des questions LLM...")
    
    for i, question in enumerate(questions, 1):
        print(f"\n📝 Question {i}: {question}")
        
        try:
            response = requests.post(f"{API_BASE_URL}/api/ask-llm", json={
                "question": question,
                "log_id": log_id
            })
            
            if response.status_code == 200:
                data = response.json()
                if data['success']:
                    print(f"✅ Réponse: {data['answer'][:100]}...")
                    print(f"🎯 Confiance: {data['confidence']:.1%}")
                    print(f"🔍 Type d'analyse: {data['analysis_type']}")
                else:
                    print(f"❌ Erreur: {data.get('error', 'Erreur inconnue')}")
            else:
                print(f"❌ Erreur HTTP: {response.status_code}")
                
        except Exception as e:
            print(f"❌ Erreur de connexion: {e}")
        
        time.sleep(1)  # Pause entre les questions

def test_pattern_analysis():
    """Test de l'analyse de patterns"""
    print("\n🔍 Test de l'analyse de patterns...")
    
    # Créer un contenu de log pour l'analyse
    log_content = """2025-01-15 10:00:00,user1,datchemi,SELECT,SEQ$,SYSTEM,SQL Developer,192.168.1.100,pts/1,12345,1
2025-01-15 10:05:00,user2,ATCHEMI,INSERT,TABLE1,ATCHEMI,sqlplus,192.168.1.101,pts/2,12346,1
2025-01-15 10:10:00,user3,SYSTEM,UPDATE,MOUVEMENT,SYSTEM,rwbuilder.exe,192.168.1.102,unknown,12347,1"""
    
    try:
        response = requests.post(f"{API_BASE_URL}/api/analyze-patterns", json={
            "log_content": log_content
        })
        
        if response.status_code == 200:
            data = response.json()
            if data['success']:
                patterns = data['patterns']
                print(f"✅ Analyse terminée:")
                print(f"   - Total d'événements: {patterns.get('total_events', 0)}")
                print(f"   - Utilisateurs uniques: {patterns.get('unique_users', 0)}")
                print(f"   - Actions: {patterns.get('unique_actions', {})}")
                print(f"   - Activités suspectes: {patterns.get('suspicious_activities', [])}")
            else:
                print(f"❌ Erreur d'analyse: {data.get('error', 'Erreur inconnue')}")
        else:
            print(f"❌ Erreur HTTP: {response.status_code}")
            
    except Exception as e:
        print(f"❌ Erreur de connexion: {e}")

def test_sample_questions():
    """Test de récupération des questions d'exemple"""
    print("\n📋 Test de récupération des questions d'exemple...")
    
    try:
        response = requests.get(f"{API_BASE_URL}/api/sample-questions")
        
        if response.status_code == 200:
            data = response.json()
            if data['success']:
                print(f"✅ {len(data['questions'])} questions d'exemple disponibles:")
                for i, question in enumerate(data['questions'][:3], 1):
                    print(f"   {i}. {question}")
                print(f"📂 Catégories: {', '.join(data['categories'])}")
            else:
                print("❌ Erreur lors de la récupération des questions")
        else:
            print(f"❌ Erreur HTTP: {response.status_code}")
            
    except Exception as e:
        print(f"❌ Erreur de connexion: {e}")

def test_model_info():
    """Test d'informations sur le modèle"""
    print("\n🤖 Test d'informations sur le modèle...")
    
    try:
        response = requests.get(f"{API_BASE_URL}/api/model-info")
        
        if response.status_code == 200:
            data = response.json()
            if data['success']:
                print(f"✅ Modèle: {data['model_name']}")
                print(f"📊 Embedding: {data['embedding_model']}")
                print(f"🗄️ Vector DB: {data['vector_db']}")
                print(f"✨ Fonctionnalités: {', '.join(data['features'])}")
            else:
                print("❌ Erreur lors de la récupération des informations")
        else:
            print(f"❌ Erreur HTTP: {response.status_code}")
            
    except Exception as e:
        print(f"❌ Erreur de connexion: {e}")

def main():
    """Fonction principale de test"""
    print("🚀 Démarrage des tests du système LLM d'audit Oracle")
    print("=" * 60)
    
    # Test de santé
    if not test_health_check():
        print("❌ Le service n'est pas disponible. Assurez-vous qu'il est démarré.")
        return
    
    # Créer un fichier de log d'exemple
    log_file = create_sample_log()
    
    # Test d'upload
    log_id = test_log_upload(log_file)
    
    # Test des questions LLM
    test_llm_questions(log_id)
    
    # Test d'analyse de patterns
    test_pattern_analysis()
    
    # Test des questions d'exemple
    test_sample_questions()
    
    # Test d'informations sur le modèle
    test_model_info()
    
    print("\n" + "=" * 60)
    print("✅ Tests terminés!")
    print("\n📝 Pour tester l'interface web:")
    print("1. Démarrez le serveur LLM: python api_server.py")
    print("2. Démarrez l'application React")
    print("3. Accédez à l'interface de chat LLM")
    
    # Nettoyer le fichier temporaire
    try:
        log_file.unlink()
        print(f"🧹 Fichier temporaire supprimé: {log_file}")
    except:
        pass

if __name__ == "__main__":
    main() 
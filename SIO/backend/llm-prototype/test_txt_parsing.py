#!/usr/bin/env python3
"""
Test du parsing des fichiers TXT pour le système LLM
"""

import requests
import time

def test_txt_parsing():
    """Test du parsing de fichiers TXT"""
    print("🧪 Test du parsing de fichiers TXT")
    print("=" * 50)
    
    base_url = "http://localhost:8001"
    
    # Lire le fichier TXT de test
    try:
        with open('sample_oracle_audit_log.txt', 'r', encoding='utf-8') as f:
            log_content = f.read()
        
        print(f"📄 Fichier TXT lu: {len(log_content)} caractères")
        print(f"📊 Lignes: {len(log_content.split(chr(10)))}")
        
    except Exception as e:
        print(f"❌ Erreur lecture fichier: {e}")
        return False
    
    # Test 1: Upload du fichier TXT
    print("\n📤 Test 1: Upload du fichier TXT...")
    try:
        # Créer un fichier temporaire pour l'upload
        files = {'file': ('sample_oracle_audit_log.txt', log_content, 'text/plain')}
        
        response = requests.post(
            f"{base_url}/api/upload-logs",
            files=files,
            timeout=10
        )
        
        if response.status_code == 200:
            data = response.json()
            print(f"✅ Upload réussi!")
            print(f"📊 Événements parsés: {data.get('events_count', 0)}")
            print(f"📋 Message: {data.get('message', '')}")
            print(f"🆔 Log ID: {data.get('log_id', '')}")
        else:
            print(f"❌ Erreur HTTP: {response.status_code}")
            print(f"📋 Réponse: {response.text}")
            
    except Exception as e:
        print(f"❌ Erreur upload: {e}")
    
    # Test 2: Questions sur le fichier TXT
    print("\n💬 Test 2: Questions sur le fichier TXT...")
    questions = [
        "Combien d'événements d'audit sont enregistrés dans ce fichier ?",
        "Quels sont les utilisateurs les plus actifs ?",
        "Combien de requêtes TRUNCATE ont été exécutées ?",
        "Quels programmes clients sont les plus utilisés ?",
        "Combien d'actions concernent le schéma SPT ?"
    ]
    
    for i, question in enumerate(questions, 1):
        try:
            print(f"\n  {i}. Question: {question}")
            
            response = requests.post(
                f"{base_url}/api/ask-llm",
                json={"question": question, "log_id": "test_txt"},
                timeout=10
            )
            
            if response.status_code == 200:
                data = response.json()
                print(f"    ✅ Réponse: {data.get('answer', '')[:100]}...")
                print(f"    📊 Confiance: {data.get('confidence', 0):.2f}")
            else:
                print(f"    ❌ Erreur HTTP: {response.status_code}")
                
        except Exception as e:
            print(f"    ❌ Erreur: {e}")
    
    print("\n🎉 Test du parsing TXT terminé!")
    return True

if __name__ == "__main__":
    test_txt_parsing() 
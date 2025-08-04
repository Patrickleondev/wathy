"""
Service LLM pour l'analyse d'audit Oracle
Prototype pour démontrer l'intégration LLM
"""

import json
import re
from typing import List, Dict, Any, Optional
from dataclasses import dataclass
from loguru import logger
import pandas as pd
from transformers import pipeline, AutoTokenizer, AutoModelForCausalLM
from sentence_transformers import SentenceTransformer
import chromadb
from chromadb.config import Settings

@dataclass
class AuditEvent:
    """Représente un événement d'audit Oracle"""
    timestamp: str
    os_username: str
    db_username: str
    action_name: str
    object_name: str
    object_schema: str
    client_program: str
    userhost: str
    session_id: str
    instance: str
    raw_line: str

@dataclass
class LLMResponse:
    """Réponse du modèle LLM"""
    answer: str
    confidence: float
    sources: List[str]
    analysis_type: str

class OracleLogParser:
    """Parser pour les logs d'audit Oracle"""
    
    def __init__(self):
        self.audit_patterns = {
            'standard': r'(\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}).*?OS_USERNAME=([^,]+).*?DBUSERNAME=([^,]+).*?ACTION_NAME=([^,]+).*?OBJECT_NAME=([^,]+).*?OBJECT_SCHEMA=([^,]+).*?CLIENT_PROGRAM_NAME=([^,]+).*?USERHOST=([^,]+).*?SESSIONID=([^,]+).*?INSTANCE=([^,]+)',
            'simple': r'(\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}).*?([^,]+),([^,]+),([^,]+),([^,]+),([^,]+),([^,]+),([^,]+),([^,]+),([^,]+)'
        }
    
    def parse_log_content(self, content: str) -> List[AuditEvent]:
        """Parse le contenu d'un fichier de log Oracle"""
        events = []
        lines = content.split('\n')
        
        for line in lines:
            if not line.strip():
                continue
                
            event = self._parse_line(line)
            if event:
                events.append(event)
        
        logger.info(f"Parsed {len(events)} audit events from log")
        return events
    
    def _parse_line(self, line: str) -> Optional[AuditEvent]:
        """Parse une ligne de log individuelle"""
        try:
            # Pattern standard Oracle audit log
            match = re.search(self.audit_patterns['standard'], line)
            if match:
                return AuditEvent(
                    timestamp=match.group(1),
                    os_username=match.group(2),
                    db_username=match.group(3),
                    action_name=match.group(4),
                    object_name=match.group(5),
                    object_schema=match.group(6),
                    client_program=match.group(7),
                    userhost=match.group(8),
                    session_id=match.group(9),
                    instance=match.group(10),
                    raw_line=line
                )
            
            # Pattern simplifié pour les logs de test
            match = re.search(self.audit_patterns['simple'], line)
            if match:
                return AuditEvent(
                    timestamp=match.group(1),
                    os_username=match.group(2),
                    db_username=match.group(3),
                    action_name=match.group(4),
                    object_name=match.group(5),
                    object_schema=match.group(6),
                    client_program=match.group(7),
                    userhost=match.group(8),
                    session_id=match.group(9),
                    instance=match.group(10),
                    raw_line=line
                )
                
        except Exception as e:
            logger.warning(f"Failed to parse line: {line[:100]}... Error: {e}")
        
        return None

class AuditVectorizationService:
    """Service de vectorisation des logs d'audit"""
    
    def __init__(self):
        self.embedding_model = SentenceTransformer('sentence-transformers/all-MiniLM-L6-v2')
        self.chroma_client = chromadb.Client(Settings(
            chroma_db_impl="duckdb+parquet",
            persist_directory="./chroma_db"
        ))
        self.collection = self.chroma_client.get_or_create_collection("audit_logs")
    
    def vectorize_audit_events(self, events: List[AuditEvent]) -> List[str]:
        """Vectorise les événements d'audit et les stocke"""
        documents = []
        metadatas = []
        ids = []
        
        for i, event in enumerate(events):
            # Créer une représentation textuelle de l'événement
            doc_text = f"Timestamp: {event.timestamp}, User: {event.os_username}/{event.db_username}, Action: {event.action_name}, Object: {event.object_schema}.{event.object_name}, Program: {event.client_program}, Host: {event.userhost}"
            
            documents.append(doc_text)
            metadatas.append({
                "timestamp": event.timestamp,
                "os_username": event.os_username,
                "db_username": event.db_username,
                "action_name": event.action_name,
                "object_name": event.object_name,
                "object_schema": event.object_schema,
                "client_program": event.client_program,
                "userhost": event.userhost,
                "session_id": event.session_id,
                "instance": event.instance
            })
            ids.append(f"event_{i}")
        
        # Ajouter à la base vectorielle
        self.collection.add(
            documents=documents,
            metadatas=metadatas,
            ids=ids
        )
        
        logger.info(f"Vectorized and stored {len(events)} audit events")
        return ids
    
    def search_similar_events(self, query: str, top_k: int = 10) -> List[Dict]:
        """Recherche des événements similaires"""
        results = self.collection.query(
            query_texts=[query],
            n_results=top_k
        )
        
        return [
            {
                "document": doc,
                "metadata": meta,
                "distance": dist
            }
            for doc, meta, dist in zip(
                results['documents'][0],
                results['metadatas'][0],
                results['distances'][0]
            )
        ]

class AuditLLMService:
    """Service LLM pour l'analyse d'audit"""
    
    def __init__(self):
        # Utiliser un modèle plus léger pour le prototype
        self.model_name = "microsoft/DialoGPT-medium"  # Modèle de base
        self.tokenizer = AutoTokenizer.from_pretrained(self.model_name)
        self.model = AutoModelForCausalLM.from_pretrained(self.model_name)
        
        # Pipeline pour la génération de texte
        self.generator = pipeline(
            "text-generation",
            model=self.model,
            tokenizer=self.tokenizer,
            max_length=200,
            temperature=0.7
        )
        
        self.vectorization_service = AuditVectorizationService()
        self.log_parser = OracleLogParser()
        
        # Templates de prompts pour l'audit Oracle
        self.audit_prompts = {
            "user_analysis": "Analyse les utilisateurs dans ces logs d'audit Oracle: {context}. Question: {question}",
            "action_analysis": "Analyse les actions dans ces logs d'audit Oracle: {context}. Question: {question}",
            "security_analysis": "Analyse la sécurité dans ces logs d'audit Oracle: {context}. Question: {question}",
            "performance_analysis": "Analyse les performances dans ces logs d'audit Oracle: {context}. Question: {question}"
        }
    
    def process_log_upload(self, log_content: str) -> str:
        """Traite l'upload d'un fichier de log"""
        try:
            # Parser les logs
            events = self.log_parser.parse_log_content(log_content)
            
            if not events:
                return "Aucun événement d'audit trouvé dans le fichier"
            
            # Vectoriser les événements
            event_ids = self.vectorization_service.vectorize_audit_events(events)
            
            # Générer un résumé automatique
            summary = self._generate_summary(events)
            
            return f"Log traité avec succès! {len(events)} événements analysés. {summary}"
            
        except Exception as e:
            logger.error(f"Error processing log upload: {e}")
            return f"Erreur lors du traitement: {str(e)}"
    
    def answer_question(self, question: str, log_id: str = None) -> LLMResponse:
        """Répond à une question sur les logs d'audit"""
        try:
            # Déterminer le type d'analyse basé sur la question
            analysis_type = self._classify_question(question)
            
            # Rechercher des événements pertinents
            relevant_events = self.vectorization_service.search_similar_events(question, top_k=5)
            
            # Construire le contexte
            context = self._build_context(relevant_events)
            
            # Générer la réponse
            prompt = self.audit_prompts[analysis_type].format(
                context=context,
                question=question
            )
            
            response = self.generator(prompt)[0]['generated_text']
            
            # Extraire la réponse pertinente
            answer = self._extract_answer(response, prompt)
            
            return LLMResponse(
                answer=answer,
                confidence=0.85,  # Simulation pour le prototype
                sources=[event['metadata'] for event in relevant_events],
                analysis_type=analysis_type
            )
            
        except Exception as e:
            logger.error(f"Error generating answer: {e}")
            return LLMResponse(
                answer=f"Erreur lors de l'analyse: {str(e)}",
                confidence=0.0,
                sources=[],
                analysis_type="error"
            )
    
    def analyze_patterns(self, events: List[AuditEvent]) -> Dict[str, Any]:
        """Analyse les patterns dans les logs d'audit"""
        if not events:
            return {"error": "Aucun événement à analyser"}
        
        # Convertir en DataFrame pour l'analyse
        df = pd.DataFrame([vars(event) for event in events])
        
        patterns = {
            "total_events": len(events),
            "unique_users": df['os_username'].nunique(),
            "unique_actions": df['action_name'].value_counts().to_dict(),
            "top_programs": df['client_program'].value_counts().head(5).to_dict(),
            "top_objects": df['object_name'].value_counts().head(5).to_dict(),
            "time_range": {
                "start": df['timestamp'].min(),
                "end": df['timestamp'].max()
            },
            "suspicious_activities": self._detect_suspicious_activities(df)
        }
        
        return patterns
    
    def _classify_question(self, question: str) -> str:
        """Classifie le type de question"""
        question_lower = question.lower()
        
        if any(word in question_lower for word in ['utilisateur', 'user', 'qui', 'qui a']):
            return "user_analysis"
        elif any(word in question_lower for word in ['action', 'requête', 'select', 'insert', 'update', 'delete']):
            return "action_analysis"
        elif any(word in question_lower for word in ['sécurité', 'sécurisé', 'suspect', 'anomalie']):
            return "security_analysis"
        else:
            return "performance_analysis"
    
    def _build_context(self, relevant_events: List[Dict]) -> str:
        """Construit le contexte à partir des événements pertinents"""
        context_parts = []
        
        for event in relevant_events:
            metadata = event['metadata']
            context_parts.append(
                f"Event: {metadata['os_username']} ({metadata['db_username']}) "
                f"performed {metadata['action_name']} on {metadata['object_schema']}.{metadata['object_name']} "
                f"via {metadata['client_program']} from {metadata['userhost']}"
            )
        
        return " | ".join(context_parts)
    
    def _extract_answer(self, response: str, prompt: str) -> str:
        """Extrait la réponse pertinente du texte généré"""
        # Supprimer le prompt original
        if prompt in response:
            answer = response.replace(prompt, "").strip()
        else:
            answer = response.strip()
        
        # Limiter la longueur
        if len(answer) > 500:
            answer = answer[:500] + "..."
        
        return answer
    
    def _generate_summary(self, events: List[AuditEvent]) -> str:
        """Génère un résumé automatique des logs"""
        if not events:
            return "Aucun événement à résumer"
        
        df = pd.DataFrame([vars(event) for event in events])
        
        summary = f"Résumé: {len(events)} événements analysés. "
        summary += f"Utilisateurs uniques: {df['os_username'].nunique()}. "
        summary += f"Actions principales: {', '.join(df['action_name'].value_counts().head(3).index)}. "
        summary += f"Période: {df['timestamp'].min()} à {df['timestamp'].max()}"
        
        return summary
    
    def _detect_suspicious_activities(self, df: pd.DataFrame) -> List[str]:
        """Détecte les activités suspectes"""
        suspicious = []
        
        # Vérifier les accès système
        sys_access = df[df['object_schema'] == 'SYS']
        if len(sys_access) > 10:
            suspicious.append(f"Nombre élevé d'accès système ({len(sys_access)})")
        
        # Vérifier les actions de modification
        destructive_actions = df[df['action_name'].isin(['DELETE', 'TRUNCATE', 'DROP'])]
        if len(destructive_actions) > 5:
            suspicious.append(f"Actions destructives détectées ({len(destructive_actions)})")
        
        # Vérifier les connexions multiples
        user_sessions = df.groupby('os_username')['session_id'].nunique()
        if user_sessions.max() > 10:
            suspicious.append("Utilisateur avec trop de sessions simultanées")
        
        return suspicious

# Instance globale du service
audit_llm_service = AuditLLMService() 
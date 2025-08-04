"""
Serveur API FastAPI pour les services LLM d'audit Oracle
"""

from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Dict, Any, Optional
import uvicorn
from loguru import logger

from audit_llm_service import audit_llm_service, AuditEvent

# Configuration du logger
logger.add("llm_api.log", rotation="1 day", level="INFO")

app = FastAPI(
    title="Oracle Audit LLM API",
    description="API pour l'analyse intelligente des logs d'audit Oracle",
    version="1.0.0"
)

# Configuration CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # En production, spécifier les domaines autorisés
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Modèles Pydantic
class QuestionRequest(BaseModel):
    question: str
    log_id: Optional[str] = None

class QuestionResponse(BaseModel):
    success: bool
    answer: str
    confidence: float
    analysis_type: str
    sources: List[Dict[str, Any]]
    error: Optional[str] = None

class UploadResponse(BaseModel):
    success: bool
    message: str
    log_id: Optional[str] = None
    events_count: int = 0
    summary: Optional[str] = None
    error: Optional[str] = None

class PatternAnalysisResponse(BaseModel):
    success: bool
    patterns: Dict[str, Any]
    error: Optional[str] = None

class HealthResponse(BaseModel):
    status: str
    model_loaded: bool
    vector_db_ready: bool
    version: str

@app.get("/", response_model=HealthResponse)
async def health_check():
    """Vérification de l'état du service"""
    try:
        return HealthResponse(
            status="healthy",
            model_loaded=audit_llm_service.model is not None,
            vector_db_ready=audit_llm_service.vectorization_service.collection is not None,
            version="1.0.0"
        )
    except Exception as e:
        logger.error(f"Health check failed: {e}")
        return HealthResponse(
            status="unhealthy",
            model_loaded=False,
            vector_db_ready=False,
            version="1.0.0"
        )

@app.post("/api/upload-logs", response_model=UploadResponse)
async def upload_logs(file: UploadFile = File(...)):
    """
    Upload et traitement d'un fichier de logs Oracle
    """
    try:
        logger.info(f"Processing log upload: {file.filename}")
        
        # Lire le contenu du fichier
        content = await file.read()
        log_content = content.decode('utf-8')
        
        # Traiter les logs
        result = audit_llm_service.process_log_upload(log_content)
        
        # Parser pour extraire les informations
        events = audit_llm_service.log_parser.parse_log_content(log_content)
        
        return UploadResponse(
            success=True,
            message=result,
            log_id=f"log_{len(events)}_{hash(log_content) % 10000}",
            events_count=len(events),
            summary=audit_llm_service._generate_summary(events) if events else None
        )
        
    except Exception as e:
        logger.error(f"Error uploading logs: {e}")
        return UploadResponse(
            success=False,
            message="Erreur lors du traitement du fichier",
            error=str(e)
        )

@app.post("/api/ask-llm", response_model=QuestionResponse)
async def ask_llm(request: QuestionRequest):
    """
    Poser une question sur les logs d'audit
    """
    try:
        logger.info(f"Processing question: {request.question}")
        
        # Générer la réponse
        response = audit_llm_service.answer_question(
            question=request.question,
            log_id=request.log_id
        )
        
        return QuestionResponse(
            success=True,
            answer=response.answer,
            confidence=response.confidence,
            analysis_type=response.analysis_type,
            sources=response.sources
        )
        
    except Exception as e:
        logger.error(f"Error generating answer: {e}")
        return QuestionResponse(
            success=False,
            answer="",
            confidence=0.0,
            analysis_type="error",
            sources=[],
            error=str(e)
        )

@app.post("/api/analyze-patterns", response_model=PatternAnalysisResponse)
async def analyze_patterns(log_content: str):
    """
    Analyser les patterns dans les logs
    """
    try:
        logger.info("Analyzing patterns in logs")
        
        # Parser les logs
        events = audit_llm_service.log_parser.parse_log_content(log_content)
        
        # Analyser les patterns
        patterns = audit_llm_service.analyze_patterns(events)
        
        return PatternAnalysisResponse(
            success=True,
            patterns=patterns
        )
        
    except Exception as e:
        logger.error(f"Error analyzing patterns: {e}")
        return PatternAnalysisResponse(
            success=False,
            patterns={},
            error=str(e)
        )

@app.get("/api/sample-questions")
async def get_sample_questions():
    """
    Retourne des exemples de questions d'audit
    """
    sample_questions = [
        "Quels sont les utilisateurs les plus actifs ?",
        "Combien d'opérations SELECT ont été effectuées ?",
        "Y a-t-il des activités suspectes ?",
        "Quels programmes clients sont les plus utilisés ?",
        "Combien d'actions destructives (DELETE, TRUNCATE) ont été détectées ?",
        "Quels schémas sont les plus consultés ?",
        "À quelles heures l'activité est-elle la plus élevée ?",
        "Y a-t-il des accès au schéma SYS ?",
        "Quels utilisateurs ont effectué des modifications ?",
        "Combien de sessions uniques sont enregistrées ?"
    ]
    
    return {
        "success": True,
        "questions": sample_questions,
        "categories": [
            "Utilisateurs et Sessions",
            "Actions et Requêtes", 
            "Sécurité et Anomalies",
            "Performance et Statistiques",
            "Objets et Schémas"
        ]
    }

@app.get("/api/model-info")
async def get_model_info():
    """
    Informations sur le modèle LLM utilisé
    """
    return {
        "success": True,
        "model_name": audit_llm_service.model_name,
        "embedding_model": "sentence-transformers/all-MiniLM-L6-v2",
        "vector_db": "ChromaDB",
        "features": [
            "Analyse d'audit Oracle",
            "Vectorisation des logs",
            "Recherche sémantique",
            "Détection d'anomalies",
            "Génération de réponses contextuelles"
        ]
    }

# Endpoints de test pour le développement
@app.post("/api/test-parse")
async def test_parse_logs(log_content: str):
    """
    Test du parsing de logs (développement uniquement)
    """
    try:
        events = audit_llm_service.log_parser.parse_log_content(log_content)
        
        return {
            "success": True,
            "events_count": len(events),
            "sample_events": [
                {
                    "timestamp": event.timestamp,
                    "os_username": event.os_username,
                    "db_username": event.db_username,
                    "action_name": event.action_name,
                    "object_name": event.object_name,
                    "object_schema": event.object_schema
                }
                for event in events[:5]  # Premiers 5 événements
            ]
        }
        
    except Exception as e:
        return {
            "success": False,
            "error": str(e)
        }

if __name__ == "__main__":
    logger.info("Starting Oracle Audit LLM API Server")
    uvicorn.run(
        "api_server:app",
        host="0.0.0.0",
        port=8001,
        reload=True,
        log_level="info"
    ) 
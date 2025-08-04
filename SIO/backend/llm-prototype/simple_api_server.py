"""
Serveur API FastAPI simplifié pour les services LLM d'audit Oracle
Version sans les modèles lourds pour tests rapides
"""

from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Dict, Any, Optional
import uvicorn
import time
import logging
import os

from intelligent_llm_service import intelligent_audit_llm_service, AuditEvent

# Configuration du logging
log_path = os.path.join(os.path.dirname(__file__), '..', '..', 'logs', 'llm_debug.log')
logging.basicConfig(
    level=logging.DEBUG,
    format='%(asctime)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler(log_path),
        logging.StreamHandler()
    ]
)
logger = logging.getLogger(__name__)

app = FastAPI(
    title="Oracle Audit LLM API (Simple)",
    description="API simplifiée pour l'analyse intelligente des logs d'audit Oracle",
    version="1.0.0"
)

# Configuration CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Modèles Pydantic
class QuestionRequest(BaseModel):
    question: str
    log_id: Optional[str] = None
    logs: Optional[List[Dict[str, str]]] = None

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
    version: str

@app.get("/", response_model=HealthResponse)
async def health_check():
    """Vérification de l'état du service"""
    try:
        return HealthResponse(
            status="healthy",
            model_loaded=True,
            version="1.0.0-simple"
        )
    except Exception as e:
        return HealthResponse(
            status="unhealthy",
            model_loaded=False,
            version="1.0.0-simple"
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
        result = intelligent_audit_llm_service.process_log_upload(log_content, file.filename)
        
        # Parser pour extraire les informations
        events = intelligent_audit_llm_service.log_parser.parse_log_content(log_content)
        
        return UploadResponse(
            success=True,
            message=result,
            log_id=f"log_{len(events)}_{hash(log_content) % 10000}",
            events_count=len(events),
            summary=intelligent_audit_llm_service._generate_intelligent_summary(events, intelligent_audit_llm_service._analyze_logs_intelligently(events)) if events else None
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
        
        # Simuler un délai de traitement
        time.sleep(1)
        
        # Traiter les logs si fournis
        if request.logs:
            logger.info(f"Processing {len(request.logs)} logs from request")
            for i, log_data in enumerate(request.logs):
                logger.info(f"Processing log {i+1}: {log_data.get('name', 'Unknown')}")
                intelligent_audit_llm_service.process_log_upload(log_data['content'], log_data['name'])
        else:
            logger.warning("No logs provided in request")
        
        logger.info(f"Available logs in service: {list(intelligent_audit_llm_service.uploaded_logs.keys())}")
        
        # Générer la réponse
        response = intelligent_audit_llm_service.answer_question(
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
        events = intelligent_audit_llm_service.log_parser.parse_log_content(log_content)
        
        # Analyser les patterns
        patterns = intelligent_audit_llm_service._analyze_logs_intelligently(events)
        
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
    Retourne des exemples de questions d'audit Oracle
    """
    sample_questions = intelligent_audit_llm_service.get_sample_questions()
    
    return {
        "success": True,
        "questions": sample_questions,
        "categories": [
            "Questions générales sur les données",
            "Utilisateurs et Sessions",
            "Actions spécifiques",
            "Schémas et Objets",
            "Horaires et Fréquence",
            "Connexions (LOGON)",
            "Adresses IP et Réseaux",
            "Rôles et Privilèges",
            "Schémas Applicatifs",
            "Actions de Maintenance",
            "Procédures et Fonctions",
            "Index",
            "Batchs et Automatisation",
            "Applications Spécifiques",
            "Schémas Système",
            "Schémas Temporaires",
            "Schémas Utilisateur",
            "Schémas de Production"
        ]
    }

@app.get("/api/model-info")
async def get_model_info():
    """
    Informations sur le modèle LLM utilisé
    """
    return {
        "success": True,
        "model_name": "Simple LLM Service",
        "embedding_model": "None (Simple Mode)",
        "vector_db": "None (Simple Mode)",
        "features": [
            "Analyse d'audit Oracle (Mode Simple)",
            "Parsing de logs",
            "Classification de questions",
            "Détection d'anomalies",
            "Génération de réponses simulées"
        ]
    }

@app.post("/api/test-parse")
async def test_parse_logs(log_content: str):
    """
    Test du parsing de logs (développement uniquement)
    """
    try:
        events = intelligent_audit_llm_service.log_parser.parse_log_content(log_content)
        
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

@app.post("/api/clear-logs")
async def clear_logs():
    """
    Vide tous les logs stockés dans le service
    """
    try:
        logger.info("Clearing all uploaded logs")
        intelligent_audit_llm_service.uploaded_logs.clear()
        intelligent_audit_llm_service.log_analyses.clear()
        
        return {
            "success": True,
            "message": "Tous les logs ont été supprimés"
        }
        
    except Exception as e:
        logger.error(f"Error clearing logs: {e}")
        return {
            "success": False,
            "error": str(e)
        }

@app.get("/api/logs-status")
async def get_logs_status():
    """
    Retourne l'état des logs stockés dans le service
    """
    try:
        logs_info = intelligent_audit_llm_service.get_stored_logs_info()
        logger.info(f"Logs status requested: {logs_info}")
        
        return {
            "success": True,
            "logs_info": logs_info
        }
        
    except Exception as e:
        logger.error(f"Error getting logs status: {e}")
        return {
            "success": False,
            "error": str(e)
        }

if __name__ == "__main__":
    print("🚀 Starting Simple Oracle Audit LLM API Server")
    print("📡 Server accessible on http://localhost:8001")
    print("📚 Documentation: http://localhost:8001/docs")
    print("⏹️  Press Ctrl+C to stop")
    
    uvicorn.run(
        "simple_api_server:app",
        host="0.0.0.0",
        port=8001,
        reload=True,
        log_level="info"
    ) 
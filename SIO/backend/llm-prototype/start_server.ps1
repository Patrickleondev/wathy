# Script PowerShell pour démarrer le serveur LLM
Write-Host "🚀 Démarrage du serveur LLM Oracle Audit" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""

# Activer l'environnement virtuel
Write-Host "🔧 Activation de l'environnement virtuel..." -ForegroundColor Yellow
& ".\venv\Scripts\Activate.ps1"

# Démarrer le serveur
Write-Host "📡 Démarrage du serveur sur http://localhost:8001" -ForegroundColor Cyan
Write-Host "📚 Documentation: http://localhost:8001/docs" -ForegroundColor Cyan
Write-Host ""
Write-Host "⏹️  Appuyez sur Ctrl+C pour arrêter" -ForegroundColor Red
Write-Host ""

python simple_api_server.py 
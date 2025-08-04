@echo off
echo 🚀 Démarrage du serveur LLM Oracle Audit
echo ========================================
echo.

REM Activer l'environnement virtuel
call venv\Scripts\activate.bat

REM Démarrer le serveur
echo 📡 Démarrage du serveur sur http://localhost:8001
echo 📚 Documentation: http://localhost:8001/docs
echo.
echo ⏹️  Appuyez sur Ctrl+C pour arrêter
echo.

python simple_api_server.py

pause 
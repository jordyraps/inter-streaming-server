@echo off
echo ========================================
echo CREAR REPOSITORIO GITHUB MANUALMENTE
echo ========================================
echo.
echo 1. Ve a: https://github.com/new
echo 2. Repository name: inter-streaming-server
echo 3. Description: ESP32-CAM streaming relay server
echo 4. Selecciona: PUBLIC
echo 5. NO marques "Add a README file"
echo 6. Click "Create repository"
echo.
echo Cuando termines, presiona cualquier tecla...
pause
echo.
echo ========================================
echo SUBIENDO CODIGO A GITHUB
echo ========================================
cd /d C:\Users\USER\Documents\APPS\INTER_SERVER
git remote remove origin
git remote add origin https://github.com/joxdyzz/inter-streaming-server.git
git push -u origin main
echo.
echo Si pide usuario/contraseña:
echo - Usuario: joxdyzz
echo - Contraseña: usa un Personal Access Token (no tu contraseña)
echo.
echo Para crear token: https://github.com/settings/tokens
pause

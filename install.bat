@echo off
echo ==========================================
echo AUTOP - Installation automatique
echo ==========================================
echo.

echo [1/4] Installation des dependances...
call npm install
if errorlevel 1 goto error

echo [2/4] Generation du client Prisma...
call npx prisma generate
if errorlevel 1 goto error

echo [3/4] Creation de la base de donnees...
call npx prisma migrate dev --name init
if errorlevel 1 goto error

echo [4/4] Seed des donnees...
call npx prisma db seed
if errorlevel 1 goto error

echo.
echo ==========================================
echo Installation terminee avec succes!
echo.
echo Identifiants de test:
echo   Admin: admin@autop.fr / admin123
echo   Pro:   pro@garage.fr / user123
echo   Client: client@example.com / user123
echo.
echo Lancer le serveur: npm run dev
echo ==========================================
goto end

:error
echo.
echo ==========================================
echo ERREUR pendant l'installation!
echo ==========================================
exit /b 1

:end
pause
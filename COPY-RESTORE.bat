@echo off
cd /d "%~dp0"
echo Restoring BNcraft pages from Downloads...
copy /Y "%USERPROFILE%\Downloads\index.html" "%~dp0index.html"
copy /Y "%USERPROFILE%\Downloads\BNcraft-other-mods.html" "%~dp0other-mods.html"
copy /Y "%USERPROFILE%\Downloads\BNcraft-Official-Links.html" "%~dp0links.html"
copy /Y "%USERPROFILE%\Downloads\BNcraft-tuturial.html" "%~dp0Help.Center.html"
copy /Y "%USERPROFILE%\Downloads\BNcraft-tuturial.html" "%~dp0tutorial.html"
copy /Y "%~dp0other-mods.html" "%~dp0BNcraft-other-mods.html"
echo.
echo Running patch script (settings, Help Center menu, toggles)...
node "%USERPROFILE%\.cursor\projects\empty-window\restore-bncraft.mjs"
if errorlevel 1 node "%~dp0restore-and-patch.mjs"
echo.
echo Done. Upload js\ folder to GitHub with all HTML files.
pause

@echo off
rem Paleidzia svetaine http://localhost:8765/ ir atidaro narsykle. Uzdarius si langa, svetaine sustoja.
cd /d "%~dp0"
start "" "http://localhost:8765/"
node serve.mjs

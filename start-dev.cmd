@echo off
set "NODE_DIR=C:\Users\eveli\AppData\Local\Microsoft\WinGet\Packages\OpenJS.NodeJS.22_Microsoft.Winget.Source_8wekyb3d8bbwe\node-v22.22.2-win-x64"
set "PATH=%NODE_DIR%;%PATH%"
"%NODE_DIR%\npm.cmd" run dev

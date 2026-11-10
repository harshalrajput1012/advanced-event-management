@echo off
setlocal
set MVN_VERSION=3.9.9
set WRAPPER_DIR=%USERPROFILE%\.m2\wrapper\dists\apache-maven-%MVN_VERSION%
set MVN_HOME=%WRAPPER_DIR%\apache-maven-%MVN_VERSION%
if not exist "%MVN_HOME%\bin\mvn.cmd" (
  powershell -NoProfile -ExecutionPolicy Bypass -Command "New-Item -ItemType Directory -Force '%WRAPPER_DIR%' | Out-Null; $zip='%WRAPPER_DIR%\apache-maven-%MVN_VERSION%-bin.zip'; if (!(Test-Path $zip)) { Invoke-WebRequest -UseBasicParsing 'https://archive.apache.org/dist/maven/maven-3/%MVN_VERSION%/binaries/apache-maven-%MVN_VERSION%-bin.zip' -OutFile $zip }; Expand-Archive -Force $zip '%WRAPPER_DIR%'"
)
call "%MVN_HOME%\bin\mvn.cmd" %*

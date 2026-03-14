@echo off
pushd "%~dp0"
echo Installing dependencies...
npm ci --no-audit --no-fund
if errorlevel 1 (
  echo npm ci failed
  pause
  exit /b 1
)

echo Running lint...
npm run lint || (
  echo Lint failed
  pause
  exit /b 1
)

echo Running tests...
npm test || (
  echo Tests failed
  pause
  exit /b 1
)

echo All steps succeeded
pause
popd

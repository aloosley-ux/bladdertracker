@echo off
setlocal enabledelayedexpansion
pushd "%~dp0"

rem Non-interactive push, PR and issue creation script
rem Defaults can be edited in the file

rem 1) Run CI checks
echo Running npm ci...
npm ci --no-audit --no-fund || (echo npm ci failed & exit /b 1)

echo Running lint...
npm run lint || (echo lint failed & exit /b 1)

echo Running tests...
npm test || (echo tests failed & exit /b 1)

rem 2) Ensure git repo
git rev-parse --is-inside-work-tree >nul 2>&1
if errorlevel 1 (
  echo Not a git repository. Aborting.
  pause
  exit /b 1
)

set "TESTING_BRANCH=testing"
set "FEATURE_BRANCH=feat/fix-lint-logger-hook-deps"
set "COMMIT_MSG=Fix lint: avoid setState in effects, fix hook deps, simplify logger"

rem 3) Prepare testing branch
echo Fetching origin...
git fetch origin --prune

echo Ensuring '%TESTING_BRANCH%' exists and is up to date...

git ls-remote --heads origin %TESTING_BRANCH% >nul 2>&1
if errorlevel 1 (
  echo remote '%TESTING_BRANCH%' not found; creating from origin/main if available
  git ls-remote --heads origin main >nul 2>&1
  if errorlevel 0 (
    git checkout -B %TESTING_BRANCH% origin/main || (echo failed to create testing from origin/main & exit /b 1)
  ) else (
    git checkout -B %TESTING_BRANCH% || (echo failed to create testing branch & exit /b 1)
  )
  git push -u origin %TESTING_BRANCH% || (echo Failed to push %TESTING_BRANCH% & exit /b 1)
) else (
  git checkout %TESTING_BRANCH% || (echo Failed to checkout %TESTING_BRANCH% & exit /b 1)
  git pull --ff-only origin %TESTING_BRANCH% || echo Could not fast-forward %TESTING_BRANCH%
)

rem 4) Create feature branch from testing
echo Creating feature branch '%FEATURE_BRANCH%' from %TESTING_BRANCH%...
git checkout -B %FEATURE_BRANCH% %TESTING_BRANCH% || (echo Failed to create feature branch & exit /b 1)

rem 5) Stage & commit changes if any

echo Staging changes...
git add -A

set HASCHANGES=
for /f "delims=" %%A in ('git status --porcelain') do set HASCHANGES=1
if defined HASCHANGES (
  echo Committing changes...
  git commit -m "%COMMIT_MSG%" -m "Co-authored-by: Copilot <223556219+Copilot@users.noreply.github.com>" || (echo Commit failed & exit /b 1)
) else (
  echo No changes to commit.
)

rem 6) Push feature branch

echo Pushing feature branch to origin...
git push -u origin %FEATURE_BRANCH% || (echo Push failed & exit /b 1)

rem 7) Create PR (if gh is available)
where gh >nul 2>&1
if errorlevel 0 (
  echo Creating PR from %FEATURE_BRANCH% into %TESTING_BRANCH% using gh...
  gh pr create --base %TESTING_BRANCH% --head %FEATURE_BRANCH% --title "%COMMIT_MSG%" --body "Small fixes: central logger, hook deps corrected, CI lint green. Runs tests locally." --label "automated" || echo gh pr create failed
) else (
  echo gh CLI not found; skipping PR creation. Install gh to enable automated PR creation.
)

rem 8) Create issues using PowerShell script if present
if exist create-issues.ps1 (
  where pwsh >nul 2>&1 && pwsh -NoProfile -ExecutionPolicy Bypass -File .\create-issues.ps1 || (
    where powershell >nul 2>&1 && powershell -NoProfile -ExecutionPolicy Bypass -File .\create-issues.ps1 || echo Could not run create-issues.ps1 - check PowerShell and gh auth
  )
) else (
  echo create-issues.ps1 not found - skipped issue creation
)

echo All done.
pause
popd
endlocal

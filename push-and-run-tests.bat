@echo off
setlocal enabledelayedexpansion
pushd "%~dp0"

echo Running npm ci...
npm ci --no-audit --no-fund || (echo npm ci failed & pause & exit /b 1)

echo Running lint...
npm run lint || (echo lint failed & pause & exit /b 1)

echo Running tests...
npm test || (echo tests failed & pause & exit /b 1)

rem Ensure this is a git repository
git rev-parse --is-inside-work-tree >nul 2>&1
if errorlevel 1 (
  echo Not a git repository. Aborting.
  pause
  exit /b 1
)

set "DEFAULT_BRANCH=feat/fix-lint-logger-hook-deps"
set /p "BRANCH=Feature branch name (default %DEFAULT_BRANCH%): "
if "%BRANCH%"=="" set "BRANCH=%DEFAULT_BRANCH%"

echo Fetching origin...
git fetch origin --prune

echo Ensuring 'testing' branch exists and is up to date...
rem Check if remote testing exists
git ls-remote --heads origin testing >nul 2>&1
if errorlevel 1 (
  echo remote 'testing' not found; attempting to create from origin/main
  git ls-remote --heads origin main >nul 2>&1
  if errorlevel 0 (
    git checkout -B testing origin/main
  ) else (
    git checkout -B testing
  )
  git push -u origin testing || (echo Failed to push testing & pause & exit /b 1)
) else (
  git checkout testing || (echo Failed to checkout testing & pause & exit /b 1)
  git pull --ff-only origin testing || echo Could not fast-forward testing
)

rem Create feature branch from testing
git checkout -B %BRANCH% testing || (echo Failed to create feature branch & pause & exit /b 1)

rem Stage changes
git add -A

rem Detect if there are staged/uncommitted changes
set HASCHANGES=
for /f "delims=" %%A in ('git status --porcelain') do set HASCHANGES=1
if defined HASCHANGES (
  set "COMMIT_MSG=Fix lint: avoid setState in effects, fix hook deps, simplify logger"
  echo Committing changes...
  git commit -m "%COMMIT_MSG%" -m "Co-authored-by: Copilot <223556219+Copilot@users.noreply.github.com>" || (echo Commit failed & pause & exit /b 1)
) else (
  echo No changes to commit.
)

echo Pushing feature branch...
git push -u origin %BRANCH% || (echo Push failed & pause & exit /b 1)

rem Optional: create PR using gh if available
where gh >nul 2>&1
if errorlevel 0 (
  set /p CREATEPR="Create a PR on GitHub from %BRANCH% -> testing? (y/N): "
  if /i "%CREATEPR%"=="y" (
    gh pr create --base testing --head %BRANCH% --title "Fix lint: avoid setState in effects, fix hook deps, simplify logger" --body "Small fixes: central logger, hook deps corrected, CI lint green. Runs tests locally."
  )
) else (
  echo gh CLI not found; skipping PR creation prompt.
)

echo Done.
pause
popd
endlocal

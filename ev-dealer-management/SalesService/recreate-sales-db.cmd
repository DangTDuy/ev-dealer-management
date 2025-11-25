@echo off
REM recreate-sales-db.cmd
REM Usage: run this from the SalesService folder in CMD: recreate-sales-db.cmd

echo === Recreate sales.db (delete old and apply migrations) ===

echo Current folder: %cd%

REM Stop dotnet processes if any (optional)
tasklist | findstr dotnet >nul
if %errorlevel%==0 (
    echo Stopping dotnet processes...
    taskkill /IM dotnet.exe /F >nul 2>&1
) else (
    echo No dotnet process found.
)

echo.
echo Deleting existing sales.db if present...
if exist "sales.db" (
    del /F /Q "sales.db"
    if %errorlevel%==0 (
        echo Deleted sales.db
    ) else (
        echo Failed to delete sales.db - it may be locked. Close any app using it and try again.
        pause
        exit /b 1
    )
) else (
    echo No sales.db file found in %cd%
)

echo.
echo Applying EF Core migrations to recreate database...
dotnet ef database update
if %errorlevel% neq 0 (
    echo dotnet ef failed. Check error output above.
    pause
    exit /b %errorlevel%
)
echo.
echo Migration applied.
echo New sales.db info:
dir .\sales.db
echo.
echo Done.
pause
@echo off
REM recreate-sales-db.cmd
REM Usage: run this from the SalesService folder in CMD: recreate-sales-db.cmd

echo === Recreate sales.db (delete old and apply migrations) ===






dir .\sales.db
necho.
necho Done.
pause
n
necho.
necho Applying EF Core migrations to recreate database...
ndotnet ef database update
nif %errorlevel% neq 0 (
n    echo dotnet ef failed. Check error output above.
n    pause
n    exit /b %errorlevel%
n)
necho.
necho Migration applied.
necho New sales.db info:
necho Deleting existing sales.db if present...
nif exist "sales.db" (
n    del /F /Q "sales.db"
n    if %errorlevel%==0 (
n        echo Deleted sales.db
n    ) else (
n        echo Failed to delete sales.db - it may be locked. Close any app using it and try again.
n        pause
n        exit /b 1
n    )
n) else (
n    echo No sales.db file found in %cd%
n)
necho.
:: Stop dotnet processes if any (optional)
ask tasklist | findstr dotnet >nul
nif %errorlevel%==0 (
n    echo Stopping dotnet processes...
n    taskkill /IM dotnet.exe /F >nul 2>&1
n) else (
n    echo No dotnet process found.
n):: Ensure working directory
necho Current folder: %cd%
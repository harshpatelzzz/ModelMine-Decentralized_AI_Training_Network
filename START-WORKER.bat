@echo off
echo Starting Worker...
cd api
set DATABASE_URL=postgresql://postgres:postgres@localhost:5432/modelmine
set REDIS_HOST=localhost
npx tsx src/worker.ts
pause


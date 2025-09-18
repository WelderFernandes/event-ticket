@echo off
REM Script batch para configurar e executar a aplicação com Docker no Windows

setlocal enabledelayedexpansion

if "%1"=="" goto :show_help
if "%1"=="dev" goto :setup_dev
if "%1"=="prod" goto :setup_prod
if "%1"=="stop" goto :stop_containers
if "%1"=="clean" goto :clean_all
if "%1"=="logs" goto :show_logs
if "%1"=="status" goto :show_status
goto :show_help

:setup_dev
echo ================================
echo CONFIGURAÇÃO DE DESENVOLVIMENTO
echo ================================

echo [INFO] Criando arquivo .env para desenvolvimento...
if not exist .env (
    (
        echo # Configurações de desenvolvimento
        echo DATABASE_URL="postgresql://postgres:postgres123@localhost:5433/event_ticket_dev"
        echo NODE_ENV=development
        echo NEXTAUTH_SECRET="your-secret-key-here"
        echo NEXTAUTH_URL="http://localhost:3001"
    ) > .env
    echo [INFO] Arquivo .env criado com sucesso!
) else (
    echo [WARNING] Arquivo .env já existe. Pulando criação...
)

echo [INFO] Iniciando containers de desenvolvimento...
docker-compose -f docker-compose.dev.yml up -d

echo [INFO] Aguardando banco de dados ficar pronto...
timeout /t 10 /nobreak > nul

echo [INFO] Executando migrações do Prisma...
docker-compose -f docker-compose.dev.yml exec app npx prisma migrate dev --name init

echo [INFO] Gerando cliente Prisma...
docker-compose -f docker-compose.dev.yml exec app npx prisma generate

echo ================================
echo DESENVOLVIMENTO CONFIGURADO COM SUCESSO!
echo ================================
echo ✅ Aplicação: http://localhost:3001
echo ✅ Prisma Studio: http://localhost:5555
echo ✅ PostgreSQL: localhost:5433
echo ✅ Redis: localhost:6380
goto :end

:setup_prod
echo ================================
echo CONFIGURAÇÃO DE PRODUÇÃO
echo ================================

echo [INFO] Criando arquivo .env para produção...
if not exist .env.production (
    (
        echo # Configurações de produção
        echo DATABASE_URL="postgresql://postgres:postgres123@postgres:5432/event_ticket"
        echo NODE_ENV=production
        echo NEXTAUTH_SECRET="your-production-secret-key-here"
        echo NEXTAUTH_URL="http://localhost:3000"
    ) > .env.production
    echo [INFO] Arquivo .env.production criado com sucesso!
) else (
    echo [WARNING] Arquivo .env.production já existe. Pulando criação...
)

echo [INFO] Construindo imagem de produção...
docker-compose build

echo [INFO] Iniciando containers de produção...
docker-compose up -d

echo [INFO] Aguardando banco de dados ficar pronto...
timeout /t 15 /nobreak > nul

echo [INFO] Executando migrações do Prisma...
docker-compose exec app npx prisma migrate deploy

echo [INFO] Gerando cliente Prisma...
docker-compose exec app npx prisma generate

echo ================================
echo PRODUÇÃO CONFIGURADA COM SUCESSO!
echo ================================
echo ✅ Aplicação: http://localhost:3000
echo ✅ PostgreSQL: localhost:5432
echo ✅ Redis: localhost:6379
goto :end

:stop_containers
echo ================================
echo PARANDO CONTAINERS
echo ================================

echo [INFO] Parando containers de desenvolvimento...
docker-compose -f docker-compose.dev.yml down

echo [INFO] Parando containers de produção...
docker-compose down

echo [INFO] Containers parados com sucesso!
goto :end

:clean_all
echo ================================
echo LIMPEZA COMPLETA
echo ================================

echo [WARNING] Isso irá remover todos os containers, volumes e imagens!
set /p confirm="Tem certeza? (y/N): "

if /i "%confirm%"=="y" (
    echo [INFO] Parando e removendo containers...
    docker-compose -f docker-compose.dev.yml down -v
    docker-compose down -v
    
    echo [INFO] Removendo imagens...
    for /f %%i in ('docker images -q event-ticket* 2^>nul') do docker rmi %%i
    
    echo [INFO] Limpando volumes não utilizados...
    docker volume prune -f
    
    echo [INFO] Limpeza concluída!
) else (
    echo [INFO] Limpeza cancelada.
)
goto :end

:show_logs
echo ================================
echo LOGS DA APLICAÇÃO
echo ================================

if "%2"=="dev" (
    docker-compose -f docker-compose.dev.yml logs -f app
) else (
    docker-compose logs -f app
)
goto :end

:show_status
echo ================================
echo STATUS DOS CONTAINERS
echo ================================

echo Desenvolvimento:
docker-compose -f docker-compose.dev.yml ps

echo.
echo Produção:
docker-compose ps
goto :end

:show_help
echo EventTicket Docker Setup
echo.
echo Uso: scripts\docker-setup.bat [comando]
echo.
echo Comandos disponíveis:
echo   dev     - Configurar ambiente de desenvolvimento
echo   prod    - Configurar ambiente de produção
echo   stop    - Parar todos os containers
echo   clean   - Limpar containers, volumes e imagens
echo   logs    - Mostrar logs (dev^|prod)
echo   status  - Mostrar status dos containers
echo.
echo Exemplos:
echo   scripts\docker-setup.bat dev          # Configurar desenvolvimento
echo   scripts\docker-setup.bat prod         # Configurar produção
echo   scripts\docker-setup.bat logs dev     # Ver logs de desenvolvimento
echo   scripts\docker-setup.bat status       # Ver status dos containers

:end
endlocal

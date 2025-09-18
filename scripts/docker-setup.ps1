# Script PowerShell para configurar e executar a aplicação com Docker

param(
    [Parameter(Position=0)]
    [ValidateSet("dev", "prod", "stop", "clean", "logs", "status")]
    [string]$Command = "",
    
    [Parameter(Position=1)]
    [string]$LogType = "prod"
)

# Função para imprimir mensagens coloridas
function Write-Info {
    param([string]$Message)
    Write-Host "[INFO] $Message" -ForegroundColor Green
}

function Write-Warning {
    param([string]$Message)
    Write-Host "[WARNING] $Message" -ForegroundColor Yellow
}

function Write-Error {
    param([string]$Message)
    Write-Host "[ERROR] $Message" -ForegroundColor Red
}

function Write-Header {
    param([string]$Message)
    Write-Host "================================" -ForegroundColor Blue
    Write-Host $Message -ForegroundColor Blue
    Write-Host "================================" -ForegroundColor Blue
}

# Verificar se Docker está instalado
if (-not (Get-Command docker -ErrorAction SilentlyContinue)) {
    Write-Error "Docker não está instalado. Por favor, instale o Docker Desktop primeiro."
    exit 1
}

# Verificar se Docker Compose está instalado
if (-not (Get-Command docker-compose -ErrorAction SilentlyContinue)) {
    Write-Error "Docker Compose não está instalado. Por favor, instale o Docker Compose primeiro."
    exit 1
}

# Função para desenvolvimento
function Setup-Dev {
    Write-Header "CONFIGURAÇÃO DE DESENVOLVIMENTO"
    
    Write-Info "Criando arquivo .env para desenvolvimento..."
    if (-not (Test-Path ".env")) {
        @"
# Configurações de desenvolvimento
DATABASE_URL="postgresql://postgres:postgres123@localhost:5433/event_ticket_dev"
NODE_ENV=development
NEXTAUTH_SECRET="your-secret-key-here"
NEXTAUTH_URL="http://localhost:3001"
"@ | Out-File -FilePath ".env" -Encoding UTF8
        Write-Info "Arquivo .env criado com sucesso!"
    } else {
        Write-Warning "Arquivo .env já existe. Pulando criação..."
    }
    
    Write-Info "Iniciando containers de desenvolvimento..."
    docker-compose -f docker-compose.dev.yml up -d
    
    Write-Info "Aguardando banco de dados ficar pronto..."
    Start-Sleep -Seconds 10
    
    Write-Info "Executando migrações do Prisma..."
    docker-compose -f docker-compose.dev.yml exec app npx prisma migrate dev --name init
    
    Write-Info "Gerando cliente Prisma..."
    docker-compose -f docker-compose.dev.yml exec app npx prisma generate
    
    Write-Header "DESENVOLVIMENTO CONFIGURADO COM SUCESSO!"
    Write-Host "✅ Aplicação: http://localhost:3001" -ForegroundColor Green
    Write-Host "✅ Prisma Studio: http://localhost:5555" -ForegroundColor Green
    Write-Host "✅ PostgreSQL: localhost:5433" -ForegroundColor Green
    Write-Host "✅ Redis: localhost:6380" -ForegroundColor Green
}

# Função para produção
function Setup-Prod {
    Write-Header "CONFIGURAÇÃO DE PRODUÇÃO"
    
    Write-Info "Criando arquivo .env para produção..."
    if (-not (Test-Path ".env.production")) {
        @"
# Configurações de produção
DATABASE_URL="postgresql://postgres:postgres123@postgres:5432/event_ticket"
NODE_ENV=production
NEXTAUTH_SECRET="your-production-secret-key-here"
NEXTAUTH_URL="http://localhost:3000"
"@ | Out-File -FilePath ".env.production" -Encoding UTF8
        Write-Info "Arquivo .env.production criado com sucesso!"
    } else {
        Write-Warning "Arquivo .env.production já existe. Pulando criação..."
    }
    
    Write-Info "Construindo imagem de produção..."
    docker-compose build
    
    Write-Info "Iniciando containers de produção..."
    docker-compose up -d
    
    Write-Info "Aguardando banco de dados ficar pronto..."
    Start-Sleep -Seconds 15
    
    Write-Info "Executando migrações do Prisma..."
    docker-compose exec app npx prisma migrate deploy
    
    Write-Info "Gerando cliente Prisma..."
    docker-compose exec app npx prisma generate
    
    Write-Header "PRODUÇÃO CONFIGURADA COM SUCESSO!"
    Write-Host "✅ Aplicação: http://localhost:3000" -ForegroundColor Green
    Write-Host "✅ PostgreSQL: localhost:5432" -ForegroundColor Green
    Write-Host "✅ Redis: localhost:6379" -ForegroundColor Green
}

# Função para parar containers
function Stop-Containers {
    Write-Header "PARANDO CONTAINERS"
    
    Write-Info "Parando containers de desenvolvimento..."
    docker-compose -f docker-compose.dev.yml down
    
    Write-Info "Parando containers de produção..."
    docker-compose down
    
    Write-Info "Containers parados com sucesso!"
}

# Função para limpar tudo
function Clean-All {
    Write-Header "LIMPEZA COMPLETA"
    
    Write-Warning "Isso irá remover todos os containers, volumes e imagens!"
    $confirm = Read-Host "Tem certeza? (y/N)"
    
    if ($confirm -eq "y" -or $confirm -eq "Y") {
        Write-Info "Parando e removendo containers..."
        docker-compose -f docker-compose.dev.yml down -v
        docker-compose down -v
        
        Write-Info "Removendo imagens..."
        $images = docker images -q event-ticket* 2>$null
        if ($images) {
            docker rmi $images
        }
        
        Write-Info "Limpando volumes não utilizados..."
        docker volume prune -f
        
        Write-Info "Limpeza concluída!"
    } else {
        Write-Info "Limpeza cancelada."
    }
}

# Função para mostrar logs
function Show-Logs {
    param([string]$Type)
    
    Write-Header "LOGS DA APLICAÇÃO"
    
    if ($Type -eq "dev") {
        docker-compose -f docker-compose.dev.yml logs -f app
    } else {
        docker-compose logs -f app
    }
}

# Função para mostrar status
function Show-Status {
    Write-Header "STATUS DOS CONTAINERS"
    
    Write-Host "Desenvolvimento:" -ForegroundColor Blue
    docker-compose -f docker-compose.dev.yml ps
    
    Write-Host "`nProdução:" -ForegroundColor Blue
    docker-compose ps
}

# Menu principal
switch ($Command) {
    "dev" {
        Setup-Dev
    }
    "prod" {
        Setup-Prod
    }
    "stop" {
        Stop-Containers
    }
    "clean" {
        Clean-All
    }
    "logs" {
        Show-Logs $LogType
    }
    "status" {
        Show-Status
    }
    default {
        Write-Host "EventTicket Docker Setup" -ForegroundColor Blue
        Write-Host ""
        Write-Host "Uso: .\scripts\docker-setup.ps1 [comando]"
        Write-Host ""
        Write-Host "Comandos disponíveis:"
        Write-Host "  dev     - Configurar ambiente de desenvolvimento"
        Write-Host "  prod    - Configurar ambiente de produção"
        Write-Host "  stop    - Parar todos os containers"
        Write-Host "  clean   - Limpar containers, volumes e imagens"
        Write-Host "  logs    - Mostrar logs (dev|prod)"
        Write-Host "  status  - Mostrar status dos containers"
        Write-Host ""
        Write-Host "Exemplos:"
        Write-Host "  .\scripts\docker-setup.ps1 dev          # Configurar desenvolvimento"
        Write-Host "  .\scripts\docker-setup.ps1 prod         # Configurar produção"
        Write-Host "  .\scripts\docker-setup.ps1 logs dev     # Ver logs de desenvolvimento"
        Write-Host "  .\scripts\docker-setup.ps1 status       # Ver status dos containers"
    }
}

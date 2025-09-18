#!/bin/bash

# Script para configurar e executar a aplicação com Docker

set -e

echo "🚀 Configurando aplicação EventTicket com Docker..."

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Função para imprimir mensagens coloridas
print_message() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

print_header() {
    echo -e "${BLUE}================================${NC}"
    echo -e "${BLUE}$1${NC}"
    echo -e "${BLUE}================================${NC}"
}

# Verificar se Docker está instalado
if ! command -v docker &> /dev/null; then
    print_error "Docker não está instalado. Por favor, instale o Docker primeiro."
    exit 1
fi

# Verificar se Docker Compose está instalado
if ! command -v docker-compose &> /dev/null; then
    print_error "Docker Compose não está instalado. Por favor, instale o Docker Compose primeiro."
    exit 1
fi

# Função para desenvolvimento
setup_dev() {
    print_header "CONFIGURAÇÃO DE DESENVOLVIMENTO"
    
    print_message "Criando arquivo .env para desenvolvimento..."
    if [ ! -f .env ]; then
        cat > .env << EOF
# Configurações de desenvolvimento
DATABASE_URL="postgresql://postgres:postgres123@localhost:5433/event_ticket_dev"
NODE_ENV=development
NEXTAUTH_SECRET="your-secret-key-here"
NEXTAUTH_URL="http://localhost:3001"
EOF
        print_message "Arquivo .env criado com sucesso!"
    else
        print_warning "Arquivo .env já existe. Pulando criação..."
    fi
    
    print_message "Iniciando containers de desenvolvimento..."
    docker-compose -f docker-compose.dev.yml up -d
    
    print_message "Aguardando banco de dados ficar pronto..."
    sleep 10
    
    print_message "Executando migrações do Prisma..."
    docker-compose -f docker-compose.dev.yml exec app npx prisma migrate dev --name init
    
    print_message "Gerando cliente Prisma..."
    docker-compose -f docker-compose.dev.yml exec app npx prisma generate
    
    print_header "DESENVOLVIMENTO CONFIGURADO COM SUCESSO!"
    echo -e "${GREEN}✅ Aplicação:${NC} http://localhost:3001"
    echo -e "${GREEN}✅ Prisma Studio:${NC} http://localhost:5555"
    echo -e "${GREEN}✅ PostgreSQL:${NC} localhost:5433"
    echo -e "${GREEN}✅ Redis:${NC} localhost:6380"
}

# Função para produção
setup_prod() {
    print_header "CONFIGURAÇÃO DE PRODUÇÃO"
    
    print_message "Criando arquivo .env para produção..."
    if [ ! -f .env.production ]; then
        cat > .env.production << EOF
# Configurações de produção
DATABASE_URL="postgresql://postgres:postgres123@postgres:5432/event_ticket"
NODE_ENV=production
NEXTAUTH_SECRET="your-production-secret-key-here"
NEXTAUTH_URL="http://localhost:3000"
EOF
        print_message "Arquivo .env.production criado com sucesso!"
    else
        print_warning "Arquivo .env.production já existe. Pulando criação..."
    fi
    
    print_message "Construindo imagem de produção..."
    docker-compose build
    
    print_message "Iniciando containers de produção..."
    docker-compose up -d
    
    print_message "Aguardando banco de dados ficar pronto..."
    sleep 15
    
    print_message "Executando migrações do Prisma..."
    docker-compose exec app npx prisma migrate deploy
    
    print_message "Gerando cliente Prisma..."
    docker-compose exec app npx prisma generate
    
    print_header "PRODUÇÃO CONFIGURADA COM SUCESSO!"
    echo -e "${GREEN}✅ Aplicação:${NC} http://localhost:3000"
    echo -e "${GREEN}✅ PostgreSQL:${NC} localhost:5432"
    echo -e "${GREEN}✅ Redis:${NC} localhost:6379"
}

# Função para parar containers
stop_containers() {
    print_header "PARANDO CONTAINERS"
    
    print_message "Parando containers de desenvolvimento..."
    docker-compose -f docker-compose.dev.yml down
    
    print_message "Parando containers de produção..."
    docker-compose down
    
    print_message "Containers parados com sucesso!"
}

# Função para limpar tudo
clean_all() {
    print_header "LIMPEZA COMPLETA"
    
    print_warning "Isso irá remover todos os containers, volumes e imagens!"
    read -p "Tem certeza? (y/N): " -n 1 -r
    echo
    
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        print_message "Parando e removendo containers..."
        docker-compose -f docker-compose.dev.yml down -v
        docker-compose down -v
        
        print_message "Removendo imagens..."
        docker rmi $(docker images -q event-ticket*) 2>/dev/null || true
        
        print_message "Limpando volumes não utilizados..."
        docker volume prune -f
        
        print_message "Limpeza concluída!"
    else
        print_message "Limpeza cancelada."
    fi
}

# Função para mostrar logs
show_logs() {
    print_header "LOGS DA APLICAÇÃO"
    
    if [ "$1" = "dev" ]; then
        docker-compose -f docker-compose.dev.yml logs -f app
    else
        docker-compose logs -f app
    fi
}

# Função para mostrar status
show_status() {
    print_header "STATUS DOS CONTAINERS"
    
    echo -e "${BLUE}Desenvolvimento:${NC}"
    docker-compose -f docker-compose.dev.yml ps
    
    echo -e "\n${BLUE}Produção:${NC}"
    docker-compose ps
}

# Menu principal
case "${1:-}" in
    "dev")
        setup_dev
        ;;
    "prod")
        setup_prod
        ;;
    "stop")
        stop_containers
        ;;
    "clean")
        clean_all
        ;;
    "logs")
        show_logs "$2"
        ;;
    "status")
        show_status
        ;;
    *)
        echo -e "${BLUE}EventTicket Docker Setup${NC}"
        echo ""
        echo "Uso: $0 [comando]"
        echo ""
        echo "Comandos disponíveis:"
        echo "  dev     - Configurar ambiente de desenvolvimento"
        echo "  prod    - Configurar ambiente de produção"
        echo "  stop    - Parar todos os containers"
        echo "  clean   - Limpar containers, volumes e imagens"
        echo "  logs    - Mostrar logs (dev|prod)"
        echo "  status  - Mostrar status dos containers"
        echo ""
        echo "Exemplos:"
        echo "  $0 dev          # Configurar desenvolvimento"
        echo "  $0 prod         # Configurar produção"
        echo "  $0 logs dev     # Ver logs de desenvolvimento"
        echo "  $0 status       # Ver status dos containers"
        ;;
esac

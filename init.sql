-- Script de inicialização do banco de dados
-- Este arquivo é executado automaticamente quando o container PostgreSQL é criado

-- Criar extensões necessárias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Criar usuário específico para a aplicação (opcional)
-- CREATE USER event_ticket_user WITH PASSWORD 'secure_password';
-- GRANT ALL PRIVILEGES ON DATABASE event_ticket TO event_ticket_user;

-- Configurações de timezone
SET timezone = 'America/Sao_Paulo';

-- Comentários sobre o banco
COMMENT ON DATABASE event_ticket IS 'Banco de dados para o sistema de tickets de eventos';

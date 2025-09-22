# EventTicket - Sistema de Geração e Validação de Tickets

Sistema completo para geração e validação de tickets com QR codes únicos para eventos, desenvolvido com Next.js 15, React 19, Prisma e PostgreSQL.

## 🚀 Funcionalidades

### ✅ Geração de Tickets

- **QR Codes Únicos**: Cada ticket possui um QR code único e seguro
- **Controle de Participantes**: Sistema de cadastro completo com validação de email
- **Limite de Tickets**: Controle automático do número máximo de participantes por evento
- **Download Automático**: QR codes são gerados e disponibilizados para download

### ✅ Validação de Tickets

- **Scanner de QR Code**: Interface com câmera para leitura automática
- **Validação Manual**: Entrada manual do código QR para casos especiais
- **Uso Único**: Garantia de que cada ticket só pode ser usado uma vez
- **Status em Tempo Real**: Feedback imediato sobre a validade do ticket

### ✅ Gestão de Eventos

- **Criação de Eventos**: Interface completa para cadastro de eventos
- **Informações Detalhadas**: Data, local, descrição e limite de participantes
- **Relatórios**: Estatísticas de tickets gerados, usados e cancelados

### ✅ Interface Responsiva

- **Design Moderno**: Interface limpa e intuitiva com shadcn/ui
- **Mobile First**: Totalmente responsivo para dispositivos móveis
- **Acessibilidade**: Seguindo padrões WCAG 2.1 AA

## 🛠️ Tecnologias Utilizadas

- **Next.js 15** - Framework React com App Router
- **React 19** - Biblioteca de interface com useActionState
- **TypeScript** - Tipagem estática para maior segurança
- **Prisma** - ORM para banco de dados
- **PostgreSQL** - Banco de dados relacional
- **Tailwind CSS** - Framework de estilos
- **shadcn/ui** - Componentes de interface
- **Zod** - Validação de schemas
- **QRCode** - Geração de códigos QR
- **html5-qrcode** - Scanner de QR codes

## 📋 Pré-requisitos

- Node.js 18+
- PostgreSQL 12+
- npm ou pnpm

## 🚀 Instalação

1. **Clone o repositório**

```bash
git clone <url-do-repositorio>
cd event-ticket
```

2. **Instale as dependências**

```bash
npm install
# ou
pnpm install
```

3. **Configure o banco de dados**

```bash
# Crie um arquivo .env na raiz do projeto
DATABASE_URL="postgresql://usuario:senha@localhost:5432/event_ticket"
```

4. **Execute as migrações**

```bash
npx prisma migrate dev
```

5. **Gere o cliente Prisma**

```bash
npx prisma generate
```

6. **Inicie o servidor de desenvolvimento**

```bash
npm run dev
# ou
pnpm dev
```

## 📱 Como Usar

### 1. Criar um Evento

- Acesse `/painel/events`
- Preencha as informações do evento
- Defina o limite de participantes (opcional)

### 2. Gerar Tickets

- Acesse `/painel/tickets`
- Selecione o evento
- Preencha os dados do participante
- O sistema gerará automaticamente:
  - Número único do ticket
  - QR code único
  - Download do QR code

### 3. Validar Tickets

- Acesse `/validation`
- Use o scanner de câmera ou digite o código manualmente
- O sistema validará e marcará o ticket como usado

## 🏗️ Estrutura do Projeto

```
event-ticket/
├── app/                    # App Router do Next.js
│   ├── painel/         # Páginas do painel
│   ├── validation/        # Página de validação
│   └── layout.tsx         # Layout principal
├── components/            # Componentes React
│   ├── ui/               # Componentes shadcn/ui
│   ├── ticket-generator-form.tsx
│   ├── ticket-validator.tsx
│   └── qr-code-scanner.tsx
├── lib/                  # Utilitários e configurações
│   ├── actions/          # Server Actions
│   ├── prisma.ts         # Cliente Prisma
│   ├── qrcode.ts         # Geração de QR codes
│   └── validations.ts    # Schemas Zod
├── prisma/               # Schema e migrações
│   └── schema.prisma
└── public/               # Arquivos estáticos
```

## 🔧 Scripts Disponíveis

```bash
# Desenvolvimento
npm run dev

# Build para produção
npm run build

# Iniciar servidor de produção
npm run start

# Linting
npm run lint

# Formatação
npm run format

# Prisma
npx prisma studio    # Interface visual do banco
npx prisma migrate   # Executar migrações
npx prisma generate  # Gerar cliente
```

## 🗄️ Schema do Banco de Dados

### Event

- `id`: Identificador único
- `title`: Nome do evento
- `description`: Descrição opcional
- `date`: Data e hora do evento
- `location`: Local do evento
- `maxTickets`: Limite de participantes
- `price`: Preço do ticket (opcional)
- `isActive`: Status ativo/inativo

### Participant

- `id`: Identificador único
- `name`: Nome completo
- `email`: Email (único por evento)
- `phone`: Telefone (opcional)
- `eventId`: Referência ao evento

### Ticket

- `id`: Identificador único
- `ticketNumber`: Número único do ticket
- `qrCode`: Código QR único
- `status`: ACTIVE, USED, CANCELLED
- `usedAt`: Data/hora de uso
- `participantId`: Referência ao participante
- `eventId`: Referência ao evento

## 🔒 Segurança

- **Validação Server-Side**: Todas as validações são feitas no servidor
- **QR Codes Únicos**: Cada ticket possui um código único e não previsível
- **Uso Único**: Sistema garante que tickets não sejam reutilizados
- **Sanitização**: Entradas são sanitizadas e validadas
- **CSRF Protection**: Proteção automática com Server Actions

## 📊 Funcionalidades Avançadas

### Scanner de QR Code

- Interface com câmera para leitura automática
- Suporte a câmera traseira em dispositivos móveis
- Validação em tempo real
- Feedback visual durante a leitura

### Sistema de Status

- **ACTIVE**: Ticket válido e disponível para uso
- **USED**: Ticket já foi utilizado
- **CANCELLED**: Ticket foi cancelado

### Relatórios e Estatísticas

- Total de tickets por evento
- Tickets utilizados vs. disponíveis
- Histórico de validações
- Estatísticas de participação

## 🚀 Deploy

### Vercel (Recomendado)

1. Conecte seu repositório ao Vercel
2. Configure a variável `DATABASE_URL`
3. Execute as migrações no banco de produção
4. Deploy automático a cada push

### Docker

```bash
# Build da imagem
docker build -t event-ticket .

# Executar container
docker run -p 3000:3000 event-ticket
```

## 🤝 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📝 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

## 📞 Suporte

Para suporte e dúvidas:

- Abra uma issue no GitHub
- Entre em contato via email
- Consulte a documentação do Next.js 15

---

**Desenvolvido com ❤️ usando Next.js 15 e React 19**

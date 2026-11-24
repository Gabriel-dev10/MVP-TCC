# MaricáMais 🌿

**Plataforma Digital de Marketplace para o Comércio Local de Maricá/RJ**

> Projeto de Conclusão de Curso — Vitrine digital para aproximar moradores e empreendedores de Maricá, com suporte informativo à moeda social Mumbuca.

## Sobre o Projeto

O **MaricáMais** é um protótipo de marketplace digital desenvolvido como projeto acadêmico, com o objetivo de ampliar a visibilidade do comércio local de Maricá (RJ). A plataforma conecta pequenos empreendedores, artesãos e produtores rurais com os moradores da cidade.

### Funcionalidades do Protótipo

- 🏪 **Vitrine de produtos** com busca, filtros por categoria, bairro, preço e Mumbuca
- 🗂️ **Categorias** (Alimentação, Artesanato, Moda, Beleza, Casa, Agricultura, Serviços, Outros)
- 🏘️ **Filtro por bairro** (8 bairros de Maricá)
- 💰 **Filtro Mumbuca** — vendedores que declaram aceitar a moeda social
- 🔨 **Leilões demonstrativos** — lances com validação e persistência local
- 🗺️ **Negócios por bairro** — navegação pela localização dos vendedores
- 👨‍💼 **Cadastro e painel do empreendedor** — publicação, edição e ativação de anúncios
- 💬 **Contato demonstrativo** — registro local de mensagens de interesse
- 💾 **Base simulada** — persiste no navegador com `localStorage`, sem serviço externo
- 🛡️ **Painel administrativo demonstrativo** — dados fictícios, sem autenticação

## Stack Tecnológica

| Camada | Tecnologia |
|--------|-----------|
| Frontend | React 19 + TypeScript |
| Roteamento | TanStack Router (file-based) |
| SSR | TanStack Start + Nitro |
| Estilo | Tailwind CSS v4 |
| UI Components | Radix UI + shadcn/ui |
| Formulários | React Hook Form + Zod |
| Ícones | Lucide React |
| Notificações | Sonner |
| Build | Vite 8 |
| Package Manager | Bun (ou npm) |

## Instalação e Execução Local

### Pré-requisitos
- Node.js 20+ ou Bun 1.x
- Git

### Passos

```bash
# Clone o repositório
git clone https://github.com/seu-usuario/marica-local-marketplace.git
cd marica-local-marketplace-main

# Instale as dependências
bun install
# ou: npm install

# Execute em modo de desenvolvimento
bun run dev
# ou: npm run dev
```

Acesse `http://localhost:3000`

## Scripts Disponíveis

```bash
bun run dev        # Servidor de desenvolvimento
bun run build      # Build de produção
bun run preview    # Preview do build
bun run lint       # Linting com ESLint
bun run format     # Formatação com Prettier
bun run test       # Testes com Vitest
```

## Estrutura do Projeto

```
marica-local-marketplace-main/
├── src/
│   ├── assets/          # Imagens do protótipo
│   ├── components/
│   │   ├── site/        # Layout, Cards, componentes do site
│   │   └── ui/          # Componentes base (shadcn/ui)
│   ├── data/
│   │   ├── demo.ts      # Dados demonstrativos
│   │   └── mock-db.ts   # Persistência local simulada
│   ├── hooks/           # Custom hooks
│   ├── lib/             # Utilitários
│   └── routes/          # Páginas (file-based routing)
│       ├── index.tsx    # Home
│       ├── explorar.tsx # Busca e filtros
│       ├── categorias.tsx
│       ├── negocios.tsx
│       ├── leiloes.tsx  # Leilões demonstrativos
│       ├── mapa.tsx     # Negócios por bairro
│       ├── painel.tsx   # Painel do empreendedor
│       ├── admin.tsx    # Painel administrativo
│       ├── cadastro.tsx # Cadastro de negócio
│       └── sobre.tsx    # Sobre o projeto
├── database/
│   ├── schema.sql       # Esquema de referência para futura integração SQL
│   └── seed.sql         # Dados SQL de referência
├── DEPLOY.md            # Guia completo de deploy
└── README.md
```

## Deploy

Consulte [DEPLOY.md](./DEPLOY.md) para publicar na Vercel. O projeto configura o preset Vercel do Nitro e não exige variáveis de ambiente. Os dados gravados no `localStorage` não são compartilhados entre dispositivos; `database/schema.sql` e `database/seed.sql` são referências para uma futura integração com banco real.

## Aviso Legal

Este é um **protótipo acadêmico**. Todos os dados são fictícios e criados apenas para demonstração. O MaricáMais:

- ❌ Não processa pagamentos reais
- ❌ Não realiza transações financeiras
- ❌ Não possui integração com carteira Mumbuca
- ❌ Não é uma plataforma oficial da Prefeitura de Maricá
- ✅ O selo "Aceita Mumbuca" é apenas informação declarada pelo vendedor

## Metodologia

Desenvolvido com **Metodologia Híbrida (Scrum + DSR — Design Science Research)**:

- Sprint 1: Autenticação e gestão de anúncios
- Sprint 2: Busca, filtros e geolocalização
- Sprint 3: Leilões, ofertas e negociação
- Sprint 4: Avaliações, administração e refinamentos

## Licença

Projeto acadêmico — uso educacional.

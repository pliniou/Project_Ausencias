# Controle de Ausências (Project Ausencias)

Sistema moderno para gestão de ausências e escalas de trabalho. Interface profissional desenvolvida com React, Vite, Tailwind CSS e ShadCN UI.

![Status](https://img.shields.io/badge/status-active-success.svg)
![License](https://img.shields.io/badge/license-MIT-blue.svg)

## 🚀 Funcionalidades

- **Autenticação Local**: Login com proteção de rotas e hash de senha via `bcryptjs`
- **Armazenamento IndexedDB**: Persistência local de dados usando IndexedDB para melhor performance
- **Sistema de Permissões**: Controle granular de acesso baseado em roles (admin, user, viewer)
- **Dashboard Administrativo**: Controle total para administradores
- **Design Premium**:
  - Temas: Claro, Escuro e Sépia
  - Tipografia moderna: `Outfit` para interface limpa
  - Micro-animações e transições suaves
- **Gestão de Afastamentos**: Visualização em lista, filtros avançados e exportação (TXT e CSV)
- **Calendário Interativo**: Visualização mensal dos afastamentos

## 🛠️ Tecnologias

- **Frontend**: React 18, Vite
- **UI/UX**: Tailwind CSS, ShadCN UI, Lucide Icons
- **Database**: IndexedDB (armazenamento local) + sql.js (SQLite WASM) para usuários
- **Deploy**: GitHub Pages

## 📦 Instalação e Execução

### Pré-requisitos

- Node.js (v18+)
- npm ou bun

### Passo a Passo

1. Clone o repositório:

    ```bash
    git clone https://github.com/pliniou/Project_Ausencias.git
    cd Project_Ausencias
    ```

2. Instale as dependências:

    ```bash
    npm install
    ```

3. O WASM do SQLite é copiado automaticamente durante o build, mas você pode executar manualmente se necessário:

    ```bash
    cp node_modules/sql.js/dist/sql-wasm.wasm public/
    ```

4. Rode o servidor de desenvolvimento:

    ```bash
    npm run dev
    ```

    O app estará disponível em: `http://localhost:8080`

## 🔑 Acesso Padrão

Ao iniciar o sistema pela primeira vez, três usuários de demonstração são criados:

- **Admin**: `admin` / `demo123`
- **Usuário**: `usuario` / `demo123`
- **Visitante**: `visitante` / `demo123`

> **⚠️ IMPORTANTE**: A senha padrão é **`demo123`**. Altere imediatamente em produção!

## 🔒 Limitações de Segurança

> **Este é um aplicativo client-side estático hospedado no GitHub Pages:**
>
> - ❌ **Não há autenticação real** - validação apenas no navegador
> - ❌ **Dados são locais** - armazenados apenas no IndexedDB do navegador de cada usuário
> - ❌ **Sem compartilhamento** - dados não sincronizam entre dispositivos ou usuários
> - ❌ **Não adequado para dados sensíveis** - use apenas para demonstração ou gestão pessoal
>
> **Para uso corporativo real**: considere migrar para SharePoint com Entra ID (veja `docs/sharepoint-migration.md`)

## 🌐 Deploy no GitHub Pages

O projeto está configurado para deploy automatizado:

1. Gere o build de produção:

    ```bash
    npm run build
    ```

2. Faça o deploy:

    ```bash
    npm run deploy
    ```

3. O sistema estará acessível em: `https://pliniou.github.io/Project_Ausencias/`

## 📊 Armazenamento de Dados

- **Usuários**: SQLite (sql.js WASM) persistido em `localStorage`
- **Dados da aplicação**: IndexedDB para melhor performance e suporte a grandes volumes
- **Sessão**: `sessionStorage` (expira ao fechar a aba)
- **Migração automática**: Dados antigos em `localStorage` são migrados automaticamente para IndexedDB na primeira execução

## 🎨 Temas Disponíveis

- **Light** (Padrão): Interface clara e profissional
- **Dark**: Modo escuro com alto contraste
- **Sepia**: Modo leitura com tons quentes

## 📁 Estrutura do Projeto

```
Project_Ausencias/
├── src/
│   ├── assets/          # Imagens e resources estáticos
│   ├── auth/            # Sistema de permissões
│   ├── components/      # Componentes reutilizáveis
│   ├── context/         # Context providers (Auth, Data, Theme)
│   ├── hooks/           # Custom hooks
│   ├── lib/             # Utilidades e helpers
│   ├── pages/           # Páginas da aplicação
│   └── repositories/    # Camada de dados (IndexedDB)
├── public/              # Assets públicos
└── docs/                # Documentação adicional
```

## 🚀 Próximos Passos

Para evolução corporativa, consulte [`docs/sharepoint-migration.md`](docs/sharepoint-migration.md) para orientações sobre:

- Migração para SharePoint Online
- Integração com Entra ID (SSO)
- Uso de SharePoint Lists ou Dataverse
- Implementação de auditoria e compliance

---

**Desenvolvido com ❤️ usando React + Vite + Tailwind CSS**

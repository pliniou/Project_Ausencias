# Controle de Afastamentos (Project Ausencias)

Sistema moderno para gestão de ausências e escalas de trabalho, desenvolvido para a BBTS. Estilizado com identidade visual profissional e funcionalidades de administração robustas.

![Status](https://img.shields.io/badge/status-active-success.svg)
![License](https://img.shields.io/badge/license-MIT-blue.svg)

## 🚀 Funcionalidades

- **Autenticação Segura**: Login com proteção de rotas e hash de senha via `bcryptjs`.
- **Banco de Dados Local**: Utiliza **SQLite Client-Side (WASM)** com persistência automática no navegador.
- **Dashboard Administrativo**: Controle total para Superadmins (criar usuários, resetar senhas, vincular a funcionários).
- **Design Premium**:
  - Temas: Claro, Escuro, Sépia e **Colorido** (Novo!).
  - Tipografia moderna: `Recursive` para títulos e `Inter` para leitura.
- **Gestão de Afastamentos**: Visualização em lista ou grade, filtros avançados e exportação de relatórios.
- **Calendário Interativo**: Visualização mensal dos afastamentos.

## 🛠️ Tecnologias

- **Frontend**: React, Vite
- **UI/UX**: Tailwind CSS, ShadCN UI, Lucide Icons
- **Database**: sql.js (SQLite WASM)
- **Deploy**: GitHub Pages

## 📦 Instalação e Execução

### Pré-requisitos

- Node.js (v18+)

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

3. Copie o binário do SQLite (necessário apenas na primeira vez ou se limpar a pasta public):

    ```bash
    cp node_modules/sql.js/dist/sql-wasm.wasm public/
    ```

4. Rode o servidor de desenvolvimento:

    ```bash
    npm run dev
    ```

## 🔑 Acesso Padrão

Ao iniciar o sistema pela primeira vez, um usuário administrador é criado automaticamente:

- **Usuário**: `admin`
- **Senha**: `admin123`

> **Nota**: Recomenda-se alterar a senha imediatamente após o primeiro login.

## 🌐 Deploy no GitHub Pages

O projeto já está configurado para deploy automatizado.

1. Gere o build de produção:

    ```bash
    npm run build
    ```

2. Faça o deploy:

    ```bash
    npm run deploy
    ```

O sistema estará acessível em: `https://pliniou.github.io/Project_Ausencias/`

## 📄 Estrutura do Banco de Dados

O banco de dados é um arquivo SQLite armazenado no `IndexedDB` do navegador do usuário.
**Atenção**: Como é um deploy estático (Serverless), os dados **não são compartilhados** entre diferentes computadores. Cada usuário tem sua própria instância local dos dados.

---
Desenvolvido com ❤️ por Antigravity.

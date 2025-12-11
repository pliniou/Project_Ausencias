# Controle de Férias e Afastamentos - BBTS

Bem-vindo ao sistema **Controle de Férias e Afastamentos**, uma solução moderna desenvolvida para a BBTS gerenciar jornadas, escalas e ausências dos colaboradores de forma visual e intuitiva.

## 🚀 Funcionalidades Principais

* **Gestão Completa de Afastamentos**: Registro de férias, licenças médicas, licenças maternidade/paternidade, entre outros, com validação de datas e regras CLT.
* **Controle de Férias (CLT)**: Validação automática de períodos aquisitivos e concessivos, garantindo conformidade legal (ex: regra dos 14 dias).
* **Calendário Interativo**: Visualização mensal com distinção clara de feriados, finais de semana e períodos de afastamento.
* **Temas Visualmente Ricos**: Modos de visualização **Escuro** (padrão) e **Sépia** (conforto visual), com suporte a alto contraste.
* **Relógio de Brasília**: Exibição da hora oficial em tempo real no dashboard.
* **Exportação**: Geração de relatórios de afastamentos em formato texto (.txt).
* **Gestão de Cadastros**: Administração de Colaboradores, Feriados (Nacionais/Estaduais) e Eventos Corporativos.

## 📋 Pré-requisitos de Instalação

Para executar este projeto localmente ou realizar o build, você precisará dos seguintes softwares instalados:

### 1. Node.js (Ambiente de Execução)

* **Versão Recomendada**: v18 LTS ou superior.
* **Download Oficial**: [https://nodejs.org/pt-br/download](https://nodejs.org/pt-br/download)
* *Nota*: Ao instalar, certifique-se de marcar a opção para instalar o NPM (Node Package Manager).

### 2. Git (Controle de Versão)

* Necessário para clonar o repositório.
* **Download Oficial**: [https://git-scm.com/downloads](https://git-scm.com/downloads)

## 🛠️ Instalação e Execução

Siga os passos abaixo para rodar o projeto em sua máquina:

1. **Clone o repositório** (ou extraia os arquivos se baixou o ZIP):

    ```bash
    git clone https://seu-repositorio-url.git
    cd agenda-leave-sync
    ```

2. **Instale as dependências**:
    Abra o terminal na pasta do projeto e execute:

    ```bash
    npm install
    ```

    *Isso baixará todas as bibliotecas necessárias listadas no `package.json`.*

3. **Inicie o servidor de desenvolvimento**:
    Para ver o site rodando localmente com atualização automática:

    ```bash
    npm run dev
    ```

    Acesse o link exibido no terminal (geralmente `http://localhost:5173`).

4. **Gerar versão de produção (Build)**:
    Para criar os arquivos finais otimizados para hospedagem:

    ```bash
    npm run build
    ```

    Os arquivos serão gerados na pasta `dist/`.

## 📦 Estrutura Tecnológica

* **React 18**: Biblioteca principal para interfaces.
* **Vite**: Ferramenta de build extremamente rápida.
* **Tailwind CSS**: Framework de estilização utilitária.
* **Radix UI**: Componentes acessíveis (modais, popovers).
* **React Hook Form + Zod**: Gerenciamento e validação robusta de formulários.
* **Date-fns**: Manipulação precisa de datas.
* **Lucide React**: Ícones modernos e vetoriais.

## 🤝 Contribuição

Mantenha o padrão de código estabelecido (ESLint) e utilize os tokens de design em `src/styles/design-tokens.css` para manter a consistência visual da marca.

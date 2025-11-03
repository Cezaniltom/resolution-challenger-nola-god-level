# Dashboard de Analytics para Restaurantes (Frontend)

Este projeto é o frontend de um dashboard de analytics completo, projetado para resolver o "Problema da Maria" (o desafio de *Analytics para Restaurantes*). Ele consome uma API de backend (Node.js/Fastify/Prisma) e apresenta os dados de forma profissional, interativa e flexível.

O dashboard evoluiu de um simples relatório estático para uma ferramenta de exploração de dados, permitindo ao usuário filtrar produtos por múltiplos critérios, analisar clientes em risco (com ordenação e paginação) e obter insights acionáveis através de uma **Análise de IA (simulada)**.

![Screenshot da Visão Geral do Dashboard](https://i.imgur.com/image_03a0cf.png)
*(Sugestão: Substitua este link pela URL de um screenshot final do seu projeto, como o 'image_03a0cf.png')*

## Sumário

1.  [Abordagem e Padrões de Design](#1-abordagem-e-padrões-de-design)
2.  [Funcionalidades Implementadas](#2-funcionalidades-implementadas)
3.  [Stack Tecnológico](#3-stack-tecnológico)
4.  [Como Rodar o Projeto (Passo a Passo)](#4-como-rodar-o-projeto-passo-a-passo)
    * [Backend (API)](#backend-api)
    * [Frontend (Dashboard)](#frontend-dashboard)

---

## 1. Abordagem e Padrões de Design

O objetivo principal não era construir um dashboard *fixo*, mas sim uma ferramenta que permitisse ao usuário (Maria) **explorar os dados** e responder a novas perguntas de negócio sem depender de um desenvolvedor.

Para alcançar isso, utilizamos as seguintes abordagens:

### De Estático para Dinâmico (Client Components)

As páginas-chave ("Produtos" e "Clientes") foram implementadas como **Client Components** (`"use client";`). Isso nos permitiu usar hooks do React (`useState`, `useEffect`) para gerenciar estados de filtro, ordenação e paginação, proporcionando uma experiência de usuário interativa em tempo real.

### Backend-for-Frontend (BFF) com Filtros Dinâmicos

O frontend não consome rotas estáticas. Ele possui uma camada de API (`src/lib/api.js`) que envia um objeto de `filters` para o backend. O backend, por sua vez, foi construído para ler esses *query params* e construir queries SQL/Prisma (`$queryRaw`) dinâmicas, filtrando os dados diretamente no banco.

### Paginação e Ordenação no Backend (Server-Side)

Para a página "Clientes", que poderia conter milhares de registros, implementamos a **paginação** e a **ordenação** diretamente no **backend**. O frontend apenas envia os parâmetros (`page`, `sortKey`, `sortDirection`), e o backend aplica `LIMIT`, `OFFSET` e `ORDER BY` na query SQL. Isso é drasticamente mais performático do que buscar todos os dados e ordená-los no frontend.

### A Funcionalidade de "Análise IA" (Simulação Inteligente)

Para fornecer "insights acionáveis" (um requisito chave do desafio), adicionamos um botão de "Análise Rápida (IA)".

* **Não é uma API Externa:** Para evitar custos e complexidade com chaves de API, a "IA" é uma **simulação inteligente** (`src/components/analytics/AiAnalysisModal.jsx`).
* **Consciente do Contexto:** O modal de IA recebe a página atual (`page="products"`) e os dados (`dashboardData`) como props.
* **Insights Pré-escritos:** Uma função `runAiAnalysis` usa lógica condicional (`if (page === 'products')`) para analisar os dados recebidos e retornar insights relevantes e pré-escritos, simulando uma análise real.

### UI/UX Profissional e Resolução de Bugs

* **Design "Bankio":** Adotamos um layout inspirado na referência (um card branco único por seção, em um fundo cinza `bg-gray-100`).
* **Sidebar Colapsável:** A sidebar foi refatorada em seu próprio componente e agora pode ser expandida (`w-60`) ou recolhida (`w-20`), com os ícones e o logo se ajustando.
* **Carregamento Suave:** Para evitar o "piscar" da tabela ao aplicar filtros, usamos o `@headlessui/react` para criar uma `<Transition>`. A tabela antiga fica com `opacity-50` enquanto um *spinner* (`Loader2`) aparece suavemente por cima.
* **Resolução de Problemas:** Durante o desenvolvimento, resolvemos dois problemas críticos:
    1.  **CORS:** O backend Fastify foi atualizado com `@fastify/cors` para permitir requisições `fetch` do frontend (`localhost:3000`), que é um Client Component.
    2.  **Cache do Next.js:** O frontend estava exibindo dados antigos. Corrigimos isso adicionando `{ cache: 'no-store' }` ao nosso `fetcher` em `api.js`, forçando o Next.js a sempre buscar os dados mais recentes.

## 2. Funcionalidades Implementadas

* **Visão Geral:**
    * KPIs principais (Faturamento, Pedidos, Ticket Médio).
    * Gráfico de Barras: Faturamento por Canal.
    * Gráfico de Pizza: Faturamento por Loja (Top 10).
    * Lista: Top 5 Produtos (por Quantidade).
    * Gráfico de Linha: Tempo Médio de Entrega por Hora.

* **Página de Produtos:**
    * Filtros dinâmicos que chamam a API:
        * Canal
        * Dia da Semana
        * Horário (Manhã, Tarde, Noite)
        * Período (Data Início / Fim)
    * Overlay de carregamento suave com transição.

* **Página de Clientes:**
    * Filtros dinâmicos: Frequência Mínima (ex: 3+, 20+, 40+ vezes) e Recência (30, 60, 90 dias).
    * Ordenação da tabela via backend (clicando nos cabeçalhos).
    * Controles de Paginação (Próximo/Anterior) via backend.

* **Funcionalidades Globais:**
    * Sidebar colapsável com logo e ícones (`lucide-react`).
    * Botão de **Análise Rápida (IA)** em todas as páginas, abrindo um modal com insights simulados e contextuais.

## 3. Stack Tecnológico

### Frontend (Este Repositório)

* **Framework:** Next.js 16+ (App Router)
* **Linguagem:** JavaScript (JSX)
* **Estilização:** Tailwind CSS
* **Gráficos:** `recharts` (Bar, Pie, Line)
* **UI/Componentes:** `@headlessui/react` (Transições, Modais)
* **Ícones:** `lucide-react`
* **Gerenciador de Pacotes:** `yarn`

### Backend (Repositório Separado)

* **Runtime:** Node.js
* **Framework:** Fastify
* **Banco de Dados:** PostgreSQL
* **ORM:** Prisma (usando `$queryRaw` para queries de analytics)
* **CORS:** `@fastify/cors`

---

## 4. Como Rodar o Projeto (Passo a Passo)

Para rodar este projeto, você precisará ter o **Frontend** (este repositório) e o **Backend** (sua API Fastify/Prisma) rodando simultaneamente.

### Pré-requisitos

* Node.js (v18+)
* Yarn (ou `npm`)
* Um servidor PostgreSQL rodando com os dados do desafio

---

### Backend (API)

1.  **Clone o repositório do backend:**
    ```bash
    git clone [Link para o seu backend]
    cd challenger-backend
    ```

2.  **Instale as dependências:**
    ```bash
    yarn install
    ```

3.  **Configure as Variáveis de Ambiente:**
    * Crie um arquivo `.env` na raiz do backend.
    * Adicione sua string de conexão do PostgreSQL e a porta da API.
    ```.env
    DATABASE_URL="postgresql://SEU_USER:SUA_SENHA@localhost:5432/SUA_DATABASE"
    API_PORT=3001
    ```

4.  **Execute as Migrações do Prisma:**
    ```bash
    npx prisma migrate dev
    ```
    *(Se necessário, execute seu script de 'seed' para popular o banco)*

5.  **Inicie o servidor backend:**
    ```bash
    yarn dev
    ```
    *O backend deve estar rodando em `http://localhost:3001`.*

---

### Frontend (Dashboard)

1.  **Clone este repositório:**
    ```bash
    git clone [Link para este repositório frontend]
    cd challenger-frontend
    ```

2.  **Instale as dependências:**
    ```bash
    yarn install
    ```

3.  **Configure as Variáveis de Ambiente:**
    * Crie um arquivo `.env.local` na raiz do frontend.
    * Aponte para a URL da sua API backend.
    ```.env.local
    NEXT_PUBLIC_API_URL=http://localhost:3001
    ```

4.  **Inicie o servidor frontend:**
    ```bash
    yarn dev
    ```
    *Abra [http://localhost:3000](http://localhost:3000) no seu navegador.*
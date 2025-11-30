# Super Chat - API 

Este projeto é o servidor de aplicação que fundamenta um sistema de chat em tempo real. Foi construído utilizando o **AdonisJS v6**, um framework robusto de Node.js, e segue as melhores práticas de arquitetura para garantir escalabilidade e manutenção.

O Back-end é responsável por toda a lógica de negócio, persistência de dados e o gerenciamento da comunicação em tempo real via WebSockets.

---

## 💻 Funcionalidades Principais

O servidor implementa um conjunto completo de recursos para gerenciar usuários e salas de chat.

### 1. Autenticação e Gestão de Usuários

Utiliza **Access tokens** para autenticação de sessões seguras e stateless.

* **Registro de Usuários:** Criação de novas contas.
* **Login:** Autenticação e emissão do token.
* **Perfil:** Recuperação dos dados do usuário autenticado.

### 2. Gestão de Salas (Rooms)

Lógica de CRUD (Create, Read, Update, Delete), com regras de permissão bem definidas.

* **Criação de Salas:** O usuário é automaticamente definido como dono (owner) e primeiro membro.
* **Exclusão de Salas:** Permissão restrita apenas ao **dono da sala**.
* **Entrada/Saída de Salas:** Mecanismos para usuários se juntarem a salas disponíveis (`join`) ou se retirarem (`leave`).
* **Listagem Condicional:** Separação entre salas das quais o usuário é membro (`/my-rooms`) e salas disponíveis para entrada (`/rooms`).

### 3. Comunicação em Tempo Real (Socket.io)

O servidor integra e gerencia o **Socket.io**, permitindo a troca instantânea de mensagens entre os membros de uma sala.

* **Canais de Sala:** Clientes se conectam a canais específicos (`join_room`), garantindo que a mensagem seja entregue apenas aos membros da sala.
* **Mensageria:** Recebimento e persistência de novas mensagens, seguido de um broadcast em tempo real para o canal da sala.

---

## 🛠️ Stack Tecnológica

| Componente | Tecnologia | Observações |
| :--- | :--- | :--- |
| **Framework** | **AdonisJS v6** | Framework MVC robusto para Node.js. |
| **Linguagem** | **Node.js** | Ambiente de execução. |
| **Banco de Dados** | **PostgreSQL** | Persistência de dados (gerenciado via Docker). |
| **Cache/Sessão** | **Redis** | Usado para gerenciamento de cache e/ou sessões de socket.io. |
| **Tempo Real** | **Socket.io** | Protocolo de WebSockets. |
| **Gerenciador** | `npm` | Gerenciador de pacotes do Node.js. |

---

## 📁 Estrutura de Diretórios

O projeto segue a arquitetura **MVC (Model-View-Controller)** e a convenção de módulos do AdonisJS, garantindo um código organizado e escalável.

| Diretório | Propósito | Observações |
| :--- | :--- | :--- |
| **`app/Controllers`** | Controles da API (Ações) | Contém a lógica de negócio principal para endpoints HTTP. |
| **`app/Models`** | Modelos de Dados | Classes que definem a estrutura e relacionamentos com o PostgreSQL. |
| **`database/migrations`** | Migrações do Banco | Arquivos para gerenciar o schema do banco de dados. |
| **`start/routes.ts`** | Definição de Rotas | Mapeamento de todos os endpoints RESTful para os Controles. |
| **`start/socket.ts`** | Configuração do Socket | Inicialização e handlers para os eventos do Socket.io. |
| **`app/Validators`** | Validação de Dados | Regras de validação para dados de entrada (input) em rotas críticas. |
| **`config/`** | Configurações Gerais | Arquivos de configuração de serviços (DB, Redis, Auth, CORS). |

---

## ⚙️ Configuração e Execução Local

### 1. Pré-requisitos

Para executar o Back-end, você precisa ter instalado:
* [**Node.js**](https://nodejs.org/en/) (v22+ LTS)
* **Docker** e **Docker Compose**
* **npm**

### 2. Variáveis de Ambiente (`.env.example`)

Crie um arquivo `.env` na raiz do projeto, utilizando o `env.example` como base.

| Chave | Descrição | Valor Padrão/Exemplo |
| :--- | :--- | :--- |
| **`TZ`** | Fuso horário da aplicação. | `UTC` |
| **`PORT`** | Porta de execução do servidor. | `3333` |
| **`HOST`** | Host de ligação da aplicação. | `0.0.0.0` |
| **`APP_KEY`** | Chave secreta de segurança do AdonisJS (obrigatória). | Gerada via `node ace generate:key` |
| **`NODE_ENV`** | Ambiente de execução. | `development` |
| **`FRONTEND_URL`** | URL do Front-end (necessário para CORS). | `http://localhost:5173` |
| **`DB_HOST`** | Host do PostgreSQL (Nome do serviço no Docker). | `db` |
| **`DB_PORT`** | Porta interna do PostgreSQL. | `5432` |
| **`REDIS_HOST`** | Host do Redis (Nome do serviço no Docker). | `redis` |
| **`REDIS_PORT`** | Porta interna do Redis. | `6379` |
| **`REDIS_PASSWORD`** | Senha do Redis | `sua_senha` |
| **`DB_USER/DB_PASSWORD/DB_DATABASE`** | Credenciais do PostgreSQL. | Definidas no `docker-compose.yml` |

### 3. Inicialização dos Containers (PostgreSQL e Redis)

O banco de dados e o cache são inicializados via **Docker Compose**.

```bash
docker-compose up -d
```

### 4. Instalação e Configuração da Aplicação Node

#### 1. Instalação de Dependências

```bash
npm install
```

#### 2. Gerar Chave de Aplicação (APP_KEY):

```bash
node ace generate:key
```

#### 3. Executar Migrações do Banco: Cria as tabelas no PostgreSQL:

```bash
node ace migration:run
```

### 3. Execução do Servidor

```bash
npm run dev
```
O servidor estará rodando em: http://localhost:3333

---

## 🌐 Uso e Testes
Após a execução, você pode interagir com a API utilizando o Front-end (http://localhost:5173) ou testando diretamente os endpoints via ferramentas como Insomnia ou Postman.

---

## 🚀 Próximos Passos e Otimizações Futuras

Caso o escopo do projeto seja expandido, as seguintes melhorias e otimizações seriam priorizadas para aumentar a robustez, segurança, experiência do usuário e qualidade do código:

---

#### 1. Arquitetura e Segurança

**Modelo de Permissão e Autorização (ACL):**
- Implementar um sistema de Autorização e Controle de Acesso (ACL) granular para definir explicitamente o que cada perfil de usuário (Membro, Administrador da Sala, Proprietário) pode ou não fazer.
- Restringir funcionalidades críticas (ex: banir, mutar, alterar configurações da sala) baseando-se em papéis explícitos, não apenas no `ownerId`.

**Gerenciamento de Transações (Atomicidade):**
- Refatorar operações complexas de banco de dados (ex: criação de sala, operações em massa) para utilizar transações atômicas.
- Garantir que um conjunto de operações só seja efetivado se todas forem bem-sucedidas, prevenindo persistência de dados parciais ou inconsistentes em caso de falha.

**Melhoria da Hierarquia de Grupos e Papéis:**
- Evoluir a gestão de salas para permitir múltiplos perfis de administradores por grupo.
- Desacoplar o papel de administração do `ownerId` (criador).

---

#### 2. Qualidade e Retorno da API

**Padronização de Respostas da API:**
- Implementar um padrão unificado para retornos de sucesso e falha da API.
- Garantir uso consistente de códigos de status HTTP e mensagens de erro descritivas.
- Exemplo: payload detalhado para erros de validação, tratamento específico para erros `401`, `403`, `404`.

---

#### 3. Funcionalidades do Chat e UX

**Notificações em Tempo Real:**
- Ativar sistema de notificação por eventos (baseado na estrutura pré-existente no back-end), como menções (`@nome`), reações ou mensagens não lidas.
- Utilizar WebSockets para entregar notificações de forma assíncrona.

**Recursos de Mensageria Enriquecida:**
- Expandir o modelo de mensagens para suportar conteúdo complexo:
  - **Markdown:** Formatação de texto.
  - **Embeds/Previews:** Pré-visualizações ricas para links (Open Graph/oEmbed).
  - **Mídia:** Suporte a upload e exibição de imagens ou anexos.
- Implementar ciclo de vida completo da mensagem: edição e exclusão por parte do autor.

**Responsividade e Acessibilidade do Layout (Front-end):**
- Garantir que o layout do Front-end se ajuste perfeitamente a diferentes tamanhos de tela (desktop, tablet, mobile).
- Otimizar a experiência do usuário em todos os dispositivos.

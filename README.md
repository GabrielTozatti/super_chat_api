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
| **`LOG_LEVEL`** | Nivel de log gerado. | `info` |
| **`APP_KEY`** | Chave secreta de segurança do AdonisJS (obrigatória). | Gerada via `node ace generate:key` |
| **`NODE_ENV`** | Ambiente de execução. | `development` |
| **`FRONTEND_URL`** | URL do Front-end (necessário para CORS). | `http://localhost:5173` |
| **`DB_HOST`** | Host do PostgreSQL | `0.0.0.0` |
| **`DB_PORT`** | Porta interna do PostgreSQL. | `5432` |
| **`DB_USER`** | Usuário do PostgreSQL | `root` |
| **`DB_PASSWORD`** | Senha do PostgreSQL | `root` |
| **`DB_DATABASE`** | Nome dp Database | `sua_senha` |
| **`REDIS_HOST`** | Host do Redis (Nome do serviço no Docker). | `0.0.0.0` |
| **`REDIS_PORT`** | Porta interna do Redis. | `6379` |
| **`REDIS_PASSWORD`** | Senha do Redis (opcional). | `sua_senha` |

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

## 🐱‍🏍 O que eu faria se tivesse mais tempo

### Melhorias planejadas

- **Sistema de permissões completo**, definindo regras claras sobre o que cada usuário pode ou não fazer.
- **Hierarquia de grupos aprimorada**, permitindo múltiplos administradores por sala (hoje ligado apenas ao criador).
- **Padronização dos retornos da API**, tornando respostas e erros mais consistentes.
- **Uso de transações no banco de dados** para evitar inserções indevidas caso algum passo falhe.
- **Finalizar o sistema de notificações em tempo real** (estrutura inicial já criada).
- **Implementar mensagens enriquecidas:**
  - Upload de imagens
  - Previews de links
  - Suporte a Markdown
  - Edição e exclusão de mensagens

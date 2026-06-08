# 🍽️ Sistema de Reservas para Restaurante

API REST desenvolvida em Node.js para gerenciamento de usuários e reservas de restaurante, utilizando autenticação JWT, criptografia de senhas com BCrypt e banco de dados MySQL através do Sequelize.

---

## 🚀 Tecnologias Utilizadas

* Node.js
* Express
* MySQL
* Sequelize ORM
* JWT (JSON Web Token)
* BCrypt
* Dotenv
* Cors

---

## 📁 Estrutura do Projeto

```bash
.
├── server.js
├── .env
├── package.json
└── node_modules
```

---

## ⚙️ Configuração do Ambiente

Crie um arquivo `.env` na raiz do projeto:

```env
PORT=3000

DB_HOST=
DB_PORT=
DB_NAME=
DB_USER=
DB_PASSWORD=

JWT_SECRET=
```

---

## 📦 Instalação

Clone o projeto:

```bash
git clone https://github.com/seu-usuario/restaurante-api.git
```

Entre na pasta:

```bash
cd restaurante-api
```

Instale as dependências:

```bash
npm install
```

Execute o projeto:

```bash
npm start
```

Servidor disponível em:

```bash
http://localhost:3000
```

---

# 🔐 Autenticação

A API utiliza JWT para proteger rotas privadas.

Após o login, envie o token no cabeçalho:

```http
Authorization: Bearer SEU_TOKEN
```

---

# 👤 Usuários

## Cadastro

### POST `/cadastro`

### Body

```json
{
  "nome": "João Silva",
  "email": "joao@email.com",
  "senha": "123456"
}
```

### Resposta

```json
{
  "mensagem": "Usuário criado com sucesso",
  "usuario": {
    "id": 1,
    "nome": "João Silva",
    "email": "joao@email.com"
  }
}
```

---

## Login

### POST `/login`

### Body

```json
{
  "email": "joao@email.com",
  "senha": "123456"
}
```

### Resposta

```json
{
  "mensagem": "Login realizado",
  "token": "jwt_token",
  "usuario": {
    "id": 1,
    "nome": "João Silva",
    "email": "joao@email.com"
  }
}
```

---

# 👤 Perfil do Usuário

## GET `/perfil`

### Headers

```http
Authorization: Bearer TOKEN
```

### Resposta

```json
{
  "id": 1,
  "nome": "João Silva",
  "email": "joao@email.com"
}
```

---

# 📅 Reservas

## Criar Reserva

### POST `/reservas`

### Headers

```http
Authorization: Bearer TOKEN
```

### Body

```json
{
  "data": "2026-06-10",
  "horario": "20:00",
  "numeroPessoas": 4,
  "email": "cliente@email.com",
  "telefone": "(31)99999-9999",
  "observacao": "Mesa próxima à janela"
}
```

### Resposta

```json
{
  "mensagem": "Reserva criada",
  "reserva": {
    "id": 1,
    "data": "2026-06-10",
    "horario": "20:00",
    "numeroPessoas": 4
  }
}
```

---

## Listar Reservas do Usuário

### GET `/reservas`

### Headers

```http
Authorization: Bearer TOKEN
```

### Resposta

```json
[
  {
    "id": 1,
    "data": "2026-06-10",
    "horario": "20:00",
    "numeroPessoas": 4,
    "email": "cliente@email.com",
    "telefone": "(31)99999-9999",
    "observacao": "Mesa próxima à janela"
  }
]
```

---

# 🗄️ Banco de Dados

## Tabela Usuarios

| Campo | Tipo    |
| ----- | ------- |
| id    | INT     |
| nome  | VARCHAR |
| email | VARCHAR |
| senha | VARCHAR |

---

## Tabela Reservas

| Campo         | Tipo    |
| ------------- | ------- |
| id            | INT     |
| data          | DATE    |
| horario       | VARCHAR |
| numeroPessoas | INT     |
| email         | VARCHAR |
| telefone      | VARCHAR |
| observacao    | TEXT    |
| UsuarioId     | INT     |

---

# 🔒 Segurança

* Senhas criptografadas com BCrypt.
* Autenticação via JWT.
* Rotas protegidas por middleware.
* Validação básica de autenticação.
* Relacionamento Usuário → Reservas.

---

# 📌 Funcionalidades

✅ Cadastro de usuários

✅ Login com JWT

✅ Perfil do usuário autenticado

✅ Criação de reservas

✅ Listagem de reservas por usuário

✅ Banco de dados MySQL

✅ ORM Sequelize

---

# 👨‍💻 Autor

Desenvolvido para gerenciamento de reservas de restaurante utilizando Node.js, Express e MySQL.

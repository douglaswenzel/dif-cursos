﻿# Cursos Online DIF

Este projeto foi desenvolvido por alunos da Faculdade de Tecnologia de Votorantim, ministrado pelo Professor Mestre Ricardo Leme através da disciplina Banco de Dados Não Relacional do curso Desenvolvimento de Software Multiplataforma, turma do 3 Semestre de 2025.

## Alunos

- Douglas Wenzel
- Fernando Chibli
- Isabel Maito

## O Projeto

Este projeto se refere à uma API RESTful de administração de cursos online onde há um sistema de armazenamento de cursos. Essa API foi desenvolvida em Node e MongoDB para estocagem de criação de novos cursos e atualizações.

### Vercel Live Demo

[Link da API no Vercel](https://dif-cursos.vercel.app)

### Estrutura do projeto

```bash
dif-cursos/                         # Raiz do projeto
│
├── api/                            # Código-fonte da API backend
│   ├── controllers/                # Controladores da API
│   │   ├── cursosController.ts     # Lógica de controle dos cursos
│   │   ├── usuariosController.ts   # Lógica de controle dos usuários
│   ├── interfaces/                 # Interfaces TypeScript
│   │   ├── authentication.ts       # Interface de autenticação
│   │   ├── token.ts                # Interface de token JWT
│   ├── middlewares/                # Middlewares da API
│   │   ├── authMiddleware.ts       # Middleware de autenticação
│   │   ├── validationMiddleware.ts # Middleware de validação
│   ├── routes/                     # Rotas da API
│   │   ├── cursoRoutes.ts          # Definição das rotas de cursos
│   │   ├── usuarioRoutes.ts        # Definição das rotas de usuários
│   ├── db.ts                       # Conexão com o banco de dados MongoDB
│   ├── server.ts                   # Servidor Express e rotas da API
│   ├── swagger.ts                  # Documentação Swagger da API
│   └── types.ts                    # Tipos TypeScript usados na API
│
├── public/                         # Arquivos estáticos do frontend
│   ├── apiClient.ts                # Cliente API para chamadas REST
│   ├── cadastro.html               # Página de cadastro HTML
│   ├── cadastro.js                 # Lógica JavaScript do cadastro
│   ├── cursos.html                 # Página de listagem de cursos HTML
│   ├── index.html                  # Página principal HTML
│   ├── login.html                  # Página de login HTML
│   ├── script.js                   # Lógica JavaScript do frontend
│   └── style.css                   # Estilos CSS do frontend
│
├── .env_example                    # Exemplo de arquivo .env a ser copiado para .env
├── .env                            # Variáveis de ambiente (não versionado)
├── .gitignore                      # Arquivos e pastas ignorados pelo Git
├── .prettierrc                     # Configuração do Prettier
├── package.json                    # Configurações e dependências do Node.js
├── README.md                       # Documentação do projeto
├── tsconfig.json                   # Configuração do TypeScript
└── vercel.json                     # Configuração de deploy na Vercel
```

## Stacks

![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)
![Javascript](https://img.shields.io/badge/JavaScript-323330?style=for-the-badge&logo=javascript&logoColor=F7DF1E)
![Typescript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Express](https://img.shields.io/badge/Express%20js-000000?style=for-the-badge&logo=express&logoColor=white)
![Node](https://img.shields.io/badge/Node%20js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Vercel](https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)

# Chamadas REST

## Usuários

### POST /api/usuarios/register

Registra um novo usuário.

**Body (JSON):**

- `nome` (string, obrigatório): Nome do usuário
- `email` (string, obrigatório): Email do usuário
- `senha` (string, obrigatório): Senha do usuário
- `ativo` (boolean, opcional): Status do usuário
- `tipo` (string, opcional): Tipo de usuário (Cliente ou Admin)
- `avatar` (string, opcional): URL do avatar do usuário

**Resposta:**

- 201: Usuário criado com sucesso
- 400: Erro de validação

### POST /api/usuarios/login

Efetua login de usuário.

**Body (JSON):**

- `email` (string, obrigatório): Email do usuário
- `senha` (string, obrigatório): Senha do usuário

**Resposta:**

- 200: Login bem-sucedido (retorna token JWT)
- 403: Credenciais inválidas
- 500: Erro ao efetuar login

## Cursos

### GET /api/cursos

Retorna todos os cursos cadastrados.

**Autenticação:** Bearer Token

**Resposta:**

- 200: Array de cursos
- 500: Erro ao buscar cursos

### GET /api/cursos/search?busca=...

Busca rápida de cursos por título, instrutor ou categoria.

**Autenticação:** Bearer Token

**Query Params:**

- `busca` (string, opcional): termo de busca

**Resposta:**

- 200: Array de cursos encontrados
- 500: Erro na busca

### GET /api/cursos/search/advanced

Busca avançada de cursos com múltiplos filtros.

**Autenticação:** Bearer Token

**Query Params (todos opcionais):**

- `minPreco` (number): Preço mínimo
- `maxPreco` (number): Preço máximo
- `categoria` (string): Categorias (separadas por vírgula)
- `minDuracao` (number): Duração mínima em horas
- `minAvaliacao` (number): Avaliação mínima (0-5)

**Resposta:**

- 200: Array de cursos filtrados
- 400: Erro de validação dos filtros
- 500: Erro na busca

### GET /api/cursos/:id

Busca um curso pelo ID.

**Autenticação:** Bearer Token

**Params:**

- `id` (string): ID do curso

**Resposta:**

- 200: Objeto do curso
- 404: Curso não encontrado
- 500: Erro ao buscar curso

### POST /api/cursos

Cria um novo curso.

**Autenticação:** Bearer Token

**Body (JSON):**

- `titulo` (string, obrigatório)
- `instrutor` (string, obrigatório)
- `categoria` (string, obrigatório)
- `duracao_horas` (number, obrigatório)
- `alunos_matriculados` (number, obrigatório)
- `data_lancamento` (ISO date, obrigatório)
- `preco` (number, obrigatório)
- `modulos` (array de string, obrigatório)

**Resposta:**

- 201: Curso criado com sucesso
- 400: Erro de validação
- 500: Erro ao criar curso

### PUT /api/cursos/:id

Atualiza um curso existente.

**Autenticação:** Bearer Token

**Params:**

- `id` (string): ID do curso

**Body (JSON):**
Mesmos campos do POST.

**Resposta:**

- 200: Curso atualizado com sucesso
- 400: Erro de validação
- 404: Curso não encontrado
- 500: Erro ao atualizar curso

### DELETE /api/cursos/:id

Remove um curso pelo ID.

**Autenticação:** Bearer Token

**Params:**

- `id` (string): ID do curso

**Resposta:**

- 200: Curso excluído com sucesso
- 404: Curso não encontrado
- 500: Erro ao excluir curso

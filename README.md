# Receita FastAPI

Este é um projeto de aplicação web para gerenciamento de receitas, desenvolvido com FastAPI no backend e um frontend simples em HTML/JavaScript. O projeto utiliza Supabase como banco de dados e inclui funcionalidades de autenticação e administração.

## Motivação

Desenvolvi este projeto com o intuito de ajudar minha escola, onde este site será utilizado pelos alunos para visualizarem e aprenderem com as receitas disponíveis.

## Funcionalidades

- **Autenticação de usuários**: Login e registro de usuários.
- **Gerenciamento de receitas**: Criar, visualizar e gerenciar receitas.
- **Painel de administração**: Interface para administradores criarem e gerenciarem receitas.
- **Frontend público**: Página inicial para visualizar receitas.

## Tecnologias Utilizadas

- **Backend**: FastAPI (Python)
- **Banco de dados**: Supabase
- **Frontend**: HTML, CSS, Tailwind CSS, JavaScript
- **Autenticação**: JWT (JSON Web Tokens)

## Estrutura do Projeto

```
receita-FastAPI/
├── requirements.txt          # Dependências do Python
├── backend/
│   ├── main.py               # Ponto de entrada da aplicação FastAPI
│   ├── supabase_client.py    # Cliente para conexão com Supabase
│   ├── api/
│   │   └── routers/
│   │       ├── auth.py       # Rotas de autenticação
│   │       └── recipes.py    # Rotas de receitas
│   ├── core/
│   │   ├── auth.py           # Lógica de autenticação
│   │   └── config.py         # Configurações da aplicação
│   ├── schemas/
│   │   ├── auth_schema.py    # Esquemas Pydantic para autenticação
│   │   └── recipe_schema.py  # Esquemas Pydantic para receitas
│   └── services/
│       └── recipe_service.py # Serviços para manipulação de receitas
└── frontend/
    ├── admin/
    │   ├── create.html       # Página para criar receitas (admin)
    │   ├── dashboard.html    # Dashboard do admin
    │   └── login.html        # Página de login do admin
    ├── assets/
    │   └── admin.js          # JavaScript para o painel admin
    └── public/
        ├── app.js            # JavaScript para o frontend público
        └── index.html        # Página inicial pública
```

## Como Instalar e Executar

### Pré-requisitos

- Python 3.8 ou superior
- Conta no Supabase (para configurar o banco de dados)

### Passos para Instalação

1. **Clone o repositório**:
   ```
   git clone https://github.com/ezeepires/receita-FastAPI.git
   cd receita-FastAPI
   ```

2. **Crie um ambiente virtual**:
   ```
   python -m venv venv
   source venv/bin/activate  # No Windows: venv\Scripts\activate
   ```

3. **Instale as dependências**:
   ```
   pip install -r requirements.txt
   ```

4. **Configure o Supabase**:
   - Crie um projeto no Supabase.
   - Configure as tabelas para usuários e receitas.
   - Atualize as configurações em `.env` com suas credenciais do Supabase.

5. **Execute a aplicação**:
   ```
   cd backend
   uvicorn main:app --reload
   ```

6. **Acesse o frontend**:
   - Abra `frontend/public/index.html` no navegador para a página pública.
   - Para o admin, acesse `frontend/admin/login.html`.

## Como Usar

- **Página Pública**: Visualize as receitas disponíveis.
- **Admin**: Faça login como administrador para criar e gerenciar receitas.

## Contribuição

Sinta-se à vontade para contribuir com melhorias ou correções. Abra uma issue ou envie um pull request.

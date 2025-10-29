To-Do List Fullstack

Projeto CRUD completo de uma To-Do List, desenvolvido com React no frontend e Node.js + Express no backend. Permite criar, listar, atualizar e excluir tarefas, integrando frontend e backend via API REST e armazenando dados em JSON.

🔹 Tecnologias

Frontend: React, Vite, Tailwind CSS, Axios

Backend: Node.js, Express, CORS, Nodemon

Gerenciamento de estado: React Hooks (useState, useEffect)

Controle de versão: Git/GitHub

🔹 Funcionalidades

Adicionar novas tarefas

Editar tarefas existentes

Marcar tarefas como concluídas

Excluir tarefas

Comunicação frontend ↔ backend via API REST

🔹 Estrutura do projeto
projeto-pratica-crud/
│
├── backend/            ← Servidor Node.js + Express
│   ├── server.js
│   ├── routes/
│   ├── controllers/
│   └── tarefas.json
│
└── frontend/           ← Interface React
    ├── src/
    │   ├── components/
    │   └── App.jsx
    ├── package.json
    └── vite.config.js

🔹 Como rodar o projeto

Backend

cd backend
npm install
npm run dev


Frontend

cd frontend
npm install
npm run dev


O frontend roda geralmente no localhost
O backend roda na PORT 3000

🔹 Scripts unificados (opcional)

Se configurado na raiz do projeto, é possível rodar frontend e backend juntos:

npm run dev


Usando concurrently para executar os dois servidores simultaneamente.

Projeto ideal para estudar CRUD, API REST e integração fullstack

Pode ser facilmente expandido para usar banco de dados ou autentic

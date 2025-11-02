# 📝 To-Do List — Projeto Prático CRUD

> Um aplicativo moderno de gerenciamento de tarefas desenvolvido com **React**, **Vite**, **TailwindCSS** e integração com backend em **Node.js / Express**.

---

## 🌟 Visão Geral

Este projeto foi desenvolvido como parte do aprendizado em **Desenvolvimento Fullstack**, com o objetivo de praticar conceitos fundamentais de **CRUD (Create, Read, Update, Delete)**, **componentização em React**, **estilização com Tailwind**, e **integração com APIs**.

A aplicação permite que o usuário crie, visualize, atualize e exclua tarefas, mantendo uma interface elegante e responsiva.

---

## 🚀 Funcionalidades

- ✅ **Criar tarefas** com título e descrição.  
- 🗂️ **Listar todas as tarefas** cadastradas no sistema.  
- ✏️ **Editar tarefas existentes** com atualização instantânea.  
- ❌ **Excluir tarefas** individualmente.  
- 🧭 **Filtrar tarefas concluídas e pendentes**.  
- 🧹 **Limpeza automática** da descrição quando não houver tarefas listadas.  
- 💅 **Interface moderna** com TailwindCSS e modo escuro.

---

## 🧱 Estrutura do Projeto

```bash
frontend/
│
├── src/
│   ├── components/
│   │   ├── TarefaForm.jsx        # Formulário para criar/editar tarefas
│   │   ├── TarefaList.jsx        # Lista de tarefas
│   │   ├── TarefaDescricao.jsx   # Exibe descrição da tarefa selecionada
│   │
│   ├── services/
│   │   └── api.js                # Configuração e integração com backend
│   │
│   ├── App.jsx                   # Componente principal
│   ├── main.jsx                  # Ponto de entrada da aplicação
│   ├── index.css                 # Configuração do Tailwind
│   ├── App.css                   # Estilos adicionais (customização)
│
├── tailwind.config.js            # Configuração do Tailwind
├── postcss.config.js             # Configuração do PostCSS
├── package.json
│
└── ...

| Tecnologia                  | Descrição                                        |
| --------------------------- | ------------------------------------------------ |
| ⚛️ **React.js (Vite)**      | Biblioteca para construção da interface.         |
| 💨 **TailwindCSS**          | Framework utilitário de CSS para design moderno. |
| 🌐 **Axios**                | Cliente HTTP para integração com o backend.      |
| 🖥️ **Node.js / Express**   | API backend responsável pelo CRUD.               |
| 🧠 **useState / useEffect** | Hooks para controle de estado e efeitos.         |

⚙️ Como Executar o Projeto
🔧 Pré-requisitos

Node.js instalado (v18+)

NPM ou Yarn

🪄 Passo a passo

1 - Clonar o repositório

git clone https://github.com/seuusuario/projeto-pratica-crud.git
cd projeto-pratica-crud


2 - Instalar as dependências

cd frontend
npm install


3 - Executar o servidor frontend e backend

npm run dev

4 - Acesse no navegador

http://localhost:5173

🧠 Aprendizados

Durante o desenvolvimento deste projeto, foram reforçados conceitos importantes:

Componentização e reutilização de lógica no React.

Manipulação de estado global e local.

Comunicação com API via Axios.

Organização de pastas seguindo boas práticas de arquitetura frontend.

Aplicação de estilos modernos com TailwindCSS.

Tratamento de estados vazios e comportamentos condicionais.

🧩 Próximos Passos

🔁 Adicionar persistência com banco de dados (MongoDB ou PostgreSQL).

🔒 Implementar autenticação e controle de usuários.

🌓 Criar alternância de temas (claro/escuro).

📱 Tornar a aplicação 100% responsiva e mobile-first.

👩‍💻 Desenvolvido por

Lia Santos

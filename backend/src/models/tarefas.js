// Simulação de banco de dados em memória
let tarefas = [
  { 
    id: 1, 
    titulo: "Estudar React Hooks", 
    descricao: "Aprofundar em useState e useEffect", 
    concluida: false,
    prioridade: "media", // ✅ NOVO
    criadaEm: new Date().toISOString()
  },
  { 
    id: 2, 
    titulo: "Implementar Backend", 
    descricao: "Criar rotas da API REST", 
    concluida: true,
    prioridade: "alta", // ✅ NOVO
    criadaEm: new Date().toISOString()
  }
];

let proximoId = 3;

export default {
  // Buscar todas (ordenadas por prioridade)
  findAll: () => {
    const ordemPrioridade = { alta: 1, media: 2, baixa: 3 };
    return tarefas.sort((a, b) => {
      // Ordena por prioridade primeiro
      if (a.concluida === b.concluida) {
        return ordemPrioridade[a.prioridade] - ordemPrioridade[b.prioridade];
      }
      // Tarefas não concluídas vêm primeiro
      return a.concluida ? 1 : -1;
    });
  },

  // Buscar por ID
  findById: (id) => tarefas.find(t => t.id === parseInt(id)),

  // Criar
  create: (dados) => {
    const novaTarefa = {
      id: proximoId++,
      titulo: dados.titulo,
      descricao: dados.descricao,
      concluida: false,
      prioridade: dados.prioridade || 'media', // ✅ NOVO - padrão é média
      criadaEm: new Date().toISOString()
    };
    tarefas.push(novaTarefa);
    return novaTarefa;
  },

  // Atualizar
  update: (id, dados) => {
    const index = tarefas.findIndex(t => t.id === parseInt(id));
    if (index === -1) return null;
    
    tarefas[index] = {
      ...tarefas[index],
      ...dados,
      atualizadaEm: new Date().toISOString()
    };
    return tarefas[index];
  },

  // Deletar
  delete: (id) => {
    const index = tarefas.findIndex(t => t.id === parseInt(id));
    if (index === -1) return false;
    
    tarefas.splice(index, 1);
    return true;
  }
};
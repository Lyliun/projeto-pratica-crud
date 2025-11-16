import fs from 'fs/promises';
import { existsSync, mkdirSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dataPath = path.resolve(__dirname, '../data/tarefas.json');

// ============================================
// FUNÇÕES AUXILIARES
// ============================================

// Função para ler dados
async function lerTarefas() {
  try {
    // Criar arquivo se não existir
    if (!existsSync(dataPath)) {
      const dirPath = path.dirname(dataPath);
      if (!existsSync(dirPath)) {
        mkdirSync(dirPath, { recursive: true });
      }
      await fs.writeFile(dataPath, JSON.stringify([], null, 2));
      return [];
    }

    const data = await fs.readFile(dataPath, 'utf-8');
    
    // Tratar arquivo vazio
    if (!data || data.trim() === '') {
      return [];
    }

    try {
      return JSON.parse(data);
    } catch (parseError) {
      console.error('❌ Erro ao parsear JSON - restaurando arquivo. Erro:', parseError);
      await fs.writeFile(dataPath, JSON.stringify([], null, 2));
      return [];
    }
  } catch (error) {
    console.error('❌ Erro ao ler arquivo:', error);
    throw new Error('Erro ao ler tarefas');
  }
}

// Função para salvar dados
async function salvarTarefas(tarefas) {
  try {
    const dirPath = path.dirname(dataPath);
    if (!existsSync(dirPath)) {
      mkdirSync(dirPath, { recursive: true });
    }
    await fs.writeFile(dataPath, JSON.stringify(tarefas, null, 2));
    return true;
  } catch (error) {
    console.error('❌ Erro ao salvar arquivo:', error);
    throw new Error('Erro ao salvar tarefas');
  }
}

// ✅ Ordenar tarefas por prioridade
function ordenarPorPrioridade(tarefas) {
  const ordemPrioridade = { alta: 1, media: 2, baixa: 3 };
  
  return tarefas.sort((a, b) => {
    // Tarefas não concluídas vêm primeiro
    if (a.concluida !== b.concluida) {
      return a.concluida ? 1 : -1;
    }
    
    // Se ambas têm mesmo status, ordena por prioridade
    const prioridadeA = ordemPrioridade[a.prioridade] || 2;
    const prioridadeB = ordemPrioridade[b.prioridade] || 2;
    
    if (prioridadeA !== prioridadeB) {
      return prioridadeA - prioridadeB;
    }
    
    // Se mesma prioridade, ordena por data (mais recente primeiro)
    return new Date(b.criadaEm) - new Date(a.criadaEm);
  });
}

// ✅ Validação completa de tarefa
function validarTarefa(tarefa, ehCriacao = false) {
  const erros = [];

  // Validar título
  if (ehCriacao || tarefa.titulo !== undefined) {
    if (!tarefa.titulo || typeof tarefa.titulo !== 'string' || tarefa.titulo.trim() === '') {
      erros.push('Título da tarefa é obrigatório');
    } else if (tarefa.titulo.length > 100) {
      erros.push('Título não pode ter mais de 100 caracteres');
    }
  }
  
  // Validar descrição
  if (tarefa.descricao !== undefined) {
    if (typeof tarefa.descricao !== 'string') {
      erros.push('Descrição da tarefa deve ser uma string');
    } else if (tarefa.descricao.length > 500) {
      erros.push('Descrição não pode ter mais de 500 caracteres');
    }
  }
  
  // Validar status de conclusão
  if (tarefa.concluida !== undefined && typeof tarefa.concluida !== 'boolean') {
    erros.push('Status de conclusão deve ser um booleano');
  }

  // ✅ Validar prioridade
  if (tarefa.prioridade !== undefined) {
    const prioridadesValidas = ['baixa', 'media', 'alta'];
    if (!prioridadesValidas.includes(tarefa.prioridade)) {
      erros.push('Prioridade deve ser: baixa, media ou alta');
    }
  }

  if (erros.length > 0) {
    const error = new Error(erros.join('; '));
    error.statusCode = 400;
    throw error;
  }

  return true;
}

// ============================================
// CONTROLLERS
// ============================================

// GET /api/tarefas - Listar todas as tarefas
export async function listarTarefas(req, res, next) {
  try {
    const tarefas = await lerTarefas();
    const tarefasOrdenadas = ordenarPorPrioridade(tarefas);
    
    console.log(`✅ Listadas ${tarefas.length} tarefas`);
    res.json(tarefasOrdenadas);
  } catch (error) {
    console.error('❌ Erro ao listar tarefas:', error);
    next(error);
  }
}

// POST /api/tarefas - Criar nova tarefa
export async function criarTarefa(req, res, next) {
  try {
    const { titulo, descricao, prioridade } = req.body;

    // Criar nova tarefa
    const novaTarefa = {
      id: Date.now(),
      titulo: titulo?.trim(),
      descricao: descricao?.trim() || '',
      concluida: false,
      prioridade: prioridade || 'media', // ✅ Prioridade padrão é média
      criadaEm: new Date().toISOString()
    };

    // Validar
    validarTarefa(novaTarefa, true);
    
    // Salvar
    const tarefas = await lerTarefas();
    tarefas.push(novaTarefa);
    await salvarTarefas(tarefas);
    
    console.log(`✅ Tarefa criada: ${novaTarefa.titulo} (Prioridade: ${novaTarefa.prioridade})`);
    res.status(201).json(novaTarefa);
  } catch (error) {
    console.error('❌ Erro ao criar tarefa:', error.message);
    
    if (error.statusCode === 400) {
      res.status(400).json({ erro: error.message });
    } else {
      next(error);
    }
  }
}

// PUT /api/tarefas/:id - Atualizar tarefa
export async function atualizarTarefa(req, res, next) {
  try {
    const id = Number(req.params.id);
    
    // Validar ID
    if (isNaN(id)) {
      return res.status(400).json({ erro: 'ID inválido' });
    }

    // Validar dados da requisição
    validarTarefa(req.body, false);
    
    // Buscar e atualizar tarefa
    const tarefas = await lerTarefas();
    const tarefaIndex = tarefas.findIndex(t => t.id === id);

    if (tarefaIndex === -1) {
      return res.status(404).json({ erro: 'Tarefa não encontrada' });
    }

    // Atualizar apenas os campos enviados
    const tarefaAtualizada = {
      ...tarefas[tarefaIndex],
      ...req.body,
      titulo: req.body.titulo?.trim() || tarefas[tarefaIndex].titulo,
      descricao: req.body.descricao?.trim() ?? tarefas[tarefaIndex].descricao,
      atualizadaEm: new Date().toISOString()
    };

    tarefas[tarefaIndex] = tarefaAtualizada;
    await salvarTarefas(tarefas);
    
    console.log(`✅ Tarefa atualizada: ${tarefaAtualizada.titulo}`);
    res.json(tarefaAtualizada);
  } catch (error) {
    console.error('❌ Erro ao atualizar tarefa:', error.message);
    
    if (error.statusCode === 400) {
      res.status(400).json({ erro: error.message });
    } else {
      next(error);
    }
  }
}

// DELETE /api/tarefas/:id - Excluir tarefa
export async function excluirTarefa(req, res, next) {
  try {
    const id = Number(req.params.id);
    
    // Validar ID
    if (isNaN(id)) {
      return res.status(400).json({ erro: 'ID inválido' });
    }

    // Buscar e excluir tarefa
    const tarefas = await lerTarefas();
    const tarefaExiste = tarefas.find(t => t.id === id);

    if (!tarefaExiste) {
      return res.status(404).json({ erro: 'Tarefa não encontrada' });
    }

    const novasTarefas = tarefas.filter(t => t.id !== id);
    await salvarTarefas(novasTarefas);
    
    console.log(`✅ Tarefa excluída: ${tarefaExiste.titulo}`);
    res.status(204).send();
  } catch (error) {
    console.error('❌ Erro ao excluir tarefa:', error);
    next(error);
  }
}

// ✅ NOVO - GET /api/tarefas/estatisticas - Estatísticas das tarefas
export async function obterEstatisticas(req, res, next) {
  try {
    const tarefas = await lerTarefas();
    
    const estatisticas = {
      total: tarefas.length,
      concluidas: tarefas.filter(t => t.concluida).length,
      pendentes: tarefas.filter(t => !t.concluida).length,
      porPrioridade: {
        alta: tarefas.filter(t => t.prioridade === 'alta').length,
        media: tarefas.filter(t => t.prioridade === 'media').length,
        baixa: tarefas.filter(t => t.prioridade === 'baixa').length
      },
      taxaConclusao: tarefas.length > 0 
        ? Math.round((tarefas.filter(t => t.concluida).length / tarefas.length) * 100)
        : 0
    };
    
    console.log('✅ Estatísticas geradas');
    res.json(estatisticas);
  } catch (error) {
    console.error('❌ Erro ao obter estatísticas:', error);
    next(error);
  }
}
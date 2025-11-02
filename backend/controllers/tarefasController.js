import fs from 'fs/promises';
import { existsSync, mkdirSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dataPath = path.resolve(__dirname, '../data/tarefas.json');

// Função para ler dados
async function lerTarefas() {
  try {
    if (!existsSync(dataPath)) {
      await fs.writeFile(dataPath, JSON.stringify([], null, 2));
      return [];
    }
    const data = await fs.readFile(dataPath, 'utf-8');
    // Handle empty file or invalid JSON gracefully
    if (!data || data.trim() === '') {
      return [];
    }

    try {
      return JSON.parse(data);
    } catch (parseError) {
      console.error('Erro ao parsear JSON em tarefas.json - restaurando arquivo. Erro:', parseError);
      // Reset file to empty array to recover from corruption
      await fs.writeFile(dataPath, JSON.stringify([], null, 2));
      return [];
    }
  } catch (error) {
    console.error('Erro ao ler arquivo:', error);
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
    console.error('Erro ao salvar arquivo:', error);
    throw new Error('Erro ao salvar tarefas');
  }
}

// Validação de tarefa
function validarTarefa(tarefa) {
  if (!tarefa.titulo || typeof tarefa.titulo !== 'string' || tarefa.titulo.trim() === '') {
    throw new Error('Título da tarefa é obrigatório');
  }
  
  if (tarefa.descricao && typeof tarefa.descricao !== 'string') {
    throw new Error('Descrição da tarefa deve ser uma string');
  }
  
  if (tarefa.concluida !== undefined && typeof tarefa.concluida !== 'boolean') {
    throw new Error('Status de conclusão deve ser um booleano');
  }
}

export async function listarTarefas(req, res, next) {
  try {
    const tarefas = await lerTarefas();
    res.json(tarefas);
  } catch (error) {
    next(error);
  }
}

export async function criarTarefa(req, res, next) {
  try {
    const novaTarefa = {
      id: Date.now(),
      titulo: req.body.titulo,
      descricao: req.body.descricao || '',
      concluida: false,
      criadaEm: new Date().toISOString()
    };

    validarTarefa(novaTarefa);
    
    const tarefas = await lerTarefas();
    tarefas.push(novaTarefa);
    await salvarTarefas(tarefas);
    
    res.status(201).json(novaTarefa);
  } catch (error) {
    if (error.message === 'Título da tarefa é obrigatório') {
      res.status(400).json({ erro: error.message });
    } else {
      next(error);
    }
  }
}

export async function atualizarTarefa(req, res, next) {
  try {
    const id = Number(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ erro: 'ID inválido' });
    }

    validarTarefa(req.body);
    
    const tarefas = await lerTarefas();
    const tarefaIndex = tarefas.findIndex(t => t.id === id);

    if (tarefaIndex === -1) {
      return res.status(404).json({ erro: 'Tarefa não encontrada' });
    }

    const tarefaAtualizada = {
      ...tarefas[tarefaIndex],
      ...req.body,
      atualizadaEm: new Date().toISOString()
    };

    tarefas[tarefaIndex] = tarefaAtualizada;
    await salvarTarefas(tarefas);
    
    res.json(tarefaAtualizada);
  } catch (error) {
    if (error.message.includes('é obrigatório') || error.message.includes('deve ser')) {
      res.status(400).json({ erro: error.message });
    } else {
      next(error);
    }
  }
}

export async function excluirTarefa(req, res, next) {
  try {
    const id = Number(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ erro: 'ID inválido' });
    }

    const tarefas = await lerTarefas();
    const tarefaExiste = tarefas.some(t => t.id === id);

    if (!tarefaExiste) {
      return res.status(404).json({ erro: 'Tarefa não encontrada' });
    }

    const novasTarefas = tarefas.filter(t => t.id !== id);
    await salvarTarefas(novasTarefas);
    
    res.status(204).send();
  } catch (error) {
    next(error);
  }
}
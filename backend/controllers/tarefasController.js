import fs from "fs";
import path from "path";

const dataPath = path.resolve("./data/tarefas.json");

// Função para ler dados
function lerTarefas() {
  const data = fs.readFileSync(dataPath, "utf-8");
  return JSON.parse(data);
}

// Função para salvar dados
function salvarTarefas(tarefas) {
  fs.writeFileSync(dataPath, JSON.stringify(tarefas, null, 2));
}

export function listarTarefas(req, res) {
  const tarefas = lerTarefas();
  res.json(tarefas);
}

export function criarTarefa(req, res) {
  const tarefas = lerTarefas();
  const novaTarefa = {
    id: Date.now(),
    titulo: req.body.titulo,
    descricao: req.body.descricao || '',
    concluida: false
  };
  tarefas.push(novaTarefa);
  salvarTarefas(tarefas);
  res.status(201).json(novaTarefa);
}

export function atualizarTarefa(req, res) {
  const tarefas = lerTarefas();
  const id = Number(req.params.id);
  const tarefaIndex = tarefas.findIndex(t => t.id === id);

  if (tarefaIndex === -1)
    return res.status(404).json({ mensagem: "Tarefa não encontrada" });

  tarefas[tarefaIndex] = { ...tarefas[tarefaIndex], ...req.body };
  salvarTarefas(tarefas);
  res.json(tarefas[tarefaIndex]);
}

export function excluirTarefa(req, res) {
  const tarefas = lerTarefas();
  const id = Number(req.params.id);
  const novasTarefas = tarefas.filter(t => t.id !== id);
  salvarTarefas(novasTarefas);
  res.status(204).send();
}
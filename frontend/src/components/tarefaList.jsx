import { api } from "../services/api";

function TarefaList({ tarefas, atualizarLista }) {
  const deletarTarefa = async (id) => {
    await api.delete(`/tarefas/${id}`);
    atualizarLista();
  };

  const marcarConcluida = async (id, tarefa) => {
    await api.put(`/tarefas/${id}`, {
      ...tarefa,
      concluida: !tarefa.concluida
    });
    atualizarLista();
  };

  return (
    <ul>
      {tarefas.map((tarefa) => (
        <li key={tarefa.id}>
          <strong style={{ textDecoration: tarefa.concluida ? "line-through" : "none" }}>
            {tarefa.titulo}
          </strong>
          <p>{tarefa.descricao}</p>
          <button onClick={() => marcarConcluida(tarefa.id, tarefa)}>
            {tarefa.concluida ? "Desmarcar" : "Concluir"}
          </button>
          <button onClick={() => deletarTarefa(tarefa.id)}>Excluir</button>
        </li>
      ))}
    </ul>
  );
}

export default TarefaList;
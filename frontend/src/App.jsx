import { useEffect, useState } from "react";
import { api } from "./services/api";
import TarefaForm from "./components/TarefaForm";
import TarefaList from "./components/TarefaList";

function App() {
  const [tarefas, setTarefas] = useState([]);

  // Carrega tarefas do backend
  const carregarTarefas = async () => {
    const response = await api.get("/tarefas");
    setTarefas(response.data);
  };

  useEffect(() => {
    carregarTarefas();
  }, []);

  return (
    <div style={{ padding: "2rem" }}>
      <h1>📝 To-Do List CRUD</h1>
      <TarefaForm atualizarLista={carregarTarefas} />
      <TarefaList tarefas={tarefas} atualizarLista={carregarTarefas} />
    </div>
  );
}

export default App;
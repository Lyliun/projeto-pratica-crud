import { useState } from "react";
import { api } from "../services/api";

function TarefaForm({ atualizarLista }) {
    const [titulo, setTitulo] = useState("");
    const [descricao, setDescricao] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        await api.post("/tarefas", { titulo, descricao });
        setTitulo("");
        setDescricao("");
        atualizarLista();
    };

    return (
        <form onSubmit={handleSubmit}>
            <input
            type="text"
            placeholder="Titulo"
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
            required
            />
            <input
            type="titulo"
            placeholder="Descrição"
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
            required
            />
            <button type="submmit" >Adicionar uma Tarefa</button>
        </form>
    );
}

export default TarefaForm;
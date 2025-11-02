import React from "react";
import TarefaItem from "./tarefaItem";

function TarefaLista({ tarefas, onToggle, onDelete, onSelect }) {
  if (!tarefas || tarefas.length === 0) {
    return (
      <div className="w-full flex justify-center mt-6">
        <div
          role="alert"
          className="max-w-xl w-full mx-4 bg-yellow-50/90 backdrop-blur-sm text-yellow-900 rounded-full px-6 py-4 shadow-2xl border border-yellow-200 flex items-center gap-4"
        >
          <div className="flex-shrink-0">
            <div className="w-12 h-12 flex items-center justify-center rounded-full bg-yellow-400 text-yellow-900 text-2xl shadow-md">⚠️</div>
          </div>

          <div className="text-left">
            <div className="text-lg font-semibold">Any Task Found</div>
            <div className="text-sm text-yellow-800/90">There are currently no tasks. Add a new task to get started.</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {tarefas.map((tarefa) => (
        <div
          key={tarefa.id}
          onClick={() => onSelect && onSelect(tarefa)}
          className="cursor-pointer transition-all hover:scale-[1.01] hover:shadow-lg active:scale-[0.99]"
        >
          <TarefaItem
            tarefa={tarefa}
            onToggle={onToggle}
            onDelete={onDelete}
          />
        </div>
      ))}
    </div>
  );
}

export default TarefaLista;
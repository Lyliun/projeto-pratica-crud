import TarefaItem from "./tarefaItem";

function TarefaLista({ tarefas, onToggle, onDelete, onSelect }) {
  if (!tarefas || tarefas.length === 0) {
    const scrollToTop = () => {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    };

    return (
      <div
        style={{
          textAlign: "center",
          padding: "3rem 2rem",
          background: "#1e293b",
          borderRadius: "1.5rem",
          boxShadow: "6px 6px 12px #0f172a, -6px -6px 12px #1e293b",
        }}
      >
        <div
          style={{
            width: "80px",
            height: "80px",
            margin: "0 auto 1.5rem",
            background: "rgba(16, 185, 129, 0.1)",
            borderRadius: "50%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "2.5rem",
            boxShadow:
              "inset 3px 3px 6px #0f172a, inset -3px -3px 6px #1e293b",
          }}
        >
          📋
        </div>

        <h3
          style={{
            color: "#e2e8f0",
            fontSize: "1.5rem",
            fontWeight: "bold",
            marginBottom: "0.5rem",
          }}
        >
          Nenhuma tarefa ainda
        </h3>

        <p
          style={{
            color: "#94a3b8",
            fontSize: "0.95rem",
            marginBottom: "1.5rem",
          }}
        >
          Sua lista está vazia. Adicione tarefas para começar!
        </p>

        <button
          onClick={scrollToTop}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "0.75rem",
            padding: "0.875rem 1.5rem",
            background:
              "linear-gradient(to right, rgba(16, 185, 129, 0.15), rgba(6, 182, 212, 0.15))",
            borderRadius: "0.75rem",
            fontSize: "0.9rem",
            fontWeight: "600",
            color: "#10b981",
            border: "1px solid rgba(16, 185, 129, 0.3)",
            cursor: "pointer",
            transition: "all 0.3s",
            boxShadow: "3px 3px 6px #0f172a, -3px -3px 6px #1e293b",
          }}
          onMouseEnter={(e) => {
            e.target.style.transform = "translateY(-2px)";
            e.target.style.boxShadow =
              "5px 5px 10px #0f172a, -5px -5px 10px #1e293b";
            e.target.style.background =
              "linear-gradient(to right, rgba(16, 185, 129, 0.25), rgba(6, 182, 212, 0.25))";
          }}
          onMouseLeave={(e) => {
            e.target.style.transform = "translateY(0)";
            e.target.style.boxShadow =
              "3px 3px 6px #0f172a, -3px -3px 6px #1e293b";
            e.target.style.background =
              "linear-gradient(to right, rgba(16, 185, 129, 0.15), rgba(6, 182, 212, 0.15))";
          }}
          onMouseDown={(e) => {
            e.target.style.transform = "translateY(1px)";
            e.target.style.boxShadow = "inset 2px 2px 4px rgba(0,0,0,0.3)";
          }}
          onMouseUp={(e) => {
            e.target.style.transform = "translateY(-2px)";
            e.target.style.boxShadow =
              "5px 5px 10px #0f172a, -5px -5px 10px #1e293b";
          }}
        >
          <span style={{ fontSize: "1.25rem" }}>👆</span>
          <span>Use o formulário acima</span>
          <svg
            style={{ width: "1rem", height: "1rem", transition: "transform 0.3s" }}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 10l7-7m0 0l7 7m-7-7v18"
            />
          </svg>
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {tarefas.map((tarefa) => (
        <div
          key={tarefa.id}
          onClick={() => onSelect && onSelect(tarefa)}
          className="cursor-pointer animate-in fade-in slide-in-from-bottom-2 duration-500"
        >
          <TarefaItem
            tarefa={tarefa}
            onToggle={() => onToggle && onToggle(tarefa.id)}
            onDelete={() => onDelete && onDelete(tarefa.id)}
          />
        </div>
      ))}
    </div>
  );
}

export default TarefaLista;
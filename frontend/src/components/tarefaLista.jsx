import TarefaItem from './tarefaItem';

function TarefaLista({ tarefas, onToggle, onDelete, onSelect }) {
  if (!tarefas || tarefas.length === 0) {
    return (
      <div style={{
        textAlign: 'center',
        color: '#94a3b8',
        padding: '3rem',
        background: '#1e293b',
        borderRadius: '1rem',
        boxShadow: '6px 6px 12px #0f172a, -6px -6px 12px #1e293b'
      }}>
        <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>📝</div>
        Nenhuma tarefa encontrada
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      {tarefas.map((tarefa) => (
        <div key={tarefa.id} onClick={() => onSelect && onSelect(tarefa)} style={{ cursor: 'pointer' }}>
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
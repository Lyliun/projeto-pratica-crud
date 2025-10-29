function TarefaItem({ tarefa, onToggle, onDelete }) {
  return (
    <div style={{
      background: '#1e293b',
      borderRadius: '1rem',
      padding: '1.5rem',
      boxShadow: '6px 6px 12px #0f172a, -6px -6px 12px #1e293b',
      transition: 'all 0.3s',
      transform: 'scale(1)'
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.boxShadow = '8px 8px 16px #0f172a, -8px -8px 16px #1e293b';
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.boxShadow = '6px 6px 12px #0f172a, -6px -6px 12px #1e293b';
    }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
        {/* Checkbox */}
        <button
          onClick={() => onToggle(tarefa.id)}
          style={{
            marginTop: '0.25rem',
            width: '1.75rem',
            height: '1.75rem',
            minWidth: '1.75rem',
            borderRadius: '0.5rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: tarefa.concluida 
              ? 'linear-gradient(to bottom right, #10b981, #06b6d4)'
              : '#1e293b',
            boxShadow: tarefa.concluida
              ? 'inset 2px 2px 4px rgba(0,0,0,0.3)'
              : 'inset 3px 3px 6px #0f172a, inset -3px -3px 6px #1e293b',
            border: 'none',
            cursor: 'pointer',
            transition: 'all 0.3s'
          }}
        >
          {tarefa.concluida && (
            <svg style={{ width: '1rem', height: '1rem', color: 'white' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          )}
        </button>

        <div style={{ flex: 1, minWidth: 0 }}>
          <h3 style={{
            fontWeight: 'bold',
            fontSize: '1.125rem',
            marginBottom: '0.25rem',
            color: tarefa.concluida ? '#64748b' : '#e2e8f0',
            textDecoration: tarefa.concluida ? 'line-through' : 'none',
            transition: 'all 0.3s',
            wordBreak: 'break-word'
          }}>
            {tarefa.titulo}
          </h3>
          <p style={{
            fontSize: '0.875rem',
            color: tarefa.concluida ? '#475569' : '#94a3b8',
            textDecoration: tarefa.concluida ? 'line-through' : 'none',
            transition: 'all 0.3s',
            lineHeight: '1.5',
            wordBreak: 'break-word'
          }}>
            {tarefa.descricao}
          </p>
        </div>

        {/* Botão Deletar */}
        <button
          onClick={() => onDelete(tarefa.id)}
          style={{
            padding: '0.5rem',
            borderRadius: '0.5rem',
            background: '#1e293b',
            boxShadow: '3px 3px 6px #0f172a, -3px -3px 6px #1e293b',
            border: 'none',
            cursor: 'pointer',
            color: '#f87171',
            transition: 'all 0.2s',
            minWidth: '2.5rem',
            height: '2.5rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
          onMouseEnter={(e) => {
            e.target.style.color = '#fca5a5';
            e.target.style.boxShadow = 'inset 3px 3px 6px #0f172a, inset -3px -3px 6px #1e293b';
          }}
          onMouseLeave={(e) => {
            e.target.style.color = '#f87171';
            e.target.style.boxShadow = '3px 3px 6px #0f172a, -3px -3px 6px #1e293b';
          }}
          onMouseDown={(e) => {
            e.target.style.boxShadow = 'inset 4px 4px 8px #0f172a';
          }}
          onMouseUp={(e) => {
            e.target.style.boxShadow = 'inset 3px 3px 6px #0f172a, inset -3px -3px 6px #1e293b';
          }}
        >
          <svg style={{ width: '1.25rem', height: '1.25rem' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>
    </div>
  );
}

export default TarefaItem;
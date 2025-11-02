import React from "react";

function TarefaDescricao({ tarefa }) {
  if (!tarefa) {
    return (
      <div style={{ color: '#94a3b8', textAlign: 'center', fontStyle: 'italic', marginTop: '1rem' }}>
        Nenhuma tarefa selecionada.
      </div>
    );
  }

  return (
    <div style={{
      background: '#1e293b',
      borderRadius: '1rem',
      padding: '1.25rem',
      marginTop: '1.25rem',
      boxShadow: '6px 6px 12px #0f172a, -6px -6px 12px #1e293b',
      width: '100%'
    }}>
      <h2 style={{
        fontSize: '1.25rem',
        fontWeight: '600',
        color: '#e2e8f0',
        marginBottom: '0.5rem'
      }}>
        {tarefa.titulo}
      </h2>
      <p style={{ color: '#94a3b8' }}>{tarefa.descricao || 'Sem descrição adicionada'}</p>
    </div>
  );
}

export default TarefaDescricao;
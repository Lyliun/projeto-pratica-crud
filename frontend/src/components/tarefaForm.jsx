import { useState } from "react";
import { api } from "../services/api";

function TarefaForm({ onTarefaAdicionada }) {
  const [titulo, setTitulo] = useState("");
  const [descricao, setDescricao] = useState("");
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!titulo.trim() || !descricao.trim()) {
      setErro("Título e descrição são obrigatórios!");
      return;
    }

    setCarregando(true);
    setErro(null);

    try {
      const response = await api.post('/tarefas', { 
        titulo: titulo.trim(), 
        descricao: descricao.trim() 
      });
      
      setTitulo("");
      setDescricao("");
      onTarefaAdicionada(response.data);
      
    } catch (error) {
      console.error('Erro ao adicionar tarefa:', error);
      setErro(error.response?.data?.erro || 'Erro ao adicionar tarefa. Tente novamente.');
    } finally {
      setCarregando(false);
    }
  };

  return (
    <div style={{
      background: '#1e293b',
      borderRadius: '1.5rem',
      padding: '2rem',
      boxShadow: '8px 8px 16px #0f172a, -8px -8px 16px #1e293b',
      marginBottom: '2rem'
    }}>
      <h2 style={{
        fontSize: '1.5rem',
        fontWeight: 'bold',
        color: '#e2e8f0',
        marginBottom: '1.5rem',
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem'
      }}>
        <span style={{ color: '#10b981', fontSize: '1.75rem' }}>+</span> Nova Tarefa
      </h2>

      {erro && (
        <div style={{
          background: 'rgba(254, 202, 202, 0.1)',
          border: '1px solid #ef4444',
          color: '#fca5a5',
          padding: '0.875rem',
          borderRadius: '0.75rem',
          marginBottom: '1.25rem',
          fontSize: '0.875rem'
        }}>
          {erro}
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        <div>
          <label style={{
            display: 'block',
            fontSize: '0.875rem',
            fontWeight: '600',
            color: '#94a3b8',
            marginBottom: '0.5rem',
            marginLeft: '0.25rem',
            letterSpacing: '0.05em'
          }}>
            TÍTULO
          </label>
          <input
            type="text"
            placeholder="Digite o título da tarefa..."
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
            disabled={carregando}
            style={{
              width: '100%',
              padding: '1rem 1.25rem',
              borderRadius: '1rem',
              background: '#1e293b',
              color: '#e2e8f0',
              border: '1px solid rgba(71, 85, 105, 0.5)',
              boxShadow: 'inset 4px 4px 8px #0f172a, inset -4px -4px 8px #1e293b',
              outline: 'none',
              fontSize: '1rem',
              transition: 'all 0.3s',
              opacity: carregando ? 0.6 : 1
            }}
            onFocus={(e) => {
              e.target.style.boxShadow = 'inset 6px 6px 12px #0f172a, inset -6px -6px 12px #1e293b';
            }}
            onBlur={(e) => {
              e.target.style.boxShadow = 'inset 4px 4px 8px #0f172a, inset -4px -4px 8px #1e293b';
            }}
          />
        </div>

        <div>
          <label style={{
            display: 'block',
            fontSize: '0.875rem',
            fontWeight: '600',
            color: '#94a3b8',
            marginBottom: '0.5rem',
            marginLeft: '0.25rem',
            letterSpacing: '0.05em'
          }}>
            DESCRIÇÃO
          </label>
          <textarea
            placeholder="Descreva os detalhes da tarefa..."
            value={descricao}
            onChange={(e) => setDescricao(e.target.value)}
            rows="4"
            disabled={carregando}
            style={{
              width: '100%',
              padding: '1rem 1.25rem',
              borderRadius: '1rem',
              background: '#1e293b',
              color: '#e2e8f0',
              border: '1px solid rgba(71, 85, 105, 0.5)',
              boxShadow: 'inset 4px 4px 8px #0f172a, inset -4px -4px 8px #1e293b',
              outline: 'none',
              fontSize: '1rem',
              resize: 'none',
              transition: 'all 0.3s',
              fontFamily: 'inherit',
              opacity: carregando ? 0.6 : 1
            }}
            onFocus={(e) => {
              e.target.style.boxShadow = 'inset 6px 6px 12px #0f172a, inset -6px -6px 12px #1e293b';
            }}
            onBlur={(e) => {
              e.target.style.boxShadow = 'inset 4px 4px 8px #0f172a, inset -4px -4px 8px #1e293b';
            }}
          />
        </div>

        <button
          onClick={handleSubmit}
          disabled={carregando}
          style={{
            width: '100%',
            padding: '1rem 1.5rem',
            borderRadius: '1rem',
            background: carregando 
              ? '#64748b' 
              : 'linear-gradient(to right, #10b981, #06b6d4)',
            color: 'white',
            fontWeight: 'bold',
            fontSize: '1rem',
            border: 'none',
            cursor: carregando ? 'not-allowed' : 'pointer',
            boxShadow: '4px 4px 12px #0f172a, -4px -4px 12px #1e293b',
            transition: 'all 0.3s',
            transform: 'scale(1)'
          }}
          onMouseEnter={(e) => {
            if (!carregando) {
              e.target.style.transform = 'scale(1.02)';
              e.target.style.boxShadow = '6px 6px 16px #0f172a, -6px -6px 16px #1e293b';
            }
          }}
          onMouseLeave={(e) => {
            if (!carregando) {
              e.target.style.transform = 'scale(1)';
              e.target.style.boxShadow = '4px 4px 12px #0f172a, -4px -4px 12px #1e293b';
            }
          }}
          onMouseDown={(e) => {
            if (!carregando) {
              e.target.style.boxShadow = 'inset 4px 4px 8px rgba(0,0,0,0.4)';
            }
          }}
          onMouseUp={(e) => {
            if (!carregando) {
              e.target.style.boxShadow = '4px 4px 12px #0f172a, -4px -4px 12px #1e293b';
            }
          }}
        >
          {carregando ? 'Adicionando...' : 'Adicionar Tarefa'}
        </button>
      </div>
    </div>
  );
}

export default TarefaForm;
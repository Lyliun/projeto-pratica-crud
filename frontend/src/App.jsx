import { useState, useEffect } from 'react';
import { api } from './services/api';
import TarefaForm from './components/tarefaForm';
import TarefaLista from './components/tarefaLista';
import TarefaDescricao from './components/tarefaDescricao';

function App() {
  const [tarefas, setTarefas] = useState([]);
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState(null);
  const [tarefaSelecionada, setTarefaSelecionada] = useState(null);

  useEffect(() => {
    carregarTarefas();
  }, []);

  const carregarTarefas = async () => {
    try {
      setCarregando(true);
      setErro(null);
  const response = await api.get('/tarefas');
      
      if (!Array.isArray(response.data)) {
        throw new Error('Formato de dados inválido');
      }
      
      setTarefas(response.data);
    } catch (error) {
      console.error('Erro ao carregar tarefas:', error);
      
      setErro(error.response?.data?.erro || 
        error.message === 'Formato de dados inválido' 
          ? 'Erro: O servidor retornou dados em formato inválido.'
          : 'Erro ao carregar tarefas. Verifique se o backend está rodando.'
      );

      // ✅ Carrega dados de exemplo em caso de erro
      setTarefas([
        { 
          id: 1, 
          titulo: 'Exemplo (Offline)', 
          descricao: 'Esta é uma tarefa de exemplo mostrada quando o servidor está offline', 
          concluida: false,
          criadaEm: new Date().toISOString()
        },
        { 
          id: 2, 
          titulo: 'Exemplo 2 (Offline)', 
          descricao: 'Outra tarefa de exemplo para modo offline', 
          concluida: true,
          criadaEm: new Date().toISOString()
        },
      ]);
    } finally {
      setCarregando(false);
    }
  };

  const handleTarefaAdicionada = (novaTarefa) => {
    setTarefas(prevTarefas => [novaTarefa, ...prevTarefas]);
  };

  const handleToggleTarefa = async (id) => {
    // ✅ Atualização otimista
    setTarefas(prevTarefas => 
      prevTarefas.map(t => t.id === id ? { ...t, concluida: !t.concluida } : t)
    );

    try {
      const tarefa = tarefas.find(t => t.id === id);
      if (!tarefa) throw new Error('Tarefa não encontrada');
      
  await api.put(`/tarefas/${id}`, { 
        ...tarefa, 
        concluida: !tarefa.concluida 
      });
    } catch (error) {
      console.error('Erro ao atualizar tarefa:', error);
      
      // Reverte mudança se falhar
      setTarefas(prevTarefas =>
        prevTarefas.map(t => t.id === id ? { ...t, concluida: !t.concluida } : t)
      );

      setErro(error.response?.data?.erro || 'Erro ao atualizar tarefa. Tente novamente.');
      
      setTimeout(() => setErro(null), 5000); // Remove erro após 5 segundos
    }
  };

  const handleDeleteTarefa = async (id) => {
    if (!window.confirm('Tem certeza que deseja deletar esta tarefa?')) return;

    // Armazena estado anterior para possível reversão
    const tarefasAntigas = [...tarefas];
    
    // Atualização otimista
    setTarefas(prevTarefas => prevTarefas.filter(t => t.id !== id));

    try {
  await api.delete(`/tarefas/${id}`);
      
      // Limpa a tarefa selecionada, se necessário
      if (tarefaSelecionada?.id === id) {
        setTarefaSelecionada(null);
      }
    } catch (error) {
      console.error('Erro ao deletar tarefa:', error);
      
      // Reverte para estado anterior
      setTarefas(tarefasAntigas);
      
      setErro(error.response?.data?.erro || 'Erro ao deletar tarefa. Tente novamente.');
      
      setTimeout(() => setErro(null), 5000); // Remove erro após 5 segundos
    }
  };

  const tarefasConcluidas = tarefas.filter((t) => t.concluida).length;
  const tarefasPendentes = tarefas.filter((t) => !t.concluida).length;

  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#0f172a',
        padding: '2rem',
        position: 'relative',
        overflowX: 'hidden',
      }}
    >
      <div style={{ maxWidth: '64rem', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h1
            style={{
              fontSize: '3rem',
              fontWeight: 'bold',
              background: 'linear-gradient(to right, #10b981, #06b6d4)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              marginBottom: '0.75rem',
            }}
          >
            Task Manager
          </h1>
          <p style={{ color: '#94a3b8', fontSize: '1.125rem' }}>
            Organize suas tarefas com elegância
          </p>
        </div>

        {/* Formulário */}
        <TarefaForm onTarefaAdicionada={handleTarefaAdicionada} />

        {/* Estatísticas */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '1rem',
            marginBottom: '2rem',
          }}
        >
          <div
            style={{
              background: '#1e293b',
              borderRadius: '1rem',
              padding: '1.25rem',
              boxShadow: '6px 6px 12px #0f172a, -6px -6px 12px #1e293b',
              textAlign: 'center',
            }}
          >
            <div
              style={{
                fontSize: '1.875rem',
                fontWeight: 'bold',
                color: '#10b981',
                marginBottom: '0.25rem',
              }}
            >
              {tarefas.length}
            </div>
            <div
              style={{
                color: '#94a3b8',
                fontSize: '0.875rem',
                fontWeight: '600',
              }}
            >
              TOTAL
            </div>
          </div>
          <div
            style={{
              background: '#1e293b',
              borderRadius: '1rem',
              padding: '1.25rem',
              boxShadow: '6px 6px 12px #0f172a, -6px -6px 12px #1e293b',
              textAlign: 'center',
            }}
          >
            <div
              style={{
                fontSize: '1.875rem',
                fontWeight: 'bold',
                color: '#06b6d4',
                marginBottom: '0.25rem',
              }}
            >
              {tarefasConcluidas}
            </div>
            <div
              style={{
                color: '#94a3b8',
                fontSize: '0.875rem',
                fontWeight: '600',
              }}
            >
              CONCLUÍDAS
            </div>
          </div>
          <div
            style={{
              background: '#1e293b',
              borderRadius: '1rem',
              padding: '1.25rem',
              boxShadow: '6px 6px 12px #0f172a, -6px -6px 12px #1e293b',
              textAlign: 'center',
            }}
          >
            <div
              style={{
                fontSize: '1.875rem',
                fontWeight: 'bold',
                color: '#fb923c',
                marginBottom: '0.25rem',
              }}
            >
              {tarefasPendentes}
            </div>
            <div
              style={{
                color: '#94a3b8',
                fontSize: '0.875rem',
                fontWeight: '600',
              }}
            >
              PENDENTES
            </div>
          </div>
        </div>

        {/* Mensagem de erro */}
        {erro && (
          <div
            style={{
              background: 'rgba(254, 202, 202, 0.1)',
              border: '1px solid #ef4444',
              color: '#fca5a5',
              padding: '1rem',
              borderRadius: '0.75rem',
              marginBottom: '1.5rem',
              textAlign: 'center',
            }}
          >
            {erro}
          </div>
        )}

        {/* Conteúdo principal */}
        {carregando ? (
          <div
            style={{
              textAlign: 'center',
              color: '#94a3b8',
              padding: '3rem',
              background: '#1e293b',
              borderRadius: '1rem',
              boxShadow: '6px 6px 12px #0f172a, -6px -6px 12px #1e293b',
            }}
          >
            <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>⏳</div>
            Carregando tarefas...
          </div>
        ) : (
          <>
            <TarefaLista
              tarefas={tarefas}
              onToggle={handleToggleTarefa}
              onDelete={handleDeleteTarefa}
              onSelect={setTarefaSelecionada}
            />

            {/* Painel lateral da descrição */}
            {tarefaSelecionada && (
              <TarefaDescricao
                tarefa={tarefaSelecionada}
                onClose={() => setTarefaSelecionada(null)}
              />
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default App;
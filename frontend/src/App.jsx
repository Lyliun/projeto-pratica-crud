import { useState, useEffect } from 'react';
import { api } from './services/api';
import TarefaForm from './components/TarefaForm'
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
      setTarefas(response.data);
    } catch (error) {
      console.error('Erro ao carregar tarefas:', error);
      setErro('Erro ao carregar tarefas. Verifique se o backend está rodando.');
      // ✅ ADICIONADO: Se der erro, carrega dados de exemplo
      setTarefas([
        { 
          id: 1, 
          titulo: "Exemplo 1", 
          descricao: "Esta é uma tarefa de exemplo", 
          concluida: false 
        },
        { 
          id: 2, 
          titulo: "Exemplo 2", 
          descricao: "Outra tarefa de exemplo", 
          concluida: true 
        }
      ]);
    } finally {
      setCarregando(false);
    }
  };

  const handleTarefaAdicionada = (novaTarefa) => {
    setTarefas([novaTarefa, ...tarefas]);
  };

  const handleToggleTarefa = async (id) => {
    // ✅ Atualiza localmente primeiro (otimista)
    setTarefas(tarefas.map(t => 
      t.id === id ? { ...t, concluida: !t.concluida } : t
    ));

    try {
      const tarefa = tarefas.find(t => t.id === id);
      await api.put(`/tarefas/${id}`, {
        ...tarefa,
        concluida: !tarefa.concluida
      });
    } catch (error) {
      console.error('Erro ao atualizar tarefa:', error);
      // Reverte a mudança se der erro
      setTarefas(tarefas.map(t => 
        t.id === id ? { ...t, concluida: !t.concluida } : t
      ));
      alert('Erro ao atualizar tarefa. Verifique se o backend está rodando.');
    }
  };

  const handleDeleteTarefa = async (id) => {
    if (!window.confirm('Tem certeza que deseja deletar esta tarefa?')) {
      return;
    }

    // ✅ Remove localmente primeiro (otimista)
    const tarefasAntigas = tarefas;
    setTarefas(tarefas.filter(t => t.id !== id));

    try {
      await api.delete(`/tarefas/${id}`);
    } catch (error) {
      console.error('Erro ao deletar tarefa:', error);
      // Reverte se der erro
      setTarefas(tarefasAntigas);
      alert('Erro ao deletar tarefa. Verifique se o backend está rodando.');
    }
    // Atualiza seleção: se a tarefa removida estava selecionada, limpa a seleção
    const novas = tarefasAntigas.filter(t => t.id !== id);
    if (tarefaSelecionada && tarefaSelecionada.id === id) {
      setTarefaSelecionada(null);
    } else if (novas.length === 0) {
      // se não houverem mais tarefas, limpa também
      setTarefaSelecionada(null);
    }
  };

  const tarefasConcluidas = tarefas.filter(t => t.concluida).length;
  const tarefasPendentes = tarefas.filter(t => !t.concluida).length;

  return (
    <div style={{
      minHeight: '100vh',
      background: '#0f172a',
      padding: '2rem'
    }}>
      <div style={{
        maxWidth: '64rem',
        margin: '0 auto'
      }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h1 style={{
            fontSize: '3rem',
            fontWeight: 'bold',
            background: 'linear-gradient(to right, #10b981, #06b6d4)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            marginBottom: '0.75rem'
          }}>
            Task Manager
          </h1>
          <p style={{ color: '#94a3b8', fontSize: '1.125rem' }}>
            Organize suas tarefas com elegância
          </p>
        </div>

        {/* Formulário */}
        <TarefaForm onTarefaAdicionada={handleTarefaAdicionada} />

        {/* Estatísticas */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '1rem',
          marginBottom: '2rem'
        }}>
          <div style={{
            background: '#1e293b',
            borderRadius: '1rem',
            padding: '1.25rem',
            boxShadow: '6px 6px 12px #0f172a, -6px -6px 12px #1e293b',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '1.875rem', fontWeight: 'bold', color: '#10b981', marginBottom: '0.25rem' }}>
              {tarefas.length}
            </div>
            <div style={{ color: '#94a3b8', fontSize: '0.875rem', fontWeight: '600' }}>
              TOTAL
            </div>
          </div>
          <div style={{
            background: '#1e293b',
            borderRadius: '1rem',
            padding: '1.25rem',
            boxShadow: '6px 6px 12px #0f172a, -6px -6px 12px #1e293b',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '1.875rem', fontWeight: 'bold', color: '#06b6d4', marginBottom: '0.25rem' }}>
              {tarefasConcluidas}
            </div>
            <div style={{ color: '#94a3b8', fontSize: '0.875rem', fontWeight: '600' }}>
              CONCLUÍDAS
            </div>
          </div>
          <div style={{
            background: '#1e293b',
            borderRadius: '1rem',
            padding: '1.25rem',
            boxShadow: '6px 6px 12px #0f172a, -6px -6px 12px #1e293b',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '1.875rem', fontWeight: 'bold', color: '#fb923c', marginBottom: '0.25rem' }}>
              {tarefasPendentes}
            </div>
            <div style={{ color: '#94a3b8', fontSize: '0.875rem', fontWeight: '600' }}>
              PENDENTES
            </div>
          </div>
        </div>

        {/* Erro */}
        {erro && (
          <div style={{
            background: 'rgba(254, 202, 202, 0.1)',
            border: '1px solid #ef4444',
            color: '#fca5a5',
            padding: '1rem',
            borderRadius: '0.75rem',
            marginBottom: '1.5rem',
            textAlign: 'center'
          }}>
            {erro}
          </div>
        )}

        {/* Loading ou Lista */}
        {carregando ? (
          <div style={{
            textAlign: 'center',
            color: '#94a3b8',
            padding: '3rem',
            background: '#1e293b',
            borderRadius: '1rem',
            boxShadow: '6px 6px 12px #0f172a, -6px -6px 12px #1e293b'
          }}>
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
            <TarefaDescricao tarefa={tarefaSelecionada} />
          </>
        )}
      </div>
    </div>
  );
}

export default App;
import { useState, useEffect } from 'react';
import { api } from './services/api';
import TarefaForm from './components/tarefaForm';
import TarefaLista from './components/tarefaLista';
import TarefaDescricao from './components/tarefaDescricao';

function App() {
  const [tarefas, setTarefas] = useState([]);
  const [erro, setErro] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const [tarefaSelecionada, setTarefaSelecionada] = useState(null);

  // 🔹 Carrega tarefas ao iniciar
  useEffect(() => {
    const carregarTarefas = async () => {
      try {
        const resposta = await api.get("/tarefas");
        setTarefas(resposta.data);
      } catch (error) {
        console.error("Erro ao carregar tarefas:", error);
        setErro("Erro ao carregar tarefas. Tente novamente.");
      } finally {
        setCarregando(false);
      }
    };
    carregarTarefas();
  }, []);

  // 🔹 Adiciona nova tarefa
  const handleTarefaAdicionada = (novaTarefa) => {
    setTarefas((prev) => [...prev, novaTarefa]);
  };

  // 🔹 Alterna status concluída/pendente
  const handleToggleTarefa = async (id) => {
    setTarefas((prevTarefas) =>
      prevTarefas.map((t) =>
        t.id === id ? { ...t, concluida: !t.concluida } : t
      )
    );

    // 🔄 Atualiza também a tarefa exibida no painel lateral
    setTarefaSelecionada((prevSelecionada) =>
      prevSelecionada && prevSelecionada.id === id
        ? { ...prevSelecionada, concluida: !prevSelecionada.concluida }
        : prevSelecionada
    );

    try {
      const tarefa = tarefas.find((t) => t.id === id);
      if (!tarefa) throw new Error('Tarefa não encontrada');

      await api.put(`/tarefas/${id}`, {
        ...tarefa,
        concluida: !tarefa.concluida,
      });
    } catch (error) {
      console.error('Erro ao atualizar tarefa:', error);

      // Reverte se falhar
      setTarefas((prevTarefas) =>
        prevTarefas.map((t) =>
          t.id === id ? { ...t, concluida: !t.concluida } : t
        )
      );

      setErro(error.response?.data?.erro || 'Erro ao atualizar tarefa.');
      setTimeout(() => setErro(null), 5000);
    }
  };

  // 🔹 Deleta tarefa
  const handleDeleteTarefa = async (id) => {
    if (!window.confirm('Tem certeza que deseja deletar esta tarefa?')) return;

    const tarefasAntigas = [...tarefas];
    setTarefas((prev) => prev.filter((t) => t.id !== id));

    try {
      await api.delete(`/tarefas/${id}`);
      if (tarefaSelecionada?.id === id) setTarefaSelecionada(null);
    } catch (error) {
      console.error('Erro ao deletar tarefa:', error);
      setTarefas(tarefasAntigas);
      setErro('Erro ao deletar tarefa. Tente novamente.');
      setTimeout(() => setErro(null), 5000);
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
          <StatCard valor={tarefas.length} cor="#10b981" label="TOTAL" />
          <StatCard valor={tarefasConcluidas} cor="#06b6d4" label="CONCLUÍDAS" />
          <StatCard valor={tarefasPendentes} cor="#fb923c" label="PENDENTES" />
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
                onToggle={handleToggleTarefa} // ✅ Passa controle de toggle
              />
            )}
          </>
        )}
      </div>
    </div>
  );
}

// 🔸 Componente auxiliar de estatísticas
function StatCard({ valor, cor, label }) {
  return (
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
          color: cor,
          marginBottom: '0.25rem',
        }}
      >
        {valor}
      </div>
      <div
        style={{
          color: '#94a3b8',
          fontSize: '0.875rem',
          fontWeight: '600',
        }}
      >
        {label}
      </div>
    </div>
  );
}

export default App;
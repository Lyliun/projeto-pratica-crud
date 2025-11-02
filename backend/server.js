import express from 'express';
import cors from 'cors';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';
import tarefasRoutes from './routes/tarefasRoutes.js';

// Get the directory name of the current module
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

// Simple request logger to help debugging
app.use((req, res, next) => {
  console.info(`[REQ] ${new Date().toISOString()} - ${req.method} ${req.originalUrl}`);
  next();
});
// CORS configuration
// CORS: allow local dev servers on any localhost port and a fixed prod origin
app.use(cors({
  origin: (origin, callback) => {
    // Allow non-browser requests like curl/postman (no origin)
    if (!origin) return callback(null, true);

    if (process.env.NODE_ENV === 'production') {
      const allowed = 'https://yourproductiondomain.com';
      return callback(null, origin === allowed);
    }

    // Allow localhost and 127.0.0.1 on any port during development
    const isLocalhost = /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/i.test(origin);
    if (isLocalhost) return callback(null, true);

    // Reject other origins in development to be strict
    return callback(new Error('CORS origin denied'));
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type']
}));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} ${req.method} ${req.url}`);
  next();
});

// Static files (if needed)
app.use(express.static(resolve(__dirname, 'public')));

// Routes
app.use('/api/tarefas', tarefasRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'healthy',
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  });
});

// Error handling
app.use((err, req, res, next) => {
  // Log full stack for easier debugging
  console.error('Error:', err && err.stack ? err.stack : err);

  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    return res.status(400).json({ 
      erro: 'JSON inválido',
      detalhes: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
  }

  res.status(500).json({ 
    erro: 'Erro interno do servidor',
    detalhes: process.env.NODE_ENV === 'development' ? (err && err.stack ? err.stack : err.message) : undefined
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ erro: 'Endpoint não encontrado' });
});

const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, () => {
  console.info(`🚀 Servidor rodando em http://localhost:${PORT}`);
  console.info('📝 Endpoints disponíveis:');
  console.info(`   GET    /api/tarefas     - Listar todas as tarefas`);
  console.info(`   POST   /api/tarefas     - Criar nova tarefa`);
  console.info(`   PUT    /api/tarefas/:id - Atualizar tarefa`);
  console.info(`   DELETE /api/tarefas/:id - Excluir tarefa`);
  console.info(`   GET    /health          - Verificar status do servidor`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.info('SIGTERM recebido. Encerrando servidor...');
  server.close(() => {
    console.info('Servidor encerrado');
    process.exit(0);
  });
});

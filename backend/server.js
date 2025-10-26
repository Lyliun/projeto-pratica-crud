import express from 'express';
import cors from 'cors';
import tarefasRoutes from './routes/tarefasRoutes.js';

const app = express();
app.use(cors());
app.use(express.json());

app.use('/tarefas', tarefasRoutes);

const PORT = 3000;
app.listen(PORT, () => console.log('Servidor rodando na porta' + PORT));

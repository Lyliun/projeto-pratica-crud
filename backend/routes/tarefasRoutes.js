import express from 'express';
import { 
  listarTarefas, 
  criarTarefa, 
  atualizarTarefa, 
  excluirTarefa,
  obterEstatisticas // ✅ NOVO
} from '../controllers/tarefasController.js';

const router = express.Router();

// Rotas
router.get('/estatisticas', obterEstatisticas); // ✅ NOVO - deve vir ANTES de /:id
router.get('/', listarTarefas);
router.post('/', criarTarefa);
router.put('/:id', atualizarTarefa);
router.delete('/:id', excluirTarefa);

export default router;
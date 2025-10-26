import express from 'express';
import {
  listarTarefas,
  criarTarefa,
  atualizarTarefa,
  excluirTarefa
} from "../controllers/tarefasController.js";

const router = express.Router();

router.get("/", listarTarefas);
router.post("/", criarTarefa);
router.put("/:id", atualizarTarefa);
router.delete("/:id", excluirTarefa);

export default router;
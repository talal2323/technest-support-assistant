import { Router } from 'express';
import Conversation from '../models/Conversation.js';
import KnowledgeBase from '../models/KnowledgeBase.js';
import { requireAdmin } from '../middleware/auth.js';

const router = Router();
router.use(requireAdmin);

router.get('/knowledge', async (_req, res) => res.json(await KnowledgeBase.find().sort({ updatedAt: -1 })));
router.post('/knowledge', async (req, res) => res.status(201).json(await KnowledgeBase.create(req.body)));
router.put('/knowledge/:id', async (req, res) => res.json(await KnowledgeBase.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })));
router.delete('/knowledge/:id', async (req, res) => {
  await KnowledgeBase.findByIdAndDelete(req.params.id);
  res.status(204).end();
});
router.get('/conversations', async (_req, res) => res.json(await Conversation.find().sort({ updatedAt: -1 }).limit(50)));

export default router;

import express from 'express';
import { protectRoute } from '../middleware/auth.middleware.js';
import { getMessages, getUsersForSidebar, sendMessages, addReaction, markSeen, deleteMessage } from '../controllers/message.controllers.js';

const router = express.Router();

router.get('/users', protectRoute, getUsersForSidebar);
router.get("/:id", protectRoute, getMessages);
router.post('/send/:id', protectRoute, sendMessages);
router.post('/react/:messageId', protectRoute, addReaction);
router.put('/seen/:id', protectRoute, markSeen);
router.delete('/:id', protectRoute, deleteMessage);
export default router;
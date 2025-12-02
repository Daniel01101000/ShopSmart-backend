import express from 'express';
import { getUser, updateUser } from '../controllers/userController.js';
import auth from '../middleware/auth.js';

const router = express.Router();

router.get('/:id', auth, getUser);
router.put('/:id', auth, updateUser);

export default router;
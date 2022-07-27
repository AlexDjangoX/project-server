import { Router } from 'express';
import { create } from '../controllers/album.js';

const router = Router();

router.post('/', create);

export default router;

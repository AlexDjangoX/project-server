import { Router } from 'express';
import {
  createNewAlbum,
  retrieveAlbumsByUserId,
} from '../controllers/album.js';

const router = Router();

router.post('/:id', createNewAlbum);
router.get('/:id', retrieveAlbumsByUserId);

export default router;

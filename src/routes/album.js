import { Router } from 'express';
import {
  createNewAlbum,
  retrieveAlbumsByUserId,
  deleteAlbumFromFavorites,
} from '../controllers/album.js';

const router = Router();

router.post('/:id', createNewAlbum);
router.get('/:id', retrieveAlbumsByUserId);
router.delete('/:id', deleteAlbumFromFavorites);

export default router;

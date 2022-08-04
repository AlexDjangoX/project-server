import { Router } from 'express';
import {
  createNewAlbum,
  retrieveAlbumsByUserId,
  deleteAlbumFromFavorites,
  updateReviewRating,
} from '../controllers/album.js';

const router = Router();

router.post('/:id', createNewAlbum);
router.get('/:id', retrieveAlbumsByUserId);
router.delete('/:id', deleteAlbumFromFavorites);
router.patch('/:id', updateReviewRating);

export default router;

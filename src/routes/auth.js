import { Router } from 'express';
import { login } from '../controllers/auth.js';
import {
  resetPassword,
  resetForgotPasswordLink,
  resetForgotPassword,
} from '../controllers/auth.js';
import { validateAuthentication } from '../middleware/auth.js';

const router = Router();

router.post('/login', login);
router.post('/reset-password', resetPassword);
router.post('/reset-forgot-password-link', resetForgotPasswordLink);
router.post('/reset-forgot-password', resetForgotPassword);

export default router;

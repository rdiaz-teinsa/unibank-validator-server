import { Router } from 'express';
import { login, signin } from '../controllers/user.controller';

const router = Router();
router.post('/autenticacion', login);
router.post('/autenticar', signin);

export default router;

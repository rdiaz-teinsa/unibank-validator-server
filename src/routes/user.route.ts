import { Router } from 'express';
import { login, signing, logindemo } from '../controllers/user.controller';

const router = Router();
router.post('/autenticacion', logindemo);
router.post('/autenticar', signing);
router.post('/ldap', login);

export default router;

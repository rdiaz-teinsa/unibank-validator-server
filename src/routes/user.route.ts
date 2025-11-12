import { Router } from 'express';
import { bbddAuthentication, ldapAuthentication, logindemo} from '../controllers/user.controller';

const router = Router();
router.post('/autenticacion', logindemo);
router.post('/autenticar/bbdd', bbddAuthentication);
router.post('/autenticar/ldap', ldapAuthentication);

export default router;

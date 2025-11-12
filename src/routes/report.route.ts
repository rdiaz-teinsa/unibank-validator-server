import {Router} from 'express';
import {azureAuthMiddleware} from "../_helpers/authMiddleware";
import {ldapAuthMiddleware} from '../_helpers/authorize';
import {getReportData} from '../controllers/report.controller';
import {authModel} from "../_helpers/global";

function getAuthorizeMiddleware(authModel: string) {
    switch (authModel) {
        case 'AZURE':
            return azureAuthMiddleware;
        case 'LDAP':
            return ldapAuthMiddleware;
        default:
            throw new Error(`El modelo de autenticacion proporcionado no es valido: ${authModel}`);
    }
}

const authorizeAccess = getAuthorizeMiddleware(authModel);

const router = Router();

router.post('/validator/code/:code', authorizeAccess, getReportData);

export default router;

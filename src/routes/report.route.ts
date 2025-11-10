import { Router } from "express";
import { azureAuthMiddleware } from "../helpers/authMiddleware";
import { ldapAuthMiddleware } from "../helpers/authorize";
import { getReportData } from "../controllers/report.controller";
import { authModel } from "../helpers/global";

const getAuthorizeMiddleware = (authModel: string) => {
  switch (authModel) {
    case "AZURE":
      return azureAuthMiddleware;
    case "LDAP":
      return ldapAuthMiddleware;
    default:
      throw new Error(
        `El modelo de autenticacion proporcionado no es valido: ${authModel}`,
      );
  }
};

const authorizeAccess = getAuthorizeMiddleware(authModel);

const router = Router();

router.post("/validator/code/:code", authorizeAccess, getReportData);

export default router;

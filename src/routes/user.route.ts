import { Router } from "express";
import {
  bbddAuthentication,
  ldapAuthentication,
} from "../controllers/user.controller";

const router = Router();
router.post("/autenticar/bbdd", bbddAuthentication);
router.post("/autenticar/ldap", ldapAuthentication);

export default router;

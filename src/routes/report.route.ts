import { Router } from 'express';
// import { authorizeAccess } from "../_helpers/authMiddleware";
import { authorizeAccess } from '../_helpers/authorize';
import {getReportData} from '../controllers/report.controller';

const router = Router();

router.post('/validator/code/:code', authorizeAccess, getReportData);

export default router;

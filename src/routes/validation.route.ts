import { Router } from "express";
import { authModel } from "../helpers/global";
import { ldapAuthMiddleware } from "../helpers/authorize";
import { azureAuthMiddleware } from "../helpers/authMiddleware";
import {
  getConsultarPeriodos,
  getConsultarPeriodo,
  getConsultarProcesos,
  getConsultarProcesosAtomo,
  getConsultarProcesosFrecuencia,
  postGestionarPeriodo,
  postCargarDatosAtomos,
  postValidacionFuncionalResumen,
  postValidacionEstructuralResumen,
  postValidacionFuncionalDetalle,
  postValidacionEstructuralDetalle,
  postValidacionDetalleErrorEstructural,
  postValidacionDetalleErrorFuncional,
  postValidacionConsultaIndicadores,
  postValidacionConsultaTablero,
  getConsultarBitacoraValidacion,
  getConsultarAtomos,
  getCatalogsData,
  getFileValidations,
} from "../controllers/validation.controller";

const getAuthorizeMiddleware = (authModel: string) => {
  switch (authModel) {
    case "AZURE":
      return azureAuthMiddleware;
    case "LDAP":
      return ldapAuthMiddleware;
    default:
      throw new Error(`Auth model desconocido: ${authModel}`);
  }
};

const authorizeAccess = getAuthorizeMiddleware(authModel);

const router = Router();

router.get("/periodos/banco/:codBanco", authorizeAccess, getConsultarPeriodos);
router.get("/periodo/:idPeriodo", authorizeAccess, getConsultarPeriodo);
router.get("/procesos/:idPeriodo", authorizeAccess, getConsultarProcesos);
router.get(
  "/procesos/atomo/:atomo",
  authorizeAccess,
  getConsultarProcesosAtomo,
);
router.get(
  "/procesos/frecuencia/:frecuencia/periodo/:periodo",
  authorizeAccess,
  getConsultarProcesosFrecuencia,
);
router.post("/periodo", authorizeAccess, postGestionarPeriodo);
router.post("/periodo/importar", authorizeAccess, postCargarDatosAtomos);
router.post(
  "/funcional/resumen",
  authorizeAccess,
  postValidacionFuncionalResumen,
);
router.post(
  "/funcional/detalle",
  authorizeAccess,
  postValidacionFuncionalDetalle,
);
router.post(
  "/estructural/resumen",
  authorizeAccess,
  postValidacionEstructuralResumen,
);
router.post(
  "/estructural/detalle",
  authorizeAccess,
  postValidacionEstructuralDetalle,
);
router.post(
  "/global/registro/estructural",
  authorizeAccess,
  postValidacionDetalleErrorEstructural,
);
router.post(
  "/global/registro/funcional",
  authorizeAccess,
  postValidacionDetalleErrorFuncional,
);
router.post("/indicadores", authorizeAccess, postValidacionConsultaIndicadores);
router.post("/tablero", authorizeAccess, postValidacionConsultaTablero);
router.get(
  "/bitacora/banco/:codBanco",
  authorizeAccess,
  getConsultarBitacoraValidacion,
);
router.get("/atomos", authorizeAccess, getConsultarAtomos);
router.get("/catalogos", getCatalogsData);
router.get("/archivo/atomo/:atomo", authorizeAccess, getFileValidations);

export default router;

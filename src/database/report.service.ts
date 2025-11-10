import { executeStoredProcedure } from "../helpers/database";

export const callRepComparacionCatalogos = async (pData: any) => {
  const { usuario, codBanco, fechaSib } = pData;
  return executeStoredProcedure(
    "TEINSA_CONFIG.dbo.USP_CATALOGOS_COMPARACION",
    {},
    usuario,
    codBanco,
    fechaSib,
  );
};

export const callRepComparacion = async (pData: any) => {
  const {
    idAtomo,
    codBanco,
    fechaSIB,
    campoComparacion,
    campoSumatoria,
    usuario,
  } = pData;
  const params = {
    idAtomo,
    codBanco,
    fechaSIB,
    campoComparacion,
    campoSumatoria,
  };
  return executeStoredProcedure(
    "TEINSA_CONFIG.dbo.USP_VAL_REP_COMPARACIONES",
    params,
    usuario,
    codBanco,
    fechaSIB,
  );
};

export const callRepAT03Comparacion = async (pData: any) => {
  const { codBanco, fechaCorte, usuario } = pData;
  const params = { codBanco, fechaCorte };
  return executeStoredProcedure(
    "TEINSA_CONFIG.dbo.USP_VAL_REP_AT03_COMPARACION",
    params,
    usuario,
    codBanco,
    fechaCorte,
  );
};

export const callRepAT03ComparacionActividad = async (pData: any) => {
  const { codBanco, fechaCorte, usuario } = pData;
  const params = { codBanco, fechaCorte };
  return executeStoredProcedure(
    "TEINSA_CONFIG.dbo.USP_VAL_REP_AT03_COMPARACION_ACTIVIDAD",
    params,
    usuario,
    codBanco,
    fechaCorte,
  );
};

export const callRepAT03ComparacionNacionalidad = async (pData: any) => {
  const { codBanco, fechaCorte, usuario } = pData;
  const params = { codBanco, fechaCorte };
  return executeStoredProcedure(
    "TEINSA_CONFIG.dbo.USP_VAL_REP_AT03_COMPARACION_REGION",
    params,
    usuario,
    codBanco,
    fechaCorte,
  );
};

export const callRepAT12Comparacion = async (pData: any) => {
  const { codBanco, fechaCorte, usuario } = pData;
  const params = { codBanco, fechaCorte };
  return executeStoredProcedure(
    "TEINSA_CONFIG.dbo.USP_VAL_REP_AT12_COMPARACION",
    params,
    usuario,
    codBanco,
    fechaCorte,
  );
};

export const callRepAT15Comparacion = async (pData: any) => {
  const { codBanco, fechaCorte, usuario } = pData;
  const params = { codBanco, fechaCorte };
  return executeStoredProcedure(
    "TEINSA_CONFIG.dbo.USP_VAL_REP_AT15_COMPARACION",
    params,
    usuario,
    codBanco,
    fechaCorte,
  );
};

export const callRepAT02AT07 = async (pData: any) => {
  const { codBanco, fechaCorte, usuario } = pData;
  const params = { codBanco, fechaCorte };
  return executeStoredProcedure(
    "TEINSA_CONFIG.dbo.USP_VAL_REP_CUADRE_AT02_AT07",
    params,
    usuario,
    codBanco,
    fechaCorte,
  );
};

export const callRepAT03R1 = async (pData: any) => {
  const { codBanco, fechaCorte, usuario } = pData;
  const params = { codBanco, fechaCorte };
  return executeStoredProcedure(
    "TEINSA_CONFIG.dbo.USP_VAL_REP_CUADRE_AT03_BAN06",
    params,
    usuario,
    codBanco,
    fechaCorte,
  );
};

export const callRepBAN10AT03RX = async (pData: any) => {
  const { codBanco, fechaCorte, usuario } = pData;
  const params = { codBanco, fechaCorte };
  return executeStoredProcedure(
    "TEINSA_CONFIG.dbo.USP_VAL_REP_BAN10_AT03_PROV_ESPECIFICA",
    params,
    usuario,
    codBanco,
    fechaCorte,
  );
};

export const callRepAT10EvapR1 = async (pData: any) => {
  const { codBanco, fechaCorte, usuario } = pData;
  const params = { codBanco, fechaCorte };
  return executeStoredProcedure(
    "TEINSA_CONFIG.dbo.USP_VAL_REP_CUADRE_AT10_EVAP",
    params,
    usuario,
    codBanco,
    fechaCorte,
  );
};

export const callRepAT12AT02R1 = async (pData: any) => {
  const { codBanco, fechaCorte, usuario } = pData;
  const params = { codBanco, fechaCorte };
  return executeStoredProcedure(
    "TEINSA_CONFIG.dbo.USP_VAL_REP_CUADRE_AT12_AT02_R1",
    params,
    usuario,
    codBanco,
    fechaCorte,
  );
};

export const callRepAT12AT02R2 = async (pData: any) => {
  const { codBanco, fechaCorte, usuario } = pData;
  const params = { codBanco, fechaCorte };
  return executeStoredProcedure(
    "TEINSA_CONFIG.dbo.USP_VAL_REP_CUADRE_AT12_AT02_R2",
    params,
    usuario,
    codBanco,
    fechaCorte,
  );
};

export const callRepAT12AT03R1 = async (pData: any) => {
  const { codBanco, fechaCorte, usuario } = pData;
  const params = { codBanco, fechaCorte };
  return executeStoredProcedure(
    "TEINSA_CONFIG.dbo.USP_VAL_REP_CUADRE_AT12_AT03_R1",
    params,
    usuario,
    codBanco,
    fechaCorte,
  );
};

export const callRepAT12AT03R2 = async (pData: any) => {
  const { codBanco, fechaCorte, usuario } = pData;
  const params = { codBanco, fechaCorte };
  return executeStoredProcedure(
    "TEINSA_CONFIG.dbo.USP_VAL_REP_CUADRE_AT12_AT03_R2",
    params,
    usuario,
    codBanco,
    fechaCorte,
  );
};

export const callRepAT12AT03R3 = async (pData: any) => {
  const { codBanco, fechaCorte, usuario } = pData;
  const params = { codBanco, fechaCorte };
  return executeStoredProcedure(
    "TEINSA_CONFIG.dbo.USP_VAL_REP_CUADRE_AT12_AT03_R3",
    params,
    usuario,
    codBanco,
    fechaCorte,
  );
};

export const callRepAT12AT03R4 = async (pData: any) => {
  const { codBanco, fechaCorte, usuario } = pData;
  const params = { codBanco, fechaCorte };
  return executeStoredProcedure(
    "TEINSA_CONFIG.dbo.USP_VAL_REP_CUADRE_AT12_AT03_R4",
    params,
    usuario,
    codBanco,
    fechaCorte,
  );
};

export const callRepCuadreAT12MontoGarantia = async (pData: any) => {
  const { codBanco, fechaCorte, usuario } = pData;
  const params = { codBanco, fechaCorte };
  return executeStoredProcedure(
    "TEINSA_CONFIG.dbo.USP_VAL_REP_CUADRE_AT12_MTO_GARANTIA_VALOR_PONDERADO",
    params,
    usuario,
    codBanco,
    fechaCorte,
  );
};

export const callRepAT15AT07R1 = async (pData: any) => {
  const { codBanco, fechaCorte, usuario } = pData;
  const params = { codBanco, fechaCorte };
  return executeStoredProcedure(
    "TEINSA_CONFIG.dbo.USP_VAL_REP_CUADRE_AT15_AT07",
    params,
    usuario,
    codBanco,
    fechaCorte,
  );
};

export const callRepBAN01AT05R1 = async (pData: any) => {
  const { codBanco, fechaCorte, idReporte, usuario } = pData;
  const params = { codBanco, fechaCorte, idReporte };
  return executeStoredProcedure(
    "TEINSA_CONFIG.dbo.USP_VAL_REP_CUADRE_BAN01_AT05",
    params,
    usuario,
    codBanco,
    fechaCorte,
  );
};

export const callRepBAN01AT08R1 = async (pData: any) => {
  const { codBanco, fechaCorte, idReporte, usuario } = pData;
  const params = { codBanco, fechaCorte, idReporte };
  return executeStoredProcedure(
    "TEINSA_CONFIG.dbo.USP_VAL_REP_CUADRE_BAN01_AT08",
    params,
    usuario,
    codBanco,
    fechaCorte,
  );
};

export const callRepComparacionBAN01AT08 = async (pData: any) => {
  const { codBanco, fechaCorte, idReporte, usuario } = pData;
  const params = { codBanco, fechaCorte, idReporte };
  return executeStoredProcedure(
    "TEINSA_CONFIG.dbo.USP_VAL_REP_CUADRE_BAN01_AT08",
    params,
    usuario,
    codBanco,
    fechaCorte,
  );
};

export const callRepCuadreBAN03AT03R1 = async (pData: any) => {
  const { codBanco, fechaCorte, usuario } = pData;
  const params = { codBanco, fechaCorte };
  return executeStoredProcedure(
    "TEINSA_CONFIG.dbo.USP_VAL_REP_CUADRE_BAN03_AT03_R1",
    params,
    usuario,
    codBanco,
    fechaCorte,
  );
};

export const callRepCuadreBAN03AT03R2 = async (pData: any) => {
  const { codBanco, fechaCorte, usuario } = pData;
  const params = { codBanco, fechaCorte };
  return executeStoredProcedure(
    "TEINSA_CONFIG.dbo.USP_VAL_REP_CUADRE_BAN03_AT03_R2",
    params,
    usuario,
    codBanco,
    fechaCorte,
  );
};

export const callRepCuadreBAN03AT03R3 = async (pData: any) => {
  const { codBanco, fechaCorte, usuario } = pData;
  const params = { codBanco, fechaCorte };
  return executeStoredProcedure(
    "TEINSA_CONFIG.dbo.USP_VAL_REP_CUADRE_BAN03_AT03_R3",
    params,
    usuario,
    codBanco,
    fechaCorte,
  );
};

export const callRepBAN03AT03TipoRelacion = async (pData: any) => {
  const { codBanco, fechaCorte, usuario } = pData;
  const params = { codBanco, fechaCorte };
  return executeStoredProcedure(
    "TEINSA_CONFIG.dbo.USP_VAL_REP_BAN03_AT03_TIPO_RELACION",
    params,
    usuario,
    codBanco,
    fechaCorte,
  );
};

export const callRepBAN06AT03Categoria = async (pData: any) => {
  const { codBanco, fechaCorte, usuario } = pData;
  const params = { codBanco, fechaCorte };
  return executeStoredProcedure(
    "TEINSA_CONFIG.dbo.USP_VAL_REP_CUADRE_BAN06_AT03_CLASIF_DIFERENTES",
    params,
    usuario,
    codBanco,
    fechaCorte,
  );
};

export const callRepBAN06AT03Global = async (pData: any) => {
  const { codBanco, fechaCorte, usuario } = pData;
  const params = { codBanco, fechaCorte };
  return executeStoredProcedure(
    "TEINSA_CONFIG.dbo.USP_VAL_REP_CUADRE_BAN06_AT03_GLOBALES",
    params,
    usuario,
    codBanco,
    fechaCorte,
  );
};

export const callRepBAN10AT03R1 = async (pData: any) => {
  const { codBanco, fechaCorte, usuario } = pData;
  const params = { codBanco, fechaCorte };
  return executeStoredProcedure(
    "TEINSA_CONFIG.dbo.USP_VAL_REP_BAN10_AT03_PROV_ESPECIFICA",
    params,
    usuario,
    codBanco,
    fechaCorte,
  );
};

export const callRepBAN10AT03R2 = async (pData: any) => {
  const { codBanco, fechaCorte, usuario } = pData;
  const params = { codBanco, fechaCorte };
  return executeStoredProcedure(
    "TEINSA_CONFIG.dbo.USP_VAL_REP_CUADRE_BAN10_AT03_CATEGORIA_NORMAL",
    params,
    usuario,
    codBanco,
    fechaCorte,
  );
};

export const callRepBAN10Only = async (pData: any) => {
  const { codBanco, fechaCorte, usuario } = pData;
  const params = { codBanco, fechaCorte };
  return executeStoredProcedure(
    "TEINSA_CONFIG.dbo.USP_VAL_REP_CUADRE_BAN10_GENERAL",
    params,
    usuario,
    codBanco,
    fechaCorte,
  );
};

export const callRepIndiceLiquidezSemanal = async (pData: any) => {
  const { codBanco, fechaCorte, usuario } = pData;
  const params = { codBanco, fechaCorte };
  return executeStoredProcedure(
    "TEINSA_CONFIG.dbo.USP_VAL_REP_INDICE_LIQUIDEZ_SEMANAL",
    params,
    usuario,
    codBanco,
    fechaCorte,
  );
};

export const callRepValidacionCruzada = async (pData: any) => {
  const { codBanco, fechaCorte, usuario } = pData;
  const params = { codBanco, fechaCorte };
  return executeStoredProcedure(
    "TEINSA_CONFIG.dbo.USP_VAL_REP_AT03_REVISION_CRUZADA_DATOS",
    params,
    usuario,
    codBanco,
    fechaCorte,
  );
};

export const callRepAT09All = async (pData: any) => {
  const { codBanco, fechaCorte, usuario } = pData;
  const params = { codBanco, fechaCorte };
  return executeStoredProcedure(
    "TEINSA_CONFIG.dbo.USP_VAL_REP_CUADRE_AT09_VS_AT02_AT03_AT15",
    params,
    usuario,
    codBanco,
    fechaCorte,
  );
};

export const callRepAT21Comparacion = async (pData: any) => {
  const { codBanco, fechaCorte, usuario } = pData;
  const params = { codBanco, fechaCorte };
  return executeStoredProcedure(
    "TEINSA_CONFIG.dbo.USP_VAL_REP_AT21_COMPARACION",
    params,
    usuario,
    codBanco,
    fechaCorte,
  );
};

export const callRepAT02AT21XRegion = async (pData: any) => {
  const { codBanco, fechaCorte, usuario } = pData;
  const params = { codBanco, fechaCorte };
  return executeStoredProcedure(
    "TEINSA_CONFIG.dbo.USP_VAL_REP_CUADRE_AT02_AT21",
    params,
    usuario,
    codBanco,
    fechaCorte,
  );
};

export const callRepAT03AT21XRegion = async (pData: any) => {
  const { codBanco, fechaCorte, usuario } = pData;
  const params = { codBanco, fechaCorte };
  return executeStoredProcedure(
    "TEINSA_CONFIG.dbo.USP_VAL_REP_CUADRE_AT03_AT21",
    params,
    usuario,
    codBanco,
    fechaCorte,
  );
};

export const callRepAT04AT21 = async (pData: any) => {
  const { codBanco, fechaCorte, usuario } = pData;
  const params = { codBanco, fechaCorte };
  return executeStoredProcedure(
    "TEINSA_CONFIG.dbo.USP_VAL_REP_CUADRE_AT04_AT21",
    params,
    usuario,
    codBanco,
    fechaCorte,
  );
};

export const callRepAT05AT21 = async (pData: any) => {
  const { codBanco, fechaCorte, usuario } = pData;
  const params = { codBanco, fechaCorte };
  return executeStoredProcedure(
    "TEINSA_CONFIG.dbo.USP_VAL_REP_CUADRE_AT05_AT21",
    params,
    usuario,
    codBanco,
    fechaCorte,
  );
};

export const callRepAT12AT21 = async (pData: any) => {
  const { codBanco, fechaCorte, usuario } = pData;
  const params = { codBanco, fechaCorte };
  return executeStoredProcedure(
    "TEINSA_CONFIG.dbo.USP_VAL_REP_CUADRE_AT12_AT21",
    params,
    usuario,
    codBanco,
    fechaCorte,
  );
};

export const callRepAT15AT21XRegion = async (pData: any) => {
  const { codBanco, fechaCorte, usuario } = pData;
  const params = { codBanco, fechaCorte };
  return executeStoredProcedure(
    "TEINSA_CONFIG.dbo.USP_VAL_REP_CUADRE_AT15_AT21",
    params,
    usuario,
    codBanco,
    fechaCorte,
  );
};

export const callRepAT21Only = async (pData: any) => {
  const { codBanco, fechaCorte, tipo, usuario } = pData;
  const params = { codBanco, fechaCorte, tipo };
  return executeStoredProcedure(
    "TEINSA_CONFIG.dbo.USP_VAL_REP_AT21_RESUMEN_GLOBAL",
    params,
    usuario,
    codBanco,
    fechaCorte,
  );
};

export const callRepAT21Only2 = async (pData: any) => {
  const { codBanco, fechaCorte, usuario } = pData;
  const params = { codBanco, fechaCorte };
  return executeStoredProcedure(
    "TEINSA_CONFIG.dbo.USP_VAL_REP_AT21_UTILIDAD",
    params,
    usuario,
    codBanco,
    fechaCorte,
  );
};

export const callRepCuadreAT21AT12AT03VsAT02 = async (pData: any) => {
  const { fechaCorte, usuario, codBanco } = pData;
  const params = { fechaCorte };
  return executeStoredProcedure(
    "TEINSA_CONFIG.dbo.USP_VAL_REP_CUADRE_AT21_AT12_AT03VSAT02",
    params,
    usuario,
    codBanco,
    fechaCorte,
  );
};

export const callRepAT07AT21XRegion = async (pData: any) => {
  const { codBanco, fechaCorte, usuario } = pData;
  const params = { codBanco, fechaCorte };
  return executeStoredProcedure(
    "TEINSA_CONFIG.dbo.USP_VAL_REP_CUADRE_AT07_AT21",
    params,
    usuario,
    codBanco,
    fechaCorte,
  );
};

export const callRepBA09_AT21 = async (pData: any) => {
  const { codBanco, fechaCorte, usuario } = pData;
  const params = { codBanco, fechaCorte };
  return executeStoredProcedure(
    "TEINSA_CONFIG.dbo.USP_VAL_REP_CUADRE_BA09_AT21",
    params,
    usuario,
    codBanco,
    fechaCorte,
  );
};

export const callCatalogosRepPrestamosExcluidos = async (pData: any) => {
  const { fechaCorte, atomo, usuario, codBanco } = pData;
  const params = { fechaCorte, atomo };
  return executeStoredProcedure(
    "TEINSA_CONFIG.dbo.USP_VAL_REP_PRESTAMOS_EXCLUIDOS_REGLAS",
    params,
    usuario,
    codBanco,
    fechaCorte,
  );
};

export const callRepPrestamosExcluidos = async (pData: any) => {
  const { codBanco, fechaCorte, idAtomo, numRegla, usuario } = pData;
  const params = { codBanco, fechaCorte, atomo: idAtomo, regla: numRegla };
  return executeStoredProcedure(
    "TEINSA_CONFIG.dbo.USP_VAL_REP_PRESTAMOS_EXCLUIDOS_AT03",
    params,
    usuario,
    codBanco,
    fechaCorte,
  );
};

export const callRepCuadreAT12BAN06TipoGarantia = async (pData: any) => {
  const { codBanco, fechaCorte, usuario } = pData;
  const params = { codBanco, fechaCorte };
  return executeStoredProcedure(
    "TEINSA_CONFIG.dbo.USP_VAL_REP_CUADRE_AT12_BA06_TIPOGARANTIAS",
    params,
    usuario,
    codBanco,
    fechaCorte,
  );
};

export const callRepComparacionBAN06CINU = async (pData: any) => {
  const { codBanco, fechaCorte, usuario } = pData;
  const params = { codBanco, fechaCorte };
  return executeStoredProcedure(
    "TEINSA_CONFIG.dbo.USP_VAL_REP_COMPARACION_BAN06_CINU",
    params,
    usuario,
    codBanco,
    fechaCorte,
  );
};

export const callRepComparacionBAN06CINUAT03 = async (pData: any) => {
  const { codBanco, fechaCorte, usuario } = pData;
  const params = { codBanco, fechaCorte };
  return executeStoredProcedure(
    "TEINSA_CONFIG.dbo.USP_VAL_REP_COMPARA_CINU_BAN06_AT03",
    params,
    usuario,
    codBanco,
    fechaCorte,
  );
};

export const callRepAT21UtilidadRegion = async (pData: any) => {
  const { codBanco, fechaCorte, usuario } = pData;
  const params = { codBanco, fechaCorte };
  return executeStoredProcedure(
    "TEINSA_CONFIG.dbo.USP_VAL_REP_AT21_UTILIDAD_REGION",
    params,
    usuario,
    codBanco,
    fechaCorte,
  );
};

export const callRepValidacionMatematica = async (pData: any) => {
  const { codBanco, fechaCorte, usuario } = pData;
  const params = { codBanco, fechaCorte };
  return executeStoredProcedure(
    "TEINSA_CONFIG.dbo.USP_VAL_REP_VALIDACION_MATEMATICA",
    params,
    usuario,
    codBanco,
    fechaCorte,
  );
};

export const callRepValidacionMatematicaDetalle = async (pData: any) => {
  const { codBanco, fechaCorte, numRegla, usuario } = pData;
  const params = { codBanco, fechaCorte, numRegla };
  return executeStoredProcedure(
    "TEINSA_CONFIG.dbo.USP_VAL_REP_VALIDACION_MATEMATICA_DRILLDOWN",
    params,
    usuario,
    codBanco,
    fechaCorte,
  );
};

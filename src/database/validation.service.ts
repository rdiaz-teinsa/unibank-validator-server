import { executeStoredProcedure } from "../helpers/database";
import sql from "mssql";
import { dbConfig } from "../helpers/global";

export const obtenerCatalogos = async () => {
  let conn: sql.ConnectionPool | undefined;
  try {
    conn = await new sql.ConnectionPool(dbConfig).connect();
    const [sqlBancos, sqlAtomos] = await Promise.all([
      conn
        .request()
        .query(
          "SELECT id_sib AS id, Cod_banco as value, nombre_banco as label, lic_internacional as internacional, logo, color_primary, font_color FROM TEINSA_CONFIG.dbo.TCOD_BANCO ORDER BY label",
        ),
      conn
        .request()
        .query(
          "SELECT ID_ATOMO, ATOMO, DESCRIPCION, TABLA, NOMBRE_ARCHIVO AS ARCHIVO, FRECUENCIA, CONVERTIR FROM TCOD_ATOMOS WHERE ACTIVO = 1 ORDER BY ID_ATOMO",
        ),
    ]);

    return {
      error: false,
      bancos: sqlBancos.recordset,
      atomos: sqlAtomos.recordset,
      frecuencias: [
        { value: "001", title: "Atomos Semanales" },
        { value: "002", title: "Atomos Mensuales" },
        { value: "003", title: "Atomos Trimestrales" },
        { value: "004", title: "Atomos Semestrales" },
        { value: "005", title: "Atomos Anuales" },
        { value: "006", title: "BAN Mensuales" },
        { value: "007", title: "BAN Trimestrales" },
        { value: "008", title: "BAN Semestrales" },
      ],
      at03s: [
        { value: 1, title: "AT03" },
        { value: 2, title: "AT03 CINU" },
      ],
      reglas: [],
    };
  } catch (err) {
    console.error("CONSULTA DE CATALOGOS: ", err);
    throw err;
  } finally {
    if (conn) {
      await conn.close();
    }
  }
};

export const gestionarPeriodo = async (pData: any) => {
  const {
    codBanco,
    fechaCorte,
    frecuencia,
    tipoCorrida,
    usuario,
    ejecutables,
  } = pData;
  const params = {
    cod_banco: codBanco,
    fecha_corte: fechaCorte,
    frecuencia,
    tipo_corrida: tipoCorrida,
    usuario,
    ejecutables,
  };
  return executeStoredProcedure(
    "TEINSA_CONFIG.dbo.USP_VAL_GESTIONAR_PERIODO",
    params,
    usuario,
    codBanco,
    fechaCorte,
  );
};

export const cargarDatosAtomos = async (pData: any) => {
  const {
    codBanco,
    fechaCorte,
    idPeriodo,
    usuario,
    os,
    ejecutables,
    rutaCarga,
    rutaLogs,
    errores,
  } = pData;
  const params = {
    cod_banco: codBanco,
    fecha_corte: fechaCorte,
    id_periodo: idPeriodo,
    usuario,
    os,
    ejecutables,
    archivo: rutaCarga,
    logs: rutaLogs,
    errores,
  };
  return executeStoredProcedure(
    "TEINSA_CONFIG.dbo.USP_VAL_CARGAR_DATOS_ATOMO",
    params,
    usuario,
    codBanco,
    fechaCorte,
  );
};

export const consultarAtomos = async (pData: any) => {
  const { codBanco, usuario, fechaCorte } = pData;
  const params = { cod_banco: codBanco };
  return executeStoredProcedure(
    "TEINSA_CONFIG.dbo.USP_VAL_CONSULTAR_ATOMOS",
    params,
    usuario,
    codBanco,
    fechaCorte,
  );
};

export const consultarPeriodos = async (pData: any) => {
  const { codBanco, usuario, fechaCorte } = pData;
  const params = { cod_banco: codBanco };
  return executeStoredProcedure(
    "TEINSA_CONFIG.dbo.USP_VAL_CONSULTAR_PERIODOS",
    params,
    usuario,
    codBanco,
    fechaCorte,
  );
};

export const consultarPeriodo = async (pData: any) => {
  const { idPeriodo, usuario, codBanco, fechaCorte } = pData;
  const params = { id_periodo: idPeriodo };
  return executeStoredProcedure(
    "TEINSA_CONFIG.dbo.USP_VAL_CONSULTAR_PERIODO",
    params,
    usuario,
    codBanco,
    fechaCorte,
  );
};

export const consultarProcesos = async (pData: any) => {
  const { idPeriodo, usuario, codBanco, fechaCorte } = pData;
  const params = { id_periodo: idPeriodo };
  return executeStoredProcedure(
    "TEINSA_CONFIG.dbo.USP_VAL_CONSULTAR_PROCESOS",
    params,
    usuario,
    codBanco,
    fechaCorte,
  );
};

export const consultarProcesosAtomo = async (pData: any) => {
  const { atomo, usuario, codBanco, fechaCorte } = pData;
  const params = { atomo };
  return executeStoredProcedure(
    "TEINSA_CONFIG.dbo.USP_VAL_CONSULTAR_PROCESOS_ATOMO",
    params,
    usuario,
    codBanco,
    fechaCorte,
  );
};

export const consultarProcesosFrecuencia = async (pData: any) => {
  const { frecuencia, idPeriodo, usuario, codBanco, fechaCorte } = pData;
  const params = { frecuencia, IdPeriodo: idPeriodo };
  return executeStoredProcedure(
    "TEINSA_CONFIG.dbo.USP_VAL_CONSULTAR_PROCESOS_FRECUENCIA",
    params,
    usuario,
    codBanco,
    fechaCorte,
  );
};

export const consultarValidacionesArchivo = async (pData: any) => {
  let conn: sql.ConnectionPool | undefined;
  try {
    conn = await new sql.ConnectionPool(dbConfig).connect();
    const settings = await conn
      .request()
      .input("atomo", sql.VarChar(10), pData.atomo)
      .output("validations", sql.VarChar(10000))
      .query(
        "EXEC TEINSA_CONFIG.dbo.Usp_Syntax_Validator @atomo, @validations",
      );

    if (settings.recordset.length > 0) {
      let validations = settings.recordset[0].headers;
      validations = validations.replaceAll("`", "");
      return {
        error: false,
        message: "La configuración solicitada se obtuvo con exito.",
        validations,
      };
    } else {
      return {
        error: false,
        message: "La configuración solicitada no existe.",
        validations: null,
      };
    }
  } catch (err) {
    console.error("Module ::: consultarValidacionesArchivo :: Error: ", err);
    throw err;
  } finally {
    if (conn) {
      await conn.close();
    }
  }
};

export const validacionFuncionalResumen = async (pData: any) => {
  const { codBanco, fechaSib, idAtomo, usuario } = pData;
  const params = {
    cod_banco: codBanco,
    fecha_sib: fechaSib,
    id_atomo: idAtomo,
  };
  return executeStoredProcedure(
    "TEINSA_CONFIG.dbo.USP_VAL_VALIDA_RESUMEN",
    params,
    usuario,
    codBanco,
    fechaSib,
  );
};

export const validacionEstructuralResumen = async (pData: any) => {
  const { codBanco, fechaSib, idAtomo, usuario } = pData;
  const params = {
    cod_banco: codBanco,
    fecha_sib: fechaSib,
    id_atomo: idAtomo,
  };
  return executeStoredProcedure(
    "TEINSA_CONFIG.dbo.USP_VAL_VALIDA_ESTRUCTURA_RESUMEN",
    params,
    usuario,
    codBanco,
    fechaSib,
  );
};

export const validacionFuncionalDetalle = async (pData: any) => {
  const { codBanco, fechaSib, idAtomo, idError, usuario } = pData;
  const params = {
    cod_banco: codBanco,
    fecha_sib: fechaSib,
    id_atomo: idAtomo,
    id_error: idError,
  };
  return executeStoredProcedure(
    "TEINSA_CONFIG.dbo.USP_VAL_VALIDA_RESUMEN_ENCA",
    params,
    usuario,
    codBanco,
    fechaSib,
  );
};

export const validacionEstructuralDetalle = async (pData: any) => {
  const { codBanco, fechaSib, idAtomo, idError, usuario } = pData;
  const params = {
    cod_banco: codBanco,
    fecha_sib: fechaSib,
    id_atomo: idAtomo,
    id_error: idError,
  };
  return executeStoredProcedure(
    "TEINSA_CONFIG.dbo.USP_VAL_VALIDA_RESUMEN_ENCA_ESTRUCT",
    params,
    usuario,
    codBanco,
    fechaSib,
  );
};

export const validacionDetalleErrorEstructural = async (pData: any) => {
  const {
    codBanco,
    fechaSib,
    idAtomo,
    idRec,
    idRecActual,
    idValidacion,
    usuario,
  } = pData;
  const params = {
    cod_banco: codBanco,
    fecha_sib: fechaSib,
    id_atomo: idAtomo,
    id_rec: idRec,
    id_rec_actual: idRecActual,
    id_validacion: idValidacion,
  };
  return executeStoredProcedure(
    "TEINSA_CONFIG.dbo.USP_VAL_VALIDA_RESUMEN_DETA_ESTRUCT",
    params,
    usuario,
    codBanco,
    fechaSib,
  );
};

export const validacionDetalleErrorFuncional = async (pData: any) => {
  const {
    codBanco,
    fechaSib,
    idAtomo,
    idRec,
    idRecActual,
    idValidacion,
    usuario,
  } = pData;
  const params = {
    cod_banco: codBanco,
    fecha_sib: fechaSib,
    id_atomo: idAtomo,
    id_rec: idRec,
    id_rec_actual: idRecActual,
    id_validacion: idValidacion,
  };
  return executeStoredProcedure(
    "TEINSA_CONFIG.dbo.USP_VAL_VALIDA_RESUMEN_DETA",
    params,
    usuario,
    codBanco,
    fechaSib,
  );
};

export const validacionConsultaIndicadores = async (pData: any) => {
  const { codBanco, atomo, fechaSIB, usuario } = pData;
  const params = { cod_banco: codBanco, atomo, fechaSIB };
  return executeStoredProcedure(
    "TEINSA_CONFIG.dbo.USP_VAL_RESUMEN_VALIDACIONES_INDICADORES",
    params,
    usuario,
    codBanco,
    fechaSIB,
  );
};

export const validacionConsultaTablero = async (pData: any) => {
  const { codBanco, atomo, usuario, fechaSib } = pData;
  const params = { cod_banco: codBanco, atomo };
  return executeStoredProcedure(
    "TEINSA_CONFIG.dbo.USP_VAL_RESUMEN_VALIDACIONES_GRAFICAS",
    params,
    usuario,
    codBanco,
    fechaSib,
  );
};

export const validacionConsultaBitacora = async (pData: any) => {
  const { codBanco, usuario, fechaSib } = pData;
  const params = { cod_banco: codBanco };
  return executeStoredProcedure(
    "TEINSA_CONFIG.dbo.USP_VAL_VERIFICA_CARGAS",
    params,
    usuario,
    codBanco,
    fechaSib,
  );
};

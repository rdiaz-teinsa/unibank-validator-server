const sql = require('mssql')
import {dbConfig} from '../_helpers/global';
import {registrarLog} from "../_helpers/utils";



export const obtenerCatalogos = async () => {
    let conn = new sql.ConnectionPool(dbConfig);
    await conn.connect();
    try {
        let sqlBancos = await conn.request().query(`SELECT id_sib AS id, Cod_banco as value, nombre_banco as label, lic_internacional as internacional, logo, color_primary, font_color FROM TEINSA_CONFIG.dbo.TCOD_BANCO ORDER BY label`);
        let sqlAtomos = await conn.request().query(`SELECT ID_ATOMO, ATOMO, DESCRIPCION, TABLA, NOMBRE_ARCHIVO AS ARCHIVO, FRECUENCIA FROM TCOD_ATOMOS WHERE ACTIVO = 1 ORDER BY ID_ATOMO`);
        await conn.close();

        let response =  {
            "error": false,
            "bancos": sqlBancos.recordset,
            "atomos": sqlAtomos.recordset,
            "frecuencias": [
                {"value": "001", "title": "Atomos Semanales"},
                {"value": "002", "title": "Atomos Mensuales"},
                {"value": "003", "title": "Atomos Trimestrales"},
                {"value": "004", "title": "Atomos Semestrales"},
                {"value": "005", "title": "Atomos Anuales"},
                {"value": "006", "title": "BAN Mensuales"},
                {"value": "007", "title": "BAN Trimestrales"},
                {"value": "008", "title": "BAN Semestrales"},
            ],
            "at03s": [
                {"value": 1, "title": "AT03"},
                {"value": 2, "title": "AT03 CINU"}
            ],
            "reglas": []
        };
        // console.log("Respuesta: ", response);

        return response;

    } catch (err) {
        console.error('CONSULTA DE CATALOGOS: ', err);
        // return {"error": true, "BANCOS": []};
        throw err;
    }
};

export const gestionarPeriodo = async (pData : any) => {
    let conn = new sql.ConnectionPool(dbConfig);
    await conn.connect();
    try {
        let result = await conn.request()
            .input('cod_banco', sql.NVarChar(4), pData.codBanco)
            .input('fecha_corte', sql.NVarChar(10), pData.fechaCorte)
            .input('frecuencia', sql.NVarChar(3), pData.frecuencia)
            .input('tipo_corrida', sql.NVarChar(10), pData.tipoCorrida)
            .input('usuario', sql.NVarChar(50), pData.usuario)
            .input('ejecutables', sql.NVarChar(500), pData.ejecutables)
            .query('EXEC TEINSA_CONFIG.dbo.USP_VAL_GESTIONAR_PERIODO @cod_banco, @fecha_corte, @frecuencia, @tipo_corrida, @usuario, @ejecutables');
        await registrarLog(conn, pData.usuario, pData.codBanco, pData.fechaCorte, 'GESTIONAR PERIODO', pData);
        await conn.close();
        // console.log("PROCESOS: ", result.recordset)
        if(result.recordset.length > 0) {
            return {"error": false, "record": result.recordset};
        } else {
            return {"error": true, "message": "No existen registros asociados a los datos ingresados"};
        }
    } catch (err) {
        console.error('GESTIÓN DE PERIODOS: ', err);
        throw err;
    }
};

export const cargarDatosAtomos = async (pData : any) => {
    let conn = new sql.ConnectionPool(dbConfig);
    await conn.connect();
    try {
        let result = await conn.request()
            .input('cod_banco', sql.NVarChar(4), pData.codBanco)
            .input('fecha_corte', sql.NVarChar(10), pData.fechaCorte)
            .input('id_periodo', sql.NVarChar(20), pData.idPeriodo)
            .input('usuario', sql.NVarChar(50), pData.usuario)
            .input('os', sql.NVarChar(10), pData.os)
            .input('ejecutables', sql.NVarChar(500), pData.ejecutables)
            .input('archivo', sql.NVarChar(150), pData.rutaCarga)
            .input('logs', sql.NVarChar(150), pData.rutaLogs)
            .input('errores', sql.Int, pData.errores)
            .query('EXEC TEINSA_CONFIG.dbo.USP_VAL_CARGAR_DATOS_ATOMO @cod_banco, @fecha_corte, @id_periodo, @usuario, @os, @ejecutables, @archivo, @logs, @errores');

        await registrarLog(conn, pData.usuario, pData.codBanco, pData.fechaCorte, 'CARGAR DATOS', pData);
        await conn.close();
        // console.log("PERIODOS: ", result.recordset)
        if(result.recordset.length > 0) {
            return {"error": false, "record": result.recordset};
        } else {
            return {"error": false, "message": "No existen registros asociados a los datos ingresados", "record": []};
        }

    } catch (err) {
        return {"error": true, "message": err, "record": []};
        // console.error('CARGA DE ATOMOS: ', err);
        // throw err;
    }
};









export const consultarAtomos = async (pData : any) => {
    let conn = new sql.ConnectionPool(dbConfig);
    await conn.connect();
    try {
        let result = await conn.request()
            .input('cod_banco', sql.NVarChar(4), pData.codBanco)
            .query('EXEC TEINSA_CONFIG.dbo.USP_VAL_CONSULTAR_ATOMOS @cod_banco');
        await conn.close();
        // console.log("PERIODOS: ", result.recordset)
        if(result.recordset.length > 0) {
            return {"error": false, "record": result.recordset};
        } else {
            return {"error": true, "message": "No existen registros asociados a los datos ingresados"};
        }

    } catch (err) {
        console.error('CONSULTA DE PERIODOS: ', err);
        throw err;
    }
};

export const consultarPeriodos = async (pData : any) => {
    let conn = new sql.ConnectionPool(dbConfig);
    await conn.connect();
    try {
        let result = await conn.request()
            .input('cod_banco', sql.NVarChar(4), pData.codBanco)
            .query('EXEC TEINSA_CONFIG.dbo.USP_VAL_CONSULTAR_PERIODOS @cod_banco');
        await conn.close();
        // console.log("PERIODOS: ", result.recordset)
        if(result.recordset.length > 0) {
            return {"error": false, "record": result.recordset};
        } else {
            return {"error": true, "message": "No existen registros asociados a los datos ingresados"};
        }

    } catch (err) {
        console.error('CONSULTA DE PERIODOS: ', err);
        throw err;
    }
};

export const consultarPeriodo = async (pData : any) => {
    let conn = new sql.ConnectionPool(dbConfig);
    await conn.connect();
    try {
        let result = await conn.request()
            .input('id_periodo', sql.NVarChar(20), pData.idPeriodo)
            .query('EXEC TEINSA_CONFIG.dbo.USP_VAL_CONSULTAR_PERIODO @id_periodo');
        await conn.close();
        // console.log("PERIODOS: ", result.recordset[0])
        if(result.recordset.length > 0) {
            return {"error": false, "record": result.recordset[0]};
        } else {
            return {"error": true, "message": "No existen registros asociados a los datos ingresados"};
        }

    } catch (err) {
        console.error('CONSULTA DE PERIODO: ', err);
        throw err;
    }
};

export const consultarProcesos = async (pData : any) => {
    let conn = new sql.ConnectionPool(dbConfig);
    await conn.connect();
    try {
        let result = await conn.request()
            .input('id_periodo', sql.NVarChar(20), pData.idPeriodo)
            .query('EXEC TEINSA_CONFIG.dbo.USP_VAL_CONSULTAR_PROCESOS @id_periodo');
        await conn.close();
        // console.log("PROCESOS: ", result.recordset)
        if(result.recordset.length > 0) {
            return {"error": false, "record": result.recordset};
        } else {
            return {"error": true, "message": "No existen registros asociados a los datos ingresados"};
        }

    } catch (err) {
        console.error('CONSULTA DE PROCESOS: ', err);
        throw err;
    }
};

export const consultarProcesosAtomo = async (pData : any) => {
    let conn = new sql.ConnectionPool(dbConfig);
    await conn.connect();
    try {
        let result = await conn.request()
            .input('atomo', sql.NVarChar(20), pData.atomo)
            .query('EXEC TEINSA_CONFIG.dbo.USP_VAL_CONSULTAR_PROCESOS_ATOMO @atomo');
        await conn.close();
        // console.log("PROCESOS: ", result.recordset)
        if(result.recordset.length > 0) {
            return {"error": false, "record": result.recordset};
        } else {
            return {"error": true, "message": "No existen registros asociados a los datos ingresados"};
        }

    } catch (err) {
        console.error('CONSULTA DE PROCESOS: ', err);
        throw err;
    }
};

export const consultarProcesosFrecuencia = async (pData : any) => {
    let conn = new sql.ConnectionPool(dbConfig);
    await conn.connect();
    try {
        let result = await conn.request()
            .input('frecuencia', sql.NVarChar(4), pData.frecuencia)
            .input('IdPeriodo', sql.NVarChar(20), pData.idPeriodo)
            .query('EXEC TEINSA_CONFIG.dbo.USP_VAL_CONSULTAR_PROCESOS_FRECUENCIA @frecuencia, @IdPeriodo');
        await conn.close();
        // console.log("PROCESOS: ", result.recordset)
        if(result.recordset.length > 0) {
            return {"error": false, "record": result.recordset};
        } else {
            return {"error": false, "message": "No existen registros asociados a los datos ingresados", "record": []};
        }

    } catch (err) {
        console.error('CONSULTA DE PROCESOS: ', err);
        throw err;
    }
};





// TODO: Investigar Continuidad de Servicio


export const consultarValidacionesArchivo = async (pData : any) => {
    let conn = new sql.ConnectionPool(dbConfig);
    await conn.connect();
    try {
        let response : any = {};
        let settings = await conn.request()
            .input('atomo', sql.VarChar(10), pData.atomo)
            .output('validations', sql.VarChar(10000))
            .query('EXEC TEINSA_CONFIG.dbo.Usp_Syntax_Validator @atomo, @validations');

        if(settings.recordset.length > 0) {
            let validations = settings.recordset[0].headers;
            validations = validations.replaceAll('`', '');
            // console.log("TEMP: ", settings.recordset[0].headers)
            response =  {"error": false, "message": "La configuración solicitada se obtuvo con exito.", "validations": validations};
        } else {
            response =  {"error": false, "message": "La configuración solicitada no existe.", "validations": null};
        }

        await conn.close();
        return response;
    } catch (err) {
        console.error('Module ::: consultarValidacionesArchivo :: Error: ', err);
        throw err;
    }
};







// TODO: Servicios Utilizados en Validaciones

export const validacionFuncionalResumen = async (pData : any) => {
    let conn = new sql.ConnectionPool(dbConfig);
    await conn.connect();
    try {
        let result = await conn.request()
            .input('cod_banco', sql.NVarChar(4), pData.codBanco)
            .input('fecha_sib', sql.NVarChar(10), pData.fechaSib)
            .input('id_atomo', sql.Int, pData.idAtomo)
            .query('EXEC TEINSA_CONFIG.dbo.USP_VAL_VALIDA_RESUMEN @id_atomo, @cod_banco, @fecha_sib');
        await registrarLog(conn, pData.usuario, pData.codBanco, pData.fechaSib, 'VALIDACION FUNCIONAL RESUMEN', pData);
        await conn.close();
        console.log("VALIDACION FUNCIONAL RESUMEN: ", result.recordset)
        if(result.recordset.length > 0) {
            return {"error": false, "message": "El proceso de validaciónn ha finalizado.", "record": result.recordset};
        } else {
            return {"error": false, "message": "No existen registros con error.", "record": []};
        }

    } catch (err) {
        console.error('VALIDACIÓN FUNCIONAL RESUMEN: ', err);
        throw err;
    }
};

export const validacionEstructuralResumen = async (pData : any) => {
    let conn = new sql.ConnectionPool(dbConfig);
    await conn.connect();
    try {
        let result = await conn.request()
            .input('cod_banco', sql.NVarChar(4), pData.codBanco)
            .input('fecha_sib', sql.NVarChar(10), pData.fechaSib)
            .input('id_atomo', sql.Int, pData.idAtomo)
            .query('EXEC TEINSA_CONFIG.dbo.USP_VAL_VALIDA_ESTRUCTURA_RESUMEN @cod_banco, @fecha_sib, @id_atomo');
        await registrarLog(conn, pData.usuario, pData.codBanco, pData.fechaSib, 'VALIDACION ESTRUCTURAL RESUMEN', pData);
        await conn.close();
        console.log("VALIDACION ESTRUCTURAL RESUMEN: ", result.recordset)
        if(result.recordset.length > 0) {
            return {"error": false, "message": "El proceso de validaciónn ha finalizado.", "record": result.recordset};
        } else {
            return {"error": false, "message": "No existen registros con error.", "record": []};
        }

    } catch (err) {
        console.error('VALIDACIÓN ESTRUCTURAL RESUMEN: ', err);
        throw err;
    }
};

export const validacionFuncionalDetalle = async (pData : any) => {
    let conn = new sql.ConnectionPool(dbConfig);
    await conn.connect();
    try {
        let result = await conn.request()
            .input('cod_banco', sql.NVarChar(4), pData.codBanco)
            .input('fecha_sib', sql.NVarChar(10), pData.fechaSib)
            .input('id_atomo', sql.Int, pData.idAtomo)
            .input('id_error', sql.Int, pData.idError)
            .query('exec TEINSA_CONFIG.dbo.USP_VAL_VALIDA_RESUMEN_ENCA @cod_banco, @fecha_sib, @id_atomo, @id_error');
        await registrarLog(conn, pData.usuario, pData.codBanco, pData.fechaSib, 'VALIDACION FUNCIONAL DETALLE', pData);
        await conn.close();
        console.log("VALIDACION FUNCIONAL DETALLE: ", result.recordset)
        if(result.recordset.length > 0) {
            return {"error": false, "message": "El proceso de validaciónn ha finalizado.", "record": result.recordset};
        } else {
            return {"error": false, "message": "No existen registros con error.", "record": []};
        }

    } catch (err) {
        console.error('VALIDACIÓN FUNCIONAL DETALLE: ', err);
        throw err;
    }
};

export const validacionEstructuralDetalle = async (pData : any) => {
    let conn = new sql.ConnectionPool(dbConfig);
    await conn.connect();
    try {
        let result = await conn.request()
            .input('cod_banco', sql.NVarChar(4), pData.codBanco)
            .input('fecha_sib', sql.NVarChar(10), pData.fechaSib)
            .input('id_atomo', sql.Int, pData.idAtomo)
            .input('id_error', sql.Int, pData.idError)
            .query('EXEC TEINSA_CONFIG.dbo.USP_VAL_VALIDA_RESUMEN_ENCA_ESTRUCT @cod_banco, @fecha_sib, @id_atomo, @id_error');
        await registrarLog(conn, pData.usuario, pData.codBanco, pData.fechaSib, 'VALIDACION ESTRUCTURAL DETALLE', pData);
        await conn.close();
        console.log("VALIDACION ESTRUCTURAL DETALLE: ", result)
        if(result.recordset.length > 0) {
            return {"error": false, "message": "El proceso de validaciónn ha finalizado.", "record": result.recordset};
        } else {
            return {"error": false, "message": "No existen registros con error.", "record": []};
        }

    } catch (err) {
        console.error('VALIDACIÓN ESTRUCTURAL DETALLE: ', err);
        throw err;
    }
};

export const validacionDetalleErrorEstructural = async (pData : any) => {
    let conn = new sql.ConnectionPool(dbConfig);
    await conn.connect();
    try {
        let result = await conn.request()
            .input('cod_banco', sql.NVarChar(4), pData.codBanco)
            .input('fecha_sib', sql.NVarChar(10), pData.fechaSib)
            .input('id_atomo', sql.Int, pData.idAtomo)
            .input('id_rec', sql.Int, pData.idRec)
            .input('id_rec_actual', sql.Int, pData.idRecActual)
            .input('id_validacion', sql.Int, pData.idValidacion)
            .query('EXEC TEINSA_CONFIG.dbo.USP_VAL_VALIDA_RESUMEN_DETA_ESTRUCT @cod_banco, @fecha_sib, @id_atomo, @id_rec, @id_rec_actual, @id_validacion');
        await registrarLog(conn, pData.usuario, pData.codBanco, pData.fechaSib, 'VALIDACION ESTRUCTURAL ERROR', pData);
        await conn.close();
        console.log("VALIDACION DETALLE ERROR: ", result.recordset)
        if(result.recordset.length > 0) {
            return {"error": false, "record": result.recordset};
        } else {
            return {"error": true, "message": "No existen registros asociados a los datos ingresados"};
        }

    } catch (err) {
        console.error('VALIDACIÓN DETALLE ERROR: ', err);
        throw err;
    }
};

export const validacionDetalleErrorFuncional = async (pData : any) => {
    let conn = new sql.ConnectionPool(dbConfig);
    await conn.connect();
    try {
        let result = await conn.request()
            .input('cod_banco', sql.NVarChar(4), pData.codBanco)
            .input('fecha_sib', sql.NVarChar(10), pData.fechaSib)
            .input('id_atomo', sql.Int, pData.idAtomo)
            .input('id_rec', sql.Int, pData.idRec)
            .input('id_rec_actual', sql.Int, pData.idRecActual)
            .input('id_validacion', sql.Int, pData.idValidacion)
            .query('EXEC TEINSA_CONFIG.dbo.USP_VAL_VALIDA_RESUMEN_DETA @cod_banco, @fecha_sib, @id_atomo, @id_rec, @id_rec_actual, @id_validacion');
        await registrarLog(conn, pData.usuario, pData.codBanco, pData.fechaSib, 'VALIDACION FUNCIONAL ERROR', pData);
        await conn.close();
        console.log("VALIDACION DETALLE ERROR: ", result.recordset)
        if(result.recordset.length > 0) {
            return {"error": false, "record": result.recordset};
        } else {
            return {"error": true, "message": "No existen registros asociados a los datos ingresados"};
        }

    } catch (err) {
        console.error('VALIDACIÓN DETALLE ERROR: ', err);
        throw err;
    }
};

export const validacionConsultaIndicadores = async (pData : any) => {
    let conn = new sql.ConnectionPool(dbConfig);
    await conn.connect();
    try {
        let result = await conn.request()
            .input('cod_banco', sql.NVarChar(4), pData.codBanco)
            .input('atomo', sql.NVarChar(10), pData.atomo)
            .input('fechaSIB', sql.NVarChar(10), pData.fechaSIB)
            .query('EXEC TEINSA_CONFIG.dbo.USP_VAL_RESUMEN_VALIDACIONES_INDICADORES @atomo, @cod_banco, @fechaSIB');
        await registrarLog(conn, pData.usuario, pData.codBanco, pData.fechaSIB, 'VALIDACIONAL CONSULTA INDICADORES', pData);
        await conn.close();
        console.log("VALIDACION CONSULTA INDICADORES: ", result.recordset)
        if(result.recordset.length > 0) {
            return {"error": false, "record": result.recordset};
        } else {
            return {"error": true, "message": "No existen registros asociados a los datos ingresados"};
        }

    } catch (err) {
        console.error('VALIDACIÓN CONSULTA INDICADORES: ', err);
        throw err;
    }
};

export const validacionConsultaTablero = async (pData : any) => {
    let conn = new sql.ConnectionPool(dbConfig);
    await conn.connect();
    try {
        let result = await conn.request()
            .input('cod_banco', sql.NVarChar(4), pData.codBanco)
            .input('atomo', sql.NVarChar(10), pData.atomo)
            .query('EXEC TEINSA_CONFIG.dbo.USP_VAL_RESUMEN_VALIDACIONES_GRAFICAS @atomo, @cod_banco');
        await registrarLog(conn, pData.usuario, pData.codBanco, pData.fechaSib, 'VALIDACION CONSULTA TABLERO', pData);
        await conn.close();
        console.log("VALIDACION CONSULTA TABLERO: ", result.recordset)
        if(result.recordset.length > 0) {
            return {"error": false, "record": result.recordset};
        } else {
            return {"error": true, "message": "No existen registros asociados a los datos ingresados"};
        }

    } catch (err) {
        console.error('VALIDACIÓN CONSULTA TABLERO: ', err);
        throw err;
    }
};

export const validacionConsultaBitacora = async (pData : any) => {
    let conn = new sql.ConnectionPool(dbConfig);
    await conn.connect();
    try {
        let result = await conn.request()
            .input('cod_banco', sql.NVarChar(4), pData.codBanco)
            .query('EXEC TEINSA_CONFIG.dbo.USP_VAL_VERIFICA_CARGAS @cod_banco');
        // await registrarLog(conn, pData.usuario, pData.codBanco, pData.fechaSib, 'VALIDACION CONSULTA BITACORA', pData);
        await conn.close();
        console.log("VALIDACION CONSULTA BITACORA: ", result.recordset)
        if(result.recordset.length > 0) {
            return {"error": false, "record": result.recordset};
        } else {
            return {"error": true, "message": "No existen registros en la bitacora para el banco seleccionado"};
        }

    } catch (err) {
        console.error('VALIDACIÓN CONSULTA BITACORA: ', err);
        throw err;
    }
};
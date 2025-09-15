const sql = require('mssql')
import { dbConfig } from '../_helpers/global';
import { registrarLog } from "../_helpers/utils";

// 000 - COMPARACIONES
export const callRepComparacionCatalogos = async (pData : any) => {
    let conn = new sql.ConnectionPool(dbConfig);
    await conn.connect();
    try {
        let result = await conn.request()
            .query('exec TEINSA_VAL.dbo.USP_CATALOGOS_COMPARACION');
        await registrarLog(conn, pData.usuario, pData.codBanco, pData.fechaSib, 'callRepComparacionCatalogos', pData);
        await conn.close();
        // console.log("Respuesta Servicio: ", result);

        let atoms = [];
        let atomsFields = [];
        let atomsSumFields = [];

        if(result.recordsets[0].length > 0) {
            atoms = result.recordsets[0];
        }

        if(result.recordsets[1].length > 0) {
            atomsFields = result.recordsets[1];
        }

        if(result.recordsets[2].length > 0) {
            atomsSumFields = result.recordsets[2];
        }

        return {"error": false, "atoms": atoms, "atomsFields": atomsFields, "atomsSumFields": atomsSumFields };

    } catch (err) {
        console.error('Se identificaron errores en la ejecución del SP, Error: ', err);
       throw err;
    }
};

// 100 - COMPARACIONES
export const callRepComparacion = async (pData : any) => {
    let conn = new sql.ConnectionPool(dbConfig);
    await conn.connect();
    try {
        let result = await conn.request()
            .input('idAtomo', sql.Int, pData.idAtomo)
            .input('codBanco', sql.VarChar(10), pData.codBanco)
            .input('fechaSIB', sql.VarChar(10), pData.fechaSIB)
            .input('campoComparacion', sql.VarChar(50), pData.campoComparacion)
            .input('campoSumatoria', sql.VarChar(50), pData.campoSumatoria)
            .query('exec TEINSA_VAL.dbo.Usp_Rep_Comparacion @idAtomo, @codBanco, @fechaSIB, @campoComparacion, @campoSumatoria');
        await conn.close();
        // console.log("Respuesta Servicio:: ", result.recordset)
        console.log("Respuesta Servicio: ", result);
        if(result.recordset.length > 0) {
            return {"error": false, "input": pData, "record": result.recordset};
        } else {
            return {"error": false, "message": "No existen registros asociados a su consulta.", "record": []};
        }
    } catch (err) {
        console.error('Se identificaron errores en la ejecución del SP, Error: ', err);
        throw err;
    }
};

// 111 - COMPARACIÓN AT03
export const callRepAT03Comparacion = async (pData : any) => {
    let conn = new sql.ConnectionPool(dbConfig);
    await conn.connect();
    try {
        let result = await conn.request()
            .input('codBanco', sql.VarChar(10), pData.codBanco)
            .input('fechaCorte', sql.Date(), pData.fechaCorte)
            .query('exec TEINSA_VAL.dbo.Usp_Rep_AT03_Comparacion @codBanco, @fechaCorte');
        await conn.close();
        console.log("Respuesta Servicio: ", result.recordset)
        if(result.recordset.length > 0) {
            return {"error": false, "record": result.recordset};
        } else {
            return {"error": false, "message": "No existen registros asociados a su consulta.", "record": []};
        }
    } catch (err) {
        console.error('Se identificaron errores en la ejecución del SP, Error: ', err);
        throw err;
    }
};

// 112 - COMPARACIÓN AT03 POR ACTIVIDAD
export const callRepAT03ComparacionActividad = async (pData : any) => {
    let conn = new sql.ConnectionPool(dbConfig);
    await conn.connect();
    try {
        let result = await conn.request()
            .input('codBanco', sql.VarChar(10), pData.codBanco)
            .input('fechaCorte', sql.Date(), pData.fechaCorte)
            .query('exec TEINSA_VAL.dbo.Usp_Rep_AT03_Comparacion_Actividad @codBanco, @fechaCorte');
        await conn.close();
        console.log("Respuesta Servicio: ", result.recordset)
        if(result.recordset.length > 0) {
            return {"error": false, "record": result.recordset};
        } else {
            return {"error": false, "message": "No existen registros asociados a su consulta.", "record": []};
        }
    } catch (err) {
        console.error('Se identificaron errores en la ejecución del SP, Error: ', err);
        throw err;
    }
};

// 113 - COMPARACIÓN AT03 POR REGIÓN
export const callRepAT03ComparacionNacionalidad = async (pData : any) => {
    let conn = new sql.ConnectionPool(dbConfig);
    await conn.connect();
    try {
        let result = await conn.request()
            .input('codBanco', sql.VarChar(10), pData.codBanco)
            .input('fechaCorte', sql.Date(), pData.fechaCorte)
            .query('exec TEINSA_VAL.dbo.Usp_Rep_AT03_Comparacion_Nacionalidad @codBanco, @fechaCorte');
        await conn.close();
        console.log("Respuesta Servicio: ", result)
        if(result.recordset.length > 0) {
            return {"error": false, "record": result.recordset};
        } else {
            return {"error": false, "message": "No existen registros asociados a su consulta.", "record": []};
        }
    } catch (err) {
        console.error('Se identificaron errores en la ejecución del SP, Error: ', err);
        throw err;
    }
};

// 114 - COMPARACIÓN AT12
export const callRepAT12Comparacion = async (pData : any) => {
    let conn = new sql.ConnectionPool(dbConfig);
    await conn.connect();
    try {
        let result = await conn.request()
            .input('codBanco', sql.VarChar(10), pData.codBanco)
            .input('fechaCorte', sql.Date(), pData.fechaCorte)
            .query('exec TEINSA_VAL.dbo.Usp_Rep_AT12_Comparacion @codBanco, @fechaCorte');
        await conn.close();
        console.log("Respuesta Servicio: ", result.recordset)
        if(result.recordset.length > 0) {
            return {"error": false, "record": result.recordset};
        } else {
            return {"error": false, "message": "No existen registros asociados a su consulta.", "record": []};
        }
    } catch (err) {
        console.error('Se identificaron errores en la ejecución del SP, Error: ', err);
        throw err;
    }
};

// 115 - COMPARACIÓN AT15
export const callRepAT15Comparacion = async (pData : any) => {
    let conn = new sql.ConnectionPool(dbConfig);
    await conn.connect();
    try {
        let result = await conn.request()
            .input('codBanco', sql.VarChar(10), pData.codBanco)
            .input('fechaCorte', sql.Date(), pData.fechaCorte)
            .query('exec TEINSA_VAL.dbo.Usp_Rep_AT15_Comparacion @codBanco, @fechaCorte');
        await conn.close();
        console.log("Respuesta Servicio: ", result.recordset)
        if(result.recordset.length > 0) {
            return {"error": false, "record": result.recordset};
        } else {
            return {"error": false, "message": "No existen registros asociados a su consulta.", "record": []};
        }
    } catch (err) {
        console.error('Se identificaron errores en la ejecución del SP, Error: ', err);
        throw err;
    }
};

// 210 - CUADRE AT02 vs AT07
export const callRepAT02AT07 = async (pData : any) => {
    let conn = new sql.ConnectionPool(dbConfig);
    await conn.connect();
    try {
        let result = await conn.request()
            .input('codBanco', sql.VarChar(10), pData.codBanco)
            .input('fechaCorte', sql.Date(), pData.fechaCorte)
            .query('exec TEINSA_VAL.dbo.USC_AT02_AT07 @codBanco, @fechaCorte');
        await conn.close();
        console.log("Respuesta Servicio: ", result.recordset)
        if(result.recordset.length > 0) {
            return {"error": false, "record": result.recordset};
        } else {
            return {"error": false, "message": "No existen registros asociados a su consulta.", "record": []};
        }
    } catch (err) {
        console.error('Se identificaron errores en la ejecución del SP, Error: ', err);
        throw err;
    }
};

// 220- CUADRE AT03 vs BAN06
export const callRepAT03R1 = async (pData : any) => {
    let conn = new sql.ConnectionPool(dbConfig);
    await conn.connect();
    try {
        let result = await conn.request()
            .input('codBanco', sql.VarChar(10), pData.codBanco)
            .input('fechaCorte', sql.Date(), pData.fechaCorte)
            .query('exec TEINSA_VAL.dbo.USC_BAN06_AT03_R1 @codBanco, @fechaCorte');
        await conn.close();
        console.log("Respuesta Servicio: ", result.recordset)
        if(result.recordset.length > 0) {
            return {"error": false, "record": result.recordset};
        } else {
            return {"error": false, "message": "No existen registros asociados a su consulta.", "record": []};
        }
    } catch (err) {
        console.error('Se identificaron errores en la ejecución del SP, Error: ', err);
        throw err;
    }
};

// TODO: 245 - Cuadre AT10 vs EVAP
export const callRepAT10EvapR1 = async (pData : any) => {
    let conn = new sql.ConnectionPool(dbConfig);
    await conn.connect();
    try {
        let result = await conn.request()
            .input('codBanco', sql.VarChar(10), pData.codBanco)
            .input('fechaCorte', sql.Date(), pData.fechaCorte)
            .query('exec TEINSA_VAL.dbo.USC_AT10_EVAP_R1 @codBanco, @fechaCorte');
        await conn.close();
        console.log("Respuesta Servicio: ", result.recordset)
        if(result.recordset.length > 0) {
            return {"error": false, "record": result.recordset};
        } else {
            return {"error": false, "message": "No existen registros asociados a su consulta.", "record": []};
        }
    } catch (err) {
        console.error('Se identificaron errores en la ejecución del SP, Error: ', err);
        throw err;
    }
};

// 280 - CUADRE AT15  vs AT07
export const callRepAT15AT07R1 = async (pData : any) => {
    let conn = new sql.ConnectionPool(dbConfig);
    await conn.connect();
    try {
        let result = await conn.request()
            .input('codBanco', sql.VarChar(10), pData.codBanco)
            .input('fechaCorte', sql.Date(), pData.fechaCorte)
            .query('exec TEINSA_VAL.dbo.USC_AT15_AT07_R1 @codBanco, @fechaCorte');
        await conn.close();
        console.log("Respuesta Servicio: ", result.recordset)
        if(result.recordset.length > 0) {
            return {"error": false, "record": result.recordset};
        } else {
            return {"error": false, "message": "No existen registros asociados a su consulta.", "record": []};
        }
    } catch (err) {
        console.error('Se identificaron errores en la ejecución del SP, Error: ', err);
        throw err;
    }
};

// 285 - CUADRE BAN01 vs AT05
export const callRepBAN01AT05R1 = async (pData : any) => {
    let conn = new sql.ConnectionPool(dbConfig);
    await conn.connect();
    try {
        let result = await conn.request()
            .input('codBanco', sql.VarChar(10), pData.codBanco)
            .input('fechaCorte', sql.Date(), pData.fechaCorte)
            .input('idReporte', sql.Int(), pData.idReporte)
            .query('exec TEINSA_VAL.dbo.USC_BAN01_AT05_R1 @codBanco, @fechaCorte, @idReporte');
        await conn.close();
        console.log("Respuesta Servicio: ", result.recordset)
        if(result.recordset.length > 0) {
            return {"error": false, "record": result.recordset};
        } else {
            return {"error": false, "message": "No existen registros asociados a su consulta.", "record": []};
        }
    } catch (err) {
        console.error('Se identificaron errores en la ejecución del SP, Error: ', err);
        throw err;
    }
};

// 290 - CUADRE BAN01 vs AT08
export const callRepBAN01AT08R1 = async (pData : any) => {
    let conn = new sql.ConnectionPool(dbConfig);
    await conn.connect();
    try {
        let result = await conn.request()
            .input('codBanco', sql.VarChar(10), pData.codBanco)
            .input('fechaCorte', sql.Date(), pData.fechaCorte)
            .input('idReporte', sql.Int, pData.idReporte)
            .query('exec TEINSA_VAL.dbo.USC_BAN01_AT08_R1 @codBanco, @fechaCorte, @idReporte');
        await conn.close();
        console.log("Respuesta Servicio: ", result.recordset)
        if(result.recordset.length > 0) {
            return {"error": false, "record": result.recordset};
        } else {
            return {"error": false, "message": "No existen registros asociados a su consulta.", "record": []};
        }
    } catch (err) {
        console.error('Se identificaron errores en la ejecución del SP, Error: ', err);
        throw err;
    }
};

// 315 - CUADRE BAN10 vs AT03 PROVISION
export const callRepBAN10AT03R1 = async (pData : any) => {
    let conn = new sql.ConnectionPool(dbConfig);
    await conn.connect();
    try {
        let result = await conn.request()
            .input('codBanco', sql.VarChar(10), pData.codBanco)
            .input('fechaCorte', sql.Date(), pData.fechaCorte)
            .query('exec TEINSA_VAL.dbo.Usp_Val_Rep_BAN10_AT03_Prov_Especifica @codBanco, @fechaCorte');
        await conn.close();
        console.log("Respuesta Servicio 315: ", result.recordset)
        if(result.recordset.length > 0) {
            let records = result.recordset;
            let recs = [
                {
                    "ORDEN_01": records[0].ORDEN,
                    "PROVISION_ESPECIFICA_01": records[0].PROVISION_ESPECIFICA,
                    "FUENTE_01": records[0].FUENTE,
                    "ORDEN_02": records[1].ORDEN,
                    "PROVISION_ESPECIFICA_02": records[1].PROVISION_ESPECIFICA,
                    "FUENTE_02": records[1].FUENTE,
                    "ORDEN_03": records[2].ORDEN,
                    "PROVISION_ESPECIFICA_03": records[2].PROVISION_ESPECIFICA,
                    "FUENTE_03": records[2].FUENTE
                }
            ]
            return {"error": false, "record": recs};
        } else {
            return {"error": false, "message": "No existen registros asociados a su consulta.", "record": []};
        }
    } catch (err) {
        console.error('Se identificaron errores en la ejecución del SP, Error: ', err);
        throw err;
    }
};

// 320 - CUADRE BAN10 vs AT03 CATEGORIA NORMAL
export const callRepBAN10AT03R2 = async (pData : any) => {
    let conn = new sql.ConnectionPool(dbConfig);
    await conn.connect();
    try {
        let result = await conn.request()
            .input('codBanco', sql.VarChar(10), pData.codBanco)
            .input('fechaCorte', sql.Date(), pData.fechaCorte)
            .query('exec TEINSA_VAL.dbo.USP_Val_Rep_Cuadre BAN10_AT03_Categoria_Normal @codBanco, @fechaCorte');

        await conn.close();
        console.log("Respuesta Servicio 320: ", result.recordset)
        if(result.recordset.length > 0) {
            let records = result.recordset;

            let recs = [
                {
                    "ORDEN_01": records[0].ORDEN,
                    "SALDO_01": records[0].SALDO,
                    "FUENTE_01": records[0].FUENTE,
                    "ORDEN_02": records[1].ORDEN,
                    "SALDO_02": records[1].SALDO,
                    "FUENTE_02": records[1].FUENTE,
                    "ORDEN_03": records[2].ORDEN,
                    "SALDO_03": records[2].SALDO,
                    "FUENTE_03": records[2].FUENTE
                }
            ]

           

            return {"error": false, "record": recs};
        } else {
            return {"error": false, "message": "No existen registros asociados a su consulta.", "record": []};
        }
    } catch (err) {
        console.error('Se identificaron errores en la ejecución del SP, Error: ', err);
        throw err;
    }
};

// 325 - CUADRE BAN10 GENERAL
export const callRepBAN10Only = async (pData : any) => {
    let conn = new sql.ConnectionPool(dbConfig);
    await conn.connect();
    try {
        let result = await conn.request()
            .input('codBanco', sql.VarChar(10), pData.codBanco)
            .input('fechaCorte', sql.Date(), pData.fechaCorte)
            .query('exec TEINSA_VAL.dbo.USC_BAN10_only @codBanco, @fechaCorte');
        await conn.close();
        console.log("Respuesta Servicio: ", result.recordset)
        if(result.recordset.length > 0) {
            return {"error": false, "record": result.recordset};
        } else {
            return {"error": false, "message": "No existen registros asociados a su consulta.", "record": []};
        }
    } catch (err) {
        console.error('Se identificaron errores en la ejecución del SP, Error: ', err);
        throw err;
    }
};

// 330 - INDICE DE LIQUIDEZ SEMANAL
export const callRepIndiceLiquidezSemanal = async (pData : any) => {
    let conn = new sql.ConnectionPool(dbConfig);
    await conn.connect();
    try {
        let result = await conn.request()
            .input('codBanco', sql.VarChar(10), pData.codBanco)
            .input('fechaCorte', sql.Date(), pData.fechaCorte)
            .query('exec TEINSA_VAL.dbo.USC_INDICE_LIQUIDEZ_SEMANAL @codBanco, @fechaCorte');
        await conn.close();
        console.log("Respuesta Servicio: ", result.recordset)
        if(result.recordset.length > 0) {
            return {"error": false, "record": result.recordset};
        } else {
            return {"error": false, "message": "No existen registros asociados a su consulta.", "record": []};
        }
    } catch (err) {
        console.error('Se identificaron errores en la ejecución del SP, Error: ', err);
        throw err;
    }
};

// 350 - BAN2 RESUMEN GLOBAL
export const callRepBAN02Only = async (pData : any) => {
    let conn = new sql.ConnectionPool(dbConfig);
    await conn.connect();
    try {
        let result = await conn.request()
            .input('codBanco', sql.VarChar(10), pData.codBanco)
            .input('fechaCorte', sql.Date(), pData.fechaCorte)
            .query('exec TEINSA_VAL.dbo.USC_BAN02_ONLY @codBanco, @fechaCorte');
        await conn.close();

        console.log("Respuesta Servicio:: ", result.recordset)
        if(result.recordset.length > 0) {
            return {"error": false, "record": result.recordset};
        } else {
            return {"error": false, "message": "No existen registros asociados a su consulta.", "record": []};
        }
    } catch (err) {
        console.error('Se identificaron errores en la ejecución del SP, Error: ', err);
        throw err;
    }
};

// 761 - CUADRE AT09 vs AT02-AT03-AT5
export const callRepAT09All = async (pData : any) => {
    let conn = new sql.ConnectionPool(dbConfig);
    await conn.connect();
    try {
        let result = await conn.request()
            .input('codBanco', sql.VarChar(10), pData.codBanco)
            .input('fechaCorte', sql.Date(), pData.fechaCorte)
            .query('exec TEINSA_VAL.dbo.USC_AT09_ALL @codBanco, @fechaCorte');
        await conn.close();
        console.log("Respuesta Servicio: ", result.recordset)
        if(result.recordset.length > 0) {
            return {"error": false, "record": result.recordset};
        } else {
            return {"error": false, "message": "No existen registros asociados a su consulta.", "record": []};
        }
    } catch (err) {
        console.error('Se identificaron errores en la ejecución del SP, Error: ', err);
        throw err;
    }
};

// 763 - COMPARACIÓN AT21
export const callRepAT21Comparacion = async (pData : any) => {
    let conn = new sql.ConnectionPool(dbConfig);
    await conn.connect();
    try {
        let result = await conn.request()
            .input('codBanco', sql.VarChar(10), pData.codBanco)
            .input('fechaCorte', sql.Date(), pData.fechaCorte)
            .query('exec TEINSA_VAL.dbo.Usp_Rep_AT21_Comparacion @codBanco, @fechaCorte');
        await conn.close();
        console.log("Respuesta Servicio: ", result.recordset)
        if(result.recordset.length > 0) {
            return {"error": false, "record": result.recordset};
        } else {
            return {"error": false, "message": "No existen registros asociados a su consulta.", "record": []};
        }
    } catch (err) {
        console.error('Se identificaron errores en la ejecución del SP, Error: ', err);
        throw err;
    }
};

// 764 - CUADRE AT02 vs AT21
export const callRepAT02AT21XRegion = async (pData : any) => {
    let conn = new sql.ConnectionPool(dbConfig);
    await conn.connect();
    try {
        let result = await conn.request()
            .input('codBanco', sql.VarChar(5), pData.codBanco)
            .input('fechaCorte', sql.Date(), pData.fechaCorte)
            .query('exec TEINSA_VAL.dbo.USC_AT02_AT21_x_REGION @codBanco, @fechaCorte');
        await conn.close();
        console.log("Respuesta Servicio: ", result.recordset)
        if(result.recordset.length > 0) {
            return {"error": false, "record": result.recordset};
        } else {
            return {"error": false, "message": "No existen registros asociados a su consulta.", "record": []};
        }
    } catch (err) {
        console.error('Se identificaron errores en la ejecución del SP, Error: ', err);
        throw err;
    }
};

// 765 - CUADRE AT03 vs AT21
export const callRepAT03AT21XRegion = async (pData : any) => {
    let conn = new sql.ConnectionPool(dbConfig);
    await conn.connect();
    try {
        let result = await conn.request()
            .input('codBanco', sql.VarChar(10), pData.codBanco)
            .input('fechaCorte', sql.Date(), pData.fechaCorte)
            .query('exec TEINSA_VAL.dbo.USC_AT03_AT21_x_REGION @codBanco, @fechaCorte');
        await conn.close();
        console.log("Respuesta Servicio: ", result.recordset)
        if(result.recordset.length > 0) {
            return {"error": false, "record": result.recordset};
        } else {
            return {"error": false, "message": "No existen registros asociados a su consulta.", "record": []};
        }
    } catch (err) {
        console.error('Se identificaron errores en la ejecución del SP, Error: ', err);
        throw err;
    }
};

// 766 - CUADRE AT04 vs AT21
export const callRepAT04AT21 = async (pData : any) => {
    let conn = new sql.ConnectionPool(dbConfig);
    await conn.connect();
    try {
        let result = await conn.request()
            .input('codBanco', sql.VarChar(10), pData.codBanco)
            .input('fechaCorte', sql.Date(), pData.fechaCorte)
            .query('exec TEINSA_VAL.dbo.USC_AT04_AT21 @codBanco, @fechaCorte');
        await conn.close();
        console.log("Respuesta Servicio: ", result.recordset)
        if(result.recordset.length > 0) {
            return {"error": false, "record": result.recordset};
        } else {
            return {"error": false, "message": "No existen registros asociados a su consulta.", "record": []};
        }
    } catch (err) {
        console.error('Se identificaron errores en la ejecución del SP, Error: ', err);
        throw err;
    }
};

// 767 - CUADRE AT05 vs AT21
export const callRepAT05AT21 = async (pData : any) => {
    let conn = new sql.ConnectionPool(dbConfig);
    await conn.connect();
    try {
        let result = await conn.request()
            .input('codBanco', sql.VarChar(10), pData.codBanco)
            .input('fechaCorte', sql.Date(), pData.fechaCorte)
            .query('exec TEINSA_VAL.dbo.USC_AT05_AT21 @codBanco, @fechaCorte');
        await conn.close();
        console.log("Respuesta Servicio: ", result.recordset)
        if(result.recordset.length > 0) {
            return {"error": false, "record": result.recordset};
        } else {
            return {"error": false, "message": "No existen registros asociados a su consulta.", "record": []};
        }
    } catch (err) {
        console.error('Se identificaron errores en la ejecución del SP, Error: ', err);
        throw err;
    }
};

// 768 - CUADRE AT12 vs AT21
export const callRepAT12AT21 = async (pData : any) => {
    let conn = new sql.ConnectionPool(dbConfig);
    await conn.connect();
    try {
        let result = await conn.request()
            .input('codBanco', sql.VarChar(10), pData.codBanco)
            .input('fechaCorte', sql.Date(), pData.fechaCorte)
            .query('exec TEINSA_VAL.dbo.USC_AT12_AT21 @codBanco, @fechaCorte');
        await conn.close();
        console.log("Respuesta Servicio: ", result.recordset)
        if(result.recordset.length > 0) {
            return {"error": false, "record": result.recordset};
        } else {
            return {"error": false, "message": "No existen registros asociados a su consulta.", "record": []};
        }
    } catch (err) {
        console.error('Se identificaron errores en la ejecución del SP, Error: ', err);
        throw err;
    }
};

// 769 - CUADRE AT15 vs AT21
export const callRepAT15AT21XRegion = async (pData : any) => {
    let conn = new sql.ConnectionPool(dbConfig);
    await conn.connect();
    try {
        let result = await conn.request()
            .input('codBanco', sql.VarChar(10), pData.codBanco)
            .input('fechaCorte', sql.Date(), pData.fechaCorte)
            .query('exec TEINSA_VAL.dbo.USC_AT15_AT21_x_REGION @codBanco, @fechaCorte');
        await conn.close();
        console.log("Respuesta Servicio: ", result.recordset)
        if(result.recordset.length > 0) {
            return {"error": false, "record": result.recordset};
        } else {
            return {"error": false, "message": "No existen registros asociados a su consulta.", "record": []};
        }
    } catch (err) {
        console.error('Se identificaron errores en la ejecución del SP, Error: ', err);
        throw err;
    }
};

// 770 - AT21 RESUMEN GLOBAL
export const callRepAT21Only = async (pData : any) => {
    let conn = new sql.ConnectionPool(dbConfig);
    await conn.connect();
    try {
        let result = await conn.request()
            .input('codBanco', sql.VarChar(10), pData.codBanco)
            .input('fechaCorte', sql.Date, pData.fechaCorte)
            .input('tipo', sql.Int, pData.tipo)
            .query('exec TEINSA_VAL.dbo.USC_AT21_ONLY @codBanco, @fechaCorte, @tipo');

        await conn.close();
        console.log("Respuesta Servicio: ", result.recordset)
        if(result.recordset.length > 0) {
            return {"error": false, "record": result.recordset};
        } else {
            return {"error": false, "message": "No existen registros asociados a su consulta.", "record": []};
        }
    } catch (err) {
        console.error('Se identificaron errores en la ejecución del SP, Error: ', err);
        throw err;
    }
};

// 771 - AT21 REVISIÓN DE UTILIDAD
export const callRepAT21Only2 = async (pData : any) => {
    let conn = new sql.ConnectionPool(dbConfig);
    await conn.connect();
    try {
        let result = await conn.request()
            .input('codBanco', sql.VarChar(10), pData.codBanco)
            .input('fechaCorte', sql.Date, pData.fechaCorte)
            .query('exec TEINSA_VAL.dbo.USC_AT21_ONLY_2 @codBanco, @fechaCorte');
            // .query('exec TEINSA_VAL.dbo.USC_AT21_UTILIDAD_REGION @codBanco, @fechaCorte');
        await conn.close();
        console.log("Respuesta Servicio: ", result.recordset)
        if(result.recordset.length > 0) {
            return {"error": false, "record": result.recordset};
        } else {
            return {"error": false, "message": "No existen registros asociados a su consulta.", "record": []};
        }
    } catch (err) {
        console.error('Se identificaron errores en la ejecución del SP, Error: ', err);
        throw err;
    }
};

// 772 - CUADRE AT12 vs AT03 vs AT02 vs AT21 vs BAN06
export const callRepCuadreAT21AT12AT03VsAT02 = async (pData : any) => {
    let conn = new sql.ConnectionPool(dbConfig);
    await conn.connect();
    try {
        let result = await conn.request()
            .input('fechaCorte', sql.Date(), pData.fechaCorte)
            .query('exec TEINSA_VAL.dbo.Usp_Rep_Cuadre_AT21_At12_At03VSAT02 @fechaCorte');
        await conn.close();
        console.log("Respuesta Servicio: ", result.recordset)
        if(result.recordset.length > 0) {
            return {"error": false, "record": result.recordset};
        } else {
            return {"error": false, "message": "No existen registros asociados a su consulta.", "record": []};
        }
    } catch (err) {
        console.error('Se identificaron errores en la ejecución del SP, Error: ', err);
        throw err;
    }
};

// 773 - CUADRE AT07 vs AT21
export const callRepAT07AT21XRegion = async (pData : any) => {
    let conn = new sql.ConnectionPool(dbConfig);
    await conn.connect();
    try {
        let result = await conn.request()
            .input('codBanco', sql.VarChar(10), pData.codBanco)
            .input('fechaCorte', sql.Date(), pData.fechaCorte)
            .query('exec TEINSA_VAL.dbo.USC_AT07_AT21_x_Region @codBanco, @fechaCorte');
        await conn.close();
        console.log("Respuesta Servicio: ", result.recordset)
        if(result.recordset.length > 0) {
            return {"error": false, "record": result.recordset};
        } else {
            return {"error": false, "message": "No existen registros asociados a su consulta.", "record": []};
        }
    } catch (err) {
        console.error('Se identificaron errores en la ejecución del SP, Error: ', err);
        throw err;
    }
};

// 774 - CUADRE BAN09 vs AT21
export const callRepBA09_AT21 = async (pData : any) => {
    let conn = new sql.ConnectionPool(dbConfig);
    await conn.connect();
    try {
        let result = await conn.request()
            .input('codBanco', sql.VarChar(10), pData.codBanco)
            .input('fechaCorte', sql.Date(), pData.fechaCorte)
            .query('exec TEINSA_VAL.dbo.USC_BA09_AT21 @codBanco, @fechaCorte');
        await conn.close();
        console.log("Respuesta Servicio: ", result.recordset)
        if(result.recordset.length > 0) {
            return {"error": false, "record": result.recordset};
        } else {
            return {"error": false, "message": "No existen registros asociados a su consulta.", "record": []};
        }
    } catch (err) {
        console.error('Se identificaron errores en la ejecución del SP, Error: ', err);
        throw err;
    }
};


// 800 - AT21 UTILIDAD POR REGIÓN
export const callRepAT21UtilidadRegion = async (pData : any) => {
    let conn = new sql.ConnectionPool(dbConfig);
    await conn.connect();
    try {
        let result = await conn.request()
            .input('codBanco', sql.VarChar(10), pData.codBanco)
            .input('fechaCorte', sql.Date, pData.fechaCorte)
            .query('exec TEINSA_VAL.dbo.USC_AT21_UTILIDAD_REGION @codBanco, @fechaCorte');
        await conn.close();
        console.log("Respuesta Servicio: ", result.recordset)
        if(result.recordset.length > 0) {
            return {"error": false, "record": result.recordset};
        } else {
            return {"error": false, "message": "No existen registros asociados a su consulta.", "record": []};
        }
    } catch (err) {
        console.error('Se identificaron errores en la ejecución del SP, Error: ', err);
        throw err;
    }
};

// 1000 - VALIDACIÓN MATEMÁTICA
export const callRepValidacionMatematica = async (pData : any) => {
    let conn = new sql.ConnectionPool(dbConfig);
    await conn.connect();
    try {
        let result = await conn.request()
            .input('codBanco', sql.VarChar(10), pData.codBanco)
            .input('fechaCorte', sql.Date, pData.fechaCorte)
            .query('exec TEINSA_VAL.dbo.USP_REP_VALIDACION_MATEMATICA @codBanco, @fechaCorte');
        await conn.close();
        console.log("Respuesta Servicio: ", result.recordset)
        if(result.recordset.length > 0) {
            return {"error": false, "record": result.recordset};
        } else {
            return {"error": false, "message": "No existen registros asociados a su consulta.", "record": []};
        }
    } catch (err) {
        console.error('Se identificaron errores en la ejecución del SP, Error: ', err);
        throw err;
    }
};


// 1001 - VALIDACIÓN MATEMÁTICA DETALLE
export const callRepValidacionMatematicaDetalle = async (pData : any) => {
    let conn = new sql.ConnectionPool(dbConfig);
    await conn.connect();
    try {
        let result = await conn.request()
            .input('codBanco', sql.VarChar(10), pData.codBanco)
            .input('fechaCorte', sql.DateTime, pData.fechaCorte)
            .input('numRegla', sql.Int, pData.numRegla)
            .query('exec TEINSA_VAL.dbo.USP_REP_VALIDACION_MATEMATICA_DRILLDOWN @codBanco, @fechaCorte, @numRegla');
        await conn.close();
        console.log("Respuesta Servicio: ", JSON.stringify(result))
        if(result.recordset.length > 0) {
            return {"error": false, "record": result.recordset};
        } else {
            return {"error": false, "message": "No existen registros asociados a su consulta.", "record": []};
        }
    } catch (err) {
        console.error('Se identificaron errores en la ejecución del SP, Error: ', err);
        throw err;
    }
};













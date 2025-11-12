const sql = require('mssql')
import {dbConfig} from '../_helpers/global';
import {registrarLog} from "../_helpers/utils";

export const autenticarUsuario = async (pData : any) => {
    let conn = new sql.ConnectionPool(dbConfig);
    await conn.connect();
    try {
        let result = await conn.request()
            .input('username', sql.NVarChar(50), pData.username)
            .input('password', sql.NVarChar(250), pData.password)
            .query('exec TEINSA_CONFIG.dbo.XDROP_USERS_READ_DATA @username, @password');

        await registrarLog(conn, pData.username, '000', '19000101', 'INICIO DE SESION', pData);

        await conn.close();
        console.log("Respuesta: ", result.recordset[0])
        if(result.recordset.length > 0) {
            return {"error": false, "record": result.recordset[0]};
        } else {
            return {"error": true, "message": "No existen registros asociados al usuario ingresado."};
        }

    } catch (err) {
        console.error('AUTENTICACIÓN DE USUARIO: ', err);
        throw err;
    }
};





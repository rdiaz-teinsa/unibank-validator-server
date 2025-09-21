import fs from 'fs';
import sql from "mssql";
// import path from 'path';
// import {Parser} from 'json2csv';
// import Excel from "exceljs";
// import {globalVars} from "./enviroment";


export const createFolders = (pArchivePath: string, pBankPath: string, pDatePath: string) =>{
    try{
        let dir: string = pArchivePath + "/" + pBankPath;
        console.log("Directory: ", dir);
        if (!fs.existsSync(dir)) fs.mkdirSync(dir);

        let subdir: string = pArchivePath + "/" + pBankPath + "/" + pDatePath;
        if (!fs.existsSync(subdir)) fs.mkdirSync(subdir);
        console.log("Sub Directory: ", subdir);
    } catch (err) {
        console.error('CREAR CARPETAS: ', err);
        throw err;
    }

}


export const registrarLog = async (conn: any, usuario: string, codBanco: string, fechaCorte: string, operacion: string, pData : any) => {
    try {
        let result = await conn.request()
            .input('usuario', sql.NVarChar(50), usuario)
            .input('cod_banco', sql.NVarChar(4), codBanco)
            .input('fecha_corte', sql.NVarChar(10), fechaCorte)
            .input('operacion', sql.NVarChar(50), operacion)
            .input('datos', sql.NVarChar(2500), JSON.stringify(pData))
            .query('EXEC TEINSA_CONFIG.dbo.USP_SEG_REGISTRAR_LOG @usuario, @cod_banco, @fecha_corte, @operacion, @datos');
        console.log("REGISTERED LOG: ", JSON.stringify(result))
    } catch (err) {
        console.error('REGISTRO DE LOGS: ', err);
        throw err;
    }
};


export const getTimeStamp = () => {
    let currentdate = new Date();
    let datetime =  currentdate.getFullYear() + "-"
        + (currentdate.getMonth()+1)  + "-"
        + currentdate.getDate() + " "
        + currentdate.getHours() + ":"
        + currentdate.getMinutes() + ":"
        + currentdate.getSeconds();
    return datetime;
}
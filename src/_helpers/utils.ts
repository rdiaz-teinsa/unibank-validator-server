import fs from 'fs';
import sql from "mssql";
// import path from 'path';
// import {Parser} from 'json2csv';
// import Excel from "exceljs";
// import {globalVars} from "./enviroment";


export const createFolders = (pArchivePath: string, pBankPath: string, pDatePath: string) =>{
    try{
        let dir: string = pArchivePath + "\\" + pBankPath;
        console.log("Directory: ", dir);
        if (!fs.existsSync(dir)) fs.mkdirSync(dir);

        let subdir: string = pArchivePath + "\\" + pBankPath + "\\" + pDatePath;
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


/*



export const checkDataValue = (pData: any) => {
    try {
        return pData();
    } catch (err) {
        return '';
    }
}

export const reformatDateString = (pDate: any) => {
    var b = pDate.split(/\D/);
    return b.reverse().join('-');
}

export const getCurrentDateFormated = () => {
    let today = new Date();
    let dd = today.getDate();
    let mm = today.getMonth() + 1;
    let yyyy = today.getFullYear();
    let dprefix = '';
    let mprefix = '';
    if (dd < 10) { dprefix = '0' };
    if (mm < 10) { mprefix = '0' };
    let result = dprefix + dd.toString() + '/' + mprefix + mm.toString() + '/' + yyyy;
    return result;
}

export const getPastDateFormated = () => {
    let today = new Date();
    today.setDate(today.getDate() - 31);
    let dd = today.getDate();
    let mm = today.getMonth() + 1;
    let yyyy = today.getFullYear();
    let dprefix = '';
    let mprefix = '';
    if (dd < 10) {
        dprefix = '0';
    };
    if (mm < 10) {
        mprefix = '0';
    };
    let result = dprefix + dd.toString() + '/' + mprefix + mm.toString() + '/' + yyyy;
    return result;
};

export const validateDistributionSchedule = () => {
    let now = new Date();
    let time = now.getHours();
    let fixedTime = '07:00:00';
    let sendAt = null;
    if (time >= 6 && time <= 23) {
        let todayDay = ("0" + now.getDate()).slice(-2);
        let todayMonth = ("0" + (now.getMonth() + 1)).slice(-2);
        let todayYear = (now.getFullYear() + 1900);
        let todayDate = (todayYear + '-' + todayMonth + '-' + todayDay);
        sendAt = todayDate + ' ' + fixedTime;
        console.log("La solicitud de envio se gestiono dentro del horario Habilitado. Agendado para:", sendAt);
        return sendAt;
    } else {
        now.setDate(now.getDate() + 1);
        let tomorrowDay = ("0" + now.getDate()).slice(-2);
        let tomorrowMonth = ("0" + (now.getMonth() + 1)).slice(-2);
        let tomorrowYear = (now.getFullYear() + 1900);
        let tomorrowDate = (tomorrowYear + '-' + tomorrowMonth + '-' + tomorrowDay);
        sendAt = tomorrowDate + ' ' + fixedTime;
        console.error("La solicitud de envio de mensaje debe ser agendada para: ", sendAt);
        return sendAt;
    }
}

export const cleanObject = (pObject: any) => {
    for (var propName in pObject) {
        if (pObject[propName] === null || pObject[propName] === undefined || pObject[propName] === '') {
            delete pObject[propName];
        }
    }
};

export const validateEmail = (pEmail: string, pId: string) => {
    let mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (pEmail.match(mailformat)) {
        console.log("La dirección de correo electrónico ", pEmail, " es valida.");
        return true;
    } else {
        console.error("La dirección de correo electrónico asociada al registro con ID: " + pId + " no es valida.");
        return false;
    }
}

export const validateArchive = (period: string, archivePath: string) => {
    let masterPath = prefix + archivePath + "/" + period.substr(0, 4);
    let master = path.join(__dirname, masterPath);
    if (!fs.existsSync(master)) {
        fs.mkdirSync(master);
    }
    console.log("Ruta Master: ", master);
    let containerPath = prefix + archivePath + "/" + period.substr(0, 4) + "/" + period;
    let container = path.join(__dirname, containerPath);
    if (!fs.existsSync(container)) {
        fs.mkdirSync(container);
    }
    console.log("Ruta Container: ", container);
    return container;
}

export const export2Excel = async (pFilename: string, pHeaders: any, pData: any) => {
    try {
        const fields = pHeaders;
        const csv = new Parser({fields})
        await fs.writeFile(pFilename, csv.parse(pData), function(err) {
            if(err) {
                console.error("Error en generación de archivo. Error: ", err);
                throw err;
            } else {
                console.log("Archivo almacenado con exito. Filename:: ", pFilename);
            }
        });
    } catch (error) {
        console.error("Error en proceso de exportación. Error: ", error);
        throw error;
    }

}



export const generateProfitExcel = async (pId: string, pFilename: string, pData: any) => {
    try {
        const results = pData;
        const workbook = new Excel.Workbook();
        const worksheet = workbook.addWorksheet(pId);
        worksheet.columns = [
            { header: 'REGION', key: 'Region', width: 20 },
            { header: 'Nº CENTRO', key: 'CODIGO_CENTRO', width: 10 },
            { header: 'CENTRO DE COSTO', key: 'CENTRO_COSTO', width: 40 },
            { header: 'EFECTIVO', key: 'ACT_EFECTIVO', width: 10 },
            { header: 'A LA VISTA', key: 'ACT_AVISTA', width: 10 },
            { header: 'A PLAZO', key: 'ACT_APLAZO', width: 10 },
            { header: 'TOTAL', key: 'ACT_TOT_DEPOSITO', width: 10 },
            { header: 'ACTIVOS - HIPOTECA', key: 'ACT_HIPOTECA', width: 10 },
            { header: 'ACTIVOS - CONSTRUCCION', key: 'ACT_CONSTRUCCION', width: 10 },
            { header: 'ACTIVOS - PRENDARIO', key: 'ACT_PRENDARIO', width: 10 },
            { header: 'ACTIVOS - PERSONALES', key: 'ACT_PERSONALES', width: 10 },
            { header: 'ACTIVOS - ADELANTO', key: 'ACT_ADELANTO', width: 10 },
            { header: 'ACTIVOS - COMERCIAL', key: 'ACT_COMERCIAL', width: 10 },
            { header: 'ACTIVOS - LEASING', key: 'ACT_LEASING', width: 10 },
            { header: 'ACTIVOS - AUTOS', key: 'ACT_AUTOS', width: 10 },
            { header: 'ACTIVOS - MICROBANCA', key: 'ACT_MICROBANCA', width: 10 },
            { header: 'ACTIVOS - TARJETAS', key: 'ACT_TARJETAS', width: 10 },
            { header: 'ACTIVOS - SOBREGIROS', key: 'ACT_SOBREGIROS', width: 10 },
            { header: 'ACTIVOS - FACTORING', key: 'ACT_FACTORING', width: 10 },
            { header: 'ACTIVOS - TOTAL PRÉSTAMOS', key: 'ACT_TOTAL_PRESTAMOS', width: 10 },
            { header: 'ACTIVOS - FIDUCIARIA', key: 'ACT_FIDUCIARIA', width: 10 },
            { header: 'ACTIVOS - GRAN TOTAL PRÉSTAMOS', key: 'ACT_GRAN_TOTAL_PRESTAMOS', width: 10 },
            { header: 'ACTIVOS - INVERSIONES', key: 'ACT_INVERSIONES', width: 10 },
            { header: 'ACTIVOS - TOTAL DE ACTIVOS', key: 'ACT_TOTAL_ACTIVOS', width: 10 },
            { header: 'PASIVOS - AVISTA', key: 'PAS_AVISTA', width: 10 },
            { header: 'PASIVOS - CORRIENTE', key: 'PAS_CORRIENTE', width: 10 },
            { header: 'PASIVOS - DORADA', key: 'PAS_DORADA', width: 10 },
            { header: 'PASIVOS - HABITACIONAL', key: 'PAS_AHO_HABITACIONAL', width: 10 },
            { header: 'PASIVOS - PLATINUM', key: 'PAS_PLATINUM', width: 10 },
            { header: 'PASIVOS - COLABORADORES', key: 'PAS_COLABORADORES', width: 10 },
            { header: 'PASIVOS - MI PRIMER AHORRO', key: 'PAS_MI_PRIMER_AHORRO', width: 10 },
            { header: 'PASIVOS - NINOS', key: 'PAS_NINOS', width: 10 },
            { header: 'PASIVOS - CAJA_JUVENIL', key: 'PAS_CAJA_JUVENIL', width: 10 },
            { header: 'PASIVOS - SIMPLIFICADA', key: 'PAS_SIMPLIFICADA', width: 10 },
            { header: 'PASIVOS - NAVIDAD', key: 'PAS_NAVIDAD', width: 10 },
            { header: 'PASIVOS - HABITACIONAL', key: 'PAS_HABITACIONAL', width: 10 },
            { header: 'PASIVOS - ESCOLAR', key: 'PAS_ESCOLAR', width: 10 },
            { header: 'TOTAL AHORROS', key: 'PAS_TOTAL_AHORROS', width: 10 },
            { header: 'PASIVOS - PLAZO CLIENTES', key: 'PAS_PLCLIENTES', width: 10 },
            { header: 'PASIVOS - PLAZO BANCOS', key: 'PAS_PL_BANCOS', width: 10 },
            { header: 'PASIVOS - PLAZO GUBERNAMENTAL', key: 'PAS_PLGUBERNAMENTA', width: 10 },
            { header: 'TOTAL PLAZO FIJO', key: 'PAS_TOTAL_PLAZO_FIJO', width: 10 },
            { header: 'TOTAL DEPOSITOS', key: 'PAS_TOTAL_DEPOSITOS', width: 10 },
            { header: 'PASIVOS - FINANCIAMIENTOS', key: 'PAS_FINANCIAMIENTOS', width: 10 },
            { header: 'PASIVOS - MULTIBONOS', key: 'PAS_MULTIBONOS', width: 10 },
            { header: 'TOTAL_PASIVOS', key: 'PAS_TOTAL_PASIVOS', width: 10 },
            { header: 'CAPITAL - REVALUACION FONDO INVERSIONES', key: 'CAP_REVAL_FONDO_INVER', width: 10 },
            { header: 'CAPITAL - FONDO CAPITAL', key: 'CAP_FONDO_CAPITAL', width: 10 },
            { header: 'TOTAL RECURSOS', key: 'CAP_TOTAL_RECURSOS', width: 10 },
            { header: 'TOTAL APORTACION FONDOS', key: 'CAP_TOTAL_APORTACION_FONDOS', width: 10 },
            { header: 'INGRESOS - INTERESES GANADOS', key: 'ING_INTERESES_GANADOS', width: 10 },
            { header: 'INGRESOS - OTROS INGRESOS COMISIONES', key: 'ING_OTROS_INGRESOS_COMISIONES', width: 10 },
            { header: 'TOTAL INGRESOS', key: 'ING_TOTAL_INGRESOS', width: 10 },
            { header: 'GASTOS - INTERESES', key: 'GAS_GASTOS_INTERESES', width: 10 },
            { header: 'GASTOS - COMISIONES PAGADAS', key: 'GAS_COMISIONES_PAGADAS', width: 10 },
            { header: 'TOTAL COSTOS', key: 'GAS_TOTAL_COSTOS', width: 10 },
            { header: 'MARGEN FINANCIERO', key: 'MARGEN_FINANCIERO', width: 10 },
            { header: 'GASTOS - PERSONAL', key: 'GAS_PERSONAL', width: 10 },
            { header: 'GASTOS - OPERACIONES', key: 'GAS_OPERACIONES', width: 10 },
            { header: 'GASTOS - EDIFICIO', key: 'GAS_EDIFICIO', width: 10 },
            { header: 'TOTAL GASTOS', key: 'TOTAL_GASTOS', width: 10 },
            { header: 'RESULTADO OPERATIVO', key: 'RESULTADO_OPERATIVO', width: 10 },
            { header: 'RESERVAS - INVERSIONES', key: 'RES_INVERSIONES', width: 10 },
            { header: 'RESERVAS - PRESTAMOS', key: 'RES_PRESTAMOS', width: 10 },
            { header: 'TOTAL RESERVAS', key: 'TOTAL_RESERVAS', width: 10 },
            { header: 'UTILIDAD CONTABLE', key: 'UTIL_CONTABLE', width: 10 }
        ];
        for (const row of results) {
            worksheet.addRow(row);
        }
        worksheet.autoFilter ='A1:BN1';
        worksheet.eachRow((row, rowNumber) => {
            let totalStyle = row.getCell('CODIGO_CENTRO').value;
            row.eachCell((cell, colNumber) => {
                if (rowNumber == 1) {
                    cell.fill = {
                        type:'pattern',
                        pattern:'solid',
                        fgColor: { argb:'000066' }
                    };
                    cell.font = {
                        color: {argb: "FFFFFF"},
                        bold: true
                    };
                };
                if (totalStyle == 0) {
                    cell.fill = {
                        type:'pattern',
                        pattern:'solid',
                        fgColor: { argb:'e6e6ff' }
                    };
                    cell.font = {
                        color: {argb: "000000"},
                        bold: true
                    };
                };
                cell.border = {
                    top: { style:'thin' },
                    left: { style:'thin' },
                    bottom: { style:'thin' },
                    right: { style:'thin' }
                };
            })
            row.commit();
        });
        let response = await workbook.xlsx.writeBuffer();
        // @ts-ignore
        let base64 = 'data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64,' + response.toString('base64');
        return base64;
    }
    catch(err) {
        console.log('Error: ', err);
        throw err;
    }
}
 */
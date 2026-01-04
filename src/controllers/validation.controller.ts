import {Request, Response} from 'express';
import {createFolders} from '../_helpers/utils';
import {exportExcelToTxt} from '../_helpers/xls2txt';
import {convertUtf8ToUtf16LESync} from '../_helpers/utf82utf16le';
import {filePathRoot, logsPathRoot, localSystem} from '../_helpers/global';
import {masterFileValidation} from '../_helpers/validate';
import {
    obtenerCatalogos,
    gestionarPeriodo,
    cargarDatosAtomos,
    consultarPeriodos,
    consultarPeriodo,
    consultarProcesos,
    consultarProcesosAtomo,
    consultarProcesosFrecuencia,
    validacionFuncionalResumen,
    validacionEstructuralResumen,
    validacionFuncionalDetalle,
    validacionEstructuralDetalle,
    validacionDetalleErrorEstructural,
    validacionDetalleErrorFuncional,
    validacionConsultaIndicadores,
    validacionConsultaTablero,
    validacionConsultaBitacora,
    consultarAtomos,
    consultarValidacionesArchivo
} from '../database/validation.service';
import {globalVars} from "../_helpers/enviroment";


function isEmpty(value: any) {
    if (value == null || (typeof value === "string" && value.trim().length === 0)) {
        return 'system';
    } else {
        return value;
    }
}

function isEmptyDate(value: any) {
    if (value == null || (typeof value === "string" && value.trim().length === 0)) {
        return '2023-11-24';
    } else {
        return value;
    }
}

export const getCatalogsData = async (req: Request, res: Response) => {
    try {
        // @ts-ignore
        let response : any = await obtenerCatalogos();
        // console.log("Response: ", response)
        // console.log("Request Completed!")
        // @ts-ignore
        if (response.error === true) return res.status(400).json(response);
        // @ts-ignore
        res.status(200).json(response);
    } catch (err) {
        // @ts-ignore
        return res.status(500).json({error: true, message:  err, records: []});
    }
}

export const postGestionarPeriodo = async (req: Request, res: Response) => {
    try {
        let iData: any;
        iData = {
            // @ts-ignore
            codBanco: req.body.codBanco,
            // @ts-ignore
            fechaCorte: req.body.fechaCorte,
            // @ts-ignore
            frecuencia: req.body.frecuencia,
            // @ts-ignore
            tipoCorrida: req.body.tipoCorrida,
            // @ts-ignore
            usuario: req.body.usuario,
            // @ts-ignore
            ejecutables: req.body.ejecutables,
        }
        console.log("Input Data (Periodo): ", iData)

        createFolders(filePathRoot, iData.codBanco, iData.fechaCorte);


        let response: any;
        response = await gestionarPeriodo(iData);
        // console.log("Response: ", response)
        // @ts-ignore
        if (response.error === true) return res.status(400).json({
            error: true,
            message: 'No existen registros en el sistema.'
        });
        // @ts-ignore
        res.status(200).json(response.record);
    } catch (err) {
        // @ts-ignore
        return res.status(500).json({error: true, message: err});
    }
}

export const postCargarDatosAtomos = async (req: Request, res: Response) => {
    try {
        let iData: any;
        let response: any;

        const atomsCatalog: any = req.body.atomos;
        const atoms: any  = req.body.ejecutables.split(',');
        console.log("Atoms: ", atoms, " Length: ", atoms.length);

        for(let i: number = 0; i < atoms.length; i++) {
            let atomId: number = parseInt(atoms[i]);
            let atom: any = atomsCatalog.filter((a: { ID_ATOMO: number; }) => a.ID_ATOMO === atomId);
            let code: string = atom[0].ATOMO;
            let filename: string = atom[0].ARCHIVO;
            let convert: number = atom[0].CONVERTIR;
            let xlsPath: string = filePathRoot + '/' + req.body.codBanco + '/' + req.body.fechaCorte + '/' + atom[0].ARCHIVO.replace("csv", "xls");
            let txtPath: string = filePathRoot + '/' + req.body.codBanco + '/' + req.body.fechaCorte + '/' + atom[0].ARCHIVO;

            if(convert) {
                let conversion: any = await exportExcelToTxt(xlsPath, txtPath, "~");
                console.info('CONVERSION: ', conversion)
                // @ts-ignore
                if (conversion.error === true) return res.status(400).json({
                    error: true,
                    message: conversion.message
                });
            } else {
                let encoded: any = convertUtf8ToUtf16LESync(txtPath, txtPath);
                // @ts-ignore
                if (encoded.error === true) return res.status(400).json({
                    error: true,
                    message: encoded.message
                });
            }

            let validation: any = await  masterFileValidation(req.body.codBanco, req.body.fechaCorte, code, filename);
            console.log('Validation Result: ', validation);

            let logFile = validation.logs || ' ';

            iData = {
                    // @ts-ignore
                    codBanco: req.body.codBanco,
                    // @ts-ignore
                    fechaCorte: req.body.fechaCorte,
                    // @ts-ignore
                    idPeriodo: req.body.idPeriodo,
                    // @ts-ignore
                    usuario: req.body.usuario,
                    // @ts-ignore
                    os: localSystem,
                    // @ts-ignore
                    ejecutables: atomId.toString(),
                    // @ts-ignore
                    rutaCarga: validation.file,
                    // @ts-ignore
                    rutaLogs: logFile.replace("C:/teinsa/atomos/logs", "archive"),
                    // @ts-ignore
                    errores: validation.errors,
                };
                console.log("Input Data: ", iData)

                response = await cargarDatosAtomos(iData);
                console.log("Response: ", response);

        }

        // @ts-ignore
        if (response.error === true) return res.status(400).json({
            error: true,
            message: response.message
        });
        // @ts-ignore
        res.status(200).json(response.record);
    } catch (err) {
        // @ts-ignore
        console.error('ERROR: ', err)
        return res.status(500).json({error: true, message: err});
    }
}


export const getConsultarAtomos = async (req: Request, res: Response) => {
    try {
        let iData: any;
        iData = {
            // @ts-ignore
            codBanco: req.params.codBanco || null,
        }
        console.log("Input Data: ", iData)
        let response: any;
        response = await consultarAtomos(iData);
        console.log("Response: ", response)
        // @ts-ignore
        if (response.error === true) return res.status(400).json({
            error: true,
            message: 'No existen registros en el sistema.'
        });
        // @ts-ignore
        res.status(200).json(response.record);
    } catch (err) {
        // @ts-ignore
        return res.status(500).json({error: true, message: err});
    }
}

export const getConsultarPeriodos = async (req: Request, res: Response) => {
    try {
        let iData: any;
        iData = {
            // @ts-ignore
            codBanco: req.params.codBanco,
        }
        console.log("Input Data: ", iData)
        let response: any;
        response = await consultarPeriodos(iData);
        console.log("Response: ", response)
        // @ts-ignore
        if (response.error === true) return res.status(400).json({
            error: true,
            message: 'No existen registros en el sistema.'
        });
        // @ts-ignore
        res.status(200).json(response.record);
    } catch (err) {
        // @ts-ignore
        return res.status(500).json({error: true, message: err});
    }
}

export const getConsultarPeriodo = async (req: Request, res: Response) => {
    try {
        let iData: any;
        iData = {
            // @ts-ignore
            idPeriodo: req.params.idPeriodo,
        }
        console.log("Input Data: ", iData)
        let response: any;
        response = await consultarPeriodo(iData);
        console.log("Response: ", response)
        // @ts-ignore
        if (response.error === true) return res.status(400).json({
            error: true,
            message: 'No existen registros en el sistema.'
        });
        // @ts-ignore
        res.status(200).json(response.record);
    } catch (err) {
        // @ts-ignore
        return res.status(500).json({error: true, message: err});
    }
}

export const getConsultarProcesos = async (req: Request, res: Response) => {
    try {
        let iData: any;
        iData = {
            // @ts-ignore
            idPeriodo: req.params.idPeriodo,
        }
        console.log("Input Data: ", iData)
        let response: any;
        response = await consultarProcesos(iData);
        console.log("Response: ", response)
        // @ts-ignore
        if (response.error === true) return res.status(400).json({
            error: true,
            message: 'No existen registros en el sistema.'
        });
        // @ts-ignore
        res.status(200).json(response.record);
    } catch (err) {
        // @ts-ignore
        return res.status(500).json({error: true, message: err});
    }
}

export const getConsultarProcesosAtomo = async (req: Request, res: Response) => {
    try {
        let iData: any;
        iData = {
            // @ts-ignore
            atomo: req.params.atomo,
        }
        console.log("Input Data: ", iData)
        let response: any;
        response = await consultarProcesosAtomo(iData);
        console.log("Response: ", response)
        // @ts-ignore
        if (response.error === true) return res.status(400).json({
            error: true,
            message: 'No existen registros en el sistema.'
        });
        // @ts-ignore
        res.status(200).json(response.record);
    } catch (err) {
        // @ts-ignore
        return res.status(500).json({error: true, message: err});
    }
}

export const getConsultarProcesosFrecuencia = async (req: Request, res: Response) => {
    try {
        let iData: any;
        iData = {
            // @ts-ignore
            frecuencia: req.params.frecuencia,
            // @ts-ignore
            idPeriodo: req.params.idPeriodo,
        }
        console.log("Input Data: ", iData)
        let response: any;
        response = await consultarProcesosFrecuencia(iData);
        console.log("Response: ", response)
        // @ts-ignore
        if (response.error === true) return res.status(400).json({
            error: true,
            message: 'No existen registros en el sistema.'
        });
        // @ts-ignore
        res.status(200).json(response.record);
    } catch (err) {
        // @ts-ignore
        return res.status(500).json({error: true, message: err});
    }
}

export const postValidacionFuncionalResumen = async (req: Request, res: Response) => {
    try {
        let iData: any;
        iData = {
            // @ts-ignore
            codBanco: req.body.codBanco,
            // @ts-ignore
            fechaSib: req.body.fechaSib,
            // @ts-ignore
            idAtomo: req.body.idAtomo,
            // @ts-ignore
            usuario: isEmpty(req.body.usuario),
        }
        console.log("Input Data: ", iData)
        let response: any;
        response = await validacionFuncionalResumen(iData);
        console.log("Response: ", response)
        // @ts-ignore
        if (response.error === true) return res.status(400).json({
            error: true,
            message: 'No existen registros en el sistema.'
        });
        // @ts-ignore
        res.status(200).json(response.record);
    } catch (err) {
        // @ts-ignore
        return res.status(500).json({error: true, message: err});
    }
}

export const postValidacionEstructuralResumen = async (req: Request, res: Response) => {
    try {
        let iData: any;
        iData = {
            // @ts-ignore
            codBanco: req.body.codBanco,
            // @ts-ignore
            fechaSib: req.body.fechaSib,
            // @ts-ignore
            idAtomo: req.body.idAtomo,
            // @ts-ignore
            usuario: isEmpty(req.body.usuario)
        }
        console.log("Input Data: ", iData)
        let response: any;
        response = await validacionEstructuralResumen(iData);
        console.log("Response: ", response)
        // @ts-ignore
        if (response.error === true) return res.status(400).json({
            error: true,
            message: 'No existen registros en el sistema.'
        });
        // @ts-ignore
        res.status(200).json(response.record);
    } catch (err) {
        // @ts-ignore
        return res.status(500).json({error: true, message: err});
    }
}

export const postValidacionFuncionalDetalle = async (req: Request, res: Response) => {
    try {
        let iData: any;
        iData = {
            // @ts-ignore
            codBanco: req.body.codBanco,
            // @ts-ignore
            fechaSib: req.body.fechaSib,
            // @ts-ignore
            idAtomo: req.body.idAtomo,
            // @ts-ignore
            idError: req.body.idError,
            // @ts-ignore
            usuario: isEmpty(req.body.usuario)
        }
        console.log("Input Data: ", iData)
        let response: any;
        response = await validacionFuncionalDetalle(iData);
        console.log("Response: ", response)
        // @ts-ignore
        if (response.error === true) return res.status(400).json({
            error: true,
            message: 'No existen registros en el sistema.'
        });
        // @ts-ignore
        res.status(200).json(response.record);
    } catch (err) {
        // @ts-ignore
        return res.status(500).json({error: true, message: err});
    }
}

export const postValidacionEstructuralDetalle = async (req: Request, res: Response) => {
    try {
        let iData: any;
        iData = {
            // @ts-ignore
            codBanco: req.body.codBanco,
            // @ts-ignore
            fechaSib: req.body.fechaSib,
            // @ts-ignore
            idAtomo: req.body.idAtomo,
            // @ts-ignore
            idError: req.body.idError,
            // @ts-ignore
            usuario: isEmpty(req.body.usuario)
        }
        console.log("Input Data: ", iData)
        let response: any;
        response = await validacionEstructuralDetalle(iData);
        console.log("Response: ", response)
        // @ts-ignore
        if (response.error === true) return res.status(400).json({
            error: true,
            message: 'No existen registros en el sistema.'
        });
        // @ts-ignore
        res.status(200).json(response.record);
    } catch (err) {
        // @ts-ignore
        return res.status(500).json({error: true, message: err});
    }
}

export const postValidacionDetalleErrorEstructural = async (req: Request, res: Response) => {
    try {
        let iData: any;
        iData = {
            // @ts-ignore
            codBanco: req.body.codBanco,
            // @ts-ignore
            fechaSib: req.body.fechaSib,
            // @ts-ignore
            idAtomo: req.body.idAtomo,
            // @ts-ignore
            idRec: req.body.idRec,
            // @ts-ignore
            idRecActual: req.body.idRecActual,
            // @ts-ignore
            idValidacion: req.body.idValidacion,
            // @ts-ignore
            usuario: isEmpty(req.body.usuario)
        }
        console.log("Input Data: ", iData)
        let response: any;
        response = await validacionDetalleErrorEstructural(iData);
        console.log("Response: ", response)
        // @ts-ignore
        if (response.error === true) return res.status(400).json({
            error: true,
            message: 'No existen registros en el sistema.'
        });
        // @ts-ignore
        res.status(200).json(response.record);
    } catch (err) {
        // @ts-ignore
        return res.status(500).json({error: true, message: err});
    }
}

export const postValidacionDetalleErrorFuncional = async (req: Request, res: Response) => {
    try {
        let iData: any;
        iData = {
            // @ts-ignore
            codBanco: req.body.codBanco,
            // @ts-ignore
            fechaSib: req.body.fechaSib,
            // @ts-ignore
            idAtomo: req.body.idAtomo,
            // @ts-ignore
            idRec: req.body.idRec,
            // @ts-ignore
            idRecActual: req.body.idRecActual,
            // @ts-ignore
            idValidacion: req.body.idValidacion,
            // @ts-ignore
            usuario: isEmpty(req.body.usuario)
        }
        console.log("Input Data: ", iData)
        let response: any;
        response = await validacionDetalleErrorFuncional(iData);
        console.log("Response: ", response)
        // @ts-ignore
        if (response.error === true) return res.status(400).json({
            error: true,
            message: 'No existen registros en el sistema.'
        });
        // @ts-ignore
        res.status(200).json(response.record);
    } catch (err) {
        // @ts-ignore
        return res.status(500).json({error: true, message: err});
    }
}

export const postValidacionConsultaIndicadores = async (req: Request, res: Response) => {
    try {
        let iData: any;
        iData = {
            // @ts-ignore
            codBanco: req.body.codBanco,
            // @ts-ignore
            atomo: req.body.atomo,
            // @ts-ignore
            fechaSIB: req.body.fechaSib,
            // @ts-ignore
            usuario: isEmpty(req.body.usuario)
        }
        console.log("Input Data: ", iData)
        let response: any;
        response = await validacionConsultaIndicadores(iData);
        console.log("Response: ", response)
        // @ts-ignore
        if (response.error === true) return res.status(400).json({
            error: true,
            message: 'No existen registros en el sistema.'
        });
        // @ts-ignore
        res.status(200).json(response.record);
    } catch (err) {
        // @ts-ignore
        return res.status(500).json({error: true, message: err});
    }
}

export const postValidacionConsultaTablero = async (req: Request, res: Response) => {
    try {
        let iData: any;
        iData = {
            // @ts-ignore
            codBanco: req.body.codBanco,
            // @ts-ignore
            atomo: req.body.atomo,
            // @ts-ignore
            fechaSib: isEmptyDate(req.body.fechaSib),
            // @ts-ignore
            usuario: isEmpty(req.body.usuario)
        }
        console.log("Input Data: ", iData)
        let response: any;
        response = await validacionConsultaTablero(iData);
        console.log("Response: ", response)
        // @ts-ignore
        if (response.error === true) return res.status(400).json({
            error: true,
            message: 'No existen registros en el sistema.'
        });
        // @ts-ignore
        res.status(200).json(response.record);
    } catch (err) {
        // @ts-ignore
        return res.status(500).json({error: true, message: err});
    }
}

export const getConsultarBitacoraValidacion = async (req: Request, res: Response) => {
    try {
        let iData: any;
        iData = {
            // @ts-ignore
            codBanco: req.params.codBanco,
        }
        console.log("Input Data: ", iData)
        let response: any;
        response = await validacionConsultaBitacora(iData);
        console.log("Response: ", response)
        // @ts-ignore
        if (response.error === true) return res.status(400).json({
            error: true,
            message: 'No existen registros en el sistema.'
        });
        // @ts-ignore
        res.status(200).json(response.record);
    } catch (err) {
        // @ts-ignore
        return res.status(500).json({error: true, message: err});
    }
}

export const getFileValidations = async (req: Request, res: Response) => {
    try {
        let iData: any;
        iData = {
            // @ts-ignore
            atomo: req.params.atomo,
        }
        console.log("Input Data: ", iData)
        // @ts-ignore
        let response : any = await consultarValidacionesArchivo(iData);
        // console.log("Response: ", response)
        console.log("Request Completed!")
        // @ts-ignore
        if (response.error === true) return res.status(400).json(response);
        // @ts-ignore
        res.status(200).json(response);
    } catch (err) {
        // @ts-ignore
        return res.status(500).json({error: true, message:  err, records: []});
    }
}

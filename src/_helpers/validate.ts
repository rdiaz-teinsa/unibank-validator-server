//ts-ignore
import CSVFileValidator, {ParsedResults, ValidatorConfig, RowError} from 'csv-file-validator';
import {consultarValidacionesArchivo} from '../database/validation.service';
import {filePathRoot, logsPathRoot} from './global';
import * as ts from "typescript";
const fs = require('fs');
const firstline = require("firstline");
const maxErrors: number = 10000;
const tEncode: any = 'utf-8';
let bankCode = '000';
let processDate = '19000101';

const masterValidation = (pValue: any, pType: string, pMax: number, pMin: number, naAllowed: boolean, nrAllowed: boolean) => {
    let dataType: string = typeof pValue;
    if ((pType === 'FECHA_SIB') && (pValue === processDate)) {
        return true;
    }
    else if ((pType === 'COD_BANCO') && (pValue === bankCode)) {
        return true;
    }
    else if ((nrAllowed) && (pValue === 'NR')) {
        return true;
    }
    else if ((naAllowed) && (pValue === 'NA')) {
        return true;
    }
    else if ((pType === 'NUMERIC') && (dataType === 'number')) {
            function getDecimalPart(num: number) {
                if (Number.isInteger(num)) {
                    return 0;
                }
                const decimalStr = num.toString().split('.')[1];
                const places = decimalStr.length;
                return places;
            }
            let result = false;
            let intPlaces = Math.trunc(pValue).toString().length;
            let decPlaces = getDecimalPart(pValue);
            if ((intPlaces <= pMax) && (decPlaces <= pMin)) {
                result = true
            }
            return result;
    }
    else if ((pType === 'NUMERIC') && (dataType === 'string')) {
        if (isNaN(pValue)) {
            return false;
        }
        function getDecimalPart(num: number) {
            if (Number.isInteger(num)) {
                return 0;
            }
            const decimalStr = num.toString().split('.')[1];
            const places = decimalStr.length;
            return places;
        }
        let pValuex = parseFloat(pValue);
        let result = false;
        let intPlaces = Math.trunc(pValuex).toString().length;
        let decPlaces = getDecimalPart(pValuex);
        if ((intPlaces <= pMax) && (decPlaces <= pMin)) {
            result = true
        }
        // console.log(result);
        return result;
    }
    else if ((pType === 'NVARCHAR') && (dataType === 'string') && (pValue.length >= pMin) && (pValue.length <= pMax)) {
        return true;
    }
    else if ((pType === 'NVARCHAR') && (dataType === 'number') && (pValue.toString().length >= pMin) && (pValue.toString().length <= pMax)) {
        return true;
    }
    else {
        console.error("INVALID RECORD: DATA TYPE - ", dataType, " TYPE: ", pType , " VALUE: ", pValue )
        return false;
    }
};

const masterValidationError = (headerName: string, rowNumber: number, columnNumber: number) => {
    return `El campo ${headerName}  contiene un valor invalido, linea ${rowNumber} | columna  ${columnNumber}`
}

const requiredError = (headerName: string, rowNumber: number, columnNumber: number) => {
    return `El campo ${headerName} es un valor requerido, linea ${rowNumber} | columna  ${columnNumber}`
}

const validateNoReporting = async (pFile: string) => {
    const line = await firstline(pFile);
    console.log("First line of the file: " + line);
    return line;
};

const getFileData = (fPath: string, fEncode: string) => {
    try {
        if (fs.existsSync(fPath)) {
            try {
                return fs.readFileSync(fPath, fEncode);
            } catch (erro) {
                throw erro;
            }
        } else {
            throw 'El archivo solicitado no existe, ruta: ' + fPath;
        }
    } catch (err) {
        throw err;
    }
}

const writeFileData = (fPath: string, fData: any) => {
    try {
        fs.writeFileSync(fPath, fData);
        // console.log("File written successfully");
    } catch(err) {
        console.error(err);
        throw err;
    }
}

const validateFilePath = (fPath: string) => {
    try {
        if (fs.existsSync(fPath)) {
            return true;
        } else {
            return false;
        }
    } catch (err) {
        throw err;
    }
}

const fileValidation = async (iBank: string, iDate: string, iAtom: string, iFile: string) => {
    let filePath = filePathRoot + '/' + iBank + '/' + iDate + '/' + iFile;
    let data = getFileData(filePath, tEncode);
    let response = await consultarValidacionesArchivo({atomo: iAtom});
    // console.log('VALIDATION RULES SP: ', response.validations);
    bankCode = iBank;
    processDate = iDate;
    const config: ValidatorConfig = {
        headers: eval(ts.transpile(response.validations)),
        isHeaderNameOptional: true,
        parserConfig: {
            delimiter: "~",
            newline: "",
            header: false,
	    quoteChar: '^'
            //fastMode: true
        }
    }
    const vData = await CSVFileValidator(data, config);
    const errors = vData.inValidData;
    return vData.inValidData;
};


const logError = (logFilePath: string, rowIndex: number, columnIndex: number, message: string) => {
    const data = [{ rowIndex, columnIndex, message }];
    fs.writeFileSync(logFilePath, JSON.stringify(data, null, '\t'));
};

export const masterFileValidation = async (iBank: string, iDate: string, iAtom: string, iFile: string) => {
    try {

        const noReportValue: string = iDate + '~' + iBank + '~NR';
        let atomFile: string = filePathRoot + '/' + iBank + '/' + iDate + '/' + iFile;
        let validPath = await validateFilePath(atomFile);

	if (!validPath) {
    let logFile = logsPathRoot + '/' + iBank + '_' + iDate + '_' + iAtom + '_log.json';
    let data = [
        {
            "rowIndex": 0,
            "columnIndex": 0,
            "message": "El achivo origen solicitado no existe o esta corrupto " + filePathRoot + "/" + iBank + "/" + iDate + "/" + iFile,
        }
    ];
    writeFileData(logFile, JSON.stringify(data, null,'\t'));
    
    return {
        error: true,
        message: 'El achivo origen solicitado no existe o esta corrupto ' + filePathRoot + '/' + iBank + '/' + iDate + '/' + iFile,
        file: filePathRoot + '/' + iBank + '/' + iDate + '/' + iFile,
        logs: '/' + iBank + '_' + iDate + '_' + iAtom + '_log.json',
        errors: 8888
    }
}        

        let lineValue = await validateNoReporting(atomFile);

        if(lineValue === noReportValue) {
            let datax = [
                    {
                        "rowIndex": 1,
                        "columnIndex": 1,
                        "message": "El ATOMO fue ingresado con la opción de NO REPORTAR."
                    }
                ];
            let atomFile = filePathRoot + '/' + iBank + '/' + iDate + '/' + iFile;
            let logFile = logsPathRoot + '/' + iBank + '_' + iDate + '_' + iAtom + '_log.json';
            writeFileData(logFile, JSON.stringify(datax, null,'\t'));

            return {
                error: true,
                message: 'La validación del archivo del átomo ' + iAtom + ' identifico que el mismo no se reportara.',
                file: filePathRoot + '/' + iBank + '/' + iDate + '/' + iFile,
                logs: '/' + iBank + '_' + iDate + '_' + iAtom + '_log.json',
                errors: 1
            }
        }



        const data = await fileValidation(iBank, iDate, iAtom, iFile);
        const errors = data.length;

        if(errors === 0) {
            return {
                        error: false,
                        message: 'La validación del archivo del átomo ' + iAtom + ' finalizo con éxito.',
                        file: filePathRoot + '/' + iBank + '/',
                        logs: null,
                        errors: 0
                    }

        } else {
            if (data.length > maxErrors) data.length = maxErrors;
            let logFile = logsPathRoot + '/' + iBank + '_' + iDate + '_' + iAtom + '_log.json';
            writeFileData(logFile, JSON.stringify(data, null,'\t'));

            return {
                error: true,
                message: 'La validación del archivo del átomo ' + iAtom + ' identifico errores.',
                file: filePathRoot + '/' + iBank + '/' + iDate + '/' + iFile,
                logs: '/' + iBank + '_' + iDate + '_' + iAtom + '_log.json',
                errors: data.length
            }
        }

    } catch(error) {
        const atomFilePath = filePathRoot + '/' + iBank + '/' + iDate + '/' + iFile;
        const logFile = logsPathRoot + '/' + iBank + '_' + iDate + '_' + iAtom + '_log.json';
        logError(logFile, 0, 0, 'El archivo fuente ' + atomFilePath + ' contiene errores. Error: ' + JSON.stringify(error));
        return { error: true, message: 'El archivo fuente contiene errores. Error: ' + JSON.stringify(error), file: atomFilePath, logs: logFile, errors: 9999 };
        // throw error;
    }
};



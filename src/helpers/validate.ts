import CSVFileValidator, { ValidatorConfig } from "csv-file-validator";
import { consultarValidacionesArchivo } from "../database/validation.service";
import { filePathRoot, logsPathRoot } from "./global";
import fs from "fs/promises";
import firstline from "firstline";

const maxErrors = 10000;
const tEncode = "utf16le";
const bankCode = "000";
const processDate = "19000101";

const masterValidation = (
  pValue: any,
  pType: string,
  pMax: number,
  pMin: number,
  naAllowed: boolean,
  nrAllowed: boolean,
) => {
  const dataType: string = typeof pValue;

  if (pType === "FECHA_SIB" && pValue === processDate) {
    return true;
  }
  if (pType === "COD_BANCO" && pValue === bankCode) {
    return true;
  }
  if (nrAllowed && pValue === "NR") {
    return true;
  }
  if (naAllowed && pValue === "NA") {
    return true;
  }
  if (pType === "NUMERIC") {
    if (dataType !== "number" && dataType !== "string") {
      return false;
    }
    if (isNaN(pValue)) {
      return false;
    }
    const numValue = parseFloat(pValue);
    const [integerPart, decimalPart] = numValue.toString().split(".");
    const intPlaces = integerPart.length;
    const decPlaces = decimalPart ? decimalPart.length : 0;
    return intPlaces <= pMax && decPlaces <= pMin;
  }
  if (pType === "NVARCHAR") {
    const valueLength = pValue.toString().length;
    return valueLength >= pMin && valueLength <= pMax;
  }

  console.error(
    `INVALID RECORD: DATA TYPE - ${dataType}, TYPE: ${pType}, VALUE: ${pValue}`,
  );
  return false;
};

const getValidationRules = async (atom: string): Promise<ValidatorConfig> => {
  const response = await consultarValidacionesArchivo({ atomo: atom });
  const headers = response.validations.map((validation: any) => {
    return {
      name: validation.campo,
      inputName: validation.campo,
      required: validation.requerido,
      requiredError: (
        headerName: string,
        rowNumber: number,
        columnNumber: number,
      ) =>
        `El campo ${headerName} es un valor requerido, linea ${rowNumber} | columna  ${columnNumber}`,
      validate: (value: any) =>
        masterValidation(
          value,
          validation.tipo_dato,
          validation.longitud,
          validation.precision,
          validation.na_permitido,
          validation.nr_permitido,
        ),
      validateError: (
        headerName: string,
        rowNumber: number,
        columnNumber: number,
      ) =>
        `El campo ${headerName} contiene un valor invalido, linea ${rowNumber} | columna  ${columnNumber}`,
    };
  });

  return {
    headers,
    isHeaderNameOptional: true,
    parserConfig: {
      delimiter: "~",
      newline: "",
      header: false,
      quoteChar: "^",
    },
  };
};

const validateNoReporting = async (pFile: string) => {
  const line = await firstline(pFile);
  return line;
};

const writeFileData = async (fPath: string, fData: any) => {
  try {
    await fs.writeFile(fPath, fData);
  } catch (err) {
    console.error(err);
    throw err;
  }
};

const logError = async (
  logFilePath: string,
  rowIndex: number,
  columnIndex: number,
  message: string,
) => {
  const data = [{ rowIndex, columnIndex, message }];
  await writeFileData(logFilePath, JSON.stringify(data, null, "\t"));
};

export const masterFileValidation = async (
  iBank: string,
  iDate: string,
  iAtom: string,
  iFile: string,
) => {
  const atomFile = `${filePathRoot}/${iBank}/${iDate}/${iFile}`;
  const logFile = `${logsPathRoot}/${iBank}_${iDate}_${iAtom}_log.json`;

  try {
    await fs.access(atomFile);
  } catch (error) {
    const data = [
      {
        rowIndex: 0,
        columnIndex: 0,
        message: `El achivo origen solicitado no existe o esta corrupto ${atomFile}`,
      },
    ];
    await writeFileData(logFile, JSON.stringify(data, null, "\t"));
    return {
      error: true,
      message: `El achivo origen solicitado no existe o esta corrupto ${atomFile}`,
      file: atomFile,
      logs: `/${iBank}_${iDate}_${iAtom}_log.json`,
      errors: 8888,
    };
  }

  const noReportValue = `${iDate}~${iBank}~NR`;
  const lineValue = await validateNoReporting(atomFile);

  if (lineValue === noReportValue) {
    const data = [
      {
        rowIndex: 1,
        columnIndex: 1,
        message: "El ATOMO fue ingresado con la opción de NO REPORTAR.",
      },
    ];
    await writeFileData(logFile, JSON.stringify(data, null, "\t"));
    return {
      error: true,
      message: `La validación del archivo del átomo ${iAtom} identifico que el mismo no se reportara.`,
      file: atomFile,
      logs: `/${iBank}_${iDate}_${iAtom}_log.json`,
      errors: 1,
    };
  }

  try {
    const config = await getValidationRules(iAtom);
    const data = await fs.readFile(atomFile, tEncode);
    const vData = await CSVFileValidator(data, config);
    const errors = vData.inValidData;

    if (errors.length === 0) {
      return {
        error: false,
        message: `La validación del archivo del átomo ${iAtom} finalizo con éxito.`,
        file: `${filePathRoot}/${iBank}/`,
        logs: null,
        errors: 0,
      };
    } else {
      if (errors.length > maxErrors) {
        errors.length = maxErrors;
      }
      await writeFileData(logFile, JSON.stringify(errors, null, "\t"));
      return {
        error: true,
        message: `La validación del archivo del átomo ${iAtom} identifico errores.`,
        file: atomFile,
        logs: `/${iBank}_${iDate}_${iAtom}_log.json`,
        errors: errors.length,
      };
    }
  } catch (error) {
    const err = error as Error;
    await logError(
      logFile,
      0,
      0,
      `El archivo fuente ${atomFile} contiene errores. Error: ${err.message}`,
    );
    return {
      error: true,
      message: `El archivo fuente contiene errores. Error: ${err.message}`,
      file: atomFile,
      logs: logFile,
      errors: 9999,
    };
  }
};

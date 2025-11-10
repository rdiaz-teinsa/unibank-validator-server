import { Request, Response } from "express";
import { createFolders } from "../helpers/utils";
import { exportExcelToTxt, convertUtf8ToUtf16LE } from "../helpers/converter";
import { filePathRoot, localSystem } from "../helpers/global";
import { masterFileValidation } from "../helpers/validate";
import * as validationService from "../database/validation.service";

const isEmpty = (value: any, defaultValue: string) => {
  if (
    value == null ||
    (typeof value === "string" && value.trim().length === 0)
  ) {
    return defaultValue;
  }
  return value;
};

const processAtomFile = async (
  codBanco: string,
  fechaCorte: string,
  atom: any,
  idPeriodo: number,
  usuario: string,
) => {
  const {
    ARCHIVO: filename,
    CONVERTIR: convert,
    ATOMO: code,
    ID_ATOMO: atomId,
  } = atom;
  const xlsPath = `${filePathRoot}/${codBanco}/${fechaCorte}/${filename.replace("csv", "xls")}`;
  const txtPath = `${filePathRoot}/${codBanco}/${fechaCorte}/${filename}`;

  if (convert) {
    const conversion = await exportExcelToTxt(xlsPath, txtPath, "~");
    if (conversion.error) {
      throw new Error(conversion.message);
    }
  } else {
    const encoded = await convertUtf8ToUtf16LE(txtPath);
    if (encoded.error) {
      throw new Error(encoded.message);
    }
  }

  const validation = await masterFileValidation(
    codBanco,
    fechaCorte,
    code,
    filename,
  );
  const logFile = validation.logs || " ";

  const iData = {
    codBanco,
    fechaCorte,
    idPeriodo,
    usuario,
    os: localSystem,
    ejecutables: atomId.toString(),
    rutaCarga: validation.file,
    rutaLogs: logFile.replace("C:/teinsa/atomos/logs", "archive"),
    errores: validation.errors,
  };

  return await validationService.cargarDatosAtomos(iData);
};

export const getCatalogsData = async (req: Request, res: Response) => {
  try {
    const response = await validationService.obtenerCatalogos();
    if (response.error) {
      return res.status(400).json(response);
    }
    res.status(200).json(response);
  } catch (err) {
    const error = err as Error;
    return res
      .status(500)
      .json({ error: true, message: error.message, records: [] });
  }
};

export const postGestionarPeriodo = async (req: Request, res: Response) => {
  const {
    codBanco,
    fechaCorte,
    frecuencia,
    tipoCorrida,
    usuario,
    ejecutables,
  } = req.body;
  const iData = {
    codBanco,
    fechaCorte,
    frecuencia,
    tipoCorrida,
    usuario,
    ejecutables,
  };

  try {
    await createFolders(filePathRoot, codBanco, fechaCorte);
    const response = await validationService.gestionarPeriodo(iData);
    if (response.error) {
      return res
        .status(400)
        .json({ error: true, message: "No existen registros en el sistema." });
    }
    res.status(200).json(response.record);
  } catch (err) {
    const error = err as Error;
    return res.status(500).json({ error: true, message: error.message });
  }
};

export const postCargarDatosAtomos = async (req: Request, res: Response) => {
  const {
    atomos: atomsCatalog,
    ejecutables,
    codBanco,
    fechaCorte,
    idPeriodo,
    usuario,
  } = req.body;
  const atoms: string[] = ejecutables.split(",");

  try {
    for (const atomIdStr of atoms) {
      const atomId = parseInt(atomIdStr, 10);
      const atom = atomsCatalog.find((a: any) => a.ID_ATOMO === atomId);
      if (atom) {
        await processAtomFile(codBanco, fechaCorte, atom, idPeriodo, usuario);
      }
    }
    res
      .status(200)
      .json({ error: false, message: "Carga de atomos finalizada con éxito" });
  } catch (err) {
    const error = err as Error;
    console.error("ERROR: ", error.message);
    return res.status(500).json({ error: true, message: error.message });
  }
};

export const getConsultarAtomos = async (req: Request, res: Response) => {
  const { codBanco } = req.params;
  try {
    const response = await validationService.consultarAtomos({ codBanco });
    if (response.error) {
      return res
        .status(400)
        .json({ error: true, message: "No existen registros en el sistema." });
    }
    res.status(200).json(response.record);
  } catch (err) {
    const error = err as Error;
    return res.status(500).json({ error: true, message: error.message });
  }
};

export const getConsultarPeriodos = async (req: Request, res: Response) => {
  const { codBanco } = req.params;
  try {
    const response = await validationService.consultarPeriodos({ codBanco });
    if (response.error) {
      return res
        .status(400)
        .json({ error: true, message: "No existen registros en el sistema." });
    }
    res.status(200).json(response.record);
  } catch (err) {
    const error = err as Error;
    return res.status(500).json({ error: true, message: error.message });
  }
};

export const getConsultarPeriodo = async (req: Request, res: Response) => {
  const { idPeriodo } = req.params;
  try {
    const response = await validationService.consultarPeriodo({ idPeriodo });
    if (response.error) {
      return res
        .status(400)
        .json({ error: true, message: "No existen registros en el sistema." });
    }
    res.status(200).json(response.record);
  } catch (err) {
    const error = err as Error;
    return res.status(500).json({ error: true, message: error.message });
  }
};

export const getConsultarProcesos = async (req: Request, res: Response) => {
  const { idPeriodo } = req.params;
  try {
    const response = await validationService.consultarProcesos({ idPeriodo });
    if (response.error) {
      return res
        .status(400)
        .json({ error: true, message: "No existen registros en el sistema." });
    }
    res.status(200).json(response.record);
  } catch (err) {
    const error = err as Error;
    return res.status(500).json({ error: true, message: error.message });
  }
};

export const getConsultarProcesosAtomo = async (
  req: Request,
  res: Response,
) => {
  const { atomo } = req.params;
  try {
    const response = await validationService.consultarProcesosAtomo({ atomo });
    if (response.error) {
      return res
        .status(400)
        .json({ error: true, message: "No existen registros en el sistema." });
    }
    res.status(200).json(response.record);
  } catch (err) {
    const error = err as Error;
    return res.status(500).json({ error: true, message: error.message });
  }
};

export const getConsultarProcesosFrecuencia = async (
  req: Request,
  res: Response,
) => {
  const { frecuencia, idPeriodo } = req.params;
  try {
    const response = await validationService.consultarProcesosFrecuencia({
      frecuencia,
      idPeriodo,
    });
    if (response.error) {
      return res
        .status(400)
        .json({ error: true, message: "No existen registros en el sistema." });
    }
    res.status(200).json(response.record);
  } catch (err) {
    const error = err as Error;
    return res.status(500).json({ error: true, message: error.message });
  }
};

export const postValidacionFuncionalResumen = async (
  req: Request,
  res: Response,
) => {
  const { codBanco, fechaSib, idAtomo, usuario } = req.body;
  const iData = {
    codBanco,
    fechaSib,
    idAtomo,
    usuario: isEmpty(usuario, "system"),
  };
  try {
    const response = await validationService.validacionFuncionalResumen(iData);
    if (response.error) {
      return res
        .status(400)
        .json({ error: true, message: "No existen registros en el sistema." });
    }
    res.status(200).json(response.record);
  } catch (err) {
    const error = err as Error;
    return res.status(500).json({ error: true, message: error.message });
  }
};

export const postValidacionEstructuralResumen = async (
  req: Request,
  res: Response,
) => {
  const { codBanco, fechaSib, idAtomo, usuario } = req.body;
  const iData = {
    codBanco,
    fechaSib,
    idAtomo,
    usuario: isEmpty(usuario, "system"),
  };
  try {
    const response =
      await validationService.validacionEstructuralResumen(iData);
    if (response.error) {
      return res
        .status(400)
        .json({ error: true, message: "No existen registros en el sistema." });
    }
    res.status(200).json(response.record);
  } catch (err) {
    const error = err as Error;
    return res.status(500).json({ error: true, message: error.message });
  }
};

export const postValidacionFuncionalDetalle = async (
  req: Request,
  res: Response,
) => {
  const { codBanco, fechaSib, idAtomo, idError, usuario } = req.body;
  const iData = {
    codBanco,
    fechaSib,
    idAtomo,
    idError,
    usuario: isEmpty(usuario, "system"),
  };
  try {
    const response = await validationService.validacionFuncionalDetalle(iData);
    if (response.error) {
      return res
        .status(400)
        .json({ error: true, message: "No existen registros en el sistema." });
    }
    res.status(200).json(response.record);
  } catch (err) {
    const error = err as Error;
    return res.status(500).json({ error: true, message: error.message });
  }
};

export const postValidacionEstructuralDetalle = async (
  req: Request,
  res: Response,
) => {
  const { codBanco, fechaSib, idAtomo, idError, usuario } = req.body;
  const iData = {
    codBanco,
    fechaSib,
    idAtomo,
    idError,
    usuario: isEmpty(usuario, "system"),
  };
  try {
    const response =
      await validationService.validacionEstructuralDetalle(iData);
    if (response.error) {
      return res
        .status(400)
        .json({ error: true, message: "No existen registros en el sistema." });
    }
    res.status(200).json(response.record);
  } catch (err) {
    const error = err as Error;
    return res.status(500).json({ error: true, message: error.message });
  }
};

export const postValidacionDetalleErrorEstructural = async (
  req: Request,
  res: Response,
) => {
  const {
    codBanco,
    fechaSib,
    idAtomo,
    idRec,
    idRecActual,
    idValidacion,
    usuario,
  } = req.body;
  const iData = {
    codBanco,
    fechaSib,
    idAtomo,
    idRec,
    idRecActual,
    idValidacion,
    usuario: isEmpty(usuario, "system"),
  };
  try {
    const response =
      await validationService.validacionDetalleErrorEstructural(iData);
    if (response.error) {
      return res
        .status(400)
        .json({ error: true, message: "No existen registros en el sistema." });
    }
    res.status(200).json(response.record);
  } catch (err) {
    const error = err as Error;
    return res.status(500).json({ error: true, message: error.message });
  }
};

export const postValidacionDetalleErrorFuncional = async (
  req: Request,
  res: Response,
) => {
  const {
    codBanco,
    fechaSib,
    idAtomo,
    idRec,
    idRecActual,
    idValidacion,
    usuario,
  } = req.body;
  const iData = {
    codBanco,
    fechaSib,
    idAtomo,
    idRec,
    idRecActual,
    idValidacion,
    usuario: isEmpty(usuario, "system"),
  };
  try {
    const response =
      await validationService.validacionDetalleErrorFuncional(iData);
    if (response.error) {
      return res
        .status(400)
        .json({ error: true, message: "No existen registros en el sistema." });
    }
    res.status(200).json(response.record);
  } catch (err) {
    const error = err as Error;
    return res.status(500).json({ error: true, message: error.message });
  }
};

export const postValidacionConsultaIndicadores = async (
  req: Request,
  res: Response,
) => {
  const { codBanco, atomo, fechaSib, usuario } = req.body;
  const iData = {
    codBanco,
    atomo,
    fechaSib,
    usuario: isEmpty(usuario, "system"),
  };
  try {
    const response =
      await validationService.validacionConsultaIndicadores(iData);
    if (response.error) {
      return res
        .status(400)
        .json({ error: true, message: "No existen registros en el sistema." });
    }
    res.status(200).json(response.record);
  } catch (err) {
    const error = err as Error;
    return res.status(500).json({ error: true, message: error.message });
  }
};

export const postValidacionConsultaTablero = async (
  req: Request,
  res: Response,
) => {
  const { codBanco, atomo, fechaSib, usuario } = req.body;
  const iData = {
    codBanco,
    atomo,
    fechaSib: isEmpty(fechaSib, "2023-11-24"),
    usuario: isEmpty(usuario, "system"),
  };
  try {
    const response = await validationService.validacionConsultaTablero(iData);
    if (response.error) {
      return res
        .status(400)
        .json({ error: true, message: "No existen registros en el sistema." });
    }
    res.status(200).json(response.record);
  } catch (err) {
    const error = err as Error;
    return res.status(500).json({ error: true, message: error.message });
  }
};

export const getConsultarBitacoraValidacion = async (
  req: Request,
  res: Response,
) => {
  const { codBanco } = req.params;
  try {
    const response = await validationService.validacionConsultaBitacora({
      codBanco,
    });
    if (response.error) {
      return res
        .status(400)
        .json({ error: true, message: "No existen registros en el sistema." });
    }
    res.status(200).json(response.record);
  } catch (err) {
    const error = err as Error;
    return res.status(500).json({ error: true, message: error.message });
  }
};

export const getFileValidations = async (req: Request, res: Response) => {
  const { atomo } = req.params;
  try {
    const response = await validationService.consultarValidacionesArchivo({
      atomo,
    });
    if (response.error) {
      return res.status(400).json(response);
    }
    res.status(200).json(response);
  } catch (err) {
    const error = err as Error;
    return res
      .status(500)
      .json({ error: true, message: error.message, records: [] });
  }
};

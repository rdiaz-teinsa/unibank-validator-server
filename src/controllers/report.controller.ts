import { Request, Response } from "express";
import * as reportService from "../database/report.service";

interface ReportParams {
  codBanco?: string;
  fechaCorte?: string;
  fechaSIB?: string;
  idAtomo?: number;
  tipo?: string;
  idReporte?: number;
  campoComparacion?: string;
  campoSumatoria?: string;
  inputData?: any;
  numRegla?: number;
}

const reportFunctionMap: { [key: string]: (data: any) => Promise<any> } = {
  "000": reportService.callRepComparacionCatalogos,
  "001": reportService.callCatalogosRepPrestamosExcluidos,
  "100": reportService.callRepComparacion,
  "111": reportService.callRepAT03Comparacion,
  "112": reportService.callRepAT03ComparacionActividad,
  "113": reportService.callRepAT03ComparacionNacionalidad,
  "114": reportService.callRepAT12Comparacion,
  "115": reportService.callRepAT15Comparacion,
  "210": reportService.callRepAT02AT07,
  "220": reportService.callRepAT03R1,
  "245": reportService.callRepAT10EvapR1,
  "255": reportService.callRepAT12AT02R1,
  "256": reportService.callRepAT12AT02R2,
  "260": reportService.callRepAT12AT03R1,
  "261": reportService.callRepAT12AT03R2,
  "262": reportService.callRepAT12AT03R3,
  "263": reportService.callRepAT12AT03R4,
  "270": reportService.callRepCuadreAT12MontoGarantia,
  "280": reportService.callRepAT15AT07R1,
  "285": reportService.callRepBAN01AT05R1,
  "290": reportService.callRepComparacionBAN01AT08,
  "295": reportService.callRepCuadreBAN03AT03R1,
  "296": reportService.callRepCuadreBAN03AT03R2,
  "297": reportService.callRepCuadreBAN03AT03R3,
  "300": reportService.callRepBAN03AT03TipoRelacion,
  "305": reportService.callRepBAN06AT03Categoria,
  "310": reportService.callRepBAN06AT03Global,
  "315": reportService.callRepBAN10AT03R1,
  "320": reportService.callRepBAN10AT03R2,
  "325": reportService.callRepBAN10Only,
  "330": reportService.callRepIndiceLiquidezSemanal,
  "345": reportService.callRepValidacionCruzada,
  "761": reportService.callRepAT09All,
  "763": reportService.callRepAT21Comparacion,
  "764": reportService.callRepAT02AT21XRegion,
  "765": reportService.callRepAT03AT21XRegion,
  "766": reportService.callRepAT04AT21,
  "767": reportService.callRepAT05AT21,
  "768": reportService.callRepAT12AT21,
  "769": reportService.callRepAT15AT21XRegion,
  "770": reportService.callRepAT21Only,
  "771": reportService.callRepAT21Only2,
  "772": reportService.callRepCuadreAT21AT12AT03VsAT02,
  "773": reportService.callRepAT07AT21XRegion,
  "774": reportService.callRepBA09_AT21,
  "775": reportService.callRepPrestamosExcluidos,
  "776": reportService.callRepCuadreAT12BAN06TipoGarantia,
  "777": reportService.callRepComparacionBAN06CINU,
  "778": reportService.callRepComparacionBAN06CINUAT03,
  "800": reportService.callRepAT21UtilidadRegion,
  "1000": reportService.callRepValidacionMatematica,
  "1001": reportService.callRepValidacionMatematicaDetalle,
};

const uppercaseKeys = (obj: any) => {
  return Object.keys(obj).reduce((accumulator, key) => {
    (accumulator as any)[key.toUpperCase()] = obj[key];
    return accumulator;
  }, {});
};

const normalizeProperties = (iData: any[]) => {
  if (iData.length > 0) {
    return iData.map(uppercaseKeys);
  }
  return iData;
};

export const getReportData = async (req: Request, res: Response) => {
  const { code } = req.params;
  const params: ReportParams = req.body;
  params.fechaSIB = params.fechaCorte?.replace(/-/g, "");

  try {
    const reportFunction = reportFunctionMap[code];
    if (!reportFunction) {
      return res
        .status(400)
        .json({ error: true, message: "Invalid report code." });
    }

    const response = await reportFunction(params);

    if (response.error) {
      return res
        .status(400)
        .json({ error: true, message: "No existen registros en el sistema." });
    }

    if (code !== "000") {
      response.record = normalizeProperties(response.record);
    }

    res.status(200).json(response);
  } catch (err) {
    const error = err as Error;
    return res.status(500).json({ error: true, message: error.message });
  }
};

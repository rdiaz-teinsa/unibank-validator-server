import {Request, Response} from 'express';
import {
    callRepComparacionCatalogos,
    callRepComparacion,
    callRepAT03Comparacion,
    callRepAT03ComparacionActividad,
    callRepAT03ComparacionNacionalidad,
    callRepAT12Comparacion,
    callRepAT15Comparacion,
    callRepAT02AT07,
    callRepAT03R1,
    callRepAT10EvapR1,
    callRepAT15AT07R1,
    callRepBAN01AT05R1,
    callRepBAN10AT03R1,
    callRepBAN10AT03R2,
    callRepBAN10Only,
    callRepIndiceLiquidezSemanal,
    callRepAT09All,
    callRepAT21Comparacion,
    callRepAT02AT21XRegion,
    callRepAT03AT21XRegion,
    callRepAT04AT21,
    callRepAT05AT21,
    callRepAT12AT21,
    callRepAT15AT21XRegion,
    callRepAT21Only,
    callRepAT21Only2,
    callRepCuadreAT21AT12AT03VsAT02,
    callRepAT07AT21XRegion,
    callRepBA09_AT21,
    callRepAT21UtilidadRegion,
    callRepValidacionMatematica,
    callRepValidacionMatematicaDetalle,
    callRepBAN06AT03Global,
    callRepBAN06AT03Categoria,
    callRepBAN03AT03TipoRelacion,
    callRepCuadreAT12MontoGarantia,
    callRepComparacionBAN01AT08,
    callRepAT12AT02R1,
    callRepAT12AT02R2,
    callRepAT12AT03R1,
    callRepAT12AT03R2,
    callRepAT12AT03R3,
    callRepAT12AT03R4,
    callRepCuadreBAN03AT03R1,
    callRepCuadreBAN03AT03R2,
    callRepCuadreBAN03AT03R3,
    callRepValidacionCruzada,
    callRepPrestamosExcluidos,
    callRepCuadreAT12BAN06TipoGarantia,
    callRepComparacionBAN06CINU,
    callRepComparacionBAN06CINUAT03,
    callCatalogosRepPrestamosExcluidos,
    callRepCuadrePb01
} from '../database/report.service';

export const getReportData = async (req: Request, res: Response) => {
    try {
        let iData: any;
        let rptcode: string;

        // @ts-ignore
        rptcode = req.params.code;

        iData = {
            // @ts-ignore
            codBanco: req.body.codBanco,
            // @ts-ignore
            fechaCorte: req.body.fechaCorte,
            // @ts-ignore
            fechaSIB: req.body.fechaCorte.replaceAll('-', ''),
            // @ts-ignore
            idAtomo: req.body.idAtomo || null,
            // @ts-ignore
            tipo: req.body.tipo || null,
            // @ts-ignore
            idReporte: req.body.idReporte || 0,
            // @ts-ignore
            campoComparacion: req.body.campoComparacion || null,
            // @ts-ignore
            campoSumatoria: req.body.campoSumatoria || null,
            // @ts-ignore
            inputData: req.body.inputData || null,
            // @ts-ignore
            numRegla: req.body.numRegla || 0,
        }
        console.log("Request: ", iData)
        let response: any;

        if (rptcode === '000') {
            response = await callRepComparacionCatalogos(iData);
        } else if (rptcode === '001') {
            response = await callCatalogosRepPrestamosExcluidos(iData);
        } else if (rptcode === '100') {
            response = await callRepComparacion(iData);
        } else if (rptcode === '111') {
            response = await callRepAT03Comparacion(iData);
        } else if (rptcode === '112') {
            response = await callRepAT03ComparacionActividad(iData);
        } else if (rptcode === '113') {
            response = await callRepAT03ComparacionNacionalidad(iData);
        } else if (rptcode === '114') {
            response = await callRepAT12Comparacion(iData);
        } else if (rptcode === '115') {
            response = await callRepAT15Comparacion(iData);
        } else if (rptcode === '210') {
            response = await callRepAT02AT07(iData);
        } else if (rptcode === '220') {
            response = await callRepAT03R1(iData);
        } else if (rptcode === '245') {
            response = await callRepAT10EvapR1(iData);
        } else if (rptcode === '255') {
            response = await callRepAT12AT02R1(iData);
        } else if (rptcode === '256') {
            response = await callRepAT12AT02R2(iData);
        } else if (rptcode === '260') {
            response = await callRepAT12AT03R1(iData);
        } else if (rptcode === '261') {
            response = await callRepAT12AT03R2(iData);
        } else if (rptcode === '262') {
            response = await callRepAT12AT03R3(iData);
        } else if (rptcode === '263') {
            response = await callRepAT12AT03R4(iData);
        } else if (rptcode === '270') {
            response = await callRepCuadreAT12MontoGarantia(iData);
        } else if (rptcode === '280') {
            response = await callRepAT15AT07R1(iData);
        } else if (rptcode === '285') {
            response = await callRepBAN01AT05R1(iData);
        } else if (rptcode === '290') {
            response = await callRepComparacionBAN01AT08(iData);
        } else if (rptcode === '295') {
            response = await callRepCuadreBAN03AT03R1(iData);
        } else if (rptcode === '296') {
            response = await callRepCuadreBAN03AT03R2(iData);
        } else if (rptcode === '297') {
            response = await callRepCuadreBAN03AT03R3(iData);
        } else if (rptcode === '300') {
            response = await callRepBAN03AT03TipoRelacion(iData);
        } else if (rptcode === '305') {
            response = await callRepBAN06AT03Categoria(iData);
        } else if (rptcode === '310') {
            response = await callRepBAN06AT03Global(iData);
        } else if (rptcode === '315') {
            console.info("REPORT CODE 315");
            response = await callRepBAN10AT03R1(iData);
        } else if (rptcode === '320') {
            console.info("REPORT CODE 320");
            response = await callRepBAN10AT03R2(iData);
        } else if (rptcode === '325') {
            response = await callRepBAN10Only(iData);
        } else if (rptcode === '330') {
            response = await callRepIndiceLiquidezSemanal(iData);
        } else if (rptcode === '345') {
            response = await callRepValidacionCruzada(iData);
        } else if (rptcode === '761') {
            response = await callRepAT09All(iData);
        } else if (rptcode === '763') {
            response = await callRepAT21Comparacion(iData);
        } else if (rptcode === '763') {
            response = await callRepAT21Comparacion(iData);
        } else if (rptcode === '764') {
            response = await callRepAT02AT21XRegion(iData);
        } else if (rptcode === '765') {
            response = await callRepAT03AT21XRegion(iData);
        } else if (rptcode === '766') {
            response = await callRepAT04AT21(iData);
        } else if (rptcode === '767') {
            response = await callRepAT05AT21(iData);
        } else if (rptcode === '768') {
            response = await callRepAT12AT21(iData);
        } else if (rptcode === '769') {
            response = await callRepAT15AT21XRegion(iData);
        } else if (rptcode === '770') {
            response = await callRepAT21Only(iData);
        } else if (rptcode === '771') {
            response = await callRepAT21Only2(iData);
        } else if (rptcode === '772') {
            response = await callRepCuadreAT21AT12AT03VsAT02(iData);
        } else if (rptcode === '773') {
            response = await callRepAT07AT21XRegion(iData);
        } else if (rptcode === '774') {
            response = await callRepBA09_AT21(iData);
        } else if (rptcode === '775') {
            response = await callRepPrestamosExcluidos(iData);
        } else if (rptcode === '776') {
            response = await callRepCuadreAT12BAN06TipoGarantia(iData);
        } else if (rptcode === '777') {
            response = await callRepComparacionBAN06CINU(iData);
        } else if (rptcode === '778') {
            response = await callRepComparacionBAN06CINUAT03(iData);
        } else if (rptcode === '800') {
            response = await callRepAT21UtilidadRegion(iData)
        } else if (rptcode === '1000') {
            response = await callRepValidacionMatematica(iData)
        } else if (rptcode === '1001') {
            response = await callRepValidacionMatematicaDetalle(iData)
        } else if (rptcode === '1002') {
            response = await callRepCuadrePb01(iData)
        }

        let records : any = [];

        function uppercaseKeys(obj: any) {
            return Object.keys(obj).reduce((accumulator, key) => {
                // @ts-ignore
                accumulator[key.toUpperCase()] = obj[key];
                return accumulator;
            }, {});
        }

        function normalizeProperties (iData: any) {
            try {
                if (iData.length > 0) {

                    for(let i = 0; i < iData.length; i++) {
                        let objData = iData[i];
                        let objx = uppercaseKeys(objData);
                        records.push(objx);
                    }

                    delete response.record;
                    response.record = records;
                }

            } catch(err) {
                throw err;
            }
        }

        if (rptcode != '000') {
            normalizeProperties(response.record);
        }


        console.log("RESPONSE NORMALIZED: ", response)

        // @ts-ignore
        if (response.error === true) return res.status(400).json({
            error: true,
            message: 'No existen registros en el sistema.'
        });
        // @ts-ignore
        res.status(200).json(response);
    } catch (err) {
        // @ts-ignore
        return res.status(500).json({error: true, message: err});
    }
}


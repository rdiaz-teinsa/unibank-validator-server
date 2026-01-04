import ExcelJS from "exceljs";
import * as fs from "fs";
import * as path from "path";
import * as iconv from "iconv-lite";

export const exportExcelToTxt = async (
    inputPath: string,
    outputPath: string,
    delimiter: string
) => {
    try {
        /* ==========================================
           VALIDACIONES
        ========================================== */
        if (!fs.existsSync(inputPath)) {
            return {
                error: true,
                message: "El archivo origen solicitado no existe o está corrupto: " + inputPath
            };
        }

        const ext = path.extname(inputPath).toLowerCase();
        if (ext !== ".xlsx") {
            return {
                error: true,
                message: "Formato no soportado. Solo se permiten archivos .xlsx: " + inputPath
            };
        }

        /* ==========================================
           READ EXCEL
        ========================================== */
        const workbook = new ExcelJS.Workbook();
        await workbook.xlsx.readFile(inputPath);

        const sheet = workbook.worksheets[0];
        if (!sheet) {
            return {
                error: true,
                message: "No se encontró ninguna hoja válida en el archivo Excel: " + inputPath
            };
        }

        /* ==========================================
           EXTRACCIÓN DE DATOS (TODO COMO TEXTO)
           cell.text === equivalente seguro a cell.w
        ========================================== */
        const rowsAsText: string[][] = [];

        sheet.eachRow({ includeEmpty: true }, (row) => {
            const rowValues: string[] = [];

            row.eachCell({ includeEmpty: true }, (cell) => {
                // 👇 cell.text preserva formato visible (ceros, fechas, decimales)
                rowValues.push(cell.text ?? "");
            });

            rowsAsText.push(rowValues);
        });

        if (rowsAsText.length <= 1) {
            return {
                error: true,
                message: "La hoja de Excel está vacía o solo contiene encabezados: " + inputPath
            };
        }

        /* ==========================================
           HEADERS
        ========================================== */
        const headers = rowsAsText[0].map(h => h.trim());

        /* ==========================================
           DATA
        ========================================== */
        const dataRows = rowsAsText.slice(1);
        const lines: string[] = [];

        lines.push(headers.join(delimiter));

        for (const row of dataRows) {
            lines.push(row.map(v => v ?? "").join(delimiter));
        }

        /* ==========================================
           WRITE TXT UTF-16 LE + BOM
        ========================================== */
        const txtContent = lines.join("\n");
        const bom = Buffer.from([0xff, 0xfe]);
        const buffer = Buffer.concat([
            bom,
            iconv.encode(txtContent, "utf16-le")
        ]);

        fs.writeFileSync(outputPath, buffer);

        return {
            error: false,
            message: "Archivo exportado correctamente a: " + outputPath
        };

    } catch (error: any) {
        return {
            error: true,
            message: "Error al exportar el archivo: " + error.message
        };
    }
};

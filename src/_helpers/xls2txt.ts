import * as XLSX from "xlsx";
import * as fs from "fs";
import * as path from "path";
import iconv from 'iconv-lite';
// import * as iconv from "iconv-lite";

function exportValue(cell: any): string {
    if (cell == null) return "";

    if (typeof cell === "number") {
        // Convierte sin aplicar formato Excel (evita redondeo)
        return cell.toString();
    }
    return String(cell).trim();
}

export const exportExcelToTxt = (
    inputPath: string,
    outputPath: string,
    delimiter: string
) => {
    try {
        if (!fs.existsSync(inputPath)) {
            return {
                error: true,
                message: "El archivo origen solicitado no existe o está corrupto: " + inputPath
            };
        }

        const ext = path.extname(inputPath).toLowerCase();
        if (![".xls", ".xlsx"].includes(ext)) {
            return {
                error: true,
                message: "Formato no soportado. Solo se permiten archivos .xls o .xlsx: " + inputPath
            };
        }

        const workbook = XLSX.readFile(inputPath, {
            raw: true,          // 🔒 CRÍTICO: evita formato Excel
            cellText: false,
            type: "binary"
        });

        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];

        if (!sheet || !sheet["!ref"]) {
            return {
                error: true,
                message: "No se encontró ninguna hoja válida en el archivo Excel: " + inputPath
            };
        }

        const range = XLSX.utils.decode_range(sheet["!ref"]);

        /* ==========================
           HEADERS (RAW)
        ========================== */
        const headers: string[] = [];

        for (let c = range.s.c; c <= range.e.c; c++) {
            const addr = XLSX.utils.encode_cell({ r: range.s.r, c });
            const cell = sheet[addr];
            headers.push(exportValue(cell?.v ?? ""));
        }

        /* ==========================
           DATA (RAW)
        ========================== */
        const data: any[][] = XLSX.utils.sheet_to_json(sheet, {
            header: 1,
            defval: "",
            raw: true        // 🔒 evita redondeos
        });

        if (data.length <= 1) {
            return {
                error: true,
                message: "La hoja de Excel está vacía o solo contiene encabezados: " + inputPath
            };
        }

        const rows = data.slice(1);
        const lines: string[] = [];

        lines.push(headers.join(delimiter));

        for (const row of rows) {
            const line = row
                .map(cell => exportValue(cell))
                .join(delimiter);
            lines.push(line);
        }

        /* ==========================
           WRITE TXT UTF-16 LE
        ========================== */
        const txtContent = lines.join("\n");
        const bom = Buffer.from([0xff, 0xfe]);
        const buffer = Buffer.concat([bom, iconv.encode(txtContent, "utf16-le")]);

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
import * as XLSX from "xlsx";
import * as fs from "fs";
import * as path from "path";
import * as iconv from "iconv-lite";


function getExcelDecimals(cell: XLSX.CellObject): number {
    if (!cell || typeof cell.z !== "string") return 0;

    const match = cell.z.match(/\.(0+|#+)/);
    return match ? match[1].length : 0;
}

function safeToFixed(value: number, decimals: number): string {
    const factor = Math.pow(10, decimals);
    const normalized = Math.round((value + Number.EPSILON) * factor) / factor;
    return normalized.toFixed(decimals);
}

function formatCell(cell?: XLSX.CellObject): string {
    if (!cell) return "";

    if (cell.t === "n" && typeof cell.v === "number") {
        const decimals = getExcelDecimals(cell);
        return safeToFixed(cell.v, decimals);
    }

    return String(cell.v ?? "");
}

import * as XLSX from "xlsx";
import * as fs from "fs";
import * as path from "path";
import * as iconv from "iconv-lite";

export const exportExcelToTxt = (
    inputPath: string,
    outputPath: string,
    delimiter: string
) => {
    try {
        if (!fs.existsSync(inputPath)) {
            return { error: true, message: "El archivo origen no existe: " + inputPath };
        }

        const ext = path.extname(inputPath).toLowerCase();
        if (![".xls", ".xlsx"].includes(ext)) {
            return { error: true, message: "Formato no soportado: " + inputPath };
        }

        const workbook = XLSX.readFile(inputPath, { raw: false });
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        if (!sheet || !sheet["!ref"]) {
            return { error: true, message: "Hoja vacía o inválida" };
        }

        const range = XLSX.utils.decode_range(sheet["!ref"]);
        const lines: string[] = [];

        // Encabezados
        const headers: string[] = [];
        for (let c = range.s.c; c <= range.e.c; c++) {
            const addr = XLSX.utils.encode_cell({ r: range.s.r, c });
            headers.push(formatCell(sheet[addr]));
        }
        lines.push(headers.join(delimiter));

        // Filas
        for (let r = range.s.r + 1; r <= range.e.r; r++) {
            const row: string[] = [];
            for (let c = range.s.c; c <= range.e.c; c++) {
                const addr = XLSX.utils.encode_cell({ r, c });
                row.push(formatCell(sheet[addr]));
            }
            lines.push(row.join(delimiter));
        }

        const txtContent = lines.join("\n");
        const bom = Buffer.from([0xff, 0xfe]);
        const buffer = Buffer.concat([bom, iconv.encode(txtContent, "utf16-le")]);
        fs.writeFileSync(outputPath, buffer);

        return { error: false, message: "Archivo exportado correctamente" };
    } catch (err: any) {
        return { error: true, message: err.message };
    }
};

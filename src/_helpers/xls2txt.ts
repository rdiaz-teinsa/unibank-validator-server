import * as XLSX from "xlsx";
import * as fs from "fs";
import * as path from "path";
import * as iconv from "iconv-lite";

function convertNumericCellsToSafeText(sheet: XLSX.WorkSheet) {
    if (!sheet["!ref"]) return;

    const range = XLSX.utils.decode_range(sheet["!ref"]);

    for (let r = range.s.r; r <= range.e.r; r++) {
        for (let c = range.s.c; c <= range.e.c; c++) {
            const addr = XLSX.utils.encode_cell({ r, c });
            const cell = sheet[addr];
            if (!cell || cell.t !== "n") continue;

            const v = cell.v;

            // 1️⃣ Redondeo defensivo (evita IEEE-754 noise)
            const normalized = Number(v.toFixed(10));

            // 2️⃣ Convertir a string sin notación científica
            let text = normalized.toString();

            // 3️⃣ Normalizar decimales
            if (text.includes(".")) {
                let [int, dec] = text.split(".");

                // eliminar basura final (ej: 92999995)
                dec = dec.replace(/0+$/, "");

                // mínimo 2 decimales
                if (dec.length < 2) {
                    dec = dec.padEnd(2, "0");
                }

                text = `${int}.${dec}`;
            } else {
                // número entero → mínimo 2 decimales
                text = `${text}.00`;
            }

            cell.v = text;
            cell.t = "s";
            delete cell.w;
        }
    }
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
            raw: false,      // necesario para que cell.w exista
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

        /* ==========================================
           🔒 CONVERSIÓN GLOBAL NÚMEROS → TEXTO (cell.w)
        ========================================== */
        convertNumericCellsToSafeText(sheet);

        const range = XLSX.utils.decode_range(sheet["!ref"]);

        /* ==========================================
           HEADERS
        ========================================== */
        const headers: string[] = [];
        for (let c = range.s.c; c <= range.e.c; c++) {
            const addr = XLSX.utils.encode_cell({ r: range.s.r, c });
            const cell = sheet[addr];
            headers.push(cell ? String(cell.v).trim() : "");
        }

        /* ==========================================
           DATA (YA TODO ES TEXTO)
        ========================================== */
        const data: any[][] = XLSX.utils.sheet_to_json(sheet, {
            header: 1,
            defval: "",
            raw: true
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
            const line = row.map(cell => String(cell ?? "")).join(delimiter);
            lines.push(line);
        }

        /* ==========================================
           WRITE TXT UTF-16 LE
        ========================================== */
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

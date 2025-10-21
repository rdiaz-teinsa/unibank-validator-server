import * as XLSX from "xlsx";
import * as fs from "fs";
import * as path from "path";
import * as iconv from "iconv-lite";

export const exportExcelToTxt = (inputPath: string, outputPath: string, delimiter: string) => {
    try {
        if (!fs.existsSync(inputPath)) {
            return {
                error: true,
                message: "El archivo origen solicitado no existe o está corrupto: " + inputPath
            };
        }

        const ext = path.extname(inputPath).toLowerCase();
        if (ext !== ".xls" && ext !== ".xlsx") {
            return {
                error: true,
                message: "Formato no soportado. Solo se permiten archivos .xls o .xlsx: " + inputPath
            };
        }

        const workbook = XLSX.readFile(inputPath, { raw: false, type: "binary" });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];

        if (!sheet) {
            return {
                error: true,
                message: "No se encontró ninguna hoja en el archivo Excel: " + inputPath
            };
        }

        const range = XLSX.utils.decode_range(sheet["!ref"]!);

        const headers: string[] = [];
        for (let c = range.s.c; c <= range.e.c; c++) {
            const cellAddress = XLSX.utils.encode_cell({ r: range.s.r, c });
            const cell = sheet[cellAddress];
            headers.push(cell ? String(cell.v).trim() : "");
        }

        const data: any[][] = XLSX.utils.sheet_to_json(sheet, { header: 1, defval: "" });

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

        const txtContent = lines.join("\n");

        const bom = Buffer.from([0xFF, 0xFE]);
        const buffer = Buffer.concat([bom, iconv.encode(txtContent, "utf16-le")]);

        // const buffer = iconv.encode(txtContent, "utf16-le");
        fs.writeFileSync(outputPath, buffer);

        console.log(`Archivo exportado correctamente a: ${outputPath}`);
        return {
            error: false,
            message: "Archivo exportado correctamente a: " + outputPath
        };
    } catch (error: any) {
        console.error("Error al exportar el archivo:", error.message);
        return {
            error: true,
            message: "Error al exportar el archivo: " + error.message
        };
    }
};

import * as XLSX from "xlsx";
import * as fs from "fs";
import * as path from "path";
import iconv from 'iconv-lite';
// import * as iconv from "iconv-lite";

const exportExcelToTxt = (inputPath: string, outputPath: string, delimiter: string) => {
    try {
        // Validar existencia del archivo
        if (!fs.existsSync(inputPath)) {
            return {
                error: true,
                message: "El archivo origen solicitado no existe o está corrupto: " + inputPath
            };
        }

        // Validar extensión
        const ext = path.extname(inputPath).toLowerCase();
        if (ext !== ".xls" && ext !== ".xlsx") {
            return {
                error: true,
                message: "Formato no soportado. Solo se permiten archivos .xls o .xlsx: " + inputPath
            };
        }

        // Leer el archivo Excel
        const workbook = XLSX.readFile(inputPath, { raw: false, type: "binary" });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];

        if (!sheet) {
            return {
                error: true,
                message: "No se encontró ninguna hoja en el archivo Excel: " + inputPath
            };
        }

        // Obtener el rango de la hoja
        const range = XLSX.utils.decode_range(sheet["!ref"]!);

        // Leer la fila de encabezados en el orden original
        const headers: string[] = [];
        for (let c = range.s.c; c <= range.e.c; c++) {
            const cellAddress = XLSX.utils.encode_cell({ r: range.s.r, c });
            const cell = sheet[cellAddress];
            headers.push(cell ? String(cell.v).trim() : "");
        }

        // Obtener los datos en formato de matriz (mantiene orden original)
        const data: any[][] = XLSX.utils.sheet_to_json(sheet, { header: 1, defval: "" });

        if (data.length <= 1) {
            return {
                error: true,
                message: "La hoja de Excel está vacía o solo contiene encabezados: " + inputPath
            };
        }

        // Eliminar la primera fila (encabezados)
        // const rows = data.slice(1);
        const rows = data;

        // Crear contenido TXT manteniendo el orden de columnas
        const lines: string[] = [];
        lines.push(headers.join(delimiter)); // Encabezados
        for (const row of rows) {
            const line = row.map(cell => String(cell ?? "")).join(delimiter);
            lines.push(line);
        }

        const txtContent = lines.join("\r\n");

        // Codificar en UTF-16LE
        const buffer = iconv.encode(txtContent, "utf16-le");

        // Escribir archivo
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

// Ejemplo de uso
const result = exportExcelToTxt(
    "/var/teinsa/unibank-validator-server/archive/data/236/20250101/AT04.xls",
    "/var/teinsa/unibank-validator-server/archive/data/236/20250101/AT04.txt",
    "~"
);

console.log(result);

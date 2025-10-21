import * as XLSX from "xlsx";
import * as fs from "fs";
import * as path from "path";
import * as iconv from "iconv-lite";

const exportExcelToTxt = (inputPath: string, outputPath: string, delimiter: string) => {
    try {

        if (!fs.existsSync(inputPath)) {
            return {
                error: true,
                message: 'El achivo origen solicitado no existe o esta corrupto ' + inputPath
            }
        }

        const ext = path.extname(inputPath).toLowerCase();
        if (ext !== ".xls" && ext !== ".xlsx") {
            return {
                error: true,
                message: 'Formato no soportado. Solo se permiten archivos .xls o .xlsx ' + inputPath
            }
        }

        const workbook = XLSX.readFile(inputPath, {
            raw: false,
            type: "binary"
        });

        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];

        if (!sheet) {
            return {
                error: true,
                message: 'No se encontró ninguna hoja en el archivo Excel ' + inputPath
            }
        }

        const jsonData: any[] = XLSX.utils.sheet_to_json(sheet, {defval: ""});

        if (jsonData.length === 0) {
            return {
                error: true,
                message: 'La hoja de Excel está vacía. ' + inputPath
            }
        }

        const headers = Object.keys(jsonData[0]);
        const rows: string[] = [];
        rows.push(headers.join(delimiter));

        for (const row of jsonData) {
            const line = headers.map((h) => `${row[h] ?? ""}`).join(delimiter);
            rows.push(line);
        }

        const txtContent = rows.join("\r\n");
        const buffer = iconv.encode(txtContent, "utf16-le");

        fs.writeFileSync(outputPath, buffer);

        console.log(`Archivo exportado correctamente a: ${outputPath}`);

        return {
            error: false,
            message: 'Archivo exportado correctamente a: ' + outputPath
        }
    }
    catch (error: any) {
        console.error("Error al exportar el archivo:", error.message);
        return {
            error: true,
            message: 'Error al exportar el archivo: ' + error.message
        }
    }
}

exportExcelToTxt("/var/unibank-validator-server/archive/data/236/20250101/AT04.xls", "/var/unibank-validator-server/archive/data/236/20250101/AT04.txt", "~");
// import * as XLSX from "xlsx";
import ExcelJS from "exceljs";
import * as fs from "fs";
import * as path from "path";
import * as iconv from "iconv-lite";
import { exec, execSync } from "child_process";

function ensureFileExists(filePath: string) {
    if (!fs.existsSync(filePath)) {
        throw new Error(`Archivo no existe o es inválido: ${filePath}`);
    }
}

function generateTempXlsxPath(inputPath: string) {
    const dir = path.dirname(inputPath);
    const base = path.basename(inputPath, path.extname(inputPath));
    return path.join(dir, `${base}.__tmp__.xlsx`);
}

function convertXlsToXlsxSync(inputPath: string): string {
    const outputPathXlsx = generateTempXlsxPath(inputPath);
    execSync(
        `libreoffice --headless --convert-to xlsx "${inputPath}" --outdir "${path.dirname(outputPathXlsx)}"`,
        { stdio: "ignore" }
    );
    let savedPath = inputPath + "s";
    fs.renameSync(savedPath, outputPathXlsx);
    return outputPathXlsx;
}

export const exportExcelToTxt = (
    inputPath: string,
    outputPath: string,
    delimiter: string
) => {
    let tempXlsx: string | null = null;

    try {
        ensureFileExists(inputPath);

        const ext = path.extname(inputPath).toLowerCase();
        let xlsxPath = inputPath;

        if (ext === ".xls") {
            console.log("Archivo de Entrada: ", inputPath)
            tempXlsx = convertXlsToXlsxSync(inputPath);
            xlsxPath = tempXlsx;
        } else if (ext !== ".xlsx") {
            throw new Error("Formato no soportado. Solo .xls o .xlsx");
        }

        const workbook = new ExcelJS.Workbook();
        workbook.xlsx.readFile(xlsxPath); // sync-like (interno)

        const sheet = workbook.worksheets[0];
        if (!sheet) throw new Error("No se encontró hoja válida");

        const lines: string[] = [];

        sheet.eachRow({ includeEmpty: true }, row => {
            // @ts-ignore
            const values = row.values.slice(1).map(v => (typeof v === "object" && v && "text" in v ? v.text : String(v ?? "")));

            lines.push(values.join(delimiter));
        });

        const bom = Buffer.from([0xff, 0xfe]);
        const buffer = Buffer.concat([bom, iconv.encode(lines.join("\n"), "utf16-le")]);
        fs.writeFileSync(outputPath, buffer);

        return { error: false, message: `Archivo exportado: ${outputPath}` };

    } catch (err: any) {
        return { error: true, message: err.message };

    } finally {
        if (tempXlsx && fs.existsSync(tempXlsx)) {
            fs.unlinkSync(tempXlsx);
        }
    }
};

/*export const exportExcelToTxt = (
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

        /!* ==========================================
           🔒 CONVERSIÓN GLOBAL NÚMEROS → TEXTO (cell.w)
        ========================================== *!/
        convertNumericCellsToTextUsingVisibleValue(sheet);

        const range = XLSX.utils.decode_range(sheet["!ref"]);

        /!* ==========================================
           HEADERS
        ========================================== *!/
        const headers: string[] = [];
        for (let c = range.s.c; c <= range.e.c; c++) {
            const addr = XLSX.utils.encode_cell({ r: range.s.r, c });
            const cell = sheet[addr];
            headers.push(cell ? String(cell.v).trim() : "");
        }

        /!* ==========================================
           DATA (YA TODO ES TEXTO)
        ========================================== *!/
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

        /!* ==========================================
           WRITE TXT UTF-16 LE
        ========================================== *!/
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
};*/

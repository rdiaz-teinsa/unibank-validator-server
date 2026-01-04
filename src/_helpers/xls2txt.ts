import ExcelJS from "exceljs";
import * as fs from "fs";
import * as path from "path";
import * as iconv from "iconv-lite";
import { execSync } from "child_process";

function ensureFileExists(filePath: string) {
    if (!fs.existsSync(filePath)) {
        throw new Error(`Archivo no existe o es inválido: ${filePath}`);
    }
}

function convertXlsToXlsxSync(inputPath: string): string {
    const dir = path.dirname(inputPath);
    const base = path.basename(inputPath, path.extname(inputPath));
    const generatedPath = path.join(dir, `${base}.xlsx`);
    console.log("RUTA GENERADA: ", generatedPath);
    execSync(
        `libreoffice --headless --convert-to xlsx "${inputPath}" --outdir "${dir}"`,
        { stdio: "ignore" }
    );
    if (!fs.existsSync(generatedPath)) {
        throw new Error("LibreOffice no generó el archivo XLSX");
    }
    return generatedPath;
}

export const exportExcelToTxt = async (
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
            tempXlsx = convertXlsToXlsxSync(inputPath);
            xlsxPath = tempXlsx;
        } else if (ext !== ".xlsx") {
            throw new Error("Formato no soportado. Solo .xls o .xlsx");
        }

        const workbook = new ExcelJS.Workbook();
        await workbook.xlsx.readFile(xlsxPath); // ✅ CLAVE

        const sheet = workbook.worksheets[0];
        if (!sheet) {
            throw new Error("No se encontró ninguna hoja válida");
        }

        const lines: string[] = [];

        sheet.eachRow({ includeEmpty: true }, row => {
            // @ts-ignore
            const values = row.values.slice(1).map(v =>
                    typeof v === "object" && v && "text" in v
                        ? v.text
                        : String(v ?? "")
                );

            lines.push(values.join(delimiter));
        });

        const bom = Buffer.from([0xff, 0xfe]);
        const buffer = Buffer.concat([
            bom,
            iconv.encode(lines.join("\n"), "utf16-le")
        ]);

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


export const exportExcelToTxtStreaming = async (
    inputPath: string,
    outputPath: string,
    delimiter: string
) => {
    let tempXlsx: string | null = null;

    try {
        const ext = path.extname(inputPath).toLowerCase();
        let xlsxPath = inputPath;

        if (ext === ".xls") {
            tempXlsx = convertXlsToXlsxSync(inputPath);
            xlsxPath = tempXlsx;
        } else if (ext !== ".xlsx") {
            throw new Error("Formato no soportado. Solo .xls o .xlsx");
        }

        /* ==========================================
           WRITE STREAM TXT UTF-16 LE + BOM
        ========================================== */
        const writeStream = fs.createWriteStream(outputPath);
        writeStream.write(Buffer.from([0xff, 0xfe])); // BOM

        const reader = new ExcelJS.stream.xlsx.WorkbookReader(xlsxPath, {
            entries: "emit",
            sharedStrings: "cache",
            styles: "cache",
            worksheets: "emit"
        });

        for await (const worksheet of reader) {
            for await (const row of worksheet) {
                // @ts-ignore
                const values = row.values.slice(1).map(cell =>
                    typeof cell === "object" && cell && "text" in cell
                        ? cell.text
                        : String(cell ?? "")
                );
                const line = values.join(delimiter) + "\n";
                writeStream.write(iconv.encode(line, "utf16-le"));
            }
            break; // Eliminar si se desea procesar todas las hojas y no solo la primera
        }

        writeStream.end();
        return { error: false, message: `Archivo exportado: ${outputPath}` };
    } catch (err: any) {
        return { error: true, message: err.message };
    } finally {
        if (tempXlsx && fs.existsSync(tempXlsx)) {
            fs.unlinkSync(tempXlsx);
        }
    }
};
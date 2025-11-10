import * as fs from "fs/promises";
import * as path from "path";
import * as iconv from "iconv-lite";
import Excel from "exceljs";
import chardet from "chardet";

export const exportExcelToTxt = async (
  inputPath: string,
  outputPath: string,
  delimiter: string,
) => {
  try {
    await fs.access(inputPath);
  } catch (error) {
    return {
      error: true,
      message: `El archivo origen solicitado no existe o está corrupto: ${inputPath}`,
    };
  }

  const ext = path.extname(inputPath).toLowerCase();
  if (ext !== ".xls" && ext !== ".xlsx") {
    return {
      error: true,
      message: `Formato no soportado. Solo se permiten archivos .xls o .xlsx: ${inputPath}`,
    };
  }

  try {
    const workbook = new Excel.Workbook();
    if (ext === ".xls") {
      const fileHandle = await fs.open(inputPath, "r");
      const stream = fileHandle.createReadStream();
      await workbook.csv.read(stream);
      await fileHandle.close();
    } else {
      await workbook.xlsx.readFile(inputPath);
    }

    const worksheet = workbook.worksheets[0];
    if (!worksheet) {
      return {
        error: true,
        message: `No se encontró ninguna hoja en el archivo Excel: ${inputPath}`,
      };
    }

    const lines: string[] = [];
    worksheet.eachRow((row) => {
      const rowData = row.values as Excel.CellValue[];
      lines.push(rowData.join(delimiter));
    });

    const txtContent = lines.join("\r\n");
    const buffer = iconv.encode(txtContent, "utf16-le");
    await fs.writeFile(outputPath, buffer as Uint8Array);

    return {
      error: false,
      message: `Archivo exportado correctamente a: ${outputPath}`,
    };
  } catch (error) {
    const err = error as Error;
    return {
      error: true,
      message: `Error al exportar el archivo: ${err.message}`,
    };
  }
};

export const convertUtf8ToUtf16LE = async (
  inputPath: string,
  outputPath?: string,
) => {
  try {
    const detectedEncodings = await chardet.detectFile(inputPath, {
      sampleSize: 64 * 1024,
    });
    const detectedEncoding = Array.isArray(detectedEncodings)
      ? detectedEncodings[0].name
      : detectedEncodings;
    console.log(`🔍 Codificación detectada: ${detectedEncoding}`);

    if (!detectedEncoding) {
      return {
        error: true,
        message: `No se pudo detectar la codificación del archivo: ${inputPath}`,
      };
    }

    if (detectedEncoding.toUpperCase().includes("UTF-8")) {
      const buffer = await fs.readFile(inputPath);
      const hasUtf8BOM =
        buffer[0] === 0xef && buffer[1] === 0xbb && buffer[2] === 0xbf;
      const content = iconv.decode(
        hasUtf8BOM ? buffer.slice(3) : buffer,
        "utf8",
      );
      const utf16Buffer = Buffer.concat([
        Buffer.from([0xff, 0xfe]) as Uint8Array,
        iconv.encode(content, "utf16le") as Uint8Array,
      ]);
      const targetPath = outputPath || inputPath;
      await fs.writeFile(targetPath, utf16Buffer as Uint8Array);
      return {
        error: false,
        message: `El archivo fue convertido a UTF-16LE con BOM: ${inputPath}`,
      };
    } else {
      return {
        error: false,
        message: `El archivo no está en UTF-8. No se realizó la conversión: ${inputPath}`,
      };
    }
  } catch (error) {
    const err = error as Error;
    return {
      error: true,
      message: `Error procesando el archivo: ${inputPath}, error: ${err.message}`,
    };
  }
};

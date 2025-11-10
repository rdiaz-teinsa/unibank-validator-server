import fs from "fs/promises";
import sql from "mssql";

export const createFolders = async (
  pArchivePath: string,
  pBankPath: string,
  pDatePath: string,
) => {
  try {
    const dir = `${pArchivePath}/${pBankPath}`;
    await fs.mkdir(dir, { recursive: true });

    const subdir = `${pArchivePath}/${pBankPath}/${pDatePath}`;
    await fs.mkdir(subdir, { recursive: true });
  } catch (err) {
    const error = err as Error;
    console.error("CREAR CARPETAS: ", error.message);
    throw error;
  }
};

export const registrarLog = async (
  conn: sql.ConnectionPool,
  usuario: string,
  codBanco: string,
  fechaCorte: string,
  operacion: string,
  pData: any,
) => {
  try {
    const request = conn.request();
    await request
      .input("usuario", sql.NVarChar(50), usuario)
      .input("cod_banco", sql.NVarChar(4), codBanco)
      .input("fecha_corte", sql.NVarChar(10), fechaCorte)
      .input("operacion", sql.NVarChar(50), operacion)
      .input("datos", sql.NVarChar(2500), JSON.stringify(pData))
      .query(
        "EXEC TEINSA_CONFIG.dbo.USP_SEG_REGISTRAR_LOG @usuario, @cod_banco, @fecha_corte, @operacion, @datos",
      );
  } catch (err) {
    const error = err as Error;
    console.error("REGISTRO DE LOGS: ", error.message);
    throw error;
  }
};

export const getTimeStamp = () => {
  return new Date().toISOString().slice(0, 19).replace("T", " ");
};

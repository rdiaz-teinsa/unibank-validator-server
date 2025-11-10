import sql, { ISqlType } from "mssql";
import { dbConfig } from "./global";
import { registrarLog } from "./utils";

interface StoredProcedureParams {
  [key: string]: any;
}

export const executeStoredProcedure = async (
  procedureName: string,
  params: StoredProcedureParams,
  usuario: string,
  codBanco: string,
  fechaSib: string,
) => {
  let pool: sql.ConnectionPool | undefined;
  try {
    pool = await new sql.ConnectionPool(dbConfig).connect();
    const request = pool.request();

    for (const key in params) {
      if (Object.prototype.hasOwnProperty.call(params, key)) {
        const value = params[key];
        let type: (() => ISqlType) | ISqlType | undefined;
        switch (typeof value) {
          case "string":
            type = sql.NVarChar;
            break;
          case "number":
            if (Number.isInteger(value)) {
              type = sql.Int;
            } else {
              type = sql.Float;
            }
            break;
          case "boolean":
            type = sql.Bit;
            break;
          case "object":
            if (value instanceof Date) {
              type = sql.DateTime;
            }
            break;
          default:
            type = sql.NVarChar;
            break;
        }
        if (type) {
          request.input(key, type, value);
        }
      }
    }

    const result = await request.query(`exec ${procedureName}`);
    await registrarLog(
      pool,
      usuario,
      codBanco,
      fechaSib,
      procedureName,
      params,
    );

    if (result.recordset.length > 0) {
      return { error: false, record: result.recordset };
    } else {
      return {
        error: false,
        message: "No existen registros asociados a su consulta.",
        record: [],
      };
    }
  } catch (err) {
    console.error(
      `Se identificaron errores en la ejecución del SP ${procedureName}, Error: `,
      err,
    );
    throw err;
  } finally {
    if (pool) {
      await pool.close();
    }
  }
};

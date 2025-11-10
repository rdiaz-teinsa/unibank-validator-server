import { executeStoredProcedure } from "../helpers/database";

export const autenticarUsuario = async (pData: any) => {
  const { username, password } = pData;
  const params = { username, password };
  return executeStoredProcedure(
    "TEINSA_CONFIG.dbo.XDROP_USERS_READ_DATA",
    params,
    username,
    "000",
    "19000101",
  );
};

import crypto from "crypto";
import { config } from "./config";

const decrypt = (hash: { iv: string; content: string }) => {
  const decipher = crypto.createDecipheriv(
    config.ALGORITHM as crypto.CipherGCMTypes,
    config.SECRET_PASSPHRASE,
    Buffer.from(hash.iv, "hex") as Uint8Array,
  );
  const decrpyted = Buffer.concat([
    decipher.update(
      Buffer.from(hash.content, "hex") as Uint8Array,
    ) as Uint8Array,
    decipher.final() as Uint8Array,
  ]);
  return decrpyted.toString();
};

export const dbConfig = {
  user: config.DBS.SQL_SYS.MSSQL_USER,
  password: decrypt(JSON.parse(config.DBS.SQL_SYS.MSSQL_PASSWORD)),
  server: config.DBS.SQL_SYS.MSSQL_SERVER,
  port: parseInt(config.DBS.SQL_SYS.MSSQL_PORT, 10),
  database: config.DBS.SQL_SYS.MSSQL_DATABASE,
  connectionTimeout: 300000,
  requestTimeout: 300000,
  options: {
    encrypt: config.DBS.SQL_SYS.MSSQL_ENCRYPT,
    enableArithAbort: config.DBS.SQL_SYS.MSSQL_ENABLE_ARITHABORT,
  },
};

export const dbDConfig = {
  user: config.DBS.SQL_DATA.MSSQL_USER,
  password: decrypt(JSON.parse(config.DBS.SQL_DATA.MSSQL_PASSWORD)),
  server: config.DBS.SQL_DATA.MSSQL_SERVER,
  port: parseInt(config.DBS.SQL_DATA.MSSQL_PORT, 10),
  database: config.DBS.SQL_DATA.MSSQL_DATABASE,
  connectionTimeout: 300000,
  requestTimeout: 300000,
  options: {
    encrypt: config.DBS.SQL_DATA.MSSQL_ENCRYPT,
    enableArithAbort: config.DBS.SQL_DATA.MSSQL_ENABLE_ARITHABORT,
  },
};

export const ldapConfig = {
  url: config.LDAP_URL,
  baseDN: config.LDAP_BASE_DN,
  username: config.LDAP_USERNAME,
  password: decrypt(JSON.parse(config.LDAP_PASSWORD)),
  ldapOptions: {},
};

export const azureConfig = {
  tenantId: config.AZURE_TENANT_ID,
  clientId: config.AZURE_CLIENTE_ID,
};

export const authConfig = {
  validatorGroup: config.LDAP_GROUP_O0,
};

export const authModel = config.AUTHORIZATION_MODEL;

export const tokenSecret = config.TOKEN_PASSPHRASE;

export const filePathRoot = config.SYSPATH.TXT_ARCHIVE;

export const logsPathRoot = config.SYSPATH.LOG_ARCHIVE;

export const localSystem = config.NODE_OS;

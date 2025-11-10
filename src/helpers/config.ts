import dotenv from "dotenv";

dotenv.config();

export const config = {
  NODE_ENV: process.env.NODE_ENV || "dev",
  NODE_OS: process.env.NODE_OS || "LIX",
  VERSION: process.env.VERSION || "1.20",
  HTTP_PORT: process.env.HTTP_PORT || "7443",
  ALGORITHM: process.env.ALGORITHM || "aes-256-ctr",
  TOKEN_PASSPHRASE: process.env.TOKEN_PASSPHRASE || "",
  SECRET_PASSPHRASE: process.env.SECRET_PASSPHRASE || "",
  LDAP_URL_NS: process.env.LDAP_URL_NS || "",
  LDAP_URL: process.env.LDAP_URL || "",
  LDAP_BASE_DN: process.env.LDAP_BASE_DN || "",
  LDAP_USERNAME: process.env.LDAP_USERNAME || "",
  LDAP_PASSWORD: process.env.LDAP_PASSWORD || "",
  AZURE_TENANT_ID: process.env.AZURE_TENANT_ID || "",
  AZURE_CLIENTE_ID: process.env.AZURE_CLIENTE_ID || "",
  AUTHORIZATION_MODEL: process.env.AUTHORIZATION_MODEL || "AZURE",
  WHITELIST: {
    HTTP: process.env.WHITELIST_HTTP || "",
    HTTPS: process.env.WHITELIST_HTTPS || "",
  },
  SYSPATH: {
    TXT_ARCHIVE: process.env.TXT_ARCHIVE || "",
    LOG_ARCHIVE: process.env.LOG_ARCHIVE || "",
    WEB_ARCHIVE: process.env.WEB_ARCHIVE || "",
    TST_ARCHIVE: process.env.TST_ARCHIVE || "",
  },
  DBS: {
    SQL_SYS: {
      MSSQL_SERVER: process.env.MSSQL_SERVER || "",
      MSSQL_PORT: process.env.MSSQL_PORT || "",
      MSSQL_DATABASE: process.env.MSSQL_DATABASE_SYS || "",
      MSSQL_USER: process.env.MSSQL_USER_SYS || "",
      MSSQL_PASSWORD: process.env.MSSQL_PASSWORD_SYS || "",
      MSSQL_ENCRYPT: process.env.MSSQL_ENCRYPT_SYS === "true",
      MSSQL_ENABLE_ARITHABORT:
        process.env.MSSQL_ENABLE_ARITHABORT_SYS === "true",
    },
    SQL_DATA: {
      MSSQL_SERVER: process.env.MSSQL_SERVER || "",
      MSSQL_PORT: process.env.MSSQL_PORT || "",
      MSSQL_DATABASE: process.env.MSSQL_DATABASE_DATA || "",
      MSSQL_USER: process.env.MSSQL_USER_DATA || "",
      MSSQL_PASSWORD: process.env.MSSQL_PASSWORD_DATA || "",
      MSSQL_ENCRYPT: process.env.MSSQL_ENCRYPT_DATA === "true",
      MSSQL_ENABLE_ARITHABORT:
        process.env.MSSQL_ENABLE_ARITHABORT_DATA === "true",
    },
  },
  LDAP_GROUP_O0: process.env.LDAP_GROUP_O0 || "",
};

import crypto from 'crypto';
import {globalVars} from './enviroment';
console.log("globalVars: ", globalVars)

const decrypt = (hash : any) => {
     const decipher = crypto.createDecipheriv(globalVars.ALGORITHM, globalVars.SECRET_PASSPHRASE, Buffer.from(hash.iv, 'hex'));
     const decrpyted = Buffer.concat([decipher.update(Buffer.from(hash.content, 'hex')), decipher.final()]);
     return decrpyted.toString();
 };

export const dbConfig = {
    "user": globalVars.DBS.SQL_SYS.MSSQL_USER,
    "password": decrypt(JSON.parse(globalVars.DBS.SQL_SYS.MSSQL_PASSWORD)),
    "server": globalVars.DBS.SQL_SYS.MSSQL_SERVER,
    "port": parseInt(globalVars.DBS.SQL_SYS.MSSQL_PORT),
    "database": globalVars.DBS.SQL_SYS.MSSQL_DATABASE,
    "connectionTimeout": 300000,
    "requestTimeout": 300000,
    "options": {
        "encrypt": (globalVars.DBS.SQL_SYS.MSSQL_ENCRYPT === true) || false,
        "enableArithAbort": (globalVars.DBS.SQL_SYS.MSSQL_ENABLE_ARITHABORT === true) || false
    }
};

export const dbDConfig = {
    "user": globalVars.DBS.SQL_DATA.MSSQL_USER,
    "password": decrypt(JSON.parse(globalVars.DBS.SQL_DATA.MSSQL_PASSWORD)),
    "server": globalVars.DBS.SQL_DATA.MSSQL_SERVER,
    "port": parseInt(globalVars.DBS.SQL_DATA.MSSQL_PORT),
    "database": globalVars.DBS.SQL_DATA.MSSQL_DATABASE,
    "connectionTimeout": 300000,
    "requestTimeout": 300000,
    "options": {
        "encrypt": (globalVars.DBS.SQL_DATA.MSSQL_ENCRYPT === true) || false,
        "enableArithAbort": (globalVars.DBS.SQL_DATA.MSSQL_ENABLE_ARITHABORT === true) || false
    }
};

export const ldapConfig = {
    "url": globalVars.LDAP_URL,
    "baseDN": globalVars.LDAP_BASE_DN,
    "username": globalVars.LDAP_USERNAME,
    "password": decrypt(JSON.parse(globalVars.LDAP_PASSWORD))
};


export const authConfig = {
    "validatorGroup": globalVars.LDAP_GROUP_O0,
};

export const tokenSecret = globalVars.TOKEN_PASSPHRASE;

export const filePathRoot = globalVars.SYSPATH.TXT_ARCHIVE;

export const logsPathRoot = globalVars.SYSPATH.LOG_ARCHIVE;

export const localSystem = globalVars.NODE_OS;

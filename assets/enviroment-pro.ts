let env = 'pro';
let envData: any;
let domain = 'localhost';
let folder = 'unibank-validator-server';

'/var/teinsa/unibank-validator-server/archive/data/236/20250831/AT07.txt'

envData = {
    "pro": {
        NODE_ENV: 'certification',
        NODE_OS: 'LIX',
        VERSION: '1.20',
        HTTP_PORT: '7443',
        ALGORITHM: 'aes-256-ctr',
        TOKEN_PASSPHRASE: process.env.TOKEN_PASSPHRASE,
        SECRET_PASSPHRASE: process.env.SECRET_PASSPHRASE,
        LDAP_URL_NS: 'ldap://teinsa-pa',
        LDAP_URL: 'ldap://0.0.0.0',
        LDAP_BASE_DN: 'DC=teinsa-pa,DC=com',
        LDAP_USERNAME: 'admin@teinsa-pa.com',
        LDAP_PASSWORD: process.env.LDAP_PASS,
        WHITELIST: {
            HTTP: 'http://' + domain + '/',
            HTTPS: 'https://' + domain + '/'
        },
        SYSPATH: {
            TXT_ARCHIVE: '/var/teinsa/' + folder + '/archive/data',
            LOG_ARCHIVE: '/var/teinsa/' + folder + '/archive/tvalogs',
            WEB_ARCHIVE: '/var/teinsa/' + folder + '/archive/tvalogs',
            TST_ARCHIVE: '/var/teinsa/' + folder + '/static/index.html'
        },
        DBS: {
            SQL_SYS: {
                MSSQL_SERVER: 'localhost',
                MSSQL_PORT: '1433',
                MSSQL_DATABASE: 'TEINSA_CONFIG',
                MSSQL_USER: 'sa',
                MSSQL_PASSWORD: process.env.MSSQL_PASS,
                MSSQL_ENCRYPT: true,
                MSSQL_ENABLE_ARITHABORT: true,
            },
            SQL_DATA: {
                MSSQL_SERVER: 'localhost',
                MSSQL_PORT: '1433',
                MSSQL_DATABASE: 'TEINSA_VAL',
                MSSQL_USER: 'sa',
                MSSQL_PASSWORD: process.env.MSSQL_PASS,
                MSSQL_ENCRYPT: true,
                MSSQL_ENABLE_ARITHABORT: true,
            }
        },
        LDAP_GROUP_O0: 'TEINSA_VALIDATOR_ADMIN_PRO'
    }
}

export const globalVars = envData[env];




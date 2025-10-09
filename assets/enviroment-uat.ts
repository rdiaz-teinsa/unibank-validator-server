let env = 'uat';
let envData: any;
let domain = 'unibank.tval.online';
let folder = 'unibank-validator-server';
if(env==='dev') {
    domain = 'localhost';
}

envData = {
    "dev": {
        NODE_ENV: 'dev',
        NODE_OS: 'LIX',
        VERSION: '1.20',
        HTTP_PORT: '7443',
        ALGORITHM: 'aes-256-ctr',
        TOKEN_PASSPHRASE: '4onZYjWeJthAaNcSdCUTsPfg',
        SECRET_PASSPHRASE: 'vOVH6sdmpNWjRRIqCc7rdxs01lwHzfr3',
        LDAP_URL_NS: 'ldap://teinsa-pa',
        LDAP_URL: 'ldap://0.0.0.0',
        LDAP_BASE_DN: 'DC=teinsa-pa,DC=com',
        LDAP_USERNAME: 'admin@teinsa-pa.com',
        LDAP_PASSWORD: '{"iv":"b22dc34c32a3a80d73ae978c0532f982","content":"a47edc0172dea80dc1"}',
        WHITELIST: {
            HTTP: 'http://' + domain + '/',
            HTTPS: 'https://' + domain + '/'
        },
        SYSPATH: {
            TXT_ARCHIVE: '/Users/arielherrera/WebstormProjects/' + folder + '/data/',
            LOG_ARCHIVE: '/Users/jherrera/WebstormProjects/' + folder + '/logs/',
            WEB_ARCHIVE: '/Users/jherrera/WebstormProjects/' + folder + '/archive',
            TST_ARCHIVE: '/Users/jherrera/WebstormProjects/' + folder + '/static/index.html'
        },
        DBS: {
            SQL_SYS: {
                MSSQL_SERVER: '134.199.202.170',
                MSSQL_PORT: '1433',
                MSSQL_DATABASE: 'TEINSA_CONFIG',
                MSSQL_USER: 'sa',
                MSSQL_PASSWORD: '{"iv":"3b5df530ada5213dddc55cfe700ac6a3","content":"cf623a88376d8a3309ac66bca589305a9ed8d30c051e"}',
                MSSQL_ENCRYPT: true,
                MSSQL_ENABLE_ARITHABORT: true,
            },
            SQL_DATA: {
                MSSQL_SERVER: '134.199.202.170',
                MSSQL_PORT: '1433',
                MSSQL_DATABASE: 'TEINSA_VAL',
                MSSQL_USER: 'sa',
                MSSQL_PASSWORD: '{"iv":"3b5df530ada5213dddc55cfe700ac6a3","content":"cf623a88376d8a3309ac66bca589305a9ed8d30c051e"}',
                MSSQL_ENCRYPT: true,
                MSSQL_ENABLE_ARITHABORT: true,
            }
        },
        LDAP_GROUP_O0: 'TEINSA_VALIDADOR_UAT'
    },
    "uat": {
        NODE_ENV: 'certification',
        NODE_OS: 'LIX',
        VERSION: '1.20',
        HTTP_PORT: '7443',
        ALGORITHM: 'aes-256-ctr',
        TOKEN_PASSPHRASE: '4onZYjWeJthAaNcSdCUTsPfg',
        SECRET_PASSPHRASE: 'vOVH6sdmpNWjRRIqCc7rdxs01lwHzfr3',
        LDAP_URL_NS: 'ldap://teinsa-pa',
        LDAP_URL: 'ldap://0.0.0.0',
        LDAP_BASE_DN: 'DC=teinsa-pa,DC=com',
        LDAP_USERNAME: 'admin@teinsa-pa.com',
        LDAP_PASSWORD: '{"iv":"b22dc34c32a3a80d73ae978c0532f982","content":"a47edc0172dea80dc1"}',
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
                MSSQL_PASSWORD: '{"iv":"3b5df530ada5213dddc55cfe700ac6a3","content":"cf623a88376d8a3309ac66bca589305a9ed8d30c051e"}',
                MSSQL_ENCRYPT: true,
                MSSQL_ENABLE_ARITHABORT: true,
            },
            SQL_DATA: {
                MSSQL_SERVER: 'localhost',
                MSSQL_PORT: '1433',
                MSSQL_DATABASE: 'TEINSA_VAL',
                MSSQL_USER: 'sa',
                MSSQL_PASSWORD: '{"iv":"3b5df530ada5213dddc55cfe700ac6a3","content":"cf623a88376d8a3309ac66bca589305a9ed8d30c051e"}',
                MSSQL_ENCRYPT: true,
                MSSQL_ENABLE_ARITHABORT: true,
            }
        },
        LDAP_GROUP_O0: 'TEINSA_VALIDADOR_UAT'
    },
    "pro": {
        NODE_ENV: 'certification',
        NODE_OS: 'LIX',
        VERSION: '1.20',
        HTTP_PORT: '7443',
        ALGORITHM: 'aes-256-ctr',
        TOKEN_PASSPHRASE: '4onZYjWeJthAaNcSdCUTsPfg',
        SECRET_PASSPHRASE: 'vOVH6sdmpNWjRRIqCc7rdxs01lwHzfr3',
        LDAP_URL_NS: 'ldap://teinsa-pa',
        LDAP_URL: 'ldap://0.0.0.0',
        LDAP_BASE_DN: 'DC=teinsa-pa,DC=com',
        LDAP_USERNAME: 'admin@teinsa-pa.com',
        LDAP_PASSWORD: '{"iv":"b22dc34c32a3a80d73ae978c0532f982","content":"a47edc0172dea80dc1"}',
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
                MSSQL_PASSWORD: '{"iv":"3b5df530ada5213dddc55cfe700ac6a3","content":"cf623a88376d8a3309ac66bca589305a9ed8d30c051e"}',
                MSSQL_ENCRYPT: true,
                MSSQL_ENABLE_ARITHABORT: true,
            },
            SQL_DATA: {
                MSSQL_SERVER: 'localhost',
                MSSQL_PORT: '1433',
                MSSQL_DATABASE: 'TEINSA_VAL',
                MSSQL_USER: 'sa',
                MSSQL_PASSWORD: '{"iv":"3b5df530ada5213dddc55cfe700ac6a3","content":"cf623a88376d8a3309ac66bca589305a9ed8d30c051e"}',
                MSSQL_ENCRYPT: true,
                MSSQL_ENABLE_ARITHABORT: true,
            }
        },
        LDAP_GROUP_O0: 'TEINSA_VALIDATOR_ADMIN_PRO'
    },
    "win": {
        NODE_ENV: 'production',
        NODE_OS: 'WIN',
        VERSION: '0.90',
        HTTP_PORT: '7443',
        ALGORITHM: 'aes-256-ctr',
        TOKEN_PASSPHRASE: '4onZYjWeJthAaNcSdCUTsPfg',
        SECRET_PASSPHRASE: 'vOVH6sdmpNWjRRIqCc7rdxs01lwHzfr3',
        LDAP_URL_NS: 'ldap://10.1.1.207',
        LDAP_URL: 'ldap://10.1.1.190',
        LDAP_BASE_DN: 'DC=metrobank,DC=local',
        LDAP_USERNAME: 'mtbadteinsa@metrobank.local',
        LDAP_PASSWORD: '{"iv":"7e849ddb2db9d2fc05232a3db5659697","content":"b365c51be70b8a306ddf77370fe56aa7db249dc6"}',
        WHITELIST: {
            HTTP: 'http://' + domain + '/',
            HTTPS: 'https://' + domain + '/'
        },
        SYSPATH: {
            TXT_ARCHIVE: 'C:\\teinsa\\' + folder + '\\data',
            LOG_ARCHIVE: 'C:\\teinsa\\' + folder + '\\logs',
            WEB_ARCHIVE: 'C:\\teinsa\\' + folder + '\\logs',
            TST_ARCHIVE: 'C:\\inetpub\\' + folder + '\\static\\index.html'
        },
        DBS: {
            SQL_SYS: {
                MSSQL_SERVER: 'localhost',
                MSSQL_PORT: '1433',
                MSSQL_DATABASE: 'TEINSA_CONFIG',
                MSSQL_USER: 'teinsa_usr',
                MSSQL_PASSWORD: '{"iv":"c64c910753385aee22c44aae816759fc","content":"4dcbbcf879483c802c79"}',
                MSSQL_ENCRYPT: true,
                MSSQL_ENABLE_ARITHABORT: true,
            },
            SQL_DATA: {
                MSSQL_SERVER: 'localhost',
                MSSQL_PORT: '1433',
                MSSQL_DATABASE: 'TEINSA_VAL',
                MSSQL_USER: 'teinsa_usr',
                MSSQL_PASSWORD: '{"iv":"c64c910753385aee22c44aae816759fc","content":"4dcbbcf879483c802c79"}',
                MSSQL_ENCRYPT: true,
                MSSQL_ENABLE_ARITHABORT: true,
            }
        },
        LDAP_GROUP_O0: 'TEINSA_VALIDATOR_ADMIN_PRO'
    }
}

export const globalVars = envData[env];




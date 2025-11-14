let env = 'dev';
let envData: any;
let domain = 'unibank.tval.online';
let folder = 'unibank-validator-server';
if(env==='local') {
    domain = 'localhost';
}

envData = {
    "local": {
        NODE_ENV: 'Local',
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
        AZURE_TENANT_ID: 'cf2a7612-3a84-4aac-a4cf-b029e6178dbe',
        AZURE_CLIENTE_ID: '8c72f1e3-25f2-4335-bf89-16afbbf24f9e',
        AUTHORIZATION_MODEL: 'AZURE',
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
    "dev": {
        NODE_ENV: 'Development',
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
        AZURE_TENANT_ID: 'b9ae648a-1d14-45bd-a2b0-0e196e8a6678',
        AZURE_CLIENTE_ID: '91fcb762-c31f-48ef-a095-c7b17651c8ae',
        AUTHORIZATION_MODEL: 'AZURE',
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
    "uat": {
        NODE_ENV: 'Certification',
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
        AZURE_TENANT_ID: 'b9ae648a-1d14-45bd-a2b0-0e196e8a6678',
        AZURE_CLIENTE_ID: '91fcb762-c31f-48ef-a095-c7b17651c8ae',
        AUTHORIZATION_MODEL: 'AZURE',
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
        NODE_ENV: 'Production',
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
        AZURE_TENANT_ID: 'cf2a7612-3a84-4aac-a4cf-b029e6178dbe',
        AZURE_CLIENTE_ID: '8c72f1e3-25f2-4335-bf89-16afbbf24f9e',
        AUTHORIZATION_MODEL: 'LDAP',
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
    }
}

export const globalVars = envData[env];




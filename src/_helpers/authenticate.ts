const ActiveDirectory = require('activedirectory2').promiseWrapper;
import {ldapConfig, authConfig} from './global';
import {addEvent} from './logger';

export const autenticarUsuarioAD = async (pData: any) => {
    const module = pData.module;
    const ad = new ActiveDirectory(ldapConfig);
    // let fullUsername = pData.username.toLowerCase();
    let inUsername = pData.username + '@metrobank.local';
    let fullUsername = inUsername.toLowerCase();
    let splitUsername = fullUsername.split("@");
    let shortUsername = splitUsername[0];
    let amaUsername = fullUsername;
    let password = pData.password;
    let role = pData.role;
    try {

        let authenticated = await ad.authenticate(fullUsername, password).then((auth: Boolean) => {
            console.log("Autenticado")
            addEvent.log('info', 'MODULE ' + module + ' EVENT: La autenticación del Usuario : ' + fullUsername + ' culmino con resultado ' + auth);
            return auth;
        }).catch((err: any) => {
            addEvent.log('error', 'MODULE ' + module + ' EVENT: Se identifico un error en la autenticación del usuario: ' + fullUsername + ', detalle del errro: ' + err);
            throw "Error de autenticación del usuario: " + fullUsername + " con error: " + err;
        });

        if (authenticated) {
            let roles = await ad.getGroupMembershipForUser(shortUsername).then((groups: any) => {
                console.log("Grupos: ", groups);
                return groups;
            }).catch((err: any) => {
                addEvent.log('error', 'MODULE ' + module + ' EVENT: Se identifico un error al consultar los grupos asociados al usuario: ' + fullUsername + ', detalle del errro: ' + err);
                throw "El usuario no pertenece a los grupos autorizados.";
            });

            if (roles) {
                if (roles.length > 0) {
                    if (roles.some((item: any) => item.cn.toUpperCase() === authConfig.validatorGroup)) {
                        role = 'analyst'
                    } else if (roles.some((item: any) => item.cn.toUpperCase() != authConfig.validatorGroup)) {
                        role = 'guest'
                    }
                    addEvent.log('info', 'MODULE ' + module + ' EVENT: El usuario: ' + fullUsername + ', se autorizo con perfil de: ' + role);
                } else {
                    addEvent.log('info', 'MODULE ' + module + ' EVENT: El usuario: ' + fullUsername + ', no cuenta con autorización para acceder al sistema. Grupos: ' + roles);
                    throw 'El usuario no tiene grupos asociados.';
                }
            }

            let usr : any;
            usr = null;
            if (role !== 'guest') {
                usr = await ad.findUser(shortUsername).then((user: any) => {
                    let result = user;
                    addEvent.log('info', 'MODULE ' + module + ' EVENT: Se completo la consulta de datos del usaurio: ' + shortUsername + ', con respuesta del LDAP: ' + user);
                    return result;
                }).catch((err: any) => {
                    addEvent.log('error', 'MODULE ' + module + ' EVENT: Se identifico un error al consultar los datos del usuario: ' + shortUsername + ', LDAP error: ' + err);
                    throw "Error al consultar los datos del usuario. LDAP error: " + err;
                });

                let signedUser = {
                    userId: usr.userAccountControl,
                    fullName: usr.givenName + ' ' + usr.sn,
                    username: amaUsername.replace('@metrobank.local', ''),
                    email: amaUsername.replace('@metrobank.local', '@metrobank.com'),
                    role: role,
                    authenticated: authenticated,
                    idCentro: parseInt(usr.department) || 0,
                    createdDate: new Date()
                };

                addEvent.log('info', 'MODULE ' + module + ' EVENT: Culmino la autenticación y autorización usuario: ' + shortUsername + ', respuesta del servicio: ' + signedUser);
                return signedUser
            }
            else {
                addEvent.log('info', 'MODULE ' + module + ' EVENT: El perfil del usuario: ' + shortUsername + ', no cuenta con acceso al sistema.');
                throw 'El usuario no cuenta con acceso al sistema.';
            }
        }
        else {
            addEvent.log('info', 'MODULE ' + module + ' EVENT: El usuario: ' + shortUsername + ', no pudo ser autenticado.');
            throw 'El usuario no cuenta con acceso al sistema.';
        }
    }
    catch (err) {
        addEvent.log('error', 'MODULE ' + module + ' EVENT: Se identificaron errores en el proceso de autenticación y autorización del usaurio: ' + shortUsername + ', error: ' + err);
        throw err;
    }
};
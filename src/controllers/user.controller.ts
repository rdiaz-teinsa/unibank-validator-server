import {Request, Response} from 'express';
import jwt from 'jsonwebtoken';
// import bcrypt from 'bcrypt';
import {authConfig, tokenSecret} from '../_helpers/global';
import {autenticarUsuario} from '../database/user.service';
import {autenticarUsuarioAD} from '../_helpers/authenticate';

const getToken = (userId: string, userRole: string): string => {
    return jwt.sign({uid: userId, role: userRole}, tokenSecret, {expiresIn: '2h'});
}

const getTokenAD = (userId: string, userRole: string): string => {
    return jwt.sign({uid: userId, role: userRole}, tokenSecret, {expiresIn: '2h'});
}

const users = [
    {name: "Chiara Rodriguez", user: "chiara.rodriguez@unibank.com.pa", password: "9>0xj:%M"},
    {name: "Fernando Delgado", user: "fernando.delgado@unibank.com.pa", password: "W#r3u91v"},
    {name: "Frank Sánchez", user: "frank.sanchez@unibank.com.pa", password: "Xs!06g!S"},
    {name: "Melquiades Villarreal", user: "melquiades.villarreal@unibank.com.pa", password: "km4,AD$^"},
    {name: "Gisel Valdes", user: "gisel.valdes@unibank.com.pa", password: "_PI4z[VS"},
    {name: "Lucy Concepción", user: "lucy.concepcion@unibank.com.pa", password: "bVqIV9{v"},
    {name: "Juan Ortega", user: "juan.ortega@unibank.com.pa", password: "Z>80z%=T"},
    {name: "Alfonso Lau", user: "alfonso.lau@unibank.com.pa", password: "_0cqWS%?"},
    {name: "Angela Adames", user: "angela.adames@unibank.com.pa", password: "5vwCjdm("},
    {name: "Alberto De Grasse", user: "alberto.degrasse@unibank.com.pa", password: ",hvomX68"},
    {name: "Diana Ríos", user: "diana.rios@unibank.com.pa", password: "N|Lx?9%y"},
    {name: "Moises Plicet", user: "moises.plicet@unibank.com.pa", password: "s.yT35iD"},
    {name: "Vanesa Sánchez", user: "vanesa.sanchez@unibank.com.pa", password: ";UAcT9nA"},
    {name: "Carla Dutary", user: "carla.dutary@unibank.com.pa", password: "NJsmw=4&"},
    {name: "Gabriela Barrios", user: "gabriela.barrios@unibank.com.pa", password: "me;FY!8O"},
    {name: "Raul Hidalgo", user: "raul.hidalgo@unibank.com.pa", password: "Tein$a2025"},
    {name: "Alvin Vega", user: "alvin.vega@unibank.com.pa", password: "9>0xj:%M"},
    {name: "Johana Jaen", user: "johana.jaen@unibank.com.pa", password: "W#r3u91v"},
    {name: "Edgardo Carrera", user: "edgardo.carrera@unibank.com.pa", password: "Xs!06g!S"},
    {name: "Georgina Freeman", user: "georgina.freeman@unibank.com.pa", password: "km4,AD$^"},
    {name: "Domingo Assady", user: "domingo.assady@unibank.com.pa", password: "_PI4z[VS"},
    {name: "Vidiel Torres", user: "vidiel.torres@unibank.com.pa", password: "bVqIV9{v"},
    {name: "Luis Almestica", user: "luis.almestica@unibank.com.pa", password: "Z>80z%=T"},
    {name: "Karina Dominguez", user: "karina.dominguez@unibank.com.pa", password: "s.yT35iD"}
];

function validarUsuario(user: string, password: string) {
    if (!user || !password) {
        return {name: "Anonimo", user: "anonimo", role: "Guest"};
    } else {
        let signed: any = {name: "Anonimo", user: "anonimo", role: "Guest"};
        signed = users.find(u =>
            u.user.toLowerCase() === user.toLowerCase() && u.password === password
        );

        if (signed) {
            return {
                name: signed.name,
                user: signed.user.replace("@unibank.com.pa", ""),
                role: authConfig.validatorGroup
            };
        } else {
            return {name: "Anonimo", user: "anonimo@unibank.com.pa", role: "Guest"};
        }

    }


}

export const signing = async (req: Request, res: Response) => {
    try {
        let iData: any;

        iData = {
            // @ts-ignore
            username: req.body.username,
            // @ts-ignore
            password: req.body.password
        }
        // @ts-ignore
        let user: any;
        user = await autenticarUsuario(iData);
        console.log("User: ", user)
        // @ts-ignore
        if (user.error === true) return res.status(400).json({
            error: true,
            message: 'El usuario ingresado no existe en el sistema.'
        });
        // @ts-ignore
        const authenticated = true;
        // @ts-ignore
        if (!authenticated) return res.status(401).json({
            error: true,
            message: 'Las credenciales proporcionadas so invalidas, verifique los datos e intentelo nuevamente.'
        })
        const token = getToken(user.record._id, user.record.role);
        // const {_id, hash, __v,  ...userProfile} = user.record;
        // userProfile.error = false;
        // userProfile.token = 'Bearer ' + token;
        // userProfile.fullName = userProfile.firstName + ' ' + userProfile.lastName;
        const userProfile: any = {
            id: user.record._id,
            fullName: `${user.record.firstName} ${user.record.lastName}`,
            firstName: user.record.firstName,
            lastName: user.record.lastName,
            // @ts-ignore
            username: req.body.username,
            // password: 'admin',
            // eslint-disable-next-line global-require
            avatar: '/assets/images/avatars/13-small.png',
            // @ts-ignore
            email: req.body.username,
            role: user.record.role,
            ability: [
                {
                    action: 'manage',
                    subject: 'all',
                },
            ],
            extras: {
                eCommerceCartItemsCount: 5,
            },
        }
        const response: any = {
            error: false,
            tokenType: 'Bearer',
            accessToken: token, // Sin bearer, el front se encargara de eso
            refreshToken: token,
            userData: userProfile
        }
        // @ts-ignore
        // res.status(200).json(userProfile);
        res.status(200).json(response);
    } catch (err) {
        // @ts-ignore
        return res.status(500).json({error: true, message: err});
    }
}

export const login = async (req: Request, res: Response) => {
    try {
        let iData: any;
        iData = {
            // @ts-ignore
            username: req.body.username,
            // @ts-ignore
            password: req.body.password,
            role: "guest",
            module: 'Autenticación'
        }

        let user: any;
        user = await autenticarUsuarioAD(iData);
        // @ts-ignore
        if (user.error === true) return res.status(400).json({
            error: true,
            message: 'El usuario ingresado no existe en el sistema.'
        });
        // @ts-ignore
        if (!user.authenticated) return res.status(401).json({
            error: true,
            message: 'Las credenciales proporcionadas so invalidas, verifique los datos e intentelo nuevamente.'
        })
        const token = getTokenAD(user.userId, user.role);

        let userProfile: any = {
            error: false,
            tokenType: "Bearer",
            accessToken: token,
            refreshToken: token,
            userData: {
                id: user.userId, // "292F55E9-6BA3-4925-B8C0-5F65CD71F5DA",
                fullName: user.fullName,
                firstName: user.firstName,
                lastName: user.lastName,
                username: user.username,
                avatar: "/assets/images/avatars/13-small.png",
                email: user.email,
                role: "administrador",
                ability: [
                    {
                        action: "manage",
                        subject: "all"
                    }
                ],
                extras: {
                    eCommerceCartItemsCount: 0
                }
            }
        }

        // @ts-ignore
        res.status(200).json(userProfile);
    } catch (err) {
        console.error(err);
        // @ts-ignore
        return res.status(500).json({error: true, message: err});
    }
}

export const logindemo = async (req: Request, res: Response) => {
    try {
        let user = req.body.username;
        let userPass = req.body.password;
        console.log('User: ' + user + ' Password: ' + userPass);
        let userResponse: any = {
            "error": true,
            "tokenType": "Bearer",
            "accessToken": null,
            "refreshToken": null,
            "userData": {
                "userId": "292F55E9-6BA3-4925-B8C0-5F65CD71F5DA",
                "fullName": "Anonymous",
                "username": user,
                "photo": null,
                "email": " ",
                "role": "guest",
                "authenticated": false,
                "idCentro": 121,
                "createdDate": "2023-10-29T22:07:57.777Z",
                "error": false,
                "token": "Bearer ",
                "access": [],
                "ability": [
                    {
                        "action": 'manage',
                        "subject": 'all',
                    },
                ],
                "extras": {
                    "eCommerceCartItemsCount": 5
                }
            }
        };
        let signedUser: any = validarUsuario(user, userPass);

        userResponse = {
            "error": false,
            "tokenType": "Bearer",
            "accessToken": getToken(signedUser.user, authConfig.validatorGroup),
            "refreshToken": getToken(signedUser.user, authConfig.validatorGroup),
            "userData": {
                "userId": "292F55E9-6BA3-4925-B8C0-5F65CD71F5DA",
                "fullName": "Administrador del Sistema",
                "username": signedUser.user,
                "photo": "data:image/jpeg;base64,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",
                "email": user,
                "role": signedUser.role,
                "authenticated": true,
                "idCentro": 121,
                "createdDate": "2025-09-17T22:07:57.777Z",
                "error": false,
                "access": [],
                "ability": [
                    {
                        "action": 'manage',
                        "subject": 'all',
                    },
                ],
                "extras": {
                    "eCommerceCartItemsCount": 5
                }
            }
        }

        res.status(200).json(userResponse);

    } catch (e) {
        throw e;
    }

}


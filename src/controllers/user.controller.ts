import express, { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import {tokenSecret} from '../_helpers/global';
import {autenticarUsuario} from '../database/user.service';
import {autenticarUsuarioAD} from '../_helpers/authenticate';


const getToken = (userId: string, userRole: string): string => {
    return jwt.sign({ uid: userId, role: userRole }, tokenSecret, { expiresIn: '2h' });
}

const encryptPassword = async function (password: string): Promise<string> {
    return await bcrypt.hash(password, 10);
}

const authenticateUser = async function (password: string, passwordx: string): Promise<boolean> {
    return await bcrypt.compare(password, passwordx);
}

export const signin = async (req: Request, res: Response) => {
    try {
        let iData : any;

        iData = {
            // @ts-ignore
            username: req.body.username,
            // @ts-ignore
            password: req.body.password
            // password: await encryptPassword(req.body.password)
        }
        // @ts-ignore
        let user : any;
        user = await autenticarUsuario(iData);
        console.log("User: ", user)
        // @ts-ignore
        if (user.error === true) return res.status(400).json({ error: true, message: 'El usuario ingresado no existe en el sistema.' });
        // @ts-ignore
        // const authenticated = await authenticateUser(req.body.password, user.record.password);
        const authenticated = true;
        // @ts-ignore
        if (!authenticated) return res.status(401).json({ error: true, message: 'Las credenciales proporcionadas so invalidas, verifique los datos e intentelo nuevamente.' })
        // const token = getToken(user.record.userId, user.record.role);
        const token = getToken(user.record._id, user.record.role);
        // const {_id, hash, __v,  ...userProfile} = user.record;
        // userProfile.error = false;
        // userProfile.token = 'Bearer ' + token;
        // userProfile.fullName = userProfile.firstName + ' ' + userProfile.lastName;
        const userProfile : any  = {
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
            role:user.record.role,
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
          const response : any = {
            error: false,
            tokenType: 'Bearer',
            accessToken:  token, // Sin bearer, el front se encargara de eso
            refreshToken:  token,
            userData: userProfile
          }
        // @ts-ignore
        // res.status(200).json(userProfile);
        res.status(200).json(response);
    } catch (err) {
        // @ts-ignore
        return res.status(500).json({error: true, message:  err});
    }
}




const getTokenAD = (userId: string, userRole: string): string => {
    return jwt.sign({ uid: userId, role: userRole }, tokenSecret, { expiresIn: '2h' });
}

export const login= async (req: Request, res: Response) => {
    try {
        let iData : any;
        iData = {
            // @ts-ignore
            username: req.body.username,
            // @ts-ignore
            password: req.body.password,
            role: "guest",
            module: 'Autenticación'
        }

        let user : any;
        user = await autenticarUsuarioAD(iData);
        // @ts-ignore
        if (user.error === true) return res.status(400).json({ error: true, message: 'El usuario ingresado no existe en el sistema.' });
        // @ts-ignore
        if (!user.authenticated) return res.status(401).json({ error: true, message: 'Las credenciales proporcionadas so invalidas, verifique los datos e intentelo nuevamente.' })
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
        return res.status(500).json({error: true, message:  err});
    }
}


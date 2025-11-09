import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import {tokenSecret} from './global';

interface IAuthorized {
    uid: string;
    role: string;
    iat: number;
    exp: number;
}

export const ldapAuthMiddleware = (req: Request, res: Response, next: NextFunction) => {
    try {
        // @ts-ignore
        const bearerToken = req.header('Authorization') || null;
        let token = null
        if(bearerToken != null) {
            token = bearerToken.replace("Bearer ", "")
        }
        if (token == null || token == "") { // @ts-ignore
            return res.status(401).json({ error: 'Authorization Header is empty or null.' });
        }
        if (!token) { // @ts-ignore
            return res.status(401).json({ error: 'Authorization Header does not exist.' });
        }
        const authorized = jwt.verify(token, tokenSecret) as IAuthorized;
        if (Date.now() > authorized.exp * 1000) { // @ts-ignore
            return res.status(401).json({ error: 'Authorization Token already expired.' });
        }
        // @ts-ignore
        req.userId = authorized.uid;
        // @ts-ignore
        req.userRole = authorized.role;
        console.log('LOG: ', authorized);
        next();
    } catch (err) {
        console.log(err);
        // @ts-ignore
        res.status(401).send({ error: 'Error validating JSON Web Token.' });
    }
}

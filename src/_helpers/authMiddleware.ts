import jwt from "jsonwebtoken";
import jwksClient from "jwks-rsa";
import {azureConfig} from './global';

const client = jwksClient({
    jwksUri: "https://login.microsoftonline.com/"+azureConfig.tenantId+"/discovery/v2.0/keys",
});

function getKey(header: any, callback: any) {
    client.getSigningKey(header.kid, (err, key) => {
        // @ts-ignore
        const signingKey = key.getPublicKey();
        callback(null, signingKey);
    });
}

export function azureAuthMiddleware(req: any, res: any, next: any) {
    const token = req.headers.authorization?.split(" ")[1];
    console.log("TOKEN: ", token);
    if (!token) return res.status(401).send({error: true, message: "El Token requerido para completar la autorizacón."});

    jwt.verify(
        token,
        getKey,
        {
            audience: "api://"+azureConfig.clientId,
            issuer: "https://login.microsoftonline.com/"+azureConfig.tenantId+"/v2.0",
            algorithms: ["RS256"],
        },
        (err, decoded) => {
            if (err) return res.status(403).send({error: true, message: "El Token proporcionado es invalido."});
            req.user = decoded;
            next();
        }
    );
}
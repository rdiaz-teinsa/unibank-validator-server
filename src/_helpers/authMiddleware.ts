import {Request, Response, NextFunction} from 'express'
import jwt, {JwtHeader} from 'jsonwebtoken'
import jwksClient from 'jwks-rsa'
import {azureConfig} from './global';

const expectedIssuers = [
    "https://login.microsoftonline.com/" + azureConfig.tenantId + "/v2.0",
    "https://login.microsoftonline.com/" + azureConfig.tenantId + "/",
    "https://sts.windows.net/" + azureConfig.tenantId + "/",
]

const client = jwksClient({
    jwksUri: "https://login.microsoftonline.com/${tenantId}/discovery/v2.0/keys",
    cache: true,
    rateLimit: true,
})

function getKey(header: JwtHeader, callback: (err: Error | null, key?: string) => void) {
    try {
        const kid = header && header.kid ? header.kid : undefined
        if (!kid) return callback(new Error('Missing kid in token header'))
        client.getSigningKey(kid, (err, key) => {
            if (err) return callback(err)
            // @ts-ignore
            const signingKey: string = (key && (key.getPublicKey ? key.getPublicKey() : key.publicKey)) as string
            callback(null, signingKey)
        })
    } catch (e) {
        callback(e as Error)
    }
}

export function azureAuthMiddleware(req: Request, res: Response, next: NextFunction) {
    const raw = (req.headers.authorization as string) || ''
    const token = raw.startsWith('Bearer ') ? raw.slice(7) : raw
    if (!token) return res.status(401).send({error: true, message: 'Es reuerido in Token para efectuar la autorización.'})

    try {
        jwt.decode(token, {complete: true})
    } catch {
        // ignore decode errors on peek
    }

    jwt.verify(
        token,
        getKey,
        {
            audience: 'api://' + azureConfig.clientId,
            issuer: expectedIssuers,
            algorithms: ['RS256'],
        },
        (err, decoded) => {
            if (err) {
                return res.status(403).send({error: true, message: 'El Token proporcionado es invalido.'})
            }
            const payload = decoded as any
            if (payload.tid !== azureConfig.tenantId) {
                return res.status(403).send({error: true, message: 'El Tenant ID utilizado es inválido.'})
            }
            if (!payload.scp || typeof payload.scp !== 'string' || !payload.scp.includes('user_impersonation')) {
                return res.status(403).send({error: true, message: 'Alcance insuficiente.'})
            }
            ;(req as any).user = payload
            next()
        }
    )
}
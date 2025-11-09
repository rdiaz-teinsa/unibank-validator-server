import { Request, Response, NextFunction } from 'express'
import jwt, { JwtHeader } from 'jsonwebtoken'
import jwksClient from 'jwks-rsa'
import {azureConfig} from "../_helpers/global";

const tenantId = azureConfig.tenantId;
const clientId= azureConfig.clientId;

const expectedIssuers = [
    `https://login.microsoftonline.com/${tenantId}/v2.0`,
    `https://login.microsoftonline.com/${tenantId}/`,
    `https://sts.windows.net/${tenantId}/`,
]

const client = jwksClient({
    jwksUri: `https://login.microsoftonline.com/${tenantId}/discovery/v2.0/keys`,
    cache: true,
    rateLimit: true,
})

function getKey(header: JwtHeader, callback: (err: Error | null, key?: string) => void) {
    try {
        const kid = header && header.kid ? header.kid : undefined
        if (!kid) return callback(new Error('Missing kid in token header'))
        client.getSigningKey(kid, (err, key) => {
            if (err) return callback(err)
            // In jwks-rsa v3, getPublicKey() is available; fallback to publicKey if needed
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
    if (!token) return res.status(401).send({ error: true, message: 'Falta token' })

    try {
        jwt.decode(token, { complete: true })
    } catch {
        // ignore decode errors on peek
    }

    jwt.verify(
        token,
        getKey,
        {
            audience: 'api://'+clientId,
            issuer: expectedIssuers,
            algorithms: ['RS256'],
        },
        (err, decoded) => {
            if (err) {
                return res.status(403).send({ error: true, message: 'El Token proporcionado es invalido.' })
            }
            const payload = decoded as any
            if (payload.tid !== tenantId) {
                return res.status(403).send({ error: true, message: 'Tenant inválido.' })
            }
            if (!payload.scp || typeof payload.scp !== 'string' || !payload.scp.includes('user_impersonation')) {
                return res.status(403).send({ error: true, message: 'Alcance insuficiente.' })
            }
            ;(req as any).user = payload
            next()
        }
    )
}

import jwt from "jsonwebtoken";
import jwksClient from "jwks-rsa";

const client = jwksClient({
    jwksUri: "https://login.microsoftonline.com/cf2a7612-3a84-4aac-a4cf-b029e6178dbe/discovery/v2.0/keys",
});

function getKey(header: any, callback: any) {
    client.getSigningKey(header.kid, (err, key) => {
        // @ts-ignore
        const signingKey = key.getPublicKey();
        callback(null, signingKey);
    });
}

export function authorizeAccess(req: any, res: any, next: any) {
    const token = req.headers.authorization?.split(" ")[1];
    console.log("TOKEN: ", token);
    if (!token) return res.status(401).send("Token requerido");

    jwt.verify(
        token,
        getKey,
        {
            audience: "api://8c72f1e3-25f2-4335-bf89-16afbbf24f9e",
            issuer: `https://login.microsoftonline.com/cf2a7612-3a84-4aac-a4cf-b029e6178dbe/v2.0`,
            algorithms: ["RS256"],
        },
        (err, decoded) => {
            if (err) return res.status(403).send("Token inválido");
            req.user = decoded;
            next();
        }
    );
}

import { Request, Response, NextFunction } from "express";
import jwt, {
  GetPublicKeyOrSecret,
  Jwt,
  JwtPayload,
  VerifyErrors,
} from "jsonwebtoken";
import jwksClient from "jwks-rsa";
import { azureConfig } from "./global";

const { tenantId, clientId } = azureConfig;

const expectedIssuers: [string, ...string[]] = [
  `https://login.microsoftonline.com/${tenantId}/v2.0`,
  `https://login.microsoftonline.com/${tenantId}/`,
  `https://sts.windows.net/${tenantId}/`,
];

const client = jwksClient({
  jwksUri: `https://login.microsoftonline.com/${tenantId}/discovery/v2.0/keys`,
  cache: true,
  rateLimit: true,
});

const getKey: GetPublicKeyOrSecret = (header, callback) => {
  if (!header.kid) {
    return callback(new Error("Missing kid in token header"));
  }
  client.getSigningKey(header.kid, (err, key) => {
    if (err || !key) {
      return callback(err || new Error("Signing key not found"));
    }
    const signingKey = key.getPublicKey();
    callback(null, signingKey);
  });
};

export const azureAuthMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const authorization = req.headers.authorization;
  if (!authorization) {
    return res.status(401).send({ error: true, message: "Falta token" });
  }

  const token = authorization.startsWith("Bearer ")
    ? authorization.slice(7)
    : authorization;

  jwt.verify(
    token,
    getKey,
    {
      audience: `api://${clientId}`,
      issuer: expectedIssuers as any,
      algorithms: ["RS256"],
    },
    (
      err: VerifyErrors | null,
      decoded: string | Jwt | JwtPayload | undefined,
    ) => {
      if (err) {
        return res.status(403).send({
          error: true,
          message: "El Token proporcionado es invalido.",
        });
      }

      const payload = decoded as JwtPayload;
      if (payload.tid !== tenantId) {
        return res
          .status(403)
          .send({ error: true, message: "Tenant inválido." });
      }

      if (
        !payload.scp ||
        typeof payload.scp !== "string" ||
        !payload.scp.includes("user_impersonation")
      ) {
        return res
          .status(403)
          .send({ error: true, message: "Alcance insuficiente." });
      }

      (req as any).user = payload;
      next();
    },
  );
};

import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { tokenSecret } from "./global";

interface IAuthorized {
  uid: string;
  role: string;
  iat: number;
  exp: number;
}

export const ldapAuthMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const bearerToken = req.header("Authorization");
  if (!bearerToken) {
    return res.status(401).json({ error: "Authorization Header is missing." });
  }

  const token = bearerToken.replace("Bearer ", "");

  try {
    const authorized = jwt.verify(token, tokenSecret) as IAuthorized;
    if (Date.now() > authorized.exp * 1000) {
      return res
        .status(401)
        .json({ error: "Authorization Token has expired." });
    }

    (req as any).userId = authorized.uid;
    (req as any).userRole = authorized.role;
    next();
  } catch (err) {
    return res.status(401).send({ error: "Error validating JSON Web Token." });
  }
};

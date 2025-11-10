import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { tokenSecret } from "../helpers/global";
import { autenticarUsuario } from "../database/user.service";
import { autenticarUsuarioAD } from "../helpers/authenticate";

const getToken = (userId: string, userRole: string): string => {
  return jwt.sign({ uid: userId, role: userRole }, tokenSecret, {
    expiresIn: "2h",
  });
};

export const bbddAuthentication = async (req: Request, res: Response) => {
  const { username, password } = req.body;

  try {
    const user = await autenticarUsuario({ username, password });

    if (user.error) {
      return res.status(400).json({
        error: true,
        message: "El usuario ingresado no existe en el sistema.",
      });
    }

    const record = user.record[0];
    const token = getToken(record.id, record.role);

    const userProfile = {
      id: record.id,
      fullName: `${record.firstName} ${record.lastName}`,
      firstName: record.firstName,
      lastName: record.lastName,
      username: username,
      avatar: "/assets/images/avatars/13-small.png",
      email: username,
      role: record.role,
      ability: [{ action: "manage", subject: "all" }],
      extras: { eCommerceCartItemsCount: 5 },
    };

    const response = {
      error: false,
      tokenType: "Bearer",
      accessToken: token,
      refreshToken: token,
      userData: userProfile,
    };

    res.status(200).json(response);
  } catch (err) {
    const error = err as Error;
    return res.status(500).json({ error: true, message: error.message });
  }
};

export const ldapAuthentication = async (req: Request, res: Response) => {
  const { username, password } = req.body;

  try {
    const user = await autenticarUsuarioAD({
      username,
      password,
      role: "guest",
      module: "Autenticación",
    });

    if (!user.authenticated) {
      return res.status(401).json({
        error: true,
        message:
          "Las credenciales proporcionadas so invalidas, verifique los datos e intentelo nuevamente.",
      });
    }

    const token = getToken(user.userId, user.role);

    const userProfile = {
      error: false,
      tokenType: "Bearer",
      accessToken: token,
      refreshToken: token,
      userData: {
        id: user.userId,
        fullName: user.fullName,
        username: user.username,
        avatar: "/assets/images/avatars/13-small.png",
        email: user.email,
        role: "administrador",
        ability: [{ action: "manage", subject: "all" }],
        extras: { eCommerceCartItemsCount: 0 },
      },
    };

    res.status(200).json(userProfile);
  } catch (err) {
    const error = err as Error;
    return res.status(500).json({ error: true, message: error.message });
  }
};

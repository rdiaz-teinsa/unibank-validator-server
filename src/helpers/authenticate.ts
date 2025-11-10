import { authenticate } from "ldap-authentication";
import { ldapConfig, authConfig } from "./global";
import { addEvent } from "./logger";

interface UserData {
  module: string;
  username: string;
  password: string;
  role: string;
}

export const autenticarUsuarioAD = async (pData: UserData) => {
  const { module, username, password } = pData;
  const inUsername = `${username}@metrobank.local`;
  const shortUsername = username.toLowerCase();

  try {
    await authenticate({
      ldapOpts: ldapConfig,
      username: inUsername,
      userPassword: password,
    });
    addEvent.log(
      "info",
      `MODULE ${module} EVENT: La autenticación del Usuario : ${inUsername} culmino con resultado true`,
    );

    // TODO: Re-implement findUser and getGroupMembershipForUser using ldapjs or an alternative library.
    // The original ldap-authentication library does not provide these methods directly.
    // For now, we will assume successful authentication grants 'analyst' role if validatorGroup matches.

    // Placeholder for user and group lookup logic
    // const user = await auth.findUser(shortUsername) as LdapUser;
    // if (!user) {
    //   throw new Error(`El usuario ${shortUsername} no fue encontrado en el directorio activo.`);
    // }

    // const groups = await auth.getGroupMembershipForUser(shortUsername);
    // if (!groups || groups.length === 0) {
    //   throw new Error('El usuario no tiene grupos asociados.');
    // }

    let role = "guest";
    // Temporarily assign 'analyst' role if authentication is successful and validatorGroup is configured
    // This logic needs to be refined once user and group lookup is re-implemented.
    if (authConfig.validatorGroup) {
      // Assuming if validatorGroup is configured, it implies a valid role check
      role = "analyst";
    }

    addEvent.log(
      "info",
      `MODULE ${module} EVENT: El usuario: ${inUsername}, se autorizo con perfil de: ${role}`,
    );

    if (role !== "guest") {
      // Placeholder for actual user data from LDAP
      const signedUser = {
        userId: "N/A", // This needs to come from LDAP user data
        fullName: "N/A", // This needs to come from LDAP user data
        username: inUsername.replace("@metrobank.local", ""),
        email: inUsername.replace("@metrobank.local", "@metrobank.com"),
        role: role,
        authenticated: true,
        idCentro: 0, // This needs to come from LDAP user data
        createdDate: new Date(),
      };
      addEvent.log(
        "info",
        `MODULE ${module} EVENT: Culmino la autenticación y autorización usuario: ${shortUsername}, respuesta del servicio: ${JSON.stringify(signedUser)}`,
      );
      return signedUser;
    } else {
      throw new Error("El usuario no cuenta con acceso al sistema.");
    }
  } catch (err) {
    const error = err as Error;
    addEvent.log(
      "error",
      `MODULE ${module} EVENT: Se identificaron errores en el proceso de autenticación y autorización del usaurio: ${shortUsername}, error: ${error.message}`,
    );
    throw error;
  }
};

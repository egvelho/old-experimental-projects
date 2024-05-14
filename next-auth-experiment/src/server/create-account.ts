import parse from "../validation/parse";
import api from "../api";
import prisma from "../prisma";
import Token from "../auth/token";
import { Role } from "../auth/types";
import ValidNewUser from "../user/valid-new-user";

export default api.createAccount(async (data) => {
  const [
    { name, email, phoneNumber, surname, firebaseToken },
    errors,
  ] = await parse(ValidNewUser, data);

  const withErrors = errors.length > 0;
  const withoutFirebaseToken = firebaseToken === undefined;

  if (withErrors || withoutFirebaseToken) {
    const success = errors.length === 0;

    return {
      errors,
      success,
      token: undefined,
    };
  }

  const maybeUser = await prisma.user.create({
    data: {
      name,
      surname,
      email,
      phoneNumber,
    },
  });

  const token = await Token.encode({
    role: maybeUser.role as Role,
    id: maybeUser.id,
  });

  const success = token !== undefined;

  return {
    errors,
    success,
    token,
  };
});

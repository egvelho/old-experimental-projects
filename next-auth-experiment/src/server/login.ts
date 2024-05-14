import parse from "../validation/parse";
import api from "../api";
import prisma from "../prisma";
import { Role } from "../auth/types";
import Token from "../auth/token";
import ValidLogin from "../auth/valid-login";

export default api.login(async (data) => {
  const [{ phoneNumber, firebaseToken }, errors] = await parse(
    ValidLogin,
    data,
  );

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

  const maybeUser = await prisma.user.findUnique({
    where: {
      phoneNumber,
    },
  });

  if (maybeUser === null) {
    return {
      errors,
      success: false,
      token: undefined,
    };
  }

  const token = await Token.encode({
    id: maybeUser.id,
    role: maybeUser.role as Role,
  });

  const success = token !== undefined;

  return {
    errors,
    success,
    token,
  };
});

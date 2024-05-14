import parse from "../validation/parse";
import api from "../api";
import prisma from "../prisma";
import { Role } from "../auth/types";
import Token from "../auth/token";
import EmailToken from "../email/email-token";
import ValidEmailToken from "../email/valid-email-token";

export default api.verifyEmail(async (data) => {
  const [validMailToken, errors] = await parse(ValidEmailToken, data);
  const withErrors = errors.length > 0;

  if (withErrors) {
    return {
      errors,
      success: false,
    };
  }

  const maybePayload = await EmailToken.decode(validMailToken.token);

  if (maybePayload === undefined) {
    return {
      errors,
      success: false,
    };
  }

  const maybeUser = await prisma.user.findUnique({
    where: {
      id: maybePayload.id,
    },
  });

  if (maybeUser === null) {
    return {
      errors,
      success: false,
    };
  }

  await prisma.user.update({
    data: {
      isEmailVerified: true,
    },
    where: {
      id: maybePayload.id,
    },
  });

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

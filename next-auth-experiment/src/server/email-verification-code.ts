import parse from "../validation/parse";
import api from "../api";
import prisma from "../prisma";
import { Role } from "../auth/types";
import EmailToken from "../email/email-token";
import ValidEmailVerification from "../email/valid-email-verification";
import emailVerification from "../email/email-verification";

export default api.emailVerificationCode(async (data) => {
  const [{ email }, errors] = await parse(ValidEmailVerification, data);
  const withErrors = errors.length > 0;

  if (withErrors) {
    return {
      errors,
      success: false,
    };
  }

  const maybeUser = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (maybeUser === null) {
    return {
      errors,
      success: false,
    };
  }

  const code = EmailToken.generateCode();
  const token = await EmailToken.encode({
    code,
    id: maybeUser.id,
    role: maybeUser.role as Role,
  });

  const success = token !== undefined;

  if (success) {
    emailVerification(email, code);
  }

  return {
    errors,
    success,
    token,
  };
});

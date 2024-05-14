import parse from "../validation/parse";
import api from "../api";
import prisma from "../prisma";
import Token from "../auth/token";
import ValidNewPhoneNumber from "../user/valid-new-phone-number";

export default api.updatePhoneNumber(async (data, request) => {
  const [{ phoneNumber, firebaseToken }, errors] = await parse(
    ValidNewPhoneNumber,
    data,
  );

  const withErrors = errors.length > 0;
  const withoutFirebaseToken = firebaseToken === undefined;

  if (withErrors || withoutFirebaseToken) {
    const success = errors.length === 0;

    return {
      errors,
      success,
    };
  }

  const maybeUser = await Token.getUser(request);

  if (maybeUser === null) {
    return {
      errors,
      success: false,
    };
  }

  const success =
    (await prisma.user.update({
      data: {
        phoneNumber,
      },
      where: {
        id: maybeUser.id,
      },
    })) !== null;

  return {
    errors,
    success,
  };
});

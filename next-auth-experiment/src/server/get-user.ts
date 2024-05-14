import api from "../api";
import Token from "../auth/token";

export default api.getUser(async (_, request) => {
  const maybeUser = await Token.getUser(request);

  return {
    user: maybeUser ?? undefined,
  };
});

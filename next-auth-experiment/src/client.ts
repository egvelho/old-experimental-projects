import { getAxiosClient } from "@egvelho/next-metadata";
import endpoints from "./endpoints";
import { getContext } from "./context";

const texts = {
  authErrorMessage: "Você não está autenticado. Por favor, entre na sua conta",
  genericErrorMessage:
    "Houve um erro de rede. Por favor, verifique sua conexão",
};

export default getAxiosClient({
  endpoints,
  async beforeRequest(config) {
    const { context, setContext } = getContext();
    setContext({ loading: true });

    if (context.token) {
      return {
        ...config,
        headers: {
          ...(config.headers ?? {}),
          Authorization: `Bearer ${context.token}`,
        },
      };
    }

    return undefined;
  },
  async afterRequest(response) {
    const { setContext } = getContext();
    setContext({ loading: false });
  },
  async onError(error) {
    const { context, setContext } = getContext();

    if (error?.response?.status === 401) {
      return setContext({
        loading: false,
        token: "DELETE",
        accountView: "login",
        snackbarContent: {
          message: texts.authErrorMessage,
          severity: "info",
        },
      });
    } else {
      setContext({
        loading: false,
        snackbarContent: {
          message: texts.genericErrorMessage,
          severity: "error",
        },
      });
    }
  },
});

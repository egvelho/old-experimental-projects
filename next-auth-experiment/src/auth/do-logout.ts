import { ContextProps } from "../context";

const texts = {
  logoutSuccessMessage: "Você saiu da sua conta",
};

export default function doLogout(
  setContext: (context: Partial<ContextProps>) => void,
) {
  setContext({
    token: "DELETE",
    snackbarContent: {
      message: texts.logoutSuccessMessage,
      severity: "success",
    },
  });
}

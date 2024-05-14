import { useContext, ReactNode } from "react";
import PersonAddIcon from "@material-ui/icons/PersonAdd";
import AccountCircleIcon from "@material-ui/icons/AccountCircle";
import MeetingRoomIcon from "@material-ui/icons/MeetingRoom";
import {
  Dash as MuiDash,
  DashProps as MuiDashProps,
} from "@egvelho/next-material-components";
import doLogout from "./auth/do-logout";
import { Context } from "./context";

const texts = {
  appBarItemsAriaLabel: "Links do cabeçalho",
  drawerButtonAriaLabel: "Abrir menu de navegação",
  drawerItemsAriaLabel: "Links do menu de navegação",
  footerItemsAriaLabel: "Links do rodapé",
  loginLabel: "Entrar",
  createAccountLabel: "Criar conta",
  logoutLabel: "Sair",
};

export interface DashProps {
  children: ReactNode;
  snackbarContent: MuiDashProps["snackbarContent"];
  setSnackbarContent: MuiDashProps["setSnackbarContent"];
}

export default function Dash({
  children,
  snackbarContent,
  setSnackbarContent,
}: DashProps) {
  const { context, setContext } = useContext(Context);

  const accountItems = [
    {
      label: texts.loginLabel,
      Icon: AccountCircleIcon,
      onClick() {
        setContext({ accountView: "login" });
      },
    },
    {
      label: texts.createAccountLabel,
      Icon: PersonAddIcon,
      onClick() {
        setContext({ accountView: "create-account" });
      },
    },
  ];

  const logoutItems = [
    {
      label: texts.logoutLabel,
      Icon: MeetingRoomIcon,
      onClick() {
        doLogout(setContext);
      },
    },
  ];

  const drawerItems = context.token ? logoutItems : accountItems;

  return (
    <MuiDash
      snackbarContent={snackbarContent}
      setSnackbarContent={setSnackbarContent}
      logo={""}
      shortName={"next-account"}
      appBarColor={"black"}
      appBarBackgroundColor={"white"}
      appBarItems={[]}
      footerItems={[]}
      bottomNavigationItems={[]}
      drawerItems={drawerItems}
      drawerOpen={context.drawerOpen}
      setDrawerOpen={(drawerOpen) => setContext({ drawerOpen })}
      {...texts}
    >
      {children}
    </MuiDash>
  );
}

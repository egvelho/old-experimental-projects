import type {
  DashProps,
  AccountProps,
} from "@egvelho/next-material-components";
import type { User } from "@prisma/client";
import { createContext } from "@egvelho/next-material-boilerplate";

export type ContextProps = {
  drawerOpen: boolean;
  user: User | undefined;
  loading: boolean;
  token: string | undefined;
  accountView: AccountProps["view"];
  verifyEmailDialogOpen: boolean;
  snackbarContent: DashProps["snackbarContent"];
};

const initialContext: ContextProps = {
  drawerOpen: false,
  user: undefined,
  loading: false,
  token: undefined,
  accountView: undefined,
  verifyEmailDialogOpen: false,
  snackbarContent: {
    message: undefined,
    severity: undefined,
  },
};

export const { Context, ContextProvider, getContext } = createContext(
  initialContext,
);

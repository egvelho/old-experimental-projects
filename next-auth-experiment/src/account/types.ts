import type { UseFirebaseAuth } from "@egvelho/next-firebase/client";
import type { UseForm } from "../validation/use-form";
import type { AccountProps as MuiAccountProps } from "../view/account";
import { ContextProps } from "../context";
import type ValidForm from "./valid-form";

export type LoginProps = MuiAccountProps["loginProps"];
export type CreateAccountProps = MuiAccountProps["createAccountProps"];
export type RecoveryAccountProps = MuiAccountProps["recoveryAccountProps"];

export type FormState = {
  login: {
    loginStepForm: LoginProps["loginStepProps"]["form"];
    phoneVerificationStepForm: LoginProps["phoneVerificationStepProps"]["form"];
  };
  createAccount: {
    personalDataStepForm: CreateAccountProps["personalDataStepProps"]["form"];
    phoneVerificationStepForm: CreateAccountProps["phoneVerificationStepProps"]["form"];
  };
  recoveryAccount: {
    emailCodeStepForm: RecoveryAccountProps["emailCodeStepProps"]["form"];
    verifyCodeStepForm: RecoveryAccountProps["verifyCodeStepProps"]["form"];
    updatePhoneStepForm: RecoveryAccountProps["updatePhoneStepProps"]["form"];
    phoneVerificationStepForm: RecoveryAccountProps["phoneVerificationStepProps"]["form"];
  };
} & UseForm<ValidForm>;

export interface AccountState {
  setSnackbarContent: (
    snackbarContent: ContextProps["snackbarContent"],
  ) => void;
  setToken: (token: ContextProps["token"]) => void;
  view: MuiAccountProps["view"];
  setView: (view: MuiAccountProps["view"]) => void;
  backButtonVisible: boolean;
  setBackButtonVisible: (backButtonVisible: boolean) => void;
  loading: boolean;
  setLoading: (loading: boolean) => void;
  loginStep: LoginProps["step"];
  setLoginStep: (loginStep: LoginProps["step"]) => void;
  createAccountStep: CreateAccountProps["step"];
  setCreateAccountStep: (createAccountStep: CreateAccountProps["step"]) => void;
  recoveryAccountStep: RecoveryAccountProps["step"];
  setRecoveryAccountStep: (
    recoveryAccountStep: RecoveryAccountProps["step"],
  ) => void;
  onRequestClose: () => void;
  onBackButtonClick: () => void;
  form: FormState;
  firebaseAuth: UseFirebaseAuth;
}

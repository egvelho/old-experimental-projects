import React from "react";
import client from "../client";
import * as types from "./types";
import masks from "./masks";

const texts = {
  titleText: "Entrar na sua conta",
  loginStep: {
    createAccountButtonLabel: "Criar conta",
    submitButtonLabel: "Entrar",
    recoveryAccountTitleText: "Não consegue acessar sua conta? ",
    recoveryAccountLinkLabel: "Recuperar agora",
    onSubmitFailure: "Houve um erro ao acessar sua conta",
    onSubmitSuccess: "Você entrou na sua conta",
  },
  phoneVerificationStep: {
    recoveryAccountInfoText(phoneNumber: string) {
      return (
        <>
          Um código de verificação foi enviado <br />
          para o número <strong>{phoneNumber}</strong>
          <br />
          <br />
          Não recebeu o código?{" "}
        </>
      );
    },
    resendCodeLinkLabel: "Reenviar agora",
    finishButtonLabel: "Finalizar",
    resendCodeSuccess: "O código foi reenviado com sucesso",
    resendCodeFailure: "Houve um erro ao reenviar o código",
    submitButtonLabel: "Acessar conta",
    onSubmitFailure: "Houve um erro ao acessar sua conta",
    onSubmitSuccess: "Você entrou na sua conta",
  },
};

const loginStepCreateAccountOnClick = ({
  setBackButtonVisible,
  setView,
}: types.AccountState) => {
  setBackButtonVisible(true);
  setView("create-account");
};

const loginStepRecoveryAccountOnClick = ({
  setBackButtonVisible,
  setView,
}: types.AccountState) => {
  setBackButtonVisible(true);
  setView("recovery-account");
};

const loginStepOnSubmit = async ({
  setBackButtonVisible,
  setLoginStep,
  setSnackbarContent,
  firebaseAuth,
  form,
}: types.AccountState) => {
  const { phoneNumber } = form.form;

  if (phoneNumber.errors.length > 0) {
    return;
  }

  const { data } = await client.login({
    phoneNumber: phoneNumber.value,
  });

  if (data.success === false) {
    await form.setFormErrors(data.errors);
    return;
  }

  const success = await firebaseAuth.requestCode(
    form.login.loginStepForm.phoneNumber.value,
  );

  if (success) {
    setBackButtonVisible(true);
    setLoginStep("phone-verification");
  } else {
    setSnackbarContent({
      message: texts.loginStep.onSubmitFailure,
      severity: "error",
    });
  }
};

const phoneVerificationStepOnClickResendCode = async ({
  setSnackbarContent,
  firebaseAuth,
  form,
}: types.AccountState) => {
  const success = await firebaseAuth.requestCode(
    form.login.loginStepForm.phoneNumber.value,
  );

  const message = success
    ? texts.phoneVerificationStep.resendCodeSuccess
    : texts.phoneVerificationStep.resendCodeFailure;

  setSnackbarContent({
    message,
    severity: success ? "success" : "error",
  });
};

const phoneVerificationStepOnSubmit = async ({
  setView,
  setSnackbarContent,
  setToken,
  firebaseAuth,
  form,
}: types.AccountState) => {
  const firebaseToken = await firebaseAuth.verifyCode(
    form.login.phoneVerificationStepForm.code.value,
  );

  if (firebaseToken === undefined) {
    setSnackbarContent({
      message: texts.phoneVerificationStep.onSubmitFailure,
      severity: "error",
    });
    return;
  }

  const phoneNumber = form.state.phoneNumber;
  const { data } = await client.login({ phoneNumber, firebaseToken });

  if (data.success) {
    setToken(data.token);
    setSnackbarContent({
      message: texts.phoneVerificationStep.onSubmitSuccess,
      severity: "success",
    });
    setView(undefined);
  } else {
    setSnackbarContent({
      message: texts.phoneVerificationStep.onSubmitFailure,
      severity: "success",
    });
  }
};

const getLoginStepProps: (
  accountState: types.AccountState,
) => types.LoginProps["loginStepProps"] = (accountState) => ({
  createAccountButtonLabel: texts.loginStep.createAccountButtonLabel,
  submitButtonLabel: texts.loginStep.submitButtonLabel,
  recoveryAccountLinkLabel: texts.loginStep.recoveryAccountLinkLabel,
  recoveryAccountTitleText: texts.loginStep.recoveryAccountTitleText,
  phoneNumberMask: masks.phoneNumberMask,
  loading: accountState.loading,
  createAccountOnClick: () => loginStepCreateAccountOnClick(accountState),
  recoveryAccountOnClick: () => loginStepRecoveryAccountOnClick(accountState),
  onSubmit: () => loginStepOnSubmit(accountState),
  form: accountState.form.login.loginStepForm,
});

const getPhoneVerificationStepProps: (
  accountState: types.AccountState,
) => types.LoginProps["phoneVerificationStepProps"] = (accountState) => ({
  recoveryAccountInfoText: texts.phoneVerificationStep.recoveryAccountInfoText(
    accountState.form.login.loginStepForm.phoneNumber.value,
  ),
  resendCodeLinkLabel: texts.phoneVerificationStep.resendCodeLinkLabel,
  submitButtonLabel: texts.phoneVerificationStep.submitButtonLabel,
  finishButtonLabel: texts.phoneVerificationStep.finishButtonLabel,
  codeMask: masks.codeMask,
  loading: accountState.loading,
  onClickResendCode: () => phoneVerificationStepOnClickResendCode(accountState),
  onSubmit: () => phoneVerificationStepOnSubmit(accountState),
  form: accountState.form.login.phoneVerificationStepForm,
});

const getLoginProps: (accountState: types.AccountState) => types.LoginProps = (
  accountState,
) => ({
  step: accountState.loginStep,
  loginTitleText: texts.titleText,
  loginStepProps: getLoginStepProps(accountState),
  phoneVerificationStepProps: getPhoneVerificationStepProps(accountState),
});

export default getLoginProps;

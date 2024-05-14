import React from "react";
import client from "../client";
import * as types from "./types";
import masks from "./masks";

const texts = {
  emailCodeStepLabel: "Inserir email",
  verifyCodeStepLabel: "Verificar email",
  updatePhoneStepLabel: "Atualizar celular",
  phoneVerificationStepLabel: "Verificar celular",
  finishStepLabel: "Finalizar",
  infoText: "Por favor, siga os passos abaixo para recuperar sua conta",
  titleText: "Recuperar sua conta",
  emailCodeStep: {
    submitButtonLabel: "Próximo",
    titleText: "Digite o email que foi utilizado para criar a sua conta",
    onSubmitFailure: "Houve um erro ao enviar o código de verificação",
  },
  verifyCodeStep: {
    infoText(email: string) {
      return (
        <>
          Um código de verificação foi enviado <br />
          para o email <strong>{email}</strong>
          <br />
          <br />
          Não recebeu o código?{" "}
        </>
      );
    },
    resendCodeButtonLabel: "Reenviar agora",
    onSubmitButtonLabel: "Próximo",
    resendCodeSuccess: "O código foi reenviado com sucesso",
    resendCodeFailure: "Houve um erro ao reenviar o código",
  },
  updatePhoneStep: {
    submitButtonLabel: "Próximo",
    infoText: "Digite um novo número de celular",
    onSubmitFailure: "Houve um erro ao verificar o celular informado",
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
    submitButtonLabel: "Finalizar",
    onSubmitFailure: "Houve um erro ao recuperar a sua conta",
  },
  finishStep: {
    buttonLabel: "Ver minha conta",
    infoText:
      "Você recuperou o acesso a sua conta. Para continuar, pressione o botão abaixo",
    titleText: "Conta recuperada com sucesso",
  },
};

const emailCodeOnSubmit = async ({
  setRecoveryAccountStep,
  setSnackbarContent,
  form,
}: types.AccountState) => {
  const { email } = form.form;

  if (email.errors.length > 0) {
    return;
  }

  const { data } = await client.emailVerificationCode({ email: email.value });

  if (data.success === false) {
    await form.setFormErrors(data.errors);
    return;
  }

  form.setFormState({ token: data.token });

  if (data.success) {
    setRecoveryAccountStep("verify-code");
  } else {
    setSnackbarContent({
      message: texts.emailCodeStep.onSubmitFailure,
      severity: "error",
    });
  }
};

const verifyCodeOnResendCode = async ({
  setSnackbarContent,
  form,
}: types.AccountState) => {
  const { email } = form.form;
  const { data } = await client.emailVerificationCode({ email: email.value });

  if (data.success === true) {
    form.setFormState({ token: data.token });
  }

  const message = data.success
    ? texts.verifyCodeStep.resendCodeSuccess
    : texts.verifyCodeStep.resendCodeFailure;

  setSnackbarContent({
    message,
    severity: data.success ? "success" : "error",
  });
};

const verifyCodeOnSubmit = async ({
  setRecoveryAccountStep,
  setBackButtonVisible,
  setToken,
  form,
}: types.AccountState) => {
  const { code, token } = form.state;
  const { data } = await client.verifyEmail({
    code,
    token,
  });

  if (data.success) {
    setBackButtonVisible(false);
    setRecoveryAccountStep("update-phone");
    setToken(data.token);
  } else {
    await form.setFormErrors(data.errors);
  }
};

const updatePhoneOnSubmit = async ({
  setRecoveryAccountStep,
  setSnackbarContent,
  form,
  firebaseAuth,
}: types.AccountState) => {
  const { phoneNumber } = form.form;

  if (phoneNumber.errors.length > 0) {
    return;
  }

  const { data } = await client.updatePhoneNumber({
    phoneNumber: phoneNumber.value,
  });

  if (data.success === false) {
    await form.setFormErrors(data.errors);
    return;
  }

  const requestCodeSuccess = await firebaseAuth.requestCode(
    form.recoveryAccount.updatePhoneStepForm.phoneNumber.value,
  );

  if (requestCodeSuccess) {
    setRecoveryAccountStep("phone-verification");
  } else {
    setSnackbarContent({
      message: texts.updatePhoneStep.onSubmitFailure,
      severity: data.success ? "success" : "error",
    });
  }
};

const phoneVerificationOnClickResendCode = async ({
  setSnackbarContent,
  firebaseAuth,
  form,
}: types.AccountState) => {
  const success = await firebaseAuth.requestCode(
    form.recoveryAccount.updatePhoneStepForm.phoneNumber.value,
  );

  const message = success
    ? texts.phoneVerificationStep.resendCodeSuccess
    : texts.phoneVerificationStep.resendCodeFailure;

  setSnackbarContent({
    message,
    severity: success ? "success" : "error",
  });
};

const phoneVerificationOnSubmit = async ({
  setRecoveryAccountStep,
  setBackButtonVisible,
  setSnackbarContent,
  firebaseAuth,
  form,
}: types.AccountState) => {
  const { phoneNumber } = form.state;
  const firebaseToken = await firebaseAuth.verifyCode(
    form.recoveryAccount.phoneVerificationStepForm.code.value,
  );

  if (firebaseToken === undefined) {
    setSnackbarContent({
      message: texts.phoneVerificationStep.onSubmitFailure,
      severity: "error",
    });
    return;
  }
  const { data } = await client.updatePhoneNumber({
    phoneNumber,
    firebaseToken,
  });

  if (data.success) {
    setBackButtonVisible(false);
    setRecoveryAccountStep("finish-step");
  } else {
    await form.setFormErrors(data.errors);
    setRecoveryAccountStep("update-phone");
  }
};

const finishStepOnClickFinishButton = ({ setView }: types.AccountState) => {
  setView(undefined);
};

const getEmailCodeStepProps: (
  accountState: types.AccountState,
) => types.RecoveryAccountProps["emailCodeStepProps"] = (accountState) => ({
  submitButtonLabel: texts.emailCodeStep.submitButtonLabel,
  emailCodeTitleText: texts.emailCodeStep.titleText,
  loading: accountState.loading,
  onSubmit: () => emailCodeOnSubmit(accountState),
  form: accountState.form.recoveryAccount.emailCodeStepForm,
});

const getVerifyCodeStepProps: (
  accountState: types.AccountState,
) => types.RecoveryAccountProps["verifyCodeStepProps"] = (accountState) => ({
  onSubmitButtonLabel: texts.verifyCodeStep.onSubmitButtonLabel,
  resendCodeButtonLabel: texts.verifyCodeStep.resendCodeButtonLabel,
  verifyCodeStepInfoText: texts.verifyCodeStep.infoText(
    accountState.form.recoveryAccount.emailCodeStepForm.email.value,
  ),
  loading: accountState.loading,
  onResendCode: () => verifyCodeOnResendCode(accountState),
  onSubmit: () => verifyCodeOnSubmit(accountState),
  form: accountState.form.recoveryAccount.verifyCodeStepForm,
});

const getUpdatePhoneStepProps: (
  accountState: types.AccountState,
) => types.RecoveryAccountProps["updatePhoneStepProps"] = (accountState) => ({
  submitButtonLabel: texts.updatePhoneStep.submitButtonLabel,
  updatePhoneStepInfoText: texts.updatePhoneStep.infoText,
  phoneNumberMask: masks.phoneNumberMask,
  loading: accountState.loading,
  onSubmit: () => updatePhoneOnSubmit(accountState),
  form: accountState.form.recoveryAccount.updatePhoneStepForm,
});

const getPhoneVerificationStepProps: (
  accountState: types.AccountState,
) => types.RecoveryAccountProps["phoneVerificationStepProps"] = (
  accountState,
) => ({
  finishButtonLabel: texts.phoneVerificationStep.finishButtonLabel,
  resendCodeLinkLabel: texts.phoneVerificationStep.resendCodeLinkLabel,
  submitButtonLabel: texts.phoneVerificationStep.submitButtonLabel,
  recoveryAccountInfoText: texts.phoneVerificationStep.recoveryAccountInfoText(
    accountState.form.recoveryAccount.updatePhoneStepForm.phoneNumber.value,
  ),
  codeMask: masks.codeMask,
  loading: accountState.loading,
  onClickResendCode: () => phoneVerificationOnClickResendCode(accountState),
  onSubmit: () => phoneVerificationOnSubmit(accountState),
  form: accountState.form.recoveryAccount.phoneVerificationStepForm,
});

const getFinishStepProps: (
  accountState: types.AccountState,
) => types.RecoveryAccountProps["finishStepProps"] = (accountState) => ({
  finishButtonLabel: texts.finishStep.buttonLabel,
  finishStepInfoText: texts.finishStep.infoText,
  finishStepTitleText: texts.finishStep.titleText,
  onClickFinishButton: () => finishStepOnClickFinishButton(accountState),
});

const getRecoveryAccountProps: (
  accountState: types.AccountState,
) => types.RecoveryAccountProps = (accountState) => ({
  emailCodeStepLabel: texts.emailCodeStepLabel,
  finishStepLabel: texts.finishStepLabel,
  phoneVerificationStepLabel: texts.phoneVerificationStepLabel,
  updatePhoneStepLabel: texts.updatePhoneStepLabel,
  verifyCodeStepLabel: texts.verifyCodeStepLabel,
  recoveryAccountInfoText: texts.infoText,
  recoveryAccountTitleText: texts.titleText,
  step: accountState.recoveryAccountStep,
  emailCodeStepProps: getEmailCodeStepProps(accountState),
  verifyCodeStepProps: getVerifyCodeStepProps(accountState),
  updatePhoneStepProps: getUpdatePhoneStepProps(accountState),
  phoneVerificationStepProps: getPhoneVerificationStepProps(accountState),
  finishStepProps: getFinishStepProps(accountState),
});

export default getRecoveryAccountProps;

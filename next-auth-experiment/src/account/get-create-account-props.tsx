import React from "react";
import client from "../client";
import * as types from "./types";
import masks from "./masks";

const texts = {
  phoneVerificationStepLabel: "Verificar celular",
  personalDataStepLabel: "Informações básicas",
  finishStepLabel: "Finalizar",
  createAccountInfoText: "Siga as etapas abaixo para criar sua conta",
  createAccountTitleText: "Criar conta",
  personalDataStep: {
    onSubmitErrorMessage: "Houve um erro ao verificar o celular informado",
    submitButtonLabel: "Próximo",
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
    onSubmitFailure: "Houve um erro ao criar sua conta",
  },
  finishStep: {
    finishButtonLabel: "Ver minha conta",
    infoText:
      "Obrigado por criar sua conta. Por favor, pressione o botão abaixo para continuar",
    titleText: "Parabéns! Você criou a sua conta",
  },
};

const onRequestGoToPersonalDataStep = ({
  setCreateAccountStep,
}: types.AccountState) => {
  setCreateAccountStep("personal-data");
};

const personalDataOnSubmit = async ({
  setCreateAccountStep,
  setSnackbarContent,
  firebaseAuth,
  form,
}: types.AccountState) => {
  const { email, name, phoneNumber, surname } = await form.setFormErrors();
  if (
    email.errors.length > 0 ||
    name.errors.length > 0 ||
    phoneNumber.errors.length > 0 ||
    surname.errors.length > 0
  ) {
    return;
  }

  const { data } = await client.createAccount(form.state);

  if (data.success) {
    const requestCodeSuccess = await firebaseAuth.requestCode(
      form.createAccount.personalDataStepForm.phoneNumber.value,
    );

    if (requestCodeSuccess) {
      setCreateAccountStep("phone-verification");
    } else {
      setSnackbarContent({
        message: texts.personalDataStep.onSubmitErrorMessage,
        severity: requestCodeSuccess ? "success" : "error",
      });
    }
  } else {
    await form.setFormErrors(data.errors);
  }
};

const phoneVerificationOnSubmit = async ({
  firebaseAuth,
  form,
  setToken,
  setSnackbarContent,
  setBackButtonVisible,
  setCreateAccountStep,
}: types.AccountState) => {
  const firebaseToken = await firebaseAuth.verifyCode(
    form.createAccount.phoneVerificationStepForm.code.value,
  );

  if (firebaseToken === undefined) {
    setSnackbarContent({
      message: texts.phoneVerificationStep.onSubmitFailure,
      severity: "error",
    });
  } else {
    const { data } = await client.createAccount({
      ...form.state,
      firebaseToken,
    });

    if (data.success) {
      setToken(data.token);
      setBackButtonVisible(false);
      setCreateAccountStep("finish-step");
    } else {
      setCreateAccountStep("personal-data");
      form.setFormState({ code: "" });
      await form.setFormErrors(data.errors);
    }
  }
};

const phoneVerificationOnClickResendCode = async ({
  form,
  setSnackbarContent,
  firebaseAuth,
}: types.AccountState) => {
  const success = await firebaseAuth.requestCode(
    form.createAccount.personalDataStepForm.phoneNumber.value,
  );

  const message = success
    ? texts.phoneVerificationStep.resendCodeSuccess
    : texts.phoneVerificationStep.resendCodeFailure;

  setSnackbarContent({
    message,
    severity: success ? "success" : "error",
  });
};

const finishStepOnClickFinishButton = ({ setView }: types.AccountState) => {
  setView(undefined);
};

const getPersonalDataStepProps: (
  accountState: types.AccountState,
) => types.CreateAccountProps["personalDataStepProps"] = (accountState) => {
  return {
    submitButtonLabel: texts.personalDataStep.submitButtonLabel,
    phoneNumberMask: masks.phoneNumberMask,
    loading: accountState.loading,
    onSubmit: () => personalDataOnSubmit(accountState),
    form: accountState.form.createAccount.personalDataStepForm,
  };
};

const getPhoneVerificationStepProps: (
  accountState: types.AccountState,
) => types.CreateAccountProps["phoneVerificationStepProps"] = (
  accountState,
) => ({
  finishButtonLabel: texts.phoneVerificationStep.finishButtonLabel,
  resendCodeLinkLabel: texts.phoneVerificationStep.resendCodeLinkLabel,
  submitButtonLabel: texts.phoneVerificationStep.submitButtonLabel,
  recoveryAccountInfoText: texts.phoneVerificationStep.recoveryAccountInfoText(
    accountState.form.createAccount.personalDataStepForm.phoneNumber.value,
  ),
  codeMask: masks.codeMask,
  loading: accountState.loading,
  onSubmit: () => phoneVerificationOnSubmit(accountState),
  onClickResendCode: () => phoneVerificationOnClickResendCode(accountState),
  form: accountState.form.createAccount.phoneVerificationStepForm,
});

const getFinishStepProps: (
  accountState: types.AccountState,
) => types.CreateAccountProps["finishStepProps"] = (accountState) => ({
  finishButtonLabel: texts.finishStep.finishButtonLabel,
  finishStepInfoText: texts.finishStep.infoText,
  finishStepTitleText: texts.finishStep.titleText,
  onClickFinishButton: () => finishStepOnClickFinishButton(accountState),
});

const getCreateAccountProps: (
  accountState: types.AccountState,
) => types.CreateAccountProps = (accountState) => ({
  phoneVerificationStepLabel: texts.phoneVerificationStepLabel,
  personalDataStepLabel: texts.personalDataStepLabel,
  finishStepLabel: texts.finishStepLabel,
  createAccountInfoText: texts.createAccountInfoText,
  createAccountTitleText: texts.createAccountTitleText,
  step: accountState.createAccountStep,
  onRequestGoToPersonalDataStep: () =>
    onRequestGoToPersonalDataStep(accountState),
  phoneVerificationStepProps: getPhoneVerificationStepProps(accountState),
  personalDataStepProps: getPersonalDataStepProps(accountState),
  finishStepProps: getFinishStepProps(accountState),
});

export default getCreateAccountProps;

import React, { useContext, useState } from "react";
import { IsString } from "class-validator";
import { Context, ContextProps } from "../context";
import useForm from "../validation/use-form";
import {
  VerifyEmail as MuiVerifyEmail,
  VerifyEmailProps as MuiVerifyEmailProps,
} from "../view/verify-email";
import client from "../client";

const texts = {
  verifyEmailTitleText: "Verificar email",
  emailCodeStep: {
    emailCodeInfoText: "Para continuar é necessário verificar o seu email",
    closeButtonLabel: "Fechar",
    onSubmitButtonLabel: "Verificar",
    onSubmitFailure: "Houve um erro ao enviar o email de verificação",
  },
  verifyCodeStep: {
    verifyCodeInfoText(email: string) {
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
    onSubmitButtonLabel: "Finalizar",
    resendCodeLinkLabel: "Reenviar agora",
    codeLabel: "Código",
    resendCodeSuccess: "O código foi reenviado com sucesso",
    resendCodeFailure: "Houve um erro ao reenviar o código",
    onSubmitSuccess: "Email verificado com sucesso",
  },
};

class ValidCode {
  @IsString()
  code!: string;

  @IsString()
  token!: string;
}

export default function VerifyEmail() {
  const { context, setContext } = useContext(Context);
  const [step, setStep] = useState("email-code" as MuiVerifyEmailProps["step"]);
  const form = useForm(ValidCode, {
    code: "",
    token: "",
  });

  const { code } = form.form;
  const open = context.verifyEmailDialogOpen;
  const loading = context.loading;
  const email = context.user?.email ?? "";

  const setToken = (token: ContextProps["token"]) => setContext({ token });
  const setSnackbarContent = (
    snackbarContent: ContextProps["snackbarContent"],
  ) => setContext({ snackbarContent });

  const onClose = () => setContext({ verifyEmailDialogOpen: false });

  const verifyCodeForm = {
    code: {
      error: code.touched && code.errors.length > 0,
      helperText: (code.touched && code.errors[0]) || "",
      label: texts.verifyCodeStep.codeLabel,
      onBlur: () => form.setFormBlur("code"),
      onFocus: () => form.setFormFocus("code"),
      onChange: (code: string) => form.setFormState({ code }),
      value: code.value,
    },
  };

  const emailCodeStepOnSubmit = async () => {
    const { data } = await client.emailVerificationCode({
      email,
    });

    if (data.success) {
      form.setFormState({ token: data.token });
      setStep("verify-code");
    } else {
      setSnackbarContent({
        message: texts.emailCodeStep.onSubmitFailure,
        severity: "error",
      });
    }
  };

  const verifyCodeStepOnResendCode = async () => {
    const { data } = await client.emailVerificationCode({ email });

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

  const verifyCodeStepOnSubmit = async () => {
    const { code, token } = form.state;
    const { data } = await client.verifyEmail({
      code,
      token,
    });

    if (data.success) {
      setSnackbarContent({
        message: texts.verifyCodeStep.onSubmitSuccess,
        severity: "success",
      });
      onClose();
      setToken(data.token);
    } else {
      await form.setFormErrors(data.errors);
    }
  };

  return (
    <MuiVerifyEmail
      verifyEmailTitleText={texts.verifyEmailTitleText}
      open={open}
      onRequestClose={onClose}
      step={step}
      emailCodeStepProps={{
        emailCodeInfoText: texts.emailCodeStep.emailCodeInfoText,
        closeButtonLabel: texts.emailCodeStep.closeButtonLabel,
        onSubmitButtonLabel: texts.emailCodeStep.onSubmitButtonLabel,
        loading,
        onClickCloseButton: onClose,
        onSubmit: emailCodeStepOnSubmit,
      }}
      verifyCodeStepProps={{
        resendCodeLinkLabel: texts.verifyCodeStep.resendCodeLinkLabel,
        onSubmitButtonLabel: texts.verifyCodeStep.onSubmitButtonLabel,
        verifyCodeInfoText: texts.verifyCodeStep.verifyCodeInfoText(email),
        loading,
        onClickResendCode: verifyCodeStepOnResendCode,
        onSubmit: verifyCodeStepOnSubmit,
        form: verifyCodeForm,
      }}
    />
  );
}

import useForm from "../validation/use-form";
import ValidForm from "./valid-form";
import * as types from "./types";

const texts = {
  nameLabel: "Nome",
  surnameLabel: "Sobrenome",
  emailLabel: "Email",
  phoneNumberLabel: "Celular",
  codeLabel: "Código",
};

export default function getFormState(): types.FormState {
  const state = useForm(ValidForm, {
    name: "",
    surname: "",
    email: "",
    phoneNumber: "",
    code: "",
    token: "",
  });

  function mapToForm(key: keyof typeof state["form"]) {
    return {
      error:
        (state.form[key]?.touched && !!state.form[key]?.errors?.length) ??
        false,
      helperText: state.form[key]?.touched
        ? state.form[key]?.errors[0] ?? ""
        : "",
      onBlur: () => state.setFormBlur(key),
      onChange: (value: unknown) => state.setFormState({ [key]: value }),
      onFocus: () => state.setFormFocus(key),
      value: state.form[key]?.value ?? "",
    };
  }

  return {
    ...state,
    login: {
      loginStepForm: {
        phoneNumber: {
          label: texts.phoneNumberLabel,
          ...mapToForm("phoneNumber"),
        },
      },
      phoneVerificationStepForm: {
        code: {
          label: texts.codeLabel,
          ...mapToForm("code"),
        },
      },
    },
    createAccount: {
      personalDataStepForm: {
        name: {
          label: texts.nameLabel,
          ...mapToForm("name"),
        },
        surname: {
          label: texts.surnameLabel,
          ...mapToForm("surname"),
        },
        email: {
          label: texts.emailLabel,
          ...mapToForm("email"),
        },
        phoneNumber: {
          label: texts.phoneNumberLabel,
          ...mapToForm("phoneNumber"),
        },
      },
      phoneVerificationStepForm: {
        code: {
          label: texts.codeLabel,
          ...mapToForm("code"),
        },
      },
    },
    recoveryAccount: {
      emailCodeStepForm: {
        email: {
          label: texts.emailLabel,
          ...mapToForm("email"),
        },
      },
      verifyCodeStepForm: {
        code: {
          label: texts.codeLabel,
          ...mapToForm("code"),
        },
      },
      updatePhoneStepForm: {
        phoneNumber: {
          label: texts.phoneNumberLabel,
          ...mapToForm("phoneNumber"),
        },
      },
      phoneVerificationStepForm: {
        code: {
          label: texts.codeLabel,
          ...mapToForm("code"),
        },
      },
    },
  };
}

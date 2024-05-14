import { IsEmail, IsPhoneNumber, IsString, Length } from "class-validator";
import { Trim, Whitelist } from "class-sanitizer";

const texts = {
  nameLengthMessage(min: number, max: number) {
    return `O nome deve conter pelo menos ${min} letras e no máximo ${max} letras`;
  },
  surnameLengthMessage(min: number, max: number) {
    return `O sobrenome deve conter pelo menos ${min} letras e no máximo ${max} letras`;
  },
  isEmailMessage: "Este email é inválido",
  isPhoneNumberMessage: "Este número de celular é inválido",
};

export default class ValidUser {
  @Trim()
  @IsString()
  @Length(2, 16, {
    message: ({ constraints: [min, max] }) => texts.nameLengthMessage(min, max),
  })
  name!: string;

  @Trim()
  @IsString()
  @Length(2, 24, {
    message: ({ constraints: [min, max] }) =>
      texts.surnameLengthMessage(min, max),
  })
  surname!: string;

  @IsEmail(undefined, {
    message: () => texts.isEmailMessage,
  })
  email!: string;

  @Whitelist(/\d+/g)
  @IsPhoneNumber("BR", {
    message: () => texts.isPhoneNumberMessage,
  })
  phoneNumber!: string;
}

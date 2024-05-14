import { IsEmail, IsString } from "class-validator";
import IsEmailRegistered from "../user/is-email-registered";

const texts = {
  isEmailMessage: "Este email é inválido",
  isEmailRegisteredMessage: "Este email não está cadastrado",
};

export default class ValidEmailVerification {
  @IsEmailRegistered({
    message: () => texts.isEmailRegisteredMessage,
  })
  @IsEmail(undefined, {
    message: () => texts.isEmailMessage,
  })
  email!: string;
}

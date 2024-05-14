import { IsOptional, IsPhoneNumber } from "class-validator";
import { Whitelist } from "class-sanitizer";
import IsPhoneNumberRegistered from "../user/is-phone-number-registered";
import IsNotBlocked from "../user/is-not-blocked";
import IsFirebaseToken from "../firebase/is-firebase-token";
import IsFirebasePhoneNumber from "../firebase/is-firebase-phone-number";

const texts = {
  isFirebasePhoneNumberMessage:
    "O número de telefone não corresponse com o que foi verificado",
  isFirebaseTokenMessage: "Houve um erro de autenticação",
  isNotBlocked: "Houve um erro ao acessar sua conta",
  isPhoneNumberMessage: "Este número de celular é inválido",
  isPhoneNumberRegistered: "Este celular não está cadastrado",
};

export default class ValidLogin {
  @IsOptional()
  @IsFirebasePhoneNumber("+55", "phoneNumber", {
    message: () => texts.isFirebasePhoneNumberMessage,
  })
  @IsFirebaseToken({
    message: () => texts.isFirebaseTokenMessage,
  })
  firebaseToken?: string;

  @IsNotBlocked({
    message: () => texts.isNotBlocked,
  })
  @IsPhoneNumberRegistered({
    message: () => texts.isPhoneNumberRegistered,
  })
  @Whitelist(/\d+/g)
  @IsPhoneNumber("BR", {
    message: () => texts.isPhoneNumberMessage,
  })
  phoneNumber!: string;
}

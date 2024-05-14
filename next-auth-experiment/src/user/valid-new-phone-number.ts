import { IsOptional, IsPhoneNumber } from "class-validator";
import { Whitelist } from "class-sanitizer";
import IsPhoneNumberUnique from "../user/is-phone-number-unique";
import IsFirebaseToken from "../firebase/is-firebase-token";
import IsFirebasePhoneNumber from "../firebase/is-firebase-phone-number";

const texts = {
  isFirebasePhoneNumberMessage:
    "O número de telefone não corresponse com o que foi verificado",
  isFirebaseTokenMessage: "Houve um erro de autenticação",
  isPhoneNumberUnique: "Este celular já está cadastrado",
  isPhoneNumberMessage: "Este número de celular é inválido",
};

export default class ValidPhoneNumber {
  @IsOptional()
  @IsFirebasePhoneNumber("+55", "phoneNumber", {
    message: () => texts.isFirebasePhoneNumberMessage,
  })
  @IsFirebaseToken({
    message: () => texts.isFirebaseTokenMessage,
  })
  firebaseToken?: string;

  @Whitelist(/\d+/g)
  @IsPhoneNumber("BR", {
    message: () => texts.isPhoneNumberMessage,
  })
  @IsPhoneNumberUnique({
    message: () => texts.isPhoneNumberUnique,
  })
  phoneNumber!: string;
}

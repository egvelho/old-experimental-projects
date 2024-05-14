import {
  ValidationOptions,
  ValidationArguments,
  isString,
} from "class-validator";
import createValidator from "../validation/create-validator";
import { FirebaseToken } from "@egvelho/next-firebase/server";

const IsFirebasePhoneNumber = createValidator<
  (
    countryCode: string,
    phoneNumberPropertyName: string,
    validationOptions?: ValidationOptions,
  ) => never
>({
  name: "isFirebasePhoneNumber",
  constraintsLength: 2,
  async validate(token: string, args: ValidationArguments) {
    const [countryCode, phoneNumberPropertyName] = args.constraints;
    const maybePhoneNumber = (args.object as any)[phoneNumberPropertyName];

    if (!isString(token) || !isString(maybePhoneNumber)) {
      return false;
    }

    const maybeFirebaseUser = await FirebaseToken.decode(token);
    const maybeFirebasePhoneNumber = maybeFirebaseUser?.phone_number?.replace(
      countryCode,
      "",
    );

    if (maybeFirebasePhoneNumber === undefined) {
      return false;
    } else {
      return maybeFirebasePhoneNumber === maybePhoneNumber;
    }
  },
});

export default IsFirebasePhoneNumber;

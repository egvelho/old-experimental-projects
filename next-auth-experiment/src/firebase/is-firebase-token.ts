import { ValidationOptions, isString } from "class-validator";
import { FirebaseToken } from "@egvelho/next-firebase/server";
import createValidator from "../validation/create-validator";

const IsFirebaseToken = createValidator<
  (validationOptions?: ValidationOptions) => never
>({
  name: "isFirebaseToken",
  constraintsLength: 0,
  async validate(token: string) {
    return isString(token) && FirebaseToken.isValid(token);
  },
});

export default IsFirebaseToken;

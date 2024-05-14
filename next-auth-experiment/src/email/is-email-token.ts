import { ValidationOptions } from "class-validator";
import createValidator from "../validation/create-validator";
import EmailToken from "./email-token";

const IsEmailToken = createValidator<
  (validationOptions?: ValidationOptions) => never
>({
  name: "isEmailToken",
  constraintsLength: 0,
  async validate(token: string) {
    return EmailToken.isValid(token);
  },
});

export default IsEmailToken;

import { ValidationOptions } from "class-validator";
import Token from "./token";
import createValidator from "../validation/create-validator";

const IsAuthenticated = createValidator<
  (validationOptions?: ValidationOptions) => never
>({
  name: "isAuthenticated",
  constraintsLength: 0,
  async validate(token: string) {
    return Token.isValid(token);
  },
});

export default IsAuthenticated;

import {
  ValidationOptions,
  ValidationArguments,
  isString,
} from "class-validator";
import createValidator from "../validation/create-validator";
import EmailToken from "./email-token";

const IsCodeMatches = createValidator<
  (tokenPropertyName: string, validationOptions?: ValidationOptions) => never
>({
  name: "isCodeMatches",
  constraintsLength: 1,
  async validate(code: string, args: ValidationArguments) {
    const [tokenPropertyName] = args.constraints;
    const maybeToken = (args.object as any)[tokenPropertyName];

    if (!isString(code) || !isString(maybeToken)) {
      return false;
    }

    return EmailToken.codeMatches(code, maybeToken);
  },
});

export default IsCodeMatches;

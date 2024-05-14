import { ValidationOptions, ValidationArguments } from "class-validator";
import { Role } from "./types";
import prisma from "../prisma";
import createValidator from "../validation/create-validator";

const IsAuthorized = createValidator<
  (role: Role, validationOptions?: ValidationOptions) => never
>({
  name: "isAuthorized",
  constraintsLength: 1,
  async validate(value: any, args: ValidationArguments) {
    const [role] = args.constraints;
    const maybeUser = await prisma.user.findFirst({
      where: {
        [args.property]: value,
      },
    });

    if (maybeUser === null) {
      return false;
    } else {
      return maybeUser.role === role;
    }
  },
});

export default IsAuthorized;

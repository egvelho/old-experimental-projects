import { ValidationOptions, ValidationArguments } from "class-validator";
import prisma from "../prisma";
import createValidator from "../validation/create-validator";

const IsNotBlocked = createValidator<
  (validationOptions?: ValidationOptions) => never
>({
  name: "isNotBlocked",
  constraintsLength: 0,
  async validate(value: any, args: ValidationArguments) {
    const maybeUser = await prisma.user.findFirst({
      where: {
        [args.property]: value,
      },
    });

    if (maybeUser === null) {
      return true;
    } else {
      return !maybeUser.isBlocked;
    }
  },
});

export default IsNotBlocked;

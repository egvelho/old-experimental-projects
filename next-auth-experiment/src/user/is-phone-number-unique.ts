import { ValidationOptions } from "class-validator";
import prisma from "../prisma";
import createValidator from "../validation/create-validator";

const IsPhoneNumberUnique = createValidator<
  (validationOptions?: ValidationOptions) => never
>({
  name: "isPhoneNumberUnique",
  constraintsLength: 0,
  async validate(phoneNumber: string) {
    const maybeUser = await prisma.user.findFirst({
      where: {
        phoneNumber,
      },
    });
    return maybeUser === null;
  },
});

export default IsPhoneNumberUnique;

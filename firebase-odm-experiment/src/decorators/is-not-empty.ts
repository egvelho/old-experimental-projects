import { isNotEmpty, ValidationOptions } from "class-validator";
import createValidator from "../create-validator";

export const IsNotEmpty = createValidator<
  (validationOptions?: ValidationOptions) => never
>({
  name: "firebaseIsNotEmpty",
  constraintsLength: 0,
  validate: isNotEmpty,
  classLevel: true,
  firebaseRule(propertyName) {
    return `newData.hasChildren(['${propertyName}'])`;
  },
});

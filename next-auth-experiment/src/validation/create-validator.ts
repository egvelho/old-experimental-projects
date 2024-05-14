import {
  registerDecorator,
  ValidatorConstraintInterface,
} from "class-validator";

export default function createValidator<
  ValidationArgs extends (...args: any[]) => never
>({
  name,
  constraintsLength,
  validate,
}: {
  name: string;
  constraintsLength: number;
  validate: ValidatorConstraintInterface["validate"];
}) {
  return function (...args: Parameters<ValidationArgs>) {
    return function (object: Object, propertyName: string) {
      registerDecorator({
        name,
        target: object.constructor,
        propertyName: propertyName,
        constraints: args.slice(0, constraintsLength),
        options: args[constraintsLength],
        validator: {
          validate,
        },
      });
    };
  };
}

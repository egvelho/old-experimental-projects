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
  firebaseRule,
  classLevel = false,
}: {
  name: string;
  constraintsLength: number;
  validate: ValidatorConstraintInterface["validate"];
  firebaseRule: (validationArgs?: Parameters<ValidationArgs>) => any;
  classLevel?: boolean;
}) {
  return function (...args: Parameters<ValidationArgs>) {
    return function (object: Object, propertyName: string) {
      classLevel === false &&
        Reflect.defineMetadata(
          "keys",
          [
            ...new Set([
              ...(Reflect.getMetadata("keys", object) ?? []),
              propertyName,
            ]),
          ],
          object
        );
      Reflect.defineMetadata(
        classLevel ? "class" : propertyName,
        [
          ...(Reflect.getMetadata(
            classLevel ? "class" : propertyName,
            object
          ) ?? []),
          {
            type: "validate",
            rule: firebaseRule(
              ...([
                ...args.slice(0, constraintsLength),
                propertyName,
              ] as Parameters<ValidationArgs>)
            ),
          },
        ],
        object
      );

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

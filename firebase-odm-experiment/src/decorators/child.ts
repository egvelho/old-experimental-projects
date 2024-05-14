import {
  registerDecorator,
  ValidationOptions,
  isObject,
} from "class-validator";

export function Child(
  propertyObject: Object,
  validationOptions?: ValidationOptions
) {
  return function (object: Object, propertyName: string) {
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
      propertyName,
      [
        ...(Reflect.getMetadata(propertyName, object) ?? []),
        {
          type: "validate",
          rule: true,
        },
      ],
      object
    );
    Reflect.defineMetadata(
      "nested",
      {
        ...(Reflect.getMetadata("nested", object) ?? {}),
        [propertyName]: propertyObject,
      },
      object
    );
    (object as any)[propertyName] = new (propertyObject as any)();
    registerDecorator({
      name: "firebaseChild",
      target: object.constructor,
      propertyName: propertyName,
      constraints: [propertyObject],
      options: validationOptions,
      validator: {
        validate: isObject,
      },
    });
  };
}

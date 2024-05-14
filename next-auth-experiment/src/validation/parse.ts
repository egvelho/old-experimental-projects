import { plainToClass, ClassConstructor } from "class-transformer";
import { ValidationError, validate as classValidate } from "class-validator";
import { sanitize as classSanitize } from "class-sanitizer";

export default async function parse<
  ClassType extends Object,
  Groups extends string[] = string[]
>(
  constructor: ClassConstructor<ClassType>,
  object: ClassType,
  groups?: Groups,
): Promise<[ClassType, ValidationError[]]> {
  const instance = plainToClass(constructor, object, {
    ignoreDecorators: true,
  });
  classSanitize(instance);
  return [
    instance,
    await classValidate(instance, {
      forbidUnknownValues: true,
      dismissDefaultMessages: true,
      groups,
    }),
  ];
}

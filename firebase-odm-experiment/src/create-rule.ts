export default function createRule<
  ValidationArgs extends (...args: any[]) => never
>({
  type,
  firebaseRule,
  classLevel = false,
}: {
  type: "read" | "write" | "indexOn";
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
            type,
            rule: firebaseRule(
              ...([...args, propertyName] as Parameters<ValidationArgs>)
            ),
          },
        ],
        object
      );
    };
  };
}

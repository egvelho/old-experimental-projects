import "reflect-metadata";

export function generateSchema(object: Object) {
  const name: string = Reflect.getMetadata("name", object);

  if (!name) {
    throw new Error("Class instance is not a firebase node.");
  }

  const keys: string[] = Reflect.getMetadata("keys", object) ?? [];
  const classSchemaData: any[] = Reflect.getMetadata("class", object) ?? [];
  const nestedData: any[] = Reflect.getMetadata("nested", object) ?? {};
  const schemaData = keys.map((key) => ({
    key,
    values: Reflect.getMetadata(key, object),
  }));
  const schemaData_ = schemaData.reduce(
    (obj, { key, values }) => ({
      ...obj,
      [key]: values.reduce(
        (obj: any, { type, rule }: any) => ({
          ...obj,
          [`.${type}`]: obj[`.${type}`]
            ? `${obj[`.${type}`]} && ${rule}`
            : rule,
        }),
        {}
      ),
    }),
    {}
  );
  const classSchemaData_ = classSchemaData.reduce(
    (obj: any, { type, rule }: any) => ({
      ...obj,
      [`.${type}`]: obj[`.${type}`] ? `${obj[`.${type}`]} && ${rule}` : rule,
    }),
    {}
  );

  let schema = {
    ...schemaData_,
    ...classSchemaData_,
  };

  Object.keys(nestedData).forEach((key) => {
    const nestedObject = new (nestedData as any)[key]();
    const nestedObjectName = Reflect.getMetadata("name", nestedObject);
    const nestedObjectSchema = (generateSchema(nestedObject) as any)[
      nestedObjectName
    ];

    const validate = (() => {
      if (schema[key][".validate"] && nestedObjectSchema[".validate"]) {
        return `${schema[key][".validate"]} && ${nestedObjectSchema[".validate"]}`;
      } else if (schema[key][".validate"] && !nestedObjectSchema[".validate"]) {
        return schema[key][".validate"];
      } else if (nestedObjectSchema[".validate"] && !schema[key][".validate"]) {
        return nestedObjectSchema[".validate"];
      } else {
        return undefined;
      }
    })();
    const read = (() => {
      if (schema[key][".read"] && nestedObjectSchema[".read"]) {
        return `${schema[key][".read"]} && ${nestedObjectSchema[".read"]}`;
      } else if (schema[key][".read"] && !nestedObjectSchema[".read"]) {
        return schema[key][".read"];
      } else if (nestedObjectSchema[".read"] && !schema[key][".read"]) {
        return nestedObjectSchema[".read"];
      } else {
        return undefined;
      }
    })();
    const write = (() => {
      if (schema[key][".write"] && nestedObjectSchema[".write"]) {
        return `${schema[key][".write"]} && ${nestedObjectSchema[".write"]}`;
      } else if (schema[key][".write"] && !nestedObjectSchema[".write"]) {
        return schema[key][".write"];
      } else if (nestedObjectSchema[".write"] && !schema[key][".write"]) {
        return nestedObjectSchema[".write"];
      } else {
        return undefined;
      }
    })();

    const nestedObjectMetadata = {
      ...(validate ? { ".validate": validate } : {}),
      ...(read ? { ".read": read } : {}),
      ...(write ? { ".write": write } : {}),
    };

    schema[key] = {
      ...nestedObjectSchema,
      ...schema[key],
      ...nestedObjectMetadata,
    };

    if (key !== nestedObjectName) {
      throw new Error("Property name must have the same key as firebase node.");
    }
  });

  return { [name]: schema };
}

import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import { ClassConstructor, plainToClass } from "class-transformer";
import { validate, ValidationError } from "class-validator";

export type MaybeOutput<Output> = {
  output: Output | undefined;
  errors: ValidationError[];
};

export type ClientConfig = {
  token?: string;
  validateOnly?: boolean;
  baseURL?: string;
} & AxiosRequestConfig;

export type Client<Input, Output> = (
  input: Input,
  config?: ClientConfig
) => Promise<AxiosResponse<Output>>;

export async function client<Input, Output>(
  input: Input,
  config: ClientConfig = {}
): Promise<AxiosResponse<Output>> {
  const data = ["POST", "PUT", "PATCH"].includes(config.method ?? "")
    ? input
    : undefined;

  const paramsWithoutToken = ["GET", "DELETE"].includes(config.method ?? "")
    ? input
    : undefined;

  const tokenParam =
    config.token ??
    // @ts-ignore
    (typeof window !== "undefined" && (window.token as string))
      ? {
          auth:
            config.token ??
            // @ts-ignore
            (typeof window !== "undefined" &&
              // @ts-ignore
              (window.token as string | undefined)),
        }
      : undefined;

  const params = paramsWithoutToken
    ? { ...paramsWithoutToken, ...tokenParam }
    : tokenParam;

  const response = await axios.request<Output>({
    headers: {
      "Content-Type": "application/json",
    },
    baseURL: config.baseURL,
    validateStatus,
    url: config.url,
    data,
    params,
    ...config,
  });

  return response;
}

export async function validatedClient<Input, Output>(
  input: Input,
  classInput: ClassConstructor<Input>,
  config: ClientConfig = {}
) {
  const client_ = enforceInput<Input, Output>(classInput, client);
  return await client_(input, config);
}

function validateStatus(status: number): boolean {
  if (status >= 500) {
    return false;
  } else {
    return true;
  }
}

function enforceInput<Input extends Object, Output>(
  class_: ClassConstructor<Input>,
  client_: Client<Input, Output>
): Client<Input, Output | MaybeOutput<undefined>> {
  return async (input, config) => {
    const input_: Input = plainToClass(
      Object.getPrototypeOf(class_).constructor,
      input,
      {
        ignoreDecorators: true,
      }
    );

    const errors = await validate(input_, {
      whitelist: true,
      skipMissingProperties: true,
    });

    if (errors.length > 0 || config?.validateOnly) {
      process.env.NODE_ENV === "development" &&
        console.log((input_ as any).constructor.name, errors);
      return {
        data: { output: undefined, errors },
        config: config as any,
        status: 200,
        statusText: "OK",
        headers: undefined,
        request: undefined,
      };
    } else {
      return client_(input, config);
    }
  };
}

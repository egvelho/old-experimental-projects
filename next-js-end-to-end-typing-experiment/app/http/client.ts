import axios, { AxiosRequestConfig, AxiosResponse } from "axios";
import { ClassType } from "class-transformer/ClassTransformer";
import { plainToClass } from "class-transformer";
import { validate } from "class-validator";
import { get as getCookie, remove as removeCookie } from "js-cookie";
import { getNamespace } from "cls-hooked";
import appConfig from "@app/config";
import typeson from "./typeson";
import { MaybeOutput } from "./types";

export type ClientConfig = {
    token?: string;
    validateOnly?: boolean;
} & AxiosRequestConfig;

export type Client<Input, Output> = (
    input: Input,
    config?: ClientConfig,
) => Promise<AxiosResponse<Output>>;

export default async function client<Input, Output>(
    input: Input,
    config: ClientConfig = {},
): Promise<AxiosResponse<Output>> {
    const contextNamespace =
        typeof window === "undefined" ? getNamespace("context") : undefined;

    const url = config.url
        ?.split("/")
        .map((path) => path.match(/\[([^\)]+)\]/))
        .filter((path) => path)
        .reduce((stack, path) => {
            const path_ = (path ?? [])[0];
            const key = (path ?? [])[1];

            input && delete (input as any)[path_];
            return stack.replace(path_, ((input as any) ?? {})[key] ?? "");
        }, config.url);

    const token =
        config.token ?? typeof window === "undefined"
            ? contextNamespace?.get("token")
            : getCookie("token");

    const baseURL =
        typeof window === "undefined"
            ? `http://localhost:${appConfig().port}`
            : undefined;

    const input_: Input = typeson.encapsulate(input);

    const data = ["POST", "PUT", "PATCH"].includes(config.method ?? "")
        ? input_
        : undefined;

    const params = ["GET", "DELETE"].includes(config.method ?? "")
        ? input
        : undefined;

    const response = await axios.request<Output>({
        headers: {
            "Content-Type": "application/json",
            Authorization: token ? `Bearer ${token}` : "",
        },
        baseURL,
        validateStatus,
        url,
        data,
        params,
        ...config,
    });

    if (typeof window !== "undefined" && response.status === 401) {
        removeCookie("token");
        window.location.href = "/";
    }

    response.data = typeson.revive(response.data);

    return response;
}

client.enforceInput = async <Input, Output>(
    input: Input,
    classInput: ClassType<Input>,
    config: ClientConfig = {},
) => {
    const client_ = enforceInput<Input, Output>(classInput, client);
    return await client_(input, config);
};

client.enforceOutput = async <Input, Output>(
    input: Input,
    classOutput: ClassType<Output>,
    config: ClientConfig = {},
) => {
    const client_ = enforceOutput<Input, Output>(classOutput, client);
    return await client_(input, config);
};

client.enforceIO = async <Input, Output>(
    input: Input,
    classInput: ClassType<Input>,
    classOutput: ClassType<Output>,
    config: ClientConfig = {},
) => {
    const client_ = enforceIO<Input, Output>(classInput, classOutput, client);
    return await client_(input, config);
};

function validateStatus(status: number): boolean {
    if (status >= 500) {
        return false;
    } else {
        return true;
    }
}

export function enforceInput<Input, Output>(
    class_: ClassType<Input>,
    client_: Client<Input, Output>,
): Client<Input, Output | MaybeOutput<undefined>> {
    return async (input, config) => {
        const input_ = plainToClass(class_, input, {
            ignoreDecorators: true,
        });

        const errors = await validate(input_, {
            whitelist: true,
            skipMissingProperties: true,
        });

        if (errors.length > 0 || config?.validateOnly) {
            appConfig().nodeEnv === "development" &&
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

export function enforceOutput<Input, Output>(
    class_: ClassType<Output>,
    client_: Client<Input, Output>,
): Client<Input, Output> {
    return async (input, config) => {
        const output_ = await client_(input, config);
        output_.data = plainToClass(class_, output_.data, {
            ignoreDecorators: true,
        });
        return output_;
    };
}

export function enforceIO<Input, Output>(
    inputClass: ClassType<Input>,
    outputClass: ClassType<Output>,
    client_: Client<Input, Output>,
): Client<Input, Output | MaybeOutput<undefined>> {
    const enforceInput_ = enforceInput(inputClass, client_);
    const enforceOutput_ = enforceOutput(outputClass, enforceInput_);

    return enforceOutput_;
}

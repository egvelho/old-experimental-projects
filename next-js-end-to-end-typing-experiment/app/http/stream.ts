import { ClassType } from "class-transformer/ClassTransformer";
import { validate } from "class-validator";
import { plainToClass } from "class-transformer";
import { MaybeOutput } from "./types";
import typeson from "./typeson";

export type StreamMessage<Input, Output> = (output: Output) => Promise<boolean>;

export type Stream<Input, Output> = (
    input: Input,
    onMessage: StreamMessage<Input, Output>,
    url?: string,
) => Promise<undefined>;

export default async function stream<Input, Output>(
    input: Input,
    onMessage: StreamMessage<Input, Output>,
    url?: string,
): Promise<undefined> {
    if (typeof window === "undefined" || !url) {
        return undefined;
    }

    const url_ = url
        ?.split("/")
        .map((path) => path.match(/\[([^\)]+)\]/))
        .filter((path) => path)
        .reduce((stack, path) => {
            const path_ = (path ?? [])[0];
            const key = (path ?? [])[1];

            input && delete (input as any)[path_];
            return stack.replace(path_, ((input as any) ?? {})[key] ?? "");
        }, url);

    const eventSource = new EventSource(url);
    eventSource.addEventListener("message", async (event) => {
        const output = JSON.parse(event.data);
        const [output_, run]: [Output, boolean] = typeson.revive(output);
        const run_ = (await onMessage(output_)) && run;
        !run_ && eventSource.close();
    });

    return undefined;
}

stream.enforceInput = async <Input, Output>(
    input: Input,
    classInput: ClassType<Input>,
    onMessage: StreamMessage<Input, Output | MaybeOutput<undefined>>,
    url?: string,
) => {
    const stream_ = enforceInput<Input, Output>(classInput, stream);
    return await stream_(input, onMessage, url);
};

stream.enforceOutput = async <Input, Output>(
    input: Input,
    classOutput: ClassType<Output>,
    onMessage: StreamMessage<Input, Output>,
    url?: string,
) => {
    const stream_ = enforceOutput<Input, Output>(classOutput, stream);
    return await stream_(input, onMessage, url);
};

stream.enforceIO = async <Input, Output>(
    input: Input,
    classInput: ClassType<Input>,
    classOutput: ClassType<Output>,
    onMessage: StreamMessage<Input, Output | MaybeOutput<undefined>>,
    url?: string,
) => {
    const stream_ = enforceIO<Input, Output>(classInput, classOutput, stream);
    return await stream_(input, onMessage, url);
};

export function enforceInput<Input, Output>(
    class_: ClassType<Input>,
    stream_: Stream<Input, Output>,
): Stream<Input, Output | MaybeOutput<undefined>> {
    return async (input, onMessage, config) => {
        const input_ = plainToClass(class_, input);
        const errors = await validate(input_, { whitelist: true });

        if (errors.length > 0) {
            onMessage({ output: undefined, errors });
            return undefined;
        } else {
            return stream_(input, onMessage, config);
        }
    };
}

export function enforceOutput<Input, Output>(
    class_: ClassType<Output>,
    stream_: Stream<Input, Output>,
): Stream<Input, Output> {
    return async (input, onMessage, config) => {
        return stream_(
            input,
            (output) => onMessage(plainToClass(class_, output)),
            config,
        );
    };
}

export function enforceIO<Input, Output>(
    inputClass: ClassType<Input>,
    outputClass: ClassType<Output>,
    stream_: Stream<Input, Output>,
): Stream<Input, Output | MaybeOutput<undefined>> {
    const enforceInput_ = enforceInput(inputClass, stream_);
    const enforceOutput_ = enforceOutput(outputClass, enforceInput_);

    return enforceOutput_;
}

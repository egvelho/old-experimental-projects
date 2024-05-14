import { ClassType } from "class-transformer/ClassTransformer";
import { validate as validate_ } from "class-validator";
import { plainToClass, classToPlain } from "class-transformer";
import { sanitize } from "class-sanitizer";
import { Method, MaybeOutput } from "../types";

export interface Validation<Input, Output> {
    inputType: ClassType<Input>;
    method: Method<Input, Output>;
    groups?: string[];
}

export default function validate<Input, Output>({
    inputType,
    method,
    groups,
}: Validation<Input, Output>): Method<Input, MaybeOutput<Output>> {
    return async (input, req, res) => {
        const input_ = plainToClass(inputType, input, {
            ignoreDecorators: true,
        });
        const errors = await validate_(input_, {
            whitelist: true,
            groups,
        });

        if (errors.length > 0) {
            return { output: undefined, errors };
        } else {
            sanitize(input_);
            return {
                output: classToPlain(await method(input_, req, res), {
                    groups,
                }) as Output,
                errors,
            };
        }
    };
}

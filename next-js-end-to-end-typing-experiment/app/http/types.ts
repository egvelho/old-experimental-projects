import { NextApiRequest, NextApiResponse } from "next";
import { ValidationError } from "class-validator";

export type Method<Input, Output> = (
    input: Input,
    req: NextApiRequest,
    res: NextApiResponse,
) => Promise<Output>;

export type MaybeOutput<Output> = {
    output: Output | undefined;
    errors: ValidationError[];
};

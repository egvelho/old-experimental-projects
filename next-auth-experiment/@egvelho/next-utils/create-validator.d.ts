import { ValidatorConstraintInterface } from "class-validator";
export declare function createValidator<ValidationArgs extends (...args: any[]) => never>({ name, constraintsLength, validate, }: {
    name: string;
    constraintsLength: number;
    validate: ValidatorConstraintInterface["validate"];
}): (...args: Parameters<ValidationArgs>) => (object: Object, propertyName: string) => void;

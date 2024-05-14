import { Dispatch } from "react";
import { ClassConstructor } from "class-transformer";
import { ValidationError } from "class-validator";
export declare type FormState<T> = {
    [key in keyof T]: {
        value: T[key];
        errors: string[];
        focus: boolean;
        touched: boolean;
    };
};
export declare type UseForm<T> = {
    state: T;
    form: FormState<T>;
    reset: () => Promise<FormState<T>>;
    setFormErrors: (errors?: ValidationError[]) => Promise<FormState<T>>;
    setFormState: Dispatch<Partial<T>>;
    setFormFocus: (key: keyof T) => void;
    setFormBlur: (key: keyof T) => void;
};
export declare function useForm<T extends Object>(classConstructor: ClassConstructor<T>, initialState: T): UseForm<T>;

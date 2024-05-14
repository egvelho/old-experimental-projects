import { useState, useEffect, Dispatch } from "react";
import { AxiosResponse } from "axios";
import { MaybeOutput } from "./types";
import { Client, ClientConfig } from "./client";

type ValueState<Input> = {
    [key in keyof Input]: {
        value: Input[key];
        errors: string[];
        focus: boolean;
        touched: boolean;
    };
};

export type UseForm<Input, Output> = {
    loading: boolean;
    data: Input;
    form: ValueState<Input>;
    submitForm: (
        input?: Partial<Input>,
        config?: ClientConfig,
    ) => Promise<AxiosResponse<Output>>;
    setForm: Dispatch<Partial<Input>>;
    setFormFocus: (key: keyof Input) => void;
    setFormBlur: (key: keyof Input) => void;
};

async function mapValues<Input, Output>(
    input: Input,
    values: ValueState<Input>,
    client: Client<Input, Output | MaybeOutput<undefined>>,
    computedResults?: AxiosResponse<Output | MaybeOutput<undefined>>,
): Promise<ValueState<Input>> {
    const results =
        computedResults ?? (await client(input, { validateOnly: true }));

    if (
        typeof results.data === "object" &&
        typeof (results.data as MaybeOutput<undefined>).output ===
            "undefined" &&
        Array.isArray((results.data as MaybeOutput<undefined>).errors) &&
        (results.data as MaybeOutput<undefined>).errors.filter(
            (data) =>
                typeof (data ?? {})?.property === "string" &&
                typeof (data ?? {})?.constraints === "object",
        )?.length === (results.data as MaybeOutput<undefined>).errors.length
    ) {
        const errors = (results.data as MaybeOutput<undefined>).errors;
        const errors_ = errors.reduce(
            (stack, { property, constraints }) => ({
                ...stack,
                [property]: Object.values(constraints),
            }),
            {} as Partial<{ [key in keyof Input]: string[] }>,
        );
        return Object.keys(input).reduce((stack, key) => {
            return {
                ...stack,
                [key]: {
                    ...values[key as keyof Input],
                    value: input[key as keyof Input],
                    errors: errors_[key as keyof Input] ?? [],
                },
            };
        }, {} as ValueState<Input>);
    } else {
        return Object.keys(input).reduce((stack, key) => {
            return {
                ...stack,
                [key]: {
                    ...values[key as keyof Input],
                    value: input[key as keyof Input],
                    errors: [],
                },
            };
        }, {} as ValueState<Input>);
    }
}

function getInitialValues<Input>(input: Input) {
    return Object.keys(input).reduce((stack, key) => {
        return {
            ...stack,
            [key]: {
                value: input[key as keyof Input],
                focus: false,
                touched: false,
                errors: [],
            },
        };
    }, {} as ValueState<Input>);
}

export default function useForm<Input, Output>(
    client: Client<Input, Output>,
    initialState: Input,
): UseForm<Input, Output> {
    const [loading, setLoading] = useState(false);
    const [state, setState] = useState(initialState);
    const [values, setValues] = useState(getInitialValues(initialState));

    useEffect(() => {
        mapValues(state, values, client).then(setValues);
    }, []);

    useEffect(() => {
        mapValues(state, values, client).then(setValues);
    }, [state]);

    return {
        loading,
        data: state,
        form: values,
        async submitForm(customInput = {}, config = {}) {
            setLoading(true);

            const touchedValues = Object.keys(values).reduce(
                (stack, key) => ({
                    ...stack,
                    [key]: { ...values[key as keyof Input], touched: true },
                }),
                {} as ValueState<Input>,
            );

            const response = await client({ ...state, ...customInput }, config);
            mapValues(state, touchedValues, client, response).then(setValues);
            setLoading(false);

            return response;
        },
        setForm: (nextState) => setState({ ...state, ...nextState }),
        setFormFocus: (key) =>
            setValues({ ...values, [key]: { ...values[key], focus: true } }),
        setFormBlur: (key) =>
            setValues({
                ...values,
                [key]: { ...values[key], focus: false, touched: true },
            }),
    };
}

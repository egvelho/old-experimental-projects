import { useState, useEffect, Dispatch } from "react";
import { plainToClass, ClassConstructor } from "class-transformer";
import { validate, ValidationError } from "class-validator";

export type FormState<T> = {
  [key in keyof T]: {
    value: T[key];
    errors: string[];
    focus: boolean;
    touched: boolean;
  };
};

export type UseForm<T> = {
  state: T;
  form: FormState<T>;
  reset: () => Promise<FormState<T>>;
  setFormErrors: (errors?: ValidationError[]) => Promise<FormState<T>>;
  setFormState: Dispatch<Partial<T>>;
  setFormFocus: (key: keyof T) => void;
  setFormBlur: (key: keyof T) => void;
};

async function mapStateToForm<T extends Object>(
  state: T,
  values: FormState<T>,
  classConstructor: ClassConstructor<T>,
  errors?: ValidationError[],
): Promise<FormState<T>> {
  if (errors === undefined) {
    errors = await validate(plainToClass(classConstructor, state));
  }
  const errors_ = errors.reduce(
    (stack, { property, constraints }) => ({
      ...stack,
      [property]: Object.values(constraints ?? {}),
    }),
    {} as Partial<{ [key in keyof T]: string[] }>,
  );
  return Object.keys(state).reduce((stack, key) => {
    return {
      ...stack,
      [key]: {
        ...values[key as keyof T],
        value: state[key as keyof T],
        errors: errors_[key as keyof T] ?? [],
      },
    };
  }, {} as FormState<T>);
}

function getInitialForm<T>(state: T) {
  return Object.keys(state).reduce((stack, key) => {
    return {
      ...stack,
      [key]: {
        value: state[key as keyof T],
        focus: false,
        touched: false,
        errors: [],
      },
    };
  }, {} as FormState<T>);
}

export default function useForm<T extends Object>(
  classConstructor: ClassConstructor<T>,
  initialState: T,
): UseForm<T> {
  const [state, setState] = useState(initialState);
  const [form, setForm] = useState(getInitialForm(initialState));
  const [resetFlag, setResetFlag] = useState(false);

  useEffect(() => {
    mapStateToForm(state, form, classConstructor).then(setForm);
  }, []);

  useEffect(() => {
    if (resetFlag === true) {
      setResetFlag(false);
    } else {
      mapStateToForm(state, form, classConstructor).then(setForm);
    }
  }, [state]);

  return {
    state,
    form,
    async reset() {
      const initialForm = Object.keys(form).reduce(
        (stack, key) => ({
          ...stack,
          [key]: {
            touched: false,
            focus: false,
            value: initialState[key as keyof T],
            errors: [],
          },
        }),
        {} as FormState<T>,
      );

      const nextForm = await mapStateToForm(
        initialState,
        initialForm,
        classConstructor,
        [],
      );

      setResetFlag(true);
      setState(initialState);
      setForm(nextForm);
      return nextForm;
    },
    async setFormErrors(errors) {
      const touchedValues = Object.keys(form).reduce(
        (stack, key) => ({
          ...stack,
          [key]: { ...form[key as keyof T], touched: true },
        }),
        {} as FormState<T>,
      );

      const values = await mapStateToForm(
        state,
        touchedValues,
        classConstructor,
        errors,
      );
      setForm(values);
      return values;
    },
    setFormState: (nextState) => setState({ ...state, ...nextState }),
    setFormFocus: (key) =>
      setForm({ ...form, [key]: { ...form[key], focus: true } }),
    setFormBlur: (key) =>
      setForm({
        ...form,
        [key]: { ...form[key], focus: false, touched: true },
      }),
  };
}

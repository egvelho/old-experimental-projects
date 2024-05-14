import React from "react";
import { FormInput } from "./types";
export interface ContactFormProps {
    onSubmit: (form: ContactForm) => Promise<void>;
    form: ContactForm;
    submitButtonLabel: string;
    loading: boolean;
    background: string;
    backgroundIsDark?: boolean;
    title: React.ReactNode;
    titleColor: string;
}
export declare function ContactForm({ onSubmit, form, submitButtonLabel, loading, title, titleColor, backgroundIsDark, background, }: ContactFormProps): JSX.Element;
interface ContactForm {
    name: FormInput<string>;
    email: FormInput<string>;
    phoneNumber: FormInput<string>;
    message: FormInput<string>;
}
export {};

declare function send({ to, subject, markdown, }: {
    to: string;
    subject: string;
    markdown: string;
}): Promise<boolean>;
export declare class Mail {
    static send: typeof send;
}
export {};

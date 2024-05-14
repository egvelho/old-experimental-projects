import { auth, messaging } from "firebase-admin";
export declare type Message<Data extends messaging.Message["data"]> = {
    title: string;
    body: string;
    imageUrl: string;
    data: Data;
};
declare function isValid(token?: string): Promise<boolean>;
declare function decode(token?: string): Promise<auth.DecodedIdToken | undefined>;
declare function send<Data extends messaging.Message["data"]>(token: string, { title, body, imageUrl, data }: Message<Data>): Promise<void>;
declare function sendToMany<Data extends messaging.Message["data"]>(tokens: string[], { title, body, imageUrl, data }: Message<Data>): Promise<void>;
export declare class FirebaseToken {
    static isValid: typeof isValid;
    static decode: typeof decode;
}
export declare class FirebaseNotification {
    static send: typeof send;
    static sendToMany: typeof sendToMany;
}
export {};

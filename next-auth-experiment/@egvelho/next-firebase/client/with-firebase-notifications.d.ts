export interface Message {
    data: unknown;
    notification: {
        title: string;
        body: string;
        tag: string;
        image?: string;
    };
}
interface Props {
    onMessage?: (message: Message) => Promise<void>;
    onTokenRefresh?: (token: string) => Promise<void>;
    beforeRequestPermission?: () => Promise<void>;
}
export declare function WithFirebaseNotifications(props: Props): null;
export {};

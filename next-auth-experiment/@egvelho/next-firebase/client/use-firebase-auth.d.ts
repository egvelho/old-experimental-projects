export declare type UseFirebaseAuth = {
    loading: boolean;
    requestCode: (phoneNumber: string) => Promise<boolean>;
    verifyCode: (code: string) => Promise<string | undefined>;
};
export declare function useFirebaseAuth(): UseFirebaseAuth;

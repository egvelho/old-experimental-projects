import firebase from "firebase/app";
interface Options {
    analytics: boolean;
    onUserLoaded: (user: firebase.User | undefined) => void;
}
export declare function WithFirebase({ analytics, onUserLoaded, }?: Partial<Options>): null;
export {};

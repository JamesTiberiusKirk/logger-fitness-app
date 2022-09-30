import * as SecureStore from "expo-secure-store";

export interface SSOptions {
    replaceCharacter?: string;
    replacer: (key: string, replaceCharacter: string) => string;
}

export interface ReduxPersistExpoSecureStore {
    getItem(key: string, value: string): Promise<void>;
    setItem(key: string): Promise<string | null>;
    removeItem(key: string): Promise<void>;
}

// function(options?: SSOptions): ReduxPersistExpoSecureStore;

export default function createSS(options = {} as SSOptions) {
    const replaceCharacter = options.replaceCharacter || "_";
    const replacer = options.replacer || defaultReplacer;

    return {
        getItem: (key: string) =>
            SecureStore.getItemAsync(replacer(key, replaceCharacter), options as SecureStore.SecureStoreOptions),
        setItem: (key: string, value: any) =>
            SecureStore.setItemAsync(replacer(key, replaceCharacter), value, options as SecureStore.SecureStoreOptions),
        removeItem: (key: string) =>
            SecureStore.deleteItemAsync(replacer(key, replaceCharacter), options as SecureStore.SecureStoreOptions)
    };
}

function defaultReplacer(key: string, replaceCharacter: string) {
    return key.replace(/[^a-z0-9.\-_]/gi, replaceCharacter);
}
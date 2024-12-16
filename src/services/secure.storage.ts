// import AsyncStorage from "@react-native-async-storage/async-storage";
import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";
export class SecureStorage {
    private static readonly isDesktop = Platform.OS === "web";

    /**
     * 
     * @param key - The key to store the value under
     */
    static getItemAsync = (key: string) => {
        return new Promise<string | null>((resolve) => {
            // if (this.isDesktop) return AsyncStorage.getItem(key).then(resolve);
            SecureStore.getItemAsync(key).then(resolve);
        });
    }

    /**
     * 
     * @param key - The key to store the value under
     * @param value - The value to store
     */
    static setItemAsync = (key: string, value: string) => {
        return new Promise<void>((resolve) => {
            // if (this.isDesktop) return AsyncStorage.setItem(key, value).then(resolve);
            SecureStore.setItemAsync(key, value).then(resolve);
        });
    }

    /**
     * 
     * @param key - The key to store the value under
     */
    static deleteItemAsync = (key: string) => {
        return new Promise<void>((resolve) => {
            // if (this.isDesktop) return AsyncStorage.removeItem(key).then(resolve);
            SecureStore.deleteItemAsync(key).then(resolve);
        });
    }
}
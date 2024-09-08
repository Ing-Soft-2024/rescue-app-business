import { AppleAuth } from "@/auth/AppleAuth";
import { CredentialsAuth } from "@/auth/CredentialsAuth";
import { GoogleAuth } from "@/auth/GoogleAuth";

export const authMethods = {
    "Credentials": CredentialsAuth,
    "Google": GoogleAuth,
    "Apple": AppleAuth,
    // "Facebook": "facebook",
} as const;
export type AuthMethods = keyof typeof authMethods;

export const isValidAuthMethod = (method: any): method is AuthMethods => Object.keys(authMethods).includes(method);
export const isCredentialsAuth = (method: any): method is "Credentials" => method === "Credentials";
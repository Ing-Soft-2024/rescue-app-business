import { AuthMethods } from "../services/auth";
import { User } from "./user.type";

export type Session = {
    user: User;
    token: string;
    isGuest?: boolean;

    /**
     * Unix timestamp in milliseconds
     */
    expiresAt: number;
    method: AuthMethods;
}

type SignInWithCredentials = (method: "Credentials", opts: { email: string, password: string }) => Promise<Session>;
type SignInWithSSO = (method: Exclude<AuthMethods, "Credentials">) => Promise<Session>;

type SignInWithType =
    SignInWithSSO
    & SignInWithCredentials;

export type SessionContextType = {
    session?: Session;

    signInWith: SignInWithType;
    signOut: () => void;
}
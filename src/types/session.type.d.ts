import { AuthMethods } from "../services/auth";

export type Session = {

}

type SignInWithCredentials = (method: "Credentials", opts: { email: string, password: string }) => Promise<void>;
type SignInWithSSO = (method: Exclude<AuthMethods, "Credentials">) => Promise<void>;

type SignInWithType =
    SignInWithSSO
    & SignInWithCredentials;

export type SessionContextType = {
    loggedIn: boolean;
    session: Session;

    signInWith: SignInWithType;
    signOut: () => void;
}
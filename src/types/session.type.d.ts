export enum SignInMethods {
    GoogleSignIn,
    FacebookSignIn,
    AppleSignIn,
    Credentials,
}

export type Session = {

}

export type SessionContextType = {
    loggedIn: boolean;
    session: Session;

    loginWith: (method: SignInMethods) => Function;
    logout: () => Function;
}
import { authMethods, isValidAuthMethod } from "@/auth/index";
import { Session, SessionContextType } from "@/src/types/session.type";
import React from "react";

const SessionContext = React.createContext<SessionContextType | undefined>(undefined);
export const useSession = () => {
    const context = React.useContext(SessionContext);
    if (context === undefined) {
        throw new Error("useSession must be used within a SessionProvider");
    }
    return context;
}

export const SessionProvider = ({ children }: { children: React.ReactNode }) => {
    const [loggedIn, setLoggedIn] = React.useState<boolean>(false);
    const [session, setSession] = React.useState<Session>({});

    return (
        <SessionContext.Provider value={{
            loggedIn,
            session,
            signInWith: async (method, opt?) => {
                if (!isValidAuthMethod(method)) throw Error("Invalid sign in method");

                authMethods[method].signIn(opt)
                    .then((session) => {
                        setLoggedIn(true);
                        setSession(session);
                    })
                    .catch((error) => {
                        console.error(error);
                    });
            },
            signOut: () => {

            },
        }} >
            {children}
        </SessionContext.Provider>
    );
};
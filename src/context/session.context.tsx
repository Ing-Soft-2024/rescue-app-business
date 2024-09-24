import { authMethods, isValidAuthMethod } from "@/auth/index";
import { Session, SessionContextType } from "@/src/types/session.type";
import { useRouter } from "expo-router";
import * as SecureStoreOptions from "expo-secure-store";
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
    const router = useRouter();

    const [session, setSession] = React.useState<Session>();

    // Load session from secure store
    const getSessionFromSecureStore = async () => {
        const session = await SecureStoreOptions.getItemAsync("session");
        if (!session) return undefined;
        return JSON.parse(session);
    }

    const refreshSession = (session?: Session) => {
        if (!session || session.expiresAt > Date.now()) return;

        authMethods[session.method].refreshSession(session)
            .then(setSession)
            .catch(console.error);
    }

    React.useEffect(() => {
        getSessionFromSecureStore().then(setSession);

        const interval = setInterval(() => refreshSession(session), 1000 * 60);
        return () => {
            clearInterval(interval);
        }
    }, []);

    React.useEffect(() => {
        if (!session) return router.replace("/signin");
        router.replace("/(app)/");
    }, [session])

    return (
        <SessionContext.Provider value={{
            session,
            signInWith: async (method, opt?) => {
                if (!isValidAuthMethod(method)) throw Error("Invalid sign in method");

                authMethods[method].signIn(opt)
                    .then((session) => {
                        if (!session) return;
                        setSession(session);

                        // Save session to secure store, persisting the session
                        SecureStoreOptions
                            .setItem("session", JSON.stringify(session));
                    })
                    .catch((error) => {
                        console.error(error);
                    });
            },
            signOut: () => {
                if (!session) return;
                // if (!isValidAuthMethod(session.method)) throw Error("Invalid sign out method");
                authMethods["Google"].signOut()
                    .then(() => {
                        setSession(undefined);

                        // Remove session from secure store
                        SecureStoreOptions
                            .deleteItemAsync("session");
                    })
                    .catch((error) => {
                        console.error(error);
                    });
            },
        }} >
            {children}
        </SessionContext.Provider>
    );
};
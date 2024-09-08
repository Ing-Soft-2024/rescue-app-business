import React from "react";
import { Session, SessionContextType } from "../types/session.type";

const SessionContext = React.createContext<SessionContextType | undefined>(undefined);
export const useSession = () => {
    const context = React.useContext(SessionContext);
    if (context === undefined) {
        throw new Error("useSession must be used within a SessionProvider");
    }
    return context;
}

export const SessionProvider = ({ children }: { children: React.ReactNode }) => {
    const [loggedIn, setLoggedIn] = React.useState<boolean>(true);
    const [session, setSession] = React.useState<Session>({});

    return (
        <SessionContext.Provider value={{
            loggedIn,
            session,
            loginWith: (method) => {
                console.log(method);
                return () => { };
            },
            logout: () => {
                return () => { };
            },
        }} >
            {children}
        </SessionContext.Provider>
    );
};
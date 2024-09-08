import React from "react";
import { SessionType } from "../types/session.type";

const SessionContext = React.createContext<SessionType | undefined>(undefined);
const useSession = () => {
    const context = React.useContext(SessionContext);
    if (context === undefined) {
        throw new Error("useSession must be used within a SessionProvider");
    }
    return context;
}

export const SessionProvider = ({ children }: { children: React.ReactNode }) => {
    const [session, setSession] = React.useState<SessionType>({});

    return (
        <SessionContext.Provider value={session} >
            {children}
        </SessionContext.Provider>
    );
};
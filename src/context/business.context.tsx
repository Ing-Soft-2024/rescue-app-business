import React, { useState } from "react";
import { useClientFetch } from "../hooks/fetch.hook";
import { userBusinessConsumer } from "../services/client";
import { Business } from "../types/business.type";
import { useSession } from "./session.context";

type BusinessContextType = {
    business: Business | undefined,
    setBusiness: (business: Business) => void
}

export const BusinessContext = React.createContext<BusinessContextType | undefined>(undefined);
export const useBusiness = () => {
    const context = React.useContext(BusinessContext);
    if (context === undefined) throw new Error("useBusiness must be used within a BusinessProvider");
    return context;
}

export const BusinessProvider = ({ children }: { children: React.ReactNode }) => {
    const { session } = useSession();
    const [businessState, setBusinessState] = useState<Business | undefined>(undefined);
    
    const { data: business } = useClientFetch({
        consumer: userBusinessConsumer,
        method: 'GET',
        options: {
            queryParams: {
                userId: session?.user.id
            }
        }
    })

    React.useEffect(() => {
        if (business) {
            setBusinessState(business);
        }
    }, [business]);

    return (
        <BusinessContext.Provider value={{
            business: businessState,
            setBusiness: setBusinessState
        }} >
            {children}
        </BusinessContext.Provider>
    );
};
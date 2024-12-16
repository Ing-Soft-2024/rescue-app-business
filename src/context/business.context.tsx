import { useFocusEffect } from "expo-router";
import React from "react";
import { getMyBusiness } from "../services/commerce/commerce";
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
    const [business, setBusiness] = React.useState<Business>();
    const { session } = useSession();
    
    useFocusEffect(React.useCallback(() => {
        if (!session?.user.id) return;
        getMyBusiness(session?.user.id).then(setBusiness).catch(console.error);
        return () => {
            setBusiness(undefined);
        }
    }, [session]));
    // React.useEffect(() => {
    //     getMyBusiness(1).then(setBusiness);
    // }, []);

    return (
        <BusinessContext.Provider value={{
            business,
            setBusiness
        }} >
            {children}
        </BusinessContext.Provider>
    );
};
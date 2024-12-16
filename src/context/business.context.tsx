import React from "react";
import { getMyBusiness } from "../services/commerce/commerce";
import { Business } from "../types/business.type";

type BusinessContextType = {
    business: Business | undefined,
    setBusiness: (business: Business) => void
}

export const BusinessContext = React.createContext<BusinessContextType | undefined>(undefined);
export const useBusiness = () => {
    const context = React.useContext(BusinessContext);
    if (context === undefined) {
        throw new Error("useBusiness must be used within a BusinessProvider");
    }
    return context;
}

export const BusinessProvider = ({ children }: { children: React.ReactNode }) => {
    const [business, setBusiness] = React.useState<Business>();
    
    React.useEffect(() => {
        getMyBusiness(1).then(setBusiness);
    }, []);

    return (
        <BusinessContext.Provider value={{
            business,
            setBusiness
        }} >
            {children}
        </BusinessContext.Provider>
    );
};
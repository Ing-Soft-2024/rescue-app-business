import { authMethods, isValidAuthMethod } from "@/auth/index";
import { Session, SessionContextType } from "@/src/types/session.type";
import { useRouter } from "expo-router";
import * as SecureStore from "expo-secure-store";
import React from "react";
import { userBusinessConsumer } from "../services/client";

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
    const [hasCheckedBusiness, setHasCheckedBusiness] = React.useState(false);

    // Check if user has a business
    const checkBusiness = async (userId: number) => {
        try {
            const business = await userBusinessConsumer.consume('GET', {
                queryParams: { userId }
            });
            setHasCheckedBusiness(true);
            return !!business;
        } catch (error) {
            //console.error('Error checking business:', error);
            return false;
        }
    };

    // Load session and check business status
    React.useEffect(() => {
        const loadSession = async () => {
            const savedSession = await SecureStore.getItemAsync("session");
            if (savedSession) {
                const parsedSession = JSON.parse(savedSession);
                setSession(parsedSession);
                await checkBusiness(parsedSession.user.id);
            } else {
                setHasCheckedBusiness(true);
            }
        };
        loadSession();
    }, []);

    // Handle navigation based on session and business status
    React.useEffect(() => {
        if (!hasCheckedBusiness) return;

        if (!session) {
            router.replace("/signin");
        } else {
            checkBusiness(session.user.id).then(hasBusiness => {
                if (!hasBusiness) {
                    router.replace("/create_commerce");
                } else {
                    router.replace("/(app)");
                }
            });
        }
    }, [session, hasCheckedBusiness]);

    return (
        <SessionContext.Provider value={{
            session,
            signInWith: async (method, opt?) => {
                if (!isValidAuthMethod(method)) throw Error("Invalid sign in method");
                return new Promise((resolve, reject) => {
                    authMethods[method].signIn(opt)
                        .then((session) => {
                            if (!session) return;
                            setSession(session);
                            SecureStore.setItemAsync("session", JSON.stringify(session));
                            resolve(session);
                        })
                        .catch((error) => {
                            console.error(error);
                            reject(error);
                        });
                });
            },
            signOut: () => {
                if (!session) return;
                authMethods["Credentials"].signOut()
                    .then(() => {
                        setSession(undefined);
                        SecureStore.deleteItemAsync("session");
                        router.replace("/signin");
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
import { Session } from "@/src/types/session.type";

export class AppleAuth {
    static async signIn(): Promise<Session> {
        console.log("Sign in with Apple");
        return {} as Session;
    }

    static async signOut(): Promise<void> {
        console.log("Sign out with Apple");
    }

    static async refreshSession(session: Session): Promise<Session> {
        console.log("Refresh session with Apple");
        return { ...session } as Session;
    }
}
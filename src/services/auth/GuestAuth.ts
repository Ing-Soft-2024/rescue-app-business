import { Session } from "@/src/types/session.type";

export class GuestAuth {

    static async signIn(): Promise<Session> {
        console.log("Sign in as guest");
        return {
            token: "guest",
            expiresAt: Date.now() + 1000 * 60 * 60 * 24,
            isGuest: true,
        } as Session;
    }

    static async signOut() {
        console.log("Sign out as guest");
    }

    static async refreshSession(session: Session): Promise<Session> {
        console.log("Refresh session as guest");
        return { ...session } as Session;
    }
}
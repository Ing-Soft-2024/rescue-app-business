import { Session } from "@/src/types/session.type";

export class GoogleAuth {
    static async signIn(): Promise<Session> {
        console.log("Sign in with Google");
        return {} as Session;
    }

    static async signOut() {
        console.log("Sign out with Google");
    }

    static async refreshSession(session: Session): Promise<Session> {
        console.log("Refresh session with Google");
        return { ...session } as Session;
    }
}
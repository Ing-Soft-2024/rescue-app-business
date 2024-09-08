import { Session } from "@/src/types/session.type";

export class GoogleAuth {
    static async signIn(): Promise<Session> {
        console.log("Sign in with Google");
        return {};
    }
    static async signOut() {
        console.log("Sign out with Google");
    }
}
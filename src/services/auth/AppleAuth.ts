import { Session } from "@/src/types/session.type";

export class AppleAuth {
    static async signIn(): Promise<Session> {
        console.log("Sign in with Apple");
        return {};
    }

    static async signOut(): Promise<void> {
        console.log("Sign out with Apple");
    }
}
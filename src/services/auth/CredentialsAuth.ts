import { Session } from "@/src/types/session.type";
import zod from "zod";

const CredentialsAuthSchema = zod.object({
    "email": zod.string().email(),
    "password": zod.string(),
})

export class CredentialsAuth {
    constructor() { }

    static async signIn(props: any): Promise<Session> {
        const { data, error } = CredentialsAuthSchema.safeParse(props);
        if (error) throw Error("Invalid credentials");

        console.log("Sign in with credentials");
        return {} as Session;
    }

    static async signOut(): Promise<void> {
        console.log("Sign out with credentials");
    }

    static async refreshSession(session: Session): Promise<Session> {
        console.log("Refresh session with credentials");
        return { ...session } as Session;
    }
}
import { Session } from "@/src/types/session.type";
import zod from "zod";
import { loginConsumer } from "../client";
import { apiConsumerFactory } from "../client/api.factory";
import { SecureStorage } from "../secure.storage";

const authConsumer = apiConsumerFactory({
    endpoint: 'auth',
    validEndpoints: ['POST']
});

const CredentialsAuthSchema = zod.object({
    "email": zod.string().email(),
    "password": zod.string(),
});

export class CredentialsAuth {
    static async signIn(props: any): Promise<Session> {
        console.log("CREDENTIALS", props);
        const { data, error } = CredentialsAuthSchema.safeParse(props);
        if (error) throw Error("Invalid credentials");

        const response = await loginConsumer.consume('POST', {
            data: {
                email: props.email,
                password: props.password
            }
        });

        if(!response) throw Error("Invalid credentials");

        return {
            user: response.user,
            token: response.token,
            expiresAt: Date.now() + 1000 * 60 * 60 * 24, // 24 hours
            method: "Credentials"
        } as Session;
    }

    static async signOut(): Promise<void> {
        // Clear token from secure storage
        await SecureStorage.deleteItemAsync("session");
    }

    static async refreshSession(session: Session): Promise<Session> {
        // Implement refresh token logic here if needed
        return session;
    }
}
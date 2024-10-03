import { Session } from "@/src/types/session.type";
import { GoogleSignin } from "@react-native-google-signin/google-signin";

export class GoogleAuth {
    static async signIn(): Promise<Session> {
        const response = await GoogleSignin.signIn().catch((err) => {
            throw new Error("Hubo un error al iniciar sesión con Google");
        });

        console.log(response);
        if (!response) throw new Error("Hubo un error al iniciar sesión con Google");
        return {
            user: {
                email: response.data?.user.email,
                name: response.data?.user.name,

                photoURL: response.data?.user.photo,
            },
            method: "Google",
        } as Session;
    }

    static async signOut() {
        console.log("Sign out with Google");
    }

    static async refreshSession(session: Session): Promise<Session> {
        console.log("Refresh session with Google");
        return { ...session } as Session;
    }
}
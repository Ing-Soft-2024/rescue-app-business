import { useSession } from "@/src/context/session.context";
import { Button, KeyboardAvoidingView } from "react-native";

export default function SignInPage() {
    const {
        signInWith
    } = useSession();

    const signInWithCredentials = () => signInWith("Credentials", {
        email: "",
        password: ""
    });

    const signInWithSSO = () => signInWith("Google");

    return (
        <KeyboardAvoidingView style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
        }}>
            {/* Your content here */}
            <Button
                color={"#000"}
                title="Omitir"
                onPress={() => { }}
            />
        </KeyboardAvoidingView>
    )
}
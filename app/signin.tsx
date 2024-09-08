import { useSession } from "@/src/context/session.context";
import { Button, KeyboardAvoidingView } from "react-native";

export default function SignInPage() {
    const {
        signInWith
    } = useSession();

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
                onPress={() => signInWith("Guest")}
            />
        </KeyboardAvoidingView>
    )
}
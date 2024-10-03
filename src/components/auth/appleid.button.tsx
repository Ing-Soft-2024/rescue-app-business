import { useSession } from "@/src/context/session.context";
import * as AppleAuthentication from "expo-apple-authentication";
import { Platform } from "react-native";
export const AppleIDButton = () => {
    const {
        signInWith,
    } = useSession();

    return (Platform.OS === 'ios' &&
        <AppleAuthentication.AppleAuthenticationButton
            buttonType={AppleAuthentication.AppleAuthenticationButtonType.SIGN_IN}
            buttonStyle={AppleAuthentication.AppleAuthenticationButtonStyle.BLACK}
            cornerRadius={5}
            style={({
                display: 'flex',
                padding: 20,
                // backgroundColor: 'white',
                flexDirection: 'row',
                justifyContent: 'center',
                alignItems: 'center',
                gap: 5,
                borderRadius: 5,
            })}
            onPress={async () => signInWith("Apple")}
        />
    )
}
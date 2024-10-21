import { AppleIDButton } from '@/src/components/auth/appleid.button';
import { GoogleComponent } from '@/src/components/auth/google.button';
import { useSession } from '@/src/context/session.context';
import { useRouter } from 'expo-router';
import { Image, KeyboardAvoidingView, Platform, Pressable, StyleSheet, Text, TextInput, View } from "react-native";

export default function AuthLayout() {
    const { signInWith } = useSession();
    const router = useRouter();

    const navigateToIndex = () => {
        router.push('./(screens)/index.tsx');  // lleva al usuario a la pantalla de home (index)
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={{
                flexDirection: 'column',
                flex: 1,
                justifyContent: 'center',
                // alignItems: 'center',
                gap: 10,
                backgroundColor: '#fafafa',
                padding: 10,
            }}
        >

            <View style={styles.container}>
                <Image
                    source={require('../assets/images/reskue-logo.png')}
                    style={styles.logoContainer}
                />

                <Text style={styles.appName}>
                    reskue
                </Text>
            </View>

            <View style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 10,
                marginTop: 20,
            }}>
                <TextInput
                    placeholder="Email"
                    style={{
                        backgroundColor: 'white',
                        padding: 10,
                        borderRadius: 5,
                        fontSize: 18,
                        shadowColor: 'black',
                        shadowOpacity: 0.1,
                        shadowOffset: { width: 0, height: 1 },
                    }}
                />

                <TextInput
                    placeholder="Password"
                    style={{
                        backgroundColor: 'white',
                        padding: 10,
                        borderRadius: 5,
                        fontSize: 18,
                        shadowColor: 'black',
                        shadowOpacity: 0.1,
                        shadowOffset: { width: 0, height: 1 },
                    }}
                    textContentType="password"
                    secureTextEntry={true}
                />

                <Pressable style={styles.button} onPress={() => { }}>
                    <Text style={styles.buttonText}>Iniciar sesión</Text>
                </Pressable>
                <View>
                    <Text style={{
                        color: '#444444',
                        fontSize: 12,
                    }}>
                        Al iniciar sesión, estarás aceptando los Términos y Condiciones de uso.
                    </Text>
                </View>
            </View>

            <View style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                gap: 5,
                marginTop: 40,
            }}>
                <GoogleComponent />
                <AppleIDButton />
            </View>
        </KeyboardAvoidingView>
    )
}

const styles = StyleSheet.create({
    container: {
        flexDirection: 'column',
        // flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fafafa',
        padding: 10,
        marginTop: 20,
    },
    logoContainer: {
        height: 100,
        width: 200,
        resizeMode: 'contain',
        alignSelf: 'center',
        marginTop: 40,
    },
    appName: {
        fontFamily: 'Bungee',
        fontSize: 32,
        color: '#D4685E',
        marginTop: 10,
    },
    containerButton: {
        // flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 30,
    },
    button: {
        borderWidth: 2,
        borderColor: '#D4685E',
        borderRadius: 10,
        paddingVertical: 10,
        paddingHorizontal: 20,
        alignItems: 'center',
        backgroundColor: '#D4685E',
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
});
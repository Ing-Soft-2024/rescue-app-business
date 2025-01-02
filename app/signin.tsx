import { useSession } from '@/src/context/session.context';
import { userBusinessConsumer } from '@/src/services/client';
import { NO_INTERNET_MESSAGE } from '@/src/utils/networkUtils';
import { checkInternetConnection } from '@/src/utils/networkUtils';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Image, KeyboardAvoidingView, Platform, Pressable, StyleSheet, Text, TextInput, View, ActivityIndicator, Alert } from "react-native";

export default function AuthLayout() {
    const { signInWith } = useSession();
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const hasBusiness = async (userId: number): Promise<Boolean> => {
        const response = await userBusinessConsumer.consume('GET', {
            queryParams: {
                userId
            }
        }).catch((err) => false); 
        return Boolean(response);
    }

    const signInWithCredentials = async () => {        
        setIsLoading(true);
        setError(''); // Clear previous errors

        try {
            const isConnected = await checkInternetConnection();
            if (!isConnected) {
                setError(NO_INTERNET_MESSAGE);
                return;
            }

            // Basic validation
            if (!email.trim() || !password.trim()) {
                setError('Por favor, complete todos los campos');
                return;
            }

            const session = await signInWith("Credentials", {
                email: email.trim(),
                password: password
            });

            if (!session) {
                setError('Error al iniciar sesión. Por favor, intente nuevamente.');
                return;
            }

            const exists = await hasBusiness(session.user.id);
            if (!exists) {
                router.replace('/create_commerce');
            } else {
                router.replace('/(app)/');
            }
        } catch (error: any) {
            console.error('Login error:', error);
            if (error.message?.includes('401')) {
                setError('Credenciales inválidas. Por favor, verifique su email y contraseña.');
            } else {
                setError('El mail o la contraseña son incorrectos.');
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={styles.container}
        >
            <View style={styles.logoContainer}>
                <Image
                    source={require('../assets/images/reskue-logo.png')}
                    style={styles.logo}
                />
                <Text style={styles.appName}>reskue</Text>
            </View>

            <View style={styles.formContainer}>
                {error ? (
                    <Text style={styles.errorText}>{error}</Text>
                ) : null}

                <TextInput
                    placeholder="Email"
                    style={[styles.input, error ? styles.inputError : null]}
                    onChangeText={setEmail}
                    value={email}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    editable={!isLoading}
                />

                <TextInput
                    placeholder="Contraseña"
                    style={[styles.input, error ? styles.inputError : null]}
                    onChangeText={setPassword}
                    value={password}
                    secureTextEntry
                    editable={!isLoading}
                />

                <Pressable
                    style={({ pressed }) => [
                        styles.button,
                        { opacity: pressed || isLoading ? 0.7 : 1 }
                    ]}
                    onPress={signInWithCredentials}
                    disabled={isLoading}
                >
                    {isLoading ? (
                        <ActivityIndicator color="white" />
                    ) : (
                        <Text style={styles.buttonText}>Iniciar Sesión</Text>
                    )}
                </Pressable>

                <Text style={styles.termsText}>
                    Al iniciar sesión, estarás aceptando los Términos y Condiciones de uso.
                </Text>
            </View>

            <Pressable
                style={({ pressed }) => [
                    styles.registerButton,
                    { opacity: pressed ? 0.7 : 1 }
                ]}
                onPress={() => router.push('./register')}
            >
                <Text style={styles.registerText}>Registrarse</Text>
            </Pressable>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fafafa',
        padding: 20,
    },
    logoContainer: {
        alignItems: 'center',
        marginTop: 60,
    },
    logo: {
        height: 100,
        width: 200,
        resizeMode: 'contain',
    },
    appName: {
        fontFamily: 'Bungee',
        fontSize: 32,
        color: '#D4685E',
        marginTop: 10,
    },
    formContainer: {
        marginTop: 40,
        gap: 15,
    },
    input: {
        backgroundColor: 'white',
        padding: 15,
        borderRadius: 8,
        fontSize: 16,
        shadowColor: 'black',
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 1 },
        elevation: 2,
    },
    inputError: {
        borderWidth: 1,
        borderColor: '#D4685E',
    },
    errorText: {
        color: '#D4685E',
        fontSize: 14,
        textAlign: 'center',
        marginBottom: 10,
    },
    button: {
        backgroundColor: '#D4685E',
        padding: 15,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 10,
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
    termsText: {
        color: '#666666',
        fontSize: 12,
        textAlign: 'center',
        marginTop: 15,
    },
    registerButton: {
        marginTop: 30,
        padding: 15,
        alignItems: 'center',
    },
    registerText: {
        color: '#8D6E63',
        fontSize: 16,
    },
});
import { registerConsumer } from '@/src/services/client';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
    Keyboard,
    KeyboardAvoidingView,
    Platform,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableWithoutFeedback,
    View,
    ActivityIndicator,
    Alert
} from 'react-native';

export default function RegisterScreen() {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [address, setAddress] = useState('');
    const [city, setCity] = useState('');
    const [state, setState] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const router = useRouter();

    const onPressBack = () => {
        router.back();
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const handleRegister = async () => {
        setIsLoading(true);
        try {
            const response = await registerConsumer.consume('POST', {
                data: {
                    firstName,
                    lastName,
                    email,
                    password,
                    address,
                    city,
                    state
                }
            });
            Alert.alert(
                "Éxito",
                "Registro completado exitosamente",
                [{ text: "OK", onPress: () => router.push('/signin') }]
            );
        } catch (error) {
            console.error('Registration error:', error);
            Alert.alert(
                "Error",
                "No se pudo completar el registro. Por favor, intente nuevamente."
            );
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={styles.container}
                keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0}
            >
                <ScrollView 
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.scrollContainer}
                >
                    <View style={styles.formContainer}>
                        <Text style={styles.title}>Crear cuenta</Text>

                        <TextInput
                            placeholder="Nombre"
                            value={firstName}
                            onChangeText={setFirstName}
                            style={styles.input}
                            returnKeyType="next"
                        />

                        <TextInput
                            placeholder="Apellido"
                            value={lastName}
                            onChangeText={setLastName}
                            style={styles.input}
                            returnKeyType="next"
                        />

                        <TextInput
                            placeholder="Correo electrónico"
                            value={email}
                            onChangeText={setEmail}
                            style={styles.input}
                            keyboardType="email-address"
                            autoCapitalize="none"
                            returnKeyType="next"
                        />

                        <View style={styles.passwordContainer}>
                            <TextInput
                                placeholder="Contraseña"
                                value={password}
                                onChangeText={setPassword}
                                secureTextEntry={!showPassword}
                                style={styles.passwordInput}
                                returnKeyType="next"
                            />
                            <Pressable onPress={togglePasswordVisibility} style={styles.toggleButton}>
                                <Text>{showPassword ? 'Ocultar' : 'Mostrar'}</Text>
                            </Pressable>
                        </View>

                        <TextInput
                            placeholder="Dirección"
                            value={address}
                            onChangeText={setAddress}
                            style={styles.input}
                            returnKeyType="next"
                        />

                        <TextInput
                            placeholder="Ciudad"
                            value={city}
                            onChangeText={setCity}
                            style={styles.input}
                            returnKeyType="next"
                        />

                        <TextInput
                            placeholder="Estado/Provincia"
                            value={state}
                            onChangeText={setState}
                            style={styles.input}
                            returnKeyType="done"
                        />

                        <Pressable
                            style={({ pressed }) => [
                                styles.registerButton,
                                { opacity: pressed || isLoading ? 0.7 : 1 }
                            ]}
                            onPress={handleRegister}
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <ActivityIndicator color="white" />
                            ) : (
                                <Text style={styles.registerButtonText}>Registrarse</Text>
                            )}
                        </Pressable>

                        <Pressable onPress={onPressBack}>
                            <Text style={styles.loginLink}>Ya tengo una cuenta</Text>
                        </Pressable>
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </TouchableWithoutFeedback>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fafafa',
    },
    scrollContainer: {
        flexGrow: 1,
        justifyContent: 'center',
    },
    formContainer: {
        padding: 20,
        paddingBottom: Platform.OS === 'ios' ? 40 : 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 30,
        textAlign: 'center',
        color: '#D4685E',
    },
    input: {
        backgroundColor: 'white',
        padding: 15,
        borderRadius: 5,
        fontSize: 16,
        marginBottom: 15,
        shadowColor: 'black',
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 1 },
    },
    passwordContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'white',
        borderRadius: 5,
        marginBottom: 15,
        shadowColor: 'black',
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 1 },
    },
    passwordInput: {
        flex: 1,
        padding: 15,
        fontSize: 16,
    },
    toggleButton: {
        padding: 15,
    },
    registerButton: {
        backgroundColor: '#D4685E',
        padding: 15,
        borderRadius: 5,
        alignItems: 'center',
        marginTop: 20,
    },
    registerButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
    loginLink: {
        textAlign: 'center',
        marginTop: 20,
        color: '#8D6E63',
        fontSize: 16,
    },
});
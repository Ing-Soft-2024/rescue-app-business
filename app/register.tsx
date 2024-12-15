import React, { useState } from 'react';
import { TextInput, View, Text, StyleSheet, Pressable, KeyboardAvoidingView, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import { registerConsumer } from '@/src/services/client';

export default function RegisterScreen() {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [address, setAddress] = useState('');
    const [city, setCity] = useState('');
    const [state, setState] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const router = useRouter();

    const onPressBack = () => {
        router.back();
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const handleRegister = async () => {
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
            console.log('Registration successful:', response);
            router.push('/login-screen'); // Redirect to login after successful registration
        } catch (error) {
            console.error('Registration error:', error);
            // Handle registration error (show message to user)
        }
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={styles.container}
        >
            <Text style={styles.title}>Crear cuenta</Text>

            <TextInput
                placeholder="Nombre"
                value={firstName}
                onChangeText={setFirstName}
                style={styles.input}
            />

            <TextInput
                placeholder="Apellido"
                value={lastName}
                onChangeText={setLastName}
                style={styles.input}
            />

            <TextInput
                placeholder="Correo electrónico"
                value={email}
                onChangeText={setEmail}
                style={styles.input}
                keyboardType="email-address"
                autoCapitalize="none"
            />

            <View style={styles.passwordContainer}>
                <TextInput
                    placeholder="Contraseña"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry={!showPassword}
                    style={styles.passwordInput}
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
            />

            <TextInput
                placeholder="Ciudad"
                value={city}
                onChangeText={setCity}
                style={styles.input}
            />

            <TextInput
                placeholder="Estado/Provincia"
                value={state}
                onChangeText={setState}
                style={styles.input}
            />

            <Pressable style={styles.registerButton} onPress={handleRegister}>
                <Text style={styles.registerButtonText}>Registrarse</Text>
            </Pressable>

            <Pressable onPress={onPressBack}>
                <Text style={styles.loginLink}>Ya tengo una cuenta</Text>
            </Pressable>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 20,
        backgroundColor: '#fafafa',
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
import { ConnectCommerce } from '@/src/components/mercadopago/connectCommerce';
import { useSession } from '@/src/context/session.context';
import { commerceConsumer } from '@/src/services/client';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, Alert } from 'react-native';

export default function RegisterScreen() {
    const { session } = useSession();

    const [name, setName] = useState('');
    const [address, setAddress] = useState('');
    const [city, setCity] = useState('');
    const [state, setState] = useState('');
    const [errors, setErrors] = useState({
        name: false,
        address: false,
        city: false,
        state: false
    });

    const router = useRouter();

    const onPressBack = () => {
        router.back();
    };

    const validateInputs = () => {
        const newErrors = {
            name: name.trim() === '',
            address: address.trim() === '',
            city: city.trim() === '',
            state: state.trim() === ''
        };

        setErrors(newErrors);

        return !Object.values(newErrors).some(error => error);
    };

    const handleRegister = async () => {
        try {
            if (!validateInputs()) {
                Alert.alert(
                    "Error de validación",
                    "Por favor, complete todos los campos correctamente.",
                    [{ text: "OK" }]
                );
                return;
            }

            await commerceConsumer.consume('POST', {
                data: {
                    userId: session?.user.id,
                    name: name.trim(),
                    country: "Argentina",
                    address: address.trim(),
                    city: city.trim(),
                    state: state.trim()
                }
            });
            router.push('./(app)/');
        } catch (error) {
            console.error('Error al crear comercio:', error);
            Alert.alert(
                "Error",
                "Hubo un error al crear el comercio. Por favor, intente nuevamente.",
                [{ text: "OK" }]
            );
        }
    };

    return (
        <ScrollView style={styles.scrollView}>
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={styles.container}
            >
                <Text style={styles.title}>Crear comercio</Text>

                <TextInput
                    placeholder="Nombre"
                    value={name}
                    onChangeText={setName}
                    style={[
                        styles.input,
                        errors.name && styles.inputError
                    ]}
                />
                {errors.name && (
                    <Text style={styles.errorText}>El nombre es requerido</Text>
                )}

                <TextInput
                    placeholder="Dirección"
                    value={address}
                    onChangeText={setAddress}
                    style={[
                        styles.input,
                        errors.address && styles.inputError
                    ]}
                />
                {errors.address && (
                    <Text style={styles.errorText}>La dirección es requerida</Text>
                )}

                <TextInput
                    placeholder="Ciudad"
                    value={city}
                    onChangeText={setCity}
                    style={[
                        styles.input,
                        errors.city && styles.inputError
                    ]}
                />
                {errors.city && (
                    <Text style={styles.errorText}>La ciudad es requerida</Text>
                )}

                <TextInput
                    placeholder="Estado/Provincia"
                    value={state}
                    onChangeText={setState}
                    style={[
                        styles.input,
                        errors.state && styles.inputError
                    ]}
                />
                {errors.state && (
                    <Text style={styles.errorText}>La provincia es requerida</Text>
                )}

                <Pressable 
                    style={styles.registerButton} 
                    onPress={handleRegister}
                >
                    <Text style={styles.registerButtonText}>Registrar Comercio</Text>
                </Pressable>

                <Pressable onPress={onPressBack}>
                    <Text style={styles.loginLink}>Volver</Text>
                </Pressable>

                <ConnectCommerce redirect_uri='com.tjuhasz.rescueappbussiness://mercadopago-auth' />
            </KeyboardAvoidingView>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    scrollView: {
        flex: 1,
        backgroundColor: '#fafafa',
    },
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
    inputError: {
        borderWidth: 1,
        borderColor: '#D4685E',
    },
    errorText: {
        color: '#D4685E',
        fontSize: 12,
        marginBottom: 10,
        marginTop: -10,
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
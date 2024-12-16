import { ConnectCommerce } from '@/src/components/mercadopago/connectCommerce';
import { useSession } from '@/src/context/session.context';
import { commerceConsumer } from '@/src/services/client';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput } from 'react-native';


export default function RegisterScreen() {
    const { session } = useSession();

    const [name, setName] = useState('');
    const [address, setAddress] = useState('');
    const [city, setCity] = useState('');
    const [state, setState] = useState('');

    const router = useRouter();

    const onPressBack = () => {
        router.back();
    };

    const handleRegister = async () => {
        try {
            await commerceConsumer.consume('POST', {
                data: {
                    userId: session?.user.id,
                    name,
                    country: "Argentina",
                    address,
                    city,
                    state
                }
            });
            router.push('./(screens)/index');
        } catch (error) {
            console.error('Error al crear comercio:', error);
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
                    style={styles.input}
                />

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

                <Pressable 
                    style={styles.registerButton} 
                    onPress={handleRegister}
                >
                    <Text style={styles.registerButtonText}>Registrar Comercio</Text>
                </Pressable>

                <Pressable onPress={onPressBack}>
                    <Text style={styles.loginLink}>Volver</Text>
                </Pressable>

                <ConnectCommerce redirect_uri='http://localhost:3000' />
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
import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';

export default function MercadoPagoSuccessScreen() {
    const router = useRouter();

    useEffect(() => {
        // Handle the successful connection
        // Show success message and then redirect
        const timer = setTimeout(() => {
            router.replace('/(app)/');
        }, 2000);

        return () => clearTimeout(timer);
    }, []);

    return (
        <View style={styles.container}>
            <Text style={styles.text}>¡Conexión exitosa con Mercado Pago!</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
        padding: 20,
    },
    text: {
        fontSize: 20,
        fontWeight: 'bold',
        textAlign: 'center',
        color: '#4CAF50', // Green color for success
    },
}); 
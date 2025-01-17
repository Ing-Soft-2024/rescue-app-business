import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';

export default function MercadoPagoErrorScreen() {
    const router = useRouter();
    const params = useLocalSearchParams();
    
    console.log("Raw PARAMS:", JSON.stringify(params, null, 2));
    console.log("Raw details string:", params.details);

    const { error, message, details } = params;

    let errorDetails;
    try {
        if (!details) {
            console.log("No details provided");
            errorDetails = null;
        } else {
            const decodedDetails = decodeURIComponent(details as string);
            console.log("Decoded details string:", decodedDetails);
            errorDetails = JSON.parse(decodedDetails);
        }
    } catch (e) {
        console.error("Error parsing details:", e);
        console.error("Failed to parse string:", details);
        errorDetails = null;
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Error de Conexión</Text>
            <Text style={styles.error}>{message || 'Hubo un error al conectar con Mercado Pago'}</Text>
            {errorDetails && (
                <View style={styles.detailsContainer}>
                    <Text style={styles.details}>
                        Error: {error || 'Desconocido'}
                    </Text>
                    <Text style={styles.details}>
                        Mensaje: {message || 'Sin mensaje'}
                    </Text>
                    <Text style={styles.details}>
                        Detalles: {JSON.stringify(errorDetails, null, 2)}
                    </Text>
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
        color: '#FF0000',
    },
    error: {
        fontSize: 16,
        textAlign: 'center',
        marginBottom: 10,
    },
    detailsContainer: {
        marginTop: 20,
        padding: 10,
        backgroundColor: '#f5f5f5',
        borderRadius: 5,
        width: '100%',
    },
    details: {
        fontSize: 14,
        color: '#666',
        marginBottom: 5,
    },
}); 

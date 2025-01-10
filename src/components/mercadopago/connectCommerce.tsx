import { mercadoPagoAuthConsumer } from "@/src/services/client";
import { useSession } from "@/src/context/session.context";
import { useBusiness } from "@/src/context/business.context";
import { openAuthSessionAsync } from "expo-web-browser";
import { Alert, Pressable, Text, StyleSheet } from "react-native";
import * as Linking from 'expo-linking';
import { useEffect } from "react";

interface ConnectCommerceProps {
    redirect_uri: string;
    onSuccess?: () => void;
}

export const ConnectCommerce = ({ redirect_uri, onSuccess }: ConnectCommerceProps) => {
    const { business } = useBusiness();

    useEffect(() => {
        // Handle deep linking
        const subscription = Linking.addEventListener('url', ({ url }) => {
            if (url.includes('mercadopago/callback')) {
                const success = url.includes('success=true');
                if (success) {
                    Alert.alert(
                        "Éxito",
                        "Conexión con Mercado Pago establecida correctamente",
                        [{ text: "OK", onPress: onSuccess }]
                    );
                }
            }
        });

        return () => subscription.remove();
    }, [onSuccess]);

    const handleAuth = async () => {
        try {
            if (!business?.id) {
                Alert.alert("Error", "No se encontró el comercio");
                return;
            }

            const authUrl = `https://auth.mercadopago.com/authorization?client_id=${process.env.EXPO_PUBLIC_MP_CLIENT_ID}&response_type=code&platform_id=mp&redirect_uri=${encodeURIComponent(redirect_uri)}&state=${business.id}`;
            
            await openAuthSessionAsync(authUrl);
        } catch (error) {
            console.error('Error en autenticación:', error);
            Alert.alert(
                "Error",
                "No se pudo establecer la conexión con Mercado Pago"
            );
        }
    };

    return (
        <Pressable style={styles.connectButton} onPress={handleAuth}>
            <Text style={styles.connectButtonText}>
                Conectar con Mercado Pago
            </Text>
        </Pressable>
    );
};

const styles = StyleSheet.create({
    connectButton: {
        backgroundColor: '#009EE3',
        padding: 15,
        borderRadius: 5,
        alignItems: 'center',
        marginTop: 20,
    },
    connectButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
});
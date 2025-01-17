import { mercadoPagoAuthConsumer } from "@/src/services/client";
import { useSession } from "@/src/context/session.context";
import { useBusiness } from "@/src/context/business.context";
import { openAuthSessionAsync } from "expo-web-browser";
import { Alert, Pressable, Text, StyleSheet, View } from "react-native";
import * as Linking from 'expo-linking';
import { useEffect } from "react";

interface ConnectCommerceProps {
    redirect_uri: string;
    onSuccess?: () => void;
}

export const ConnectCommerce = ({ redirect_uri, onSuccess }: ConnectCommerceProps) => {
    const { business } = useBusiness();

    useEffect(() => {
        const subscription = Linking.addEventListener('url', ({ url }) => {
            if (url.includes('mercadopago/callback')) {
                const params = Linking.parse(url).queryParams;
                if (params?.success === 'true') {
                    Alert.alert(
                        "Éxito",
                        "Conexión con Mercado Pago establecida correctamente",
                        [{ text: "OK", onPress: onSuccess }]
                    );
                } else {
                    Alert.alert(
                        "Error",
                        (Array.isArray(params?.error) ? params?.error[0] : params?.error) || "No se pudo conectar con Mercado Pago"
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

            const clientId = process.env.EXPO_PUBLIC_MP_CLIENT_ID;
            const redirectUri = process.env.EXPO_PUBLIC_MP_REDIRECT_URI;
            
            if (!clientId || !redirectUri) {
                throw new Error("Missing MP configuration");
            }

            const state = encodeURIComponent(business.id.toString());
            
            const authUrl = `https://auth.mercadopago.com/authorization?` + 
                `client_id=${clientId}` +
                `&response_type=code` +
                `&platform_id=mp` +
                `&redirect_uri=${encodeURIComponent(redirectUri)}` +
                `&state=${state}`;
            
            
            // Specify the return URL that matches your deep linking configuration
            await openAuthSessionAsync(
                authUrl,
                'rescueapp-business://MercadoPagoSuccessScreen'
            );
        } catch (error) {
            console.error('Error en autenticación:', error);
            Alert.alert(
                "Error",
                "No se pudo establecer la conexión con Mercado Pago"
            );
        }
    };
    


    return (
        <View style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            zIndex: 1000,
            padding: 20,
            backgroundColor: 'white'
        }}>
            <Pressable style={styles.connectButton} onPress={handleAuth}>
                <Text style={styles.connectButtonText}>
                    Conectar con Mercado Pago
                </Text>
            </Pressable>
        </View>
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
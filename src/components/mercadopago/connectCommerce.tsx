import { mercadoPagoAuthConsumer } from "@/src/services/client";
import SecureStore from 'expo-secure-store';
import { openAuthSessionAsync } from "expo-web-browser";
import { Button } from "react-native";

const verifyAuthMercadoPago = async ({
  client_id,
  code,
  redirect_uri,
  user_id,
}: {
  client_id: string;
  code: string;
  redirect_uri: string;
  user_id: string;
}) => {
  const response = await mercadoPagoAuthConsumer.consume('POST', {
    data: {
      client_id,
      code,
      redirect_uri,
      user_id,
    }
  });

  return response;
}

interface AuthParams {
  appId: string;
  redirectUri: string;
}

function generateRandomString(length: number): string {
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~';
  let text = '';
  for (let i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
}

async function generateCodeVerifier(): Promise<string> {
  // Generar una cadena aleatoria de 43-128 caracteres (usamos 43 que es el mínimo requerido)
  return generateRandomString(43);
}

async function generateCodeChallenge(verifier: string): Promise<string> {
  // En este caso usamos el método "plain" que es más simple
  // y está soportado por Mercado Pago
  return verifier;
}

async function openAuthSession({ appId, redirectUri }: AuthParams) {
  try {
    const codeVerifier = await generateCodeVerifier();
    const codeChallenge = await generateCodeChallenge(codeVerifier);
    
    const authUrl = `https://auth.mercadopago.com/authorization?` + 
      `response_type=code` +
      `&client_id=${appId}` +
      `&redirect_uri=${encodeURIComponent(redirectUri)}` +
      `&code_challenge=${codeChallenge}` +
      `&code_challenge_method=plain`;

    const result = await openAuthSessionAsync(authUrl, redirectUri);
    const responseUrl = result.type === 'success' ? result.url : null;
    if (!responseUrl) {
      throw new Error('No se pudo abrir la sesión de autenticación.');
    }

    const urlParams = new URLSearchParams(responseUrl);
    const code = urlParams.get('code');
    if (!code) throw new Error('No se encontró el código de autorización.');

    const verifyResponse = await verifyAuthMercadoPago({
      client_id: appId,
      code,
      redirect_uri: redirectUri,
      user_id: appId
    });

    console.log('verifyResponse:', verifyResponse);

    await SecureStore.setItemAsync('mp_code_verifier', codeVerifier);

    return result;
  } catch (error) {
    console.error('Error en autenticación:', error);
    throw error;
  }
}

export const ConnectCommerce = ({
  redirect_uri
}: { redirect_uri: string }) => {
  const handleAuth = async () => {
    try {
      const response = await openAuthSession({
        appId: '4993987139809199',
        redirectUri: redirect_uri
      });
      
      console.log('Auth response:', response);
    } catch (error) {
      console.error('Error en autenticación:', error);
    }
  };

  return (
    <Button
      onPress={handleAuth}
      title="Conectar con Mercado Pago"
    />
  );
};
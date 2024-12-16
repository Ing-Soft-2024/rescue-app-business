import { mercadoPagoAuthConsumer } from "@/src/services/client";
import base64url from 'base64url';
import * as crypto from 'expo-crypto';
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

async function generateCodeVerifier(): Promise<string> {
  // Generar una cadena aleatoria de 43-128 caracteres
  const randomBytes = (await crypto.getRandomBytesAsync(32)).toString(); // 32 bytes = 256 bits
  return base64url.encode(randomBytes);
}

async function generateCodeChallenge(verifier: string): Promise<string> {
  // Generar SHA256 del code_verifier
  const digest = await crypto.digestStringAsync(
    crypto.CryptoDigestAlgorithm.SHA256,
    verifier
  );
  // Convertir a base64url
  return base64url.encode(Buffer.from(digest, 'hex'));
}

async function openAuthSession({ appId, redirectUri }: AuthParams) {
  try {
    // Generar code_verifier
    const codeVerifier = await generateCodeVerifier();
    
    // Generar code_challenge
    const codeChallenge = await generateCodeChallenge(codeVerifier);
    
    // Construir URL de autorización
    const authUrl = `https://auth.mercadopago.com/authorization?` + 
      `response_type=code` +
      `&client_id=${appId}` +
      `&redirect_uri=${encodeURIComponent(redirectUri)}` +
      `&code_challenge=${codeChallenge}` +
      `&code_challenge_method=S256`;

    // Abrir sesión de autenticación
    const result = await openAuthSessionAsync(authUrl, redirectUri);
    const responseUrl = result.type === 'success' ? result.url : null;
    if (!responseUrl) {
      throw new Error('No se pudo abrir la sesión de autenticación.');
    }

    // Extraer el código de autorización
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

    // Guardar code_verifier para usarlo después
    await SecureStore.setItemAsync('mp_code_verifier', codeVerifier);

    return result;
  } catch (error) {
    console.error('Error en autenticación:', error);
    throw error;
  }
}

// En tu componente connectCommerce.tsx:
const ConnectCommerce = ({
    redirect_uri
}:{ redirect_uri: string }) => {
  const handleAuth = async () => {
    try {
      const response = await openAuthSession({
        appId: '4993987139809199',
        redirectUri: redirect_uri
      });
      
      // Manejar la respuesta
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
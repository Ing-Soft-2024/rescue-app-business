import { mercadoPagoAuthConsumer } from "@/src/services/client";
import SecureStore from 'expo-secure-store';
import { openAuthSessionAsync } from "expo-web-browser";
import { Button } from "react-native";
import * as Crypto from 'expo-crypto';
import { Buffer } from 'buffer';


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
    const digest = await Crypto.digestStringAsync(
        Crypto.CryptoDigestAlgorithm.SHA256,
        verifier
    );
    
    return btoa(String.fromCharCode(...new Uint8Array(Buffer.from(digest, 'hex'))))
        .replace(/\+/g, '-')
        .replace(/\//g, '_')
        .replace(/=+$/, '');
}

async function openAuthSession({ appId, redirectUri }: AuthParams) {
  try {
    const codeVerifier = await generateCodeVerifier();
    const codeChallenge = await generateCodeChallenge(codeVerifier);
    const state = generateRandomString(16);
    
    const authUrl = `https://auth.mercadopago.com/authorization?` + 
      `response_type=code` +
      `&client_id=${appId}` +
      `&redirect_uri=${encodeURIComponent(redirectUri)}` +
      `&code_challenge=${codeChallenge}` +
      `&code_challenge_method=S256` +
      `&platform_id=mp` +
      `&state=${state}`;

    const result = await openAuthSessionAsync(
      authUrl,
      "rescueappbussiness://create_commerce"
    );

    if (result.type !== 'success') {
      throw new Error('Authentication was cancelled');
    }

    const url = new URL(result.url);
    const code = url.searchParams.get('code');
    const returnedState = url.searchParams.get('state');

    // Verify state matches to prevent CSRF attacks
    if (!code || !returnedState) {
      throw new Error('Missing authorization code or state');
    }

    if (state !== returnedState) {
      throw new Error('Invalid state parameter');
    }

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
        appId: '2381168209109958',
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
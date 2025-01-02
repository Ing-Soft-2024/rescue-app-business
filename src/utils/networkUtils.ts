import NetInfo from '@react-native-community/netinfo';

export const checkInternetConnection = async () => {
  const state = await NetInfo.fetch();
  return state.isConnected && state.isInternetReachable;
};

export const NO_INTERNET_MESSAGE = 'No hay conexión a internet. Por favor, verifica tu conexión e intenta nuevamente.'; 
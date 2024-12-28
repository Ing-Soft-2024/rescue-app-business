import { BusinessProvider } from '../src/context/business.context';
import { NotificationsProvider } from '../src/context/notifications.context';
import { SessionProvider } from '../src/context/session.context';
import { Slot } from "expo-router";
import { GestureHandlerRootView } from 'react-native-gesture-handler';

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SessionProvider>
        <BusinessProvider>
          <NotificationsProvider>
            <Slot />
          </NotificationsProvider>
        </BusinessProvider>
      </SessionProvider>
    </GestureHandlerRootView>
  );
}
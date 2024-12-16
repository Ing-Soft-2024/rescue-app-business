import { BusinessProvider } from '../src/context/business.context';
import { NotificationsProvider } from '../src/context/notifications.context';
import { SessionProvider } from '../src/context/session.context';
import { Slot } from "expo-router";

export default function RootLayout() {
  return (
    <SessionProvider>
      <BusinessProvider>
        <NotificationsProvider>
          <Slot />
        </NotificationsProvider>
      </BusinessProvider>
    </SessionProvider>
  );
}
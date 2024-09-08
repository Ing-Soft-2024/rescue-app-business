import { SessionProvider } from "@/src/context/session.context";
import { Slot } from "expo-router";

export default function RootLayout() {
  return (
    <SessionProvider>
      <Slot />
    </SessionProvider>
  );
}

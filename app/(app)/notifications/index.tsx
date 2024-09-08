import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Text, View } from "react-native";

export default function NotificationsPage() {
    return (
        <View style={{
            paddingVertical: 60,
            padding: 5,
            flex: 1,
            gap: 10,
            alignItems: "center",
        }}>
            <MaterialCommunityIcons name="sleep" size={100} color="gray" />
            <Text style={{ fontWeight: "bold" }}>Todo muy tranquilo por ahora...</Text>
            <Text>No hay notificaciones nuevas.</Text>
        </View>
    )
}
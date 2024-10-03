import { ProductType } from "@/src/types/product.type";
import { Image, Text, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import Swipeable from "react-native-gesture-handler/Swipeable";
import { ProductActions } from "./actions";



export const ProductItem = ({ product }: { product: ProductType }) => {
    console.log(product);
    return (
        <GestureHandlerRootView>
            <Swipeable
                shouldCancelWhenOutside={false}
                renderRightActions={() => <ProductActions id={product.id!} />}
            >
                <View style={{
                    flexDirection: "row",
                    gap: 15,
                    padding: 1,
                    backgroundColor: "#FAFAFF",
                }}>
                    <View style={{
                        backgroundColor: "black",
                        height: 75,
                        width: 75,
                        borderRadius: 5
                    }}>
                        <Image
                            src="https://via.placeholder.com/150"
                            fadeDuration={10}
                            style={{
                                height: "100%",
                                width: "100%",
                                borderRadius: 5,
                                resizeMode: "cover"
                            }}
                        />
                    </View>
                    <View style={{ paddingVertical: 5, gap: 4 }}>
                        <Text style={{
                            fontSize: 16,
                            fontWeight: "semibold"
                        }}>
                            {product?.name}
                        </Text>
                        <Text style={{
                            fontSize: 14,
                            fontWeight: "bold"
                        }}>
                            {new Intl.NumberFormat("es-AR", {
                                style: "currency",
                                currency: "ARS"
                            }).format(product?.price)}
                        </Text>
                    </View>
                </View>
            </Swipeable>
        </GestureHandlerRootView>
    );
}
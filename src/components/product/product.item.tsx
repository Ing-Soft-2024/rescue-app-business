import StorageController from "@/src/services/storage/controller/storage.controller";
import { ProductType } from "@/src/types/product.type";
import React from "react";
import { ActivityIndicator, Image, Text, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import Swipeable from "react-native-gesture-handler/Swipeable";
import { ProductActions } from "./actions";



export const ProductItem = ({ product }: { product: ProductType }) => {
    const [image, setImage] = React.useState<string>("");
    const [isLoading, setIsLoading] = React.useState(true);

    const processImage = async (imageUri: string) => {
        if (!imageUri) return;
        setIsLoading(true);
        try {
            const image = await StorageController.download(imageUri);
            setImage(image);
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    }
    React.useEffect(() => { processImage(product.image); }, [product.image]);

    return (
        <GestureHandlerRootView>
            <View style={{
                gap: 15,
                backgroundColor: "#FAFAFF",
                margin: 5,
                borderRadius: 10,
                borderColor: "#0002",
                borderWidth: 1,

                overflow: "hidden",
            }}>
                <Swipeable
                    shouldCancelWhenOutside={false}
                    renderRightActions={() => <ProductActions id={product.id!} />}
                >
                    <View style={{
                        flexDirection: "row",
                        width: "100%",
                        backgroundColor: "#FAFAFF",
                        gap: 15,
                        padding: 5,
                    }}>
                        <View style={{
                            backgroundColor: "#444",
                            height: 75,
                            width: 75,
                            borderRadius: 5,
                            alignItems: "center",
                            justifyContent: "center",
                        }}>
                            {isLoading && (
                                <ActivityIndicator />
                            )}
                            {
                                !isLoading && image && (
                                <Image
                                    source={{ uri: image }}
                                    fadeDuration={1000}
                                    style={{
                                        height: "100%",
                                        width: "100%",
                                        borderRadius: 5,
                                        resizeMode: "cover"
                                    }}
                                />
                            )}
                        </View>
                        <View style={{ paddingVertical: 5, gap: 4, justifyContent: "space-between" }}>
                            <Text style={{
                                fontSize: 18,
                                fontWeight: "bold",
                                color: "#D8776E"
                            }}>
                                {product?.name}
                            </Text>
                            <Text style={{
                                fontSize: 14,
                                fontWeight: "semibold",
                                color: "#D8776E"
                            }}>
                                {new Intl.NumberFormat("es-AR", {
                                    style: "currency",
                                    currency: "ARS"
                                }).format(product?.price)}
                            </Text>
                        </View>
                    </View>
                </Swipeable>
            </View>
        </GestureHandlerRootView>
    );
}
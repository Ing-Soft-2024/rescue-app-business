import { FloatingButton } from "@/src/components/base/floating.button";
import { ProductItem } from "@/src/components/product/product.item";
import { FlatList } from "react-native";

export default function ProductPage() {
    return (
        <>
            <FlatList
                data={[1, 2, 3, 4, 5, 6, 7, 8, 9, 10]}
                renderItem={() => (<ProductItem />)}
                keyExtractor={(item) => item.toString()}
                key="product-list"
            />
            <FloatingButton />
        </>
    );
}
// import { FontAwesome6 } from "@expo/vector-icons";
// import { Image, KeyboardAvoidingView, Pressable, StyleSheet, TextInput } from "react-native";
// import { View } from "react-native-reanimated/lib/typescript/Animated";

// export default function ProductLayout({ }: {}) {
//     return (
//         <KeyboardAvoidingView style={{
//             padding: 5,
//             flex: 1,
//             gap: 10
//         }}>

//             <View style={{
//                 width: "100%",
//                 flexDirection: 'row',
//                 gap: 10,
//                 alignItems: 'center',
//             }}>
//                 {image && (
//                     <Pressable
//                         style={{
//                             width: 100,
//                             height: 100,
//                             borderRadius: 5,
//                             overflow: 'hidden',
//                             position: 'relative',
//                             marginTop: 20,
//                             justifyContent: 'center',
//                             alignItems: 'center',
//                         }}
//                         onPress={() => router.back()}
//                     >
//                         <Image
//                             source={{ uri: image }}
//                             style={StyleSheet.absoluteFillObject}
//                         />
//                         <View style={{
//                             ...StyleSheet.absoluteFillObject,
//                             backgroundColor: 'black',
//                             opacity: 0.5,
//                         }} />

//                         <FontAwesome6 name="arrows-rotate" size={22} color="white" />
//                     </Pressable>
//                 )}
//                 <View style={{
//                     flex: 1,
//                     gap: 20,
//                     padding: 5,
//                 }}>
//                     <LabeledInput label="Nombre">
//                         <TextInput
//                             style={styles.input}
//                             placeholder="Nombre"
//                             onChangeText={(text) => setProduct((product) => ({ ...product, name: text }))}
//                         />
//                     </LabeledInput>
//                     <LabeledInput label="Precio">
//                         <View style={{ ...styles.input, flexDirection: "row", gap: 5 }}>
//                             <FontAwesome name="dollar" size={16} color="black" />
//                             <TextInput
//                                 style={{ flex: 1 }}
//                                 placeholder="Precio"
//                                 keyboardType="numeric"
//                                 onChangeText={(text) => setProduct((product) => ({ ...product, price: Number(text) }))}
//                             />
//                         </View>
//                     </LabeledInput>
//                 </View>
//             </View>
//             <LabeledInput label="Descripción">
//                 <TextInput
//                     style={{
//                         ...styles.input,
//                         height: 150,
//                     }}

//                     onChangeText={(text) => setProduct((product) => ({ ...product, description: text }))}
//                     placeholder="Descripción"
//                     multiline={true}
//                 />
//             </LabeledInput>

//             <View style={{
//                 gap: 5,
//                 marginBottom: 20,
//             }}>
//                 <Pressable
//                     style={({ pressed }) => ({
//                         backgroundColor: pressed ? "#333" : "#000",
//                         padding: 14,
//                         borderRadius: 5,
//                         alignItems: "center"
//                     })}

//                     onPress={saveProduct}
//                 >
//                     <Text style={{ color: "white", fontSize: 16 }}>Guardar</Text>
//                 </Pressable>

//                 <Pressable
//                     style={({ pressed }) => ({
//                         backgroundColor: pressed ? "#F69792" : "#F04A41",
//                         padding: 14,
//                         borderRadius: 5,
//                         alignItems: "center"
//                     })}
//                     onPress={cancelProduct}
//                 >
//                     <Text style={{ color: "white", fontSize: 16 }}>Cancelar</Text>
//                 </Pressable>
//             </View>
//         </KeyboardAvoidingVie>
//     )
// }
import { ConnectCommerce } from '@/src/components/mercadopago/connectCommerce';
import { useSession } from '@/src/context/session.context';
import { commerceConsumer } from '@/src/services/client';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, Alert, View, ActivityIndicator } from 'react-native';
import * as Location from 'expo-location';
import { useBusiness } from '@/src/context/business.context';
import { NO_INTERNET_MESSAGE } from '@/src/utils/networkUtils';
import { checkInternetConnection } from '@/src/utils/networkUtils';
import { Picker } from '@react-native-picker/picker';
import { debounce } from 'lodash';

const COUNTRIES = {
  'Argentina': [
    'Buenos Aires',
    'Córdoba',
    'Rosario',
    'Mendoza',
    'San Miguel de Tucumán',
    'La Plata',
    'Mar del Plata',
    'Salta',
    // Add more cities as needed
  ],
  'United States': [
    'New York',
    'Los Angeles',
    'Chicago',
    'Houston',
    'Phoenix',
    'Philadelphia',
    'San Antonio',
    'San Diego',
    // Add more cities as needed
  ]
};

type AddressSuggestion = {
    street: string;
    city: string;
    region: string;
};

export default function RegisterScreen() {
    const { session } = useSession();
    const { setBusiness } = useBusiness();

    const [name, setName] = useState('');
    const [streetName, setStreetName] = useState('');
    const [streetNumber, setStreetNumber] = useState('');
    const [city, setCity] = useState('');
    const [country, setCountry] = useState('Argentina');
    const [coordinates, setCoordinates] = useState<{
        latitude: number;
        longitude: number;
    } | null>(null);
    const [errors, setErrors] = useState({
        name: false,
        streetName: false,
        streetNumber: false,
        city: false,
        country: false
    });
    const [isLoading, setIsLoading] = useState(false);
    const [streetSuggestions, setStreetSuggestions] = useState<AddressSuggestion[]>([]);
    const [showSuggestions, setShowSuggestions] = useState(false);

    const router = useRouter();

    const onPressBack = () => {
        router.back();
    };

    const validateInputs = () => {
        const newErrors = {
            name: name.trim() === '',
            streetName: streetName.trim() === '',
            streetNumber: streetNumber.trim() === '',
            city: city.trim() === '',
            country: country.trim() === ''
        };

        setErrors(newErrors);
        return !Object.values(newErrors).some(error => error);
    };

    const getCurrentLocation = async () => {
        try {
            const { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                Alert.alert('Permission denied', 'Allow location access to continue');
                return;
            }

            const location = await Location.getCurrentPositionAsync({});
            setCoordinates({
                latitude: location.coords.latitude,
                longitude: location.coords.longitude
            });

            // Get address from coordinates (reverse geocoding)
            const [addressInfo] = await Location.reverseGeocodeAsync({
                latitude: location.coords.latitude,
                longitude: location.coords.longitude
            });

            if (addressInfo) {
                // Split street into number and name if possible
                const streetParts = (addressInfo.street || '').split(' ');
                const possibleNumber = streetParts[0];
                
                if (!isNaN(Number(possibleNumber))) {
                    setStreetNumber(possibleNumber);
                    setStreetName(streetParts.slice(1).join(' '));
                } else {
                    setStreetName(addressInfo.street || '');
                }
                
                setCity(addressInfo.city || '');
                setCountry(addressInfo.country || '');
            }
        } catch (error) {
            Alert.alert('Error', 'Could not get current location');
        }
    };

    // const getCoordinatesFromAddress = async () => {
    //     try {
    //         const fullAddress = `${address},${state}, Argentina`;
    //         const results = await Location.geocodeAsync(fullAddress);

    //         if (results.length > 0) {
    //             setCoordinates({
    //                 latitude: results[0].latitude,
    //                 longitude: results[0].longitude
    //             });
    //         } else {
    //             Alert.alert('Error', 'Could not find coordinates for this address');
    //         }
    //     } catch (error) {
    //         Alert.alert('Error', 'Could not get coordinates from address');
    //     }
    // };

    const handleRegister = async () => {
        if (!checkInternetConnection()) {
            Alert.alert(NO_INTERNET_MESSAGE);
            return;
        }

        try {
            if (!validateInputs()) {
                Alert.alert(
                    "Error de validación",
                    "Por favor, complete todos los campos correctamente."
                );
                return;
            }

            setIsLoading(true);

            try {
                const commerce = await commerceConsumer.consume('POST', {
                    data: {
                        userId: session?.user.id,
                        name: name.trim(),
                        address: `${streetNumber.trim()} ${streetName.trim()}`,
                        city: city.trim(),
                        country: country.trim(),
                        latitude: coordinates?.latitude,
                        longitude: coordinates?.longitude
                    }
                });
                
                // Wait for business context to update
                await setBusiness(commerce);

                Alert.alert(
                    "Éxito",
                    "Comercio creado exitosamente. ¿Desea conectar con Mercado Pago?",
                    [
                        {
                            text: "Conectar",
                            onPress: async () => {
                                // Ensure business is set before navigating
                                if (commerce?.id) {
                                    router.push({
                                        pathname: '/(app)/',
                                        params: {
                                            showMPConnect: 'true'
                                        }
                                    });
                                }
                            }
                        },
                        {
                            text: "Más tarde",
                            onPress: () => router.replace('/(app)/')
                        }
                    ]
                );

            } catch (error) {
                console.error('Error al crear comercio:', error);
                Alert.alert(
                    "Error",
                    "Hubo un error al crear el comercio. Por favor, intente nuevamente."
                );
            }
        } catch (error) {
            console.error('Error al crear comercio:', error);
            Alert.alert(
                "Error",
                "Hubo un error al crear el comercio. Por favor, intente nuevamente."
            );
        } finally {
            setIsLoading(false);
        }
    };

    const availableCities = COUNTRIES[country as keyof typeof COUNTRIES] || [];

    const fetchAddressSuggestions = debounce(async (text: string) => {
        if (!text || text.length < 3) {
            setStreetSuggestions([]);
            return;
        }

        try {
            const searchAddress = `${text}, ${city}, ${country}`;
            const results = await Location.geocodeAsync(searchAddress);
            
            if (results.length > 0) {
                const suggestions = await Promise.all(
                    results.map(async (result) => {
                        const [address] = await Location.reverseGeocodeAsync({
                            latitude: result.latitude,
                            longitude: result.longitude,
                        });
                        return {
                            street: address.street || '',
                            city: address.city || '',
                            region: address.region || '',
                        };
                    })
                );

                setStreetSuggestions(suggestions);
                setShowSuggestions(true);
            }
        } catch (error) {
            console.error('Error fetching suggestions:', error);
            setStreetSuggestions([]);
        }
    }, 500);

    const handleSuggestionSelect = (suggestion: AddressSuggestion) => {
        const streetParts = suggestion.street.split(' ');
        const possibleNumber = streetParts[0];
        
        if (!isNaN(Number(possibleNumber))) {
            setStreetNumber(possibleNumber);
            setStreetName(streetParts.slice(1).join(' '));
        } else {
            setStreetName(suggestion.street);
        }
        
        setShowSuggestions(false);
    };

    return (
        <ScrollView style={styles.scrollView}>
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={styles.container}
            >
                <Text style={styles.title}>Crear comercio</Text>

                <TextInput
                    placeholder="Nombre"
                    value={name}
                    onChangeText={setName}
                    style={[
                        styles.input,
                        errors.name && styles.inputError
                    ]}
                />
                {errors.name && (
                    <Text style={styles.errorText}>El nombre es requerido</Text>
                )}

<View style={[styles.pickerContainer, errors.country && styles.inputError]}>
                    <Picker
                        selectedValue={country}
                        onValueChange={(itemValue) => {
                            setCountry(itemValue);
                            setCity(''); // Reset city when country changes
                        }}
                        style={styles.picker}
                    >
                        <Picker.Item label="Argentina" value="Argentina" />
                        <Picker.Item label="United States" value="United States" />
                    </Picker>
                </View>
                {errors.country && (
                    <Text style={styles.errorText}>El país es requerido</Text>
                )}

                <View style={[styles.pickerContainer, errors.city && styles.inputError]}>
                    <Picker
                        selectedValue={city}
                        onValueChange={(itemValue) => setCity(itemValue)}
                        style={styles.picker}
                    >
                        <Picker.Item label="Seleccionar ciudad" value="" />
                        {availableCities.map((cityName) => (
                            <Picker.Item key={cityName} label={cityName} value={cityName} />
                        ))}
                    </Picker>
                </View>
                {errors.city && (
                    <Text style={styles.errorText}>La ciudad es requerida</Text>
                )}


                <View style={styles.addressContainer}>
                    <TextInput
                        placeholder="Número"
                        value={streetNumber}
                        onChangeText={setStreetNumber}
                        keyboardType="numeric"
                        style={[
                            styles.numberInput,
                            errors.streetNumber && styles.inputError
                        ]}
                    />
                    <View style={styles.streetInputContainer}>
                        <TextInput
                            placeholder="Calle"
                            value={streetName}
                            onChangeText={(text) => {
                                setStreetName(text);
                                fetchAddressSuggestions(text);
                            }}
                            style={[
                                styles.streetInput,
                                errors.streetName && styles.inputError
                            ]}
                        />
                        {showSuggestions && streetSuggestions.length > 0 && (
                            <View style={styles.suggestionsContainer}>
                                {streetSuggestions.map((suggestion, index) => (
                                    <Pressable
                                        key={index}
                                        style={styles.suggestionItem}
                                        onPress={() => handleSuggestionSelect(suggestion)}
                                    >
                                        <Text style={styles.suggestionText}>
                                            {suggestion.street}
                                        </Text>
                                        <Text style={styles.suggestionSubtext}>
                                            {suggestion.city}, {suggestion.region}
                                        </Text>
                                    </Pressable>
                                ))}
                            </View>
                        )}
                    </View>
                </View>
                {(errors.streetName || errors.streetNumber) && (
                    <Text style={styles.errorText}>La dirección completa es requerida</Text>
                )}

               
                <Pressable 
                    style={styles.locationButton} 
                    onPress={getCurrentLocation}
                >
                    <Text style={styles.locationButtonText}>Usar ubicación actual</Text>
                </Pressable>

                {coordinates && (
                    <Text style={styles.coordinatesText}>
                        Ubicación: {coordinates.latitude.toFixed(6)}, {coordinates.longitude.toFixed(6)}
                    </Text>
                )}

                <Pressable 
                    style={[
                        styles.registerButton,
                        { opacity: isLoading ? 0.7 : 1 }
                    ]} 
                    onPress={handleRegister}
                    disabled={isLoading}
                >
                    {isLoading ? (
                        <ActivityIndicator color="white" />
                    ) : (
                        <Text style={styles.registerButtonText}>Registrar Comercio</Text>
                    )}
                </Pressable>

                <Pressable onPress={onPressBack}>
                    <Text style={styles.loginLink}>Volver</Text>
                </Pressable>

                {/* <ConnectCommerce redirect_uri='https://varied-laurella-rescue-bafbd5dd.koyeb.app/api/auth/mercadopago' /> */}
            </KeyboardAvoidingView>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    scrollView: {
        flex: 1,
        backgroundColor: '#fafafa',
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 20,
        backgroundColor: '#fafafa',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 30,
        textAlign: 'center',
        color: '#D4685E',
    },
    input: {
        backgroundColor: 'white',
        padding: 15,
        borderRadius: 5,
        fontSize: 16,
        marginBottom: 15,
        shadowColor: 'black',
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 1 },
    },
    inputError: {
        borderWidth: 1,
        borderColor: '#D4685E',
    },
    errorText: {
        color: '#D4685E',
        fontSize: 12,
        marginBottom: 10,
        marginTop: -10,
    },
    registerButton: {
        backgroundColor: '#D4685E',
        padding: 15,
        borderRadius: 5,
        alignItems: 'center',
        marginTop: 20,
    },
    registerButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
    loginLink: {
        textAlign: 'center',
        marginTop: 20,
        color: '#8D6E63',
        fontSize: 16,
    },
    locationButton: {
        backgroundColor: '#4CAF50',
        padding: 15,
        borderRadius: 5,
        marginVertical: 10,
    },
    locationButtonText: {
        color: 'white',
        textAlign: 'center',
        fontWeight: 'bold',
    },
    coordinatesText: {
        textAlign: 'center',
        color: '#666',
        marginVertical: 10,
    },
    addressContainer: {
        flexDirection: 'row',
        gap: 10,
        marginBottom: 15,
    },
    numberInput: {
        flex: 1,
        backgroundColor: 'white',
        padding: 15,
        borderRadius: 5,
        fontSize: 16,
        shadowColor: 'black',
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 1 },
    },
    streetInput: {
        flex: 3,
        backgroundColor: 'white',
        padding: 15,
        borderRadius: 5,
        fontSize: 16,
        shadowColor: 'black',
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 1 },
    },
    pickerContainer: {
        backgroundColor: 'white',
        borderRadius: 5,
        marginBottom: 15,
        shadowColor: 'black',
        shadowOpacity: 0.1,
        shadowOffset: { width: 0, height: 1 },
    },
    picker: {
        height: 50,
        width: '100%',
    },
    streetInputContainer: {
        flex: 3,
        position: 'relative',
    },
    suggestionsContainer: {
        position: 'absolute',
        top: '100%',
        left: 0,
        right: 0,
        backgroundColor: 'white',
        borderRadius: 5,
        marginTop: 5,
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        zIndex: 1000,
        maxHeight: 200,
    },
    suggestionItem: {
        padding: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    suggestionText: {
        fontSize: 16,
    },
    suggestionSubtext: {
        fontSize: 12,
        color: '#666',
    },
});
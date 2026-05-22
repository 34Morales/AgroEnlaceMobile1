import AsyncStorage from '@react-native-async-storage/async-storage';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useEffect, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';

import CheckoutScreen from '../screens/CheckoutScreen';
import HomeScreen from '../screens/HomeScreen';
import LoginScreen from '../screens/LoginScreen';
import OrdersScreen from '../screens/OrdersScreen';
import ProductDetailScreen from '../screens/ProductDetailScreen';
import ProfileScreen from '../screens/ProfileScreen';
import RegisterScreen from '../screens/RegisterScreen';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  const [loading, setLoading] = useState(true);
  const [initialRoute, setInitialRoute] = useState('Login');

  useEffect(() => {
    checkToken();
  }, []);

  const checkToken = async () => {
    const token = await AsyncStorage.getItem('token');

    if (token) {
      setInitialRoute('Home');
    }

    setLoading(false);
  };

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#2E7D32" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName={initialRoute}>
        <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Register" component={RegisterScreen} options={{ title: 'Crear cuenta' }} />
        <Stack.Screen name="Home" component={HomeScreen} options={{ title: 'AgroEnlace' }} />
        <Stack.Screen name="ProductDetail" component={ProductDetailScreen} options={{ title: 'Producto' }} />
        <Stack.Screen name="Checkout" component={CheckoutScreen} options={{ title: 'Pago con PayPal' }} />
        <Stack.Screen name="Orders" component={OrdersScreen} options={{ title: 'Mis pedidos' }} />
        <Stack.Screen name="Profile" component={ProfileScreen} options={{ title: 'Mi perfil' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
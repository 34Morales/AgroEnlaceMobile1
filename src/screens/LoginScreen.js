import AsyncStorage from '@react-native-async-storage/async-storage';
import { useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { api } from '../api/api';

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('moralesamuel2003@gmail.com');
  const [password, setPassword] = useState('12345678');
  const [loading, setLoading] = useState(false);

  const login = async () => {
    if (!email || !password) {
      Alert.alert('Campos requeridos', 'Ingresa tu correo y contraseña.');
      return;
    }

    try {
      setLoading(true);

      const response = await api.post('/login', {
        email,
        password,
      });

      await AsyncStorage.setItem('token', response.data.token);
      await AsyncStorage.setItem('user', JSON.stringify(response.data.user));

      navigation.replace('Home');
    } catch (error) {
      Alert.alert(
        'Error',
        error.response?.data?.message || 'No se pudo iniciar sesión.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.logo}>🌾 AgroEnlace</Text>
      <Text style={styles.subtitle}>Marketplace agrícola móvil</Text>

      <View style={styles.card}>
        <Text style={styles.title}>Iniciar sesión</Text>

        <TextInput
          style={styles.input}
          placeholder="Correo electrónico"
          keyboardType="email-address"
          autoCapitalize="none"
          value={email}
          onChangeText={setEmail}
        />

        <TextInput
          style={styles.input}
          placeholder="Contraseña"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        <TouchableOpacity style={styles.button} onPress={login} disabled={loading}>
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Entrar</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity onPress={() => navigation.navigate('Register')}>
          <Text style={styles.link}>¿No tienes cuenta? Crear cuenta</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F4F6F9',
    justifyContent: 'center',
    padding: 24,
  },
  logo: {
    fontSize: 38,
    fontWeight: '900',
    color: '#2E7D32',
    textAlign: 'center',
  },
  subtitle: {
    textAlign: 'center',
    color: '#666',
    marginBottom: 30,
    fontSize: 16,
  },
  card: {
    backgroundColor: '#fff',
    padding: 24,
    borderRadius: 24,
    elevation: 5,
  },
  title: {
    fontSize: 26,
    fontWeight: '900',
    color: '#1B5E20',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 14,
    padding: 14,
    marginBottom: 14,
    fontSize: 16,
    backgroundColor: '#FAFAFA',
  },
  button: {
    backgroundColor: '#2E7D32',
    padding: 16,
    borderRadius: 14,
    alignItems: 'center',
    marginTop: 6,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '900',
    fontSize: 16,
  },
  link: {
    textAlign: 'center',
    marginTop: 18,
    color: '#2E7D32',
    fontWeight: 'bold',
  },
});
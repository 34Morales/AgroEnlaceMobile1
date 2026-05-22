import { useState } from 'react';
import {
    Alert,
    Image,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';

export default function ProductDetailScreen({ route, navigation }) {
  const { product } = route.params;
  const [quantity, setQuantity] = useState('1');

  const goToCheckout = () => {
    const qty = parseInt(quantity);

    if (!qty || qty < 1) {
      Alert.alert('Cantidad inválida', 'Ingresa una cantidad válida.');
      return;
    }

    if (qty > product.quantity) {
      Alert.alert('Stock insuficiente', `Solo hay ${product.quantity} disponibles.`);
      return;
    }

    navigation.navigate('Checkout', {
      product,
      quantity: qty,
    });
  };

  return (
    <ScrollView style={styles.container}>
      <Image source={{ uri: product.image }} style={styles.image} />

      <View style={styles.content}>
        <Text style={styles.title}>{product.name}</Text>

        <Text style={styles.description}>
          {product.description}
        </Text>

        <View style={styles.infoBox}>
          <Text style={styles.infoText}>📍 Ubicación: {product.location}</Text>
          <Text style={styles.infoText}>📦 Stock disponible: {product.quantity}</Text>
        </View>

        <Text style={styles.price}>
          ${product.price} MXN
        </Text>

        <Text style={styles.label}>Cantidad a comprar</Text>

        <TextInput
          style={styles.input}
          keyboardType="numeric"
          value={quantity}
          onChangeText={setQuantity}
          placeholder="Cantidad"
        />

        <View style={styles.totalBox}>
          <Text style={styles.totalLabel}>Total estimado</Text>
          <Text style={styles.total}>
            ${(Number(product.price) * Number(quantity || 0)).toFixed(2)} MXN
          </Text>
        </View>

        <TouchableOpacity style={styles.button} onPress={goToCheckout}>
          <Text style={styles.buttonText}>💳 Continuar al pago</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F4F6F9',
  },
  image: {
    width: '100%',
    height: 260,
  },
  content: {
    padding: 22,
  },
  title: {
    fontSize: 30,
    fontWeight: '900',
    color: '#1B5E20',
    marginBottom: 12,
  },
  description: {
    fontSize: 16,
    color: '#666',
    lineHeight: 23,
    marginBottom: 18,
  },
  infoBox: {
    backgroundColor: '#E8F5E9',
    padding: 16,
    borderRadius: 18,
    marginBottom: 18,
  },
  infoText: {
    color: '#1B5E20',
    fontWeight: 'bold',
    marginBottom: 6,
  },
  price: {
    fontSize: 32,
    fontWeight: '900',
    color: '#2E7D32',
    marginBottom: 20,
  },
  label: {
    color: '#1B5E20',
    fontWeight: '900',
    marginBottom: 8,
    fontSize: 16,
  },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 14,
    padding: 14,
    fontSize: 16,
    marginBottom: 18,
  },
  totalBox: {
    backgroundColor: '#fff',
    padding: 18,
    borderRadius: 18,
    marginBottom: 22,
    elevation: 3,
  },
  totalLabel: {
    color: '#666',
    fontSize: 15,
  },
  total: {
    color: '#2E7D32',
    fontSize: 28,
    fontWeight: '900',
    marginTop: 5,
  },
  button: {
    backgroundColor: '#2E7D32',
    padding: 17,
    borderRadius: 16,
    alignItems: 'center',
    marginBottom: 30,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '900',
    fontSize: 16,
  },
});
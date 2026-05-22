import { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    FlatList,
    Image,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { api } from '../api/api';

export default function HomeScreen({ navigation }) {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const response = await api.get('/products', {
        params: { search },
      });
      setProducts(response.data.products);
    } catch (error) {
      console.log(error.response?.data || error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const renderProduct = ({ item }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => navigation.navigate('ProductDetail', { product: item })}
    >
      <Image source={{ uri: item.image }} style={styles.image} />

      <View style={styles.cardBody}>
        <Text style={styles.productName}>{item.name}</Text>
        <Text style={styles.description} numberOfLines={2}>
          {item.description}
        </Text>

        <Text style={styles.location}>📍 {item.location}</Text>
        <Text style={styles.stock}>📦 Stock: {item.quantity}</Text>
        <Text style={styles.price}>${item.price} MXN</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.topActions}>
        <TouchableOpacity
          style={styles.smallButton}
          onPress={() => navigation.navigate('Orders')}
        >
          <Text style={styles.smallButtonText}>Pedidos</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.smallButton}
          onPress={() => navigation.navigate('Profile')}
        >
          <Text style={styles.smallButtonText}>Perfil</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.title}>🌾 AgroEnlace</Text>
      <Text style={styles.subtitle}>Productos agrícolas disponibles</Text>

      <View style={styles.searchRow}>
        <TextInput
          style={styles.search}
          placeholder="Buscar productos..."
          value={search}
          onChangeText={setSearch}
        />

        <TouchableOpacity style={styles.searchButton} onPress={loadProducts}>
          <Text style={styles.searchButtonText}>Buscar</Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#2E7D32" style={{ marginTop: 40 }} />
      ) : (
        <FlatList
          data={products}
          keyExtractor={(item) => String(item.id)}
          renderItem={renderProduct}
          contentContainerStyle={{ paddingBottom: 30 }}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 18,
    backgroundColor: '#F4F6F9',
  },
  topActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 10,
    marginBottom: 10,
  },
  smallButton: {
    backgroundColor: '#2E7D32',
    paddingVertical: 9,
    paddingHorizontal: 14,
    borderRadius: 12,
  },
  smallButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  title: {
    fontSize: 34,
    fontWeight: '900',
    color: '#2E7D32',
  },
  subtitle: {
    color: '#666',
    marginBottom: 18,
  },
  searchRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 18,
  },
  search: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 13,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  searchButton: {
    backgroundColor: '#8BC34A',
    borderRadius: 14,
    paddingHorizontal: 16,
    justifyContent: 'center',
  },
  searchButtonText: {
    color: '#fff',
    fontWeight: '900',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 22,
    marginBottom: 18,
    overflow: 'hidden',
    elevation: 4,
  },
  image: {
    width: '100%',
    height: 180,
  },
  cardBody: {
    padding: 18,
  },
  productName: {
    fontSize: 22,
    fontWeight: '900',
    color: '#1B5E20',
  },
  description: {
    color: '#666',
    marginVertical: 8,
  },
  location: {
    color: '#333',
    marginBottom: 4,
  },
  stock: {
    color: '#777',
  },
  price: {
    marginTop: 10,
    fontSize: 25,
    color: '#2E7D32',
    fontWeight: '900',
  },
});
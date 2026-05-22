import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    FlatList,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { api } from '../api/api';

export default function OrdersScreen({ navigation }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadOrders = async () => {
    try {
      setLoading(true);

      const token = await AsyncStorage.getItem('token');

      const response = await api.get('/orders', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setOrders(response.data.orders);
    } catch (error) {
      console.log(error.response?.data || error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', loadOrders);
    return unsubscribe;
  }, [navigation]);

  const renderOrder = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <Text style={styles.productName}>
          🌽 {item.product?.name || 'Producto no disponible'}
        </Text>

        <Text style={styles.orderId}>
          #{item.id}
        </Text>
      </View>

      <Text style={styles.text}>📦 Cantidad: {item.quantity}</Text>

      <Text style={styles.total}>
        Total: ${Number(item.total || 0).toFixed(2)} MXN
      </Text>

      <View style={styles.statusRow}>
        <View style={styles.statusBadge}>
          <Text style={styles.statusText}>
            {item.status === 'completed' ? '✅ Completado' : '⏳ Pendiente'}
          </Text>
        </View>

        <View style={styles.paymentBadge}>
          <Text style={styles.paymentText}>
            {item.payment_status === 'paid' ? '💳 Pagado' : '⏳ Pago pendiente'}
          </Text>
        </View>
      </View>

      <View style={styles.detailBox}>
        <Text style={styles.detailTitle}>🚚 Envío</Text>
        <Text style={styles.detailText}>Recibe: {item.shipping_name || 'No registrado'}</Text>
        <Text style={styles.detailText}>Tel: {item.shipping_phone || 'No registrado'}</Text>
        <Text style={styles.detailText}>
          Dirección: {item.shipping_street || 'No registrado'}
        </Text>
        <Text style={styles.detailText}>
          {item.shipping_city || ''}, {item.shipping_state || ''}
        </Text>
        <Text style={styles.detailText}>
          CP: {item.shipping_postal_code || 'No registrado'}
        </Text>
      </View>

      <View style={styles.detailBox}>
        <Text style={styles.detailTitle}>💳 Pago</Text>
        <Text style={styles.detailText}>Método: {item.payment_method || 'No registrado'}</Text>
        <Text style={styles.detailText}>PayPal ID:</Text>
        <Text style={styles.paypalId}>
          {item.paypal_order_id || 'No registrado'}
        </Text>
      </View>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color="#2E7D32" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {orders.length === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.emptyTitle}>😢 No tienes pedidos</Text>
          <Text style={styles.emptyText}>
            Compra productos agrícolas para verlos aquí.
          </Text>

          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate('Home')}
          >
            <Text style={styles.buttonText}>Ir al marketplace</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={orders}
          keyExtractor={(item) => String(item.id)}
          renderItem={renderOrder}
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
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 22,
    padding: 20,
    marginBottom: 18,
    elevation: 4,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
    marginBottom: 10,
  },
  productName: {
    flex: 1,
    color: '#1B5E20',
    fontSize: 21,
    fontWeight: '900',
  },
  orderId: {
    color: '#777',
    fontWeight: 'bold',
  },
  text: {
    color: '#555',
    marginBottom: 6,
  },
  total: {
    color: '#2E7D32',
    fontSize: 24,
    fontWeight: '900',
    marginVertical: 10,
  },
  statusRow: {
    flexDirection: 'row',
    gap: 10,
    flexWrap: 'wrap',
    marginBottom: 16,
  },
  statusBadge: {
    backgroundColor: '#D4EDDA',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
  },
  statusText: {
    color: '#155724',
    fontWeight: 'bold',
  },
  paymentBadge: {
    backgroundColor: '#E8F5E9',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
  },
  paymentText: {
    color: '#1B5E20',
    fontWeight: 'bold',
  },
  detailBox: {
    backgroundColor: '#FAFAFA',
    padding: 14,
    borderRadius: 16,
    marginTop: 10,
  },
  detailTitle: {
    color: '#2E7D32',
    fontWeight: '900',
    marginBottom: 8,
    fontSize: 17,
  },
  detailText: {
    color: '#555',
    marginBottom: 4,
  },
  paypalId: {
    color: '#555',
    backgroundColor: '#eee',
    padding: 8,
    borderRadius: 10,
    marginTop: 4,
  },
  empty: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyTitle: {
    fontSize: 28,
    fontWeight: '900',
    color: '#2E7D32',
  },
  emptyText: {
    color: '#666',
    marginTop: 10,
    marginBottom: 20,
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#2E7D32',
    paddingVertical: 14,
    paddingHorizontal: 22,
    borderRadius: 14,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '900',
  },
});
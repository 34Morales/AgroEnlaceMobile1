import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { WebView } from 'react-native-webview';
import { WEB_URL } from '../api/api';

export default function CheckoutScreen({ route, navigation }) {
  const { product, quantity } = route.params;

  const checkoutUrl = `${WEB_URL}/checkout/${product.id}?quantity=${quantity}`;

  return (
    <View style={styles.container}>
      <WebView
        source={{ uri: checkoutUrl }}
        style={styles.webview}
        startInLoadingState
        renderLoading={() => (
          <View style={styles.loading}>
            <ActivityIndicator size="large" color="#2E7D32" />
            <Text style={styles.loadingText}>Cargando pago seguro...</Text>
          </View>
        )}
        onNavigationStateChange={(navState) => {
          if (navState.url.includes('/my-orders')) {
            navigation.replace('Orders');
          }
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  webview: {
    flex: 1,
  },
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    color: '#2E7D32',
    fontWeight: 'bold',
  },
});
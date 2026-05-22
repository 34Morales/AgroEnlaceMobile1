import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { api } from '../api/api';

export default function ProfileScreen({ navigation }) {
  const [user, setUser] = useState(null);
  const [game, setGame] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadProfile = async () => {
    try {
      setLoading(true);

      const token = await AsyncStorage.getItem('token');

      const userResponse = await api.get('/user', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const gameResponse = await api.get('/gamification', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setUser(userResponse.data.user);
      setGame(gameResponse.data);
    } catch (error) {
      console.log(error.response?.data || error.message);
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      const token = await AsyncStorage.getItem('token');

      await api.post(
        '/logout',
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
    } catch (error) {
      console.log(error.response?.data || error.message);
    } finally {
      await AsyncStorage.removeItem('token');
      await AsyncStorage.removeItem('user');
      navigation.replace('Login');
    }
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', loadProfile);
    return unsubscribe;
  }, [navigation]);

  if (loading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color="#2E7D32" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.profileCard}>
        <Text style={styles.avatar}>👤</Text>

        <Text style={styles.name}>
          {user?.name}
        </Text>

        <Text style={styles.email}>
          {user?.email}
        </Text>
      </View>

      <View style={styles.gameCard}>
        <Text style={styles.title}>🏆 Gamificación</Text>
        <Text style={styles.subtitle}>
          Compra productos y participa para ganar puntos.
        </Text>

        <View style={styles.statsRow}>
          <View style={styles.statBox}>
            <Text style={styles.statLabel}>Puntos</Text>
            <Text style={styles.statValue}>{game?.points ?? 0}</Text>
          </View>

          <View style={styles.statBox}>
            <Text style={styles.statLabel}>Nivel</Text>
            <Text style={styles.statValue}>{game?.level ?? 'Bronce'}</Text>
          </View>
        </View>

        <View style={styles.badgesBox}>
          <Text style={styles.badgesTitle}>🎖 Insignias</Text>

          {game?.badges && game.badges.length > 0 ? (
            game.badges.map((badge, index) => (
              <Text key={index} style={styles.badge}>
                {badge}
              </Text>
            ))
          ) : (
            <Text style={styles.noBadges}>
              Aún no tienes insignias.
            </Text>
          )}
        </View>
      </View>

      <TouchableOpacity
        style={styles.ordersButton}
        onPress={() => navigation.navigate('Orders')}
      >
        <Text style={styles.ordersButtonText}>📦 Ver mis pedidos</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.logoutButton}
        onPress={() => {
          Alert.alert(
            'Cerrar sesión',
            '¿Seguro que quieres cerrar sesión?',
            [
              { text: 'Cancelar', style: 'cancel' },
              { text: 'Cerrar sesión', onPress: logout, style: 'destructive' },
            ]
          );
        }}
      >
        <Text style={styles.logoutText}>🚪 Cerrar sesión</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F4F6F9',
    padding: 18,
  },
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileCard: {
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: 28,
    alignItems: 'center',
    elevation: 4,
    marginBottom: 20,
  },
  avatar: {
    fontSize: 55,
    marginBottom: 10,
  },
  name: {
    fontSize: 26,
    fontWeight: '900',
    color: '#1B5E20',
    textAlign: 'center',
  },
  email: {
    color: '#666',
    marginTop: 6,
  },
  gameCard: {
    backgroundColor: '#2E7D32',
    borderRadius: 24,
    padding: 24,
    marginBottom: 20,
  },
  title: {
    color: '#fff',
    fontSize: 27,
    fontWeight: '900',
  },
  subtitle: {
    color: '#E8F5E9',
    marginTop: 6,
    marginBottom: 20,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 14,
  },
  statBox: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.18)',
    borderRadius: 18,
    padding: 18,
    alignItems: 'center',
  },
  statLabel: {
    color: '#E8F5E9',
    fontWeight: 'bold',
  },
  statValue: {
    color: '#fff',
    fontSize: 25,
    fontWeight: '900',
    marginTop: 5,
  },
  badgesBox: {
    marginTop: 20,
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 18,
    padding: 16,
  },
  badgesTitle: {
    color: '#fff',
    fontWeight: '900',
    fontSize: 18,
    marginBottom: 10,
  },
  badge: {
    backgroundColor: '#fff',
    color: '#1B5E20',
    padding: 10,
    borderRadius: 14,
    marginBottom: 8,
    fontWeight: 'bold',
  },
  noBadges: {
    color: '#E8F5E9',
  },
  ordersButton: {
    backgroundColor: '#8BC34A',
    padding: 16,
    borderRadius: 16,
    alignItems: 'center',
    marginBottom: 14,
  },
  ordersButtonText: {
    color: '#fff',
    fontWeight: '900',
    fontSize: 16,
  },
  logoutButton: {
    backgroundColor: '#D32F2F',
    padding: 16,
    borderRadius: 16,
    alignItems: 'center',
    marginBottom: 30,
  },
  logoutText: {
    color: '#fff',
    fontWeight: '900',
    fontSize: 16,
  },
});
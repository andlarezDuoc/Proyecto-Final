import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, SafeAreaView, TouchableOpacity, StatusBar, Alert } from 'react-native';
import { supabase } from './lib/supabase';
import { artists, Artist } from './lib/data/artists';
import { HomeScreen } from './screens/HomeScreen';
import { ArtistDetailScreen } from './screens/ArtistDetailScreen';
import { BookingScreen } from './screens/BookingScreen';
import { HealingReportScreen } from './screens/HealingReportScreen';
import { LoginScreen } from './screens/LoginScreen';
import { BookOpen, Camera, User, LogOut } from 'lucide-react-native';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<'home' | 'artist-detail' | 'booking' | 'healing' | 'account'>('home');
  const [selectedArtistId, setSelectedArtistId] = useState<string | null>(null);
  
  // Estado de sesión
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [userRole, setUserRole] = useState<string | null>(null);

  useEffect(() => {
    // Verificar sesión inicial
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        setUserEmail(session.user.email || '');
        setUserRole(session.user.user_metadata?.role || 'client');
      }
    };
    checkSession();

    // Escuchar cambios de autenticación en Supabase
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      if (session?.user) {
        setUserEmail(session.user.email || '');
        setUserRole(session.user.user_metadata?.role || 'client');
      } else {
        setUserEmail(null);
        setUserRole(null);
      }
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const handleSelectArtist = (id: string) => {
    setSelectedArtistId(id);
    setCurrentScreen('artist-detail');
  };

  const handleBookArtist = (id: string) => {
    setSelectedArtistId(id);
    setCurrentScreen('booking');
  };

  const handleLogout = async () => {
    Alert.alert(
      'Cerrar Sesión',
      '¿Estás seguro de que deseas cerrar sesión?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Salir',
          style: 'destructive',
          onPress: async () => {
            await supabase.auth.signOut();
            setUserEmail(null);
            setUserRole(null);
            setCurrentScreen('home');
          }
        }
      ]
    );
  };

  const activeArtist = artists.find(a => a.id === selectedArtistId) || artists[0];

  // Renderizar la pantalla correspondiente
  const renderScreen = () => {
    switch (currentScreen) {
      case 'home':
        return (
          <HomeScreen 
            onSelectArtist={handleSelectArtist}
            onBookArtist={handleBookArtist}
          />
        );
      case 'artist-detail':
        return (
          <ArtistDetailScreen 
            artist={activeArtist}
            onBack={() => setCurrentScreen('home')}
            onBook={() => setCurrentScreen('booking')}
          />
        );
      case 'booking':
        return (
          <BookingScreen 
            artist={activeArtist}
            userEmail={userEmail}
            onBack={() => setCurrentScreen('artist-detail')}
            onNavigateToLogin={() => setCurrentScreen('account')}
          />
        );
      case 'healing':
        if (!userEmail || userRole !== 'client') {
          return (
            <View style={styles.authGateContainer}>
              <Camera size={48} color="#444" style={{ marginBottom: 16 }} />
              <Text style={styles.authGateTitle}>Reporte Clínico Cerrado</Text>
              <Text style={styles.authGateText}>
                Debes iniciar sesión con tu cuenta de cliente para enviar fotografías de tu cicatrización.
              </Text>
              <TouchableOpacity 
                style={styles.authGateButton} 
                onPress={() => setCurrentScreen('account')}
              >
                <Text style={styles.authGateButtonText}>Iniciar Sesión</Text>
              </TouchableOpacity>
            </View>
          );
        }
        return (
          <HealingReportScreen 
            artist={activeArtist} // Envía al artista actual por defecto
            onBack={() => setCurrentScreen('home')}
          />
        );
      case 'account':
        if (userEmail) {
          return (
            <View style={styles.profileContainer}>
              <View style={styles.profileCard}>
                <View style={styles.avatarPlaceholder}>
                  <Text style={styles.avatarText}>{userEmail.substring(0, 2).toUpperCase()}</Text>
                </View>
                <Text style={styles.profileEmail}>{userEmail}</Text>
                <Text style={styles.profileRole}>
                  Rol: {userRole === 'client' ? 'Cliente Registrado' : 'Tatuador'}
                </Text>

                <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
                  <LogOut size={16} color="#ef4444" style={{ marginRight: 6 }} />
                  <Text style={styles.logoutButtonText}>Cerrar Sesión</Text>
                </TouchableOpacity>
              </View>
            </View>
          );
        }
        return (
          <LoginScreen 
            onLoginSuccess={(email, role) => {
              setUserEmail(email);
              setUserRole(role);
              setCurrentScreen('home');
            }}
          />
        );
      default:
        return <HomeScreen onSelectArtist={handleSelectArtist} onBookArtist={handleBookArtist} />;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#000" />
      
      {/* Contenido principal */}
      <View style={styles.content}>
        {renderScreen()}
      </View>

      {/* Barra de Navegación Inferior (Tabs) */}
      <View style={styles.tabBar}>
        <TouchableOpacity 
          style={[styles.tabItem, currentScreen === 'home' && styles.tabItemActive]}
          onPress={() => setCurrentScreen('home')}
        >
          <BookOpen size={20} color={currentScreen === 'home' ? '#fff' : '#666'} />
          <Text style={[styles.tabLabel, currentScreen === 'home' && styles.tabLabelActive]}>Catálogo</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.tabItem, currentScreen === 'healing' && styles.tabItemActive]}
          onPress={() => setCurrentScreen('healing')}
        >
          <Camera size={20} color={currentScreen === 'healing' ? '#fff' : '#666'} />
          <Text style={[styles.tabLabel, currentScreen === 'healing' && styles.tabLabelActive]}>Cicatrización</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.tabItem, currentScreen === 'account' && styles.tabItemActive]}
          onPress={() => setCurrentScreen('account')}
        >
          <User size={20} color={currentScreen === 'account' ? '#fff' : '#666'} />
          <Text style={[styles.tabLabel, currentScreen === 'account' && styles.tabLabelActive]}>
            {userEmail ? 'Perfil' : 'Ingresar'}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  content: {
    flex: 1,
  },
  tabBar: {
    flexDirection: 'row',
    height: 60,
    backgroundColor: '#09090b',
    borderTopWidth: 1,
    borderColor: '#18181b',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  tabItem: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    height: '100%',
    opacity: 0.6,
  },
  tabItemActive: {
    opacity: 1,
  },
  tabLabel: {
    fontSize: 10,
    color: '#666',
    marginTop: 4,
    fontWeight: '600',
  },
  tabLabelActive: {
    color: '#fff',
    fontWeight: 'bold',
  },
  authGateContainer: {
    flex: 1,
    backgroundColor: '#000',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 30,
  },
  authGateTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  authGateText: {
    fontSize: 13,
    color: '#888',
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 24,
    paddingHorizontal: 20,
  },
  authGateButton: {
    height: 40,
    backgroundColor: '#fff',
    borderRadius: 8,
    paddingHorizontal: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  authGateButtonText: {
    color: '#000',
    fontSize: 14,
    fontWeight: 'bold',
  },
  profileContainer: {
    flex: 1,
    backgroundColor: '#000',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  profileCard: {
    backgroundColor: '#121212',
    borderWidth: 1,
    borderColor: '#222',
    borderRadius: 24,
    padding: 30,
    width: '100%',
    alignItems: 'center',
  },
  avatarPlaceholder: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#333',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  avatarText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  },
  profileEmail: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  profileRole: {
    fontSize: 13,
    color: '#888',
    marginBottom: 24,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 40,
    borderWidth: 1,
    borderColor: '#ef4444/30',
    borderRadius: 8,
    backgroundColor: '#ef4444/10',
    paddingHorizontal: 16,
  },
  logoutButtonText: {
    color: '#ef4444',
    fontSize: 13.5,
    fontWeight: 'bold',
  },
});

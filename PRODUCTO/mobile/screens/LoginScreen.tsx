import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, ScrollView, ActivityIndicator, Alert } from 'react-native';
import { supabase } from '../lib/supabase';
import { ShieldCheck, User, Mail, Lock, LogIn } from 'lucide-react-native';

interface LoginScreenProps {
  onLoginSuccess: (email: string, role: string) => void;
}

export function LoginScreen({ onLoginSuccess }: LoginScreenProps) {
  const [isRegistering, setIsRegistering] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [role, setRole] = useState<'client' | 'artist'>('client');
  const [loading, setLoading] = useState(false);

  const handleAuth = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert('Campos requeridos', 'Por favor ingresa tu correo y contraseña.');
      return;
    }

    if (isRegistering && !fullName.trim()) {
      Alert.alert('Campo requerido', 'Por favor ingresa tu nombre completo.');
      return;
    }

    setLoading(true);
    if (isRegistering) {
      // Registro de cliente o artista en Supabase Auth
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            role: role,
            full_name: fullName,
          },
        },
      });

      if (error) {
        Alert.alert('Error de registro', error.message);
      } else if (data?.user) {
        try {
          // 2. Insertamos el perfil en la tabla pública profiles
          const { error: profileError } = await supabase
            .from('profiles')
            .insert([
              {
                id: data.user.id,
                email: email,
                role: role,
                full_name: fullName,
              }
            ]);

          if (profileError) {
            console.error('Error insertando en profiles:', profileError);
            throw new Error(`profiles: ${profileError.message}`);
          }

          // 3. Si el rol es artista, agregar a la tabla artists
          if (role === 'artist') {
            const { error: artistError } = await supabase
              .from('artists')
              .insert([
                {
                  id: data.user.id,
                  name: fullName,
                  email: email,
                  location: "Santiago Centro",
                  styles: [],
                  portfolio: []
                }
              ]);

            if (artistError) {
              console.error('Error insertando en artists:', artistError);
              throw new Error(`artists: ${artistError.message}`);
            }
          }

          Alert.alert(
            'Registro exitoso',
            'Tu cuenta ha sido creada. Puedes iniciar sesión ahora.'
          );
          setIsRegistering(false);
          setFullName('');
          setEmail('');
          setPassword('');
        } catch (dbError: any) {
          Alert.alert(
            'Registro parcial',
            `Se creó la cuenta pero hubo un error de base de datos: ${dbError.message}`
          );
        }
      }
    } else {
      // Inicio de sesión
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        Alert.alert('Error de inicio de sesión', error.message);
      } else if (data?.session?.user) {
        const user = data.session.user;
        const role = user.user_metadata?.role || 'client';
        onLoginSuccess(user.email || '', role);
      }
    }
    setLoading(false);
  };

  return (
    <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
      <View style={styles.card}>
        <View style={styles.iconContainer}>
          <ShieldCheck size={48} color="#ffffff" />
        </View>

        <Text style={styles.title}>
          {isRegistering ? 'Crear Cuenta' : 'Iniciar Sesión'}
        </Text>
        
        <Text style={styles.subtitle}>
          {isRegistering 
            ? 'Regístrate para agendar citas y gestionar tatuajes en Black Ink.' 
            : 'Accede a tu cuenta de cliente o tatuador de Black Ink.'}
        </Text>

        <View style={styles.inputGroup}>
          {isRegistering && (
            <View style={styles.inputWrapper}>
              <User size={18} color="#888" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Nombre completo"
                placeholderTextColor="#666"
                value={fullName}
                onChangeText={setFullName}
                autoCapitalize="words"
                autoCorrect={false}
              />
            </View>
          )}

          <View style={styles.inputWrapper}>
            <Mail size={18} color="#888" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Correo electrónico"
              placeholderTextColor="#666"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>

          <View style={styles.inputWrapper}>
            <Lock size={18} color="#888" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Contraseña"
              placeholderTextColor="#666"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>

          {isRegistering && (
            <View style={styles.roleContainer}>
              <Text style={styles.roleLabel}>Registrarse como:</Text>
              <View style={styles.roleButtons}>
                <TouchableOpacity
                  style={[styles.roleButton, role === 'client' && styles.roleButtonActive]}
                  onPress={() => setRole('client')}
                >
                  <Text style={[styles.roleButtonText, role === 'client' && styles.roleButtonTextActive]}>
                    Cliente
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.roleButton, role === 'artist' && styles.roleButtonActive]}
                  onPress={() => setRole('artist')}
                >
                  <Text style={[styles.roleButtonText, role === 'artist' && styles.roleButtonTextActive]}>
                    Tatuador
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </View>

        <TouchableOpacity 
          style={styles.button} 
          onPress={handleAuth}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#000" />
          ) : (
            <View style={styles.buttonInner}>
              <LogIn size={18} color="#000" style={styles.buttonIcon} />
              <Text style={styles.buttonText}>
                {isRegistering ? 'Registrarse' : 'Ingresar'}
              </Text>
            </View>
          )}
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.switchButton} 
          onPress={() => setIsRegistering(!isRegistering)}
        >
          <Text style={styles.switchText}>
            {isRegistering 
              ? '¿Ya tienes cuenta? Inicia Sesión' 
              : '¿No tienes cuenta? Regístrate aquí'}
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#000000',
  },
  card: {
    backgroundColor: '#121212',
    borderWidth: 1,
    borderColor: '#222222',
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#fff',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.05,
    shadowRadius: 20,
    elevation: 5,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#1e1e1e',
    borderWidth: 1,
    borderColor: '#333',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: '#888888',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 20,
  },
  inputGroup: {
    width: '100%',
    gap: 16,
    marginBottom: 24,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#09090b',
    borderWidth: 1,
    borderColor: '#222222',
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 48,
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    color: '#ffffff',
    fontSize: 15,
  },
  button: {
    width: '100%',
    height: 48,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  buttonInner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonIcon: {
    marginRight: 8,
  },
  buttonText: {
    color: '#000000',
    fontSize: 16,
    fontWeight: 'bold',
  },
  switchButton: {
    padding: 8,
  },
  switchText: {
    color: '#888888',
    fontSize: 13,
    textDecorationLine: 'underline',
  },
  roleContainer: {
    marginTop: 8,
    width: '100%',
  },
  roleLabel: {
    color: '#888888',
    fontSize: 13,
    marginBottom: 8,
  },
  roleButtons: {
    flexDirection: 'row',
    backgroundColor: '#09090b',
    borderWidth: 1,
    borderColor: '#222222',
    borderRadius: 12,
    padding: 4,
    height: 48,
  },
  roleButton: {
    flex: 1,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  roleButtonActive: {
    backgroundColor: '#ffffff',
  },
  roleButtonText: {
    color: '#888888',
    fontSize: 14,
    fontWeight: 'bold',
  },
  roleButtonTextActive: {
    color: '#000000',
  },
});

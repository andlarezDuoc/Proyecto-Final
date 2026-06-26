import React, { useState } from 'react';
import { StyleSheet, Text, View, ScrollView, TextInput, TouchableOpacity, Image, Alert, ActivityIndicator } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { supabase } from '../lib/supabase';
import { Artist } from '../lib/data/artists';
import { Camera, Image as ImageIcon, Send, CheckCircle2, X } from 'lucide-react-native';

interface HealingReportScreenProps {
  artist: Artist;
  onBack: () => void;
}

export function HealingReportScreen({ artist, onBack }: HealingReportScreenProps) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [notes, setNotes] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const requestPermissions = async (type: 'library' | 'camera') => {
    if (type === 'library') {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      return status === 'granted';
    } else {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      return status === 'granted';
    }
  };

  const pickImage = async () => {
    const hasPermission = await requestPermissions('library');
    if (!hasPermission) {
      Alert.alert('Permiso requerido', 'Necesitamos acceso a tu galería de fotos para continuar.');
      return;
    }

    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        setPreviewUrl(result.assets[0].uri);
      }
    } catch (error) {
      console.log('Error seleccionando imagen:', error);
      Alert.alert('Error', 'No pudimos cargar la foto seleccionada.');
    }
  };

  const takePhoto = async () => {
    const hasPermission = await requestPermissions('camera');
    if (!hasPermission) {
      Alert.alert('Permiso requerido', 'Necesitamos acceso a tu cámara para tomar la foto.');
      return;
    }

    try {
      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        setPreviewUrl(result.assets[0].uri);
      }
    } catch (error) {
      console.log('Error tomando foto:', error);
      Alert.alert('Error', 'No pudimos activar la cámara.');
    }
  };

  const handleSendReport = () => {
    if (!previewUrl) {
      Alert.alert('Foto requerida', 'Por favor selecciona o toma una foto de tu tatuaje.');
      return;
    }

    setIsSending(true);
    // Simulamos el proceso de subida del reporte a Supabase
    setTimeout(() => {
      setIsSending(false);
      setIsSuccess(true);
      
      setTimeout(() => {
        setIsSuccess(false);
        setPreviewUrl(null);
        setNotes('');
        onBack(); // Regresa tras enviar
      }, 3000);
    }, 2000);
  };

  return (
    <View style={styles.container}>
      {/* Cabecera */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Seguimiento de Cicatrización</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
        {isSuccess ? (
          <View style={styles.successCard}>
            <View style={styles.successIconWrapper}>
              <CheckCircle2 size={48} color="#22c55e" />
            </View>
            <Text style={styles.successTitle}>¡Reporte Enviado!</Text>
            <Text style={styles.successText}>
              La fotografía de tu tatuaje cicatrizado fue enviada a {artist.name}. Su ficha clínica ha sido actualizada.
            </Text>
          </View>
        ) : (
          <View style={styles.formContainer}>
            <Text style={styles.title}>Evaluar cicatrización</Text>
            <Text style={styles.subtitle}>
              Envía una foto nítida y detallada de tu tatuaje cicatrizado para que {artist.name} pueda evaluar el resultado final de su trabajo.
            </Text>

            {/* Zona de carga de fotos */}
            {!previewUrl ? (
              <View style={styles.uploadArea}>
                <TouchableOpacity style={styles.uploadButton} onPress={pickImage}>
                  <ImageIcon size={24} color="#fff" />
                  <Text style={styles.uploadButtonText}>Galería de fotos</Text>
                </TouchableOpacity>

                <View style={styles.orDivider}>
                  <View style={styles.orLine} />
                  <Text style={styles.orText}>O</Text>
                  <View style={styles.orLine} />
                </View>

                <TouchableOpacity style={[styles.uploadButton, styles.cameraButton]} onPress={takePhoto}>
                  <Camera size={24} color="#fff" />
                  <Text style={styles.uploadButtonText}>Tomar Fotografía</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <View style={styles.previewContainer}>
                <Image source={{ uri: previewUrl }} style={styles.previewImage} />
                <TouchableOpacity 
                  style={styles.removeImageBtn}
                  onPress={() => setPreviewUrl(null)}
                >
                  <X size={16} color="#fff" />
                </TouchableOpacity>
              </View>
            )}

            {/* Observaciones */}
            <View style={styles.notesGroup}>
              <Text style={styles.label}>¿Tienes alguna observación sobre tu curación?</Text>
              <TextInput
                style={styles.notesInput}
                placeholder="Ej: Curó muy rápido, no perdí ningún color..."
                placeholderTextColor="#555"
                multiline
                numberOfLines={4}
                value={notes}
                onChangeText={setNotes}
              />
            </View>

            {/* Botón de envío */}
            <TouchableOpacity 
              style={[styles.sendButton, !previewUrl && styles.sendButtonDisabled]} 
              onPress={handleSendReport}
              disabled={!previewUrl || isSending}
            >
              {isSending ? (
                <ActivityIndicator color="#000" />
              ) : (
                <View style={styles.sendButtonInner}>
                  <Send size={18} color="#000" style={{ marginRight: 8 }} />
                  <Text style={styles.sendButtonText}>Enviar Reporte Clínico</Text>
                </View>
              )}
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  header: {
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderColor: '#111',
    backgroundColor: '#000',
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  formContainer: {
    flex: 1,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 13,
    color: '#888',
    lineHeight: 18,
    marginBottom: 24,
  },
  uploadArea: {
    gap: 12,
    marginBottom: 24,
  },
  uploadButton: {
    height: 60,
    backgroundColor: '#121212',
    borderWidth: 1,
    borderColor: '#222',
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
  },
  cameraButton: {
    backgroundColor: '#161616',
  },
  uploadButtonText: {
    color: '#fff',
    fontSize: 14.5,
    fontWeight: 'bold',
  },
  orDivider: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 4,
  },
  orLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#222',
  },
  orText: {
    fontSize: 12,
    color: '#444',
    marginHorizontal: 12,
    fontWeight: 'bold',
  },
  previewContainer: {
    position: 'relative',
    aspectRatio: 4 / 3,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#222',
    overflow: 'hidden',
    marginBottom: 24,
    backgroundColor: '#000',
  },
  previewImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  removeImageBtn: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(0,0,0,0.7)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  notesGroup: {
    gap: 8,
    marginBottom: 24,
  },
  label: {
    fontSize: 13.5,
    color: '#ccc',
    fontWeight: '600',
  },
  notesInput: {
    backgroundColor: '#121212',
    borderWidth: 1,
    borderColor: '#222',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingTop: 10,
    height: 100,
    color: '#fff',
    fontSize: 14,
    textAlignVertical: 'top',
  },
  sendButton: {
    height: 48,
    backgroundColor: '#fff',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonDisabled: {
    opacity: 0.5,
  },
  sendButtonInner: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sendButtonText: {
    color: '#000',
    fontSize: 15,
    fontWeight: 'bold',
  },
  successCard: {
    backgroundColor: '#121212',
    borderWidth: 1,
    borderColor: '#222',
    borderRadius: 24,
    padding: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 40,
  },
  successIconWrapper: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#22c55e/10',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  successTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  successText: {
    fontSize: 13.5,
    color: '#aaa',
    textAlign: 'center',
    lineHeight: 20,
  },
});

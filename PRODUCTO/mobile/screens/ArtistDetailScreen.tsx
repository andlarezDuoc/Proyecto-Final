import React from 'react';
import { StyleSheet, Text, View, ScrollView, Image, TouchableOpacity, Linking, Share } from 'react-native';
import { Artist } from '../lib/data/artists';
import { ArrowLeft, Star, Clock, Heart, Award, Globe, MapPin, Phone, Mail, Share2, Calendar } from 'lucide-react-native';

interface ArtistDetailScreenProps {
  artist: Artist;
  onBack: () => void;
  onBook: () => void;
}

export function ArtistDetailScreen({ artist, onBack, onBook }: ArtistDetailScreenProps) {
  const mockDistance = ((artist.name.length % 8) + 1.2).toFixed(1);
  const mockReviews = (artist.name.length * 11) % 150 + 30;

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Mira el portafolio de ${artist.name} en Black Ink Tattoo. Estilos: ${artist.styles.join(', ')}`,
      });
    } catch (error) {
      console.log(error);
    }
  };

  const handleInstagram = () => {
    const handle = artist.instagram.replace('@', '');
    Linking.openURL(`https://instagram.com/${handle}`).catch(() => {
      Linking.openURL('https://instagram.com');
    });
  };

  return (
    <View style={styles.container}>
      {/* Cabecera superior de la pantalla */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={onBack}>
          <ArrowLeft size={20} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle} numberOfLines={1}>Perfil del Artista</Text>
        <TouchableOpacity style={styles.shareButton} onPress={handleShare}>
          <Share2 size={20} color="#fff" />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Sección de perfil principal */}
        <View style={styles.profileSection}>
          <View style={styles.avatarContainer}>
            <Image source={{ uri: artist.avatar }} style={styles.avatarImage} />
            <View style={styles.badgeContainer}>
              <Award size={14} color="#000" />
              <Text style={styles.badgeText}>{artist.experience}+ Años</Text>
            </View>
          </View>

          <Text style={styles.artistName}>{artist.name}</Text>
          <Text style={styles.artistLocation}>{artist.location} • {mockDistance} km</Text>

          {/* Estadísticas de perfil */}
          <View style={styles.statsContainer}>
            <View style={styles.statBox}>
              <Clock size={16} color="#fff" />
              <Text style={styles.statNumber}>{artist.experience}+</Text>
              <Text style={styles.statLabel}>AÑOS</Text>
            </View>
            <View style={[styles.statBox, styles.borderX]}>
              <Heart size={16} color="#fff" />
              <Text style={styles.statNumber}>{artist.stats.tattoos}</Text>
              <Text style={styles.statLabel}>TATUAJES</Text>
            </View>
            <View style={styles.statBox}>
              <Star size={16} color="#fff" />
              <Text style={styles.statNumber}>{artist.stats.rating}</Text>
              <Text style={styles.statLabel}>RATING</Text>
            </View>
          </View>
        </View>

        {/* Biografía */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Sobre Mí</Text>
          <Text style={styles.bioText}>{artist.fullBio}</Text>

          <View style={styles.tagsContainer}>
            {artist.styles.map((style) => (
              <View key={style} style={styles.tag}>
                <Text style={styles.tagText}>{style}</Text>
              </View>
            ))}
          </View>

          <TouchableOpacity style={styles.instagramButton} onPress={handleInstagram}>
            <Globe size={16} color="#fff" style={styles.instagramIcon} />
            <Text style={styles.instagramText}>Seguir en Instagram ({artist.instagram})</Text>
          </TouchableOpacity>
        </View>

        {/* Portafolio (Galería de fotos) */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Portafolio</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.galleryScroll}>
            {artist.portfolio.map((img, i) => (
              <View key={i} style={styles.portfolioItem}>
                <Image source={{ uri: img }} style={styles.portfolioImage} />
                <View style={styles.portfolioTitleOverlay}>
                  <Text style={styles.portfolioTitleText}>Obra {i + 1}</Text>
                </View>
              </View>
            ))}
          </ScrollView>
        </View>

        {/* Ubicación y Horario */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Encuéntranos</Text>
          
          <View style={styles.contactRow}>
            <View style={styles.contactIconWrapper}>
              <MapPin size={16} color="#fff" />
            </View>
            <View style={styles.contactTextWrapper}>
              <Text style={styles.contactLabel}>Dirección</Text>
              <Text style={styles.contactValue}>Av. Providencia 1234, Providencia, Santiago</Text>
            </View>
          </View>

          <View style={styles.contactRow}>
            <View style={styles.contactIconWrapper}>
              <Clock size={16} color="#fff" />
            </View>
            <View style={styles.contactTextWrapper}>
              <Text style={styles.contactLabel}>Horario</Text>
              <Text style={styles.contactValue}>Lun - Sáb: 10:00 - 20:00</Text>
            </View>
          </View>

          <View style={styles.contactRow}>
            <View style={styles.contactIconWrapper}>
              <Phone size={16} color="#fff" />
            </View>
            <View style={styles.contactTextWrapper}>
              <Text style={styles.contactLabel}>Teléfono</Text>
              <Text style={styles.contactValue}>+56 9 1234 5678</Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Botón flotante para Reservar Cita en la parte inferior */}
      <View style={styles.footerButtonContainer}>
        <TouchableOpacity style={styles.bookButton} onPress={onBook}>
          <Calendar size={18} color="#000" style={styles.bookIcon} />
          <Text style={styles.bookButtonText}>Reservar Cita</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    height: 56,
    borderBottomWidth: 1,
    borderColor: '#111',
    backgroundColor: '#000',
  },
  backButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    flex: 1,
    textAlign: 'center',
    marginHorizontal: 16,
  },
  shareButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollContent: {
    paddingBottom: 100,
  },
  profileSection: {
    alignItems: 'center',
    paddingVertical: 24,
    backgroundColor: '#09090b',
    borderBottomWidth: 1,
    borderColor: '#111',
  },
  avatarContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 1,
    borderColor: '#333',
    position: 'relative',
    marginBottom: 16,
    backgroundColor: '#1a1a1a',
  },
  avatarImage: {
    width: '100%',
    height: '100%',
    borderRadius: 60,
    resizeMode: 'cover',
  },
  badgeContainer: {
    position: 'absolute',
    bottom: -6,
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    gap: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#000',
  },
  artistName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  artistLocation: {
    fontSize: 13,
    color: '#888',
    marginBottom: 20,
  },
  statsContainer: {
    flexDirection: 'row',
    backgroundColor: '#121212',
    borderWidth: 1,
    borderColor: '#222',
    borderRadius: 16,
    width: '90%',
    paddingVertical: 12,
  },
  statBox: {
    flex: 1,
    alignItems: 'center',
    gap: 4,
  },
  borderX: {
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: '#222',
  },
  statNumber: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  statLabel: {
    fontSize: 9,
    fontWeight: 'bold',
    color: '#666',
    letterSpacing: 0.5,
  },
  section: {
    padding: 16,
    borderBottomWidth: 1,
    borderColor: '#111',
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#fff',
    textTransform: 'uppercase',
    letterSpacing: 1.2,
    marginBottom: 12,
  },
  bioText: {
    fontSize: 13.5,
    lineHeight: 19,
    color: '#ccc',
    marginBottom: 12,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 16,
  },
  tag: {
    backgroundColor: '#121212',
    borderWidth: 1,
    borderColor: '#222',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  tagText: {
    color: '#fff',
    fontSize: 10.5,
    fontWeight: '600',
  },
  instagramButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 38,
    borderWidth: 1,
    borderColor: '#333',
    borderRadius: 8,
    backgroundColor: '#121212',
  },
  instagramIcon: {
    marginRight: 6,
  },
  instagramText: {
    color: '#fff',
    fontSize: 12.5,
    fontWeight: '600',
  },
  galleryScroll: {
    gap: 12,
  },
  portfolioItem: {
    width: 120,
    height: 160,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#222',
    overflow: 'hidden',
    position: 'relative',
    backgroundColor: '#1a1a1a',
  },
  portfolioImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  portfolioTitleOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.7)',
    paddingVertical: 4,
    alignItems: 'center',
  },
  portfolioTitleText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
  contactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
  },
  contactIconWrapper: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: '#121212',
    borderWidth: 1,
    borderColor: '#222',
    alignItems: 'center',
    justifyContent: 'center',
  },
  contactTextWrapper: {
    flex: 1,
  },
  contactLabel: {
    fontSize: 10,
    color: '#666',
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  contactValue: {
    fontSize: 13,
    color: '#ccc',
  },
  footerButtonContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#000',
    borderTopWidth: 1,
    borderColor: '#111',
    padding: 16,
  },
  bookButton: {
    height: 48,
    backgroundColor: '#fff',
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bookIcon: {
    marginRight: 8,
  },
  bookButtonText: {
    color: '#000',
    fontSize: 15,
    fontWeight: 'bold',
  },
});

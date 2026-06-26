import React, { useState, useEffect, useMemo } from 'react';
import { StyleSheet, Text, View, TextInput, ScrollView, TouchableOpacity, Image, FlatList, ActivityIndicator } from 'react-native';
import { supabase } from '../lib/supabase';
import { artists as fallbackArtists, Artist, ArtistStyle, Location } from '../lib/data/artists';
import { Search, Star, MapPin, SlidersHorizontal, RefreshCw } from 'lucide-react-native';

interface HomeScreenProps {
  onSelectArtist: (artistId: string) => void;
  onBookArtist: (artistId: string) => void;
}

export function HomeScreen({ onSelectArtist, onBookArtist }: HomeScreenProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStyle, setSelectedStyle] = useState<string | null>(null);
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null);
  
  const [dbArtists, setDbArtists] = useState<Artist[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const allStyles: ArtistStyle[] = [
    "Realismo", "Blackwork", "Fine Line", "Tradicional",
    "Neotradicional", "Minimalismo", "Geométrico", "Anime", "Acuarela"
  ];

  const allLocations: Location[] = [
    "Santiago Centro", "Providencia", "Las Condes", "Ñuñoa",
    "Vitacura", "Macul", "La Florida"
  ];

  const fetchArtists = async () => {
    setLoading(true);
    setErrorMsg(null);
    try {
      const { data, error } = await supabase.from('artists').select('*');
      if (error) {
        throw new Error(error.message);
      }
      if (data && data.length > 0) {
        const mapped = data.map(a => ({
          ...a,
          shortBio: a.shortbio,
          fullBio: a.fullbio
        })) as Artist[];
        setDbArtists(mapped);
      } else {
        // Fallback a locales si la DB está vacía
        setDbArtists(fallbackArtists);
      }
    } catch (err: any) {
      console.warn("Error fetching Supabase artists, falling back:", err);
      // Fallback a artistas estáticos locales
      setDbArtists(fallbackArtists);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArtists();
  }, []);

  const filteredArtists = useMemo(() => {
    return dbArtists.filter((artist) => {
      const matchesSearch = artist.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStyle = !selectedStyle || artist.styles.includes(selectedStyle as ArtistStyle);
      const matchesLocation = !selectedLocation || artist.location === selectedLocation;

      return matchesSearch && matchesStyle && matchesLocation;
    });
  }, [dbArtists, searchTerm, selectedStyle, selectedLocation]);

  const renderArtistCard = ({ item, index }: { item: Artist, index: number }) => {
    const coverImage = item.portfolio && item.portfolio.length > 0 ? item.portfolio[0] : item.avatar;
    const mockDistance = ((item.name.length % 8) + 1.2).toFixed(1);
    const mockReviews = (item.name.length * 11) % 150 + 30;

    return (
      <View style={styles.card}>
        <TouchableOpacity 
          style={styles.cardHeader} 
          onPress={() => onSelectArtist(item.id)}
          activeOpacity={0.8}
        >
          <Image source={{ uri: coverImage }} style={styles.coverImage} />
          <View style={styles.avatarBorder}>
            <Image source={{ uri: item.avatar }} style={styles.avatarImage} />
          </View>
        </TouchableOpacity>

        <View style={styles.cardContent}>
          <View style={styles.cardHeaderRow}>
            <Text style={styles.artistName}>{item.name}</Text>
            <View style={styles.ratingContainer}>
              <Text style={styles.ratingText}>{item.stats.rating}</Text>
              <Star size={14} color="#fff" fill="#fff" />
            </View>
          </View>

          <View style={styles.locationRow}>
            <MapPin size={12} color="#888" />
            <Text style={styles.locationText}>{item.location} • {mockDistance} km</Text>
          </View>

          <View style={styles.tagsContainer}>
            {item.styles.slice(0, 3).map((style) => (
              <View key={style} style={styles.tag}>
                <Text style={styles.tagText}>{style}</Text>
              </View>
            ))}
          </View>

          <Text style={styles.bioText} numberOfLines={2}>
            {item.shortBio}
          </Text>

          <View style={styles.buttonRow}>
            <TouchableOpacity 
              style={[styles.actionButton, styles.secondaryButton]}
              onPress={() => onSelectArtist(item.id)}
            >
              <Text style={styles.secondaryButtonText}>Ver Perfil</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.actionButton, styles.primaryButton]}
              onPress={() => onBookArtist(item.id)}
            >
              <Text style={styles.primaryButtonText}>Reservar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* Barra de búsqueda */}
      <View style={styles.searchSection}>
        <View style={styles.searchContainer}>
          <Search size={18} color="#888" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar tatuadores por nombre..."
            placeholderTextColor="#555"
            value={searchTerm}
            onChangeText={setSearchTerm}
            autoCorrect={false}
          />
        </View>
        <TouchableOpacity style={styles.refreshButton} onPress={fetchArtists}>
          <RefreshCw size={18} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Filtros rápidos horizontal Scroll */}
      <View style={styles.filtersWrapper}>
        <Text style={styles.filterTitle}>Filtrar por Estilo</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterScroll}>
          <TouchableOpacity 
            style={[styles.filterPill, !selectedStyle && styles.filterPillActive]}
            onPress={() => setSelectedStyle(null)}
          >
            <Text style={[styles.filterPillText, !selectedStyle && styles.filterPillTextActive]}>Todos</Text>
          </TouchableOpacity>
          {allStyles.map((style) => (
            <TouchableOpacity 
              key={style}
              style={[styles.filterPill, selectedStyle === style && styles.filterPillActive]}
              onPress={() => setSelectedStyle(style)}
            >
              <Text style={[styles.filterPillText, selectedStyle === style && styles.filterPillTextActive]}>{style}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <Text style={styles.filterTitle}>Filtrar por Ubicación</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterScroll}>
          <TouchableOpacity 
            style={[styles.filterPill, !selectedLocation && styles.filterPillActive]}
            onPress={() => setSelectedLocation(null)}
          >
            <Text style={[styles.filterPillText, !selectedLocation && styles.filterPillTextActive]}>Todas</Text>
          </TouchableOpacity>
          {allLocations.map((loc) => (
            <TouchableOpacity 
              key={loc}
              style={[styles.filterPill, selectedLocation === loc && styles.filterPillActive]}
              onPress={() => setSelectedLocation(loc)}
            >
              <Text style={[styles.filterPillText, selectedLocation === loc && styles.filterPillTextActive]}>{loc}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Listado de artistas */}
      {loading ? (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color="#ffffff" />
          <Text style={styles.loaderText}>Cargando tatuadores...</Text>
        </View>
      ) : filteredArtists.length > 0 ? (
        <FlatList
          data={filteredArtists}
          renderItem={renderArtistCard}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyTitle}>No se encontraron artistas</Text>
          <Text style={styles.emptySubtitle}>Intenta ajustar tus filtros para encontrar lo que buscas.</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  searchSection: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginTop: 12,
    gap: 8,
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#121212',
    borderWidth: 1,
    borderColor: '#222',
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 44,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    color: '#fff',
    fontSize: 14,
  },
  refreshButton: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#121212',
    borderWidth: 1,
    borderColor: '#222',
    alignItems: 'center',
    justifyContent: 'center',
  },
  filtersWrapper: {
    marginTop: 12,
    marginBottom: 8,
  },
  filterTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#888',
    marginLeft: 16,
    marginBottom: 6,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  filterScroll: {
    paddingHorizontal: 16,
    gap: 8,
    marginBottom: 12,
  },
  filterPill: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: '#121212',
    borderWidth: 1,
    borderColor: '#222',
  },
  filterPillActive: {
    backgroundColor: '#ffffff',
    borderColor: '#ffffff',
  },
  filterPillText: {
    color: '#aaa',
    fontSize: 12,
    fontWeight: '600',
  },
  filterPillTextActive: {
    color: '#000000',
    fontWeight: 'bold',
  },
  listContainer: {
    padding: 16,
    gap: 20,
  },
  card: {
    backgroundColor: '#121212',
    borderWidth: 1,
    borderColor: '#222',
    borderRadius: 20,
    overflow: 'hidden',
  },
  cardHeader: {
    height: 140,
    position: 'relative',
    backgroundColor: '#1a1a1a',
  },
  coverImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  avatarBorder: {
    position: 'absolute',
    bottom: -24,
    left: 16,
    width: 54,
    height: 54,
    borderRadius: 27,
    borderWidth: 3,
    borderColor: '#121212',
    backgroundColor: '#1a1a1a',
    overflow: 'hidden',
  },
  avatarImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  cardContent: {
    padding: 16,
    paddingTop: 32,
  },
  cardHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  artistName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#222',
    paddingHorizontal: 8,
    paddingVertical: 2.5,
    borderRadius: 12,
  },
  ratingText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 12,
  },
  locationText: {
    color: '#888',
    fontSize: 11,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 12,
  },
  tag: {
    backgroundColor: '#1e1e1e',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  tagText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '600',
  },
  bioText: {
    color: '#ccc',
    fontSize: 13,
    lineHeight: 18,
    marginBottom: 16,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    flex: 1,
    height: 40,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  secondaryButton: {
    backgroundColor: '#1e1e1e',
    borderWidth: 1,
    borderColor: '#333',
  },
  secondaryButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  primaryButton: {
    backgroundColor: '#fff',
  },
  primaryButtonText: {
    color: '#000',
    fontSize: 14,
    fontWeight: 'bold',
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  loaderText: {
    color: '#fff',
    marginTop: 12,
    fontSize: 14,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  emptySubtitle: {
    fontSize: 13,
    color: '#666',
    textAlign: 'center',
  },
});

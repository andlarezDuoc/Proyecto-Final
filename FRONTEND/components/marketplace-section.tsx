"use client"

import { useState, useMemo } from "react"
import { motion } from "framer-motion"
import { Search, MapPin, Palette } from "lucide-react"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { ArtistCard } from "./artist-card"
import { artists, ArtistStyle, Location } from "@/lib/data/artists"

export function MarketplaceSection() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedStyle, setSelectedStyle] = useState<string>("all")
  const [selectedLocation, setSelectedLocation] = useState<string>("all")

  const allStyles: ArtistStyle[] = [
    "Realismo", "Blackwork", "Fine Line", "Tradicional",
    "Neotradicional", "Minimalismo", "Geométrico", "Anime", "Acuarela"
  ]

  const allLocations: Location[] = [
    "Santiago Centro", "Providencia", "Las Condes", "Ñuñoa",
    "Vitacura", "Macul", "La Florida"
  ]

  const filteredArtists = useMemo(() => {
    return artists.filter((artist) => {
      const matchesSearch = artist.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        artist.shortBio.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStyle = selectedStyle === "all" || artist.styles.includes(selectedStyle as ArtistStyle);
      const matchesLocation = selectedLocation === "all" || artist.location === selectedLocation;

      return matchesSearch && matchesStyle && matchesLocation;
    })
  }, [searchTerm, selectedStyle, selectedLocation])

  return (
    <section id="artistas" className="py-24 bg-secondary/30 relative min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="font-serif text-4xl sm:text-5xl font-bold text-white mb-4">
            Nuestros Artistas
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Explora nuestra red de talentos y encuentra al artista perfecto para tu próximo tatuaje.
          </p>
        </motion.div>

        {/* Filters Section */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="bg-background/50 backdrop-blur-xl border border-primary/20 p-6 rounded-2xl shadow-xl mb-12 mb-8 flex flex-col md:flex-row gap-4 max-w-4xl mx-auto"
        >
          {/* Search Bar */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5" />
            <Input
              type="text"
              placeholder="Buscar por nombre o descripción..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 h-12 bg-background border-primary/20 text-foreground"
            />
          </div>

          {/* Style Filter */}
          <div className="w-full md:w-48">
            <Select value={selectedStyle} onValueChange={setSelectedStyle}>
              <SelectTrigger className="h-12 border-primary/20">
                <div className="flex items-center gap-2">
                  <Palette className="w-4 h-4 text-primary" />
                  <SelectValue placeholder="Estilo" />
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los Estilos</SelectItem>
                {allStyles.map((style) => (
                  <SelectItem key={style} value={style}>
                    {style}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Location Filter */}
          <div className="w-full md:w-48">
            <Select value={selectedLocation} onValueChange={setSelectedLocation}>
              <SelectTrigger className="h-12 border-primary/20">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-primary" />
                  <SelectValue placeholder="Ubicación" />
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas las Ubicaciones</SelectItem>
                {allLocations.map((loc) => (
                  <SelectItem key={loc} value={loc}>
                    {loc}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </motion.div>

        {/* Results Info */}
        <div className="mb-8 text-center md:text-left text-muted-foreground">
          Mostrando {filteredArtists.length} {filteredArtists.length === 1 ? 'artista' : 'artistas'}
        </div>

        {/* Artists Grid */}
        {filteredArtists.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredArtists.map((artist, index) => (
              <ArtistCard key={artist.id} artist={artist} index={index} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-background/50 rounded-2xl border border-primary/20">
            <Palette className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
            <h3 className="text-xl font-bold text-foreground mb-2">No se encontraron artistas</h3>
            <p className="text-muted-foreground">
              Intenta ajustar tus filtros para encontrar lo que buscas.
            </p>
          </div>
        )}
      </div>
    </section>
  )
}

"use client"

import { useState, useMemo } from "react"
import { motion } from "framer-motion"
import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Button } from "@/components/ui/button"
import { ArtistCard } from "./artist-card"
import { artists, ArtistStyle, Location } from "@/lib/data/artists"

export function MarketplaceSection() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedStyles, setSelectedStyles] = useState<string[]>([])
  const [selectedLocations, setSelectedLocations] = useState<string[]>([])
  
  const [pendingStyles, setPendingStyles] = useState<string[]>([])
  const [pendingLocations, setPendingLocations] = useState<string[]>([])

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
      const matchesSearch = artist.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStyle = selectedStyles.length === 0 || selectedStyles.some(s => artist.styles.includes(s as ArtistStyle));
      const matchesLocation = selectedLocations.length === 0 || selectedLocations.includes(artist.location);

      return matchesSearch && matchesStyle && matchesLocation;
    })
  }, [searchTerm, selectedStyles, selectedLocations])

  const applyFilters = () => {
    setSelectedStyles(pendingStyles);
    setSelectedLocations(pendingLocations);
  };

  const clearFilters = () => {
    setSelectedStyles([]);
    setSelectedLocations([]);
    setPendingStyles([]);
    setPendingLocations([]);
  };

  return (
    <section id="artistas" className="py-24 relative min-h-screen">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Left Sidebar */}
          <div className="w-full lg:w-[300px] flex-shrink-0 flex flex-col gap-6">
            
            {/* Filtros rápidos block */}
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-[#121212]/80 backdrop-blur-md border border-white/10 rounded-2xl p-6 shadow-xl"
            >
              <h3 className="font-serif text-2xl font-bold text-white mb-6">Filtros rápidos</h3>
              
              {/* Ubicación */}
              <div className="mb-6">
                <h4 className="text-sm font-bold text-white mb-3">Ubicación</h4>
                <div className="space-y-3 max-h-48 overflow-y-auto pr-2 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                  {allLocations.map((loc) => (
                    <div key={loc} className="flex items-center space-x-3">
                      <Checkbox 
                        id={`loc-${loc}`} 
                        checked={pendingLocations.includes(loc)}
                        onCheckedChange={(checked) => {
                          if (checked) setPendingLocations([...pendingLocations, loc]);
                          else setPendingLocations(pendingLocations.filter(l => l !== loc));
                        }}
                        className="border-white/30 data-[state=checked]:bg-white data-[state=checked]:text-black"
                      />
                      <label htmlFor={`loc-${loc}`} className="text-sm font-medium leading-none text-gray-300 cursor-pointer">
                        {loc}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Estilo */}
              <div className="mb-6">
                <h4 className="text-sm font-bold text-white mb-3">Estilo</h4>
                <div className="space-y-3 max-h-48 overflow-y-auto pr-2 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
                  {allStyles.map((style) => (
                    <div key={style} className="flex items-center space-x-3">
                      <Checkbox 
                        id={`style-${style}`} 
                        checked={pendingStyles.includes(style)}
                        onCheckedChange={(checked) => {
                          if (checked) setPendingStyles([...pendingStyles, style]);
                          else setPendingStyles(pendingStyles.filter(s => s !== style));
                        }}
                        className="border-white/30 data-[state=checked]:bg-white data-[state=checked]:text-black"
                      />
                      <label htmlFor={`style-${style}`} className="text-sm font-medium leading-none text-gray-300 cursor-pointer">
                        {style}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Disponibilidad (UI only) */}
              <div className="mb-6">
                <h4 className="text-sm font-bold text-white mb-3">Disponibilidad</h4>
                <RadioGroup defaultValue="flexible" className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <RadioGroupItem value="hoy" id="disp-hoy" className="border-white/30 text-white fill-white" />
                    <label htmlFor="disp-hoy" className="text-sm font-medium text-gray-300 cursor-pointer">Hoy</label>
                  </div>
                  <div className="flex items-center space-x-3">
                    <RadioGroupItem value="semana" id="disp-semana" className="border-white/30 text-white fill-white" />
                    <label htmlFor="disp-semana" className="text-sm font-medium text-gray-300 cursor-pointer">Esta semana</label>
                  </div>
                  <div className="flex items-center space-x-3">
                    <RadioGroupItem value="flexible" id="disp-flexible" className="border-white/30 text-white fill-white" />
                    <label htmlFor="disp-flexible" className="text-sm font-medium text-white cursor-pointer">Flexible</label>
                  </div>
                </RadioGroup>
              </div>


              {/* Botones de acción */}
              <div className="flex gap-3">
                <Button onClick={applyFilters} className="flex-1 bg-white/10 hover:bg-white/20 text-white border-none rounded-md">
                  Aplicar
                </Button>
                <Button variant="outline" onClick={clearFilters} className="flex-1 border-white/20 text-white hover:bg-white/5 rounded-md">
                  Limpiar filtros
                </Button>
              </div>
            </motion.div>

          </div>

          {/* Right Content Area */}
          <div className="flex-1">
            
            {/* Header and View Toggle */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8">
              <div className="w-full">
                <h2 className="text-3xl sm:text-4xl font-serif font-bold text-white mb-2">
                  Nuestros Tatuadores
                </h2>
                <p className="text-muted-foreground text-sm mb-6">
                  Mostrando 1 - {filteredArtists.length > 12 ? 12 : filteredArtists.length} de {filteredArtists.length} artistas
                </p>
                {/* Search Bar */}
                <div className="relative w-full max-w-md">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5" />
                  <Input
                    type="text"
                    placeholder="Buscar tatuadores por nombre..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 h-11 bg-[#121212]/80 backdrop-blur-md border border-white/10 text-white placeholder:text-gray-500 rounded-lg focus-visible:ring-1 focus-visible:ring-white/30"
                  />
                </div>
              </div>

            </div>

            {/* Grid */}
            {filteredArtists.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredArtists.map((artist, index) => (
                  <ArtistCard key={artist.id} artist={artist} index={index} />
                ))}
              </div>
            ) : (
              <div className="text-center py-20 bg-[#121212]/80 rounded-2xl border border-white/10 backdrop-blur-md">
                <h3 className="text-xl font-bold text-white mb-2">No se encontraron artistas</h3>
                <p className="text-muted-foreground">
                  Intenta ajustar tus filtros para encontrar lo que buscas.
                </p>
              </div>
            )}

            {/* Pagination */}
            {filteredArtists.length > 0 && (
              <div className="mt-12 mb-8 flex flex-wrap justify-center items-center gap-2">
                <Button variant="outline" className="border-white/10 bg-[#121212]/80 text-gray-300 hover:bg-white/10 hover:text-white rounded-md">
                  &laquo; Anterior
                </Button>
                <Button className="bg-white text-black hover:bg-gray-200 w-10 rounded-md font-bold">1</Button>
                <Button variant="outline" className="border-white/10 bg-[#121212]/80 text-gray-300 hover:bg-white/10 hover:text-white w-10 rounded-md">2</Button>
                <Button variant="outline" className="border-white/10 bg-[#121212]/80 text-gray-300 hover:bg-white/10 hover:text-white w-10 rounded-md">3</Button>
                <Button variant="outline" className="border-white/10 bg-[#121212]/80 text-gray-300 hover:bg-white/10 hover:text-white rounded-md">
                  Siguiente &raquo;
                </Button>
                <Button className="bg-[#121212]/80 border border-white/10 text-white hover:bg-white/10 ml-2 rounded-md font-medium">
                  Cargar más
                </Button>
              </div>
            )}
            
          </div>
        </div>
      </div>
    </section>
  )
}

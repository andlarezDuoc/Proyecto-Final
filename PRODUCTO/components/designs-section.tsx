"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { X, Sparkles, Calendar } from "lucide-react"
import { VisuallyHidden } from "@radix-ui/react-visually-hidden"
import { Artist } from "@/lib/data/artists"

const designSheets = [
  {
    id: 1,
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot_20260407_122133_Instagram-os6zcwjvFE4idV5Km9NeKjghyytkO4.jpg",
    title: "Flash Sheet - Líneas",
    category: "line-art",
    description: "Colección de diseños en línea fina: corazones, mariposas, animales fantásticos y figuras surrealistas. Perfectos para tatuajes pequeños y medianos.",
    designs: "20+ diseños",
  },
  {
    id: 2,
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot_20260407_122125_Instagram-gWgzplP9KXoSA3Y8jAOanw2IfAo9QT.jpg",
    title: "Flash Sheet - Surrealismo",
    category: "surrealist",
    description: "Diseños surrealistas con figuras humanas, animales y objetos fusionados. Incluye peces con rostros, corazones, lunas y criaturas místicas.",
    designs: "12+ diseños",
  },
  {
    id: 3,
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot_20260407_122158_Instagram-E18Agc4faOaMHqbsTpd5pBmFMupNg0.jpg",
    title: "Flash Sheet - Ojos",
    category: "eyes",
    description: "Colección especializada en diseños de ojos: flores con ojos, colgantes, formas orgánicas y composiciones surrealistas con felinos y corazones.",
    designs: "15+ diseños",
  },
  {
    id: 4,
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot_20260407_122211_Instagram-tKLiqksqZq0nTLtsk3xopWwmh5QZuR.jpg",
    title: "Flash Sheet - Criaturas",
    category: "creatures",
    description: "Criaturas fantásticas y personajes únicos: centauros, caracoles humanoides, muñecas góticas y seres híbridos con estilo detallado.",
    designs: "10+ diseños",
  },
  {
    id: 5,
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot_20260407_122323_Instagram-Ys1DjNJSBFOzO32Z7B662PL8HQ9wAt.jpg",
    title: "Flash Sheet - Arte Oscuro",
    category: "dark-art",
    description: "Diseños de arte oscuro: manos distorsionadas, girasoles con ojos, rostros en anillos de árbol, elefantes dalinianos y esculturas múltiples.",
    designs: "12+ diseños",
  },
  {
    id: 6,
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot_20260407_122341_Instagram-uO4j8TgOgHgfULAJKBpy4O5ubfemoW.jpg",
    title: "Flash Sheet - Místico",
    category: "mystic",
    description: "Colección mística: llaves ornamentadas, ojos alados, estrellas con ojos, manos con rostros, conejos, caracoles y peces con ojos.",
    designs: "12+ diseños",
  },
  {
    id: 7,
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot_20260407_122348_Instagram-IPkhPaIIhu1l4KLsqf2fYwYGrGxDpl.jpg",
    title: "Flash Sheet - Coleccionables",
    category: "collectible",
    description: "Diseños coleccionables únicos: gatos, figuras con ojos grandes, ciervos, candados con ojos, tazas con espinas y personajes con forma de huevo.",
    designs: "8+ diseños",
  },
]

interface DesignSheet {
  id: number
  image: string
  title: string
  category: string
  description: string
  designs: string
}

interface DesignsSectionProps {
  artist: Artist;
}

export function DesignsSection({ artist }: DesignsSectionProps) {
  const [selectedSheet, setSelectedSheet] = useState<DesignSheet | null>(null)

  return (
    <section id="disenos" className="py-24 relative overflow-hidden">

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 text-white/80 border border-white/20 backdrop-blur-sm mb-6">
            <Sparkles className="w-4 h-4" />
            <span className="text-sm font-medium">Diseños Listos para Tatuar</span>
          </div>
          <h2 className="font-serif text-4xl sm:text-5xl font-bold text-white mb-4">
            Diseños Disponibles de <span className="text-chrome">{artist.name.split(' ')[0]}</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Explora las hojas de diseños originales de {artist.name}. Elige tu favorito y agéndalo directamente
            o úsalo como inspiración para crear algo único.
          </p>
        </motion.div>

        {/* Design sheets grid */}
        <motion.div
          layout
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          <AnimatePresence mode="popLayout">
            {designSheets.map((sheet, index) => (
              <motion.div
                key={sheet.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="group relative bg-black/40 backdrop-blur-md rounded-2xl overflow-hidden cursor-pointer border border-white/10 hover:border-white/30 transition-all hover:shadow-xl hover:shadow-white/5"
                onClick={() => setSelectedSheet(sheet)}
              >
                <div className="relative aspect-square overflow-hidden">
                  <Image
                    src={sheet.image}
                    alt={sheet.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  {/* Gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-card via-transparent to-transparent opacity-60" />

                  {/* Badge */}
                  <div className="absolute top-4 right-4 px-3 py-1 rounded-full bg-black/60 text-white text-xs font-medium backdrop-blur-sm border border-white/20">
                    {sheet.designs}
                  </div>
                </div>

                <div className="p-5">
                  <h3 className="font-serif text-xl font-bold text-white mb-2 group-hover:text-chrome transition-colors">
                    {sheet.title}
                  </h3>
                  <p className="text-muted-foreground text-sm line-clamp-2">
                    {sheet.description}
                  </p>

                  <div className="mt-4 flex items-center text-chrome text-sm font-medium">
                    <span>Ver diseños</span>
                    <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>


      </div>

      {/* Design sheet detail modal */}
      <Dialog open={!!selectedSheet} onOpenChange={() => setSelectedSheet(null)}>
        <DialogContent
          className="max-w-5xl bg-card border-border p-0 overflow-hidden max-h-[90vh]"
          aria-describedby="design-sheet-description"
        >
          <VisuallyHidden>
            <DialogTitle>{selectedSheet?.title || "Hoja de diseños"}</DialogTitle>
            <DialogDescription id="design-sheet-description">
              {selectedSheet?.description || "Colección de diseños de tatuaje disponibles"}
            </DialogDescription>
          </VisuallyHidden>
          {selectedSheet && (
            <div className="grid md:grid-cols-2 max-h-[90vh]">
              <div className="relative aspect-square md:aspect-auto md:h-full overflow-auto">
                <Image
                  src={selectedSheet.image}
                  alt={selectedSheet.title}
                  fill
                  className="object-contain md:object-cover"
                />
              </div>
              <div className="p-6 sm:p-8 flex flex-col overflow-auto">
                <button
                  onClick={() => setSelectedSheet(null)}
                  className="absolute top-4 right-4 p-2 rounded-full bg-background/80 hover:bg-background transition-colors z-10"
                >
                  <X className="w-5 h-5" />
                </button>

                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-white/80 text-sm w-fit mb-4 border border-white/20">
                  <Sparkles className="w-3 h-3" />
                  {selectedSheet.designs}
                </div>

                <h3 className="font-serif text-2xl sm:text-3xl font-bold text-foreground mb-4">
                  {selectedSheet.title}
                </h3>

                <p className="text-muted-foreground leading-relaxed mb-6">
                  {selectedSheet.description}
                </p>

                <div className="bg-white/5 rounded-xl p-4 mb-6 border border-white/10">
                  <h4 className="font-medium text-white mb-2">¿Cómo funciona?</h4>
                  <ul className="space-y-2 text-sm text-white/60">
                    <li className="flex items-start gap-2">
                      <span className="text-chrome mt-0.5">1.</span>
                      Elige el diseño que más te guste de la hoja
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-chrome mt-0.5">2.</span>
                      Indícame el número del diseño al agendar tu cita
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-chrome mt-0.5">3.</span>
                      Podemos ajustar tamaño y ubicación según tus preferencias
                    </li>
                  </ul>
                </div>

                <div className="mt-auto space-y-3">
                  <Button
                    className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-6"
                    onClick={() => {
                      setSelectedSheet(null)
                      document.getElementById('agendar')?.scrollIntoView({ behavior: 'smooth' })
                    }}
                  >
                    <Calendar className="w-5 h-5 mr-2" />
                    Agendar con este diseño
                  </Button>
                  <p className="text-xs text-center text-muted-foreground">
                    Menciona el número del diseño en la descripción de tu cita
                  </p>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </section>
  )
}

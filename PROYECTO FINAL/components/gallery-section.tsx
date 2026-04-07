"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { X, Heart, Share2, Calendar } from "lucide-react"
import { VisuallyHidden } from "@radix-ui/react-visually-hidden"

const categories = [
  { id: "all", label: "Todos" },
  { id: "blackwork", label: "Blackwork" },
  { id: "fineline", label: "Fine Line" },
  { id: "realismo", label: "Realismo" },
  { id: "floral", label: "Floral" },
  { id: "surrealismo", label: "Surrealismo" },
]

const tattoos = [
  {
    id: 1,
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot_20260407_121751_Instagram-kxH09PFM0dOeMIPozW7f1z8h1naFhJ.jpg",
    title: "Estrellas en Rodillas",
    category: "blackwork",
    description: "Diseño de estrellas con efecto halftone en ambas rodillas, creando un look simétrico y audaz.",
    likes: 324,
  },
  {
    id: 2,
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot_20260407_122256_Instagram-oTwd2dTHPHrSJLR8wy0Y1qzy6QmDuh.jpg",
    title: "Ojos Conectados",
    category: "surrealismo",
    description: "Tres ojos conectados verticalmente en el cuello, con un estilo surrealista y fluido.",
    likes: 456,
  },
  {
    id: 3,
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot_20260407_121838_Instagram-ARH5xbbypcxE8zCSUvKR0tN1iYINpQ.jpg",
    title: "Lirios en la Espalda",
    category: "floral",
    description: "Elegante composición de lirios que fluye a través de la espalda con líneas delicadas.",
    likes: 512,
  },
  {
    id: 4,
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot_20260407_121933_Instagram-PuSnfwW7gTe9F7daDyPWXtvrdbLvRN.jpg",
    title: "Ramas Simétricas",
    category: "fineline",
    description: "Diseño de ramas de árbol simétricas en la zona lumbar, simbolizando crecimiento y raíces.",
    likes: 387,
  },
  {
    id: 5,
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot_20260407_121910_Instagram-g3B6A1VR4NIuJaSGyajbfOzNpG1JmS.jpg",
    title: "Catedrales Góticas",
    category: "blackwork",
    description: "Par de tatuajes en pantorrillas con diseño gótico de catedrales y ojos místicos.",
    likes: 623,
  },
  {
    id: 6,
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot_20260407_122012_Instagram-gXFwYBZ21J4FZubK8jEqVMxkwpO7T8.jpg",
    title: "Llave Victoriana",
    category: "realismo",
    description: "Llave antigua con detalles victorianos elaborados en estilo realista.",
    likes: 445,
  },
  {
    id: 7,
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Screenshot_20260407_121858_Instagram-mjSSHytcgMdozG11I1PLF7kHiB5vAo.jpg",
    title: "Olas Barrocas",
    category: "fineline",
    description: "Diseño de olas con estilo barroco/rococó en la espalda superior.",
    likes: 398,
  },
]

interface Tattoo {
  id: number
  image: string
  title: string
  category: string
  description: string
  likes: number
}

export function GallerySection() {
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedTattoo, setSelectedTattoo] = useState<Tattoo | null>(null)

  const filteredTattoos = tattoos.filter((tattoo) => {
    return selectedCategory === "all" || tattoo.category === selectedCategory
  })

  return (
    <section id="galeria" className="py-24 relative overflow-hidden">

      {/* Section header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="font-serif text-4xl sm:text-5xl font-bold text-foreground mb-4">
            Mi <span className="text-primary">Galería</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Explora mi colección de trabajos realizados. Cada tatuaje es único y cuenta una historia.
          </p>
        </motion.div>

        {/* Style filter only */}
        <div className="mb-12">
          <p className="text-sm text-muted-foreground mb-3 text-center">Filtrar por estilo</p>
          <div className="flex flex-wrap justify-center gap-2">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`px-4 py-2 rounded-full text-sm transition-all duration-300 border ${
                  selectedCategory === category.id
                    ? "bg-white/10 text-white border-white/30 backdrop-blur-md shadow-lg"
                    : "bg-black/40 text-white/70 border-white/10 backdrop-blur-sm hover:bg-white/10 hover:text-white hover:border-white/20"
                }`}
              >
                {category.label}
              </button>
            ))}
          </div>
        </div>

        {/* Gallery grid */}
        <motion.div
          layout
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
        >
          <AnimatePresence mode="popLayout">
            {filteredTattoos.map((tattoo) => (
              <motion.div
                key={tattoo.id}
                layout
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.3 }}
                className="group relative aspect-[3/4] rounded-xl overflow-hidden cursor-pointer bg-secondary border border-border hover:border-primary/30 transition-all"
                onClick={() => setSelectedTattoo(tattoo)}
              >
                <Image
                  src={tattoo.image}
                  alt={tattoo.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                />
                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <p className="font-serif text-lg text-foreground mb-1">{tattoo.title}</p>
                    <p className="text-sm text-muted-foreground capitalize">
                      {categories.find(c => c.id === tattoo.category)?.label}
                    </p>
                    <div className="flex items-center gap-1 mt-2 text-primary">
                      <Heart className="w-4 h-4" />
                      <span className="text-sm">{tattoo.likes}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {filteredTattoos.length === 0 && (
          <div className="text-center py-16">
            <p className="text-muted-foreground">No se encontraron tatuajes con el estilo seleccionado.</p>
          </div>
        )}
      </div>

      {/* Tattoo detail modal */}
      <Dialog open={!!selectedTattoo} onOpenChange={() => setSelectedTattoo(null)}>
        <DialogContent 
          className="max-w-4xl bg-card border-border p-0 overflow-hidden"
          aria-describedby="tattoo-description"
        >
          <VisuallyHidden>
            <DialogTitle>{selectedTattoo?.title || "Detalle del tatuaje"}</DialogTitle>
            <DialogDescription id="tattoo-description">
              {selectedTattoo?.description || "Detalles del diseño de tatuaje seleccionado"}
            </DialogDescription>
          </VisuallyHidden>
          {selectedTattoo && (
            <div className="grid md:grid-cols-2">
              <div className="relative aspect-[3/4] md:aspect-auto md:h-full">
                <Image
                  src={selectedTattoo.image}
                  alt={selectedTattoo.title}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-6 flex flex-col">
                <button
                  onClick={() => setSelectedTattoo(null)}
                  className="absolute top-4 right-4 p-2 rounded-full bg-background/80 hover:bg-background transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>

                <h3 className="font-serif text-2xl font-bold text-foreground mb-2">
                  {selectedTattoo.title}
                </h3>

                <div className="flex gap-4 mb-6">
                  <span className="px-3 py-1 rounded-full bg-white/10 text-white/80 text-sm border border-white/20">
                    {categories.find(c => c.id === selectedTattoo.category)?.label}
                  </span>
                  <span className="flex items-center gap-1 text-muted-foreground">
                    <Heart className="w-4 h-4" />
                    {selectedTattoo.likes}
                  </span>
                </div>

                <p className="text-muted-foreground flex-grow leading-relaxed">
                  {selectedTattoo.description}
                </p>

                <div className="flex gap-3 mt-6">
                  <Button 
                    className="flex-1 bg-white/10 hover:bg-white/20 text-white border border-white/20 backdrop-blur-sm"
                    onClick={() => {
                      setSelectedTattoo(null)
                      document.getElementById('agendar')?.scrollIntoView({ behavior: 'smooth' })
                    }}
                  >
                    <Calendar className="w-4 h-4 mr-2" />
                    Agendar cita
                  </Button>
                  <Button variant="outline" size="icon" className="border-white/20 bg-white/5 hover:bg-white/10 text-white">
                    <Share2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </section>
  )
}

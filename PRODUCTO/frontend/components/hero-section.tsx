"use client"

import { motion, AnimatePresence } from "framer-motion"
import { useState, useEffect } from "react"
import { ArrowDown, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import Image from "next/image"

const TATTOO_IMAGES = [
  "/hero-images/media__1776795880811.jpg",
  "/hero-images/media__1776795880835.jpg",
  "/hero-images/media__1776795880920.jpg",
  "/hero-images/media__1776795880946.jpg",
  "/hero-images/media__1776795880965.jpg"
];

export function HeroSection() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % TATTOO_IMAGES.length);
    }, 4500); // Cambia cada 4.5 segundos
    return () => clearInterval(timer);
  }, []);

  return (
    <section
      id="inicio"
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      {/* Blurred background with artistic elements */}
      <div className="absolute inset-0">
        {/* Base gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-background via-secondary to-background" />

        {/* Large blurred decorative images for background effect */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-32 -left-32 w-[600px] h-[600px] opacity-40 blur-3xl">
            <Image
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-Ae0gsgpl6qYo8q2J3AhbNCrW5q6pJD.png"
              alt=""
              fill
              className="object-cover"
              priority
            />
          </div>
          <div className="absolute -bottom-32 -right-32 w-[500px] h-[700px] opacity-30 blur-3xl">
            <Image
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-ofXswJsV4k0H5hhzVhvkuntxgFYMym.png"
              alt=""
              fill
              className="object-cover"
            />
          </div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] opacity-20 blur-3xl">
            <AnimatePresence>
              <motion.div
                key={currentImageIndex}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1.5 }}
                className="absolute inset-0"
              >
                <Image
                  src={TATTOO_IMAGES[currentImageIndex]}
                  alt=""
                  fill
                  className="object-cover"
                />
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Gradient overlays for depth */}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-background/80 via-transparent to-background/80" />

        {/* Subtle animated glow effects */}
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute top-1/4 right-1/4 w-96 h-96 rounded-full bg-primary/20 blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute bottom-1/4 left-1/4 w-80 h-80 rounded-full bg-accent/20 blur-3xl"
        />
      </div>

      {/* Grid pattern overlay */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px),
                           linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)`,
          backgroundSize: '60px 60px'
        }}
      />

      {/* Main content - sharp and clear */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center lg:text-left"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/30 backdrop-blur-sm mb-8"
            >
              <Sparkles className="w-4 h-4 text-primary" />
              <span className="text-sm text-primary font-medium">Arte en tu piel</span>
            </motion.div>

            <h1 className="font-serif text-6xl sm:text-7xl lg:text-8xl font-bold leading-tight mb-8 drop-shadow-[0_10px_20px_rgba(0,0,0,1)]">
              <span className="block bg-gradient-to-b from-white via-white/90 to-gray-400 bg-clip-text text-transparent pb-2">
                Black Ink
              </span>
              <span className="block bg-gradient-to-r from-primary via-accent to-chrome bg-clip-text text-transparent">
                Tattoo
              </span>
            </h1>

            <p className="text-lg text-muted-foreground max-w-xl mb-10 leading-relaxed backdrop-blur-sm bg-background/30 rounded-xl p-4">
              Encuentra a los mejores artistas del tatuaje en un solo lugar. Explora estilos,
              portafolios y agenda tu próxima obra de arte con confianza.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Button
                size="lg"
                className="bg-primary hover:bg-primary/90 text-primary-foreground font-medium px-8 py-6 text-lg shadow-lg shadow-primary/25"
                onClick={() => document.getElementById('artistas')?.scrollIntoView({ behavior: 'smooth' })}
              >
                Buscar Artista
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-border hover:bg-secondary/80 text-foreground px-8 py-6 text-lg backdrop-blur-sm"
              >
                Nuestra Comunidad
              </Button>
            </div>

            <div className="flex items-center gap-8 mt-12 justify-center lg:justify-start">
              <div className="text-center backdrop-blur-sm bg-background/30 rounded-xl px-4 py-3">
                <p className="text-3xl font-bold text-foreground">10+</p>
                <p className="text-sm text-muted-foreground">Artistas</p>
              </div>
              <div className="w-px h-12 bg-border/50" />
              <div className="text-center backdrop-blur-sm bg-background/30 rounded-xl px-4 py-3">
                <p className="text-3xl font-bold text-foreground">15+</p>
                <p className="text-sm text-muted-foreground">Estilos</p>
              </div>
              <div className="w-px h-12 bg-border/50" />
              <div className="text-center backdrop-blur-sm bg-background/30 rounded-xl px-4 py-3">
                <p className="text-3xl font-bold text-foreground">5k+</p>
                <p className="text-sm text-muted-foreground">Tatuajes</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative hidden lg:block"
          >
            <div className="relative w-full aspect-[3/4] max-w-md mx-auto">
              <div className="absolute inset-0 rounded-2xl overflow-hidden border border-primary/20 bg-gradient-to-br from-secondary to-background shadow-2xl shadow-primary/10">
                <AnimatePresence>
                  <motion.div
                    key={currentImageIndex}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 1.5, ease: "easeInOut" }}
                    className="absolute inset-0"
                  >
                    <Image
                      src={TATTOO_IMAGES[currentImageIndex]}
                      alt="Arte de tatuaje rotativo"
                      fill
                      className="object-cover"
                      priority
                    />
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Decorative glowing frame */}
              <div className="absolute -inset-4 rounded-3xl border border-primary/30 shadow-lg shadow-primary/5" />
              <div className="absolute -inset-8 rounded-3xl border border-primary/10" />

              {/* Floating images removed as requested */}
            </div>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="flex flex-col items-center gap-2 text-muted-foreground"
          >
            <span className="text-xs tracking-widest uppercase">Explorar</span>
            <ArrowDown className="w-4 h-4" />
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}

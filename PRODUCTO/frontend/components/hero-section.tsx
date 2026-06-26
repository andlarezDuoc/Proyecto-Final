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



      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 lg:py-24">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center lg:text-left"
          >
            <h1 className="font-rock text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-4 drop-shadow-[0_4px_8px_rgba(0,0,0,0.95)] drop-shadow-[0_16px_32px_rgba(0,0,0,0.95)] drop-shadow-[0_32px_64px_rgba(0,0,0,0.95)] uppercase tracking-wider">
              <span className="block pb-1 bg-gradient-to-b from-white via-slate-200 to-black bg-clip-text text-transparent">
                Black Ink
              </span>
              <span className="block bg-gradient-to-b from-white via-slate-200 to-black bg-clip-text text-transparent">
                Tattoo
              </span>
            </h1>

            <p className="text-sm sm:text-base text-white/90 font-medium max-w-lg mb-6 leading-relaxed backdrop-blur-sm bg-black/40 rounded-xl p-4 drop-shadow-md mx-auto lg:mx-0">
              Encuentra a los mejores artistas del tatuaje en un solo lugar. Explora estilos,
              portafolios y agenda tu próxima obra de arte con confianza.
            </p>

            <div className="flex items-center gap-6 mt-4 justify-center lg:justify-start">
              <div className="text-center backdrop-blur-sm bg-background/30 rounded-xl px-4 py-2.5">
                <p className="text-2xl font-bold text-foreground">10+</p>
                <p className="text-xs text-muted-foreground">Artistas</p>
              </div>
              <div className="w-px h-10 bg-border/50" />
              <div className="text-center backdrop-blur-sm bg-background/30 rounded-xl px-4 py-2.5">
                <p className="text-2xl font-bold text-foreground">15+</p>
                <p className="text-xs text-muted-foreground">Estilos</p>
              </div>
              <div className="w-px h-10 bg-border/50" />
              <div className="text-center backdrop-blur-sm bg-background/30 rounded-xl px-4 py-2.5">
                <p className="text-2xl font-bold text-foreground">5k+</p>
                <p className="text-xs text-muted-foreground">Tatuajes</p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative hidden lg:block"
          >
            <div className="relative w-full aspect-[3/4] max-w-[340px] mx-auto">
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
            </div>
          </motion.div>
        </div>

        {/* Indicador de desplazamiento */}
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

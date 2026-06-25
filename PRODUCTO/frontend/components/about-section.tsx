"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { Instagram, Award, Heart, Clock, Calendar } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Artist, artists } from "@/lib/data/artists"

interface AboutSectionProps {
  artist: Artist;
}

export function AboutSection({ artist }: AboutSectionProps) {
  const mockArtist = artists.find(a => a.id === artist.id || (a.email && a.email.toLowerCase() === artist.email?.toLowerCase()))
  const tattoosCount = artist.stats?.tattoos || mockArtist?.stats?.tattoos || (artist.stats?.completed ? artist.stats.completed + "+" : "300+")

  return (
    <section id="sobre-mi" className="pt-10 pb-20 bg-secondary/30 relative overflow-hidden">

      <div className="absolute top-1/2 left-0 w-[500px] h-[500px] -translate-y-1/2 opacity-20 blur-3xl">
        <Image
          src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-Ae0gsgpl6qYo8q2J3AhbNCrW5q6pJD.png"
          alt=""
          fill
          className="object-cover"
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="font-serif text-4xl sm:text-5xl font-bold text-white mb-4">
            Sobre Mí
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Conoce a la artista detrás de cada obra.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">

          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="relative aspect-[4/5] max-w-md mx-auto rounded-2xl overflow-hidden border border-primary/20 shadow-2xl">
              <Image
                src={artist.avatar}
                alt={artist.name}
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/60 via-transparent to-transparent" />
            </div>


            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="absolute -bottom-6 -right-6 bg-card border border-border rounded-xl p-4 shadow-xl"
            >
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Award className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="font-bold text-foreground">{artist.experience}+ Años</p>
                  <p className="text-sm text-muted-foreground">de Experiencia</p>
                </div>
              </div>
            </motion.div>

          </motion.div>


          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="lg:pl-8"
          >
            <button
              onClick={() => {
                const element = document.getElementById("agendar")
                if (element) {
                  const offset = 90
                  const elementPosition = element.getBoundingClientRect().top
                  const offsetPosition = elementPosition + window.scrollY - offset
                  window.scrollTo({ top: offsetPosition, behavior: "smooth" })
                }
              }}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full text-white border border-white/20 bg-white/10 hover:bg-white/20 font-bold mb-6 cursor-pointer hover:scale-105 transition-all duration-300 shadow-md backdrop-blur-sm"
            >
              <Calendar className="w-4 h-4 text-white" />
              <span>Agendar Cita</span>
            </button>

            <h3 className="font-serif text-3xl font-bold text-foreground mb-4">
              {artist.name}
            </h3>

            <p className="text-muted-foreground leading-relaxed mb-8">
              {artist.fullBio}
            </p>


            <div className="flex flex-wrap gap-2 mb-8">
              {artist.styles.map((spec) => (
                <span
                  key={spec}
                  className="px-3 py-1 rounded-full bg-secondary border border-border text-sm text-foreground"
                >
                  {spec}
                </span>
              ))}
            </div>


            <div className="grid grid-cols-3 gap-4 mb-8 p-4 rounded-xl bg-secondary/50 border border-border">
              <div className="text-center">
                <Clock className="w-5 h-5 text-white mx-auto mb-2" />
                <p className="text-2xl font-bold text-foreground">{artist.experience}+</p>
                <p className="text-xs text-muted-foreground">Años</p>
              </div>
              <div className="text-center border-x border-border">
                <Heart className="w-5 h-5 text-white mx-auto mb-2" />
                <p className="text-2xl font-bold text-foreground">{tattoosCount}</p>
                <p className="text-xs text-muted-foreground">Tatuajes</p>
              </div>
              <div className="text-center">
                <Award className="w-5 h-5 text-white mx-auto mb-2" />
                <p className="text-2xl font-bold text-foreground">100%</p>
                <p className="text-xs text-muted-foreground">Pasión</p>
              </div>
            </div>


            <div className="flex flex-col sm:flex-row gap-4">
              <Button variant="outline" className="border-border flex items-center justify-center gap-2 flex-1" asChild>
                <a href={`https://instagram.com/${artist.instagram.replace('@', '')}`} target="_blank" rel="noopener noreferrer">
                  <Instagram className="w-4 h-4" />
                  Seguir en Instagram ({artist.instagram})
                </a>
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

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
    <section id="sobre-mi" className="pt-6 pb-12 bg-secondary/30 relative overflow-hidden">

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
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-white mb-2">
            Sobre Mí
          </h2>
          <p className="text-muted-foreground text-sm sm:text-base max-w-xl mx-auto">
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
            <div className="relative aspect-[4/5] max-w-xs mx-auto rounded-2xl overflow-hidden border border-primary/20 shadow-2xl">
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
              className="absolute -bottom-4 -right-4 bg-card border border-border rounded-lg p-3 shadow-xl"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <Award className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="font-bold text-sm text-foreground">{artist.experience}+ Años</p>
                  <p className="text-xs text-muted-foreground">de Experiencia</p>
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
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-white border border-white/20 bg-white/10 hover:bg-white/20 font-bold text-xs uppercase tracking-wider mb-4 cursor-pointer hover:scale-105 transition-all duration-300 shadow-md backdrop-blur-sm"
            >
              <Calendar className="w-3.5 h-3.5 text-white" />
              <span>Agendar Cita</span>
            </button>

            <h3 className="font-serif text-2xl sm:text-3xl font-bold text-foreground mb-3">
              {artist.name}
            </h3>

            <p className="text-muted-foreground text-sm leading-relaxed mb-6">
              {artist.fullBio}
            </p>


            <div className="flex flex-wrap gap-1.5 mb-6">
              {artist.styles.map((spec) => (
                <span
                  key={spec}
                  className="px-2.5 py-0.5 rounded-full bg-secondary border border-border text-xs text-foreground"
                >
                  {spec}
                </span>
              ))}
            </div>


            <div className="grid grid-cols-3 gap-3 mb-6 p-3 rounded-lg bg-secondary/50 border border-border max-w-sm">
              <div className="text-center">
                <Clock className="w-4 h-4 text-white mx-auto mb-1" />
                <p className="text-xl font-bold text-foreground">{artist.experience}+</p>
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Años</p>
              </div>
              <div className="text-center border-x border-border">
                <Heart className="w-4 h-4 text-white mx-auto mb-1" />
                <p className="text-xl font-bold text-foreground">{tattoosCount}</p>
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Tatuajes</p>
              </div>
              <div className="text-center">
                <Award className="w-4 h-4 text-white mx-auto mb-1" />
                <p className="text-xl font-bold text-foreground">100%</p>
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Pasión</p>
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

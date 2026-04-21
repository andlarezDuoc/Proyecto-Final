"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import { Instagram, Award, Heart, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Artist } from "@/lib/data/artists"

interface AboutSectionProps {
  artist: Artist;
}

export function AboutSection({ artist }: AboutSectionProps) {
  return (
    <section id="sobre-mi" className="py-24 bg-secondary/30 relative overflow-hidden">
      {/* Blurred background decoration */}
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
          <h2 className="font-serif text-4xl sm:text-5xl font-bold text-foreground mb-4">
            Sobre <span className="text-primary">Mí</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Conoce a la artista detrás de cada obra.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Image side */}
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
            
            {/* Floating stats cards */}
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
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="absolute -top-4 -left-4 bg-card border border-border rounded-xl p-4 shadow-xl"
            >
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center">
                  <Heart className="w-6 h-6 text-accent" />
                </div>
                <div>
                  <p className="font-bold text-foreground">{artist.stats.tattoos}</p>
                  <p className="text-sm text-muted-foreground">Clientes Felices</p>
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* Content side */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="lg:pl-8"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
              <span className="text-sm text-primary font-medium">Artista & Fundadora</span>
            </div>

            <h3 className="font-serif text-3xl font-bold text-foreground mb-4">
              {artist.name}
            </h3>
            
            <p className="text-muted-foreground leading-relaxed mb-8">
              {artist.fullBio}
            </p>

            {/* Specialties */}
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

            {/* Stats row */}
            <div className="grid grid-cols-3 gap-4 mb-8 p-4 rounded-xl bg-secondary/50 border border-border">
              <div className="text-center">
                <Clock className="w-5 h-5 text-primary mx-auto mb-2" />
                <p className="text-2xl font-bold text-foreground">{artist.experience}+</p>
                <p className="text-xs text-muted-foreground">Años</p>
              </div>
              <div className="text-center border-x border-border">
                <Heart className="w-5 h-5 text-primary mx-auto mb-2" />
                <p className="text-2xl font-bold text-foreground">{artist.stats.tattoos}</p>
                <p className="text-xs text-muted-foreground">Tatuajes</p>
              </div>
              <div className="text-center">
                <Award className="w-5 h-5 text-primary mx-auto mb-2" />
                <p className="text-2xl font-bold text-foreground">100%</p>
                <p className="text-xs text-muted-foreground">Pasión</p>
              </div>
            </div>

            {/* CTA */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button className="bg-primary hover:bg-primary/90 text-primary-foreground flex-1">
                Agendar Cita
              </Button>
              <Button variant="outline" className="border-border flex items-center gap-2" asChild>
                <a href={`https://instagram.com/${artist.instagram.replace('@', '')}`} target="_blank" rel="noopener noreferrer">
                  <Instagram className="w-4 h-4" />
                  {artist.instagram}
                </a>
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

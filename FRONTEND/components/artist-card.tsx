"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { MapPin, Star, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Artist } from "@/lib/data/artists"

interface ArtistCardProps {
  artist: Artist;
  index: number;
}

export function ArtistCard({ artist, index }: ArtistCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="group relative rounded-2xl overflow-hidden bg-background/50 border border-primary/20 backdrop-blur-sm shadow-xl hover:shadow-primary/20 hover:border-primary/50 transition-all duration-300"
    >
      {/* Background glow effect on hover */}
      <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/60 to-transparent z-10" />
      
      {/* Artist Avatar as main background image */}
      <div className="relative aspect-[3/4] w-full">
        <Image
          src={artist.avatar}
          alt={artist.name}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-110"
        />
      </div>

      {/* Content overlay */}
      <div className="absolute inset-0 z-20 flex flex-col justify-end p-6">
        <div className="transform transition-transform duration-300 translate-y-4 group-hover:translate-y-0">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-serif text-2xl font-bold text-foreground">
              {artist.name}
            </h3>
            <div className="flex items-center gap-1 bg-background/50 backdrop-blur-md px-2 py-1 rounded-full text-sm">
              <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
              <span className="font-medium text-foreground">{artist.stats.rating}</span>
            </div>
          </div>

          <div className="flex items-center gap-2 text-muted-foreground mb-3 text-sm">
            <MapPin className="w-4 h-4 text-primary" />
            <span>{artist.location}</span>
          </div>

          {/* Styles tags */}
          <div className="flex flex-wrap gap-2 mb-4">
            {artist.styles.slice(0, 3).map((style) => (
              <span 
                key={style}
                className="text-xs px-2 py-1 bg-secondary/80 text-foreground rounded-md border border-border backdrop-blur-sm"
              >
                {style}
              </span>
            ))}
            {artist.styles.length > 3 && (
              <span className="text-xs px-2 py-1 bg-secondary/80 text-foreground rounded-md border border-border backdrop-blur-sm">
                +{artist.styles.length - 3}
              </span>
            )}
          </div>

          <p className="text-sm text-foreground/80 mb-6 line-clamp-2">
            {artist.shortBio}
          </p>

          <Link href={`/artist/${artist.id}`} className="block w-full">
            <Button
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-medium opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-4 group-hover:translate-y-0"
            >
              Ver Perfil <Sparkles className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>
      </div>
    </motion.div>
  )
}

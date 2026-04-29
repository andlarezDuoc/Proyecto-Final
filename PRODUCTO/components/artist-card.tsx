"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Artist } from "@/lib/data/artists"

interface ArtistCardProps {
  artist: Artist;
  index: number;
}

export function ArtistCard({ artist, index }: ArtistCardProps) {
  // Use the first portfolio image as cover, fallback to avatar if none exists
  const coverImage = artist.portfolio && artist.portfolio.length > 0 ? artist.portfolio[0] : artist.avatar;

  // Mock distance for the UI to match the requested design (deterministic)
  const mockDistance = ((artist.name.length % 8) + 1.2).toFixed(1);
  
  // Mock review count (deterministic)
  const mockReviews = (artist.name.length * 11) % 150 + 30;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="group flex flex-col bg-[#121212]/80 backdrop-blur-md border border-white/10 rounded-2xl overflow-hidden shadow-xl hover:border-primary/50 transition-all duration-300"
    >
      {/* Cover Image */}
      <div className="relative h-48 w-full bg-muted">
        <Image
          src={coverImage}
          alt={`Portada de ${artist.name}`}
          fill
          className="object-cover"
        />
        {/* Avatar overlapping */}
        <div className="absolute -bottom-6 left-6 rounded-full border-4 border-[#121212] overflow-hidden w-14 h-14 bg-muted z-10">
          <Image
            src={artist.avatar}
            alt={artist.name}
            fill
            className="object-cover"
          />
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 p-6 pt-10">
        <div className="flex justify-between items-start mb-1">
          <h3 className="font-serif text-xl font-bold text-foreground">
            {artist.name}
          </h3>
          <div className="flex flex-col items-end">
            <div className="flex items-center gap-1 text-sm font-bold text-foreground">
              <span>{artist.stats.rating}</span>
              <Star className="w-4 h-4 text-white fill-white" />
            </div>
            <span className="text-[11px] text-muted-foreground">{mockReviews} reseñas</span>
          </div>
        </div>

        <div className="text-xs text-muted-foreground mb-4">
          <span>{artist.location} • {mockDistance} km</span>
        </div>

        {/* Styles tags */}
        <div className="flex flex-wrap gap-x-4 gap-y-2 mb-4">
          {artist.styles.slice(0, 2).map((style, i) => (
            <span
              key={style}
              className="text-xs font-semibold text-white"
            >
              {style}
            </span>
          ))}
        </div>

        <p className="text-sm text-foreground/70 mb-6 flex-1 line-clamp-3">
          {artist.shortBio} {artist.fullBio && artist.fullBio !== artist.shortBio ? artist.fullBio : ''}
        </p>

        <div className="flex gap-3 mt-auto">
          <Button asChild className="w-full bg-white/10 hover:bg-white/20 text-white border-none rounded-md h-10 font-medium flex-1">
            <Link href={`/artist/${artist.id}`}>
              Ver perfil
            </Link>
          </Button>
          <Button variant="ghost" className="flex-1 hover:bg-white/5 text-white rounded-md h-10 font-medium">
            Reservar
          </Button>
        </div>
      </div>
    </motion.div>
  )
}

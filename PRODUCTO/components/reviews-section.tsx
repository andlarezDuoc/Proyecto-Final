"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Star, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import Link from "next/link"

import { supabase } from "@/lib/supabase"

interface Review {
  id: string;
  artistId: string;
  author: string;
  rating: number;
  comment: string;
  date: string;
}

export function ReviewsSection({ artistId, artistName }: { artistId: string, artistName: string }) {
  const [reviews, setReviews] = useState<Review[]>([])
  const [isClient, setIsClient] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)
  
  const [newRating, setNewRating] = useState(5)
  const [newComment, setNewComment] = useState("")

  useEffect(() => {
    // Check if logged in as client
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (session?.user?.user_metadata?.role === 'client') {
        setIsClient(true)
      }
    }
    checkSession()

    // Load reviews from local storage
    const stored = localStorage.getItem(`reviews_${artistId}`)
    if (stored) {
      setReviews(JSON.parse(stored))
    } else {
      // Mock some initial reviews
      const mockReviews = [
        {
          id: "1",
          artistId,
          author: "Cliente Anónimo",
          rating: 5,
          comment: `¡Excelente trabajo! Me encantó cómo quedó mi tatuaje con ${artistName}.`,
          date: "2024-01-15T12:00:00.000Z" // Deterministic date to prevent hydration errors
        }
      ]
      setReviews(mockReviews)
      localStorage.setItem(`reviews_${artistId}`, JSON.stringify(mockReviews))
    }
    setIsLoaded(true)
  }, [artistId, artistName])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newComment.trim()) return

    const newReview: Review = {
      id: Date.now().toString(),
      artistId,
      author: "Usuario (Tú)",
      rating: newRating,
      comment: newComment,
      date: new Date().toISOString()
    }

    const updated = [newReview, ...reviews]
    setReviews(updated)
    localStorage.setItem(`reviews_${artistId}`, JSON.stringify(updated))
    setNewComment("")
    setNewRating(5)
  }

  if (!isLoaded) return null;

  return (
    <section className="py-24 relative overflow-hidden bg-zinc-950 border-t border-zinc-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12"
        >
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-white mb-4">
            Reseñas de Clientes
          </h2>
          <p className="text-muted-foreground">
            Conoce la experiencia de otros clientes con {artistName}.
          </p>
        </motion.div>

        {/* Add Review Form */}
        <div className="mb-12 bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-xl">
          {isClient ? (
            <form onSubmit={handleSubmit}>
              <h3 className="text-xl font-bold text-white mb-4">Deja tu reseña</h3>
              <div className="flex gap-2 mb-4">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setNewRating(star)}
                    className="focus:outline-none transition-transform hover:scale-110"
                  >
                    <Star className={`w-8 h-8 ${star <= newRating ? 'fill-yellow-400 text-yellow-400' : 'text-zinc-600'}`} />
                  </button>
                ))}
              </div>
              <Textarea 
                placeholder="Escribe tu experiencia aquí..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                className="bg-black/50 border-zinc-700 text-white mb-4 min-h-[100px] focus:border-white focus:ring-1 focus:ring-white transition-all"
                required
              />
              <Button type="submit" className="bg-white text-black hover:bg-zinc-200 py-6 px-8 text-lg font-medium transition-all">
                Publicar Reseña
              </Button>
            </form>
          ) : (
            <div className="text-center py-8">
              <div className="flex justify-center mb-4">
                 <Star className="w-12 h-12 text-zinc-600" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">¿Te tatuaste con {artistName.split(' ')[0]}?</h3>
              <p className="text-zinc-400 mb-6 max-w-md mx-auto">Inicia sesión como cliente para poder dejar una reseña, calificar el servicio y compartir tu experiencia.</p>
              <Button asChild className="bg-white text-black hover:bg-zinc-200 px-6">
                <Link href={`/login-client?redirect=/artist/${artistId}`}>
                  Iniciar Sesión como Cliente
                </Link>
              </Button>
            </div>
          )}
        </div>

        {/* Reviews List */}
        <div className="space-y-6">
          {reviews.length === 0 ? (
            <p className="text-zinc-500 text-center py-8">Aún no hay reseñas para este artista.</p>
          ) : (
            reviews.map((review, idx) => (
              <motion.div 
                key={review.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="bg-black border border-zinc-800 rounded-xl p-6 hover:border-zinc-700 transition-colors"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="bg-zinc-800 p-2 rounded-full">
                      <User className="w-5 h-5 text-zinc-400" />
                    </div>
                    <div>
                      <p className="text-white font-medium">{review.author}</p>
                      <p className="text-xs text-zinc-500">
                        {new Date(review.date).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className={`w-4 h-4 ${i < review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-zinc-700'}`} />
                    ))}
                  </div>
                </div>
                <p className="text-zinc-300 leading-relaxed">{review.comment}</p>
              </motion.div>
            ))
          )}
        </div>
      </div>
    </section>
  )
}

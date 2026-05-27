"use client"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { Upload, Trash2, Plus, Image as ImageIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Artist, artists } from "@/lib/data/artists"
import { supabase } from "@/lib/supabase"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

export default function DashboardPage() {
  const router = useRouter()
  const [artistId, setArtistId] = useState<string | null>(null)
  const [defaultArtistData, setDefaultArtistData] = useState<Artist | null>(null)
  
  // Local state for the gallery to demonstrate CRUD operations visually
  const [gallery, setGallery] = useState<string[]>([])
  const [isReady, setIsReady] = useState(false)
  
  useEffect(() => {
    async function fetchUser() {
      const { data: { session } } = await supabase.auth.getSession()
      if (session?.user) {
        const userId = session.user.id
        setArtistId(userId)
        
        let artistRecord = null
        
        // 1. Buscamos primero si ya existe un perfil en la base de datos con nuestro UUID real
        const { data: uuidData } = await supabase
          .from('artists')
          .select('*')
          .eq('id', userId)
          .single()
          
        const artistSlug = session.user.user_metadata?.artist_slug
        const localMatch = artists.find(a => a.id === artistSlug) || artists.find(a => 
          session.user.email && a.id.toLowerCase().includes(session.user.email.split('@')[0].toLowerCase())
        )
        
        if (uuidData) {
          artistRecord = uuidData
          
          // Cada vez que se inicia sesión, nos aseguramos de cargarle las 8 imágenes del portafolio del artista local
          if (localMatch) {
            console.log("Cargando/Restaurando las 8 imágenes del portafolio en la base de datos...")
            const updatedData = {
              name: uuidData.name === "Nuevo Artista" ? localMatch.name : uuidData.name,
              location: uuidData.location === "Ciudad" ? localMatch.location : uuidData.location,
              styles: uuidData.styles && uuidData.styles.length > 0 ? uuidData.styles : localMatch.styles,
              portfolio: localMatch.portfolio,
              shortbio: uuidData.shortbio === "Nuevo artista en Black Ink." ? localMatch.shortBio : uuidData.shortbio,
              fullbio: uuidData.fullbio === "Biografía en desarrollo." ? localMatch.fullBio : uuidData.fullbio,
              avatar: uuidData.avatar.includes("unsplash.com/photo-1534528741775-53994a69daeb") ? localMatch.avatar : uuidData.avatar,
              experience: uuidData.experience === 1 ? localMatch.experience : uuidData.experience,
              instagram: uuidData.instagram === "" ? localMatch.instagram : uuidData.instagram
            }
            
            const { error: updateError } = await supabase
              .from('artists')
              .update(updatedData)
              .eq('id', userId)
              
            if (!updateError) {
              artistRecord = { ...uuidData, ...updatedData }
            } else {
              console.error("Error al actualizar perfil de base de datos:", updateError)
            }
          }
        } else {
          // Si no existe un perfil en la base de datos para nuestro UUID, lo creamos
          console.log("No se encontró perfil de artista con UUID en la base de datos. Creando uno inicial...")
          
          const initialArtist = {
            id: userId, // ID es el UUID real del usuario autenticado
            name: localMatch ? localMatch.name : (session.user.user_metadata?.full_name || "Nuevo Artista"),
            email: session.user.email || "",
            location: localMatch ? localMatch.location : "Ciudad",
            styles: localMatch ? localMatch.styles : [],
            portfolio: localMatch ? localMatch.portfolio : [],
            shortbio: localMatch ? localMatch.shortBio : "Nuevo artista en Black Ink.",
            fullbio: localMatch ? localMatch.fullBio : "Biografía en desarrollo.",
            avatar: localMatch ? localMatch.avatar : "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=400",
            experience: localMatch ? localMatch.experience : 1,
            stats: localMatch ? { rating: Number(localMatch.stats.rating) || 5, completed: 0, reviews: 0 } : { rating: 5, completed: 0, reviews: 0 },
            instagram: localMatch ? localMatch.instagram : ""
          }
          
          // Hacemos el INSERT en Supabase. Esto funciona 100% porque id == userId (pasa la regla RLS de INSERT)
          const { error: insertError } = await supabase.from('artists').insert([initialArtist])
          if (insertError) {
            console.error('Error al insertar perfil de artista inicial:', insertError)
          } else {
            console.log("Perfil inicial de artista insertado exitosamente con RLS aprobado.")
          }
          
          artistRecord = initialArtist
        }
        
        if (artistRecord) {
          setDefaultArtistData({
            ...artistRecord,
            shortBio: artistRecord.shortbio || artistRecord.shortBio || "Nuevo artista en Black Ink.",
            fullBio: artistRecord.fullbio || artistRecord.fullBio || "Biografía en desarrollo."
          } as Artist)
        }
      } else {
        // Si no hay sesión iniciada, redirigimos a la pantalla de login del tatuador
        router.push('/login')
      }
    }
    fetchUser()
  }, [router])
  
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (defaultArtistData) {
      setGallery(defaultArtistData.portfolio || [])
      setIsReady(true)
    }
  }, [defaultArtistData])

  const handleDelete = async (indexToDelete: number) => {
    if (!defaultArtistData || !artistId) return
    const updatedPortfolio = gallery.filter((_, i) => i !== indexToDelete)
    
    try {
      const { error } = await supabase
        .from('artists')
        .update({ portfolio: updatedPortfolio })
        .eq('id', artistId)
      
      if (error) throw error
      setGallery(updatedPortfolio)
    } catch (err: any) {
      console.error('Error al eliminar:', err.message)
      alert('Error al eliminar la imagen de la base de datos.')
    }
  }

  const handleUploadClick = () => {
    fileInputRef.current?.click()
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file || !defaultArtistData || !artistId) return

    try {
      // 1. Subir a Supabase Storage
      const fileExt = file.name.split('.').pop()
      const fileName = `${artistId}-${Date.now()}.${fileExt}`
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('portfolio')
        .upload(fileName, file)

      if (uploadError) throw uploadError

      // 2. Obtener URL pública
      const { data: { publicUrl } } = supabase.storage
        .from('portfolio')
        .getPublicUrl(fileName)

      // 3. Actualizar registro del artista en base de datos
      const updatedPortfolio = [publicUrl, ...gallery]
      const { error: updateError } = await supabase
        .from('artists')
        .update({ portfolio: updatedPortfolio })
        .eq('id', artistId)

      if (updateError) throw updateError

      // 4. Actualizar estado local
      setGallery(updatedPortfolio)

      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }
    } catch (err: any) {
      console.error('Error uploading image:', err.message)
      alert('Error al subir la imagen. ¿Creaste el bucket "portfolio" con políticas públicas en Supabase?')
    }
  }

  if (!isReady) return null

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <header>
        <h1 className="text-4xl font-serif font-bold text-white mb-2">Mi Portafolio</h1>
        <p className="text-zinc-400">
          Administra las fotografías de los tatuajes que se muestran públicamente en tu perfil.
        </p>
      </header>

      {/* Grid de Portafolio */}
      <section>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          
          {/* Tarjeta de Subida */}
          <div 
            onClick={handleUploadClick}
            className="aspect-[3/4] rounded-2xl border-2 border-dashed border-zinc-700 bg-zinc-900/30 hover:bg-zinc-800/50 hover:border-white/50 transition-all cursor-pointer flex flex-col items-center justify-center p-6 text-center group"
          >
            <div className="w-16 h-16 rounded-full bg-zinc-800 group-hover:bg-white flex items-center justify-center transition-colors mb-4">
              <Upload className="w-8 h-8 text-zinc-400 group-hover:text-black transition-colors" />
            </div>
            <p className="font-semibold text-white mb-1">Subir nueva pieza</p>
            <p className="text-sm text-zinc-500">JPG, PNG, formato vertical</p>
            <input 
              type="file" 
              ref={fileInputRef} 
              className="hidden" 
              accept="image/*"
              onChange={handleFileChange}
            />
          </div>

          {/* Galería de imágenes actual */}
          <AnimatePresence>
            {gallery.map((imgUrl, index) => (
              <motion.div
                key={`${imgUrl}-${index}`}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3 }}
                className="relative aspect-[3/4] rounded-2xl overflow-hidden group border border-white/10"
              >
                <Image
                  src={imgUrl}
                  alt={`Portfolio piece ${index + 1}`}
                  fill
                  className="object-cover"
                />
                
                {/* Overlay de gradiente */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                
                {/* Botón de eliminar con confirmación */}
                <div className="absolute bottom-4 right-4 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button 
                        variant="destructive" 
                        size="icon"
                        className="h-10 w-10 md:h-12 md:w-12 rounded-full shadow-xl shadow-red-900/50 bg-red-600 hover:bg-red-500 text-white"
                      >
                        <Trash2 className="w-5 h-5" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent className="bg-zinc-950 border-zinc-800">
                      <AlertDialogHeader>
                        <AlertDialogTitle className="text-white">Eliminar fotografía</AlertDialogTitle>
                        <AlertDialogDescription className="text-zinc-400">
                          ¿Estás seguro que deseas eliminar esta pieza de tu portafolio? Esta acción la removerá de tu perfil público y no se puede deshacer.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel className="bg-zinc-900 text-white border-zinc-700 hover:bg-zinc-800 hover:text-white">Cancelar</AlertDialogCancel>
                        <AlertDialogAction 
                          onClick={() => handleDelete(index)}
                          className="bg-red-600 text-white hover:bg-red-500"
                        >
                          Sí, eliminar
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          
        </div>

        {gallery.length === 0 && (
          <div className="mt-8 text-center p-12 bg-zinc-900/30 rounded-2xl border border-white/5">
            <ImageIcon className="w-16 h-16 text-zinc-700 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-white mb-2">Galería Vacía</h3>
            <p className="text-zinc-500">Sube tu primer diseño para empezar a armar tu portafolio.</p>
          </div>
        )}
      </section>
    </div>
  )
}

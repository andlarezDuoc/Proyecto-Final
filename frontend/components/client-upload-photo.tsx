"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Camera, Send, CheckCircle2, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Artist } from "@/lib/data/artists"
import { supabase } from "@/lib/supabase"

interface ClientUploadPhotoProps {
  artist: Artist
}

export function ClientUploadPhoto({ artist }: ClientUploadPhotoProps) {
  const [isClient, setIsClient] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const [file, setFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [isSending, setIsSending] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [notes, setNotes] = useState("")
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    // Check if logged in as client
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (session?.user?.user_metadata?.role === 'client') {
        setIsClient(true)
      }
    }
    checkSession()
  }, [])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      setFile(selectedFile)
      setPreviewUrl(URL.createObjectURL(selectedFile))
    }
  }

  const handleSend = () => {
    if (!file) return

    setIsSending(true)
    
    // Simulamos el tiempo de envío al servidor
    setTimeout(() => {
      setIsSending(false)
      setIsSuccess(true)
      
      // Reseteamos el modal tras un breve tiempo para mostrar el éxito
      setTimeout(() => {
        setIsOpen(false)
        setFile(null)
        setPreviewUrl(null)
        setNotes("")
        setIsSuccess(false)
      }, 2500)
    }, 1500)
  }

  // Si no eres cliente, este botón invisible especial no se muestra en el perfil del tatuador
  if (!isClient) return null

  return (
    <>
      {/* Botón Flotante Fijo para enviar tatuaje cicatrizado */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1, duration: 0.5 }}
        className="fixed bottom-6 right-6 md:bottom-10 md:right-10 z-40"
      >
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button
              className="bg-white text-black hover:bg-zinc-200 shadow-[0_0_30px_rgba(255,255,255,0.3)] rounded-full px-6 py-6 h-auto flex gap-3 group border border-white/20"
            >
              <Camera className="w-5 h-5 group-hover:scale-110 transition-transform" />
              <span className="font-medium hidden sm:inline">Reporte de Cicatrización</span>
              <span className="font-medium sm:hidden">Cicatrización</span>
            </Button>
          </DialogTrigger>

          <DialogContent className="bg-zinc-950 border-white/10 sm:max-w-md backdrop-blur-3xl overflow-hidden p-0">
            {isSuccess ? (
              <div className="p-10 flex flex-col items-center justify-center text-center space-y-4 animate-in fade-in zoom-in duration-500 min-h-[300px]">
                <div className="w-20 h-20 rounded-full bg-green-500/20 flex items-center justify-center">
                  <CheckCircle2 className="w-10 h-10 text-green-400" />
                </div>
                <h3 className="text-2xl font-serif text-white">¡Enviado con éxito!</h3>
                <p className="text-zinc-400">
                  {artist.name} ha recibido la foto de tu tatuaje cicatrizado. Tu ficha clínica ha sido actualizada.
                </p>
              </div>
            ) : (
              <div className="p-6">
                <DialogHeader className="mb-6">
                  <DialogTitle className="text-2xl font-serif text-white flex gap-2 items-center">
                    <Camera className="w-6 h-6 text-zinc-400" /> Seguimiento
                  </DialogTitle>
                  <DialogDescription className="text-zinc-400">
                    Sube una foto clara de tu tatuaje cicatrizado para que {artist.name} pueda evaluar el resultado final de su trabajo.
                  </DialogDescription>
                </DialogHeader>

                <div className="space-y-6">
                  {/* Upload Dropzone */}
                  {!previewUrl ? (
                    <div 
                      onClick={() => fileInputRef.current?.click()}
                      className="border-2 border-dashed border-zinc-700 bg-zinc-900/50 hover:bg-zinc-800 hover:border-white/50 transition-colors rounded-2xl p-8 text-center cursor-pointer flex flex-col items-center gap-3"
                    >
                      <div className="w-14 h-14 rounded-full bg-white/5 flex items-center justify-center">
                        <Camera className="w-6 h-6 text-zinc-400" />
                      </div>
                      <p className="text-sm text-zinc-300 font-medium">Toca para seleccionar una foto</p>
                      <p className="text-xs text-zinc-500">Intenta tomarla con buena iluminación</p>
                      <input 
                        type="file" 
                        ref={fileInputRef} 
                        className="hidden" 
                        accept="image/*"
                        onChange={handleFileChange}
                      />
                    </div>
                  ) : (
                    <div className="relative rounded-2xl overflow-hidden aspect-video bg-zinc-900 border border-white/10 group">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                      <button 
                        onClick={() => { setFile(null); setPreviewUrl(null) }}
                        className="absolute top-2 right-2 w-8 h-8 rounded-full bg-black/50 hover:bg-black backdrop-blur-md flex items-center justify-center border border-white/20 transition-colors"
                      >
                        <X className="w-4 h-4 text-white" />
                      </button>
                    </div>
                  )}

                  {/* Notes input */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-zinc-300">¿Tienes alguna observación?</label>
                    <textarea 
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="Ej: Curó muy bien, no perdí ningún color..."
                      className="w-full bg-black/50 border border-zinc-800 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-zinc-500 focus:ring-1 focus:ring-zinc-500 transition-all min-h-[80px] resize-none"
                    />
                  </div>

                  {/* Actions */}
                  <div className="flex justify-end gap-3 pt-2">
                    <Button 
                      onClick={handleSend}
                      disabled={!file || isSending}
                      className="w-full bg-white text-black hover:bg-zinc-200"
                    >
                      {isSending ? (
                        <>
                          <div className="w-4 h-4 mr-2 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                          Enviando al tatuador...
                        </>
                      ) : (
                        <>
                          <Send className="w-4 h-4 mr-2" /> Enviar Reporte
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </motion.div>
    </>
  )
}

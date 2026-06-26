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
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (session?.user?.user_metadata?.role === 'client') {
        setIsClient(true)
      }
    }
    checkSession()

    const handleOpen = () => {
      setIsOpen(true)
    }
    window.addEventListener("open-healing-report", handleOpen)
    return () => window.removeEventListener("open-healing-report", handleOpen)
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

  // Si no eres cliente, no se renderiza el diálogo
  if (!isClient) return null

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
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
              <DialogDescription className="text-zinc-400 text-sm">
                Sube una foto clara de tu tatuaje cicatrizado para que {artist.name} pueda evaluar el resultado final de su trabajo.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-6">
              {/* Selector de archivo */}
              {!previewUrl ? (
                <div 
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-zinc-800 hover:border-zinc-500 rounded-2xl p-8 flex flex-col items-center justify-center gap-3 cursor-pointer group bg-black/35 hover:bg-black/50 transition-all"
                >
                  <div className="w-12 h-12 rounded-full bg-zinc-900 group-hover:bg-zinc-800 flex items-center justify-center border border-zinc-800 transition-colors">
                    <Camera className="w-5 h-5 text-zinc-400 group-hover:text-white transition-colors" />
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-semibold text-white">Seleccionar Foto</p>
                    <p className="text-xs text-zinc-500 mt-1">Soporta PNG, JPG o WebP</p>
                  </div>
                  <input 
                    type="file" 
                    ref={fileInputRef} 
                    onChange={handleFileChange}
                    accept="image/*" 
                    className="hidden" 
                  />
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="relative aspect-video rounded-xl overflow-hidden border border-zinc-800 bg-black">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img 
                      src={previewUrl} 
                      alt="Vista previa de tu tatuaje cicatrizado" 
                      className="w-full h-full object-contain"
                    />
                    <button 
                      onClick={() => {
                        setFile(null)
                        setPreviewUrl(null)
                      }}
                      className="absolute top-2 right-2 p-1.5 rounded-full bg-black/70 hover:bg-black text-white transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* Campo de notas */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-zinc-300">¿Tienes alguna observación?</label>
                <textarea 
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Ej: Curó muy bien, no perdí ningún color..."
                  className="w-full bg-black/50 border border-zinc-800 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-zinc-500 focus:ring-1 focus:ring-zinc-500 transition-all min-h-[80px] resize-none"
                />
              </div>

              {/* Botones de acción */}
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
  )
}

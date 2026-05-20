"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { useRouter } from "next/navigation"
import { LogIn, Droplet, ArrowRight, Lock, Mail } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { supabase } from "@/lib/supabase"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // Intentamos iniciar sesión
      let { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      // Si el usuario no existe, lo registramos automáticamente (solo para desarrollo/prototipo)
      if (error && error.message.includes('Invalid login credentials')) {
        const { error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              role: 'artist'
            }
          }
        })
        if (signUpError) throw signUpError
      } else if (error) {
        throw error
      }

      router.push("/dashboard")
    } catch (err: any) {
      console.error('Error de autenticación:', err.message)
      alert('Error: ' + err.message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-black flex flex-col justify-center relative overflow-hidden">
      {/* Fondo y efectos de luz */}
      <div className="absolute inset-0 z-0 bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.1)_0,black_60%)]" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative z-10 w-full max-w-md mx-auto p-6 sm:p-8"
      >
        <div className="mb-10 text-center">
          <Link href="/" className="inline-flex items-center gap-2 mb-6">
            <Droplet className="w-8 h-8 text-white" />
            <span className="font-serif text-2xl font-bold tracking-wider text-white">
              BLACK INK
            </span>
          </Link>
          <h1 className="text-3xl font-serif font-bold text-white mb-2">
            Portal de Creadores
          </h1>
          <p className="text-zinc-400">
            Ingresa a tu cuenta para gestionar tu perfil y portafolio
          </p>
        </div>

        <div className="bg-zinc-900/50 backdrop-blur-xl border border-zinc-800 rounded-3xl p-8 shadow-2xl">
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-zinc-300">
                Correo Electrónico
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
                <Input
                  id="email"
                  type="email"
                  placeholder="tatuador@blackink.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 bg-black/50 border-zinc-700 text-white placeholder:text-zinc-600 focus:border-white focus:ring-1 focus:ring-white transition-all"
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-zinc-300">
                  Contraseña
                </Label>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 bg-black/50 border-zinc-700 text-white focus:border-white focus:ring-1 focus:ring-white transition-all"
                />
              </div>
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-white text-black hover:bg-zinc-200 py-6 text-lg font-medium transition-all group"
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                  Iniciando sesión...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  <LogIn className="w-5 h-5" />
                  Acceder a mi Dashboard
                  <ArrowRight className="w-5 h-5 ml-auto opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                </span>
              )}
            </Button>
          </form>

          <div className="mt-8 text-center text-sm">
            <span className="text-zinc-500">¿No tienes cuenta de creador? </span>
            <Link href="/register" className="text-white cursor-pointer hover:underline">Regístrate aquí</Link>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

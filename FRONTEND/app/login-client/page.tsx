"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { useRouter } from "next/navigation"
import { Droplet, ArrowRight, Lock, Mail, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"

export default function ClientLoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Simulando inicio de sesión temporal
    setTimeout(() => {
      setIsLoading(false)
      // Guardamos la sesión como CLIENTE
      localStorage.setItem('authRole', 'client')
      // Redirigimos de vuelta a la página del artista o al inicio
      const searchParams = new URLSearchParams(window.location.search)
      const redirectPath = searchParams.get('redirect') || "/"
      router.push(redirectPath)
      // Pequeño timeout para forzar la actualización de la UI si Next.js no detecta la navegación de la misma página inmediatamente
      setTimeout(() => {
        window.location.reload()
      }, 100)
    }, 1500)
  }

  return (
    <div className="min-h-screen bg-black flex flex-col justify-center relative overflow-hidden">
      {/* Fondo y efectos de luz - distinto color de luz para distinguir del tatuador */}
      <div className="absolute inset-0 z-0 bg-[radial-gradient(ellipse_at_center,rgba(50,50,50,0.4)_0,black_60%)]" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative z-10 w-full max-w-md mx-auto p-6 sm:p-8"
      >
        <div className="mb-10 text-center">
          <Link href="/" className="inline-flex items-center gap-2 mb-6 cursor-pointer">
            <Droplet className="w-8 h-8 text-white" />
            <span className="font-serif text-2xl font-bold tracking-wider text-white">
              BLACK INK
            </span>
          </Link>
          <div className="flex justify-center mb-4">
            <div className="bg-white/10 p-3 rounded-full border border-white/20">
               <Users className="w-6 h-6 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-serif font-bold text-white mb-2">
            Portal de Clientes
          </h1>
          <p className="text-zinc-400">
            Ingresa para gestionar citas y hacer seguimiento a tus tatuajes
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
                  placeholder="cliente@correo.com"
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
                  Conectando...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  Ingresar a mi cuenta
                  <ArrowRight className="w-5 h-5 ml-auto opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                </span>
              )}
            </Button>
          </form>
          
          <div className="mt-6 text-center">
            <span className="text-sm text-zinc-500">¿Aún no tienes cuenta? </span>
            <span className="text-white text-sm font-medium hover:underline cursor-pointer">Regístrate</span>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

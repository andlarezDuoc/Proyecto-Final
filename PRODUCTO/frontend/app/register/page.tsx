"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { useRouter } from "next/navigation"
import { Droplet, ArrowRight, Lock, Mail, User, PenTool } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { supabase } from "@/lib/supabase"

export default function RegisterPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [name, setName] = useState("")
  const [role, setRole] = useState<'client' | 'artist'>('client')
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // 1. Registramos al usuario en Supabase Auth (esto lo guarda en auth.users de forma segura)
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            role: role,
            full_name: name,
          }
        }
      })

      if (error) throw error

      // 2. Insertamos el perfil en nuestra tabla pública (opcional si usamos Triggers, pero lo hacemos aquí por si acaso)
      // Nota: Idealmente esto se hace con un Trigger en SQL, pero por ahora lo hacemos manual para asegurar que esté en la DB
      const { error: profileError } = await supabase
        .from('profiles')
        .insert([
          {
            id: data.user?.id,
            email: email,
            role: role,
            full_name: name,
          }
        ])

      // Si es artista, lo agregamos a la tabla artists con datos vacíos
      if (role === 'artist' && data.user) {
        await supabase.from('artists').insert([{
          id: data.user.id, // En una app real, el ID sería un slug único, aquí usamos el auth ID o un slug generado
          name: name,
          email: email,
          location: "Ciudad",
          styles: [],
          portfolio: []
        }])
      }

      alert("¡Registro exitoso! Ya puedes iniciar sesión.")
      router.push(role === 'artist' ? "/login" : "/login-client")
    } catch (err: any) {
      console.error('Error de registro:', err.message)
      alert('Error: ' + err.message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-black flex flex-col justify-center relative overflow-hidden">
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
          <h1 className="text-3xl font-serif font-bold text-white mb-2">
            Crear Cuenta
          </h1>
          <p className="text-zinc-400">
            Únete a nuestra comunidad de tatuajes
          </p>
        </div>

        <div className="bg-zinc-900/50 backdrop-blur-xl border border-zinc-800 rounded-3xl p-8 shadow-2xl">
          <form onSubmit={handleRegister} className="space-y-6">
            
            {/* Selector de Rol */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <Button
                type="button"
                onClick={() => setRole('client')}
                className={`flex flex-col items-center justify-center h-24 gap-2 transition-all ${
                  role === 'client' 
                  ? 'bg-white text-black hover:bg-zinc-200' 
                  : 'bg-black/50 text-zinc-400 border border-zinc-800 hover:bg-zinc-800'
                }`}
              >
                <User className="w-6 h-6" />
                <span>Soy Cliente</span>
              </Button>
              <Button
                type="button"
                onClick={() => setRole('artist')}
                className={`flex flex-col items-center justify-center h-24 gap-2 transition-all ${
                  role === 'artist' 
                  ? 'bg-white text-black hover:bg-zinc-200' 
                  : 'bg-black/50 text-zinc-400 border border-zinc-800 hover:bg-zinc-800'
                }`}
              >
                <PenTool className="w-6 h-6" />
                <span>Soy Tatuador</span>
              </Button>
            </div>

            <div className="space-y-2">
              <Label htmlFor="name" className="text-zinc-300">
                Nombre Completo
              </Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
                <Input
                  id="name"
                  type="text"
                  placeholder="Tu nombre"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="pl-10 bg-black/50 border-zinc-700 text-white focus:border-white focus:ring-1 focus:ring-white transition-all"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-zinc-300">
                Correo Electrónico
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
                <Input
                  id="email"
                  type="email"
                  placeholder="correo@ejemplo.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 bg-black/50 border-zinc-700 text-white placeholder:text-zinc-600 focus:border-white focus:ring-1 focus:ring-white transition-all"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-zinc-300">
                Contraseña
              </Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  required
                  minLength={6}
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
                  Registrando...
                </span>
              ) : (
                <span className="flex items-center gap-2">
                  Crear cuenta
                  <ArrowRight className="w-5 h-5 ml-auto opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                </span>
              )}
            </Button>
          </form>
          
          <div className="mt-6 text-center">
            <span className="text-sm text-zinc-500">¿Ya tienes cuenta? </span>
            <Link href={role === 'artist' ? '/login' : '/login-client'} className="text-white text-sm font-medium hover:underline cursor-pointer">
              Inicia sesión
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

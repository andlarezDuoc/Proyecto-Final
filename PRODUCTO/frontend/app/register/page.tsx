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
import { artists } from "@/lib/data/artists"

export default function RegisterPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [name, setName] = useState("")
  const [role, setRole] = useState<'client' | 'artist'>('client')
  const [artistToken, setArtistToken] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Validar token de tatuador si el rol es artist
    let matchedArtistId = ""
    if (role === 'artist') {
      const cleanToken = artistToken.trim().toLowerCase()
      // Expresión regular que valida formato: palabra-palabra (ej: nombre-apellido)
      // Admite letras castellanas y guión único
      const formatRegex = /^[a-zñáéíóúü]+-[a-zñáéíóúü]+$/i
      
      if (!formatRegex.test(cleanToken)) {
        setIsLoading(false)
        alert("Error de registro: El código de autorización de tatuador debe tener el formato 'nombre-apellido' en minúsculas y separado por un guión (ej: marcos-silva o juan-perez).")
        return
      }
      
      // Buscamos si coincide con uno de nuestros artistas pre-sembrados
      const matched = artists.find(a => a.id.toLowerCase() === cleanToken)
      if (matched) {
        matchedArtistId = matched.id
      } else {
        // Si no es un artista pre-sembrado, es uno nuevo personalizado. Su token 'nombre-apellido' se guarda como su slug.
        matchedArtistId = cleanToken
      }
    }

    try {
      // 1. Registramos al usuario en Supabase Auth (esto lo guarda en auth.users de forma segura)
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            role: role,
            full_name: name,
            artist_slug: role === 'artist' ? matchedArtistId : undefined
          }
        }
      })

      if (error) throw error

      if (!data.user) {
        throw new Error("No se pudo obtener el usuario registrado desde Supabase.")
      }

      // 2. Insertamos el perfil en nuestra tabla pública
      const { error: profileError } = await supabase
        .from('profiles')
        .insert([
          {
            id: data.user.id,
            email: email,
            role: role,
            full_name: name,
          }
        ])

      if (profileError) {
        console.error('Error al insertar en profiles:', profileError)
        throw new Error(`Error en la base de datos (profiles): ${profileError.message}. ¿Ejecutaste el script SQL "estructura_completa.sql" en Supabase?`)
      }

      // Si es artista, lo agregamos a la tabla artists con datos vacíos (los default de la BD completarán el resto)
      if (role === 'artist') {
        const { error: artistError } = await supabase.from('artists').insert([{
          id: data.user.id,
          name: name,
          email: email,
          location: "Ciudad",
          styles: [],
          portfolio: []
        }])

        if (artistError) {
          console.error('Error al insertar en artists:', artistError)
          throw new Error(`Error en la base de datos (artists): ${artistError.message}. ¿Ejecutaste el script SQL "estructura_completa.sql" en Supabase?`)
        }
      }

      alert("¡Registro exitoso! Ya puedes iniciar sesión. Nota: Si la confirmación de correo electrónico está activada en tu proyecto de Supabase, revisa tu bandeja de entrada para verificar tu cuenta antes de iniciar sesión.")
      router.push(role === 'artist' ? "/login" : "/login-client")
    } catch (err: any) {
      console.error('Error de registro:', err.message)
      alert('Error de registro: ' + err.message)
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

            {role === 'artist' && (
              <div className="space-y-2">
                <Label htmlFor="artistToken" className="text-zinc-300">
                  Código de Autorización / ID de Tatuador
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-zinc-500" />
                  <Input
                    id="artistToken"
                    type="text"
                    placeholder="ej: marcos-silva"
                    required
                    value={artistToken}
                    onChange={(e) => setArtistToken(e.target.value)}
                    className="pl-10 bg-black/50 border-zinc-700 text-white focus:border-white focus:ring-1 focus:ring-white transition-all placeholder:text-zinc-600"
                  />
                </div>
                <p className="text-[11px] text-zinc-500 leading-relaxed">
                  Ingresa tu ID de tatuador oficial de la lista (ej: <code className="text-zinc-400 font-mono">marcos-silva</code>, <code className="text-zinc-400 font-mono">camila-rojas</code>, <code className="text-zinc-400 font-mono">daniel-herrera</code>) para reclamar y poblar automáticamente tu biografía y portafolio en Supabase.
                </p>
              </div>
            )}

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

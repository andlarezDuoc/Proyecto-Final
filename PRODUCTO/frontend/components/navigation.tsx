"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { supabase } from "@/lib/supabase"
import { Menu, X, ChevronDown, User, PenTool, LogOut, Home, Users, Image as ImageIcon, Calendar, Star, MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

const getIconForSection = (id: string) => {
  switch (id) {
    case "inicio":
      return Home
    case "artistas":
      return Users
    case "sobre-mi":
      return User
    case "galeria":
      return ImageIcon
    case "agendar":
      return Calendar
    case "resenas":
      return Star
    case "ubicacion":
      return MapPin
    default:
      return Home
  }
}

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [userRole, setUserRole] = useState<string | null>(null)

  // Lógica de Scroll Spy
  const pathname = usePathname()
  const [activeSection, setActiveSection] = useState<string>("")

  // Determinar secciones según la página
  const getSectionsForPage = () => {
    if (pathname === "/") {
      return [
        { id: "inicio", label: "Inicio" },
        { id: "artistas", label: "Artistas" },
      ]
    }
    if (pathname.startsWith("/artist/")) {
      return [
        { id: "sobre-mi", label: "Sobre Mí" },
        { id: "galeria", label: "Portafolio" },
        { id: "agendar", label: "Agendar" },
        { id: "resenas", label: "Reseñas" },
        { id: "ubicacion", label: "Ubicación" },
      ]
    }
    return []
  }

  const sections = getSectionsForPage()

  useEffect(() => {
    // Verificar sesión con Supabase
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (session?.user?.user_metadata?.role) {
        setUserRole(session.user.user_metadata.role)
      }
    }
    
    checkSession()

    // Escuchar cambios de autenticación
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      if (session?.user?.user_metadata?.role) {
        setUserRole(session.user.user_metadata.role)
      } else {
        setUserRole(null)
      }
    })

    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
    }
    window.addEventListener("scroll", handleScroll)
    return () => {
      window.removeEventListener("scroll", handleScroll)
      authListener.subscription.unsubscribe()
    }
  }, [])

  // Efecto Scrollspy
  useEffect(() => {
    if (sections.length === 0) return

    const handleScrollSpy = () => {
      const scrollPosition = window.scrollY + 120 // Margen antes de llegar al tope

      // Verificar si llegó al final de la página
      const isAtBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 100
      if (isAtBottom) {
        setActiveSection(sections[sections.length - 1].id)
        return
      }

      let currentActive = sections[0].id
      for (const section of sections) {
        const element = document.getElementById(section.id)
        if (element) {
          const offsetTop = element.offsetTop
          const offsetHeight = element.offsetHeight
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            currentActive = section.id
            break
          }
        }
      }
      setActiveSection(currentActive)
    }

    window.addEventListener("scroll", handleScrollSpy)
    handleScrollSpy() // Ejecutar al inicio

    return () => window.removeEventListener("scroll", handleScrollSpy)
  }, [sections])

  const handleNavClick = (sectionId: string) => {
    const element = document.getElementById(sectionId)
    if (element) {
      const offset = 100 // Ajuste de altura de cabecera
      const elementPosition = element.getBoundingClientRect().top
      const offsetPosition = elementPosition + window.scrollY - offset

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      })
    }
  }

  return (
    <>
      {/* Cabecera superior */}
      <nav
        className={`fixed top-0 left-0 right-0 h-20 z-50 transition-all duration-500 border-b ${
          scrolled || sections.length > 0
            ? "bg-background/90 backdrop-blur-xl border-border"
            : "bg-transparent border-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center justify-between">
          {/* Logo a la izquierda de la barra superior */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary via-accent to-chrome flex items-center justify-center">
              <span className="font-serif text-lg font-bold text-background">B</span>
            </div>
            <span className="font-serif text-xl tracking-wider text-foreground group-hover:text-primary transition-colors">
              BLACK INK
            </span>
          </Link>

          {/* Lado derecho: opción de login */}
          <div className="hidden md:flex items-center">
            {userRole ? (
              <button 
                onClick={async () => {
                  if (confirm("¿Estás seguro de que deseas cerrar sesión?")) {
                    await supabase.auth.signOut()
                    setUserRole(null)
                    window.location.reload()
                  }
                }}
                className="text-base sm:text-lg font-bold flex items-center gap-2 text-red-400 hover:text-red-300 transition-colors"
              >
                <LogOut className="w-5 h-5" /> Cerrar Sesión
              </button>
            ) : (
              <DropdownMenu>
                <DropdownMenuTrigger className="text-base sm:text-lg font-bold tracking-wide text-white hover:text-primary transition-colors relative group flex items-center gap-1 outline-none">
                  Iniciar Sesión <ChevronDown className="w-5 h-5 text-zinc-400 group-hover:text-primary transition-colors" />
                </DropdownMenuTrigger>
                <DropdownMenuContent className="bg-black/95 backdrop-blur-xl border-white/10 w-48 mt-2">
                  <DropdownMenuItem asChild className="cursor-pointer hover:bg-white/10 focus:bg-white/10 text-white p-3 text-base font-semibold transition-colors">
                    <Link href="/login" className="flex items-center gap-2 w-full">
                      <PenTool className="w-4 h-4" /> Soy Tatuador
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild className="cursor-pointer hover:bg-white/10 focus:bg-white/10 text-white p-3 text-base font-semibold transition-colors">
                    <Link href="/login-client" className="flex items-center gap-2 w-full">
                      <User className="w-4 h-4" /> Soy Cliente
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>

          {/* Botón hamburguesa móvil */}
          <button
            className="md:hidden p-2 text-foreground"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Menú móvil desplegable */}
        <div
          className={`md:hidden absolute top-20 left-0 right-0 bg-background/95 backdrop-blur-xl border-b border-border transition-all duration-300 ${
            isOpen ? "opacity-100 visible" : "opacity-0 invisible"
          }`}
        >
          <div className="px-4 py-6 flex flex-col gap-4">
            {sections.length > 0 ? (
              sections.map((section) => {
                const Icon = getIconForSection(section.id)
                const isActive = activeSection === section.id
                return (
                  <button
                    key={section.id}
                    className={`text-lg font-bold text-left py-2 uppercase transition-colors flex items-center gap-3 border-l-2 pl-2 ${
                      isActive ? "text-white border-white" : "text-zinc-400 border-transparent hover:text-white"
                    }`}
                    onClick={() => {
                      setIsOpen(false)
                      handleNavClick(section.id)
                    }}
                  >
                    <Icon className={`w-5 h-5 ${isActive ? "text-white" : "text-zinc-500"}`} />
                    {section.label}
                  </button>
                )
              })
            ) : (
              <Link
                href="/"
                className="text-lg text-white hover:text-primary transition-colors py-2 uppercase font-medium flex items-center gap-3"
                onClick={() => setIsOpen(false)}
              >
                <Home className="w-5 h-5 text-zinc-400" />
                Inicio
              </Link>
            )}

            {userRole ? (
              <button 
                onClick={async () => {
                  if (confirm("¿Estás seguro de que deseas cerrar sesión?")) {
                    await supabase.auth.signOut()
                    setUserRole(null)
                    setIsOpen(false)
                    window.location.reload()
                  }
                }}
                className="text-lg text-left text-red-400 hover:text-red-300 transition-colors py-2 flex items-center gap-2 uppercase font-medium border-t border-white/10 pt-4"
              >
                <LogOut className="w-5 h-5" /> Cerrar Sesión
              </button>
            ) : (
              <div className="flex flex-col gap-2 pt-4 border-t border-white/10">
                <span className="text-sm text-zinc-500 uppercase tracking-widest font-semibold">Iniciar Sesión</span>
                <Link
                  href="/login"
                  className="text-lg text-white hover:text-primary transition-colors py-2 flex items-center gap-2 uppercase font-medium"
                  onClick={() => setIsOpen(false)}
                >
                  <PenTool className="w-5 h-5 text-zinc-400" /> Soy Tatuador
                </Link>
                <Link
                  href="/login-client"
                  className="text-lg text-white hover:text-primary transition-colors py-2 flex items-center gap-2 uppercase font-medium"
                  onClick={() => setIsOpen(false)}
                >
                  <User className="w-5 h-5 text-zinc-400" /> Soy Cliente
                </Link>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Menú lateral izquierdo (Solo escritorio) */}
      {sections.length > 0 && (
        <aside className="hidden md:flex flex-col fixed top-20 left-0 bottom-0 w-64 bg-black/60 backdrop-blur-xl border-r border-white/5 z-30 p-6 overflow-y-auto no-scrollbar">
          <div className="flex flex-col gap-3">
            {sections.map((section) => {
              const isActive = activeSection === section.id
              const Icon = getIconForSection(section.id)
              
              return (
                <button
                  key={section.id}
                  onClick={() => handleNavClick(section.id)}
                  className={`flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all duration-300 font-bold text-base uppercase tracking-wider cursor-pointer group border-l-4 ${
                    isActive
                      ? "bg-white/10 text-white border-white pl-3"
                      : "text-zinc-400 hover:text-white hover:bg-white/5 border-transparent"
                  }`}
                >
                  <Icon className={`w-5 h-5 transition-transform duration-300 group-hover:scale-110 ${
                    isActive ? "text-white" : "text-zinc-500 group-hover:text-white"
                  }`} />
                  <span>{section.label}</span>
                </button>
              )
            })}
          </div>
        </aside>
      )}
    </>
  )
}

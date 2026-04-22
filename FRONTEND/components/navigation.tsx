"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Menu, X, ChevronDown, User, PenTool, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

const navItems = [
  { href: "/#inicio", label: "Inicio" },
  { href: "/#artistas", label: "Artistas" },
]


export function Navigation() {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [userRole, setUserRole] = useState<string | null>(null)

  useEffect(() => {
    // Check if user is logged in (client side only)
    const role = localStorage.getItem('authRole')
    if (role) setUserRole(role)

    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled
          ? "bg-background/90 backdrop-blur-xl border-b border-border"
          : "bg-transparent"
        }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary via-accent to-chrome flex items-center justify-center">
              <span className="font-serif text-lg font-bold text-background">B</span>
            </div>
            <span className="font-serif text-xl tracking-wider text-foreground group-hover:text-primary transition-colors">
              BLACK INK
            </span>
          </Link>

          <div className="hidden md:flex items-center gap-8">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-sm tracking-wide text-muted-foreground hover:text-primary transition-colors relative group"
              >
                {item.label}
                <span className="absolute -bottom-1 left-0 w-0 h-px bg-primary transition-all duration-300 group-hover:w-full" />
              </Link>
            ))}

            {userRole ? (
              <button 
                onClick={() => {
                  localStorage.removeItem('authRole')
                  setUserRole(null)
                  window.location.reload()
                }}
                className="text-sm flex items-center gap-2 text-red-400 hover:text-red-300 transition-colors"
              >
                <LogOut className="w-4 h-4" /> Cerrar Sesión
              </button>
            ) : (
              <DropdownMenu>
                <DropdownMenuTrigger className="text-sm tracking-wide text-muted-foreground hover:text-primary transition-colors relative group flex items-center gap-1 outline-none">
                  Iniciar Sesión <ChevronDown className="w-4 h-4" />
                </DropdownMenuTrigger>
                <DropdownMenuContent className="bg-black/90 backdrop-blur-xl border-white/10 w-48 mt-2">
                  <DropdownMenuItem asChild className="cursor-pointer hover:bg-white/10 focus:bg-white/10 text-white p-3">
                    <Link href="/login" className="flex items-center gap-2 w-full">
                      <PenTool className="w-4 h-4" /> Soy Tatuador
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild className="cursor-pointer hover:bg-white/10 focus:bg-white/10 text-white p-3">
                    <Link href="/login-client" className="flex items-center gap-2 w-full">
                      <User className="w-4 h-4" /> Soy Cliente
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>

          <button
            className="md:hidden p-2 text-foreground"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        className={`md:hidden absolute top-20 left-0 right-0 bg-background/95 backdrop-blur-xl border-b border-border transition-all duration-300 ${isOpen ? "opacity-100 visible" : "opacity-0 invisible"
          }`}
      >
        <div className="px-4 py-6 flex flex-col gap-4">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-lg text-muted-foreground hover:text-primary transition-colors py-2"
              onClick={() => setIsOpen(false)}
            >
              {item.label}
            </Link>
          ))}

          {userRole ? (
            <button 
              onClick={() => {
                localStorage.removeItem('authRole')
                setUserRole(null)
                setIsOpen(false)
                window.location.reload()
              }}
              className="text-lg text-left text-red-400 hover:text-red-300 transition-colors py-2 flex items-center gap-2"
            >
              <LogOut className="w-5 h-5" /> Cerrar Sesión
            </button>
          ) : (
            <div className="flex flex-col gap-2 pt-2 border-t border-white/10">
              <span className="text-sm text-zinc-500 uppercase tracking-widest font-semibold mt-2">Iniciar Sesión</span>
              <Link
                href="/login"
                className="text-lg text-white hover:text-primary transition-colors py-2 flex items-center gap-2"
                onClick={() => setIsOpen(false)}
              >
                <PenTool className="w-5 h-5 text-zinc-400" /> Soy Tatuador
              </Link>
              <Link
                href="/login-client"
                className="text-lg text-white hover:text-primary transition-colors py-2 flex items-center gap-2"
                onClick={() => setIsOpen(false)}
              >
                <User className="w-5 h-5 text-zinc-400" /> Soy Cliente
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  )
}

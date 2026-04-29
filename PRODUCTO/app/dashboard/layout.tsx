"use client"

import { ReactNode } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Droplet, Image as ImageIcon, Settings, LogOut, ArrowUpRight, Inbox } from "lucide-react"

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname()

  const navItems = [
    { name: "Portafolio", href: "/dashboard", icon: ImageIcon },
    { name: "Reportes", href: "/dashboard/reports", icon: Inbox },
    { name: "Ajustes", href: "/dashboard/settings", icon: Settings },
  ]

  return (
    <div className="min-h-screen bg-black flex flex-col md:flex-row">
      {/* Sidebar for Desktop / Topbar for Mobile */}
      <aside className="w-full md:w-64 border-b md:border-b-0 md:border-r border-white/10 bg-black/50 backdrop-blur-xl md:min-h-screen flex flex-col pt-6 z-20 sticky top-0">
        <div className="px-6 mb-8 flex items-center gap-3">
          <Droplet className="w-6 h-6 text-white" />
          <span className="font-serif text-xl font-bold tracking-wider text-white">
            BLACK INK
          </span>
        </div>

        <div className="px-4 pb-4 md:pb-0 text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2">
          Panel Privado
        </div>

        <nav className="flex-1 px-4 space-y-2 flex md:flex-col overflow-x-auto md:overflow-hidden pb-4 md:pb-0">
          {navItems.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all whitespace-nowrap md:whitespace-normal ${
                  isActive
                    ? "bg-white text-black font-medium"
                    : "text-zinc-400 hover:text-white hover:bg-white/5"
                }`}
              >
                <item.icon className="w-5 h-5" />
                {item.name}
              </Link>
            )
          })}
        </nav>

        <div className="mt-auto px-4 pb-6 hidden md:block space-y-2">
          <Link
            href="/artist/marcos-silva"
            target="_blank"
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-zinc-400 hover:text-white hover:bg-white/5 transition-all"
          >
            <ArrowUpRight className="w-5 h-5" />
            Perfil Público
          </Link>
          <Link
            href="/"
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all"
          >
            <LogOut className="w-5 h-5" />
            Cerrar Sesión
          </Link>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 relative max-w-7xl mx-auto w-full p-4 md:p-8">
        <div className="absolute inset-0 z-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.05)_0,transparent_50%)] pointer-events-none" />
        <div className="relative z-10 w-full h-full">
          {children}
        </div>
      </main>

      {/* Mobile Footer Actions (Logout/Profile) */}
      <div className="md:hidden border-t border-white/10 bg-black/50 backdrop-blur-xl p-4 flex justify-between gap-4 sticky bottom-0 z-20">
         <Link
            href="/artist/marcos-silva"
            target="_blank"
            className="flex-1 flex justify-center items-center gap-2 px-4 py-3 rounded-xl bg-white/5 text-zinc-300 text-sm"
          >
            <ArrowUpRight className="w-4 h-4" />
            Ver Perfil
          </Link>
          <Link
            href="/"
            className="flex-1 flex justify-center items-center gap-2 px-4 py-3 rounded-xl bg-red-500/10 text-red-400 text-sm"
          >
            <LogOut className="w-4 h-4" />
            Salir
          </Link>
      </div>
    </div>
  )
}

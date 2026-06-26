import { Navigation } from "@/components/navigation"
import { HeroSection } from "@/components/hero-section"
import { MarketplaceSection } from "@/components/marketplace-section"
import { Footer } from "@/components/footer"
import { WhatsAppChat } from "@/components/whatsapp-chat"

export default function HomePage() {
  return (
    <div className="relative min-h-screen">
      {/* Fondo difuminado fijo */}
      <div
        className="fixed inset-0 z-0"
        style={{
          backgroundImage: `url('https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-xlVV5yj2kwTMUqKixoOEJCTUmTIRy4.png')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed',
          filter: 'blur(20px)',
          transform: 'scale(1.2)',
        }}
      />
      {/* Capa oscura para legibilidad del texto */}
      <div className="fixed inset-0 z-0 bg-black/40" />

      {/* Contenido principal */}
      <main className="relative z-10 min-h-screen md:pl-52">
        <Navigation />
        <HeroSection />
        <MarketplaceSection />
        <Footer />
        <WhatsAppChat />
      </main>
    </div>
  )
}

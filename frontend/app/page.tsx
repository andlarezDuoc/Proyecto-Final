import { Navigation } from "@/components/navigation"
import { HeroSection } from "@/components/hero-section"
import { MarketplaceSection } from "@/components/marketplace-section"
import { Footer } from "@/components/footer"
import { WhatsAppChat } from "@/components/whatsapp-chat"

export default function HomePage() {
  return (
    <div className="relative min-h-screen">
      {/* Fixed blurred background */}
      <div
        className="fixed inset-0 z-0"
        style={{
          backgroundImage: `url('https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-xlVV5yj2kwTMUqKixoOEJCTUmTIRy4.png')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed',
          filter: 'blur(8px)',
          transform: 'scale(1.1)',
        }}
      />
      {/* Dark overlay for readability */}
      <div className="fixed inset-0 z-0 bg-black/60" />

      {/* Main content */}
      <main className="relative z-10 min-h-screen">
        <Navigation />
        <HeroSection />
        <MarketplaceSection />
        <Footer />
        <WhatsAppChat />
      </main>
    </div>
  )
}

import { Navigation } from "@/components/navigation"
import { HeroSection } from "@/components/hero-section"
import { GallerySection } from "@/components/gallery-section"
import { DesignsSection } from "@/components/designs-section"
import { AboutSection } from "@/components/about-section"
import { BookingSection } from "@/components/booking-section"
import { LocationSection } from "@/components/location-section"
import { WhatsAppChat } from "@/components/whatsapp-chat"
import { Footer } from "@/components/footer"

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
        <GallerySection />
        <DesignsSection />
        <AboutSection />
        <BookingSection />
        <LocationSection />
        <Footer />
        <WhatsAppChat />
      </main>
    </div>
  )
}

import { Navigation } from "@/components/navigation"
import { AboutSection } from "@/components/about-section"
import { GallerySection } from "@/components/gallery-section"
import { DesignsSection } from "@/components/designs-section"
import { BookingSection } from "@/components/booking-section"
import { LocationSection } from "@/components/location-section"
import { WhatsAppChat } from "@/components/whatsapp-chat"
import { Footer } from "@/components/footer"
import { artists } from "@/lib/data/artists"
import { notFound } from "next/navigation"

export function generateStaticParams() {
  return artists.map((artist) => ({
    id: artist.id,
  }))
}

export default function ArtistProfilePage({ params }: { params: { id: string } }) {
  const artist = artists.find((a) => a.id === params.id)

  if (!artist) {
    notFound()
  }

  return (
    <div className="relative min-h-screen">
      {/* Fixed blurred background */}
      <div 
        className="fixed inset-0 z-0"
        style={{
          backgroundImage: `url(${artist.portfolio[0] || 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-xlVV5yj2kwTMUqKixoOEJCTUmTIRy4.png'})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed',
          filter: 'blur(12px)',
          transform: 'scale(1.1)',
          opacity: 0.2,
        }}
      />
      {/* Dark overlay for readability */}
      <div className="fixed inset-0 z-0 bg-black/80" />
      
      {/* Main content */}
      <main className="relative z-10 min-h-screen">
        <Navigation />
        
        {/* We reuse the components passing down the artist data where needed */}
        {/* We can place AboutSection at the top as a profile header */}
        <section className="pt-20">
          <AboutSection artist={artist} />
        </section>
        
        <GallerySection artist={artist} />
        <DesignsSection artist={artist} />
        <BookingSection artist={artist} />
        <LocationSection />
        <Footer />
        <WhatsAppChat />
      </main>
    </div>
  )
}

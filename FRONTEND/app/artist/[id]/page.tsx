import { Navigation } from "@/components/navigation"
import { AboutSection } from "@/components/about-section"
import { GallerySection } from "@/components/gallery-section"
import { BookingSection } from "@/components/booking-section"
import { LocationSection } from "@/components/location-section"
import { WhatsAppChat } from "@/components/whatsapp-chat"
import { ClientUploadPhoto } from "@/components/client-upload-photo"
import { ReviewsSection } from "@/components/reviews-section"
import { Footer } from "@/components/footer"
import { artists } from "@/lib/data/artists"
import { notFound } from "next/navigation"

export function generateStaticParams() {
  return artists.map((artist) => ({
    id: artist.id,
  }))
}

export default async function ArtistProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params
  const artist = artists.find((a) => a.id === resolvedParams.id)

  if (!artist) {
    notFound()
  }

  return (
    <div className="relative min-h-screen">
      {/* Fondo base sólido y gradiente de luz blanco al centro */}
      <div className="fixed inset-0 z-0 bg-black" />
      <div className="fixed inset-0 z-0 bg-[linear-gradient(to_right,rgba(0,0,0,1)_0%,rgba(255,255,255,0.08)_35%,rgba(255,255,255,0.08)_65%,rgba(0,0,0,1)_100%)] pointer-events-none" />
      {/* Main content */}
      <main className="relative z-10 min-h-screen">
        <Navigation />

        {/* We reuse the components passing down the artist data where needed */}
        {/* We can place AboutSection at the top as a profile header */}
        <section className="pt-20">
          <AboutSection artist={artist} />
        </section>

        <GallerySection artist={artist} />
        <BookingSection artist={artist} />
        <ReviewsSection artistId={artist.id} artistName={artist.name} />
        <LocationSection artist={artist} />
        <Footer />
        <WhatsAppChat />
        <ClientUploadPhoto artist={artist} />
      </main>
    </div>
  )
}

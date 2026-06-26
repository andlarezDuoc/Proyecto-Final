import { Navigation } from "@/components/navigation"
import { AboutSection } from "@/components/about-section"
import { GallerySection } from "@/components/gallery-section"
import { BookingSection } from "@/components/booking-section"
import { LocationSection } from "@/components/location-section"
import { WhatsAppChat } from "@/components/whatsapp-chat"
import { ClientUploadPhoto } from "@/components/client-upload-photo"
import { ReviewsSection } from "@/components/reviews-section"
import { Footer } from "@/components/footer"
import { supabase } from "@/lib/supabase"
import { notFound } from "next/navigation"

export const dynamic = 'force-dynamic';

export default async function ArtistProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params
  let { data, error } = await supabase
    .from('artists')
    .select('*')
    .eq('id', resolvedParams.id)
    .single()

  if (error) {
    console.error("Error al obtener artista por ID:", error)
  }

  // Fallback por slug o email prefix si no lo encuentra por ID (para mantener vigentes las URLs con slugs pre-sembrados)
  if (!data) {
    const slugName = resolvedParams.id.split('-')[0] // 'marcos' de 'marcos-silva'
    const { data: fallbackData, error: fallbackError } = await supabase
      .from('artists')
      .select('*')
      .ilike('email', `%${slugName}%`)
      .limit(1)

    if (fallbackError) {
      console.error("Error al buscar artista por slug alternativo:", fallbackError)
    }

    if (fallbackData && fallbackData.length > 0) {
      data = fallbackData[0]
    }
  }

  if (!data) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-4">
        <div className="bg-red-950 border border-red-500 p-8 rounded-xl max-w-md text-center">
          <h1 className="text-white text-2xl font-bold mb-4">Error: Artista no encontrado</h1>
          <p className="text-red-200">
            ID buscado: {resolvedParams.id}
          </p>
          <p className="text-red-400 text-sm mt-4">
            (Si ves esto, significa que Supabase no devolvió datos para este ID).
          </p>
        </div>
      </div>
    )
  }

  const artist = {
    ...data,
    shortBio: data.shortbio,
    fullBio: data.fullbio
  }

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
      {/* Capa oscura para legibilidad */}
      <div className="fixed inset-0 z-0 bg-black/40" />
      {/* Contenido principal */}
      <main className="relative z-10 min-h-screen md:pl-52">
        <Navigation />

        <section className="pt-14">
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

"use client"

import { motion } from "framer-motion"
import { MapPin, Clock, Phone, Mail, Navigation } from "lucide-react"
import { Button } from "@/components/ui/button"

export function LocationSection() {
  const studioAddress = "Av. Providencia 1234, Providencia, Santiago"
  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(studioAddress)}`
  const googleMapsEmbedUrl = `https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3329.9534895285!2d-70.61003908479934!3d-33.42628078077556!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x9662cf6a8e1f3a9d%3A0x8c7b3b2f9c3a7e7a!2sAv.%20Providencia%2C%20Providencia%2C%20Regi%C3%B3n%20Metropolitana!5e0!3m2!1ses!2scl!4v1699999999999!5m2!1ses!2scl`

  const contactInfo = [
    {
      icon: MapPin,
      label: "Dirección",
      value: studioAddress,
      action: googleMapsUrl,
    },
    {
      icon: Clock,
      label: "Horario",
      value: "Lun - Sáb: 10:00 - 20:00",
      action: null,
    },
    {
      icon: Phone,
      label: "Teléfono",
      value: "+56 9 1234 5678",
      action: "tel:+56912345678",
    },
    {
      icon: Mail,
      label: "Email",
      value: "contacto@inkstudio.cl",
      action: "mailto:contacto@inkstudio.cl",
    },
  ]

  return (
    <section id="ubicacion" className="py-24 bg-secondary/30 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="font-serif text-4xl sm:text-5xl font-bold text-foreground mb-4">
            Encuéntranos
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Visítanos en nuestro estudio ubicado en el corazón de Providencia.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Map */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="aspect-[4/3] rounded-2xl overflow-hidden border border-border bg-card">
              <iframe
                src={googleMapsEmbedUrl}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Ubicación del estudio"
              />
            </div>
            
            <Button
              asChild
              className="absolute bottom-4 right-4 bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg"
            >
              <a href={googleMapsUrl} target="_blank" rel="noopener noreferrer">
                <Navigation className="w-4 h-4 mr-2" />
                Cómo llegar
              </a>
            </Button>
          </motion.div>

          {/* Contact info */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-6"
          >
            <div className="bg-card rounded-2xl border border-border p-8">
              <h3 className="font-serif text-2xl font-bold text-foreground mb-6">
                INK Studio
              </h3>
              
              <div className="space-y-6">
                {contactInfo.map((item, index) => (
                  <div key={index} className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <item.icon className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">{item.label}</p>
                      {item.action ? (
                        <a
                          href={item.action}
                          target={item.action.startsWith('http') ? '_blank' : undefined}
                          rel={item.action.startsWith('http') ? 'noopener noreferrer' : undefined}
                          className="text-foreground font-medium hover:text-primary transition-colors"
                        >
                          {item.value}
                        </a>
                      ) : (
                        <p className="text-foreground font-medium">{item.value}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Additional info card */}
            <div className="bg-gradient-to-br from-primary/20 to-accent/20 rounded-2xl border border-primary/20 p-8">
              <h4 className="font-serif text-lg font-bold text-foreground mb-3">
                Antes de tu visita
              </h4>
              <ul className="space-y-2 text-muted-foreground text-sm">
                <li className="flex items-start gap-2">
                  <span className="text-primary">•</span>
                  Llega 10 minutos antes de tu cita
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary">•</span>
                  Trae tu documento de identidad
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary">•</span>
                  Descansa bien la noche anterior
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary">•</span>
                  Hidrata bien tu piel los días previos
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary">•</span>
                  No consumas alcohol 24 horas antes
                </li>
              </ul>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}

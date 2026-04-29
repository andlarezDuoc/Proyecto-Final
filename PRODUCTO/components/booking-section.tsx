"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { useRouter } from "next/navigation"
import {
  ChevronLeft,
  ChevronRight,
  Clock,
  Check,
  CreditCard,
  AlertCircle
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Artist } from "@/lib/data/artists"

const timeSlots = [
  "10:00", "11:00", "12:00", "14:00", "15:00", "16:00", "17:00", "18:00"
]

const services = [
  { id: "pequeño", name: "Tatuaje Pequeño", size: "Hasta 5 cm" },
  { id: "mediano", name: "Tatuaje Mediano", size: "De 5 cm a 10 cm" },
  { id: "grande", name: "Tatuaje Grande", size: "De 10 cm a 20 cm" },
  { id: "cover", name: "Cover Up", size: "Tamaño a evaluar" },
]

interface BookingSectionProps {
  artist: Artist;
}

export function BookingSection({ artist }: BookingSectionProps) {
  const router = useRouter()
  const [userRole, setUserRole] = useState<string | null>(null)
  
  // Checking auth role defensively to ensure hydratation safety
  if (typeof window !== 'undefined' && userRole === null) {
    const role = localStorage.getItem('authRole')
    if (role) setUserRole(role)
  }

  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [selectedTime, setSelectedTime] = useState<string | null>(null)
  const [selectedService, setSelectedService] = useState<string | null>(null)
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    description: "",
  })

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const daysInMonth = lastDay.getDate()
    const startingDay = firstDay.getDay()

    const days: (Date | null)[] = []

    for (let i = 0; i < startingDay; i++) {
      days.push(null)
    }

    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, month, i))
    }

    return days
  }

  const isDateAvailable = (date: Date) => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const day = date.getDay()
    return date >= today && day !== 0
  }

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('es-CL', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const selectedServiceData = services.find(s => s.id === selectedService)

  const handleNextStep = () => {
    if (step === 1) {
      if (typeof window !== 'undefined' && localStorage.getItem('authRole') !== 'client') {
        router.push('/login-client?redirect=' + encodeURIComponent(window.location.pathname))
        return
      }
    }
    if (step < 3) setStep(step + 1)
  }

  const handlePrevStep = () => {
    if (step > 1) setStep(step - 1)
  }

  const canProceed = () => {
    switch (step) {
      case 1:
        return selectedService
      case 2:
        return selectedDate && selectedTime
      default:
        return true
    }
  }

  return (
    <section id="agendar" className="py-24 relative overflow-hidden bg-transparent">
      {/* Background decoration */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-primary/5 rounded-full blur-3xl" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="font-serif text-4xl sm:text-5xl font-bold text-white mb-4">
            Agenda con {artist.name.split(' ')[0]}
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Reserva tu sesión online con {artist.name}. Confirma tu cita con un anticipo seguro.
          </p>
        </motion.div>

        {/* Progress steps */}
        <div className="flex items-center justify-center mb-12">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex items-center">
              <div
                className={`w-14 h-14 rounded-full flex items-center justify-center text-xl font-bold transition-all duration-500 border-2 ${
                  step > s
                    ? "bg-white text-black border-white shadow-[0_0_20px_rgba(255,255,255,0.6)] scale-105"
                    : step === s
                    ? "bg-primary text-primary-foreground border-primary shadow-[0_0_20px_var(--primary)] scale-110"
                    : "bg-black/40 text-white/40 border-white/20"
                }`}
              >
                {step > s ? <Check className="w-7 h-7" /> : s}
              </div>
              {s < 3 && (
                <div
                  className={`w-16 sm:w-24 h-1.5 mx-3 transition-all duration-500 rounded-full ${
                    step > s ? "bg-white shadow-[0_0_10px_rgba(255,255,255,0.5)]" : "bg-white/10"
                  }`}
                />
              )}
            </div>
          ))}
        </div>

        <div className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-3xl p-6 sm:p-8 shadow-2xl">
          {/* Step 1: Select Service */}
          {step === 1 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-8"
            >
              <div>
                {!userRole && (
                  <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl text-sm flex items-center justify-center gap-2 mb-6">
                    <AlertCircle className="w-5 h-5 flex-shrink-0" />
                    <span>Debes iniciar sesión como cliente para poder agendar una cita.</span>
                  </div>
                )}
                <h3 className="font-serif text-2xl font-bold text-foreground mb-6 flex items-center justify-center gap-2 text-center">
                  <span className="text-white mr-1 text-3xl">1.</span> Selecciona tu servicio
                </h3>
                <div className="grid sm:grid-cols-2 gap-3">
                  {services.map((service) => (
                    <button
                      key={service.id}
                      onClick={() => setSelectedService(service.id)}
                      className={`p-4 rounded-xl border text-left transition-all duration-300 ${selectedService === service.id
                          ? "border-primary bg-primary/20 shadow-[0_0_15px_rgba(255,255,255,0.1)] text-white"
                          : "border-white/10 bg-black/20 hover:bg-white/20 hover:border-white/50 hover:scale-[1.02] text-foreground/80 hover:text-white"
                        }`}
                    >
                      <p className="font-medium text-foreground">{service.name}</p>
                      <div className="flex justify-between items-center mt-1">
                        <p className="text-sm text-muted-foreground">{service.size}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}

          {/* Step 2: Calendar */}
          {step === 2 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-8"
            >
              <h3 className="font-serif text-2xl font-bold text-foreground mb-2 flex items-center justify-center gap-2 text-center">
                <span className="text-white mr-1 text-3xl">2.</span> Selecciona una fecha
              </h3>
              <div className="grid lg:grid-cols-2 gap-8">
                {/* Calendar */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-serif text-xl font-bold text-foreground capitalize">
                      {currentMonth.toLocaleDateString('es-CL', { month: 'long', year: 'numeric' })}
                    </h3>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))}
                        className="p-2 rounded-lg hover:bg-secondary transition-colors"
                      >
                        <ChevronLeft className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))}
                        className="p-2 rounded-lg hover:bg-secondary transition-colors"
                      >
                        <ChevronRight className="w-5 h-5" />
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-7 gap-1 mb-2">
                    {['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'].map((day) => (
                      <div key={day} className="text-center text-sm text-muted-foreground py-2">
                        {day}
                      </div>
                    ))}
                  </div>

                  <div className="grid grid-cols-7 gap-1">
                    {getDaysInMonth(currentMonth).map((date, index) => (
                      <button
                        key={index}
                        onClick={() => date && isDateAvailable(date) && setSelectedDate(date)}
                        disabled={!date || !isDateAvailable(date)}
                        className={`aspect-square rounded-lg text-sm transition-all duration-300 ${!date
                            ? "invisible"
                            : !isDateAvailable(date)
                              ? "text-muted-foreground/30 cursor-not-allowed"
                              : selectedDate?.toDateString() === date.toDateString()
                                ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25"
                                : "bg-black/20 hover:bg-white/20 hover:scale-110 border border-transparent hover:border-white/40 text-foreground"
                          }`}
                      >
                        {date?.getDate()}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Time slots */}
                <div>
                  <h3 className="font-serif text-xl font-bold text-foreground mb-4">
                    Horarios disponibles
                  </h3>
                  {selectedDate ? (
                    <div className="grid grid-cols-2 gap-2">
                      {timeSlots.map((time) => (
                        <button
                          key={time}
                          onClick={() => setSelectedTime(time)}
                          className={`p-3 rounded-lg border text-center transition-all duration-300 ${selectedTime === time
                              ? "border-primary bg-primary/20 text-white shadow-[0_0_15px_rgba(255,255,255,0.1)]"
                              : "border-white/10 bg-black/20 hover:bg-white/20 hover:border-white/50 hover:scale-[1.02] text-foreground/80 hover:text-white"
                            }`}
                        >
                          {time}
                        </button>
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted-foreground">Selecciona una fecha para ver los horarios disponibles.</p>
                  )}

                  {selectedDate && selectedTime && (
                    <div className="mt-6 p-4 rounded-xl bg-primary/10 border border-primary/20">
                      <p className="text-sm text-muted-foreground">Tu cita:</p>
                      <p className="font-medium text-foreground capitalize">
                        {formatDate(selectedDate)} a las {selectedTime}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}

          {/* Step 3: Confirmation */}
          {step === 3 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6 max-w-xl mx-auto"
            >
              <h3 className="font-serif text-2xl font-bold text-foreground mb-6 flex items-center justify-center gap-2 text-center">
                <span className="text-white mr-1 text-3xl">3.</span> Confirma tu reserva
              </h3>

              {/* Booking summary */}
              <div className="bg-secondary/50 rounded-xl p-6 space-y-4 border border-border">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Servicio</span>
                  <span className="text-foreground font-medium">
                    {selectedServiceData?.name}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Fecha y hora</span>
                  <span className="text-foreground font-medium capitalize">
                    {selectedDate && formatDate(selectedDate)} - {selectedTime}
                  </span>
                </div>
              </div>

              {/* Booking confirmation action */}
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground text-center">
                  Al confirmar tu solicitud, el artista se pondrá en contacto contigo validando en tu cuenta de cliente.
                </p>

                <Button
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-6 text-lg shadow-lg shadow-primary/25"
                  onClick={() => alert('Solicitud enviada con éxito')}
                >
                  <Check className="w-5 h-5 mr-2" />
                  Confirmar Solicitud
                </Button>
              </div>
            </motion.div>
          )}

          {/* Navigation buttons */}
          <div className="flex justify-between mt-8 pt-6 border-t border-border">
            <Button
              variant="outline"
              onClick={handlePrevStep}
              disabled={step === 1}
              className="border-border"
            >
              <ChevronLeft className="w-4 h-4 mr-2" />
              Anterior
            </Button>

            {step < 3 && (
              <Button
                onClick={handleNextStep}
                disabled={!canProceed()}
                className="bg-primary hover:bg-primary/90 text-primary-foreground"
              >
                Siguiente
                <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

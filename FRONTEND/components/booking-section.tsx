"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { 
  ChevronLeft, 
  ChevronRight, 
  Clock,
  Check,
  CreditCard
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
  { id: "consulta", name: "Consulta (Gratis)", duration: "30 min", price: 0 },
  { id: "pequeño", name: "Tatuaje Pequeño", duration: "1-2 horas", price: 50000 },
  { id: "mediano", name: "Tatuaje Mediano", duration: "2-4 horas", price: 100000 },
  { id: "grande", name: "Tatuaje Grande", duration: "4+ horas", price: 150000 },
  { id: "cover", name: "Cover Up", duration: "Variable", price: 80000 },
]

interface BookingSectionProps {
  artist: Artist;
}

export function BookingSection({ artist }: BookingSectionProps) {
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
  const depositAmount = selectedServiceData ? Math.round(selectedServiceData.price * 0.3) : 0

  const handleNextStep = () => {
    if (step < 4) setStep(step + 1)
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
      case 3:
        return formData.name && formData.email && formData.phone
      default:
        return true
    }
  }

  return (
    <section id="agendar" className="py-24 bg-background relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-primary/5 rounded-full blur-3xl" />
      
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="font-serif text-4xl sm:text-5xl font-bold text-foreground mb-4">
            Agenda con <span className="text-primary">{artist.name.split(' ')[0]}</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Reserva tu sesión online con {artist.name}. Confirma tu cita con un anticipo seguro.
          </p>
        </motion.div>

        {/* Progress steps */}
        <div className="flex items-center justify-center mb-12">
          {[1, 2, 3, 4].map((s) => (
            <div key={s} className="flex items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition-all ${
                  step >= s
                    ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25"
                    : "bg-secondary text-muted-foreground"
                }`}
              >
                {step > s ? <Check className="w-5 h-5" /> : s}
              </div>
              {s < 4 && (
                <div
                  className={`w-16 sm:w-24 h-1 mx-2 transition-all rounded-full ${
                    step > s ? "bg-primary" : "bg-secondary"
                  }`}
                />
              )}
            </div>
          ))}
        </div>

        <div className="bg-card border border-border rounded-2xl p-6 sm:p-8 shadow-xl">
          {/* Step 1: Select Service */}
          {step === 1 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-8"
            >
              <div>
                <h3 className="font-serif text-xl font-bold text-foreground mb-4 flex items-center gap-2">
                  <Clock className="w-5 h-5 text-primary" />
                  Tipo de servicio
                </h3>
                <div className="grid sm:grid-cols-2 gap-3">
                  {services.map((service) => (
                    <button
                      key={service.id}
                      onClick={() => setSelectedService(service.id)}
                      className={`p-4 rounded-xl border text-left transition-all ${
                        selectedService === service.id
                          ? "border-primary bg-primary/10 shadow-lg shadow-primary/10"
                          : "border-border hover:border-primary/50"
                      }`}
                    >
                      <p className="font-medium text-foreground">{service.name}</p>
                      <div className="flex justify-between items-center mt-1">
                        <p className="text-sm text-muted-foreground">{service.duration}</p>
                        <p className="text-sm text-primary font-medium">
                          {service.price > 0 ? `$${service.price.toLocaleString('es-CL')}` : "Gratis"}
                        </p>
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
                        className={`aspect-square rounded-lg text-sm transition-all ${
                          !date
                            ? "invisible"
                            : !isDateAvailable(date)
                            ? "text-muted-foreground/30 cursor-not-allowed"
                            : selectedDate?.toDateString() === date.toDateString()
                            ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25"
                            : "hover:bg-secondary text-foreground"
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
                          className={`p-3 rounded-lg border text-center transition-all ${
                            selectedTime === time
                              ? "border-primary bg-primary/10 text-primary shadow-lg shadow-primary/10"
                              : "border-border hover:border-primary/50 text-foreground"
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

          {/* Step 3: Personal Info */}
          {step === 3 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6 max-w-xl mx-auto"
            >
              <h3 className="font-serif text-xl font-bold text-foreground text-center mb-6">
                Tus datos de contacto
              </h3>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="name">Nombre completo</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Tu nombre"
                    className="mt-1 bg-input border-border"
                  />
                </div>

                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="tu@email.com"
                    className="mt-1 bg-input border-border"
                  />
                </div>

                <div>
                  <Label htmlFor="phone">Teléfono</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+56 9 1234 5678"
                    className="mt-1 bg-input border-border"
                  />
                </div>

                <div>
                  <Label htmlFor="description">Describe tu idea (opcional)</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Cuéntame sobre el tatuaje que deseas..."
                    rows={4}
                    className="mt-1 bg-input border-border resize-none"
                  />
                </div>
              </div>
            </motion.div>
          )}

          {/* Step 4: Payment */}
          {step === 4 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6 max-w-xl mx-auto"
            >
              <h3 className="font-serif text-xl font-bold text-foreground text-center mb-6">
                Confirma tu reserva
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
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Cliente</span>
                  <span className="text-foreground font-medium">{formData.name}</span>
                </div>
                <div className="border-t border-border pt-4 flex justify-between">
                  <span className="text-muted-foreground">Precio total</span>
                  <span className="text-foreground font-bold">
                    ${selectedServiceData?.price.toLocaleString('es-CL')}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-primary font-medium">Anticipo (30%)</span>
                  <span className="text-primary font-bold">
                    ${depositAmount.toLocaleString('es-CL')}
                  </span>
                </div>
              </div>

              {/* Payment button */}
              <div className="space-y-4">
                <p className="text-sm text-muted-foreground text-center">
                  El anticipo asegura tu reserva y será descontado del precio final.
                </p>
                
                <Button
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground py-6 text-lg shadow-lg shadow-primary/25"
                  onClick={() => alert('Integración con Transbank - Próximamente')}
                >
                  <CreditCard className="w-5 h-5 mr-2" />
                  Pagar anticipo con Transbank
                </Button>

                <div className="flex items-center justify-center gap-4 text-xs text-muted-foreground">
                  <span>Pago seguro con</span>
                  <div className="flex items-center gap-2">
                    <div className="bg-foreground/10 rounded px-2 py-1">Webpay</div>
                    <div className="bg-foreground/10 rounded px-2 py-1">Transbank</div>
                  </div>
                </div>
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

            {step < 4 && (
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

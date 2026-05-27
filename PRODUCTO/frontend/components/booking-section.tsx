"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase"
import { WebpaySimulator } from "@/components/webpay-simulator"
import {
  ChevronLeft,
  ChevronRight,
  Clock,
  Check,
  CreditCard,
  AlertCircle,
  Printer,
  Calendar,
  Sparkles,
  ShieldCheck,
  User,
  Scissors
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
  { id: "pequeño", name: "Tatuaje Pequeño", size: "Hasta 5 cm", price: 50000, deposit: 10000 },
  { id: "mediano", name: "Tatuaje Mediano", size: "De 5 cm a 10 cm", price: 100000, deposit: 20000 },
  { id: "grande", name: "Tatuaje Grande", size: "De 10 cm a 20 cm", price: 150000, deposit: 30000 },
  { id: "cover", name: "Cover Up", size: "Tamaño a evaluar", price: 80000, deposit: 15000 },
]

interface BookingSectionProps {
  artist: Artist;
}

export function BookingSection({ artist }: BookingSectionProps) {
  const router = useRouter()
  const [userRole, setUserRole] = useState<string | null>(null)
  const [userEmail, setUserEmail] = useState<string | null>(null)

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (session?.user) {
        setUserEmail(session.user.email || "")
        if (session.user.user_metadata?.role) {
          setUserRole(session.user.user_metadata.role)
        } else {
          setUserRole("client") // fallback secure default
        }
      }
    }
    checkSession()
  }, [])

  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [selectedTime, setSelectedTime] = useState<string | null>(null)
  const [selectedService, setSelectedService] = useState<string | null>(null)
  const [step, setStep] = useState(1)
  
  // Payment Simulator states
  const [isWebpayOpen, setIsWebpayOpen] = useState(false)
  const [paymentDetails, setPaymentDetails] = useState<{
    cardType: string
    last4: string
    transactionId: string
    authCode: string
    paymentMethod: string
    installments: number
  } | null>(null)

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
    return date >= today && day !== 0 // Sunday closed
  }

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('es-CL', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat("es-CL", {
      style: "currency",
      currency: "CLP",
    }).format(val)
  }

  const selectedServiceData = services.find(s => s.id === selectedService)
  const totalAmount = selectedServiceData ? selectedServiceData.price : 0
  const depositAmount = selectedServiceData ? selectedServiceData.deposit : 0
  const remainingAmount = totalAmount - depositAmount

  const handleNextStep = () => {
    if (step === 1) {
      if (typeof window !== 'undefined' && userRole !== 'client') {
        router.push('/login-client?redirect=' + encodeURIComponent(window.location.pathname))
        return
      }
    }
    if (step < 3) setStep(step + 1)
  }

  const handlePrevStep = () => {
    if (step > 1 && step < 4) setStep(step - 1)
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

  const handlePaymentSuccess = (details: typeof paymentDetails) => {
    setPaymentDetails(details)
    setIsWebpayOpen(false)
    setStep(4) // Move to confirmation ticket
  }

  const handlePrintReceipt = () => {
    window.print()
  }

  const handleReset = () => {
    setSelectedDate(null)
    setSelectedTime(null)
    setSelectedService(null)
    setPaymentDetails(null)
    setStep(1)
  }

  return (
    <section id="agendar" className="py-24 relative overflow-hidden bg-transparent print:p-0 print:bg-white print:text-black">
      {/* Background decoration (hidden on print) */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-primary/5 rounded-full blur-3xl print:hidden" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16 print:hidden"
        >
          <h2 className="font-serif text-4xl sm:text-5xl font-bold text-white mb-4">
            Agenda con {artist.name.split(' ')[0]}
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Reserva tu sesión online con {artist.name}. Confirma tu cita al instante con un pago seguro de garantía.
          </p>
        </motion.div>

        {/* Progress steps (hidden on print) */}
        <div className="flex items-center justify-center mb-12 print:hidden">
          {[1, 2, 3, 4].map((s) => (
            <div key={s} className="flex items-center">
              <div
                className={`w-12 h-12 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-500 border-2 ${
                  step > s
                    ? "bg-white text-black border-white shadow-[0_0_15px_rgba(255,255,255,0.5)] scale-105"
                    : step === s
                      ? "bg-primary text-primary-foreground border-primary shadow-[0_0_15px_var(--primary)] scale-110"
                      : "bg-black/40 text-white/40 border-white/20"
                }`}
              >
                {step > s ? <Check className="w-5 h-5" /> : s}
              </div>
              {s < 4 && (
                <div
                  className={`w-12 sm:w-20 h-1 mx-2 transition-all duration-500 rounded-full ${
                    step > s ? "bg-white shadow-[0_0_5px_rgba(255,255,255,0.4)]" : "bg-white/10"
                  }`}
                />
              )}
            </div>
          ))}
        </div>

        {/* Form container */}
        <div className="bg-black/85 backdrop-blur-xl border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl print:bg-white print:text-black print:border-none print:shadow-none print:p-0">
          
          {/* Step 1: Select Service */}
          {step === 1 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-8"
            >
              <div>
                {!userRole && (
                  <div className="bg-white/5 border border-white/10 text-slate-300 p-4 rounded-xl text-sm flex items-center justify-center gap-2 mb-6 animate-pulse-slow">
                    <AlertCircle className="w-5 h-5 flex-shrink-0 text-slate-400" />
                    <span className="font-medium">Debes iniciar sesión como cliente para poder agendar una cita.</span>
                  </div>
                )}
                <h3 className="font-serif text-2xl font-bold text-foreground mb-6 flex items-center justify-center gap-2 text-center text-white">
                  <Scissors className="w-6 h-6 text-primary" />
                  <span className="text-white mr-1 text-3xl">1.</span> Selecciona tu servicio
                </h3>
                
                <div className="grid sm:grid-cols-2 gap-4">
                  {services.map((service) => {
                    const isSelected = selectedService === service.id;
                    return (
                      <button
                        key={service.id}
                        onClick={() => setSelectedService(service.id)}
                        className={`p-5 rounded-2xl border text-left transition-all duration-300 cursor-pointer ${
                          isSelected
                            ? "border-slate-300 bg-slate-300 text-slate-900 shadow-[0_0_20px_rgba(255,255,255,0.2)] scale-[1.05] z-10"
                            : "border-white/10 bg-white/5 hover:bg-white/15 hover:border-white/30 hover:scale-[1.02] text-foreground/80 hover:text-white"
                        }`}
                      >
                        <div className="flex justify-between items-start">
                          <p className={`font-bold text-lg ${isSelected ? "text-slate-950 font-black" : "text-white"}`}>
                            {service.name}
                          </p>
                          <span className={`text-xs px-2 py-0.5 rounded-full ${
                            isSelected ? "bg-black/10 text-slate-800" : "bg-white/10 text-white/85"
                          }`}>
                            {service.size}
                          </span>
                        </div>
                        
                        <div className={`flex justify-between items-end mt-4 pt-3 border-t ${
                          isSelected ? "border-slate-400/40" : "border-white/5"
                        }`}>
                          <div>
                            <p className={`text-[10px] uppercase tracking-wider ${
                              isSelected ? "text-slate-600 font-semibold" : "text-muted-foreground"
                            }`}>
                              Valor Estimado
                            </p>
                            <p className={`font-black text-base ${isSelected ? "text-slate-950" : "text-white"}`}>
                              {formatCurrency(service.price)}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className={`text-[10px] uppercase tracking-wider font-bold ${
                              isSelected ? "text-slate-600" : "text-slate-400"
                            }`}>
                              Abono Garantía
                            </p>
                            <p className={`font-black text-base ${isSelected ? "text-slate-900" : "text-slate-300"}`}>
                              {formatCurrency(service.deposit)}
                            </p>
                          </div>
                        </div>
                      </button>
                    )
                  })}
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
              <h3 className="font-serif text-2xl font-bold text-foreground mb-2 flex items-center justify-center gap-2 text-center text-white">
                <Calendar className="w-6 h-6 text-primary" />
                <span className="text-white mr-1 text-3xl">2.</span> Selecciona fecha y hora
              </h3>
              <div className="grid lg:grid-cols-2 gap-8">
                {/* Calendar */}
                <div className="bg-black/30 p-5 rounded-2xl border border-white/10">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-serif text-xl font-bold text-white capitalize">
                      {currentMonth.toLocaleDateString('es-CL', { month: 'long', year: 'numeric' })}
                    </h3>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))}
                        className="p-2 rounded-lg hover:bg-white/10 transition-colors text-white"
                      >
                        <ChevronLeft className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))}
                        className="p-2 rounded-lg hover:bg-white/10 transition-colors text-white"
                      >
                        <ChevronRight className="w-5 h-5" />
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-7 gap-1 mb-2">
                    {['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'].map((day) => (
                      <div key={day} className="text-center text-xs font-semibold text-muted-foreground py-2">
                        {day}
                      </div>
                    ))}
                  </div>

                  <div className="grid grid-cols-7 gap-1.5">
                    {getDaysInMonth(currentMonth).map((date, index) => (
                      <button
                        key={index}
                        onClick={() => date && isDateAvailable(date) && setSelectedDate(date)}
                        disabled={!date || !isDateAvailable(date)}
                        className={`aspect-square rounded-xl text-xs font-bold transition-all duration-300 ${
                          !date
                            ? "invisible"
                            : !isDateAvailable(date)
                              ? "text-white/20 cursor-not-allowed bg-transparent"
                              : selectedDate?.toDateString() === date.toDateString()
                                ? "bg-primary text-primary-foreground shadow-lg shadow-primary/30 font-black scale-105"
                                : "bg-white/5 hover:bg-white/20 hover:scale-105 border border-white/5 text-white"
                        }`}
                      >
                        {date?.getDate()}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Time slots */}
                <div className="bg-black/30 p-5 rounded-2xl border border-white/10 flex flex-col justify-between">
                  <div>
                    <h3 className="font-serif text-xl font-bold text-white mb-4 flex items-center gap-1.5">
                      <Clock className="w-5 h-5 text-primary" />
                      Horarios Disponibles
                    </h3>
                    {selectedDate ? (
                      <div className="grid grid-cols-2 gap-2.5">
                        {timeSlots.map((time) => (
                          <button
                            key={time}
                            onClick={() => setSelectedTime(time)}
                            className={`p-3.5 rounded-xl border text-center font-bold text-sm transition-all duration-300 ${
                              selectedTime === time
                                ? "border-primary bg-primary/20 text-white shadow-[0_0_15px_rgba(255,255,255,0.1)]"
                                : "border-white/10 bg-white/5 hover:bg-white/20 hover:border-white/50 text-white"
                            }`}
                          >
                            {time}
                          </button>
                        ))}
                      </div>
                    ) : (
                      <p className="text-muted-foreground text-center py-12 text-sm">
                        Selecciona un día en el calendario de la izquierda para ver los bloques horarios libres.
                      </p>
                    )}
                  </div>

                  {selectedDate && selectedTime && (
                    <div className="mt-6 p-4 rounded-xl bg-primary/10 border border-primary/20 flex items-center gap-3">
                      <Calendar className="w-5 h-5 text-primary flex-shrink-0" />
                      <div>
                        <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Fecha Seleccionada</p>
                        <p className="font-bold text-white capitalize text-sm">
                          {formatDate(selectedDate)} a las {selectedTime} hrs
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}

          {/* Step 3: Confirmation Summary & Payment */}
          {step === 3 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6 max-w-xl mx-auto"
            >
              <h3 className="font-serif text-2xl font-bold text-center flex items-center justify-center gap-2 text-white mb-4">
                <ShieldCheck className="w-6 h-6 text-primary" />
                <span className="text-white mr-1 text-3xl">3.</span> Resumen y Pago de Garantía
              </h3>

              {/* Booking breakdown */}
              <div className="bg-black/30 rounded-2xl p-6 space-y-4 border border-white/10 text-white">
                <div className="flex justify-between items-center pb-3 border-b border-white/10">
                  <div>
                    <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Artista Elegido</p>
                    <p className="font-bold text-white text-base">{artist.name}</p>
                  </div>
                  <img 
                    src={artist.avatar} 
                    alt={artist.name} 
                    className="w-10 h-10 rounded-full object-cover border border-white/20" 
                  />
                </div>

                <div className="flex justify-between">
                  <span className="text-muted-foreground text-sm">Servicio Solicitado:</span>
                  <span className="text-white font-bold text-sm">{selectedServiceData?.name}</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-muted-foreground text-sm">Fecha y Hora:</span>
                  <span className="text-white font-bold text-sm capitalize">
                    {selectedDate && formatDate(selectedDate)} - {selectedTime} hrs
                  </span>
                </div>

                <div className="pt-4 border-t border-white/10 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-400">Total Servicio:</span>
                    <span className="text-slate-300 font-bold">{formatCurrency(totalAmount)}</span>
                  </div>
                  <div className="flex justify-between text-base font-black bg-white/5 border border-white/10 p-3.5 rounded-xl">
                    <span className="text-green-400 flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-green-400" />
                      Garantía de Abono:
                    </span>
                    <span className="text-green-400 font-extrabold">{formatCurrency(depositAmount)}</span>
                  </div>
                  <div className="flex justify-between text-xs text-muted-foreground pt-1 px-1">
                    <span>Saldo restante a pagar en estudio:</span>
                    <span>{formatCurrency(remainingAmount)}</span>
                  </div>
                </div>
              </div>

              {/* Booking confirmation action */}
              <div className="space-y-4 pt-4">
                <p className="text-xs text-muted-foreground text-center">
                  Para asegurar tu cupo de cita en la agenda de {artist.name}, es requerido el pago del abono vía Transbank. El pago es simulado y totalmente seguro.
                </p>

                <Button
                  className="w-full bg-green-600 hover:bg-green-700 text-white py-6 rounded-2xl text-base font-bold shadow-xl shadow-green-950/20 flex items-center justify-center gap-2 cursor-pointer animate-pulse-slow"
                  onClick={() => setIsWebpayOpen(true)}
                >
                  <CreditCard className="w-5 h-5" />
                  Pagar abono con Webpay Plus
                </Button>
              </div>
            </motion.div>
          )}

          {/* Step 4: Success Ticket / Receipt */}
          {step === 4 && paymentDetails && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="max-w-xl mx-auto py-4"
            >
              {/* Receipt Visual design */}
              <div className="bg-white text-slate-800 rounded-3xl overflow-hidden shadow-2xl border border-slate-200 relative print:border-none print:shadow-none">
                
                {/* Header decor */}
                <div className="bg-[#1e1e1e] p-6 text-white text-center relative">
                  <div className="absolute top-4 right-4 text-[9px] bg-green-500 text-white font-extrabold px-2 py-0.5 rounded uppercase tracking-wider shadow">
                    Pago Aprobado
                  </div>
                  <h4 className="font-serif text-2xl font-bold tracking-tight text-white mb-1">BLACK INK TATTOO</h4>
                  <p className="text-[10px] text-slate-400 tracking-widest uppercase">Comprobante Oficial de Reserva</p>
                </div>

                {/* Ticket Details */}
                <div className="p-6 space-y-6">
                  <div className="flex flex-col items-center justify-center border-b border-dashed border-slate-300 pb-5 text-center">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-3">
                      <Check className="w-6 h-6 text-green-600 stroke-[3]" />
                    </div>
                    <h5 className="font-bold text-lg text-slate-800">¡Cita Agendada Exitosamente!</h5>
                    <p className="text-xs text-slate-400 mt-0.5">Tu reserva ha sido ingresada en el sistema.</p>
                  </div>

                  {/* Transaction core breakdown */}
                  <div className="grid grid-cols-2 gap-y-4 gap-x-2 text-xs border-b border-dashed border-slate-300 pb-5">
                    <div>
                      <p className="text-slate-400 font-semibold uppercase tracking-wider text-[9px]">Tatuador</p>
                      <p className="font-bold text-slate-700">{artist.name}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-slate-400 font-semibold uppercase tracking-wider text-[9px]">Servicio</p>
                      <p className="font-bold text-slate-700">{selectedServiceData?.name}</p>
                    </div>
                    <div>
                      <p className="text-slate-400 font-semibold uppercase tracking-wider text-[9px]">Fecha de Cita</p>
                      <p className="font-bold text-slate-700 capitalize">{selectedDate && selectedDate.toLocaleDateString('es-CL', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-slate-400 font-semibold uppercase tracking-wider text-[9px]">Hora Pactada</p>
                      <p className="font-bold text-slate-700">{selectedTime} hrs</p>
                    </div>
                    {userEmail && (
                      <div className="col-span-2 pt-1">
                        <p className="text-slate-400 font-semibold uppercase tracking-wider text-[9px]">Email de Cliente</p>
                        <p className="font-bold text-slate-700 truncate">{userEmail}</p>
                      </div>
                    )}
                  </div>

                  {/* Financial Receipts details */}
                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-xs space-y-2">
                    <p className="font-black text-[10px] text-slate-400 uppercase tracking-widest mb-1">Detalles de la Transacción</p>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Pasarela de Pago:</span>
                      <span className="font-semibold text-slate-800">Webpay Plus (Simulado)</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Código de Autorización:</span>
                      <span className="font-mono font-bold text-slate-800">{paymentDetails.authCode}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">ID de Transacción:</span>
                      <span className="font-mono font-bold text-slate-800">{paymentDetails.transactionId}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Medio de Pago:</span>
                      <span className="font-semibold text-slate-800">{paymentDetails.paymentMethod} (•••• {paymentDetails.last4})</span>
                    </div>
                    {paymentDetails.installments > 0 && (
                      <div className="flex justify-between">
                        <span className="text-slate-500">Cuotas:</span>
                        <span className="font-semibold text-slate-800">{paymentDetails.installments} cuotas sin interés</span>
                      </div>
                    )}
                    <div className="flex justify-between border-t border-slate-200 pt-2 font-bold text-sm text-slate-800">
                      <span>Monto Pagado (Abono):</span>
                      <span className="text-green-600 font-black">{formatCurrency(depositAmount)}</span>
                    </div>
                    <div className="flex justify-between text-[10px] text-slate-400">
                      <span>Monto pendiente en estudio:</span>
                      <span>{formatCurrency(remainingAmount)}</span>
                    </div>
                  </div>
                  
                  {/* Decorative pseudo-barcode */}
                  <div className="flex flex-col items-center justify-center pt-2">
                    <div className="flex items-center h-8 gap-0.5 opacity-60">
                      {[1,3,2,1,4,2,3,1,1,2,4,3,1,2,1,3,2,4,1,3,2,1,1,4,2,1,3].map((w, i) => (
                        <div 
                          key={i} 
                          className="bg-black h-full" 
                          style={{ width: `${w}px` }} 
                        />
                      ))}
                    </div>
                    <p className="text-[8px] font-mono text-slate-400 mt-1 uppercase">AUTH-CODE-{paymentDetails.authCode}</p>
                  </div>
                </div>
              </div>

              {/* Action buttons (hidden on print) */}
              <div className="mt-6 flex flex-col sm:flex-row gap-3 print:hidden">
                <Button
                  className="flex-1 bg-white hover:bg-slate-100 text-slate-800 border border-slate-300 py-6 rounded-2xl font-bold flex items-center justify-center gap-1.5 cursor-pointer"
                  onClick={handlePrintReceipt}
                >
                  <Printer className="w-4 h-4" />
                  Imprimir Comprobante
                </Button>
                <Button
                  className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground py-6 rounded-2xl font-bold flex items-center justify-center cursor-pointer"
                  onClick={handleReset}
                >
                  Agendar Otra Cita
                </Button>
              </div>
            </motion.div>
          )}

          {/* Navigation buttons (hidden on print, hidden on Step 4) */}
          {step < 4 && (
            <div className="flex justify-between mt-8 pt-6 border-t border-white/10 print:hidden">
              <Button
                variant="outline"
                onClick={handlePrevStep}
                disabled={step === 1}
                className="border-white/10 hover:bg-white/10 hover:text-white text-white disabled:opacity-40"
              >
                <ChevronLeft className="w-4 h-4 mr-2" />
                Anterior
              </Button>

              {step < 3 && (
                <Button
                  onClick={handleNextStep}
                  disabled={!canProceed()}
                  className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold"
                >
                  Siguiente
                  <ChevronRight className="w-4 h-4 ml-2" />
                </Button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Webpay Simulator Dialog / Modal */}
      <WebpaySimulator
        isOpen={isWebpayOpen}
        onClose={() => setIsWebpayOpen(false)}
        onSuccess={handlePaymentSuccess}
        amount={depositAmount}
        serviceName={selectedServiceData?.name || "Abono Black Ink"}
      />
    </section>
  )
}

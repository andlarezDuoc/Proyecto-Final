"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"
import { Inbox, CheckCircle2, Ticket, Clock, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

// Mock data para simular los envíos de los clientes
const initialReports = [
  {
    id: "rep-1",
    clientName: "Andrea Muñoz",
    date: "Ayer, 18:30",
    status: "new",
    image: "https://images.unsplash.com/photo-1598371839696-5c5bb00bdc28", // Fake healed tattoo url
    notes: "¡Hola! Han pasado 3 meses desde la sesión. El diseño curó perfecto, no perdió nada de color y las líneas siguen súper nítidas. Muy feliz.",
    couponSent: false
  },
  {
    id: "rep-2",
    clientName: "Diego Valenzuela",
    date: "Hace 3 días",
    status: "read",
    image: "https://images.unsplash.com/photo-1611501275019-9b5cda994e8d", 
    notes: "Cicatrizó en tiempo récord. Me eché la crema que me recomendaste por dos semanas. ¡Ya quiero tatuarme el otro brazo!",
    couponSent: true 
  }
]

export default function ReportsPage() {
  const [reports, setReports] = useState(initialReports)
  const [selectedReportId, setSelectedReportId] = useState<string | null>(null)
  const [discountValue, setDiscountValue] = useState("15")
  const [couponMessage, setCouponMessage] = useState("")
  const [isSendingCoupon, setIsSendingCoupon] = useState(false)
  
  // Handlers para el dialog global
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const handleOpenCouponDialog = (reportId: string) => {
    setSelectedReportId(reportId)
    setDiscountValue("15") // reset default
    const report = reports.find(r => r.id === reportId)
    setCouponMessage(`¡Gracias por cuidarte tan bien el tatuaje, ${report?.clientName.split(" ")[0]}! Aprovecha este cupón en tu próxima sesión.`)
    setIsDialogOpen(true)
  }

  const handleSendCoupon = () => {
    setIsSendingCoupon(true)
    
    setTimeout(() => {
      // Marcarlo como enviado
      setReports(prev => prev.map(r => 
        r.id === selectedReportId ? { ...r, couponSent: true, status: "read" } : r
      ))
      
      setIsSendingCoupon(false)
      setIsDialogOpen(false)
      setSelectedReportId(null)
    }, 1200)
  }

  const markAsRead = (reportId: string) => {
    setReports(prev => prev.map(r => 
      r.id === reportId ? { ...r, status: "read" } : r
    ))
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <header className="flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-serif font-bold text-white mb-2 flex items-center gap-3">
            <Inbox className="w-8 h-8 text-zinc-400" />
            Bandeja de Reportes
          </h1>
          <p className="text-zinc-400">
            Revisa cómo han cicatrizado tus piezas y fideliza a tus clientes con descuentos.
          </p>
        </div>
      </header>

      <div className="grid gap-6">
        {reports.map((report) => (
          <motion.div
            key={report.id}
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`rounded-2xl border ${report.status === "new" ? "border-primary/50 bg-primary/5" : "border-zinc-800 bg-zinc-900/30"} p-6 flex flex-col md:flex-row gap-6 transition-all`}
          >
            {/* Foto del tatuaje */}
            <div className="w-full md:w-48 h-48 relative rounded-xl overflow-hidden shrink-0 border border-white/10">
              <Image 
                src={report.image} 
                alt={`Tatuaje cicatrizado de ${report.clientName}`}
                fill
                className="object-cover"
              />
              {report.status === "new" && (
                <div className="absolute top-2 right-2 bg-primary text-black text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1">
                  NUEVO
                </div>
              )}
            </div>

            {/* Detalles */}
            <div className="flex-1 flex flex-col">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h3 className="text-xl font-medium text-white">{report.clientName}</h3>
                  <div className="flex items-center gap-2 text-sm text-zinc-500">
                    <Clock className="w-3.5 h-3.5" />
                    {report.date}
                  </div>
                </div>
              </div>

              <div className="flex-1 mt-3 mb-4">
                <p className="text-zinc-300 text-sm whitespace-pre-wrap italic border-l-2 border-zinc-700 pl-4 py-1">
                  "{report.notes}"
                </p>
              </div>

              {/* Botonera inferior de cada tarjeta */}
              <div className="flex justify-end gap-3 mt-auto pt-4 border-t border-white/5">
                {report.status === "new" && (
                  <Button 
                    variant="ghost" 
                    className="text-zinc-400 hover:text-white"
                    onClick={() => markAsRead(report.id)}
                  >
                    Marcar Visto
                  </Button>
                )}
                
                {report.couponSent ? (
                  <div className="flex items-center gap-2 text-green-400 bg-green-500/10 px-4 py-2 rounded-lg text-sm font-medium border border-green-500/20">
                    <CheckCircle2 className="w-4 h-4" />
                    Cupón Enviado
                  </div>
                ) : (
                  <Button 
                    className="bg-white text-black hover:bg-zinc-200 gap-2"
                    onClick={() => handleOpenCouponDialog(report.id)}
                  >
                    <Ticket className="w-4 h-4" /> Enviar Bono Mágico
                  </Button>
                )}
              </div>
            </div>
          </motion.div>
        ))}

        {reports.length === 0 && (
          <div className="text-center py-20">
            <AlertCircle className="w-12 h-12 text-zinc-600 mx-auto mb-4" />
            <p className="text-zinc-400 text-lg">No tienes reportes pendientes.</p>
          </div>
        )}
      </div>

      {/* Dialog Global para el Envío de Cupón */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="bg-zinc-950 border-white/10 sm:max-w-md w-11/12 mx-auto rounded-3xl p-6">
          <DialogHeader className="mb-4">
            <DialogTitle className="text-2xl font-serif text-white flex gap-2 items-center">
              <Ticket className="w-6 h-6 text-primary" /> Enviar Reconocimiento
            </DialogTitle>
            <DialogDescription className="text-zinc-400">
              Genera un código de descuento único para motivar el próximo proyecto del cliente.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-5">
            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-300">Porcentaje de Descuento</label>
              <div className="flex gap-3">
                {["10", "15", "20", "25"].map(pct => (
                  <button
                    key={pct}
                    onClick={() => setDiscountValue(pct)}
                    className={`flex-1 py-3 rounded-xl border text-lg font-bold transition-all ${
                      discountValue === pct 
                      ? "bg-white text-black border-white" 
                      : "bg-black text-zinc-500 border-zinc-800 hover:border-zinc-500"
                    }`}
                  >
                    {pct}%
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-zinc-300">Mensaje de Acompañamiento</label>
              <textarea 
                value={couponMessage}
                onChange={(e) => setCouponMessage(e.target.value)}
                className="w-full bg-black/50 border border-zinc-800 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-zinc-500 focus:ring-1 focus:ring-zinc-500 transition-all min-h-[80px] resize-none"
              />
            </div>

            <div className="pt-4">
              <Button 
                onClick={handleSendCoupon}
                disabled={isSendingCoupon}
                className="w-full bg-white text-black hover:bg-zinc-200 py-6 text-lg"
              >
                {isSendingCoupon ? (
                  <span className="flex items-center gap-2">
                    <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                    Enviando cupón de {discountValue}%...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    Enviar Cupón ahora
                  </span>
                )}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

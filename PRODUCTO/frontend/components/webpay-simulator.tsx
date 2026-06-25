"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { 
  CreditCard, 
  Lock, 
  ArrowRight, 
  CheckCircle2, 
  XCircle, 
  Loader2, 
  ChevronRight,
  ShieldCheck
} from "lucide-react"

interface WebpaySimulatorProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: (details: {
    cardType: string
    last4: string
    transactionId: string
    authCode: string
    paymentMethod: string
    installments: number
  }) => void
  amount: number
  serviceName: string
}

type SimulatorState = "form" | "processing" | "bank_auth" | "processing_auth" | "success" | "failed"

export function WebpaySimulator({ isOpen, onClose, onSuccess, amount, serviceName }: WebpaySimulatorProps) {
  const [state, setState] = useState<SimulatorState>("form")
  const [cardType, setCardType] = useState<"credit" | "debit">("credit")
  const [cardNumber, setCardNumber] = useState("")
  const [expiry, setExpiry] = useState("")
  const [cvv, setCvv] = useState("")
  const [name, setName] = useState("")
  const [selectedBank, setSelectedBank] = useState("BancoEstado")
  const [errorMessage, setErrorMessage] = useState("")
  const [buyOrder, setBuyOrder] = useState("")
  const [cardBrand, setCardBrand] = useState<"visa" | "mastercard" | "unknown">("unknown")

  useEffect(() => {
    if (isOpen) {
      setState("form")
      setCardNumber("")
      setExpiry("")
      setCvv("")
      setName("")
      setErrorMessage("")
      // Generar número de orden de compra dinámico
      const rand = Math.floor(100000 + Math.random() * 900000)
      setBuyOrder(`WI-${rand}`)
    }
  }, [isOpen])

  // Detectar marca de tarjeta según el primer dígito
  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, "")
    if (value.length > 16) value = value.slice(0, 16)
    
    // Espaciado automático
    const parts = []
    for (let i = 0; i < value.length; i += 4) {
      parts.push(value.slice(i, i + 4))
    }
    const formatted = parts.join(" ")
    setCardNumber(formatted)

    if (value.startsWith("4")) {
      setCardBrand("visa")
    } else if (value.startsWith("5")) {
      setCardBrand("mastercard")
    } else {
      setCardBrand("unknown")
    }
  }

  // Formato automático de fecha MM/YY
  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, "")
    if (value.length > 4) value = value.slice(0, 4)
    
    if (value.length > 2) {
      setExpiry(`${value.slice(0, 2)}/${value.slice(2)}`)
    } else {
      setExpiry(value)
    }
  }


  const handleCvvChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "")
    if (value.length <= 4) {
      setCvv(value)
    }
  }

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat("es-CL", {
      style: "currency",
      currency: "CLP",
    }).format(val)
  }

  const handleSubmitCard = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (cardNumber.replace(/\s/g, "").length < 15) {
      setErrorMessage("Por favor ingresa un número de tarjeta válido.")
      return
    }
    if (expiry.length < 5) {
      setErrorMessage("Por favor ingresa una fecha de vencimiento válida (MM/YY).")
      return
    }
    if (cvv.length < 3) {
      setErrorMessage("Ingresa el código CVV correcto.")
      return
    }
    if (name.trim().length < 3) {
      setErrorMessage("Ingresa el nombre del titular.")
      return
    }

    setErrorMessage("")
    setState("processing")

    // Demora de procesamiento simulado
    setTimeout(() => {
      setState("bank_auth")
    }, 2000)
  }

  const handleBankAuthorize = (success: boolean) => {
    setState("processing_auth")
    
    setTimeout(() => {
      if (success) {
        setState("success")
        

        setTimeout(() => {
          const authCode = Math.floor(100000 + Math.random() * 900000).toString()
          const transactionId = Math.floor(10000000 + Math.random() * 90000000).toString()
          
          onSuccess({
            cardType: cardType === "credit" ? "Crédito" : "Débito",
            last4: cardNumber.slice(-4),
            transactionId,
            authCode,
            paymentMethod: cardType === "credit" ? "Webpay Crédito" : "Redcompra Débito",
            installments: cardType === "credit" ? 3 : 0
          })
        }, 1800)
      } else {
        setState("failed")
      }
    }, 1500)
  }

  if (!isOpen) return null

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.3 }}
          className="w-full max-w-[460px] bg-[#f4f4f7] rounded-2xl shadow-2xl overflow-hidden text-slate-800 flex flex-col font-sans border border-slate-300"
        >
          {/* Encabezado Transbank */}
          <div className="bg-[#e2231a] p-4 text-white flex justify-between items-center shadow-md">
            <div className="flex items-center gap-2">
              <span className="font-black tracking-tighter text-xl italic text-white flex items-center">
                webpay<span className="font-normal text-xs align-super ml-0.5">plus</span>
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-[10px] bg-black/15 px-2.5 py-1 rounded-full text-white/90 border border-white/10">
              <ShieldCheck className="w-3.5 h-3.5 text-white animate-pulse" />
              <span>Conexión Encriptada SSL</span>
            </div>
          </div>

          {/* Datos del comercio y transacción */}
          <div className="bg-white p-4 border-b border-slate-200 grid grid-cols-2 gap-2 text-xs">
            <div>
              <p className="text-slate-400 font-semibold uppercase tracking-wider text-[9px]">Comercio</p>
              <p className="font-bold text-slate-700 text-sm">Black Ink Tattoo Chile</p>
            </div>
            <div className="text-right">
              <p className="text-slate-400 font-semibold uppercase tracking-wider text-[9px]">Monto a Pagar</p>
              <p className="font-black text-slate-900 text-base">{formatCurrency(amount)}</p>
            </div>
            <div className="mt-1">
              <p className="text-slate-400 font-semibold uppercase tracking-wider text-[9px]">Orden de Compra</p>
              <p className="font-mono font-bold text-slate-600">{buyOrder}</p>
            </div>
            <div className="mt-1 text-right">
              <p className="text-slate-400 font-semibold uppercase tracking-wider text-[9px]">Servicio</p>
              <p className="font-bold text-slate-600 truncate">{serviceName}</p>
            </div>
          </div>

          {/* Estados interactivos de pantalla */}
          <div className="p-5 flex-1 min-h-[290px] flex flex-col justify-between">
            {state === "form" && (
              <form onSubmit={handleSubmitCard} className="space-y-4 flex-1 flex flex-col justify-between">
                <div>
                  <h4 className="text-sm font-bold text-slate-700 mb-3 flex items-center gap-1.5">
                    <CreditCard className="w-4 h-4 text-[#e2231a]" />
                    Selecciona tu medio de pago
                  </h4>

                  {/* Pestañas de selección de pago */}
                  <div className="grid grid-cols-2 gap-2 mb-4 bg-slate-200/60 p-1.5 rounded-xl border border-slate-300">
                    <button
                      type="button"
                      onClick={() => setCardType("credit")}
                      className={`py-2 text-xs font-semibold rounded-lg transition-all ${
                        cardType === "credit"
                          ? "bg-white text-[#e2231a] shadow-sm font-bold"
                          : "text-slate-500 hover:text-slate-800"
                      }`}
                    >
                      Tarjeta de Crédito
                    </button>
                    <button
                      type="button"
                      onClick={() => setCardType("debit")}
                      className={`py-2 text-xs font-semibold rounded-lg transition-all ${
                        cardType === "debit"
                          ? "bg-white text-[#e2231a] shadow-sm font-bold"
                          : "text-slate-500 hover:text-slate-800"
                      }`}
                    >
                      Redcompra / Débito
                    </button>
                  </div>

                  {errorMessage && (
                    <div className="bg-red-100 border border-red-200 text-red-700 text-xs px-3 py-2.5 rounded-lg mb-3">
                      {errorMessage}
                    </div>
                  )}

                  {/* Formulario de tarjeta */}
                  <div className="space-y-3">
                    <div className="relative">
                      <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Número de Tarjeta</label>
                      <input
                        type="text"
                        value={cardNumber}
                        onChange={handleCardNumberChange}
                        placeholder="4532 1234 5678 9012"
                        className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#e2231a] focus:border-[#e2231a]"
                        required
                      />
                      <div className="absolute right-3 bottom-2 flex items-center gap-1.5 h-6">
                        {cardBrand === "visa" && (
                          <span className="text-[10px] font-black text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded border border-blue-200 uppercase">Visa</span>
                        )}
                        {cardBrand === "mastercard" && (
                          <span className="text-[10px] font-black text-red-500 bg-red-50 px-1.5 py-0.5 rounded border border-red-200 uppercase">MasterCard</span>
                        )}
                        {cardBrand === "unknown" && <CreditCard className="w-4 h-4 text-slate-400" />}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Vencimiento</label>
                        <input
                          type="text"
                          value={expiry}
                          onChange={handleExpiryChange}
                          placeholder="MM/YY"
                          className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#e2231a] focus:border-[#e2231a] text-center"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">CVV</label>
                        <input
                          type="password"
                          value={cvv}
                          onChange={handleCvvChange}
                          placeholder="123"
                          className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#e2231a] focus:border-[#e2231a] text-center font-mono"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Nombre del Titular</label>
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="JUAN PEREZ"
                        className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-800 focus:outline-none focus:ring-1 focus:ring-[#e2231a] focus:border-[#e2231a] uppercase"
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Acciones del formulario */}
                <div className="pt-4 flex flex-col gap-2">
                  <button
                    type="submit"
                    className="w-full bg-[#e2231a] hover:bg-[#c91d15] text-white py-3 rounded-xl text-sm font-bold shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <span>Pagar de forma Segura</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>

                  <button
                    type="button"
                    onClick={onClose}
                    className="w-full text-slate-500 hover:text-slate-700 text-xs font-semibold py-2 transition-colors cursor-pointer"
                  >
                    Anular y volver al comercio
                  </button>
                </div>
              </form>
            )}

            {state === "processing" && (
              <div className="flex-1 flex flex-col items-center justify-center py-8 text-center">
                <Loader2 className="w-12 h-12 text-[#e2231a] animate-spin mb-4" />
                <h4 className="text-base font-bold text-slate-800 mb-1">Procesando Tarjeta</h4>
                <p className="text-xs text-slate-500 max-w-[280px]">
                  Conectando de forma segura con Transbank y la entidad emisora...
                </p>
                <div className="mt-8 flex items-center gap-1 text-[10px] text-slate-400 bg-slate-200/50 px-3 py-1.5 rounded-lg border border-slate-300/40">
                  <Lock className="w-3.5 h-3.5" />
                  <span>Seguridad Transbank SSL activa</span>
                </div>
              </div>
            )}

            {state === "bank_auth" && (
              <div className="flex-1 flex flex-col justify-between">
                <div>
                  <div className="bg-[#1b365d] p-3 -mx-5 -mt-5 mb-4 text-white flex justify-between items-center">
                    <span className="font-serif italic font-bold tracking-tight text-sm">Simulador de Autorización Bancaria</span>
                    <span className="text-[10px] text-[#25D366] bg-white/10 px-2 py-0.5 rounded font-mono">Simulando Redbanc</span>
                  </div>

                  <div className="bg-blue-50 border border-blue-200 p-3 rounded-lg text-xs text-blue-800 space-y-2 mb-4">
                    <p className="font-bold">⚠️ ENTORNO DE SIMULACIÓN DE EXAMEN</p>
                    <p>
                      Para verificar el comportamiento del agendamiento, selecciona una institución bancaria de simulación y autoriza o rechaza el abono.
                    </p>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <label className="block text-[10px] font-bold text-slate-500 uppercase mb-1">Institución Bancaria</label>
                      <select 
                        value={selectedBank} 
                        onChange={(e) => setSelectedBank(e.target.value)}
                        className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-800 text-slate-800"
                      >
                        <option value="BancoEstado">BancoEstado</option>
                        <option value="Banco de Chile">Banco de Chile / Edwards</option>
                        <option value="Santander">Santander</option>
                        <option value="BCI">BCI</option>
                        <option value="Scotiabank">Scotiabank</option>
                        <option value="Banco Falabella">Banco Falabella</option>
                      </select>
                    </div>

                    <div className="border border-slate-200 bg-white p-3 rounded-lg text-xs space-y-1">
                      <div className="flex justify-between">
                        <span className="text-slate-500">Monto:</span>
                        <span className="font-bold text-slate-800">{formatCurrency(amount)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Tarjeta:</span>
                        <span className="font-bold text-slate-800">•••• •••• •••• {cardNumber.slice(-4)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-500">Titular:</span>
                        <span className="font-bold text-slate-800 uppercase">{name}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pt-4 grid grid-cols-2 gap-2">
                  <button
                    onClick={() => handleBankAuthorize(true)}
                    className="bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg text-xs font-bold shadow transition-all cursor-pointer text-center"
                  >
                    Autorizar Pago
                  </button>
                  <button
                    onClick={() => handleBankAuthorize(false)}
                    className="bg-red-600 hover:bg-red-700 text-white py-3 rounded-lg text-xs font-bold shadow transition-all cursor-pointer text-center"
                  >
                    Rechazar Pago
                  </button>
                </div>
              </div>
            )}

            {state === "processing_auth" && (
              <div className="flex-1 flex flex-col items-center justify-center py-8 text-center">
                <Loader2 className="w-12 h-12 text-[#1b365d] animate-spin mb-4" />
                <h4 className="text-base font-bold text-slate-800 mb-1">Confirmando con {selectedBank}</h4>
                <p className="text-xs text-slate-500 max-w-[280px]">
                  Verificando fondos y código de coordenadas de seguridad...
                </p>
              </div>
            )}

            {state === "success" && (
              <div className="flex-1 flex flex-col items-center justify-center py-8 text-center">
                <motion.div
                  initial={{ scale: 0.6, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: "spring", stiffness: 200, damping: 15 }}
                >
                  <CheckCircle2 className="w-16 h-16 text-green-500 mb-4" />
                </motion.div>
                <h4 className="text-lg font-bold text-slate-800 mb-1">¡Transacción Exitosa!</h4>
                <p className="text-xs text-green-600 font-semibold mb-3">Pago Recibido por Black Ink Tattoo</p>
                <p className="text-xs text-slate-500 max-w-[280px] mb-6">
                  Redirigiendo de vuelta al sitio de Black Ink para registrar tu reserva...
                </p>
                <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: "0%" }}
                    animate={{ width: "100%" }}
                    transition={{ duration: 1.6 }}
                    className="h-full bg-green-500"
                  />
                </div>
              </div>
            )}

            {state === "failed" && (
              <div className="flex-1 flex flex-col justify-between py-2 text-center">
                <div className="flex flex-col items-center justify-center mt-6">
                  <XCircle className="w-16 h-16 text-red-500 mb-4 animate-bounce" />
                  <h4 className="text-lg font-bold text-slate-800 mb-1">Transacción Rechazada</h4>
                  <p className="text-xs text-red-600 font-semibold mb-2">Error de Autenticación o Fondos Insuficientes</p>
                  <p className="text-xs text-slate-500 max-w-[260px]">
                    El banco simulado ha rechazado el cargo o cancelaste la autorización.
                  </p>
                </div>

                <div className="pt-4 flex flex-col gap-2">
                  <button
                    onClick={() => setState("form")}
                    className="w-full bg-[#e2231a] hover:bg-[#c91d15] text-white py-2.5 rounded-lg text-xs font-bold transition-all cursor-pointer"
                  >
                    Reintentar Pago
                  </button>
                  <button
                    onClick={onClose}
                    className="w-full text-slate-500 hover:text-slate-700 text-xs font-semibold py-1.5 transition-colors cursor-pointer"
                  >
                    Volver a Citas
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Sellos de seguridad inferiores */}
          <div className="bg-slate-200 border-t border-slate-300/80 px-4 py-3 flex justify-between items-center text-[9px] text-slate-400">
            <div className="flex items-center gap-1">
              <span>Tecnología por</span>
              <span className="font-bold text-slate-600 tracking-tighter">transbank</span>
            </div>
            <div className="flex items-center gap-1.5 font-bold text-slate-500">
              <span>Webpay Protect</span>
              <div className="w-1.5 h-1.5 rounded-full bg-green-500" />
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  )
}

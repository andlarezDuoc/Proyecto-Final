"use client"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { MessageCircle, X, Send, Bot, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface Message {
  id: number
  text: string
  sender: "bot" | "user"
  options?: string[]
}

const initialMessages: Message[] = [
  {
    id: 1,
    text: "¡Hola! Soy el asistente virtual de INK Studio. Estoy aquí para ayudarte a resolver tus dudas y preparar tu próxima cita. ¿En qué puedo ayudarte hoy?",
    sender: "bot",
    options: [
      "Quiero agendar una cita",
      "Tengo dudas sobre precios",
      "Quiero ver el catálogo",
      "Información de cuidados",
    ],
  },
]

const botResponses: Record<string, { text: string; options?: string[]; followUp?: string }> = {
  "Quiero agendar una cita": {
    text: "¡Genial! Me encantaría ayudarte a agendar. Antes, necesito hacerte algunas preguntas para preparar todo. ¿Es tu primer tatuaje?",
    options: ["Sí, es mi primero", "No, ya tengo tatuajes"],
  },
  "Sí, es mi primero": {
    text: "¡Qué emocionante tu primer tatuaje! No te preocupes, estarás en buenas manos. ¿Qué estilo de tatuaje te interesa?",
    options: ["Fine Line / Minimalista", "Blackwork", "Realismo", "Otro estilo"],
  },
  "No, ya tengo tatuajes": {
    text: "¡Excelente! Un cliente con experiencia. ¿Qué estilo de tatuaje buscas esta vez?",
    options: ["Fine Line / Minimalista", "Blackwork", "Realismo", "Otro estilo"],
  },
  "Fine Line / Minimalista": {
    text: "El fine line es uno de nuestros estilos más populares. Luna es nuestra especialista en esta técnica. ¿En qué zona del cuerpo te gustaría el tatuaje?",
    options: ["Brazo", "Pierna", "Espalda", "Otra zona"],
  },
  "Blackwork": {
    text: "El blackwork es impresionante. Carlos es nuestro maestro en este estilo. ¿En qué zona del cuerpo te gustaría el tatuaje?",
    options: ["Brazo", "Pierna", "Espalda", "Otra zona"],
  },
  "Realismo": {
    text: "El realismo es un arte que María domina a la perfección. ¿En qué zona del cuerpo te gustaría el tatuaje?",
    options: ["Brazo", "Pierna", "Espalda", "Otra zona"],
  },
  "Otro estilo": {
    text: "Tenemos artistas que dominan diversos estilos. ¿En qué zona del cuerpo te gustaría el tatuaje?",
    options: ["Brazo", "Pierna", "Espalda", "Otra zona"],
  },
  "Brazo": {
    text: "¡Perfecta elección! Ya tengo la información que necesito. Te recomiendo agendar una consulta gratuita para definir el diseño. ¿Te gustaría que te conecte con WhatsApp para finalizar la reserva?",
    options: ["Sí, contactar por WhatsApp", "Prefiero agendar en la web"],
  },
  "Pierna": {
    text: "¡Excelente zona! Ya tengo la información que necesito. Te recomiendo agendar una consulta gratuita para definir el diseño. ¿Te gustaría que te conecte con WhatsApp para finalizar la reserva?",
    options: ["Sí, contactar por WhatsApp", "Prefiero agendar en la web"],
  },
  "Espalda": {
    text: "La espalda es un lienzo increíble para trabajar. Ya tengo la información que necesito. Te recomiendo agendar una consulta gratuita para definir el diseño. ¿Te gustaría que te conecte con WhatsApp para finalizar la reserva?",
    options: ["Sí, contactar por WhatsApp", "Prefiero agendar en la web"],
  },
  "Otra zona": {
    text: "¡Perfecto! Ya tengo la información que necesito. Te recomiendo agendar una consulta gratuita para definir el diseño. ¿Te gustaría que te conecte con WhatsApp para finalizar la reserva?",
    options: ["Sí, contactar por WhatsApp", "Prefiero agendar en la web"],
  },
  "Sí, contactar por WhatsApp": {
    text: "Te redirijo a WhatsApp con toda la información de tu consulta. ¡Un artista te contactará pronto!",
    followUp: "whatsapp",
  },
  "Prefiero agendar en la web": {
    text: "¡Por supuesto! Puedes usar nuestro sistema de reservas en la sección 'Agendar' de esta página. ¿Hay algo más en lo que pueda ayudarte?",
    options: ["Tengo otra consulta", "Gracias, eso es todo"],
  },
  "Tengo dudas sobre precios": {
    text: "Nuestros precios varían según el tamaño y complejidad del tatuaje:\n\n• Consulta: Gratis\n• Tatuaje pequeño: desde $50.000\n• Tatuaje mediano: desde $100.000\n• Tatuaje grande: desde $150.000\n• Cover up: desde $80.000\n\n¿Te gustaría agendar una consulta para un presupuesto personalizado?",
    options: ["Sí, agendar consulta", "Tengo otra pregunta"],
  },
  "Sí, agendar consulta": {
    text: "¡Perfecto! La consulta es gratuita y sin compromiso. ¿Prefieres agendarla por WhatsApp o en nuestra web?",
    options: ["Sí, contactar por WhatsApp", "Prefiero agendar en la web"],
  },
  "Quiero ver el catálogo": {
    text: "¡Claro! Puedes explorar nuestra galería completa en la sección 'Galería' de esta página. Ahí podrás filtrar por estilo y artista. ¿Hay algún estilo en particular que te interese?",
    options: ["Fine Line / Minimalista", "Blackwork", "Realismo", "Ver toda la galería"],
  },
  "Ver toda la galería": {
    text: "¡Excelente! Desplázate hacia arriba a la sección Galería para ver todos nuestros trabajos. ¿Puedo ayudarte con algo más?",
    options: ["Quiero agendar una cita", "Tengo otra pregunta", "Gracias, eso es todo"],
  },
  "Información de cuidados": {
    text: "¡Buena pregunta! Los cuidados son esenciales:\n\n🔹 Antes del tatuaje:\n• No alcohol 24h antes\n• Hidratar la piel\n• Descansar bien\n\n🔹 Después del tatuaje:\n• No mojar las primeras 3 horas\n• Aplicar crema cicatrizante\n• Evitar sol directo 2 semanas\n• No rascar ni pelar\n\n¿Te gustaría saber más detalles?",
    options: ["Más sobre cuidados previos", "Más sobre cuidados posteriores", "Tengo otra consulta"],
  },
  "Más sobre cuidados previos": {
    text: "Cuidados previos detallados:\n\n• Duerme al menos 8 horas\n• Come bien antes de la sesión\n• Hidrata tu piel los días anteriores\n• No tomes aspirinas\n• Viste ropa cómoda\n• Trae tu documento de identidad\n\n¿Algo más que quieras saber?",
    options: ["Quiero agendar una cita", "Tengo otra pregunta", "Gracias, eso es todo"],
  },
  "Más sobre cuidados posteriores": {
    text: "Cuidados posteriores detallados:\n\n• Lava suavemente con jabón neutro\n• Seca con toques suaves\n• Aplica crema recomendada 2-3 veces al día\n• No uses piscina ni mar por 2 semanas\n• Evita ejercicio intenso los primeros días\n• Usa protector solar una vez sanado\n\n¿Algo más que quieras saber?",
    options: ["Quiero agendar una cita", "Tengo otra pregunta", "Gracias, eso es todo"],
  },
  "Tengo otra consulta": {
    text: "¡Por supuesto! ¿En qué más puedo ayudarte?",
    options: ["Quiero agendar una cita", "Tengo dudas sobre precios", "Información de cuidados", "Hablar con una persona"],
  },
  "Tengo otra pregunta": {
    text: "¡Claro! ¿Qué te gustaría saber?",
    options: ["Quiero agendar una cita", "Tengo dudas sobre precios", "Información de cuidados", "Hablar con una persona"],
  },
  "Hablar con una persona": {
    text: "¡Entendido! Te conectaré con nuestro equipo por WhatsApp para que puedan atenderte personalmente.",
    followUp: "whatsapp",
  },
  "Gracias, eso es todo": {
    text: "¡Gracias por contactarnos! Recuerda que puedes volver a escribirme cuando quieras. ¡Esperamos verte pronto en INK Studio!",
    options: ["Tengo otra consulta"],
  },
}

export function WhatsAppChat() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>(initialMessages)
  const [inputValue, setInputValue] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSendMessage = (text: string) => {
    // Add user message
    const userMessage: Message = {
      id: messages.length + 1,
      text,
      sender: "user",
    }
    setMessages((prev) => [...prev, userMessage])
    setInputValue("")
    setIsTyping(true)

    // Simulate bot response delay
    setTimeout(() => {
      setIsTyping(false)
      
      const response = botResponses[text]
      
      if (response?.followUp === "whatsapp") {
        // Open WhatsApp with pre-filled message
        const whatsappMessage = encodeURIComponent(
          "¡Hola! Vengo del chat de INK Studio y me gustaría agendar una consulta."
        )
        window.open(`https://wa.me/56912345678?text=${whatsappMessage}`, "_blank")
      }

      const botMessage: Message = {
        id: messages.length + 2,
        text: response?.text || "Lo siento, no entendí tu mensaje. ¿Podrías reformularlo o seleccionar una de las opciones?",
        sender: "bot",
        options: response?.options || ["Quiero agendar una cita", "Tengo dudas sobre precios", "Hablar con una persona"],
      }
      setMessages((prev) => [...prev, botMessage])
    }, 1000)
  }

  const handleOptionClick = (option: string) => {
    handleSendMessage(option)
  }

  return (
    <>
      {/* Chat button */}
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        className="fixed bottom-6 right-6 z-50 w-16 h-16 rounded-full bg-[#25D366] hover:bg-[#20BD5A] text-white shadow-2xl flex items-center justify-center transition-colors"
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Abrir chat"
      >
        {isOpen ? (
          <X className="w-6 h-6" />
        ) : (
          <MessageCircle className="w-7 h-7" />
        )}
      </motion.button>

      {/* Chat window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-24 right-6 z-50 w-[360px] max-w-[calc(100vw-48px)] h-[500px] max-h-[calc(100vh-120px)] bg-card border border-border rounded-2xl shadow-2xl overflow-hidden flex flex-col"
          >
            {/* Header */}
            <div className="bg-[#25D366] text-white p-4 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <p className="font-medium">INK Studio</p>
                <p className="text-xs text-white/80">Asistente virtual</p>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-secondary/20">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl px-4 py-3 ${
                      message.sender === "user"
                        ? "bg-primary text-primary-foreground rounded-br-sm"
                        : "bg-card border border-border text-foreground rounded-bl-sm"
                    }`}
                  >
                    <div className="flex items-start gap-2">
                      {message.sender === "bot" && (
                        <Bot className="w-4 h-4 text-[#25D366] flex-shrink-0 mt-0.5" />
                      )}
                      <div>
                        <p className="text-sm whitespace-pre-line">{message.text}</p>
                        {message.options && (
                          <div className="mt-3 flex flex-wrap gap-2">
                            {message.options.map((option) => (
                              <button
                                key={option}
                                onClick={() => handleOptionClick(option)}
                                className="text-xs px-3 py-1.5 rounded-full bg-primary/10 text-primary hover:bg-primary/20 transition-colors text-left"
                              >
                                {option}
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                      {message.sender === "user" && (
                        <User className="w-4 h-4 text-primary-foreground/70 flex-shrink-0 mt-0.5" />
                      )}
                    </div>
                  </div>
                </div>
              ))}

              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-card border border-border rounded-2xl rounded-bl-sm px-4 py-3">
                    <div className="flex items-center gap-1">
                      <div className="w-2 h-2 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: "0ms" }} />
                      <div className="w-2 h-2 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: "150ms" }} />
                      <div className="w-2 h-2 rounded-full bg-muted-foreground animate-bounce" style={{ animationDelay: "300ms" }} />
                    </div>
                  </div>
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 border-t border-border bg-card">
              <form
                onSubmit={(e) => {
                  e.preventDefault()
                  if (inputValue.trim()) {
                    handleSendMessage(inputValue.trim())
                  }
                }}
                className="flex gap-2"
              >
                <Input
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Escribe un mensaje..."
                  className="flex-1 bg-input border-border"
                />
                <Button
                  type="submit"
                  size="icon"
                  className="bg-[#25D366] hover:bg-[#20BD5A] text-white"
                  disabled={!inputValue.trim()}
                >
                  <Send className="w-4 h-4" />
                </Button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

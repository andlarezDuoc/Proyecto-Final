import { describe, it, expect } from 'vitest'
import { botResponses } from '../whatsapp-chat'

describe('WhatsApp Virtual Assistant Chatbot Dialog Flow', () => {
  it('should have responses defined for standard user queries', () => {
    expect(botResponses).toBeDefined()
    expect(Object.keys(botResponses).length).toBeGreaterThan(10)
  })

  it('correctly initiates booking when user wants to schedule', () => {
    const bookingInit = botResponses["Quiero agendar una cita"]
    expect(bookingInit).toBeDefined()
    expect(bookingInit.text).toContain('¿Es tu primer tatuaje?')
    expect(bookingInit.options).toContain('Sí, es mi primero')
    expect(bookingInit.options).toContain('No, ya tengo tatuajes')
  })

  it('presents style options regardless of tattoo experience', () => {
    const responseFirstTimer = botResponses["Sí, es mi primero"]
    const responseExperienced = botResponses["No, ya tengo tatuajes"]

    expect(responseFirstTimer.options).toContain('Fine Line / Minimalista')
    expect(responseFirstTimer.options).toContain('Blackwork')
    expect(responseFirstTimer.options).toContain('Realismo')

    expect(responseExperienced.options).toContain('Fine Line / Minimalista')
    expect(responseExperienced.options).toContain('Blackwork')
    expect(responseExperienced.options).toContain('Realismo')
  })

  it('suggests specific artists for different tattoo styles', () => {
    const fineLine = botResponses["Fine Line / Minimalista"]
    const blackwork = botResponses["Blackwork"]
    const realismo = botResponses["Realismo"]

    // Fine line expert is Luna
    expect(fineLine.text).toContain('Luna')
    expect(fineLine.options).toContain('Brazo')

    // Blackwork expert is Carlos
    expect(blackwork.text).toContain('Carlos')
    expect(blackwork.options).toContain('Brazo')

    // Realism expert is María
    expect(realismo.text).toContain('María')
    expect(realismo.options).toContain('Brazo')
  })

  it('directs user to WhatsApp contact for human agent support', () => {
    const humanSupport = botResponses["Hablar con una persona"]
    expect(humanSupport).toBeDefined()
    expect(humanSupport.followUp).toBe('whatsapp')
    expect(humanSupport.text).toContain('conectar')
  })

  it('provides precise information about tattoo care instructions', () => {
    const careInfo = botResponses["Información de cuidados"]
    expect(careInfo).toBeDefined()
    expect(careInfo.text).toContain('Antes del tatuaje')
    expect(careInfo.text).toContain('Después del tatuaje')
    expect(careInfo.options).toContain('Más sobre cuidados previos')
    expect(careInfo.options).toContain('Más sobre cuidados posteriores')
  })
})

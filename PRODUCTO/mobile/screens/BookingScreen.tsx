import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, TextInput, ActivityIndicator, Alert, Image } from 'react-native';
import { Artist } from '../lib/data/artists';
import { supabase } from '../lib/supabase';
import { ArrowLeft, Check, Calendar, Clock, CreditCard, ShieldCheck, Printer, AlertCircle } from 'lucide-react-native';

const timeSlots = [
  "10:00", "11:00", "12:00", "14:00", "15:00", "16:00", "17:00", "18:00"
];

const services = [
  { id: "pequeño", name: "Tatuaje Pequeño", size: "Hasta 5 cm", price: 50000, deposit: 10000 },
  { id: "mediano", name: "Tatuaje Mediano", size: "De 5 cm a 10 cm", price: 100000, deposit: 20000 },
  { id: "grande", name: "Tatuaje Grande", size: "De 10 cm a 20 cm", price: 150000, deposit: 30000 },
  { id: "cover", name: "Cover Up", size: "Tamaño a evaluar", price: 80000, deposit: 15000 },
];

interface BookingScreenProps {
  artist: Artist;
  userEmail: string | null;
  onBack: () => void;
  onNavigateToLogin: () => void;
}

export function BookingScreen({ artist, userEmail, onBack, onNavigateToLogin }: BookingScreenProps) {
  const [step, setStep] = useState(1);
  const [selectedService, setSelectedService] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  
  // Datos del cliente
  const [clientName, setClientName] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [clientIdea, setClientIdea] = useState('');
  
  // Estado de Webpay Simulado
  const [isPaying, setIsPaying] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState<boolean | null>(null);
  const [authCode, setAuthCode] = useState('');
  const [transactionId, setTransactionId] = useState('');

  // Generamos los próximos 7 días para agendar
  const dates = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i + 1); // Empezamos desde mañana
    return {
      raw: d.toISOString().split('T')[0],
      dayName: d.toLocaleDateString('es-CL', { weekday: 'short' }),
      dayNumber: d.getDate(),
      month: d.toLocaleDateString('es-CL', { month: 'short' })
    };
  });

  const activeService = services.find(s => s.id === selectedService);

  const handleNextStep = () => {
    if (step === 1) {
      if (!selectedService) {
        Alert.alert('Servicio requerido', 'Por favor selecciona un tamaño de tatuaje.');
        return;
      }
      setStep(2);
    } else if (step === 2) {
      if (!selectedDate || !selectedTime) {
        Alert.alert('Fecha/Hora requeridos', 'Por favor selecciona una fecha y una hora.');
        return;
      }
      if (!userEmail) {
        Alert.alert(
          'Inicio de sesión requerido',
          'Debes iniciar sesión como cliente para poder reservar.',
          [
            { text: 'Cancelar', style: 'cancel' },
            { text: 'Iniciar Sesión', onPress: onNavigateToLogin }
          ]
        );
        return;
      }
      setStep(3);
    } else if (step === 3) {
      if (!clientName.trim() || !clientPhone.trim()) {
        Alert.alert('Datos obligatorios', 'Por favor ingresa tu nombre y número de teléfono.');
        return;
      }
      setStep(4); // Ir a simulación de Webpay
    }
  };

  const handleSimulatePayment = (success: boolean) => {
    setIsPaying(true);
    setTimeout(() => {
      setIsPaying(false);
      setPaymentSuccess(success);
      if (success) {
        setAuthCode(Math.floor(100000 + Math.random() * 900000).toString());
        setTransactionId('WPM-' + Math.floor(10000000 + Math.random() * 90000000));
      } else {
        Alert.alert('Pago Rechazado', 'La transacción fue rechazada por el banco emisor.');
      }
    }, 2000);
  };

  return (
    <View style={styles.container}>
      {/* Barra de cabecera */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={step > 1 && paymentSuccess === null ? () => setStep(step - 1) : onBack}>
          <ArrowLeft size={20} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle} numberOfLines={1}>
          {paymentSuccess !== null ? 'Comprobante de Reserva' : `Reservar con ${artist.name.split(' ')[0]}`}
        </Text>
        <View style={{ width: 36 }} />
      </View>

      {/* Indicadores de progreso (oculto en comprobante final) */}
      {paymentSuccess === null && (
        <View style={styles.progressContainer}>
          {[1, 2, 3, 4].map((s) => (
            <React.Fragment key={s}>
              <View style={[
                styles.progressDot,
                step === s && styles.progressDotActive,
                step > s && styles.progressDotCompleted
              ]}>
                {step > s ? <Check size={12} color="#000" /> : <Text style={[styles.progressDotText, step === s && styles.progressDotTextActive]}>{s}</Text>}
              </View>
              {s < 4 && <View style={[styles.progressLine, step > s && styles.progressLineCompleted]} />}
            </React.Fragment>
          ))}
        </View>
      )}

      <ScrollView contentContainerStyle={styles.scrollContent} keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
        {paymentSuccess !== null ? (
          // Vista de Comprobante / Voucher
          <View style={styles.voucherContainer}>
            {paymentSuccess ? (
              <View style={styles.voucherCard}>
                <View style={styles.voucherSuccessIcon}>
                  <Check size={36} color="#000" />
                </View>
                <Text style={styles.voucherTitle}>¡Reserva Confirmada!</Text>
                <Text style={styles.voucherSubtitle}>Tu abono de garantía fue procesado con éxito.</Text>

                <View style={styles.divider} />

                <View style={styles.infoGroup}>
                  <Text style={styles.infoLabel}>Artista</Text>
                  <Text style={styles.infoValue}>{artist.name}</Text>
                </View>

                <View style={styles.infoGroup}>
                  <Text style={styles.infoLabel}>Servicio</Text>
                  <Text style={styles.infoValue}>{activeService?.name} ({activeService?.size})</Text>
                </View>

                <View style={styles.infoGroup}>
                  <Text style={styles.infoLabel}>Fecha y Hora</Text>
                  <Text style={styles.infoValue}>{selectedDate} a las {selectedTime} hrs</Text>
                </View>

                <View style={styles.infoGroup}>
                  <Text style={styles.infoLabel}>Código Autorización</Text>
                  <Text style={styles.infoValue}>{authCode}</Text>
                </View>

                <View style={styles.infoGroup}>
                  <Text style={styles.infoLabel}>ID Transacción</Text>
                  <Text style={styles.infoValue}>{transactionId}</Text>
                </View>

                <View style={styles.infoGroup}>
                  <Text style={styles.infoLabel}>Monto Abonado</Text>
                  <Text style={styles.infoValue}>${activeService?.deposit.toLocaleString('es-CL')} CLP</Text>
                </View>

                <View style={styles.divider} />

                <Text style={styles.voucherFooter}>
                  Por favor llega 10 minutos antes. Recuerda llevar tu carnet de identidad.
                </Text>

                <TouchableOpacity style={styles.finishButton} onPress={onBack}>
                  <Printer size={16} color="#000" style={{ marginRight: 6 }} />
                  <Text style={styles.finishButtonText}>Finalizar</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <View style={styles.voucherCard}>
                <View style={[styles.voucherSuccessIcon, { backgroundColor: '#ef4444' }]}>
                  <Text style={{ fontSize: 24, fontWeight: 'bold', color: '#fff' }}>X</Text>
                </View>
                <Text style={styles.voucherTitle}>Pago Fallido</Text>
                <Text style={styles.voucherSubtitle}>No pudimos procesar tu abono de garantía.</Text>
                <TouchableOpacity style={styles.retryButton} onPress={() => setPaymentSuccess(null)}>
                  <Text style={styles.retryButtonText}>Reintentar Pago</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        ) : (
          <View style={styles.stepContainer}>
            {/* Paso 1: Seleccionar Servicio */}
            {step === 1 && (
              <View>
                <Text style={styles.stepTitle}>1. Elige el tamaño del tatuaje</Text>
                <View style={styles.serviceList}>
                  {services.map((service) => {
                    const isSelected = selectedService === service.id;
                    return (
                      <TouchableOpacity
                        key={service.id}
                        style={[styles.serviceCard, isSelected && styles.serviceCardSelected]}
                        onPress={() => setSelectedService(service.id)}
                      >
                        <View style={styles.serviceRow}>
                          <Text style={[styles.serviceName, isSelected && styles.serviceNameSelected]}>{service.name}</Text>
                          <Text style={styles.serviceSize}>{service.size}</Text>
                        </View>
                        <View style={styles.priceRow}>
                          <Text style={styles.priceLabel}>Valor aproximado: <Text style={styles.whiteText}>${service.price.toLocaleString('es-CL')}</Text></Text>
                          <Text style={styles.depositLabel}>Abono requerido: <Text style={styles.primaryText}>${service.deposit.toLocaleString('es-CL')}</Text></Text>
                        </View>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>
            )}

            {/* Paso 2: Seleccionar Fecha y Hora */}
            {step === 2 && (
              <View>
                <Text style={styles.stepTitle}>2. Selecciona fecha y hora</Text>

                <Text style={styles.subLabel}>Días disponibles</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.daysScroll}>
                  {dates.map((d) => {
                    const isSelected = selectedDate === d.raw;
                    return (
                      <TouchableOpacity
                        key={d.raw}
                        style={[styles.dayCard, isSelected && styles.dayCardSelected]}
                        onPress={() => setSelectedDate(d.raw)}
                      >
                        <Text style={[styles.dayName, isSelected && styles.dayNameSelected]}>{d.dayName}</Text>
                        <Text style={[styles.dayNumber, isSelected && styles.dayNumberSelected]}>{d.dayNumber}</Text>
                        <Text style={[styles.dayMonth, isSelected && styles.dayMonthSelected]}>{d.month}</Text>
                      </TouchableOpacity>
                    );
                  })}
                </ScrollView>

                <Text style={styles.subLabel}>Bloques horarios</Text>
                <View style={styles.timeSlotsGrid}>
                  {timeSlots.map((time) => {
                    const isSelected = selectedTime === time;
                    return (
                      <TouchableOpacity
                        key={time}
                        style={[styles.timeSlotCard, isSelected && styles.timeSlotCardSelected]}
                        onPress={() => setSelectedTime(time)}
                      >
                        <Clock size={12} color={isSelected ? '#000' : '#888'} style={{ marginRight: 4 }} />
                        <Text style={[styles.timeSlotText, isSelected && styles.timeSlotTextSelected]}>{time}</Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>
            )}

            {/* Paso 3: Datos de contacto y descripción de la idea */}
            {step === 3 && (
              <View>
                <Text style={styles.stepTitle}>3. Ingresa tu información</Text>

                <View style={styles.form}>
                  <View style={styles.formGroup}>
                    <Text style={styles.inputLabel}>Tu Nombre Completo *</Text>
                    <TextInput
                      style={styles.formInput}
                      placeholder="Ej: Juan Pérez"
                      placeholderTextColor="#555"
                      value={clientName}
                      onChangeText={setClientName}
                    />
                  </View>

                  <View style={styles.formGroup}>
                    <Text style={styles.inputLabel}>Número de Contacto (WhatsApp) *</Text>
                    <TextInput
                      style={styles.formInput}
                      placeholder="Ej: +56912345678"
                      placeholderTextColor="#555"
                      value={clientPhone}
                      onChangeText={setClientPhone}
                      keyboardType="phone-pad"
                    />
                  </View>

                  <View style={styles.formGroup}>
                    <Text style={styles.inputLabel}>Cuéntanos tu idea (Estilo, zona, colores) *</Text>
                    <TextInput
                      style={[styles.formInput, styles.textArea]}
                      placeholder="Describe lo que te quieres tatuar y en qué parte del cuerpo..."
                      placeholderTextColor="#555"
                      multiline
                      numberOfLines={4}
                      value={clientIdea}
                      onChangeText={setClientIdea}
                    />
                  </View>
                </View>
              </View>
            )}

            {/* Paso 4: Pago en pasarela simulada */}
            {step === 4 && (
              <View style={styles.webpayCard}>
                <View style={styles.webpayHeader}>
                  <Image source={{ uri: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?q=80&w=200&auto=format&fit=crop' }} style={styles.webpayLogo} />
                  <Text style={styles.webpayHeaderText}>PAGO SEGURO WEBPAY PLUS</Text>
                </View>

                <View style={styles.webpayDetails}>
                  <Text style={styles.webpayDesc}>Simulador de Pasarela Transbank</Text>
                  
                  <View style={styles.webpayDivider} />
                  
                  <View style={styles.webpayRow}>
                    <Text style={styles.webpayLabel}>Comercio:</Text>
                    <Text style={styles.webpayValue}>Black Ink Tattoo Studio</Text>
                  </View>
                  <View style={styles.webpayRow}>
                    <Text style={styles.webpayLabel}>Monto Abono:</Text>
                    <Text style={[styles.webpayValue, { fontWeight: 'bold', color: '#22c55e' }]}>${activeService?.deposit.toLocaleString('es-CL')} CLP</Text>
                  </View>

                  <View style={styles.webpayDivider} />

                  {isPaying ? (
                    <View style={styles.payingContainer}>
                      <ActivityIndicator size="large" color="#ffffff" />
                      <Text style={styles.payingText}>Conectando con Transbank...</Text>
                    </View>
                  ) : (
                    <View style={{ gap: 12, marginTop: 12 }}>
                      <TouchableOpacity 
                        style={[styles.webpayBtn, styles.webpaySuccessBtn]}
                        onPress={() => handleSimulatePayment(true)}
                      >
                        <ShieldCheck size={16} color="#fff" style={{ marginRight: 6 }} />
                        <Text style={styles.webpayBtnText}>Simular Transacción Exitosa</Text>
                      </TouchableOpacity>

                      <TouchableOpacity 
                        style={[styles.webpayBtn, styles.webpayFailBtn]}
                        onPress={() => handleSimulatePayment(false)}
                      >
                        <AlertCircle size={16} color="#fff" style={{ marginRight: 6 }} />
                        <Text style={styles.webpayBtnText}>Simular Transacción Rechazada</Text>
                      </TouchableOpacity>
                    </View>
                  )}
                </View>
              </View>
            )}

            {/* Botón de Siguiente para los pasos 1, 2 y 3 */}
            {step < 4 && (
              <TouchableOpacity style={styles.nextButton} onPress={handleNextStep}>
                <Text style={styles.nextButtonText}>Continuar</Text>
              </TouchableOpacity>
            )}
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    height: 56,
    borderBottomWidth: 1,
    borderColor: '#111',
    backgroundColor: '#000',
  },
  backButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    flex: 1,
    textAlign: 'center',
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    backgroundColor: '#09090b',
    borderBottomWidth: 1,
    borderColor: '#111',
  },
  progressDot: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#222',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#333',
  },
  progressDotActive: {
    backgroundColor: '#fff',
    borderColor: '#fff',
  },
  progressDotCompleted: {
    backgroundColor: '#fff',
    borderColor: '#fff',
  },
  progressDotText: {
    fontSize: 11,
    color: '#888',
    fontWeight: 'bold',
  },
  progressDotTextActive: {
    color: '#000',
  },
  progressLine: {
    width: 30,
    height: 2,
    backgroundColor: '#222',
    marginHorizontal: 4,
  },
  progressLineCompleted: {
    backgroundColor: '#fff',
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 60,
  },
  stepContainer: {
    flex: 1,
  },
  stepTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 16,
  },
  serviceList: {
    gap: 12,
  },
  serviceCard: {
    backgroundColor: '#121212',
    borderWidth: 1,
    borderColor: '#222',
    borderRadius: 16,
    padding: 16,
  },
  serviceCardSelected: {
    borderColor: '#fff',
    backgroundColor: '#1c1c1c',
  },
  serviceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  serviceName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#aaa',
  },
  serviceNameSelected: {
    color: '#fff',
  },
  serviceSize: {
    fontSize: 11,
    color: '#888',
    backgroundColor: '#1e1e1e',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  priceRow: {
    borderTopWidth: 1,
    borderColor: '#222',
    paddingTop: 8,
    gap: 4,
  },
  priceLabel: {
    fontSize: 12,
    color: '#666',
  },
  depositLabel: {
    fontSize: 12,
    color: '#666',
  },
  whiteText: {
    color: '#fff',
    fontWeight: '600',
  },
  primaryText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  subLabel: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#888',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginTop: 16,
    marginBottom: 10,
  },
  daysScroll: {
    gap: 10,
    paddingBottom: 8,
  },
  dayCard: {
    width: 64,
    height: 80,
    borderRadius: 12,
    backgroundColor: '#121212',
    borderWidth: 1,
    borderColor: '#222',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
  },
  dayCardSelected: {
    backgroundColor: '#fff',
    borderColor: '#fff',
  },
  dayName: {
    fontSize: 10.5,
    color: '#666',
    textTransform: 'uppercase',
    fontWeight: '600',
  },
  dayNameSelected: {
    color: '#444',
  },
  dayNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  dayNumberSelected: {
    color: '#000',
  },
  dayMonth: {
    fontSize: 10.5,
    color: '#666',
    textTransform: 'uppercase',
  },
  dayMonthSelected: {
    color: '#444',
  },
  timeSlotsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    marginTop: 4,
  },
  timeSlotCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '31%',
    height: 38,
    borderRadius: 8,
    backgroundColor: '#121212',
    borderWidth: 1,
    borderColor: '#222',
  },
  timeSlotCardSelected: {
    backgroundColor: '#fff',
    borderColor: '#fff',
  },
  timeSlotText: {
    fontSize: 13,
    color: '#aaa',
    fontWeight: '600',
  },
  timeSlotTextSelected: {
    color: '#000',
    fontWeight: 'bold',
  },
  form: {
    gap: 16,
  },
  formGroup: {
    gap: 8,
  },
  inputLabel: {
    fontSize: 13.5,
    color: '#ccc',
    fontWeight: '600',
  },
  formInput: {
    backgroundColor: '#121212',
    borderWidth: 1,
    borderColor: '#222',
    borderRadius: 10,
    paddingHorizontal: 12,
    height: 44,
    color: '#fff',
    fontSize: 14.5,
  },
  textArea: {
    height: 100,
    paddingTop: 10,
    textAlignVertical: 'top',
  },
  nextButton: {
    height: 48,
    backgroundColor: '#fff',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 24,
  },
  nextButtonText: {
    color: '#000',
    fontSize: 15,
    fontWeight: 'bold',
  },
  webpayCard: {
    backgroundColor: '#121212',
    borderWidth: 1,
    borderColor: '#222',
    borderRadius: 20,
    overflow: 'hidden',
  },
  webpayHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#09090b',
    borderBottomWidth: 1,
    borderColor: '#222',
    gap: 10,
  },
  webpayLogo: {
    width: 28,
    height: 28,
    borderRadius: 6,
  },
  webpayHeaderText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#fff',
    letterSpacing: 1,
  },
  webpayDetails: {
    padding: 20,
  },
  webpayDesc: {
    fontSize: 14,
    color: '#aaa',
    textAlign: 'center',
    marginBottom: 16,
  },
  webpayDivider: {
    height: 1,
    backgroundColor: '#222',
    marginVertical: 12,
  },
  webpayRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 4,
  },
  webpayLabel: {
    fontSize: 13,
    color: '#888',
  },
  webpayValue: {
    fontSize: 13.5,
    color: '#fff',
  },
  payingContainer: {
    paddingVertical: 20,
    alignItems: 'center',
    gap: 10,
  },
  payingText: {
    color: '#aaa',
    fontSize: 12.5,
  },
  webpayBtn: {
    height: 42,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  webpaySuccessBtn: {
    backgroundColor: '#22c55e',
  },
  webpayFailBtn: {
    backgroundColor: '#ef4444',
  },
  webpayBtnText: {
    color: '#fff',
    fontSize: 13.5,
    fontWeight: 'bold',
  },
  voucherContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
  },
  voucherCard: {
    backgroundColor: '#121212',
    borderWidth: 1,
    borderColor: '#222',
    borderRadius: 24,
    padding: 24,
    width: '100%',
    alignItems: 'center',
  },
  voucherSuccessIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#22c55e',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  voucherTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  voucherSubtitle: {
    fontSize: 12.5,
    color: '#888',
    textAlign: 'center',
    marginBottom: 20,
  },
  divider: {
    height: 1,
    width: '100%',
    backgroundColor: '#222',
    marginVertical: 16,
  },
  infoGroup: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 6,
  },
  infoLabel: {
    fontSize: 12,
    color: '#666',
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  infoValue: {
    fontSize: 13.5,
    color: '#fff',
    fontWeight: '600',
  },
  voucherFooter: {
    fontSize: 11,
    color: '#555',
    textAlign: 'center',
    lineHeight: 16,
    marginBottom: 24,
    paddingHorizontal: 10,
  },
  finishButton: {
    width: '100%',
    height: 44,
    backgroundColor: '#fff',
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  finishButtonText: {
    color: '#000',
    fontSize: 14.5,
    fontWeight: 'bold',
  },
  retryButton: {
    width: '80%',
    height: 40,
    backgroundColor: '#ef4444',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
});

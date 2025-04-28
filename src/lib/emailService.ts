import { SwapRequestEmail } from '../emails/SwapRequestEmail';
import { render } from '@react-email/render';

export interface SwapRequestEmailData {
  swapId: string;
  fromEmployee: string;
  toEmployee: string;
  fromShift: string;
  toShift: string;
  date: string;
}

export async function sendSwapRequestEmail(data: SwapRequestEmailData) {
  try {
    console.log('Iniziando invio email con dati:', data);
    
    // Usa l'URL corrente invece di localhost
    const baseUrl = window.location.origin;
    console.log('Base URL:', baseUrl);

    // Renderizza il template email
    const emailHtml = await render(
      SwapRequestEmail({
        swapId: data.swapId,
        requesterName: data.fromEmployee,
        requestedName: data.toEmployee,
        requesterShift: data.fromShift,
        requestedShift: data.toShift,
        baseUrl: baseUrl,
      })
    );
    console.log('Email template renderizzato');

    // Invia l'email usando Resend tramite una funzione serverless
    const response = await fetch('/api/send-email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        to: 'saxarubra915@gmail.com',
        subject: 'Richiesta di autorizzazione scambio turno',
        html: emailHtml,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`Errore nell'invio dell'email: ${error.message}`);
    }

    console.log('Email inviata con successo');
    return { success: true };
  } catch (error) {
    console.error('Errore nell\'invio dell\'email:', error);
    throw error;
  }
} 
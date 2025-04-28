import { render } from '@react-email/render';
import { LPChangeRequestEmail } from '../components/EmailTemplates/LPChangeRequest';
import { sendEmail } from './emailService';
import { supabase } from './supabaseClient';

export interface LPChangeRequest {
  id?: string;
  user_id: string;
  current_lp: string;
  requested_lp: string;
  email: string;
  name: string;
  status: 'pending' | 'approved' | 'rejected';
  created_at?: string;
}

export async function requestLPChange(userId: string, requestedLP: string): Promise<void> {
  try {
    // Get user data
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();

    if (userError) throw userError;

    // Check if user already has a pending request
    const { data: existingRequest } = await supabase
      .from('lp_change_requests')
      .select('*')
      .eq('user_id', userId)
      .eq('status', 'pending')
      .single();

    if (existingRequest) {
      throw new Error('Hai già una richiesta di cambio LP in sospeso');
    }

    // Create new request
    const { data: newRequest, error } = await supabase
      .from('lp_change_requests')
      .insert([{
        user_id: userId,
        current_lp: userData.lp,
        requested_lp: requestedLP,
        email: userData.email,
        name: userData.name,
        status: 'pending'
      }])
      .select()
      .single();

    if (error) throw error;

    // Send notification email
    const emailHtml = render(
      LPChangeRequestEmail({
        userName: userData.name,
        currentLP: userData.lp,
        requestedLP: requestedLP,
        requestId: newRequest.id
      })
    );

    await sendEmail({
      to: 'saxarubra915@gmail.com',
      subject: `Nuova richiesta di cambio LP da ${userData.name}`,
      html: emailHtml
    });
  } catch (error) {
    console.error('Error requesting LP change:', error);
    throw error;
  }
}

export async function getLPChangeRequests(userId: string): Promise<LPChangeRequest[]> {
  try {
    const { data, error } = await supabase
      .from('lp_change_requests')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;

    return data || [];
  } catch (error) {
    console.error('Error fetching LP change requests:', error);
    return [];
  }
}

export const handleLPChangeResponse = async (
  requestId: string,
  response: 'accept' | 'deny'
) => {
  try {
    // 1. Aggiorna lo stato della richiesta
    const { data: request, error: updateError } = await supabase
      .from('lp_change_requests')
      .update({ status: response === 'accept' ? 'approved' : 'rejected' })
      .eq('id', requestId)
      .select()
      .single();

    if (updateError) throw updateError;

    // 2. Se accettata, invia email di conferma
    if (response === 'accept') {
      await sendEmail({
        to: request.email,
        subject: 'La tua richiesta di cambio LP è stata accettata',
        html: `
          <h2>Richiesta Accettata</h2>
          <p>La tua richiesta di cambio da ${request.current_lp} a ${request.requested_lp} è stata accettata.</p>
        `
      });
    } else {
      // Se rifiutata, invia email di notifica
      await sendEmail({
        to: request.email,
        subject: 'La tua richiesta di cambio LP è stata rifiutata',
        html: `
          <h2>Richiesta Rifiutata</h2>
          <p>Ci dispiace, ma la tua richiesta di cambio da ${request.current_lp} a ${request.requested_lp} è stata rifiutata.</p>
        `
      });
    }

    return { success: true, data: request };
  } catch (error) {
    console.error('Error in handleLPChangeResponse:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Si è verificato un errore durante la gestione della richiesta' 
    };
  }
}; 
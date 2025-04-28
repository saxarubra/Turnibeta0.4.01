import { Resend } from 'resend';

const resend = new Resend(import.meta.env.VITE_RESEND_API_KEY);

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
}

export const sendEmail = async ({ to, subject, html }: EmailOptions) => {
  try {
    console.log('Sending email to:', to);
    console.log('Subject:', subject);
    
    const response = await fetch('/api/send-email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ to, subject, html }),
    });

    console.log('Response status:', response.status);
    
    let responseData;
    const text = await response.text();
    try {
      responseData = JSON.parse(text);
    } catch (e) {
      console.error('Failed to parse response:', text);
      throw new Error('Invalid JSON response from server');
    }
    
    console.log('Response data:', responseData);

    if (!response.ok) {
      console.error('Error response:', responseData);
      return { 
        success: false, 
        error: responseData.error || 'Unknown error occurred',
        details: responseData
      };
    }

    return { success: true, data: responseData };
  } catch (error) {
    console.error('Exception in sendEmail:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error occurred',
      details: error
    };
  }
}; 
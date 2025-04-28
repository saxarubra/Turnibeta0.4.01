import { Resend } from 'resend';
import express from 'express';

const router = express.Router();

// Log the API key (first few characters) to verify it's being loaded
const apiKey = process.env.RESEND_API_KEY || process.env.VITE_RESEND_API_KEY;
console.log('Resend API Key loaded:', apiKey ? `${apiKey.substring(0, 5)}...` : 'NOT FOUND');

const resend = new Resend(apiKey);

router.post('/send-email', async (req, res) => {
  console.log('API endpoint called with method:', req.method);
  
  try {
    console.log('Request body:', req.body);
    const { to, subject, html } = req.body;

    if (!to || !subject || !html) {
      console.error('Missing required fields:', { to, subject, html: html ? 'present' : 'missing' });
      return res.status(400).json({ 
        error: 'Missing required fields',
        details: {
          to: !to ? 'missing' : 'present',
          subject: !subject ? 'missing' : 'present',
          html: !html ? 'missing' : 'present'
        }
      });
    }

    console.log('Sending email to:', to);
    console.log('Subject:', subject);
    
    const data = await resend.emails.send({
      from: process.env.VITE_EMAIL_FROM || 'noreply@yourdomain.com',
      to,
      subject,
      html,
    });

    console.log('Email sent successfully:', data);
    return res.status(200).json(data);
  } catch (error) {
    console.error('Error in API endpoint:', error);
    return res.status(500).json({ 
      error: error instanceof Error ? error.message : 'Unknown error occurred',
      details: error
    });
  }
});

export default router; 
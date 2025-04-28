import { Resend } from 'resend';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Log the API key (first few characters) to verify it's being loaded
const apiKey = process.env.RESEND_API_KEY || process.env.VITE_RESEND_API_KEY;
console.log('Resend API Key loaded:', apiKey ? `${apiKey.substring(0, 5)}...` : 'NOT FOUND');

const resend = new Resend(apiKey);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { to, subject, html } = req.body;

    if (!to || !subject || !html) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const data = await resend.emails.send({
      from: process.env.VITE_EMAIL_FROM || 'noreply@yourdomain.com',
      to,
      subject,
      html,
    });

    return res.status(200).json(data);
  } catch (error) {
    console.error('Error sending email:', error);
    return res.status(500).json({ error: error.message });
  }
} 
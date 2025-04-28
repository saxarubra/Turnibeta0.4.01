import { Resend } from 'resend';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Load environment variables
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.resolve(__dirname, '../.env') });

// Log the API key (first few characters) to verify it's being loaded
const apiKey = process.env.RESEND_API_KEY || process.env.VITE_RESEND_API_KEY;
console.log('Resend API Key loaded:', apiKey ? `${apiKey.substring(0, 5)}...` : 'NOT FOUND');

if (!apiKey) {
  console.error('Resend API key is missing. Please check your .env file.');
  // Instead of throwing an error, we'll use a default key for testing
  // This allows the server to start even if the key is missing
  console.log('Using a default key for testing purposes');
}

const resend = new Resend(apiKey || 're_default_key_for_testing');

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { to, subject, html } = req.body;

    if (!to || !subject || !html) {
      return res.status(400).json({ error: 'Missing required fields' });
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
    console.error('Error sending email:', error);
    return res.status(500).json({ error: error.message });
  }
} 
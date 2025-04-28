import { render } from '@react-email/render';
import { WelcomeEmail } from '../components/email-templates/WelcomeEmail';
import { sendEmail } from './emailService';

interface SendWelcomeEmailParams {
  to: string;
  userName: string;
  verificationLink?: string;
}

export const sendWelcomeEmail = async ({
  to,
  userName,
  verificationLink,
}: SendWelcomeEmailParams) => {
  const emailHtml = render(
    WelcomeEmail({
      userName,
      verificationLink,
    })
  );

  return sendEmail({
    to,
    subject: 'Welcome to Turni! 🎉',
    html: emailHtml,
  });
}; 
import React from 'react';
import { BaseEmail } from './BaseEmail';

interface WelcomeEmailProps {
  userName: string;
  verificationLink?: string;
}

export const WelcomeEmail: React.FC<WelcomeEmailProps> = ({
  userName,
  verificationLink,
}) => {
  return (
    <BaseEmail title="Welcome to Turni!">
      <div style={{ color: '#374151', lineHeight: '1.6' }}>
        <p>Hello {userName},</p>
        
        <p>Welcome to Turni! We're excited to have you on board. With Turni, you can:</p>
        
        <ul style={{ marginLeft: '20px', marginBottom: '20px' }}>
          <li>Manage your shifts efficiently</li>
          <li>Coordinate with your team</li>
          <li>Track your work hours</li>
          <li>Access your schedule from anywhere</li>
        </ul>

        {verificationLink && (
          <div style={{ marginBottom: '20px' }}>
            <p>Please verify your email address by clicking the link below:</p>
            <a
              href={verificationLink}
              style={{
                display: 'inline-block',
                padding: '12px 24px',
                backgroundColor: '#4F46E5',
                color: 'white',
                textDecoration: 'none',
                borderRadius: '6px',
                marginTop: '10px'
              }}
            >
              Verify Email Address
            </a>
          </div>
        )}

        <p>If you have any questions or need assistance, don't hesitate to reach out to our support team.</p>
        
        <p>Best regards,<br />The Turni Team</p>
      </div>
    </BaseEmail>
  );
}; 